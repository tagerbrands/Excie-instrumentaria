import * as XLSX from 'xlsx';
import { InterviewData, CATEGORIES, createEmptyThemeResponse, ENTITY_THEMES } from '../types';
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
            vragenBorgenKwaliteit: row['Slot - Welke vragen heeft u nog?'] || ''
          };

          CATEGORIES.forEach(cat => {
             interview[cat.key] = [];
             
             // Iterate through the predefined themes for this category
             const themesForCat = ENTITY_THEMES[cat.key] || [];
             
             themesForCat.forEach((theme) => {
                 const prefix = `${cat.label} - ${theme.theme}`;
                 
                 const inst = createEmptyThemeResponse(theme.theme);
                 inst.answerSets[0].infoGebruik = row[`${prefix} - Welke info gebruik je?`] || row[`${prefix} - i. Welke info gebruik je?`] || '';
                 inst.answerSets[0].infoBron = row[`${prefix} - Hoe kom je aan info?`] || row[`${prefix} - ii. Hoe kom je aan info?`] || '';
                 inst.answerSets[0].opbrengst = row[`${prefix} - Wat levert dat op?`] || row[`${prefix} - iii. Wat levert dat op?`] || '';
                 inst.answerSets[0].actie = row[`${prefix} - Wat doe je ermee?`] || row[`${prefix} - iv. Wat doe je ermee?`] || '';
                 inst.answerSets[0].delenOptIn = row[`${prefix} - Opt-in Delen?`] || (row[`${prefix} - v. Heb je iets te delen?`] ? 'Ja' : '');
                 inst.answerSets[0].delen = row[`${prefix} - Heb je iets te delen?`] || row[`${prefix} - v. Heb je iets te delen?`] || '';
                 
                 interview[cat.key].push(inst);
             });
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
