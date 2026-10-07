import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Save, Check, Moon, Sun, ChevronLeft, ChevronRight, BarChart2 } from 'lucide-react';
import { InterviewData, defaultInterview, CATEGORIES, AnswerSet } from '../types';
import { getInterviews, saveInterview } from '../store';
import { v4 as uuidv4 } from 'uuid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight } from 'lucide-react';

interface Props {
  sourceIds: string[];
  analysisId: string | null;
  onBack: () => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const getCategoryColors = (colorClass: string) => {
  const colorName = colorClass.split('-')[1] || 'blue';
  const colors: Record<string, { text: string, bg: string, lightBg: string, border: string, focus: string }> = {
    pink: { text: 'text-pink-700 dark:text-pink-400', bg: 'bg-pink-500', lightBg: 'bg-pink-50/50 dark:bg-pink-900/10', border: 'border-pink-200 dark:border-pink-800', focus: 'focus:border-pink-400 focus:ring-pink-400' },
    orange: { text: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-500', lightBg: 'bg-orange-50/50 dark:bg-orange-900/10', border: 'border-orange-200 dark:border-orange-800', focus: 'focus:border-orange-400 focus:ring-orange-400' },
    green: { text: 'text-green-700 dark:text-green-400', bg: 'bg-green-500', lightBg: 'bg-green-50/50 dark:bg-green-900/10', border: 'border-green-200 dark:border-green-800', focus: 'focus:border-green-400 focus:ring-green-400' },
    blue: { text: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-500', lightBg: 'bg-blue-50/50 dark:bg-blue-900/10', border: 'border-blue-200 dark:border-blue-800', focus: 'focus:border-blue-400 focus:ring-blue-400' },
    teal: { text: 'text-teal-700 dark:text-teal-400', bg: 'bg-teal-500', lightBg: 'bg-teal-50/50 dark:bg-teal-900/10', border: 'border-teal-200 dark:border-teal-800', focus: 'focus:border-teal-400 focus:ring-teal-400' },
  };
  return colors[colorName] || colors.blue;
};

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-md rounded-md text-sm">
        <p className="font-bold text-gray-900 dark:text-gray-100">{label}</p>
        <p className="text-gray-700 dark:text-gray-300">Aantal: {payload[0].value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px] mt-1 break-words leading-tight">
          {payload[0].payload.excies}
        </p>
      </div>
    );
  }
  return null;
};

const AnswerRow = ({ label, value, onInsert, colorInfo }: { label: string; value: string; onInsert: () => void; colorInfo: any }) => {
  if (!value) return null;
  return (
    <div className="flex gap-3 group bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700 shadow-2xs">
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{label}</div>
        <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">{value}</div>
      </div>
      <button 
        onClick={onInsert}
        className={`p-1.5 h-fit rounded ${colorInfo.text} hover:bg-gray-100 dark:hover:bg-gray-700 transition-all flex-shrink-0 cursor-pointer`}
        title="Kopieer naar notitieveld"
      >
        <ArrowRight size={16} />
      </button>
    </div>
  );
};

