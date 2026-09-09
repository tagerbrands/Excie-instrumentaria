import re
with open('src/utils/export.ts', 'r') as f:
    text = f.read()

text = text.replace('ThemeResponse', 'AnswerSet')
text = text.replace('createEmptyThemeResponse', 'createEmptyAnswerSet') # if it exists

old_maxsets = """  const maxSetsPerTheme: Record<string, number> = {};
  interviews.forEach(inv => {
    CATEGORIES.forEach(cat => {
      const mappings = inv[cat.key as keyof InterviewData] as AnswerSet[] || [];
      mappings.forEach(m => {
        const key = `${cat.key}_${m.themeName}`;
        if (!maxSetsPerTheme[key] || m.answerSets.length > maxSetsPerTheme[key]) {
          maxSetsPerTheme[key] = m.answerSets.length;
        }
      });
    });
  });"""

new_maxsets = """  const maxSetsPerTheme: Record<string, number> = {};"""

text = text.replace(old_maxsets, new_maxsets)

old_cat = """    CATEGORIES.forEach(cat => {
      const mappings = interview[cat.key as keyof InterviewData] as AnswerSet[] || [];
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
    });"""

new_cat = """    CATEGORIES.forEach(cat => {
      const mappings = interview[cat.key as keyof InterviewData] as AnswerSet[] || [];
      const catPrefix = cat.label;

      // Category notes
      row[`${catPrefix} - Algemene Notities`] = interview.categoryNotes?.[cat.key] || '';

      mappings.forEach((mapping, idx) => {
        const prefix = `${catPrefix} - ${mapping.setName || 'Set ' + (idx + 1)}`;
        row[`${prefix} - Welke info gebruik je?`] = mapping.infoGebruik || '';
        row[`${prefix} - Hoe kom je aan info?`] = mapping.infoBron || '';
        row[`${prefix} - Wat levert dat op?`] = mapping.opbrengst || '';
        row[`${prefix} - Wat doe je ermee?`] = mapping.actie || '';
        row[`${prefix} - Opt-in Delen?`] = mapping.delenOptIn || '';
        row[`${prefix} - Heb je iets te delen?`] = mapping.delen || '';
        row[`${prefix} - Synthese`] = mapping.synthese || '';
      });
    });"""

text = text.replace(old_cat, new_cat)

with open('src/utils/export.ts', 'w') as f:
    f.write(text)
