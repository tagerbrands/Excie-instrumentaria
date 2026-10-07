import * as XLSX from 'xlsx';
import { InterviewData, CATEGORIES, AnswerSet, createEmptyAnswerSet } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Helper to match category strings flexibly
const matchCategoryKey = (catStr: string): keyof InterviewData | null => {
  if (!catStr) return null;
  const norm = catStr.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (norm.includes('beleid')) return 'toetsbeleid';
  if (norm.includes('organisatie')) return 'toetsorganisatie';
  if (norm.includes('bekwaam')) return 'toetsbekwaamheid';
  if (norm.includes('taak') || norm.includes('taken') || norm.includes('toetsen')) return 'toetsTaken';
  if (norm.includes('programma')) return 'toetsprogramma';

  for (const cat of CATEGORIES) {
    const catNorm = cat.key.toLowerCase().replace(/[^a-z0-9]/g, '');
    const labelNorm = cat.label.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (catNorm === norm || labelNorm === norm) {
      return cat.key as keyof InterviewData;
    }
  }
  return null;
};

// Helper to normalize Yes/No fields
const normalizeYesNo = (val: any): 'Ja' | 'Nee' | '' => {
  if (val === undefined || val === null) return '';
  const s = String(val).trim().toLowerCase();
  if (s === 'ja' || s === 'yes' || s === 'true') return 'Ja';
  if (s === 'nee' || s === 'no' || s === 'false') return 'Nee';
  return '';
};

// Helper to format Excel serial dates or strings to YYYY-MM-DD
const formatExcelDate = (val: any): string => {
  if (!val) return '';
  if (typeof val === 'number') {
    try {
      const date = new Date(Math.round((val - 25569) * 86400 * 1000));
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch {
      // ignore
    }
  }
  return String(val).trim();
};

const getRowValue = (row: any, ...keys: string[]): string => {
  if (!row) return '';
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') {
      return String(row[k]).trim();
    }
  }
  return '';
};

const getGroupValue = (group: any[], ...keys: string[]): string => {
  for (const row of group) {
    const val = getRowValue(row, ...keys);
    if (val) return val;
  }
  return '';
};

