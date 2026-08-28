import React, { useState, useEffect } from 'react';
import { ThemeResponse, ENTITY_THEMES, AnswerSet } from '../types';
import { InstrumentBlock } from './InstrumentBlock';
import { Plus, Lightbulb, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  categoryKey: string;
  themeData: ThemeResponse;
  colorClass: string;
  headerClass: string;
  onChange: (data: ThemeResponse) => void;
}

export const ThemeBlock: React.FC<Props> = ({ categoryKey, themeData, colorClass, headerClass, onChange }) => {
  const [activeSetId, setActiveSetId] = useState<string>(themeData.answerSets[0]?.id);
  const [isInspiratieOpen, setIsInspiratieOpen] = useState(true);

  useEffect(() => {
    if (!themeData.answerSets.find(s => s.id === activeSetId)) {
      setActiveSetId(themeData.answerSets[0]?.id);
    }
  }, [themeData.answerSets, activeSetId]);

  const themeInfo = ENTITY_THEMES[categoryKey]?.find(t => t.theme === themeData.themeName);

  const handleSetChange = (setId: string, newData: AnswerSet) => {
    onChange({
      ...themeData,
      answerSets: themeData.answerSets.map(s => s.id === setId ? newData : s)
    });
  };

  const handleAddSet = () => {
    const newId = uuidv4();
    onChange({
      ...themeData,
      answerSets: [
        ...themeData.answerSets,
        {
          id: newId,
          infoGebruik: '',
          infoBron: '',
          opbrengst: '',
          actie: '',
          delenOptIn: '',
          delen: ''
        }
      ]
    });
    setActiveSetId(newId);
  };

  const handleRemoveSet = (setId: string) => {
    onChange({
      ...themeData,
      answerSets: themeData.answerSets.filter(s => s.id !== setId)
    });
  };

  const activeSet = themeData.answerSets.find(s => s.id === activeSetId) || themeData.answerSets[0];
  const activeIndex = themeData.answerSets.findIndex(s => s.id === activeSet?.id);

  return (
    <div className={`flex flex-col border ${colorClass.split(' ')[1]} shadow-sm bg-white dark:bg-gray-800 rounded-md overflow-hidden transition-colors mb-6`}>
      <div className={`${headerClass} dark:opacity-80 px-4 py-3 flex items-center justify-between border-b ${colorClass.split(' ')[1]}`}>
        <div className="font-bold text-gray-900 tracking-wide uppercase flex items-center gap-2">
          {themeData.themeName}
        </div>
        
      </div>
      
      <div className="flex flex-col md:flex-row">
        {/* Left Col: INSPIRATIE */}
        {isInspiratieOpen && themeInfo && themeInfo.subthemes && themeInfo.subthemes.length > 0 && (
          <div className="w-full md:w-1/3 bg-blue-50 dark:bg-blue-900/20 p-5 border-b md:border-b-0 md:border-r border-blue-200 dark:border-blue-800 shrink-0 relative">
            <button 
              onClick={() => setIsInspiratieOpen(false)}
              className="absolute top-3 right-3 p-1 text-blue-400 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-300 transition-colors"
            >
              <X size={16} />
            </button>
            <h4 className="font-bold text-sm text-blue-900 dark:text-blue-300 mb-4 uppercase tracking-wider">INSPIRATIE</h4>
            <div className="space-y-5">
              {themeInfo.subthemes.map((st, idx) => {
                const suggestieLijst = st.suggesties
                  .replace(/\.\s+([A-Z])/g, '.__SPLIT__$1')
                  .split('__SPLIT__')
                  .map(s => s.trim())
                  .filter(s => s.length > 0);

                return (
                  <div key={idx} className="text-sm">
                    <div className="font-semibold text-blue-800 dark:text-blue-400 mb-2">{st.subtheme}</div>
                    <ul className="list-disc pl-4 space-y-1.5 text-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                      {suggestieLijst.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Right Col: Answer Sets Tabs */}
        <div className="flex-1 flex flex-col bg-gray-50/30 dark:bg-gray-800/30">
          <div className="flex items-end justify-between px-4 pt-4 border-b border-gray-200 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-900/30">
            <div className="pb-2">
              {!isInspiratieOpen && themeInfo && themeInfo.subthemes && themeInfo.subthemes.length > 0 && (
                <button
                  onClick={() => setIsInspiratieOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded transition-colors text-gray-600 hover:text-gray-900 hover:bg-black/5 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10"
                  title="Toon inspiratie"
                >
                  <Lightbulb size={14} />
                  INSPIRATIE
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1 justify-end">
            {themeData.answerSets.map((set, idx) => (
              <button
                key={set.id}
                onClick={() => setActiveSetId(set.id)}
                className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors border-t border-l border-r ${
                  activeSetId === set.id
                    ? 'bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 border-gray-200 dark:border-gray-700 border-b-white dark:border-b-gray-800 translate-y-[1px] shadow-[0_-2px_4px_rgba(0,0,0,0.02)]'
                    : 'bg-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-transparent hover:bg-gray-200/50 dark:hover:bg-gray-700'
                }`}
                style={{ zIndex: activeSetId === set.id ? 10 : 1 }}
              >
                Set {idx + 1}
              </button>
            ))}
            <button
              onClick={handleAddSet}
              className="px-3 py-2.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-t-lg transition-colors flex items-center gap-1 border-t border-l border-r border-transparent ml-1"
              title="Nieuwe set toevoegen"
            >
              <Plus size={16} /> <span className="hidden sm:inline">Nieuwe set</span>
            </button>
            </div>
          </div>
          <div className="p-5 flex-1 relative z-0 bg-white dark:bg-gray-800">
            {activeSet && (
              <InstrumentBlock
                key={activeSet.id}
                categoryKey={categoryKey}
                themeName={themeData.themeName}
                colorClass={colorClass}
                data={activeSet}
                index={activeIndex}
                isRemovable={themeData.answerSets.length > 1}
                onChange={(newData) => handleSetChange(activeSet.id, newData)}
                onRemove={() => handleRemoveSet(activeSet.id)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
