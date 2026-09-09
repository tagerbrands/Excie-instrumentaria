import React from 'react';
import { AnswerSet } from '../types';
import { Trash2 } from 'lucide-react';

interface Props {
  categoryKey: string;
  colorClass: string;
  data: AnswerSet;
  index: number;
  isRemovable: boolean;
  onChange: (newData: AnswerSet) => void;
  onRemove: () => void;
}

export const InstrumentBlock: React.FC<Props> = ({ colorClass, data, index, isRemovable, onChange, onRemove }) => {
  const handleChange = (field: keyof AnswerSet, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleOptInChange = (val: 'Ja' | 'Nee' | '') => {
    onChange({ ...data, delenOptIn: val });
  };

  return (
    <div className={`flex flex-col gap-5 p-5 md:p-6 border rounded-xl ${colorClass}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-2">
         <label className="text-sm font-bold text-gray-700 dark:text-gray-300 md:col-span-1">Setnaam</label>
         <div className="md:col-span-2 flex justify-between items-center gap-4">
           <input type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm dark:text-gray-100 transition-colors font-semibold" value={data.setName} onChange={(e) => handleChange('setName', e.target.value)} placeholder="Naam set..." />
           {isRemovable && (
             <button onClick={onRemove} className="flex-shrink-0 text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors" title="Verwijder deze set">
               <Trash2 size={18} />
             </button>
           )}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 md:col-span-1 pt-2">Welke informatie gebruik je?</label>
        <textarea className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[60px] resize-y text-sm dark:text-gray-100 transition-colors md:col-span-2" value={data.infoGebruik} onChange={(e) => handleChange('infoGebruik', e.target.value)} placeholder="" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 md:col-span-1 pt-2">Hoe kom je aan die informatie?</label>
        <textarea className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[60px] resize-y text-sm dark:text-gray-100 transition-colors md:col-span-2" value={data.infoBron} onChange={(e) => handleChange('infoBron', e.target.value)} placeholder="Bron(nen)" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 md:col-span-1 pt-2">Wat levert dat op?</label>
        <textarea className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[60px] resize-y text-sm dark:text-gray-100 transition-colors md:col-span-2" value={data.opbrengst} onChange={(e) => handleChange('opbrengst', e.target.value)} placeholder="Type data, interpretaties, etc." />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 md:col-span-1 pt-2">Wat doe je ermee?</label>
        <textarea className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[60px] resize-y text-sm dark:text-gray-100 transition-colors md:col-span-2" value={data.actie} onChange={(e) => handleChange('actie', e.target.value)} placeholder="Rapporteren, adviseren, etc." />
      </div>

      <div className="p-4 mt-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
           <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 md:col-span-1 pt-1">Heb je iets te delen?</label>
           <div className="md:col-span-2 flex flex-col gap-3">
             <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input type="radio" name={`optin-${data.id}`} value="Ja" checked={data.delenOptIn === 'Ja'} onChange={() => handleOptInChange('Ja')} className="text-blue-600 focus:ring-blue-500" />
                  Ja
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input type="radio" name={`optin-${data.id}`} value="Nee" checked={data.delenOptIn === 'Nee'} onChange={() => handleOptInChange('Nee')} className="text-blue-600 focus:ring-blue-500" />
                  Nee
                </label>
             </div>
             {data.delenOptIn === 'Ja' && (
               <textarea className="w-full px-3 py-2 border border-blue-200 dark:border-blue-800 rounded bg-white dark:bg-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[60px] resize-y text-sm dark:text-gray-100 transition-colors" value={data.delen} onChange={(e) => handleChange('delen', e.target.value)} placeholder="Licht toe (bijv. we hebben een rubrics model of we zoeken een voorbeeld)..." />
             )}
           </div>
         </div>
      </div>
    </div>
  );
};
