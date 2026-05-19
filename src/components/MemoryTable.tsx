/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Database, HelpCircle } from 'lucide-react';
import { TRANSLATIONS, Lang } from '../translations';

interface MemoryTableProps {
  variables: Record<string, number | boolean>;
  lang: Lang;
}

export const MemoryTable: React.FC<MemoryTableProps> = ({ variables, lang }) => {
  const variableKeys = Object.keys(variables);
  const t = TRANSLATIONS[lang];

  return (
    <div className="bg-[#0f172a]/50 border border-[#1e293b] rounded-xl p-5 shadow-2xl flex flex-col h-full overflow-hidden" id="memory-table-container">
      {/* Title Header */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-400" />
          {t.ram_title}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {t.ram_desc}
        </p>
      </div>

      {/* Grid of memory variables */}
      <div className="flex-1 overflow-y-auto max-h-[300px] scrollbar-thin">
        {variableKeys.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-slate-500 border border-dashed border-[#1e293b] rounded-xl bg-[#020617]/40">
            <span className="text-xs font-mono text-slate-400">{t.empty_ram_title}</span>
            <span className="text-[10px] text-slate-600 mt-1">{t.empty_ram_desc}</span>
          </div>
        ) : (
          <div className="border border-[#1e293b] rounded-lg overflow-hidden bg-[#020617]/55">
            <table className="w-full text-left font-mono text-xs text-slate-300">
              <thead className="bg-[#0f172a] text-[10px] text-slate-500 uppercase tracking-widest border-b border-[#1e293b]">
                <tr>
                  <th className="px-4 py-2.5">{t.id_header}</th>
                  <th className="px-4 py-2.5">{t.type_header}</th>
                  <th className="px-4 py-2.5 text-right font-semibold">{t.value_header}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/70 bg-transparent">
                {variableKeys.map((key) => {
                  const val = variables[key];
                  const typeLabel = typeof val === 'boolean' ? 'BOOL' : 'NUM';
                  const typeColor =
                    typeof val === 'boolean'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

                  return (
                    <tr
                      key={key}
                      className="hover:bg-[#0f172a]/40 transition-colors"
                      id={`memory-row-${key}`}
                    >
                      {/* Name identifier */}
                      <td className="px-4 py-3 font-semibold text-slate-200">
                        {key}
                      </td>

                      {/* Variable type classification */}
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${typeColor}`}>
                          {typeLabel}
                        </span>
                      </td>

                      {/* Stored Value */}
                      <td className="px-4 py-3 text-right font-bold text-slate-100 bg-[#020617]/50 text-sm">
                        {typeof val === 'boolean' ? (val ? 'true' : 'false') : val}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#1e293b] text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
        <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
        <span>{t.ram_note}</span>
      </div>
    </div>
  );
};
