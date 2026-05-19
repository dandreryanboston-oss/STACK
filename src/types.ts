/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TokenType =
  | 'NUMBER'
  | 'IDENTIFIER'
  | 'KEYWORD'
  | 'OPERATOR'
  | 'PUNCTUATION'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
  index: number;
}

export type ASTNodeType =
  | 'Program'
  | 'Assignment'
  | 'PrintStatement'
  | 'BinaryExpression'
  | 'NumberLiteral'
  | 'IdentifierLiteral'
  | 'IfStatement'
  | 'WhileStatement'
  | 'CompareExpression';

export interface ASTNode {
  type: ASTNodeType;
  line: number;
  // Program block
  body?: ASTNode[];
  // Assignment/Var decl
  varName?: string;
  valueExpr?: ASTNode;
  // Print
  expr?: ASTNode;
  // BinaryExpression / CompareExpression
  left?: ASTNode;
  operator?: string;
  right?: ASTNode;
  // Literals
  value?: number;
  name?: string;
  // If/While
  condition?: ASTNode;
  thenBody?: ASTNode[];
  bodyStatements?: ASTNode[];
}

export type VMOpcode =
  | 'PUSH'
  | 'POP'
  | 'LOAD'
  | 'STORE'
  | 'ADD'
  | 'SUB'
  | 'MUL'
  | 'DIV'
  | 'PRINT'
  | 'JMP_IF_FALSE'
  | 'JMP'
  | 'EQ'
  | 'GT'
  | 'LT'
  | 'GTE'
  | 'LTE'
  | 'NE'
  | 'HALT';

export interface VMInstruction {
  id: string;
  op: VMOpcode;
  arg?: string | number;
  line?: number;
}

export interface CompilerResult {
  tokens: Token[];
  ast: ASTNode | null;
  instructions: VMInstruction[];
  errors: CompilerError[];
}

export interface CompilerError {
  message: string;
  line: number;
  column: number;
  phase: 'Lexer' | 'Parser' | 'Codegen';
}

export interface VMState {
  ip: number; // Instruction pointer
  stack: (number | boolean)[];
  variables: Record<string, number | boolean>;
  console: string[];
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error';
  error: string | null;
  currentCycle: number;
  instructionLog: string[];
}

export interface VMHistorySnapshot {
  ip: number;
  stack: (number | boolean)[];
  variables: Record<string, number | boolean>;
  console: string[];
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error';
  error: string | null;
  currentCycle: number;
}

export interface ExamplePreset {
  name: string;
  description: string;
  code: string;
}
