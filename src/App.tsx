/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Globe, RefreshCcw, Github, Info, Languages, MessageSquare, Calculator as CalcIcon, X, Percent, Delete, Divide, Minus, Plus, Equal } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

// Lazy initialize Gemini API to handle missing keys gracefully in production
let aiInstance: GoogleGenAI | null = null;
function getAi() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY no configurada. Por favor, añádela en la configuración del proyecto.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

const LANGUAGES = [
  { code: 'es', name: 'Español', greeting: 'Hola Mundo' },
  { code: 'it', name: 'Italiano', greeting: 'Ciao Mondo' },
  { code: 'en', name: 'English', greeting: 'Hello World' },
];

const STYLES = [
  'Poético',
  'Científico',
  'Pirata',
  'Futurista',
  'Minimalista',
  'Cínico'
];

export default function App() {
  const [currentLang, setCurrentLang] = useState(0);
  const [selectedAiLang, setSelectedAiLang] = useState('es');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);

  // Calculator State
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcFormula, setCalcFormula] = useState('');
  
  const handleCalcInput = (val: string) => {
    if (calcDisplay === '0' && !['+', '-', '*', '/'].includes(val)) {
      setCalcDisplay(val);
    } else {
      setCalcDisplay(prev => prev + val);
    }
  };

  const clearCalc = () => {
    setCalcDisplay('0');
    setCalcFormula('');
  };

  const calculateResult = () => {
    try {
      // Using direct eval for simplicity in this demo environment, 
      // though typically not recommended for production user input.
      // Cleaning input to allow only math chars
      const sanitized = calcDisplay.replace(/[^-+/*0-9.]/g, '');
      const result = eval(sanitized);
      setCalcFormula(sanitized + ' =');
      setCalcDisplay(String(result));
    } catch {
      setCalcDisplay('Error');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLang((prev) => (prev + 1) % LANGUAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const generateGreeting = async () => {
    setIsAiLoading(true);
    setAiMessage(null);
    const langName = selectedAiLang === 'es' ? 'Español' : 'Italiano';
    try {
      const ai = getAi();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Genera un saludo de "Hola Mundo" creativo y original en idioma ${langName} y en el estilo: ${selectedStyle}. Debe ser breve pero impactante. No uses negritas excesivas.`,
      });
      setAiMessage(response.text || "No se pudo generar el mensaje.");
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Error al conectar con la IA.";
      setAiMessage(errorMessage);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="ambient-glow top-[-100px] left-[-100px] bg-cyan-500/10" />
        <div className="ambient-glow bottom-[-200px] right-[-100px] bg-purple-600/10" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-24">
        {/* Navigation/Header */}
        <nav className="flex justify-between items-center mb-16 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <img 
              src="https://drive.google.com/thumbnail?id=1f9JxikfUhWBKp97mFgKjQYzfx4zYwdNt&sz=w500" 
              alt="Header Logo" 
              className="w-20 h-20 md:w-32 md:h-32 object-cover rounded-2xl border border-white/10 shadow-xl shadow-cyan-500/20"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2 font-mono text-xs tracking-tighter uppercase text-cyan-400">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                NEXUS_OS // Hello World v2.0
              </div>
              <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest hidden md:block">Connected to Global Node</div>
            </div>
          </motion.div>
          
          <div className="flex gap-6">
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              <Github size={20} />
            </a>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="mb-24 md:mb-48">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-[15vw] md:text-[10vw] font-black leading-[0.8] tracking-tighter uppercase italic select-none">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentLang}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="block neon-text"
                    id="hero-title"
                  >
                    {LANGUAGES[currentLang].greeting}
                  </motion.span>
                </AnimatePresence>
              </h1>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mt-8 flex flex-col md:flex-row gap-8 items-start md:items-end justify-between"
            >
              <p className="max-w-md text-xl text-gray-400 leading-relaxed">
                Una exploración avanzada del saludo más icónico de la historia del software. 
                Construido con <span className="text-cyan-400">Gemini AI</span>, 
                Vite y un toque de cinetismo.
              </p>
              
              <div className="flex gap-4">
                {LANGUAGES.map((l, i) => (
                  <button 
                    key={l.code}
                    onClick={() => setCurrentLang(i)}
                    className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${
                      currentLang === i 
                      ? 'bg-cyan-500 text-black border-cyan-500 shadow-lg shadow-cyan-500/20' 
                      : 'border-white/20 text-white/40 hover:border-white/50'
                    }`}
                  >
                    {l.code}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Gemini Integration Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start h-auto">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-3xl glass-card relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6 text-cyan-400">
                <Sparkles size={24} />
                <h2 className="text-xl font-bold tracking-tight uppercase">Generador de Saludos IA</h2>
              </div>
              
              <p className="text-gray-400 mb-8 max-w-sm">
                Utiliza la potencia de **Gemini 3 Flash** para generar versiones únicas de "Hola Mundo" en diferentes estilos narrativos.
              </p>

              <div className="flex gap-4 mb-6">
                <button 
                  onClick={() => setSelectedAiLang('es')}
                  className={`flex-1 py-2 rounded-xl text-xs uppercase tracking-widest border transition-all ${
                    selectedAiLang === 'es' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 font-bold' : 'border-white/10 text-white/30 hover:border-white/20'
                  }`}
                >
                  Español
                </button>
                <button 
                  onClick={() => setSelectedAiLang('it')}
                  className={`flex-1 py-2 rounded-xl text-xs uppercase tracking-widest border transition-all ${
                    selectedAiLang === 'it' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 font-bold' : 'border-white/10 text-white/30 hover:border-white/20'
                  }`}
                >
                  Italiano
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`px-4 py-2 rounded-xl text-sm transition-all ${
                      selectedStyle === style 
                      ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 font-bold' 
                      : 'bg-white/5 hover:bg-white/10 text-white/50'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>

              <button
                onClick={generateGreeting}
                disabled={isAiLoading}
                className="w-full py-4 rounded-xl bg-cyan-500 text-black font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
              >
                {isAiLoading ? (
                  <RefreshCcw className="animate-spin" size={20} />
                ) : (
                  <>
                    <MessageSquare size={20} />
                    Generar Saludo
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* AI Response Area */}
          <div className="min-h-[300px] flex flex-col">
            <AnimatePresence mode="wait">
              {aiMessage || isAiLoading ? (
                <motion.div
                  key={aiMessage || 'loading'}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="flex-1 p-8 md:p-12 rounded-3xl glass-card flex flex-col justify-center"
                >
                  {isAiLoading ? (
                    <div className="space-y-4">
                      <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
                      <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse" />
                      <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse" />
                    </div>
                  ) : (
                    <div className="prose prose-invert prose-cyan max-w-none">
                      <div className="text-cyan-400/40 text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Globe size={12} />
                        Mensaje Generado por Gemini
                      </div>
                      <div className="text-2xl md:text-3xl font-medium italic serif leading-tight text-gray-200">
                        <Markdown>{aiMessage || ''}</Markdown>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center glass-card border-dashed border-white/10 rounded-3xl text-white/20"
                >
                  <Languages size={48} strokeWidth={1} className="mb-4" />
                  <p className="text-sm">Selecciona un estilo y presiona generar</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="mt-32">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-[1px] flex-1 bg-white/10" />
            <div className="flex items-center gap-2 text-cyan-400/50 uppercase tracking-[0.2em] text-[10px] font-mono">
              <CalcIcon size={14} />
              Auxiliary System: Calculator
            </div>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>

          <div className="flex justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full max-w-sm glass-card rounded-[2.5rem] p-8 overflow-hidden relative group"
            >
              {/* Display Area */}
              <div className="mb-8 text-right pr-4">
                <div className="text-xs font-mono text-cyan-400/40 h-4 mb-1">
                  {calcFormula}
                </div>
                <div className="text-4xl font-mono text-white tracking-tighter truncate">
                  {calcDisplay}
                </div>
              </div>

              {/* Pad Area */}
              <div className="grid grid-cols-4 gap-3">
                <button onClick={clearCalc} className="h-14 rounded-2xl bg-white/5 hover:bg-red-500/20 text-red-400 transition-colors font-bold text-lg">AC</button>
                <button onClick={() => handleCalcInput('/')} className="h-14 rounded-2xl bg-white/5 hover:bg-cyan-500/20 text-cyan-400 transition-colors flex items-center justify-center"><Divide size={18} /></button>
                <button onClick={() => handleCalcInput('*')} className="h-14 rounded-2xl bg-white/5 hover:bg-cyan-500/20 text-cyan-400 transition-colors flex items-center justify-center"><X size={18} /></button>
                <button onClick={() => setCalcDisplay(prev => prev.slice(0, -1) || '0')} className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center"><Delete size={18} /></button>

                {[7, 8, 9].map(n => (
                  <button key={n} onClick={() => handleCalcInput(String(n))} className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors text-lg font-medium">{n}</button>
                ))}
                <button onClick={() => handleCalcInput('-')} className="h-14 rounded-2xl bg-white/5 hover:bg-cyan-500/20 text-cyan-400 transition-colors flex items-center justify-center"><Minus size={18} /></button>

                {[4, 5, 6].map(n => (
                  <button key={n} onClick={() => handleCalcInput(String(n))} className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors text-lg font-medium">{n}</button>
                ))}
                <button onClick={() => handleCalcInput('+')} className="h-14 rounded-2xl bg-white/5 hover:bg-cyan-500/20 text-cyan-400 transition-colors flex items-center justify-center"><Plus size={18} /></button>

                {[1, 2, 3].map(n => (
                  <button key={n} onClick={() => handleCalcInput(String(n))} className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors text-lg font-medium">{n}</button>
                ))}
                <button onClick={calculateResult} className="row-span-2 h-auto rounded-2xl bg-cyan-500 text-black hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-cyan-500/20"><Equal size={24} /></button>

                <button onClick={() => handleCalcInput('0')} className="col-span-2 h-14 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors text-lg font-medium text-left px-8">0</button>
                <button onClick={() => handleCalcInput('.')} className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors text-lg font-bold">.</button>
              </div>

              {/* Decorative side accent */}
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          </div>
        </section>

        {/* Technical Specs Bento-ish (Mini) */}
        <section className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-card">
            <div className="text-[10px] uppercase text-gray-500 tracking-widest mb-2">Framework</div>
            <div className="text-sm font-mono leading-none text-cyan-400">React 19 + Vite 6</div>
          </div>
          <div className="p-6 rounded-2xl glass-card">
            <div className="text-[10px] uppercase text-gray-500 tracking-widest mb-2">Animations</div>
            <div className="text-sm font-mono leading-none text-purple-400">Motion (fka Framer)</div>
          </div>
          <div className="p-6 rounded-2xl glass-card">
            <div className="text-[10px] uppercase text-gray-500 tracking-widest mb-2">AI Component</div>
            <div className="text-sm font-mono leading-none text-white">@google/genai SDK</div>
          </div>
        </section>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 text-[10px] uppercase tracking-widest font-mono">
          <div>SYSTEM_VERSION: 1.0.4-BUILD_BETA</div>
          <div className="flex gap-8">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-cyan-400">ACTIVE</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              All systems operational
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
