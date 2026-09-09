with open('src/components/CategoryBlock.tsx', 'r') as f:
    text = f.read()

# Change the Inspiration Header
old_header = """        <button 
          onClick={() => setIsInspiratieOpen(!isInspiratieOpen)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Lightbulb size={18} className="text-blue-600 dark:text-blue-400" />
            <h4 className="font-bold text-sm text-blue-900 dark:text-blue-300 uppercase tracking-wider">
              Inspiratie: {categoryLabel}
            </h4>
          </div>
          <div className="text-blue-500">
            {isInspiratieOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>"""

new_header = """        <button 
          onClick={() => setIsInspiratieOpen(!isInspiratieOpen)}
          className={`w-full px-5 py-4 flex items-center justify-between text-left transition-colors ${headerClass}`}
        >
          <div className="flex flex-col">
            <h4 className={`font-black text-xl uppercase tracking-wider ${colorClass.split(' ')[0]}`}>
              {categoryLabel}
            </h4>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <span className="text-sm font-semibold uppercase tracking-wider hidden sm:inline">Inspiratie</span>
            <Lightbulb size={18} />
            {isInspiratieOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>"""

text = text.replace(old_header, new_header)

old_tabs = """                className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors border-t border-l border-r whitespace-nowrap ${
                  activeSetId === set.id
                    ? 'bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 border-gray-200 dark:border-gray-700 border-b-white dark:border-b-gray-800 translate-y-[1px] shadow-[0_-2px_4px_rgba(0,0,0,0.02)]'
                    : 'bg-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-transparent hover:bg-gray-200/50 dark:hover:bg-gray-700'
                }`}"""

new_tabs = """                className={`px-5 py-2.5 text-sm font-bold rounded-t-lg transition-all border-t-2 border-l border-r whitespace-nowrap ${
                  activeSetId === set.id
                    ? `bg-white dark:bg-gray-800 ${colorClass.split(' ')[0]} border-t-${colorClass.split(' ')[1].split('-')[1]}-500 border-x-gray-200 dark:border-x-gray-700 border-b-white dark:border-b-gray-800 translate-y-[1px] shadow-[0_-2px_4px_rgba(0,0,0,0.02)]`
                    : 'bg-gray-100 dark:bg-gray-700/50 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700 border-b-gray-200 dark:border-b-gray-700'
                }`}"""

text = text.replace(old_tabs, new_tabs)

with open('src/components/CategoryBlock.tsx', 'w') as f:
    f.write(text)
