import re
with open('src/components/CategoryBlock.tsx', 'r') as f:
    text = f.read()

old_tabs = """                className={`px-5 py-2.5 text-sm font-bold rounded-t-lg transition-all border-t-2 border-l border-r whitespace-nowrap ${
                  activeSetId === set.id
                    ? `bg-white dark:bg-gray-800 ${colorClass.split(' ')[0]} ${colorClass.includes('pink') ? 'border-t-pink-500' : colorClass.includes('orange') ? 'border-t-orange-500' : colorClass.includes('green') ? 'border-t-green-500' : colorClass.includes('blue') ? 'border-t-blue-500' : colorClass.includes('teal') ? 'border-t-teal-500' : 'border-t-blue-500'} border-x-gray-200 dark:border-x-gray-700 border-b-white dark:border-b-gray-800 translate-y-[1px] shadow-[0_-2px_4px_rgba(0,0,0,0.02)] text-gray-900 dark:text-gray-100`
                    : 'bg-gray-100 dark:bg-gray-700/50 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700 border-b-gray-200 dark:border-b-gray-700'
                }`}"""

new_tabs = """                className={`px-5 py-2.5 text-sm font-bold rounded-t-lg transition-all border-t-2 border-l border-r whitespace-nowrap ${
                  activeSetId === set.id
                    ? `bg-white dark:bg-gray-800 ${colorClass.includes('pink') ? 'border-t-pink-500 text-pink-900 dark:text-pink-300' : colorClass.includes('orange') ? 'border-t-orange-500 text-orange-900 dark:text-orange-300' : colorClass.includes('green') ? 'border-t-green-500 text-green-900 dark:text-green-300' : colorClass.includes('blue') ? 'border-t-blue-500 text-blue-900 dark:text-blue-300' : colorClass.includes('teal') ? 'border-t-teal-500 text-teal-900 dark:text-teal-300' : 'border-t-blue-500 text-gray-900'} border-x-gray-200 dark:border-x-gray-700 border-b-white dark:border-b-gray-800 translate-y-[1px] shadow-[0_-2px_4px_rgba(0,0,0,0.02)]`
                    : 'bg-gray-100 dark:bg-gray-700/50 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700 border-b-gray-200 dark:border-b-gray-700'
                }`}"""

text = text.replace(old_tabs, new_tabs)

with open('src/components/CategoryBlock.tsx', 'w') as f:
    f.write(text)
