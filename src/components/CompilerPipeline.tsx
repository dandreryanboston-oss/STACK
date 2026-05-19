/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Code, Disc, Cpu, Terminal, Binary } from 'lucide-react';
import { TRANSLATIONS, Lang } from '../translations';

interface CompilerPipelineProps {
  currentPhase: 'source' | 'lexer' | 'parser' | 'codegen' | 'vm';
  onPhaseSelect: (phase: 'source' | 'lexer' | 'parser' | 'codegen' | 'vm') => void;
  tokenCount: number;
  instructionCount: number;
  hasErrors: boolean;
  lang: Lang;
}

export const CompilerPipeline: React.FC<CompilerPipelineProps> = ({
  currentPhase,
  onPhaseSelect,
  tokenCount,
  instructionCount,
  hasErrors,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  const pipelineStages = [
    {
      id: 'source' as const,
      name: t.source_code_name,
      icon: Code,
      color: 'from-amber-400 to-orange-500',
      shadowColor: 'rgba(245, 158, 11, 0.25)',
      description: t.source_code_desc,
      stat: t.phase_one,
    },
    {
      id: 'lexer' as const,
      name: t.lexer_name,
      icon: Disc,
      color: 'from-blue-400 to-indigo-500',
      shadowColor: 'rgba(59, 130, 246, 0.25)',
      description: t.lexer_desc,
      stat: tokenCount > 0 ? t.tokens_count.replace('{count}', String(tokenCount)) : t.lexer_idle,
    },
    {
      id: 'parser' as const,
      name: t.parser_name,
      icon: Binary,
      color: 'from-purple-400 to-pink-500',
      shadowColor: 'rgba(168, 85, 247, 0.25)',
      description: t.parser_desc,
      stat: hasErrors ? t.syntax_error : t.tree_valid,
    },
    {
      id: 'codegen' as const,
      name: t.codegen_name,
      icon: Cpu,
      color: 'from-teal-400 to-emerald-500',
      shadowColor: 'rgba(20, 184, 166, 0.25)',
      description: t.codegen_desc,
      stat: instructionCount > 0 ? t.instructions_count.replace('{count}', String(instructionCount)) : t.codegen_idle,
    },
    {
      id: 'vm' as const,
      name: t.vm_name,
      icon: Terminal,
      color: 'from-rose-400 to-red-500',
      shadowColor: 'rgba(244, 63, 94, 0.25)',
      description: t.vm_desc,
      stat: t.step_simulator,
    },
  ];

  return (
    <div className="bg-[#0f172a]/50 border border-[#1e293b] rounded-xl p-5 shadow-2xl relative overflow-hidden" id="pipeline-container">
      {/* Dark Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="p-1 px-2 rounded text-xs bg-[#1e293b] text-indigo-400 border border-[#334155] font-mono">{t.educational_map}</span>
            {t.pipeline_title}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t.pipeline_desc}
          </p>
        </div>
        {hasErrors && (
          <span className="text-xs font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full animate-pulse self-start">
            ⚠️ {t.comp_failed}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 relative z-10">
        {pipelineStages.map((stage, idx) => {
          const IconComponent = stage.icon;
          const isActive = currentPhase === stage.id;

          return (
            <React.Fragment key={stage.id}>
              <button
                onClick={() => onPhaseSelect(stage.id)}
                className={`group flex flex-col relative text-left p-4 rounded-xl border transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-br from-[#0f172a] to-[#020617] border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/5'
                    : 'bg-[#020617]/50 hover:bg-[#0f172a]/80 border-[#1e293b] hover:border-[#334155] shadow'
                }`}
                style={{
                  boxShadow: isActive ? `0 10px 25px ${stage.shadowColor}` : undefined,
                }}
                id={`pipeline-stage-${stage.id}`}
              >
                {/* Decorative Pill/Indicator */}
                <div className="flex items-center justify-between w-full mb-3">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-tr ${stage.color} text-slate-900 shadow-md transform group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent className="w-4 h-4 text-slate-950 font-bold" />
                  </div>
                  <span className="text-[10px] font-mono bg-[#1e293b] px-2 py-0.5 rounded text-slate-400 border border-[#334155]/50">
                    {stage.stat}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-slate-200">{stage.name}</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-tight group-hover:text-slate-300 transition-colors">
                  {stage.description}
                </p>

                {/* Active Indicator Bar */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-xl transition-all duration-300 ${
                    isActive ? `bg-gradient-to-r ${stage.color}` : 'bg-transparent'
                  }`}
                />
              </button>

              {/* Show Desktop Connecting Arrows */}
              {idx < pipelineStages.length - 1 && (
                <div className="hidden md:flex items-center justify-center pointer-events-none self-center z-20">
                  <ArrowRight className="w-5 h-5 text-slate-700 animate-pulse" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
