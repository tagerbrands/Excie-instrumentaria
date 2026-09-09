import * as XLSX from 'xlsx';
import { InterviewData, CATEGORIES, AnswerSet } from '../types';

export const exportToExcel = (interviews: InterviewData[]) => {
  const flatData: any[] = [];

  interviews.forEach(interview => {
    // Base flattening - Interview Level Meta
    const baseRow: any = {
      'ID': interview.id,
      'Excie': interview.excie,
      'Datum': interview.datum,
      'CvE-lid': interview.cveLid,
      'Onderwijsvorm': interview.onderwijsvorm.join(', ') + (interview.onderwijsvormOpmerkingen ? ` (${interview.onderwijsvormOpmerkingen})` : ''),
      'Belangrijkste doel excie': interview.doelExcie,
      'Welke 3 doelen centraal': interview.drieDoelen,
      'Borgingsagenda/-kalender': interview.borgingsagenda,
      'Borgingsagenda Delen': interview.borgingsagendaDelen,
      'Model of kader': interview.modelKader,
      'Slot - Heeft u aanvullingen?': interview.verdereInstrumenten,
      'Slot - Eigenstandig oordeel kenbaar maken': interview.eigenstandigOordeel,
      'Slot - Welke vragen heeft u nog?': interview.vragenBorgenKwaliteit,
      'Laatst Gewerkt': new Date(interview.lastUpdated).toLocaleString(),
    };

    let hasSets = false;

    // Create a row for each Set in each Category
    CATEGORIES.forEach(cat => {
      const sets = interview[cat.key as keyof InterviewData] as AnswerSet[] || [];
      const catNotes = interview.categoryNotes?.[cat.key] || '';
      
      sets.forEach((set, idx) => {
        hasSets = true;
        const row = {
          ...baseRow,
          'Categorie': cat.label,
          'Categorie Algemene Notities': catNotes,
          'Set Naam': set.setName || `Set ${idx + 1}`,
          'Welke info gebruik je?': set.infoGebruik || '',
          'Hoe kom je aan info?': set.infoBron || '',
          'Wat levert dat op?': set.opbrengst || '',
          'Wat doe je ermee?': set.actie || '',
          'Opt-in Delen?': set.delenOptIn || '',
          'Heb je iets te delen?': set.delen || '',
          'Synthese (Analyse)': set.synthese || ''
        };
        flatData.push(row);
      });
    });

    // If an interview has no sets at all, still add it so we don't lose the metadata
    if (!hasSets) {
      flatData.push({
        ...baseRow,
        'Categorie': '',
        'Categorie Algemene Notities': '',
        'Set Naam': '',
        'Welke info gebruik je?': '',
        'Hoe kom je aan info?': '',
        'Wat levert dat op?': '',
        'Wat doe je ermee?': '',
        'Opt-in Delen?': '',
        'Heb je iets te delen?': '',
        'Synthese (Analyse)': ''
      });
    }
  });

  const worksheet = XLSX.utils.json_to_sheet(flatData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Interviews');

  // Generate Excel file and trigger download
  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `Excie_Interviews_Export_${dateStr}.xlsx`);
};
