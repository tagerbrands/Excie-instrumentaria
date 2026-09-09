import re
with open('src/components/CategoryBlock.tsx', 'r') as f:
    text = f.read()

# Remove getSetTint function
getSetTint_regex = r"  const getSetTint = \(idx: number\) => \{[\s\S]*?\};\n"
text = re.sub(getSetTint_regex, "", text)

# Replace active tab background
old_active_tab = "`${getSetTint(idx).bg} ${colorClass.includes('pink') ? 'border-t-pink-500 text-pink-900 dark:text-pink-300' : colorClass.includes('orange') ? 'border-t-orange-500 text-orange-900 dark:text-orange-300' : colorClass.includes('green') ? 'border-t-green-500 text-green-900 dark:text-green-300' : colorClass.includes('blue') ? 'border-t-blue-500 text-blue-900 dark:text-blue-300' : colorClass.includes('teal') ? 'border-t-teal-500 text-teal-900 dark:text-teal-300' : 'border-t-blue-500 text-gray-900'} border-x-gray-200 dark:border-x-gray-700 ${getSetTint(idx).border} translate-y-[1px] shadow-[0_-2px_4px_rgba(0,0,0,0.02)]`"
new_active_tab = "`bg-white dark:bg-gray-800 ${colorClass.includes('pink') ? 'border-t-pink-500 text-pink-900 dark:text-pink-300' : colorClass.includes('orange') ? 'border-t-orange-500 text-orange-900 dark:text-orange-300' : colorClass.includes('green') ? 'border-t-green-500 text-green-900 dark:text-green-300' : colorClass.includes('blue') ? 'border-t-blue-500 text-blue-900 dark:text-blue-300' : colorClass.includes('teal') ? 'border-t-teal-500 text-teal-900 dark:text-teal-300' : 'border-t-blue-500 text-gray-900'} border-x-gray-200 dark:border-x-gray-700 border-b-white dark:border-b-gray-800 translate-y-[1px] shadow-[0_-2px_4px_rgba(0,0,0,0.02)]`"
text = text.replace(old_active_tab, new_active_tab)

# Replace panel background
old_panel = '<div className={`p-5 flex-1 relative z-0 transition-colors ${getSetTint(activeIndex).bg}`}>'
new_panel = '<div className="p-5 flex-1 relative z-0 bg-white dark:bg-gray-800">'
text = text.replace(old_panel, new_panel)

# Fix CategoryBlock sets wrapper backgrounds to also match the background
old_wrapper_1 = '<div className="flex-1 flex flex-col bg-gray-50/30 dark:bg-gray-800/30">'
new_wrapper_1 = '<div className="flex-1 flex flex-col bg-white dark:bg-gray-800">'
text = text.replace(old_wrapper_1, new_wrapper_1)

old_wrapper_2 = '<div className="flex items-end justify-between px-4 pt-4 border-b border-gray-200 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-900/30 overflow-x-auto">'
new_wrapper_2 = '<div className="flex items-end justify-between px-4 pt-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-x-auto">'
text = text.replace(old_wrapper_2, new_wrapper_2)

with open('src/components/CategoryBlock.tsx', 'w') as f:
    f.write(text)
