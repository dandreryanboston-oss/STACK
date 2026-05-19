/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Network, FileJson, Layers, HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { ASTNode } from '../types';
import { TRANSLATIONS, Lang } from '../translations';

interface SyntaxTreeViewerProps {
  ast: ASTNode | null;
  lang: Lang;
}

export const SyntaxTreeViewer: React.FC<SyntaxTreeViewerProps> = ({ ast, lang }) => {
  const [viewMode, setViewMode] = useState<'visual' | 'json'>('visual');
  const t = TRANSLATIONS[lang];

  return (
    <div className="bg-[#0f172a]/50 border border-[#1e293b] rounded-xl p-5 shadow-2xl flex flex-col h-full overflow-hidden" id="ast-viewer-container">
      {/* Header and Controls */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span className="p-1 px-2 rounded text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 font-mono">
              {t.phase_three}
            </span>
            {t.ast_panel_title}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {t.ast_panel_desc}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="bg-[#020617] p-1 rounded border border-[#1e293b] flex gap-1 self-start font-mono text-xs">
          <button
            onClick={() => setViewMode('visual')}
            className={`px-3 py-1 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'visual'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> {lang === 'es' ? 'Árbol' : 'Tree'}
          </button>
          <button
            onClick={() => setViewMode('json')}
            className={`px-3 py-1 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'json'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" /> JSON
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 overflow-auto max-h-[350px] scrollbar-thin bg-[#020617]/40 border border-[#1e293b] rounded-xl p-4">
        {!ast || !ast.body || ast.body.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-slate-500 border border-dashed border-[#1e293b] rounded-xl bg-[#020617]/40 text-center">
            <span className="text-xs font-mono text-slate-400">{t.empty_ast_title}</span>
            <span className="text-[10px] text-slate-600 mt-1">{t.empty_ast_desc}</span>
          </div>
        ) : viewMode === 'json' ? (
          <pre className="text-xs font-mono text-indigo-400 scrollbar-thin overflow-auto leading-relaxed max-h-72">
            {JSON.stringify(ast, null, 2)}
          </pre>
        ) : (
          <div className="font-mono text-xs text-slate-200">
            <ASTNodeVisual node={ast} lang={lang} />
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#1e293b] text-[10px] font-mono text-slate-400 flex items-center gap-2">
        <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
        <span>{t.ast_note}</span>
      </div>
    </div>
  );
};

// --- Recursive Visual AST Component ---
const ASTNodeVisual: React.FC<{ node: ASTNode; label?: string; depth?: number; lang: Lang }> = ({
  node,
  label,
  depth = 0,
  lang,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  // Styling maps based on Node types
  const getNodeStyles = (type: string) => {
    switch (type) {
      case 'Program':
        return 'text-slate-100 bg-[#1e293b]/40 border-[#334155] font-bold';
      case 'Assignment':
        return 'text-teal-400 bg-teal-500/5 border-teal-500/20';
      case 'PrintStatement':
        return 'text-violet-400 bg-violet-500/5 border-violet-500/20';
      case 'BinaryExpression':
        return 'text-amber-400 bg-amber-500/5 border-amber-500/20';
      case 'CompareExpression':
        return 'text-rose-400 bg-rose-500/5 border-rose-500/20';
      case 'IfStatement':
        return 'text-pink-400 bg-pink-500/5 border-pink-500/20 font-semibold';
      case 'WhileStatement':
        return 'text-sky-400 bg-sky-500/5 border-sky-500/20 font-semibold';
      case 'NumberLiteral':
        return 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20';
      case 'IdentifierLiteral':
        return 'text-indigo-400 bg-indigo-500/5 border-indigo-500/20';
      default:
        return 'text-slate-300 border-[#1e293b]';
    }
  };

  const nodeColorClass = getNodeStyles(node.type);

  // Check children to render recursively
  const hasChildren =
    (node.body && node.body.length > 0) ||
    (node.thenBody && node.thenBody.length > 0) ||
    (node.bodyStatements && node.bodyStatements.length > 0) ||
    !!node.valueExpr ||
    !!node.expr ||
    !!node.condition ||
    !!node.left ||
    !!node.right;

  return (
    <div className={`flex flex-col relative ${depth > 0 ? 'ml-6' : ''}`}>
      {/* Thread Connection Lines */}
      {depth > 0 && (
        <div className="absolute -left-4 top-0 bottom-4 w-0.5 bg-[#1e293b]" />
      )}
      {depth > 0 && (
        <div className="absolute -left-4 top-2.5 w-4 h-0.5 bg-[#1e293b]" />
      )}

      {/* Main Node Box */}
      <div className="flex items-center gap-1.5 my-1">
        {hasChildren && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-0.5 rounded hover:bg-[#1e293b] text-slate-400 focus:outline-none cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}

        <div
          className={`px-3 py-1.5 rounded-lg border flex flex-wrap items-center gap-1 text-[11px] font-mono shadow-sm ${nodeColorClass}`}
        >
          {label && <span className="text-slate-500 font-semibold font-sans italic">{label}:</span>}
          <span className="font-bold">{node.type}</span>

          {node.varName && (
            <span className="text-slate-200">
              var: <code className="bg-[#020617] px-1.5 py-0.5 rounded border border-[#1e293b] text-teal-300">{node.varName}</code>
            </span>
          )}

          {node.operator && (
            <span className="bg-[#020617] px-1 py-0.5 rounded text-amber-300 border border-[#1e293b] font-bold">
              {node.operator}
            </span>
          )}

          {node.value !== undefined && (
            <span className="text-emerald-400 font-bold bg-[#020617] border border-[#1e293b] px-1 rounded-sm">
              [{node.value}]
            </span>
          )}

          {node.name && (
            <span className="text-indigo-400 font-bold bg-[#020617] border border-[#1e293b] px-1 rounded-sm">
              [{node.name}]
            </span>
          )}

          <span className="text-[9px] text-slate-500 font-sans italic ml-1">{lang === 'es' ? 'línea' : 'line'} {node.line}</span>
        </div>
      </div>

      {/* Render Subchildren Recursively */}
      {hasChildren && !collapsed && (
        <div className="flex flex-col">
          {/* General Program Body */}
          {node.body?.map((stmt, idx) => (
            <ASTNodeVisual key={idx} node={stmt} label={`stmt[${idx}]`} depth={depth + 1} lang={lang} />
          ))}

          {/* Condition Expression in Loops/Ifs */}
          {node.condition && (
            <ASTNodeVisual node={node.condition} label="condition" depth={depth + 1} lang={lang} />
          )}

          {/* Assignment Value Expression */}
          {node.valueExpr && (
            <ASTNodeVisual node={node.valueExpr} label="value" depth={depth + 1} lang={lang} />
          )}

          {/* Print Target Expression */}
          {node.expr && (
            <ASTNodeVisual node={node.expr} label="printExpr" depth={depth + 1} lang={lang} />
          )}

          {/* Then Branch of IF */}
          {node.thenBody?.map((stmt, idx) => (
            <ASTNodeVisual key={idx} node={stmt} label={`then[${idx}]`} depth={depth + 1} lang={lang} />
          ))}

          {/* Body Statements of WHILE */}
          {node.bodyStatements?.map((stmt, idx) => (
            <ASTNodeVisual key={idx} node={stmt} label={`body[${idx}]`} depth={depth + 1} lang={lang} />
          ))}

          {/* Left/Right Tree Subleaves */}
          {node.left && <ASTNodeVisual node={node.left} label="left" depth={depth + 1} lang={lang} />}
          {node.right && <ASTNodeVisual node={node.right} label="right" depth={depth + 1} lang={lang} />}
        </div>
      )}
    </div>
  );
};
