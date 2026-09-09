import re
with open('src/components/CategoryBlock.tsx', 'r') as f:
    text = f.read()

# 3. Remove Algemene notities placeholder
text = re.sub(r'placeholder={`Ruimte voor extra opmerkingen over \$\{categoryLabel\.toLowerCase\(\)\}\.\.\.`}', 'placeholder=""', text)

# 4. Tints for Sets
tints_helper = """
  const getSetTint = (idx: number) => {
    const tints = [
      { bg: 'bg-white dark:bg-gray-800', border: 'border-b-white dark:border-b-gray-800' },
      { bg: 'bg-slate-50 dark:bg-slate-800', border: 'border-b-slate-50 dark:border-b-slate-800' },
      { bg: 'bg-stone-50 dark:bg-stone-800', border: 'border-b-stone-50 dark:border-b-stone-800' },
      { bg: 'bg-zinc-50 dark:bg-zinc-800', border: 'border-b-zinc-50 dark:border-b-zinc-800' },
      { bg: 'bg-neutral-50 dark:bg-neutral-800', border: 'border-b-neutral-50 dark:border-b-neutral-800' }
    ];
    return tints[idx % tints.length];
  };
"""

text = text.replace('  return (\n    <div', tints_helper + '\n  return (\n    <div')

old_active_tab = "bg-white dark:bg-gray-800 ${colorClass.includes('pink') ? 'border-t-pink-500 text-pink-900 dark:text-pink-300' : colorClass.includes('orange') ? 'border-t-orange-500 text-orange-900 dark:text-orange-300' : colorClass.includes('green') ? 'border-t-green-500 text-green-900 dark:text-green-300' : colorClass.includes('blue') ? 'border-t-blue-500 text-blue-900 dark:text-blue-300' : colorClass.includes('teal') ? 'border-t-teal-500 text-teal-900 dark:text-teal-300' : 'border-t-blue-500 text-gray-900'} border-x-gray-200 dark:border-x-gray-700 border-b-white dark:border-b-gray-800 translate-y-[1px] shadow-[0_-2px_4px_rgba(0,0,0,0.02)]"
new_active_tab = "${getSetTint(idx).bg} ${colorClass.includes('pink') ? 'border-t-pink-500 text-pink-900 dark:text-pink-300' : colorClass.includes('orange') ? 'border-t-orange-500 text-orange-900 dark:text-orange-300' : colorClass.includes('green') ? 'border-t-green-500 text-green-900 dark:text-green-300' : colorClass.includes('blue') ? 'border-t-blue-500 text-blue-900 dark:text-blue-300' : colorClass.includes('teal') ? 'border-t-teal-500 text-teal-900 dark:text-teal-300' : 'border-t-blue-500 text-gray-900'} border-x-gray-200 dark:border-x-gray-700 ${getSetTint(idx).border} translate-y-[1px] shadow-[0_-2px_4px_rgba(0,0,0,0.02)]"

text = text.replace(old_active_tab, new_active_tab)

old_panel = '<div className="p-5 flex-1 relative z-0 bg-white dark:bg-gray-800">'
new_panel = '<div className={`p-5 flex-1 relative z-0 transition-colors ${getSetTint(activeIndex).bg}`}>'

text = text.replace(old_panel, new_panel)

with open('src/components/CategoryBlock.tsx', 'w') as f:
    f.write(text)
