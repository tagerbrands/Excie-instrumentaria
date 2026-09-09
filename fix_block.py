import re

with open('src/components/InstrumentBlock.tsx', 'r') as f:
    text = f.read()

# 1. Setnaam Layout
old_setnaam = """      <div className="flex justify-between items-start mb-2">
         <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
           <label className="text-sm font-bold text-gray-700 dark:text-gray-300 md:col-span-1">Setnaam</label>
           <input type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm dark:text-gray-100 transition-colors font-semibold md:col-span-2" value={data.setName} onChange={(e) => handleChange('setName', e.target.value)} placeholder="Naam set..." />
         </div>
         {isRemovable && (
           <button onClick={onRemove} className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors ml-4" title="Verwijder deze set">
             <Trash2 size={18} />
           </button>
         )}
      </div>"""

new_setnaam = """      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-2">
         <label className="text-sm font-bold text-gray-700 dark:text-gray-300 md:col-span-1">Setnaam</label>
         <div className="md:col-span-2 flex justify-between items-center gap-4">
           <input type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm dark:text-gray-100 transition-colors font-semibold" value={data.setName} onChange={(e) => handleChange('setName', e.target.value)} placeholder="Naam set..." />
           {isRemovable && (
             <button onClick={onRemove} className="flex-shrink-0 text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors" title="Verwijder deze set">
               <Trash2 size={18} />
             </button>
           )}
         </div>
      </div>"""
text = text.replace(old_setnaam, new_setnaam)

# 2. Placeholders
text = text.replace('onChange={(e) => handleChange(\'infoGebruik\', e.target.value)} placeholder="Bron(nen)" />', 'onChange={(e) => handleChange(\'infoGebruik\', e.target.value)} placeholder="" />')
text = text.replace('onChange={(e) => handleChange(\'infoBron\', e.target.value)} placeholder="Type data, interpretaties, etc." />', 'onChange={(e) => handleChange(\'infoBron\', e.target.value)} placeholder="Bron(nen)" />')
text = text.replace('onChange={(e) => handleChange(\'opbrengst\', e.target.value)} placeholder="Rapporteren, adviseren, etc." />', 'onChange={(e) => handleChange(\'opbrengst\', e.target.value)} placeholder="Type data, interpretaties, etc." />')
text = text.replace('onChange={(e) => handleChange(\'actie\', e.target.value)} />', 'onChange={(e) => handleChange(\'actie\', e.target.value)} placeholder="Rapporteren, adviseren, etc." />')

with open('src/components/InstrumentBlock.tsx', 'w') as f:
    f.write(text)