export const importFromExcel = (file: File): Promise<InterviewData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames.find(n => n.toLowerCase() === 'interviews') || workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          resolve([]);
          return;
        }

        const json = XLSX.utils.sheet_to_json<any>(worksheet, { defval: '' });
        if (!json || json.length === 0) {
          resolve([]);
          return;
        }

        // Determine if sheet is in normalized format (one row per set, containing 'Categorie' or 'Set Naam')
        const isNormalizedFormat = json.some(row =>
          row.hasOwnProperty('Categorie') ||
          row.hasOwnProperty('categorie') ||
          row.hasOwnProperty('Category') ||
          row.hasOwnProperty('Set Naam') ||
          row.hasOwnProperty('Set naam') ||
          row.hasOwnProperty('Setnaam')
        );

        if (isNormalizedFormat) {
          // Group rows belonging to the same interview
          const groups: any[][] = [];
          const groupById = new Map<string, any[]>();
          let currentGroup: any[] | null = null;
          let lastExcie = '';
          let lastDatum = '';

          for (const row of json) {
            const rowId = getRowValue(row, 'ID', 'id');
            const rowExcie = getRowValue(row, 'Excie', 'excie', 'Opleiding');
            const rowDatum = formatExcelDate(getRowValue(row, 'Datum', 'datum'));

            if (rowId) {
              if (groupById.has(rowId)) {
                groupById.get(rowId)!.push(row);
              } else {
                const newGroup = [row];
                groupById.set(rowId, newGroup);
                groups.push(newGroup);
              }
              currentGroup = null;
            } else {
              // Group rows without explicit ID: check if starting a new interview
              const startsNew =
                !currentGroup ||
                (rowExcie && rowExcie !== lastExcie) ||
                (rowDatum && rowDatum !== lastDatum && rowExcie);

              if (startsNew) {
                currentGroup = [row];
                groups.push(currentGroup);
                lastExcie = rowExcie;
                lastDatum = rowDatum;
              } else {
                currentGroup.push(row);
              }
            }
          }

          const result: InterviewData[] = groups.map(group => {
            const rawId = getGroupValue(group, 'ID', 'id');
            const excie = getGroupValue(group, 'Excie', 'excie', 'Opleiding', 'Naam excie');
            const datum = formatExcelDate(getGroupValue(group, 'Datum', 'datum'));
            const cveLid = getGroupValue(group, 'CvE-lid', 'CvE - lid', 'CvE lid', 'cveLid', 'cve');

            const ovRaw = getGroupValue(group, 'Onderwijsvorm', 'onderwijsvorm');
            let onderwijsvorm: string[] = [];
            let onderwijsvormOpmerkingen = '';

            if (ovRaw) {
              const parenIdx = ovRaw.indexOf('(');
              if (parenIdx !== -1 && ovRaw.endsWith(')')) {
                const mainPart = ovRaw.substring(0, parenIdx).trim();
                onderwijsvormOpmerkingen = ovRaw.substring(parenIdx + 1, ovRaw.length - 1).trim();
                onderwijsvorm = mainPart.split(',').map(s => s.trim()).filter(Boolean);
              } else {
                onderwijsvorm = ovRaw.split(',').map(s => s.trim()).filter(Boolean);
              }
            }
            if (!onderwijsvormOpmerkingen) {
              onderwijsvormOpmerkingen = getGroupValue(group, 'Onderwijsvorm Opmerkingen', 'Onderwijsvorm toelichting', 'onderwijsvormOpmerkingen');
            }

            const doelExcie = getGroupValue(group, 'Belangrijkste doel excie', 'Doel excie', 'doelExcie');
            const drieDoelen = getGroupValue(group, 'Welke 3 doelen centraal', 'Welke drie doelen centraal', 'Drie doelen', 'drieDoelen');
            const borgingsagenda = normalizeYesNo(getGroupValue(group, 'Borgingsagenda/-kalender', 'Borgingsagenda/kalender', 'Borgingsagenda', 'borgingsagenda'));
            const borgingsagendaDelen = normalizeYesNo(getGroupValue(group, 'Borgingsagenda Delen', 'Borgingsagenda delen', 'borgingsagendaDelen'));
            const modelKader = getGroupValue(group, 'Model of kader', 'Model/kader', 'modelKader');

            const verdereInstrumenten = getGroupValue(group, 'Slot - Heeft u aanvullingen?', 'Heeft u aanvullingen?', 'verdereInstrumenten');
            const eigenstandigOordeel = getGroupValue(group, 'Slot - Eigenstandig oordeel kenbaar maken', 'Eigenstandig oordeel kenbaar maken', 'eigenstandigOordeel');
            const vragenBorgenKwaliteit = getGroupValue(group, 'Slot - Welke vragen heeft u nog?', 'Welke vragen heeft u nog?', 'vragenBorgenKwaliteit');

            const isAnalysis = getGroupValue(group, 'Is Analyse', 'isAnalysis') === 'Ja';
            const analysisTitle = getGroupValue(group, 'Analyse Titel', 'analysisTitle') || undefined;

            const categorySets: Record<string, AnswerSet[]> = {
              toetsbeleid: [],
              toetsorganisatie: [],
              toetsbekwaamheid: [],
              toetsTaken: [],
              toetsprogramma: [],
            };
            const categoryNotes: Record<string, string> = {};

            for (const row of group) {
              const catVal = getRowValue(row, 'Categorie', 'categorie', 'Category', 'category');
              const catKey = matchCategoryKey(catVal);

              if (catKey) {
                // Category notes
                const note = getRowValue(
                  row,
                  'Categorie Algemene Notities',
                  'Categorie algemene notities',
                  'Algemene Notities',
                  'Algemene notities',
                  'Category Notes',
                  `${catVal} - Algemene Notities`
                );
                if (note && !categoryNotes[catKey as string]) {
                  categoryNotes[catKey as string] = note;
                }

                // Set values
                const setName = getRowValue(row, 'Set Naam', 'Set naam', 'Setnaam', 'Set');
                const infoGebruik = getRowValue(row, 'Welke info gebruik je?', 'Welke informatie gebruik je?', 'Welke info gebruik je', 'Info gebruik');
                const infoBron = getRowValue(row, 'Hoe kom je aan info?', 'Hoe kom je aan die informatie?', 'Hoe kom je aan info', 'Bron(nen)', 'Bron');
                const opbrengst = getRowValue(row, 'Wat levert dat op?', 'Wat levert dat op', 'Opbrengst');
                const actie = getRowValue(row, 'Wat doe je ermee?', 'Wat doe je ermee', 'Actie');
                const delenOptIn = normalizeYesNo(getRowValue(row, 'Opt-in Delen?', 'Opt-in delen?', 'Opt-in Delen', 'Opt-in'));
                const delen = getRowValue(row, 'Heb je iets te delen?', 'Heb je iets te delen', 'Delen');
                const synthese = getRowValue(row, 'Synthese (Analyse)', 'Synthese');

                const hasSetData = !!(setName || infoGebruik || infoBron || opbrengst || actie || delenOptIn || delen || synthese);

                if (hasSetData) {
                  const currentCount = categorySets[catKey as string]?.length || 0;
                  const inst: AnswerSet = {
                    id: uuidv4(),
                    setName: setName || `Set ${currentCount + 1}`,
                    infoGebruik,
                    infoBron,
                    opbrengst,
                    actie,
                    delenOptIn,
                    delen,
                    synthese: synthese || undefined
                  };
                  if (!categorySets[catKey as string]) {
                    categorySets[catKey as string] = [];
                  }
                  categorySets[catKey as string].push(inst);
                }
              }
            }

            // Ensure every category has at least one default set if none were found
            CATEGORIES.forEach(cat => {
              if (!categorySets[cat.key] || categorySets[cat.key].length === 0) {
                categorySets[cat.key] = [createEmptyAnswerSet('Set 1')];
              }
            });

            const interview: InterviewData = {
              id: rawId || uuidv4(),
              lastUpdated: new Date().toISOString(),
              isAnalysis: isAnalysis || undefined,
              analysisTitle,
              excie,
              datum,
              cveLid,
              onderwijsvorm,
              onderwijsvormOpmerkingen,
              doelExcie,
              drieDoelen,
              borgingsagenda,
              borgingsagendaDelen,
              modelKader,
              verdereInstrumenten,
              eigenstandigOordeel,
              vragenBorgenKwaliteit,
              categoryNotes,
              toetsbeleid: categorySets.toetsbeleid,
              toetsorganisatie: categorySets.toetsorganisatie,
              toetsbekwaamheid: categorySets.toetsbekwaamheid,
              toetsTaken: categorySets.toetsTaken,
              toetsprogramma: categorySets.toetsprogramma
            };

            return interview;
          });

          resolve(result);
        } else {
          // Legacy wide-format fallback
          const result: InterviewData[] = json.map(row => {
            const rawId = getRowValue(row, 'ID', 'id');
            const excie = getRowValue(row, 'Excie', 'excie', 'Opleiding');
            const datum = formatExcelDate(getRowValue(row, 'Datum', 'datum'));
            const cveLid = getRowValue(row, 'CvE-lid', 'CvE - lid', 'cveLid');

            const ovRaw = getRowValue(row, 'Onderwijsvorm', 'onderwijsvorm');
            let onderwijsvorm: string[] = [];
            let onderwijsvormOpmerkingen = '';
            if (ovRaw) {
              const parenIdx = ovRaw.indexOf('(');
              if (parenIdx !== -1 && ovRaw.endsWith(')')) {
                onderwijsvormOpmerkingen = ovRaw.substring(parenIdx + 1, ovRaw.length - 1).trim();
                onderwijsvorm = ovRaw.substring(0, parenIdx).split(',').map(s => s.trim()).filter(Boolean);
              } else {
                onderwijsvorm = ovRaw.split(',').map(s => s.trim()).filter(Boolean);
              }
            }

            const doelExcie = getRowValue(row, 'Belangrijkste doel excie', 'doelExcie');
            const drieDoelen = getRowValue(row, 'Welke 3 doelen centraal', 'drieDoelen');
            const borgingsagenda = normalizeYesNo(getRowValue(row, 'Borgingsagenda/-kalender', 'Borgingsagenda', 'borgingsagenda'));
            const borgingsagendaDelen = normalizeYesNo(getRowValue(row, 'Borgingsagenda Delen', 'borgingsagendaDelen'));
            const modelKader = getRowValue(row, 'Model of kader', 'modelKader');
            const verdereInstrumenten = getRowValue(row, 'Slot - Heeft u aanvullingen?', 'verdereInstrumenten');
            const eigenstandigOordeel = getRowValue(row, 'Slot - Eigenstandig oordeel kenbaar maken', 'eigenstandigOordeel');
            const vragenBorgenKwaliteit = getRowValue(row, 'Slot - Welke vragen heeft u nog?', 'vragenBorgenKwaliteit');

            const categoryNotes: Record<string, string> = {};
            const categorySets: Record<string, AnswerSet[]> = {
              toetsbeleid: [],
              toetsorganisatie: [],
              toetsbekwaamheid: [],
              toetsTaken: [],
              toetsprogramma: [],
            };

            CATEGORIES.forEach(cat => {
              const catPrefix = cat.label;
              categoryNotes[cat.key] = getRowValue(row, `${catPrefix} - Algemene Notities`, `${cat.key} - Algemene Notities`);

              const sets: AnswerSet[] = [];
              for (let s = 1; s <= 20; s++) {
                const prefix = `${catPrefix} - Set ${s}`;
                const infoGebruik = getRowValue(row, `${prefix} - Welke info gebruik je?`, `${prefix} - Welke informatie gebruik je?`);
                const infoBron = getRowValue(row, `${prefix} - Hoe kom je aan info?`, `${prefix} - Hoe kom je aan die informatie?`);
                const opbrengst = getRowValue(row, `${prefix} - Wat levert dat op?`);
                const actie = getRowValue(row, `${prefix} - Wat doe je ermee?`);
                const delenOptIn = normalizeYesNo(getRowValue(row, `${prefix} - Opt-in Delen?`));
                const delen = getRowValue(row, `${prefix} - Heb je iets te delen?`);
                const synthese = getRowValue(row, `${prefix} - Synthese`);
                const setName = getRowValue(row, `${prefix} - Naam`, `${prefix} - Set Naam`) || `Set ${s}`;

                if (infoGebruik || infoBron || opbrengst || actie || getRowValue(row, `${prefix} - Naam`)) {
                  sets.push({
                    id: uuidv4(),
                    setName,
                    infoGebruik,
                    infoBron,
                    opbrengst,
                    actie,
                    delenOptIn,
                    delen,
                    synthese: synthese || undefined
                  });
                }
              }

              categorySets[cat.key] = sets.length > 0 ? sets : [createEmptyAnswerSet('Set 1')];
            });

            return {
              id: rawId || uuidv4(),
              lastUpdated: new Date().toISOString(),
              excie,
              datum,
              cveLid,
              onderwijsvorm,
              onderwijsvormOpmerkingen,
              doelExcie,
              drieDoelen,
              borgingsagenda,
              borgingsagendaDelen,
              modelKader,
              verdereInstrumenten,
              eigenstandigOordeel,
              vragenBorgenKwaliteit,
              categoryNotes,
              toetsbeleid: categorySets.toetsbeleid,
              toetsorganisatie: categorySets.toetsorganisatie,
              toetsbekwaamheid: categorySets.toetsbekwaamheid,
              toetsTaken: categorySets.toetsTaken,
              toetsprogramma: categorySets.toetsprogramma
            };
          });

          resolve(result);
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
