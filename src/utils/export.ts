import * as XLSX from 'xlsx';
import { InterviewData, CATEGORIES, ThemeResponse, createEmptyThemeResponse } from '../types';

export const exportToExcel = (interviews: InterviewData[]) => {
  // Find maximum length of instruments in each category to create uniform columns
  const maxLengths: Record<string, number> = {};
  CATEGORIES.forEach(cat => {
    maxLengths[cat.key] = 1;
  });

  interviews.forEach(interview => {
    CATEGORIES.forEach(cat => {
      const mappings = interview[cat.key as keyof InterviewData] as ThemeResponse[];
      if (mappings && mappings.length > maxLengths[cat.key]) {
        maxLengths[cat.key] = mappings.length;
      }
    });
  });

  const flatData = interviews.map(interview => {
    
    // Base flattening
    const row: any = {
      'ID': interview.id,
      'Laatst Gewerkt': new Date(interview.lastUpdated).toLocaleString(),
      'Excie': interview.excie,
      'Datum': interview.datum,
      'CvE-lid': interview.cveLid,
      'Onderwijsvorm': interview.onderwijsvorm.join(', ') + (interview.onderwijsvormOpmerkingen ? ` (${interview.onderwijsvormOpmerkingen})` : ''),
      'Belangrijkste doel excie': interview.doelExcie,
      'Welke 3 doelen centraal': interview.drieDoelen,
      'Borgingsagenda/-kalender': interview.borgingsagenda,
      'Model of kader': interview.modelKader,
    };

    // Flatten Categories
    CATEGORIES.forEach(cat => {
      const mappings = interview[cat.key as keyof InterviewData] as ThemeResponse[] || [];
      const prefixBase = cat.label;

      for (let i = 0; i < maxLengths[cat.key]; i++) {
        const mapping = mappings[i] || createEmptyThemeResponse('Onbekend thema');
        const prefix = maxLengths[cat.key] > 1 ? `${prefixBase} - ${mapping.themeName}` : prefixBase;
        
        row[`${prefix} - Welke info gebruik je?`] = mapping.answerSets?.map((a, j) => mapping.answerSets!.length > 1 ? '--- Set ' + (j + 1) + ' ---\n' + a.infoGebruik : a.infoGebruik).join('\n\n') || '';
        row[`${prefix} - Hoe kom je aan info?`] = mapping.answerSets?.map((a, j) => mapping.answerSets!.length > 1 ? '--- Set ' + (j + 1) + ' ---\n' + a.infoBron : a.infoBron).join('\n\n') || '';
        row[`${prefix} - Wat levert dat op?`] = mapping.answerSets?.map((a, j) => mapping.answerSets!.length > 1 ? '--- Set ' + (j + 1) + ' ---\n' + a.opbrengst : a.opbrengst).join('\n\n') || '';
        row[`${prefix} - Wat doe je ermee?`] = mapping.answerSets?.map((a, j) => mapping.answerSets!.length > 1 ? '--- Set ' + (j + 1) + ' ---\n' + a.actie : a.actie).join('\n\n') || '';
        row[`${prefix} - Opt-in Delen?`] = mapping.answerSets?.map((a, j) => mapping.answerSets!.length > 1 ? '--- Set ' + (j + 1) + ' ---\n' + a.delenOptIn : a.delenOptIn).join('\n\n') || '';
        row[`${prefix} - Heb je iets te delen?`] = mapping.answerSets?.map((a, j) => mapping.answerSets!.length > 1 ? '--- Set ' + (j + 1) + ' ---\n' + a.delen : a.delen).join('\n\n') || '';
      }
    });

    // Flatten Slotvragen
    row['Slot - Heeft u aanvullingen?'] = interview.verdereInstrumenten;
    row['Slot - Eigenstandig oordeel kenbaar maken'] = interview.eigenstandigOordeel;
    row['Slot - Welke vragen heeft u nog?'] = interview.vragenBorgenKwaliteit;

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(flatData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Interviews');
  
  // Format standard column widths for better readibility
  const wscols = [
    {wch: 10}, // ID
    {wch: 20}, // Laatst gewerkt
    {wch: 20}, // Excie
    {wch: 15}, // Datum
    {wch: 20}, // CvE-lid
    {wch: 30}, // Onderwijsvorm
    // Add a default generous width for text areas
    ...Array(30).fill({wch: 40}) 
  ];
  worksheet['!cols'] = wscols;

  XLSX.writeFile(workbook, `Excie_Interviews_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
};
