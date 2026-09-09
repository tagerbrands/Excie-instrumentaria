import re

# 1. InterviewForm.tsx
with open('src/components/InterviewForm.tsx', 'r') as f:
    text = f.read()

# Change Datum Interview -> Datum
text = text.replace('Datum Interview', 'Datum')

# grid-cols-1 md:grid-cols-2 -> grid-cols-1 md:grid-cols-3
text = text.replace('grid-cols-1 md:grid-cols-2 gap-6', 'grid-cols-1 md:grid-cols-3 gap-6')

# Startvragen text changes
text = text.replace('Wat is het belangrijkste doel van jullie Excie?', 'Wat is in uw eigen woorden het belangrijkste doel van uw excie?')
text = text.replace('Aan welke drie doelen besteed je dit jaar specifieke aandacht in het kader van het borgen van toetskwaliteit?', 'Welke 3 doelen staan in de praktijk het meest centraal binnen uw excie?')
text = text.replace('Werk je al met een borgingsagenda of -kalender?', 'Maakt u gebruik van een borgingsagenda/-kalender?')
text = text.replace('Welke onderwijsvorm(en) zijn van toepassing?', 'Onderwijsvorm:')

# Onderwijsvormen vertically aligned
text = text.replace('<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">', '<div className="flex flex-col gap-2">')

with open('src/components/InterviewForm.tsx', 'w') as f:
    f.write(text)

