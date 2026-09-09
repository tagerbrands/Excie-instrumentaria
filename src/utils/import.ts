import * as XLSX from 'xlsx';
import { InterviewData, CATEGORIES, AnswerSet } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const importFromExcel = (file: File): Promise<InterviewData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<any>(worksheet);
        
        const result: InterviewData[] = json.map(row => {
          const ovMatch = (row['Onderwijsvorm'] || '').match(/^(.*?)(?:\s*\((.*)\))?$/);
          const onderwijsvorm = ovMatch?.[1]?.split(',').map((s:string) => s.trim()).filter(Boolean) || [];
          const onderwijsvormOpmerkingen = ovMatch?.[2] || '';

          const interview: any = {
            id: row['ID'] || uuidv4(),
            lastUpdated: new Date().toISOString(),
            excie: row['Excie'] || '',
            datum: row['Datum'] || '',
            cveLid: row['CvE-lid'] || '',
            onderwijsvorm,
            onderwijsvormOpmerkingen,
            doelExcie: row['Belangrijkste doel excie'] || '',
            drieDoelen: row['Welke 3 doelen centraal'] || '',
            borgingsagenda: row['Borgingsagenda/-kalender'] || '',
            modelKader: row['Model of kader'] || '',
            verdereInstrumenten: row['Slot - Heeft u aanvullingen?'] || '',
            eigenstandigOordeel: row['Slot - Eigenstandig oordeel kenbaar maken'] || '',
            vragenBorgenKwaliteit: row['Slot - Welke vragen heeft u nog?'] || '',
            categoryNotes: {}
          };

          CATEGORIES.forEach(cat => {
             interview[cat.key] = [];
             const catPrefix = cat.label;
             
             interview.categoryNotes[cat.key] = row[`${catPrefix} - Algemene Notities`] || '';

             // Just try to import Set 1, 2, 3...
             for(let s = 1; s <= 20; s++) {
                const prefix = `${catPrefix} - Set ${s}`;
                const infoGebruik = row[`${prefix} - Welke info gebruik je?`] || '';
                const infoBron = row[`${prefix} - Hoe kom je aan info?`] || '';
                
                if (infoGebruik || infoBron || row[`${prefix} - Naam`]) {
                    const inst: AnswerSet = {
                        id: uuidv4(),
                        setName: row[`${prefix} - Naam`] || `Set ${s}`,
                        infoGebruik,
                        infoBron,
                        opbrengst: row[`${prefix} - Wat levert dat op?`] || '',
                        actie: row[`${prefix} - Wat doe je ermee?`] || '',
                        delenOptIn: row[`${prefix} - Opt-in Delen?`] || '',
                        delen: row[`${prefix} - Heb je iets te delen?`] || '',
                        synthese: row[`${prefix} - Synthese`] || ''
                    };
                    interview[cat.key].push(inst);
                }
             }
          });

          return interview as InterviewData;
        });

        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
