/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowUp, HelpCircle, HardDrive } from 'lucide-react';
import { TRANSLATIONS, Lang } from '../translations';

interface VMStackProps {
  stack: (number | boolean)[];
  lang: Lang;
}

export const VMStack: React.FC<VMStackProps> = ({ stack, lang }) => {
  // We reverse the stack for visual growth going upward! (TOP of the stack should display on TOP of the visual container)
  const reversedStack = [...stack].reverse();
  const t = TRANSLATIONS[lang];

  return (
    <div className="bg-[#0f172a]/50 border border-[#1e293b] rounded-xl p-5 shadow-2xl flex flex-col h-full overflow-hidden" id="vm-stack-visualizer-container">
      {/* Title Header */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-indigo-400" />
          {t.stack_title}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {t.stack_desc}
        </p>
      </div>

      {/* Visual Stack Chamber */}
      <div className="flex-1 flex flex-col items-center justify-end min-h-[220px] bg-[#020617]/40 rounded-xl p-4 border border-[#1e293b] relative">
        {/* Background Depth Bars */}
        <div className="absolute inset-x-8 top-4 bottom-4 border-l border-r border-[#1e293b]/30 border-dashed pointer-events-none" />

        {reversedStack.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 text-xs italic select-none">
            <span className="font-mono text-[10px] text-slate-400">{t.empty_stack_title}</span>
            <span className="text-[9px] text-slate-600 mt-0.5">{t.empty_stack_desc}</span>
          </div>
        ) : (
          <div className="w-full max-w-[240px] flex flex-col gap-2 z-10 overflow-y-auto max-h-[240px] scrollbar-none py-1 pr-1">
            {reversedStack.map((value, idx) => {
              const originalIndex = stack.length - 1 - idx;
              const isTop = idx === 0;

              return (
                <div
                  key={originalIndex}
                  className={`relative flex items-center justify-between p-3 rounded-lg border transition-all duration-300 transform scale-100 font-mono text-xs ${
                    isTop
                      ? 'bg-gradient-to-r from-indigo-950/60 to-indigo-900/40 text-indigo-300 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)] font-bold animate-pulse'
                      : 'bg-[#0f172a]/80 text-slate-300 border-[#1e293b]/80'
                  }`}
                  id={`stack-slot-${originalIndex}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-[#020617] px-1.5 py-0.5 rounded text-slate-500 border border-[#1e293b]/55">
                      [{originalIndex}]
                    </span>
                    <span className="text-xs font-semibold select-all font-mono leading-none">
                      {typeof value === 'boolean' ? (value ? 'true' : 'false') : value}
                    </span>
                  </div>

                  {/* Top pointer text label */}
                  {isTop && (
                    <span className="bg-indigo-500/10 border border-indigo-500/30 text-[9px] text-indigo-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm animate-bounce">
                      <ArrowUp className="w-2.5 h-2.5" /> {lang === 'es' ? 'TOPE' : 'TOP'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#1e293b] text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
        <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
        <span>{t.stack_note}</span>
      </div>
    </div>
  );
};
