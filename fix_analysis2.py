import re
with open('src/components/AnalysisView.tsx', 'r') as f:
    text = f.read()

# 1. SourceAnswersBlock replacement
def replace_source_answers(match):
    return """const SourceAnswersBlock = ({ sourceThemeData, catKey, themeDataId, insertText, AnswerRow, colorInfo }: any) => {
  const activeSet = sourceThemeData;
  if (!activeSet || (!activeSet.infoGebruik && !activeSet.infoBron)) return null;
  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        <AnswerRow label="Welke info?" value={activeSet.infoGebruik} onInsert={() => insertText(catKey, themeDataId, activeSet.infoGebruik)} />
        <AnswerRow label="Bron" value={activeSet.infoBron} onInsert={() => insertText(catKey, themeDataId, activeSet.infoBron)} />
        <AnswerRow label="Opbrengst" value={activeSet.opbrengst} onInsert={() => insertText(catKey, themeDataId, activeSet.opbrengst)} />
        <AnswerRow label="Actie" value={activeSet.actie} onInsert={() => insertText(catKey, themeDataId, activeSet.actie)} />
        {activeSet.delenOptIn === 'Ja' && (
          <AnswerRow label="Delen" value={activeSet.delen} onInsert={() => insertText(catKey, themeDataId, activeSet.delen)} />
        )}
      </div>
    </div>
  );
};"""

text = re.sub(r'const SourceAnswersBlock = \(\{ sourceThemeData.*?^\};', replace_source_answers, text, flags=re.DOTALL | re.MULTILINE)

# 2. Line 394 fix
text = text.replace('if (!sourceThemeData.answerSets || sourceThemeData.answerSets.length === 0) {', 'if (!sourceThemeData || !sourceThemeData.id) {')

# 3. Line 435 fix
old_best_practice = """                    themes?.forEach(t => {
                      t.answerSets?.forEach(a => {
                        if (a.delenOptIn === 'Ja' && a.delen.trim()) {
                          if (!practicesByCategory[cat.label]) practicesByCategory[cat.label] = [];
                          practicesByCategory[cat.label].push({ theme: t.setName, excie: inv.excie, note: a.delen });
                        }
                      });
                    });"""
new_best_practice = """                    themes?.forEach(t => {
                      if (t.delenOptIn === 'Ja' && t.delen?.trim()) {
                        if (!practicesByCategory[cat.label]) practicesByCategory[cat.label] = [];
                        practicesByCategory[cat.label].push({ theme: t.setName, excie: inv.excie, note: t.delen });
                      }
                    });"""

text = text.replace(old_best_practice, new_best_practice)

with open('src/components/AnalysisView.tsx', 'w') as f:
    f.write(text)
