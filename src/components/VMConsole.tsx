/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, ShieldClose, Trash2, Layers, Cpu, Copy, CheckCircle } from 'lucide-react';
import { TRANSLATIONS, Lang } from '../translations';

interface VMConsoleProps {
  consoleLogs: string[];
  systemLogs: string[];
  onClear: () => void;
  lang: Lang;
}

export const VMConsole: React.FC<VMConsoleProps> = ({ consoleLogs, systemLogs, onClear, lang }) => {
  const [activeTab, setActiveTab] = useState<'output' | 'debugger'>('output');
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs, systemLogs, activeTab]);

  const handleCopy = () => {
    const logsToCopy = activeTab === 'output' ? consoleLogs.join('\n') : systemLogs.join('\n');
    navigator.clipboard.writeText(logsToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0f172a]/50 border border-[#1e293b] rounded-xl shadow-2xl flex flex-col h-full overflow-hidden" id="vm-console-container">
      {/* Shell Bar Header Tabs */}
      <div className="bg-[#0f172a] border-b border-[#1e293b] px-4 py-2 flex items-center justify-between gap-3">
        {/* Tab triggers */}
        <div className="flex gap-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab('output')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'output'
                ? 'bg-[#020617] text-indigo-400 border border-[#1e293b] font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" /> {t.tab_output} ({consoleLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('debugger')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'debugger'
                ? 'bg-[#020617] text-indigo-400 border border-[#1e293b] font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> {t.tab_diagnostics} ({systemLogs.length})
          </button>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded hover:bg-[#1e293b] transition-colors cursor-pointer"
            title={lang === 'es' ? 'Copiar registros' : 'Copy logs'}
          >
            {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClear}
            className="text-slate-400 hover:text-rose-400 p-1.5 rounded hover:bg-[#1e293b] transition-colors cursor-pointer"
            title={lang === 'es' ? 'Limpiar consola' : 'Clear console'}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal logs panel */}
      <div className="flex-1 p-4 font-mono text-xs overflow-y-auto max-h-[300px] scrollbar-thin bg-[#020617]/80 select-text flex flex-col gap-1 text-slate-100 min-h-[160px]">
        {activeTab === 'output' ? (
          consoleLogs.length === 0 ? (
            <div className="h-full flex-1 flex flex-col items-center justify-center text-slate-600 italic text-[11px] self-center my-10 select-none text-center">
              <span>{t.empty_console_title}</span>
              <span className="text-[10px] text-slate-700 mt-1">{t.empty_console_desc}</span>
            </div>
          ) : (
            consoleLogs.map((log, index) => (
              <div key={index} className="flex gap-2 items-start py-1 group leading-relaxed font-bold">
                <span className="text-slate-600 select-none">$</span>
                <span className="text-slate-100 bg-[#0f172a] border border-[#1e293b]/70 rounded px-2.5 py-1 shadow-sm font-sans text-sm tracking-wide">
                  {log}
                </span>
              </div>
            ))
          )
        ) : systemLogs.length === 0 ? (
          <div className="h-full flex-1 flex flex-col items-center justify-center text-slate-600 italic text-[11px] self-center my-10 select-none text-center">
            <span>{t.empty_diag_title}</span>
            <span className="text-[10px] text-slate-700 mt-1">{t.empty_diag_desc}</span>
          </div>
        ) : (
          systemLogs.map((log, index) => {
            const isError = log.includes('[ERROR]');
            const isHalt = log.includes('HALT') || log.includes('finished') || log.includes('finalizado');

            return (
              <div
                key={index}
                className={`py-1 border-b border-[#1e293b]/60 leading-relaxed text-[11px] ${
                  isError
                    ? 'text-rose-400 bg-rose-500/10 px-2 rounded border border-rose-950 font-bold'
                    : isHalt
                    ? 'text-yellow-400 font-semibold'
                    : 'text-slate-300'
                }`}
              >
                {log}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
