import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Check, FileUp, Printer, Moon, Sun, Info } from 'lucide-react';
import { InterviewData, defaultInterview, CATEGORIES, ONDERWIJSVORM_OPTIONS, ThemeResponse } from '../types';
import { ThemeBlock } from './ThemeBlock';
import { saveInterview } from '../store';
import { v4 as uuidv4 } from 'uuid';
import { exportToExcel } from '../utils/export';
import { createRoot } from 'react-dom/client';
import { PrintView } from './PrintView';

interface Props {
  initialData?: InterviewData;
  onBack: () => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, value, onChange, placeholder = '' }) => (
  <div className="mb-6">
    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">{label}</label>
    <textarea 
      className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 outline-none text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 shadow-sm transition-colors"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

export const InterviewForm: React.FC<Props> = ({ initialData, onBack, toggleTheme, isDarkMode }) => {
  const [data, setData] = useState<InterviewData>(
    initialData || { ...defaultInterview, id: uuidv4(), datum: new Date().toISOString().split('T')[0], lastUpdated: new Date().toISOString() }
  );
  const [savedStatus, setSavedStatus] = useState<boolean>(false);

  // Auto-save debounced
  useEffect(() => {
    const handler = setTimeout(() => {
      saveInterview(data);
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 2000);
    }, 1000);

    return () => clearTimeout(handler);
  }, [data]);

  const handleChange = (field: keyof InterviewData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleInstrumentChange = (categoryKey: keyof InterviewData, id: string, newInstrumentData: ThemeResponse) => {
    setData(prev => {
      const arr = prev[categoryKey] as ThemeResponse[];
      return {
        ...prev,
        [categoryKey]: arr.map(item => item.id === id ? newInstrumentData : item)
      };
    });
  };

  const handleOnderwijsvormToggle = (option: string) => {
    const current = data.onderwijsvorm;
    if (current.includes(option)) {
      handleChange('onderwijsvorm', current.filter(o => o !== option));
    } else {
      handleChange('onderwijsvorm', [...current, option]);
    }
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    saveInterview(data);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Interview Excie Export</title>
            <style>
              @media print {
                @page { margin: 1cm; }
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            <div id="print-root"></div>
          </body>
        </html>
      `);
      
      const copyStyles = () => {
        document.querySelectorAll('style, link[rel="stylesheet"]').forEach(node => {
          printWindow.document.head.appendChild(node.cloneNode(true));
        });
      };
      
      copyStyles();
      printWindow.document.close();

      const printRootElement = printWindow.document.getElementById('print-root');
      if (printRootElement) {
        const root = createRoot(printRootElement);
        root.render(<PrintView interview={data} />);
        
        setTimeout(() => {
          printWindow.print();
        }, 1500); // Give enough time for fonts/styles/components to mount
      }
    } else {
      alert("Pop-up werd geblokkeerd. Sta pop-ups toe om af te drukken.");
    }
  };

  // Nav helper for smooth scroll
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200">
      {/* Sticky Sidebar Navigation */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed h-full flex flex-col transition-colors z-20">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            Terug naar Dashboard
          </button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Navigatie</h3>
             <button onClick={toggleTheme} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
               {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
             </button>
          </div>
          <ul className="space-y-1 mb-6">
            <li><button onClick={() => scrollTo('meta')} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">Algemeen</button></li>
            <li><button onClick={() => scrollTo('section-startvragen')} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">Startvragen</button></li>
            {CATEGORIES.map(cat => (
              <li key={cat.key}>
                <button onClick={() => scrollTo(`section-${cat.key}`)} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                  {cat.label}
                </button>
              </li>
            ))}
            <li><button onClick={() => scrollTo('section-slotvragen')} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">Slotvragen</button></li>
          </ul>

          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Acties</h3>
          <ul className="space-y-1">
            <li>
              <button onClick={() => exportToExcel([data])} className="w-full text-left px-3 py-2 text-sm text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md transition-colors flex items-center gap-2 font-medium">
                <FileUp size={16} /> Excel-export
              </button>
            </li>
            <li>
              <button onClick={handlePrint} className="w-full text-left px-3 py-2 text-sm text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-md transition-colors flex items-center gap-2 font-medium block">
                <Printer size={16} /> PDF-export
              </button>
            </li>
          </ul>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-500 flex items-center gap-2 transition-colors">
           {savedStatus ? <><Check size={16} className="text-green-500"/> Opgeslagen</> : <><Save size={16} className="text-gray-400"/> Automatisch opslaan...</>}
        </div>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 ml-64 p-8 max-w-5xl">
        
        {/* Validation / Form Title Context */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Inventarisatie van borgingsmethodiek</h1>
        </div>

        {/* ----- META SECTION ----- */}
        <div id="meta" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Excie:</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none bg-transparent dark:text-white transition-colors"
                value={data.excie}
                onChange={(e) => handleChange('excie', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Datum:</label>
              <input 
                type="date" 
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none bg-transparent dark:text-white transition-colors"
                value={data.datum}
                onChange={(e) => handleChange('datum', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">CvE-lid:</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none bg-transparent dark:text-white transition-colors"
                value={data.cveLid}
                onChange={(e) => handleChange('cveLid', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ----- STARTVRAGEN ----- */}
        <div id="section-startvragen" className="mb-10">
          <div className="bg-green-100 dark:bg-green-900/40 border border-green-300 dark:border-green-800 px-4 py-2 mb-4 transition-colors">
            <h2 className="text-center font-bold text-gray-800 dark:text-gray-100 tracking-wider">STARTVRAGEN</h2>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6 transition-colors">
            
            <div className="flex flex-col md:flex-row border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden transition-colors">
              <div className="w-full md:w-1/3 bg-gray-50 dark:bg-gray-900/50 p-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 font-semibold text-gray-800 dark:text-gray-100 transition-colors">
                Onderwijsvorm:
              </div>
              <div className="p-4 flex flex-col gap-2 w-full">
                {ONDERWIJSVORM_OPTIONS.map(opt => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 accent-blue-600"
                      checked={data.onderwijsvorm.includes(opt)}
                      onChange={() => handleOnderwijsvormToggle(opt)}
                    />
                    <span className="text-gray-700 dark:text-gray-200">{opt}</span>
                  </label>
                ))}
                <input
                  type="text"
                  placeholder="Opmerkingen..."
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 mt-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none block bg-transparent dark:text-white transition-colors"
                  value={data.onderwijsvormOpmerkingen}
                  onChange={(e) => handleChange('onderwijsvormOpmerkingen', e.target.value)}
                />
              </div>
            </div>

            <TextAreaField label="Wat is in uw eigen woorden het belangrijkste doel van uw excie?" value={data.doelExcie} onChange={(v) => handleChange('doelExcie', v)} />
            <TextAreaField label="Welke 3 doelen staan in de praktijk het meest centraal binnen uw excie?" value={data.drieDoelen} onChange={(v) => handleChange('drieDoelen', v)} />
            <TextAreaField label="Maakt u gebruik van een borgingsagenda/-kalender? Zo ja, kunt u deze delen?" value={data.borgingsagenda} onChange={(v) => handleChange('borgingsagenda', v)} />
            <TextAreaField label="Maakt u gebruik van een model of kader (bijv. Toetsweb)?" value={data.modelKader} onChange={(v) => handleChange('modelKader', v)} />

          </div>
        </div>

        {/* ----- INSTRUMENT CATEGORIES ----- */}
        {CATEGORIES.map(cat => (
          <div key={cat.key} id={`section-${cat.key}`} className="mb-10 scroll-mt-6">
            <div className={`${cat.headerBg} dark:opacity-80 border ${cat.color.split(' ')[1]} px-4 py-2 mb-4 flex items-center justify-between rounded-t-md`}>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-gray-800 tracking-wider uppercase">{cat.label}</h2>
                {cat.description && (
                  <div className="relative group flex items-center">
                    <Info size={16} className="text-gray-600 hover:text-gray-900 cursor-help" />
                    <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-[300px] sm:w-[400px] md:w-[600px] p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-md z-50 text-sm text-gray-700 dark:text-gray-300 normal-case font-normal leading-relaxed">
                      {cat.description}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div id={`scroll-container-${cat.key}`} className="flex flex-col pb-4">
              {(data[cat.key as keyof InterviewData] as ThemeResponse[]).map((themeData) => (
                <div key={themeData.id} id={`theme-${themeData.id}`} className="relative w-full">
                  <ThemeBlock 
                    categoryKey={cat.key}
                    themeData={themeData}
                    colorClass={cat.color}
                    headerClass={cat.headerBg}
                    onChange={(newData) => handleInstrumentChange(cat.key as keyof InterviewData, themeData.id, newData)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* ----- SLOTVRAGEN ----- */}
        <div id="section-slotvragen" className="mb-16">
          <div className="bg-orange-100 dark:bg-orange-900/40 border border-orange-200 dark:border-orange-800 px-4 py-2 mb-4 transition-colors">
            <h2 className="text-center font-bold text-gray-800 dark:text-gray-100 tracking-wider">SLOTVRAGEN</h2>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6 transition-colors">
            <TextAreaField label="Heeft u aanvullingen? Laat het evt. later nog weten." value={data.verdereInstrumenten} onChange={(v) => handleChange('verdereInstrumenten', v)} />
            <TextAreaField label="Hoe zou u uw eigenstandig oordeel over de toetskwaliteit kenbaar maken?" value={data.eigenstandigOordeel} onChange={(v) => handleChange('eigenstandigOordeel', v)} />
            <TextAreaField label="Welke vragen heeft u nog over het borgen van toetskwaliteit?" value={data.vragenBorgenKwaliteit} onChange={(v) => handleChange('vragenBorgenKwaliteit', v)} />
          </div>
        </div>

        {/* ----- OVERZICHTEN ----- */}
        <div className="mb-16 space-y-8">
          {(() => {
            const incompleteThemes: { id: string; category: string; themeName: string }[] = [];
            const sharedNotes: { category: string; themeName: string; note: string }[] = [];

            CATEGORIES.forEach(cat => {
              const themes = data[cat.key as keyof InterviewData] as ThemeResponse[];
              themes.forEach(t => {
                const isComplete = t.answerSets.every(a => a.infoGebruik.trim() && a.infoBron.trim() && a.opbrengst.trim() && a.actie.trim() && a.delenOptIn && (a.delenOptIn === 'Nee' || (a.delenOptIn === 'Ja' && a.delen.trim())));
                if (!isComplete) {
                  incompleteThemes.push({ id: t.id, category: cat.label, themeName: t.themeName });
                }

                t.answerSets.forEach(a => {
                  if (a.delenOptIn === 'Ja' && a.delen.trim()) {
                    sharedNotes.push({ category: cat.label, themeName: t.themeName, note: a.delen });
                  }
                });
              });
            });

            const scrollToTheme = (id: string) => {
              const el = document.getElementById(`theme-${id}`);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Optional: add a brief highlight effect
                el.classList.add('ring-4', 'ring-red-400', 'transition-all', 'duration-500');
                setTimeout(() => el.classList.remove('ring-4', 'ring-red-400'), 2000);
              }
            };

            return (
              <>
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl shadow-sm border border-red-200 dark:border-red-800/50">
                  <h3 className="text-lg font-bold text-red-900 dark:text-red-400 mb-4">Incomplete Thema's</h3>
                  {incompleteThemes.length > 0 ? (
                    <ul className="list-none space-y-2 text-sm text-red-800 dark:text-red-300">
                      {incompleteThemes.map((item, idx) => (
                        <li key={idx}>
                          <button 
                            onClick={() => scrollToTheme(item.id)}
                            className="text-left hover:underline focus:outline-none flex items-center gap-2"
                            title="Klik om direct naar dit thema te gaan"
                          >
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block"></span>
                            <strong>{item.category}:</strong> {item.themeName}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">Alle thema's zijn volledig ingevuld!</p>
                  )}
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800/50">
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-400 mb-4">Gedeelde Practices / Opmerkingen</h3>
                  {sharedNotes.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-4 text-sm text-blue-800 dark:text-blue-300">
                      {sharedNotes.map((item, idx) => (
                        <li key={idx}>
                          <strong>{item.category} - {item.themeName}:</strong>
                          <p className="mt-1 whitespace-pre-wrap italic text-gray-700 dark:text-gray-300 border-l-2 border-blue-300 dark:border-blue-700 pl-3 py-1">
                            {item.note}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">Er zijn nog geen opmerkingen gemarkeerd om te delen.</p>
                  )}
                </div>
              </>
            );
          })()}
        </div>

        {/* EXPORT PROMPT */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-4 border-yellow-400 p-8 rounded-xl text-center mb-12 shadow-lg">
          <h3 className="text-2xl font-bold text-yellow-800 dark:text-yellow-400 mb-4 uppercase tracking-wider">Vergeet niet te exporteren!</h3>
          <p className="text-yellow-700 dark:text-yellow-300 font-medium mb-6">
            Uw invoer is opgeslagen. Maak nu direct een Excel-export om uw gegevens veilig te stellen en te delen.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => exportToExcel([data])} 
              className="flex items-center justify-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-md text-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FileUp size={24} /> Excel-export Downloaden
            </button>
            <button 
              onClick={onBack}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-xl transition-colors text-lg"
            >
              Klaar, terug naar Dashboard
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
