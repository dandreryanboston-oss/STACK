/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Token } from '../types';
import { TRANSLATIONS, Lang } from '../translations';

interface TokenListProps {
  tokens: Token[];
  lang: Lang;
}

export const TokenList: React.FC<TokenListProps> = ({ tokens, lang }) => {
  const t = TRANSLATIONS[lang];

  const getBadgeColors = (type: string) => {
    switch (type) {
      case 'KEYWORD':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
      case 'IDENTIFIER':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'NUMBER':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'OPERATOR':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'PUNCTUATION':
        return 'bg-slate-500/15 text-slate-400 border-slate-700';
      case 'EOF':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-800 text-slate-100 border-slate-700';
    }
  };

  const lexerTokens = tokens.filter((t) => t.type !== 'EOF');

  return (
    <div className="bg-[#0f172a]/50 border border-[#1e293b] rounded-xl p-5 shadow-2xl flex flex-col h-full overflow-hidden" id="token-list-container">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full inline-block animate-pulse" />
          {t.lexer_panel_title}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {t.lexer_panel_desc}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[350px] scrollbar-thin pr-1">
        {lexerTokens.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-slate-500 border border-dashed border-[#1e293b] rounded-xl bg-[#020617]/40 text-center">
            <span className="text-xs font-mono text-slate-400">{t.empty_tokens_title}</span>
            <span className="text-[10px] text-slate-600 mt-1">{t.empty_tokens_desc}</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {lexerTokens.map((token, index) => {
              return (
                <div
                  key={index}
                  className="bg-[#020617]/60 border border-[#1e293b] rounded-lg p-2.5 flex flex-col gap-1.5 hover:border-indigo-500/45 hover:bg-[#0f172a]/60 transition-all font-mono"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[9px] text-slate-500">#{index}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getBadgeColors(
                        token.type
                      )}`}
                    >
                      {token.type}
                    </span>
                  </div>
                  <div className="text-xs text-slate-200 truncate font-semibold bg-[#0f172a] px-2 py-1 rounded border border-[#1e293b]/75 text-center">
                    {token.value}
                  </div>
                  <div className="text-[9px] text-slate-500 flex justify-between">
                    <span>{lang === 'es' ? 'Lín' : 'Line'} {token.line}</span>
                    <span>{lang === 'es' ? 'Col' : 'Col'} {token.column}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#1e293b] flex flex-wrap gap-2 justify-center text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" /> {t.legend_keywords}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block" /> {t.legend_identifiers}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" /> {t.legend_numbers}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> {t.legend_operators}
        </span>
      </div>
    </div>
  );
};
