/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import {
  Code,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Sparkles,
  Terminal,
  Cpu,
  Layers,
  FileCode2,
  BookOpen,
  MonitorPlay,
  Github,
  HelpCircle,
  Database,
  Info,
  Globe
} from 'lucide-react';

import { compileSource } from './compiler';
import { VirtualMachine } from './vm';
import { PRESETS_EN, PRESETS_ES } from './presets';
import { CompilerResult, VMState } from './types';
import { TRANSLATIONS, Lang } from './translations';

// Components
import { CompilerPipeline } from './components/CompilerPipeline';
import { SourceEditor } from './components/SourceEditor';
import { TokenList } from './components/TokenList';
import { SyntaxTreeViewer } from './components/SyntaxTreeViewer';
import { BytecodeViewer } from './components/BytecodeViewer';
import { VMConsole } from './components/VMConsole';
import { VMStack } from './components/VMStack';
import { MemoryTable } from './components/MemoryTable';

export default function App() {
  // 0. Language Toggle State
  const [lang, setLang] = useState<Lang>('en');
  const t = TRANSLATIONS[lang];
  const activePresets = lang === 'en' ? PRESETS_EN : PRESETS_ES;

  // 1. Core Code and Compiler State
  const [code, setCode] = useState<string>(activePresets[0].code);
  const [compilerResult, setCompilerResult] = useState<CompilerResult>(
    compileSource(activePresets[0].code)
  );

  // 2. VM Simulation Engine State
  const [vmInstance, setVmInstance] = useState<VirtualMachine | null>(null);
  const [vmState, setVmState] = useState<VMState | null>(null);

  // 3. Simulation Timer controls
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(500); // cycle timer interval
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 4. Sub-panel detail tabs focus
  const [activeTab, setActiveTab] = useState<'tokens' | 'ast' | 'diagnostics'>('ast');
  const [activePipelinePhase, setActivePipelinePhase] = useState<'source' | 'lexer' | 'parser' | 'codegen' | 'vm'>(
    'source'
  );

  // Compiles source and bootstraps VM simulator
  const handleCompile = (sourceCodeToCompile = code) => {
    // Stop any currently running timer to avoid cross-triggers
    if (isPlaying) {
      setIsPlaying(false);
    }

    const result = compileSource(sourceCodeToCompile);
    setCompilerResult(result);

    if (result.errors.length === 0 && result.instructions.length > 0) {
      const vmObj = new VirtualMachine(result.instructions);
      setVmInstance(vmObj);
      setVmState(vmObj.getState());
      setActivePipelinePhase('codegen');
    } else {
      setVmInstance(null);
      setVmState(null);
      setActivePipelinePhase('source');
    }
  };

  // Re-compile whenever code changes for instant educational feedback
  useEffect(() => {
    handleCompile(code);
  }, [code]);

  // Handle Preset quick choice
  const handlePresetSelect = (preset: typeof PRESETS_EN[0]) => {
    setCode(preset.code);
    handleCompile(preset.code);
    setActivePipelinePhase('source');
  };

  // Run/Pause Toggle
  const togglePlay = () => {
    if (!vmInstance || compilerResult.errors.length > 0) return;
    setIsPlaying(!isPlaying);
    setActivePipelinePhase('vm');
  };

  // Simulator step forwards
  const handleStepForward = () => {
    if (!vmInstance) return;
    setIsPlaying(false);
    const nextState = vmInstance.stepForward();
    setVmState(nextState);
    setActivePipelinePhase('vm');
  };

  // Simulator step backwards (using snapshots)
  const handleStepBackward = () => {
    if (!vmInstance) return;
    setIsPlaying(false);
    const ok = vmInstance.stepBackward();
    if (ok) {
      setVmState(vmInstance.getState());
      setActivePipelinePhase('vm');
    }
  };

  // VM state resetter
  const handleReset = () => {
    setIsPlaying(false);
    if (vmInstance) {
      vmInstance.reset();
      setVmState(vmInstance.getState());
    }
    setActivePipelinePhase('codegen');
  };

  // Effect to manage simulation tick speed
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        if (vmInstance && vmState) {
          if (vmState.status === 'completed' || vmState.status === 'error') {
            setIsPlaying(false);
          } else {
            const nextState = vmInstance.stepForward();
            setVmState(nextState);
          }
        }
      }, speedMs);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, speedMs, vmInstance, vmState]);

  // Maps active instruction IP index back to some high-level code line number
  const getCurrentSourceLine = (): number | undefined => {
    if (!vmState || !compilerResult.instructions || vmState.ip >= compilerResult.instructions.length) {
      return undefined;
    }
    return compilerResult.instructions[vmState.ip].line;
  };

  // Trigger phase selecting from CompilerPipeline mapping
  const handlePipelinePhaseSelect = (phase: typeof activePipelinePhase) => {
    setActivePipelinePhase(phase);
    if (phase === 'lexer') {
      setActiveTab('tokens');
    } else if (phase === 'parser') {
      setActiveTab('ast');
    } else if (phase === 'codegen' || phase === 'vm') {
      setActiveTab('diagnostics');
    }
  };

  return (
    <div className="bg-[#020617] min-h-screen text-slate-100 flex flex-col font-sans select-none" id="applet-root">
      {/* Upper Navigation Row Header */}
      <header className="bg-[#0f172a]/95 border-b border-[#1e293b] backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-2 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] border border-indigo-400/20 active:scale-95 transition-transform cursor-pointer">
            <Cpu className="w-5.5 h-5.5 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-50 via-slate-100 to-indigo-300 bg-clip-text text-transparent">
              {t.app_title}
            </h1>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
              {t.app_subtitle}
            </p>
          </div>
        </div>

        {/* Dynamic Language Toggle & Indicators wrapper */}
        <div className="flex items-center gap-5">
          {/* Language Toggle Button */}
          <button
            onClick={() => {
              const nextLang = lang === 'en' ? 'es' : 'en';
              setLang(nextLang);
              // Automap preset code if user hasn't edited significantly, or let them load new presets comfortably
              const oldPresets = lang === 'en' ? PRESETS_EN : PRESETS_ES;
              const nextPresets = nextLang === 'en' ? PRESETS_EN : PRESETS_ES;
              const matchIdx = oldPresets.findIndex((p) => p.code.trim() === code.trim());
              if (matchIdx !== -1) {
                setCode(nextPresets[matchIdx].code);
                handleCompile(nextPresets[matchIdx].code);
              } else if (code === PRESETS_EN[0].code || code === PRESETS_ES[0].code) {
                setCode(nextPresets[0].code);
                handleCompile(nextPresets[0].code);
              }
            }}
            className="px-3.5 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
            id="lang-toggle-btn"
            title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
          >
            <Globe className="w-3.5 h-3.5 animate-spin-slow" />
            <span>{lang === 'en' ? 'ESP' : 'ENG'}</span>
          </button>

          {/* Global info indicators */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
            <div className="bg-[#020617] border border-[#1e293b] px-3.5 py-1.5 rounded-lg flex items-center gap-2">
              <span className="text-slate-500">{t.status_tokens}</span>
              <span className="text-indigo-400 font-bold">{compilerResult.tokens.length}</span>
            </div>
            <div className="bg-[#020617] border border-[#1e293b] px-3.5 py-1.5 rounded-lg flex items-center gap-2">
              <span className="text-slate-500">{t.status_bytecode}</span>
              <span className="text-indigo-400 font-bold">{compilerResult.instructions.length} {lang === 'es' ? 'inst' : 'inst'}</span>
            </div>
            <div className="bg-[#020617] border border-[#1e293b] px-3.5 py-1.5 rounded-lg flex items-center gap-2">
              <span className="text-slate-500">{t.status_vm_status}</span>
              <span
                className={`font-bold uppercase ${
                  vmState?.status === 'running'
                    ? 'text-indigo-400 animate-pulse'
                    : vmState?.status === 'error'
                    ? 'text-rose-400 font-bold'
                    : vmState?.status === 'completed'
                    ? 'text-yellow-400'
                    : 'text-slate-400'
                }`}
              >
                {vmState ? (lang === 'es' && vmState.status === 'completed' ? 'finalizado' : vmState.status) : 'idle'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container workspace */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full flex flex-col gap-6">
        {/* Row 1 — Interactive Pipeline Diagram */}
        <CompilerPipeline
          currentPhase={activePipelinePhase}
          onPhaseSelect={handlePipelinePhaseSelect}
          tokenCount={compilerResult.tokens.length}
          instructionCount={compilerResult.instructions.length}
          hasErrors={compilerResult.errors.length > 0}
          lang={lang}
        />

        {/* Interactive VM Control Dashboard Bar */}
        <section className="bg-[#0f172a]/50 border border-[#1e293b] p-4 rounded-xl flex flex-wrap gap-5 items-center justify-between shadow-2xl relative z-10" id="controls-panel">
          <div className="flex flex-wrap items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              disabled={compilerResult.errors.length > 0 || !vmInstance}
              className={`px-4 py-2 rounded font-mono text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 border shadow-md ${
                compilerResult.errors.length > 0 || !vmInstance
                  ? 'bg-slate-950/20 text-slate-600 border-slate-800 cursor-not-allowed shadow-none'
                  : isPlaying
                  ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500/30'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" /> {t.btn_pause_sim}
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" /> {t.btn_run_sim}
                </>
              )}
            </button>

            {/* Step Forwards */}
            <button
              onClick={handleStepForward}
              disabled={compilerResult.errors.length > 0 || !vmInstance || vmState?.status === 'completed'}
              className="bg-[#020617] hover:bg-[#0f172a]/80 text-slate-200 border border-[#1e293b] disabled:opacity-40 disabled:cursor-not-allowed px-3.5 py-2 rounded text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow active:scale-95 transition-all"
              title={lang === 'es' ? 'Avanzar un paso de instrucción bytecode' : 'Step forwards one instruction bytecode step'}
            >
              <SkipForward className="w-3.5 h-3.5" /> {t.btn_step_inst}
            </button>

            {/* Step Backwards */}
            <button
              onClick={handleStepBackward}
              disabled={!vmInstance || vmInstance.getHistoryLength() === 0}
              className="bg-[#020617] hover:bg-[#0f172a]/80 text-slate-200 border border-[#1e293b] disabled:opacity-40 disabled:cursor-not-allowed px-3.5 py-2 rounded text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow active:scale-95 transition-all"
              title={lang === 'es' ? 'Retroceder un paso en el historial virtual' : 'Step backward in virtual history steps'}
            >
              <SkipBack className="w-3.5 h-3.5" /> {t.btn_step_back}
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              disabled={!vmInstance}
              className="bg-[#020617] hover:bg-[#0f172a] text-slate-400 hover:text-slate-200 border border-[#1e293b] px-3.5 py-2 rounded text-xs font-mono flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <RotateCcw className="w-3.5 h-3.5" /> {t.btn_reset_vm}
            </button>
          </div>

          {/* Speed range sliders */}
          <div className="flex items-center gap-3 w-full sm:w-auto font-mono text-xs">
            <span className="text-slate-500 text-[11px]">{t.clock_speed}</span>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={speedMs}
              onChange={(e) => setSpeedMs(parseInt(e.target.value, 10))}
              className="accent-indigo-500 cursor-pointer w-24 xs:w-32"
            />
            <span className="text-indigo-400 font-bold bg-[#020617] border border-[#1e293b] px-2.5 py-1 rounded min-w-[70px] text-center">
              {speedMs}ms
            </span>
          </div>
        </section>

        {/* Row 2 — Standard IDE Grid Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Column A: Source Workspace (40%) */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <SourceEditor
              code={code}
              onChange={setCode}
              onPresetSelect={handlePresetSelect}
              onCompile={() => handleCompile(code)}
              errors={compilerResult.errors}
              currentHighlightLine={getCurrentSourceLine()}
              presets={activePresets}
              lang={lang}
            />
          </div>

          {/* Column B: Intermediate Bytecode Pointers (40%) */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <BytecodeViewer
              instructions={compilerResult.instructions}
              ip={vmState?.ip || 0}
              lang={lang}
            />
          </div>

          {/* Column C: VM RAM Memory & Runtime LIFO Stack (20%) */}
          <div className="lg:col-span-3 flex flex-col h-full gap-6">
            <div className="flex-1">
              <VMStack stack={vmState?.stack || []} lang={lang} />
            </div>
          </div>
        </section>

        {/* Column D/E Row: Console Output & Variable grid variables */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-full">
            <MemoryTable variables={vmState?.variables || {}} lang={lang} />
          </div>
          <div className="h-full">
            <VMConsole
              consoleLogs={vmState?.console || []}
              systemLogs={vmState?.instructionLog || []}
              onClear={() => {
                if (vmInstance && vmState) {
                  // We also clear the console inside the VM state
                  vmState.console = [];
                  vmState.instructionLog = [];
                  setVmState({ ...vmState });
                }
              }}
              lang={lang}
            />
          </div>
        </section>

        {/* Row 3 — Inspection Tabbed Workspaces */}
        <section className="bg-[#0f172a]/50 border border-[#1e293b] rounded-xl p-5 shadow-2xl flex flex-col" id="diagnostics-subworkspace">
          {/* Tab Selection */}
          <div className="flex border-b border-[#1e293b] pb-3 mb-4 items-center justify-between flex-wrap gap-3">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('ast')}
                className={`px-4 py-2 rounded text-xs font-mono font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'ast'
                    ? 'bg-indigo-600 text-slate-100 shadow-md'
                    : 'bg-[#020617] text-slate-400 hover:text-slate-200 border border-[#1e293b] hover:border-[#334155]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> {t.tab_ast_title}
              </button>
              <button
                onClick={() => setActiveTab('tokens')}
                className={`px-4 py-2 rounded text-xs font-mono font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'tokens'
                    ? 'bg-indigo-600 text-slate-100 shadow-md'
                    : 'bg-[#020617] text-slate-400 hover:text-slate-200 border border-[#1e293b] hover:border-[#334155]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> {t.tab_tokens_title}
              </button>
            </div>

            {/* Diagnostic Details label */}
            <span className="text-[10px] font-mono text-slate-400 bg-[#020617] border border-[#1e293b] px-3 py-1 rounded flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-indigo-400" /> {t.tab_tip}
            </span>
          </div>

          {/* Render Active Workspace Area */}
          <div className="min-h-[200px]">
            {activeTab === 'tokens' ? (
              <TokenList tokens={compilerResult.tokens} lang={lang} />
            ) : (
              <SyntaxTreeViewer ast={compilerResult.ast} lang={lang} />
            )}
          </div>
        </section>
      </main>

      {/* Interactive Footer Panel */}
      <footer className="bg-[#0f172a]/25 border-t border-[#1e293b] mt-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span>{t.footer_companion}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono">{t.footer_env}</span>
        </div>
      </footer>
    </div>
  );
}
