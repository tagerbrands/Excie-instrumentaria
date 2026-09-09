import re
with open('src/components/CategoryBlock.tsx', 'r') as f:
    text = f.read()

# Make sure inactive tabs are visibly slightly different from the background, since the bg is now pure white.
# Actually, the user asked for "dezelfde kleur als het kader waar de vragen in staan" so bg-white for the main background.
# The inactive tabs are `bg-gray-100 dark:bg-gray-700/50` which is fine. Let's make sure the background of the tabs bar is white too. We already changed that.

text = text.replace("border-b-gray-200 dark:border-b-gray-700'", "border-b-gray-200 dark:border-b-gray-700'")

with open('src/components/CategoryBlock.tsx', 'w') as f:
    f.write(text)
