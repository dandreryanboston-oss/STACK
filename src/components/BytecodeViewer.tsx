/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { Binary, ArrowUpRight, CheckCircle } from 'lucide-react';
import { VMInstruction } from '../types';
import { TRANSLATIONS, Lang } from '../translations';

interface BytecodeViewerProps {
  instructions: VMInstruction[];
  ip: number; // Current instruction pointer index
  lang: Lang;
}

export const BytecodeViewer: React.FC<BytecodeViewerProps> = ({ instructions, ip, lang }) => {
  const activeRowRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];

  // Auto scroll active row into center visibility
  useEffect(() => {
    if (activeRowRef.current) {
      activeRowRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [ip]);

  // Decides operator color highlighting
  const getOpColor = (op: string) => {
    switch (op) {
      case 'PUSH':
        return 'text-emerald-400 font-bold';
      case 'STORE':
        return 'text-sky-400 font-bold';
      case 'LOAD':
        return 'text-indigo-400 font-bold';
      case 'ADD':
      case 'SUB':
      case 'MUL':
      case 'DIV':
        return 'text-amber-400 font-bold';
      case 'PRINT':
        return 'text-violet-400 font-bold';
      case 'JMP_IF_FALSE':
      case 'JMP':
        return 'text-rose-400 font-bold';
      case 'HALT':
        return 'text-red-400 font-bold';
      default:
        return 'text-slate-100 font-bold';
    }
  };

  return (
    <div className="bg-[#0f172a]/50 border border-[#1e293b] rounded-xl p-5 shadow-2xl flex flex-col h-full overflow-hidden" id="bytecode-viewer-container">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span className="p-1 px-2 rounded text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 font-mono">
              {t.phase_four}
            </span>
            {t.bytecode_panel_title}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {t.bytecode_panel_desc}
          </p>
        </div>
        <span className="text-[10px] font-mono text-slate-300 bg-[#020617] px-2 py-1 rounded border border-[#1e293b]">
          {t.ip_tracker.replace('{ip}', String(ip)).replace('{total}', String(instructions.length))}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[350px] scrollbar-thin space-y-1.5 pr-1.5">
        {instructions.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-slate-500 border border-dashed border-[#1e293b] rounded-xl bg-[#020617]/40">
            <span className="text-xs font-mono text-slate-400">{t.empty_bytecode_title}</span>
            <span className="text-[10px] text-slate-600 mt-1">{t.empty_bytecode_desc}</span>
          </div>
        ) : (
          instructions.map((inst, index) => {
            const isActive = index === ip;
            const hasExecuted = index < ip;

            return (
              <div
                key={inst.id}
                ref={isActive ? activeRowRef : null}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border font-mono text-xs transition-all ${
                  isActive
                    ? 'bg-[#020617] text-slate-100 border-indigo-500 ring-1 ring-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)] font-semibold'
                    : hasExecuted
                    ? 'bg-[#0f172a]/20 text-slate-500 border-[#020617]'
                    : 'bg-[#020617]/30 text-slate-300 border-[#1e293b]/70 hover:border-[#334155] hover:bg-[#0f172a]/40'
                }`}
                id={`bytecode-row-${index}`}
              >
                {/* ID Prefix / IP Pointer Column */}
                <div className="w-14 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>{String(index).padStart(3, '0')}</span>
                  {isActive ? (
                    <span className="text-indigo-400 animate-pulse text-xs">▶</span>
                  ) : hasExecuted ? (
                    <span className="text-slate-600 text-[10px]">✓</span>
                  ) : (
                    <span className="text-transparent">▶</span>
                  )}
                </div>

                {/* Opcode Label */}
                <span className={`w-28 tracking-wide uppercase ${getOpColor(inst.op)}`}>
                  {inst.op}
                </span>

                {/* Arguments highlight */}
                <span className="flex-1">
                  {inst.arg !== undefined && (
                    <span className="bg-[#020617] border border-[#1e293b] px-2 py-0.5 rounded text-amber-300 font-bold text-[11px]">
                      {inst.arg}
                    </span>
                  )}
                </span>

                {/* Source Line Mapping index badge */}
                {inst.line !== undefined && (
                  <span className="text-[9px] text-slate-500 font-sans flex items-center gap-0.5" title={lang === 'es' ? `Mapea a la línea ${inst.line} del código fuente.` : `Maps back to line ${inst.line} of high-level code.`}>
                    <ArrowUpRight className="w-2.5 h-2.5 text-slate-600" /> {lang === 'es' ? 'Línea' : 'Line'} {inst.line}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#1e293b] text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
        <span>{t.bytecode_note}</span>
      </div>
    </div>
  );
};
