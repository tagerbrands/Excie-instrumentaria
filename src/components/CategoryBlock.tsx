import React, { useState, useEffect } from 'react';
import { AnswerSet, ENTITY_THEMES } from '../types';
import { InstrumentBlock } from './InstrumentBlock';
import { Plus, Lightbulb, X, ChevronDown, ChevronUp } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  categoryKey: string;
  categoryLabel: string;
  colorClass: string;
  headerClass: string;
  sets: AnswerSet[];
  onChangeSets: (sets: AnswerSet[]) => void;
  categoryNote: string;
  onChangeNote: (note: string) => void;
}

export const CategoryBlock: React.FC<Props> = ({ 
  categoryKey, 
  categoryLabel, 
  colorClass, 
  headerClass, 
  sets, 
  onChangeSets,
  categoryNote,
  onChangeNote
}) => {
  const [activeSetId, setActiveSetId] = useState<string>(sets[0]?.id || '');
  const [isInspiratieOpen, setIsInspiratieOpen] = useState(false); // default closed

  useEffect(() => {
    if (sets.length > 0 && !sets.find(s => s.id === activeSetId)) {
      setActiveSetId(sets[0].id);
    }
  }, [sets, activeSetId]);

  const themeInfos = ENTITY_THEMES[categoryKey] || [];

  const handleSetChange = (setId: string, newData: AnswerSet) => {
    onChangeSets(sets.map(s => s.id === setId ? newData : s));
  };

  const handleAddSet = () => {
    const newId = uuidv4();
    const newSet: AnswerSet = {
      id: newId,
      setName: `Set ${sets.length + 1}`,
      infoGebruik: '',
      infoBron: '',
      opbrengst: '',
      actie: '',
      delenOptIn: '',
      delen: ''
    };
    onChangeSets([...sets, newSet]);
    setActiveSetId(newId);
  };

  const handleRemoveSet = (setId: string) => {
    onChangeSets(sets.filter(s => s.id !== setId));
  };

  const activeSet = sets.find(s => s.id === activeSetId) || sets[0];
  const activeIndex = sets.findIndex(s => s.id === activeSet?.id);



  return (
    <div className={`flex flex-col border ${colorClass.split(' ')[1]} shadow-sm bg-white dark:bg-gray-800 rounded-md overflow-hidden transition-colors mb-6`}>
      {/* INSPIRATIE SECTIE (Boven) */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-blue-50/50 dark:bg-blue-900/10">
        <button 
          onClick={() => setIsInspiratieOpen(!isInspiratieOpen)}
          className={`w-full px-5 py-4 flex items-center justify-between text-left transition-colors ${headerClass}`}
        >
          <div className="flex flex-col">
            <h4 className={`font-black text-xl uppercase tracking-wider ${colorClass.includes('pink') ? 'text-pink-900 dark:text-pink-300' : colorClass.includes('orange') ? 'text-orange-900 dark:text-orange-300' : colorClass.includes('green') ? 'text-green-900 dark:text-green-300' : colorClass.includes('blue') ? 'text-blue-900 dark:text-blue-300' : colorClass.includes('teal') ? 'text-teal-900 dark:text-teal-300' : 'text-gray-900 dark:text-gray-300'}`}>
              {categoryLabel}
            </h4>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <span className="text-sm font-semibold uppercase tracking-wider hidden sm:inline">Inspiratie</span>
            <Lightbulb size={18} />
            {isInspiratieOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>
        
        {isInspiratieOpen && (
          <div className="px-5 pb-5 pt-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-blue-100 dark:border-blue-800/30">
            {themeInfos.map((tInfo, i) => (
              <div key={i} className="space-y-4">
                <h5 className="font-bold text-blue-800 dark:text-blue-400 border-b border-blue-200 dark:border-blue-800 pb-1">{tInfo.theme.toUpperCase()}</h5>
                {tInfo.subthemes.map((st, idx) => {
                  const suggestieLijst = st.suggesties
                    .replace(/\.\s+([A-Z])/g, '.__SPLIT__$1')
                    .split('__SPLIT__')
                    .map(s => s.trim())
                    .filter(s => s.length > 0);
                  return (
                    <div key={idx} className="text-sm">
                      <div className="font-semibold text-blue-700 dark:text-blue-300 mb-1">{st.subtheme}</div>
                      <p className="text-gray-600 dark:text-gray-400 text-xs italic mb-2">{st.toelichting}</p>
                      <ul className="list-disc pl-4 space-y-1 text-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                        {suggestieLijst.map((s, idx2) => (
                          <li key={idx2}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SETS SECTIE (Onder) */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
        <div className="flex items-end justify-between px-4 pt-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-x-auto">
          <div className="flex flex-nowrap gap-1">
            {sets.map((set, idx) => (
              <button
                key={set.id}
                onClick={() => setActiveSetId(set.id)}
                className={`px-5 py-2.5 text-sm font-bold rounded-t-lg transition-all border-t-2 border-l border-r whitespace-nowrap ${
                  activeSetId === set.id
                    ? `bg-white dark:bg-gray-800 ${colorClass.includes('pink') ? 'border-t-pink-500 text-pink-900 dark:text-pink-300' : colorClass.includes('orange') ? 'border-t-orange-500 text-orange-900 dark:text-orange-300' : colorClass.includes('green') ? 'border-t-green-500 text-green-900 dark:text-green-300' : colorClass.includes('blue') ? 'border-t-blue-500 text-blue-900 dark:text-blue-300' : colorClass.includes('teal') ? 'border-t-teal-500 text-teal-900 dark:text-teal-300' : 'border-t-blue-500 text-gray-900'} border-x-gray-200 dark:border-x-gray-700 border-b-white dark:border-b-gray-800 translate-y-[1px] shadow-[0_-2px_4px_rgba(0,0,0,0.02)]`
                    : 'bg-gray-100 dark:bg-gray-700/50 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700 border-b-gray-200 dark:border-b-gray-700'
                }`}
                style={{ zIndex: activeSetId === set.id ? 10 : 1 }}
              >
                {set.setName || `Set ${idx + 1}`}
              </button>
            ))}
            <button
              onClick={handleAddSet}
              className="px-3 py-2.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-t-lg transition-colors flex items-center gap-1 border-t border-l border-r border-transparent ml-1 whitespace-nowrap"
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
              colorClass={colorClass}
              data={activeSet}
              index={activeIndex}
              isRemovable={sets.length > 1}
              onChange={(newData) => handleSetChange(activeSet.id, newData)}
              onRemove={() => handleRemoveSet(activeSet.id)}
            />
          )}
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Algemene notities over {categoryLabel.toLowerCase()}
            </label>
            <textarea 
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700/50 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 dark:text-gray-100 transition-colors text-sm min-h-[80px]"
              placeholder=""
              value={categoryNote}
              onChange={(e) => onChangeNote(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