const SourceAnswersBlock = ({ 
  sourceSets, 
  sourceNote, 
  catKey, 
  insertText, 
  colorInfo 
}: { 
  sourceSets: AnswerSet[]; 
  sourceNote?: string; 
  catKey: string; 
  insertText: (text: string, catKey: string) => void; 
  colorInfo: any;
}) => {
  if (sourceSets.length === 0 && !sourceNote) {
    return (
      <div className="text-gray-500 italic text-sm p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-md">
        Geen sets ingevuld in deze bron.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sourceSets.map((s, idx) => {
        const hasContent = s.infoGebruik || s.infoBron || s.opbrengst || s.actie || (s.delenOptIn === 'Ja' && s.delen);
        return (
          <div key={s.id || idx} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700/80 pb-2">
              <span className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-semibold">
                  Set {idx + 1}
                </span>
                {s.setName && s.setName !== `Set ${idx + 1}` && <span>{s.setName}</span>}
              </span>
            </div>

            {hasContent ? (
              <div className="space-y-3">
                {s.infoGebruik && (
                  <AnswerRow label="Welke informatie gebruik je?" value={s.infoGebruik} onInsert={() => insertText(s.infoGebruik, catKey)} colorInfo={colorInfo} />
                )}
                {s.infoBron && (
                  <AnswerRow label="Hoe kom je aan die informatie?" value={s.infoBron} onInsert={() => insertText(s.infoBron, catKey)} colorInfo={colorInfo} />
                )}
                {s.opbrengst && (
                  <AnswerRow label="Wat levert dat op?" value={s.opbrengst} onInsert={() => insertText(s.opbrengst, catKey)} colorInfo={colorInfo} />
                )}
                {s.actie && (
                  <AnswerRow label="Wat doe je ermee?" value={s.actie} onInsert={() => insertText(s.actie, catKey)} colorInfo={colorInfo} />
                )}
                {s.delenOptIn === 'Ja' && (
                  <AnswerRow label="Delen" value={s.delen || 'Ja'} onInsert={() => insertText(s.delen || 'Ja', catKey)} colorInfo={colorInfo} />
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">Deze set bevat nog geen ingevulde antwoorden.</p>
            )}
          </div>
        );
      })}

      {sourceNote && (
        <div className="bg-amber-50/50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800/40 space-y-2">
          <AnswerRow label="Algemene notities bij deze categorie" value={sourceNote} onInsert={() => insertText(sourceNote, catKey)} colorInfo={colorInfo} />
        </div>
      )}
    </div>
  );
};

export const AnalysisView: React.FC<Props> = ({ sourceIds, analysisId, onBack, toggleTheme, isDarkMode }) => {
  const [data, setData] = useState<InterviewData | null>(null);
  const textareasRef = React.useRef<Record<string, HTMLTextAreaElement | null>>({});
  const [sourceInterviews, setSourceInterviews] = useState<InterviewData[]>([]);
  const [activeSourceId, setActiveSourceId] = useState<string>('');
  const [savedStatus, setSavedStatus] = useState<boolean>(false);

  useEffect(() => {
    const all = getInterviews();
    const ensureCategorySets = (inv: InterviewData): InterviewData => {
      const updated = { ...inv };
      CATEGORIES.forEach(cat => {
        const sets = updated[cat.key as keyof InterviewData] as AnswerSet[];
        if (!sets || sets.length === 0) {
          (updated as any)[cat.key] = [{ ...defaultInterview[cat.key as keyof InterviewData][0], id: uuidv4() }];
        }
      });
      return updated;
    };

    if (analysisId) {
      const existing = all.find(i => i.id === analysisId);
      if (existing) {
        setData(ensureCategorySets(existing));
        const sources = all.filter(i => existing.analysisSourceIds?.includes(i.id));
        setSourceInterviews(sources);
        if (sources.length > 0) setActiveSourceId(sources[0].id);
      }
    } else {
      const sources = all.filter(i => sourceIds.includes(i.id));
      setSourceInterviews(sources);
      if (sources.length > 0) setActiveSourceId(sources[0].id);

      const newData: InterviewData = ensureCategorySets({
        ...defaultInterview,
        id: uuidv4(),
        isAnalysis: true,
        analysisSourceIds: sourceIds,
        analysisTitle: `Analyse van ${sourceIds.length} metingen`,
        datum: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString(),
        toetsbeleid: [{ ...defaultInterview.toetsbeleid[0], id: uuidv4() }],
        toetsorganisatie: [{ ...defaultInterview.toetsorganisatie[0], id: uuidv4() }],
        toetsbekwaamheid: [{ ...defaultInterview.toetsbekwaamheid[0], id: uuidv4() }],
        toetsTaken: [{ ...defaultInterview.toetsTaken[0], id: uuidv4() }],
        toetsprogramma: [{ ...defaultInterview.toetsprogramma[0], id: uuidv4() }],
      });
      setData(newData);
      saveInterview(newData);
    }
  }, [analysisId, sourceIds]);

  useEffect(() => {
    if (!data) return;
    const handler = setTimeout(() => {
      saveInterview(data);
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 2000);
    }, 1000);
    return () => clearTimeout(handler);
  }, [data]);

  const onderwijsvormData = useMemo(() => {
    const grouped: Record<string, string[]> = {};
    sourceInterviews.forEach(inv => {
      const excie = inv.excie || 'Onbekend';
      inv.onderwijsvorm.forEach(ov => {
        if (!grouped[ov]) grouped[ov] = [];
        grouped[ov].push(excie);
      });
    });
    return Object.entries(grouped).map(([name, excies]) => ({
      name,
      count: excies.length,
      excies: excies.join(', ')
    }));
  }, [sourceInterviews]);

  const activeSource = useMemo(() => {
    return sourceInterviews.find(i => i.id === activeSourceId);
  }, [activeSourceId, sourceInterviews]);

  const cycleSource = (dir: 1 | -1) => {
    if (sourceInterviews.length === 0) return;
    const ids = sourceInterviews.length > 1 ? ['all', ...sourceInterviews.map(i => i.id)] : sourceInterviews.map(i => i.id);
    const idx = ids.indexOf(activeSourceId);
    let nextIdx = idx + dir;
    if (nextIdx < 0) nextIdx = ids.length - 1;
    if (nextIdx >= ids.length) nextIdx = 0;
    setActiveSourceId(ids[nextIdx]);
  };

  const handleChange = (field: keyof InterviewData, value: any) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };

  const handleSyntheseChange = (categoryKey: keyof InterviewData, value: string) => {
    setData(prev => {
      if (!prev) return prev;
      const arr = (prev[categoryKey] as AnswerSet[]) || [];
      const first = arr[0] || { id: uuidv4(), setName: 'Synthese', infoGebruik: '', infoBron: '', opbrengst: '', actie: '', delenOptIn: '', delen: '' };
      return {
        ...prev,
        [categoryKey]: [{ ...first, synthese: value }, ...arr.slice(1)]
      };
    });
  };

  const insertText = (text: string, categoryKey: string) => {
    if (!text) return;
    setData(prev => {
      if (!prev) return prev;
      const arr = (prev[categoryKey as keyof InterviewData] as AnswerSet[]) || [];
      const first = arr[0] || { id: uuidv4(), setName: 'Synthese', infoGebruik: '', infoBron: '', opbrengst: '', actie: '', delenOptIn: '', delen: '' };
      const currentSynthese = first.synthese || '';
      
      const textarea = textareasRef.current[categoryKey];
      let newText = '';
      let newCursorPos = 0;
      
      if (textarea && document.activeElement === textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const prefix = (start > 0 && currentSynthese[start - 1] !== ' ' && currentSynthese[start - 1] !== '\n') ? ' ' : '';
        newText = currentSynthese.substring(0, start) + prefix + text + currentSynthese.substring(end);
        newCursorPos = start + prefix.length + text.length;
      } else {
        const prefix = (currentSynthese.length > 0 && !currentSynthese.endsWith(' ') && !currentSynthese.endsWith('\n')) ? '\n\n' : '';
        newText = currentSynthese + prefix + text;
        newCursorPos = newText.length;
      }

      const newArr = [{ ...first, synthese: newText }, ...arr.slice(1)];
      
      setTimeout(() => {
        if (textarea) {
          textarea.focus();
          textarea.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);

      return { ...prev, [categoryKey]: newArr };
    });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!data) return <div className="p-8">Laden...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed h-full flex flex-col transition-colors z-40">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
          >
            <ArrowLeft size={18} /> Terug naar Dashboard
          </button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Navigatie</h3>
             <button onClick={toggleTheme} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
               {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
             </button>
          </div>
          <ul className="space-y-2">
            <li>
              <button onClick={() => scrollTo('section-top')} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                Top (Onderwijsvormen)
              </button>
            </li>
            {CATEGORIES.map(cat => (
              <li key={cat.key}>
                <button 
                  onClick={() => scrollTo(`section-${cat.key}`)}
                  className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {cat.label}
                </button>
              </li>
            ))}
            <li>
              <button onClick={() => scrollTo('section-shared')} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                Beschikbaar om te delen
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Sticky Header with Save Status & Source Selector */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <span className="font-bold text-gray-700 dark:text-gray-300">Bronmeting bekijken:</span>
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 p-1.5 rounded-lg border border-blue-200 dark:border-blue-800">
               <button onClick={() => cycleSource(-1)} className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded transition-colors text-blue-700 dark:text-blue-300 cursor-pointer">
                 <ChevronLeft size={20} />
               </button>
               <select 
                 value={activeSourceId} 
                 onChange={e => setActiveSourceId(e.target.value)}
                 className="bg-transparent border-none font-medium text-blue-800 dark:text-blue-200 focus:ring-0 cursor-pointer min-w-[200px]"
               >
                 {sourceInterviews.length > 1 && (
                   <option value="all">Alle geselecteerde bronnen ({sourceInterviews.length})</option>
                 )}
                 {sourceInterviews.map(inv => (
                   <option key={inv.id} value={inv.id}>{inv.excie || 'Onbekend'} ({inv.datum || '-'})</option>
                 ))}
               </select>
               <button onClick={() => cycleSource(1)} className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded transition-colors text-blue-700 dark:text-blue-300 cursor-pointer">
                 <ChevronRight size={20} />
               </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-300 ${savedStatus ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
               {savedStatus ? <Check size={16} /> : <Save size={16} />}
               {savedStatus ? 'Opgeslagen' : 'Automatisch opslaan...'}
             </div>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-12">
            
            <div id="section-top" className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-purple-200 dark:border-purple-800/50 relative scroll-mt-24">
              <div className="absolute top-0 left-0 w-full h-1 bg-purple-500 rounded-t-xl"></div>
              
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Titel van deze Analyse</label>
                <input 
                  type="text" 
                  value={data.analysisTitle || ''}
                  onChange={(e) => handleChange('analysisTitle', e.target.value)}
                  className="w-full text-3xl font-bold border-b-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 bg-transparent outline-none py-2 text-gray-900 dark:text-gray-100 transition-colors"
                  placeholder="Naam van analyse..."
                />
              </div>

              {/* Chart */}
              <div>
                <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <BarChart2 size={20} className="text-purple-600 dark:text-purple-400"/>
                  Onderwijsvormen (totaal)
                </h2>
                {onderwijsvormData.length > 0 ? (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={onderwijsvormData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                        <XAxis dataKey="name" stroke={isDarkMode ? '#9CA3AF' : '#4B5563'} tick={{fontSize: 12}} />
                        <YAxis allowDecimals={false} stroke={isDarkMode ? '#9CA3AF' : '#4B5563'} />
                        <Tooltip content={<CustomBarTooltip />} />
                        <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-gray-500">Geen onderwijsvormen geregistreerd in bronmetingen.</p>
                )}
              </div>
            </div>

            {/* Synthese per categorie */}
            {CATEGORIES.map(cat => {
              const sourcesToDisplay = activeSourceId === 'all'
                ? sourceInterviews
                : (activeSource ? [activeSource] : sourceInterviews);
              const cInfo = getCategoryColors(cat.color);
              const currentSynthese = (data[cat.key as keyof InterviewData] as AnswerSet[])?.[0]?.synthese || '';

              return (
                <div key={cat.key} id={`section-${cat.key}`} className="scroll-mt-24">
                  <div className={`${cat.headerBg} dark:opacity-80 border ${cat.color.split(' ')[1]} px-4 py-2 mb-6 rounded-md`}>
                    <h2 className="font-bold text-gray-800 tracking-wider uppercase">{cat.label}</h2>
                  </div>

                  <div className={`flex flex-col border ${cat.color.split(' ')[1]} shadow-sm bg-white dark:bg-gray-800 rounded-md overflow-hidden transition-colors mb-6`}>
                    <div className={`${cat.headerBg} dark:opacity-80 px-4 py-3 flex items-center justify-between border-b ${cat.color.split(' ')[1]}`}>
                      <div className="font-bold text-gray-900 tracking-wide uppercase flex items-center gap-2">
                        {cat.label}
                      </div>
                      {sourcesToDisplay.length > 1 && (
                        <span className="text-xs px-2.5 py-1 bg-white/70 dark:bg-gray-800/70 rounded-full font-medium text-gray-700 dark:text-gray-300">
                          {sourcesToDisplay.length} bronnen
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left: Source Answers */}
                        <div className="w-full lg:w-1/2 flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-bold text-sm ${cInfo.text} uppercase tracking-wider flex items-center gap-2`}>
                              <span className={`w-2 h-2 rounded-full ${cInfo.bg}`}></span>
                              Antwoorden uit bron{sourcesToDisplay.length > 1 ? 'nen' : `: ${sourcesToDisplay[0]?.excie || 'Geen bron geselecteerd'}`}
                            </h4>
                          </div>

                          <div className="space-y-6 max-h-[550px] overflow-y-auto pr-1">
                            {sourcesToDisplay.map((sourceInv) => {
                              const sourceSets = (sourceInv[cat.key as keyof InterviewData] as AnswerSet[]) || [];
                              const sourceNote = sourceInv.categoryNotes?.[cat.key];

                              return (
                                <div key={sourceInv.id} className="space-y-3">
                                  {sourcesToDisplay.length > 1 && (
                                    <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300 uppercase bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-md border border-blue-200 dark:border-blue-800">
                                      Bron: {sourceInv.excie || 'Onbekend'} ({sourceInv.datum || '-'})
                                    </div>
                                  )}
                                  <SourceAnswersBlock
                                    sourceSets={sourceSets}
                                    sourceNote={sourceNote}
                                    catKey={cat.key}
                                    insertText={insertText}
                                    colorInfo={cInfo}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Right: Synthesis */}
                        <div className="w-full lg:w-1/2 flex flex-col">
                          <h4 className={`font-bold text-sm ${cInfo.text} uppercase tracking-wider mb-2 flex items-center gap-2`}>
                            <span className={`w-2 h-2 rounded-full ${cInfo.bg}`}></span>
                            Synthese Notitieveld ({cat.label})
                          </h4>
                          <textarea
                            ref={el => textareasRef.current[cat.key] = el}
                            value={currentSynthese}
                            onChange={e => handleSyntheseChange(cat.key as keyof InterviewData, e.target.value)}
                            placeholder={`Typ hier de synthese voor ${cat.label.toLowerCase()}...`}
                            className={`flex-1 w-full p-4 border-2 ${cInfo.border} rounded-md ${cInfo.lightBg} ${cInfo.focus} dark:text-gray-100 outline-none transition-colors min-h-[350px] resize-y`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Beschikbaar om te delen sectie */}
            <div id="section-shared" className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">Beschikbaar om te delen uit alle bronmetingen</h2>
              
              {(() => {
                const practicesByCategory: Record<string, { theme: string, excie: string, note: string }[]> = {};
                
                sourceInterviews.forEach(inv => {
                  CATEGORIES.forEach(cat => {
                    const themes = inv[cat.key as keyof InterviewData] as AnswerSet[];
                    themes?.forEach(t => {
                      if (t.delenOptIn === 'Ja' && t.delen?.trim()) {
                        if (!practicesByCategory[cat.label]) practicesByCategory[cat.label] = [];
                        practicesByCategory[cat.label].push({ theme: t.setName, excie: inv.excie, note: t.delen });
                      }
                    });
                  });
                });

                const categoriesWithPractices = Object.keys(practicesByCategory);

                if (categoriesWithPractices.length === 0) {
                  return <p className="text-gray-500 italic">Geen gedeelde practices gevonden in de geselecteerde metingen.</p>;
                }

                return (
                  <div className="space-y-8">
                    {categoriesWithPractices.map(catLabel => (
                      <div key={catLabel} className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-lg border border-blue-100 dark:border-blue-900/50">
                        <h3 className="font-bold text-lg text-blue-900 dark:text-blue-300 mb-4">{catLabel}</h3>
                        <div className="space-y-4">
                          {practicesByCategory[catLabel].map((p, idx) => (
                            <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded shadow-sm border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-2 mb-2 text-sm">
                                <span className="font-bold text-gray-700 dark:text-gray-300">Thema:</span> {p.theme}
                                <span className="text-gray-300 dark:text-gray-600">|</span>
                                <span className="font-bold text-gray-700 dark:text-gray-300">Excie:</span> <span className="text-blue-600 dark:text-blue-400">{p.excie || 'Onbekend'}</span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap pl-3 border-l-2 border-blue-300 dark:border-blue-700 py-1 italic">
                                {p.note}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
