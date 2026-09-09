with open('src/components/PrintView.tsx', 'r') as f:
    text = f.read()

text = text.replace('ThemeResponse', 'AnswerSet')

old_mapping = """                 {mappings.map((mapping, idx) => (
                    <div key={mapping.id} className="border border-gray-300 rounded p-4 mb-4 text-sm bg-gray-50/30">
                        <div className="font-bold underline mb-4">{mapping.themeName}</div>
                        <div className="space-y-6">
                          {mapping.answerSets?.map((a, i) => (
                            <div key={a.id} className={mapping.answerSets!.length > 1 ? 'border-b border-gray-200 pb-4 mb-4 last:border-0 last:pb-0' : ''}>
                               {mapping.answerSets!.length > 1 && <div className="font-semibold text-gray-500 mb-2">Set {i + 1}</div>}
                               <div className="space-y-3">
                                 <div><strong>Welke informatie gebruik je?</strong><br/> {a.infoGebruik || '-'}</div>
                                 <div><strong>Hoe kom je aan die informatie?</strong><br/> {a.infoBron || '-'}</div>
                                 <div><strong>Wat levert dat op?</strong><br/> {a.opbrengst || '-'}</div>
                                 <div><strong>Wat doe je ermee?</strong><br/> {a.actie || '-'}</div>
                                 <div><strong>Heb je iets te delen?</strong><br/> {a.delenOptIn === 'Ja' ? a.delen : (a.delenOptIn || '-')}</div>
                               </div>
                            </div>
                          ))}
                        </div>
                    </div>
                 ))}"""

new_mapping = """                 {mappings.map((mapping, idx) => (
                    <div key={mapping.id} className="border border-gray-300 rounded p-4 mb-4 text-sm bg-gray-50/30">
                        <div className="font-bold underline mb-4">{mapping.setName || 'Set'}</div>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div><strong>Welke informatie gebruik je?</strong><br/> {mapping.infoGebruik || '-'}</div>
                                <div><strong>Hoe kom je aan die informatie?</strong><br/> {mapping.infoBron || '-'}</div>
                                <div><strong>Wat levert dat op?</strong><br/> {mapping.opbrengst || '-'}</div>
                                <div><strong>Wat doe je ermee?</strong><br/> {mapping.actie || '-'}</div>
                                <div><strong>Heb je iets te delen?</strong><br/> {mapping.delenOptIn === 'Ja' ? mapping.delen : (mapping.delenOptIn || '-')}</div>
                            </div>
                        </div>
                    </div>
                 ))}"""

text = text.replace(old_mapping, new_mapping)

with open('src/components/PrintView.tsx', 'w') as f:
    f.write(text)
