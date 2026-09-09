const fs = require('fs');
let content = fs.readFileSync('src/components/InterviewForm.tsx', 'utf8');

// Fix 1: answerSets in getProgress
const oldProg = `    CATEGORIES.forEach(cat => {
      const themes = data[cat.key as keyof InterviewData] as AnswerSet[];
      themes?.forEach(t => {
        const isFullyFilled = t.answerSets?.some(a => 
          a.infoGebruik?.trim() && 
          a.infoBron?.trim() && 
          a.opbrengst?.trim() && 
          a.actie?.trim()
        );
        if (isFullyFilled) filled++;
      });
    });`;

const newProg = `    CATEGORIES.forEach(cat => {
      const sets = data[cat.key as keyof InterviewData] as AnswerSet[];
      sets?.forEach(s => {
        const isFullyFilled = s.infoGebruik?.trim() && s.infoBron?.trim() && s.opbrengst?.trim() && s.actie?.trim();
        if (isFullyFilled) filled++;
      });
    });`;
content = content.replace(oldProg, newProg);

// Fix 2: incompleteThemes logic (lines 360-370)
const oldInc = `            CATEGORIES.forEach(cat => {
              const themes = data[cat.key as keyof InterviewData] as AnswerSet[];
              themes.forEach(t => {
                const isComplete = t.answerSets.every(a => a.infoGebruik.trim() && a.infoBron.trim() && a.opbrengst.trim() && a.actie.trim() && a.delenOptIn && (a.delenOptIn === 'Nee' || (a.delenOptIn === 'Ja' && a.delen.trim())));
                if (!isComplete) {
                  incompleteThemes.push({ id: t.id, category: cat.label, themeName: t.themeName });
                }
                t.answerSets.forEach(a => {
                  if (a.delenOptIn === 'Ja' && a.delen.trim()) {
                    sharedNotes.push({ category: cat.label, themeName: t.themeName, note: a.delen });
                  }
                });
              });
            });`;

const newInc = `            CATEGORIES.forEach(cat => {
              const sets = data[cat.key as keyof InterviewData] as AnswerSet[];
              sets.forEach(s => {
                const isComplete = s.infoGebruik?.trim() && s.infoBron?.trim() && s.opbrengst?.trim() && s.actie?.trim() && s.delenOptIn && (s.delenOptIn === 'Nee' || (s.delenOptIn === 'Ja' && s.delen?.trim()));
                if (!isComplete) {
                  incompleteThemes.push({ id: s.id, category: cat.label, themeName: s.setName || 'Set' });
                }
                if (s.delenOptIn === 'Ja' && s.delen?.trim()) {
                  sharedNotes.push({ category: cat.label, themeName: s.setName || 'Set', note: s.delen });
                }
              });
            });`;
content = content.replace(oldInc, newInc);

// Fix 3: handleCategorySetsChange
const handleOld = `  const handleInstrumentChange = (categoryKey: keyof InterviewData, id: string, newInstrumentData: AnswerSet) => {
    setData(prev => {
      const arr = prev[categoryKey] as AnswerSet[];
      return {
        ...prev,
        [categoryKey]: arr.map(item => item.id === id ? newInstrumentData : item)
      };
    });
  };`;

const handleNew = `  const handleCategorySetsChange = (categoryKey: keyof InterviewData, newSets: AnswerSet[]) => {
    setData(prev => ({ ...prev, [categoryKey]: newSets }));
  };

  const handleSaveAndReturn = () => {
    saveInterview(data);
    onBack();
  };`;

if (!content.includes('handleCategorySetsChange')) {
  content = content.replace(handleOld, handleNew);
} else if (!content.includes('handleSaveAndReturn')) {
  content = content.replace(/const getProgress/, handleNew + '\n\n  const getProgress');
}

fs.writeFileSync('src/components/InterviewForm.tsx', content);
