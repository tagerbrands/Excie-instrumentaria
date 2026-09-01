import * as XLSX from 'xlsx';
import { InterviewData, CATEGORIES, ThemeResponse, createEmptyThemeResponse } from '../types';

export const exportToExcel = (interviews: InterviewData[]) => {
  // Find maximum number of sets in each theme across all interviews
  const maxSetsPerTheme: Record<string, number> = {};

  interviews.forEach(interview => {
    CATEGORIES.forEach(cat => {
      const mappings = interview[cat.key as keyof InterviewData] as ThemeResponse[] || [];
      mappings.forEach(mapping => {
        const key = `${cat.key}_${mapping.themeName}`;
        const numSets = mapping.answerSets?.length || 1;
        if (!maxSetsPerTheme[key] || numSets > maxSetsPerTheme[key]) {
          maxSetsPerTheme[key] = numSets;
        }
      });
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
      'Borgingsagenda/-kalender (Ja/Nee)': interview.borgingsagenda,
      'Borgingsagenda Delen (Ja/Nee)': interview.borgingsagendaDelen,
      'Model of kader': interview.modelKader,
    };

    // Flatten Categories
    CATEGORIES.forEach(cat => {
      const mappings = interview[cat.key as keyof InterviewData] as ThemeResponse[] || [];
      const catPrefix = cat.label;

      // Category notes
      row[`${catPrefix} - Algemene Notities`] = interview.categoryNotes?.[cat.key] || '';

      mappings.forEach((mapping) => {
        const key = `${cat.key}_${mapping.themeName}`;
        const maxSets = maxSetsPerTheme[key] || 1;
        const prefix = `${catPrefix} - ${mapping.themeName}`;
        
        for (let s = 0; s < maxSets; s++) {
          const set = mapping.answerSets?.[s];
          const setPrefix = maxSets > 1 ? `${prefix} (Set ${s + 1})` : prefix;

          row[`${setPrefix} - Welke info gebruik je?`] = set?.infoGebruik || '';
          row[`${setPrefix} - Hoe kom je aan info?`] = set?.infoBron || '';
          row[`${setPrefix} - Wat levert dat op?`] = set?.opbrengst || '';
          row[`${setPrefix} - Wat doe je ermee?`] = set?.actie || '';
          row[`${setPrefix} - Opt-in Delen?`] = set?.delenOptIn || '';
          row[`${setPrefix} - Heb je iets te delen?`] = set?.delen || '';
        }
      });
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
    ...Array(100).fill({wch: 40}) 
  ];
  worksheet['!cols'] = wscols;

  XLSX.writeFile(workbook, `Excie_Interviews_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
};
