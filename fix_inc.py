import sys
with open('src/components/InterviewForm.tsx', 'r') as f:
    text = f.read()

start_idx = text.find('CATEGORIES.forEach(cat => {')
if start_idx == -1:
    print('start not found')
    sys.exit(1)

# Find the second CATEGORIES.forEach(cat => {
second_idx = text.find('CATEGORIES.forEach(cat => {', start_idx + 1)
if second_idx == -1:
    print('second not found')
    sys.exit(1)

end_idx = text.find('});\n            });', second_idx)
if end_idx == -1:
    print('end not found')
    sys.exit(1)
end_idx += len('});\n            });')

new_block = """CATEGORIES.forEach(cat => {
              const sets = data[cat.key as keyof InterviewData] as AnswerSet[];
              sets.forEach(s => {
                const isComplete = s.infoGebruik?.trim() && s.infoBron?.trim() && s.opbrengst?.trim() && s.actie?.trim() && s.delenOptIn && (s.delenOptIn === 'Nee' || (s.delenOptIn === 'Ja' && s.delen?.trim()));
                if (!isComplete) {
                  incompleteThemes.push({ id: s.id, category: cat.label, themeName: s.setName || 'Set' });
                }
                if (s.delenOptIn === 'Ja' && s.delen?.trim()) {
                  sharedNotes.push({ category: cat.label, themeName: s.setName || 'Set', note: s.delen });
                }
              });
            });"""

text = text[:second_idx] + new_block + text[end_idx:]

with open('src/components/InterviewForm.tsx', 'w') as f:
    f.write(text)
