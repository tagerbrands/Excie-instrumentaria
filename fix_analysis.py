import re
with open('src/components/AnalysisView.tsx', 'r') as f:
    text = f.read()

text = text.replace('ThemeResponse', 'AnswerSet')
text = text.replace('themeName', 'setName')

old_source_answers = """const SourceAnswersBlock = ({ sourceThemeData, catKey, themeDataId, insertText, AnswerRow, colorInfo }: any) => {
  const [activeSetIndex, setActiveSetIndex] = useState(0);

  useEffect(() => {
    setActiveSetIndex(0);
  }, [sourceThemeData]);

  const activeSet = sourceThemeData.answerSets[activeSetIndex];
  const totalSets = sourceThemeData.answerSets.length;

  if (!activeSet) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
      {totalSets > 1 && (
        <div className="flex flex-wrap gap-1 px-4 pt-4 border-b border-gray-200 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-900/30">
          {sourceThemeData.answerSets.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setActiveSetIndex(idx)}
              className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors border-t border-l border-r ${
                activeSetIndex === idx
                  ? 'bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 border-gray-200 dark:border-gray-700 border-b-white dark:border-b-gray-800 translate-y-[1px]'
                  : 'bg-transparent text-gray-500 hover:bg-gray-200/50 dark:hover:bg-gray-700 border-transparent'
              }`}
            >
              Set {idx + 1}
            </button>
          ))}
        </div>
      )}
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

new_source_answers = """const SourceAnswersBlock = ({ sourceThemeData, catKey, themeDataId, insertText, AnswerRow, colorInfo }: any) => {
  const activeSet = sourceThemeData;

  if (!activeSet || !activeSet.infoGebruik) return null;

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

text = text.replace(old_source_answers, new_source_answers)

with open('src/components/AnalysisView.tsx', 'w') as f:
    f.write(text)
