import re
with open('src/components/InstrumentBlock.tsx', 'r') as f:
    text = f.read()

# Add padding and rounded borders to the InstrumentBlock
old_div = '<div className={`flex flex-col gap-5 ${colorClass}`}>'
new_div = '<div className={`flex flex-col gap-5 p-5 md:p-6 border rounded-xl ${colorClass}`}>'
text = text.replace(old_div, new_div)

# Wait, there's another colored block inside the InstrumentBlock?
# The last section: 'Heb je iets te delen?'
# It uses: <div className="p-4 mt-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
# That's fine, it already has padding.

with open('src/components/InstrumentBlock.tsx', 'w') as f:
    f.write(text)
