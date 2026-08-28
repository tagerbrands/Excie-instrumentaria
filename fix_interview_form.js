const fs = require('fs');
let content = fs.readFileSync('src/components/InterviewForm.tsx', 'utf8');

// Replace imports
content = content.replace("import { InstrumentBlock } from './InstrumentBlock';", "import { ThemeBlock } from './ThemeBlock';");

// Replace rendering mapping
const oldRender = `            <div id={\`scroll-container-\${cat.key}\`} className="flex flex-col gap-6 pb-4">
              {(data[cat.key as keyof InterviewData] as ThemeResponse[]).map((instrument, idx) => (
                <div key={instrument.id} id={\`theme-\${instrument.id}\`} className="relative w-full">
                  <InstrumentBlock 
                    label={\`Thema \${idx + 1}\`}
                    categoryKey={cat.key}
                    colorClass={cat.color}
                    headerClass={cat.headerBg}
                    data={instrument}
                    onChange={(newData) => handleInstrumentChange(cat.key as keyof InterviewData, instrument.id, newData)}
                  />
                </div>
              ))}
            </div>`;

const newRender = `            <div id={\`scroll-container-\${cat.key}\`} className="flex flex-col pb-4">
              {(data[cat.key as keyof InterviewData] as ThemeResponse[]).map((themeData) => (
                <div key={themeData.id} id={\`theme-\${themeData.id}\`} className="relative w-full">
                  <ThemeBlock 
                    categoryKey={cat.key}
                    themeData={themeData}
                    colorClass={cat.color}
                    headerClass={cat.headerBg}
                    onChange={(newData) => handleInstrumentChange(cat.key as keyof InterviewData, themeData.id, newData)}
                  />
                </div>
              ))}
            </div>`;

content = content.replace(oldRender, newRender);

// Also need to check if the incomplete items logic needs updating since answers are inside answerSets now.
