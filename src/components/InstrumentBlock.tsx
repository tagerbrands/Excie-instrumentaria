import React from 'react';
import { AnswerSet } from '../types';
import { Trash2 } from 'lucide-react';

interface Props {
  categoryKey: string;
  themeName: string;
  colorClass: string;
  data: AnswerSet;
  onChange: (data: AnswerSet) => void;
  onRemove: () => void;
  isRemovable: boolean;
  index: number;
}

export const InstrumentBlock: React.FC<Props> = ({ colorClass, data, onChange, onRemove, isRemovable, index }) => {
  const handleTextChange = (field: keyof AnswerSet, value: string) => {
    onChange({ ...data, [field]: value });
  };
  
  const handleOptInChange = (value: 'Ja' | 'Nee') => {
    onChange({ ...data, delenOptIn: value, delen: value === 'Nee' ? '' : data.delen });
  };

  return (
    <div className="p-2 bg-transparent relative transition-colors h-full flex flex-col">
      {isRemovable && (
        <button onClick={onRemove} className="absolute top-0 right-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors" title="Verwijder deze set">
          <Trash2 size={16} />
        </button>
      )}
      <div className="flex flex-col gap-5 flex-1 mt-2">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <label className="w-full md:w-1/3 text-sm font-semibold text-gray-700 dark:text-gray-300 md:pt-2">Welke informatie gebruik je?</label>
          <textarea 
            className="flex-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700/50 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 dark:text-gray-100 transition-colors text-sm min-h-[60px]"
            value={data.infoGebruik}
            onChange={(e) => handleTextChange('infoGebruik', e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <label className="w-full md:w-1/3 text-sm font-semibold text-gray-700 dark:text-gray-300 md:pt-2">Hoe kom je aan die informatie?</label>
          <textarea 
            className="flex-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700/50 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 dark:text-gray-100 transition-colors text-sm min-h-[60px]"
            value={data.infoBron}
            onChange={(e) => handleTextChange('infoBron', e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <label className="w-full md:w-1/3 text-sm font-semibold text-gray-700 dark:text-gray-300 md:pt-2">Wat levert dat op?</label>
          <textarea 
            placeholder="type data, interpretaties, etc."
            className="flex-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700/50 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 dark:text-gray-100 transition-colors text-sm min-h-[60px] placeholder:text-gray-400 dark:placeholder:text-gray-500"
            value={data.opbrengst}
            onChange={(e) => handleTextChange('opbrengst', e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <label className="w-full md:w-1/3 text-sm font-semibold text-gray-700 dark:text-gray-300 md:pt-2">Wat doe je ermee?</label>
          <textarea 
            placeholder="rapporteren, adviseren, etc."
            className="flex-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700/50 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 dark:text-gray-100 transition-colors text-sm min-h-[60px] placeholder:text-gray-400 dark:placeholder:text-gray-500"
            value={data.actie}
            onChange={(e) => handleTextChange('actie', e.target.value)}
          />
        </div>
        
        <div className="pt-3 mt-auto border-t border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-start gap-4">
          <div className="w-full md:w-1/3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block md:pt-2">Heb je iets te delen?</label>
            <div className="flex gap-4 mb-3">
               <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                 <input type="radio" name={`delen-${data.id}`} value="Ja" checked={data.delenOptIn === 'Ja'} onChange={() => handleOptInChange('Ja')} className="text-blue-600 focus:ring-blue-500" />
                 Ja
               </label>
               <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                 <input type="radio" name={`delen-${data.id}`} value="Nee" checked={data.delenOptIn === 'Nee'} onChange={() => handleOptInChange('Nee')} className="text-blue-600 focus:ring-blue-500" />
                 Nee
               </label>
            </div>
          </div>
          <div className="flex-1 w-full">
            {data.delenOptIn === 'Ja' && (
               <textarea 
                 placeholder="Wat kan er worden gedeeld?"
                 className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded bg-blue-50/50 dark:bg-blue-900/20 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 dark:text-gray-100 transition-colors text-sm min-h-[60px]"
                 value={data.delen}
                 onChange={(e) => handleTextChange('delen', e.target.value)}
               />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
