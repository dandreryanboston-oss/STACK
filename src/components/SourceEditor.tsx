/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { Play, RotateCcw, Flame, Sparkles, HelpCircle, AlertCircle } from 'lucide-react';
import { ExamplePreset, CompilerError } from '../types';
import { TRANSLATIONS, Lang } from '../translations';

interface SourceEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  onPresetSelect: (preset: ExamplePreset) => void;
  onCompile: () => void;
  errors: CompilerError[];
  currentHighlightLine?: number; // Highlight executing line during debugging
  presets: ExamplePreset[];
  lang: Lang;
}

export const SourceEditor: React.FC<SourceEditorProps> = ({
  code,
  onChange,
  onPresetSelect,
  onCompile,
  errors,
  currentHighlightLine,
  presets,
  lang,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const t = TRANSLATIONS[lang];

  // Split lines to map line counters
  const totalLines = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(totalLines, 12) }, (_, i) => i + 1);

  // Sync scroll between linenums and editor
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const numbersEl = document.getElementById('line-numbers-col');
    if (numbersEl) {
      numbersEl.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const handlePresetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const preset = presets.find((p) => p.name === selectedName);
    if (preset) {
      onPresetSelect(preset);
    }
  };

  return (
    <div className="bg-[#0f172a]/50 border border-[#1e293b] rounded-xl shadow-2xl flex flex-col h-full overflow-hidden" id="editor-container">
      {/* Header Panel */}
      <div className="bg-[#0f172a] px-4 py-2.5 border-b border-[#1e293b] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-[11px] font-bold tracking-widest text-indigo-400 font-mono ml-2">{t.editor_title}</span>
          <span className="text-[10px] text-slate-500 font-mono">stacklang.sl</span>
        </div>

        {/* Load Preset Quick selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="presets-selector" className="text-xs text-slate-400 font-mono flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> {t.presets_label}
          </label>
          <select
            key={lang} // Forces select field update when language updates
            id="presets-selector"
            onChange={handlePresetSelect}
            className="bg-[#020617] border border-[#1e293b] text-xs text-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            defaultValue={presets[0]?.name}
          >
            {presets.map((preset) => (
              <option key={preset.name} value={preset.name}>
                {preset.name}
              </option>
            ))}
          </select>

          <button
            onClick={onCompile}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono px-3.5 py-1.5 rounded flex items-center gap-2 font-bold cursor-pointer transition-colors self-center shadow-lg active:scale-95 border border-indigo-500/30"
            id="compile-btn"
          >
            <Play className="w-3 h-3 fill-current" /> {t.compile_button}
          </button>
        </div>
      </div>

      {/* Editor Space */}
      <div className="flex-1 flex overflow-hidden relative min-h-[300px] bg-[#020617]">
        {/* Line Numbers column */}
        <div
          id="line-numbers-col"
          className="bg-[#0f172a]/20 text-right pr-3 pl-2 select-none font-mono text-xs text-slate-600 pt-3 border-r border-[#1e293b] flex flex-col gap-[1.125rem] overflow-y-hidden"
          style={{ width: '3.5rem' }}
        >
          {lineNumbers.map((num) => {
            const isExecuting = num === currentHighlightLine;
            const hasError = errors.some((err) => err.line === num);

            return (
              <div
                key={num}
                className={`transition-colors relative pr-1.5 ${
                  isExecuting
                    ? 'text-emerald-400 font-bold bg-emerald-500/10'
                    : hasError
                    ? 'text-rose-400 font-bold bg-rose-500/10'
                    : ''
                }`}
              >
                {num}
                {isExecuting && (
                  <span className="absolute right-0 top-0 text-[10px] text-emerald-400 font-mono animate-bounce">▶</span>
                )}
                {hasError && (
                  <span className="absolute right-0 top-0 text-[10px] text-rose-500 font-mono">●</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Text Area Input */}
        <div className="flex-1 relative bg-transparent">
          <textarea
            ref={textareaRef}
            id="lang-source-editor"
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            className="w-full h-full p-3 font-mono text-xs text-slate-300 bg-transparent resize-none border-0 focus:outline-none focus:ring-0 leading-loose"
            spellCheck="false"
            placeholder={lang === 'es' ? '# Escribe tu código aquí\nx = 5\nprint(x)' : '# Type your code here\nx = 5\nprint(x)'}
          />

          {/* Quick Syntax helper overlays */}
          <div className="absolute right-3 bottom-3 opacity-30 hover:opacity-100 transition-opacity bg-[#0f172a] p-3 rounded border border-[#1e293b] text-[10px] font-mono text-slate-400 max-w-xs pointer-events-none sm:pointer-events-auto shadow-xl">
            <div className="font-bold text-indigo-400 mb-1 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> {t.cheat_sheet_title}
            </div>
            <p>• {t.cheat_sheet_math}: <code className="text-emerald-300">result = 5 * (x + 3)</code></p>
            <p>• {t.cheat_sheet_output}: <code className="text-emerald-300">print(result)</code></p>
            <p>• {t.cheat_sheet_check}: <code className="text-emerald-300">if val &gt; 10 &#123; print(1) &#125;</code></p>
            <p>• {t.cheat_sheet_loops}: <code className="text-emerald-300">while a &lt; 5 &#123; a = a + 1 &#125;</code></p>
          </div>
        </div>
      </div>

      {/* Compiler Console / Local Error Output inside Panel */}
      {errors.length > 0 && (
        <div className="bg-rose-950/40 border-t border-rose-900/65 px-4 py-3">
          <div className="flex items-center gap-2 mb-2 text-rose-400 text-xs font-bold font-mono">
            <AlertCircle className="w-4 h-4 animate-bounce" /> {t.errors_header}
          </div>
          <div className="scrollbar-thin max-h-24 overflow-y-auto flex flex-col gap-1.5 pb-1">
            {errors.map((error, idx) => (
              <div
                key={idx}
                className="text-xs font-mono text-slate-300 flex items-start gap-2 bg-rose-500/10 p-2 rounded border border-rose-950"
              >
                <span className="text-rose-400 font-bold">{lang === 'es' ? 'Línea' : 'Line'} {error.line}:{error.column}</span>
                <span className="text-slate-400 font-sans">{error.message}</span>
                <span className="ml-auto text-[10px] font-mono bg-rose-900/60 px-1.5 py-0.5 rounded text-rose-300">
                  [{error.phase}]
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
