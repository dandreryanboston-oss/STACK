/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Token, TokenType, ASTNode, VMInstruction, CompilerResult, CompilerError, VMOpcode } from './types';

// ==========================================
// 1. LEXER
// ==========================================

export class Lexer {
  private source: string;
  private index: number = 0;
  private line: number = 1;
  private column: number = 1;
  private tokens: Token[] = [];
  private errors: CompilerError[] = [];

  constructor(source: string) {
    this.source = source;
  }

  tokenize(): { tokens: Token[]; errors: CompilerError[] } {
    while (this.index < this.source.length) {
      const char = this.peek();

      // Skip whitespace
      if (char === ' ' || char === '\t' || char === '\r') {
        this.advance();
        continue;
      }

      if (char === '\n') {
        this.advance();
        this.line++;
        this.column = 1;
        continue;
      }

      // Skip comments starting with #
      if (char === '#') {
        while (this.peek() !== '\n' && !this.isAtEnd()) {
          this.advance();
        }
        continue;
      }

      // Numbers
      if (this.isDigit(char)) {
        this.readNumber();
        continue;
      }

      // Identifiers / Keywords
      if (this.isAlpha(char)) {
        this.readIdentifier();
        continue;
      }

      // Operators (including multi-char: >=, <=, ==, !=)
      if (this.isOperatorChar(char)) {
        this.readOperator();
        continue;
      }

      // Punctuation: braces, parentheses, commas
      if (char === '(' || char === ')' || char === '{' || char === '}' || char === ',') {
        this.tokens.push({
          type: 'PUNCTUATION',
          value: char,
          line: this.line,
          column: this.column,
          index: this.index,
        });
        this.advance();
        continue;
      }

      // Unknown character error
      this.errors.push({
        message: `Unexpected character: '${char}'`,
        line: this.line,
        column: this.column,
        phase: 'Lexer',
      });
      this.advance();
    }

    this.tokens.push({
      type: 'EOF',
      value: '',
      line: this.line,
      column: this.column,
      index: this.index,
    });

    return { tokens: this.tokens, errors: this.errors };
  }

  private isAtEnd(): boolean {
    return this.index >= this.source.length;
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.source[this.index];
  }

  private peekNext(): string {
    if (this.index + 1 >= this.source.length) return '\0';
    return this.source[this.index + 1];
  }

  private advance(): string {
    const char = this.source[this.index];
    this.index++;
    this.column++;
    return char;
  }

  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  private isAlpha(char: string): boolean {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '_';
  }

  private isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char);
  }

  private isOperatorChar(char: string): boolean {
    return ['=', '+', '-', '*', '/', '>', '<', '!'].includes(char);
  }

  private readNumber() {
    const startLine = this.line;
    const startColumn = this.column;
    const startIndex = this.index;
    let value = '';

    while (this.isDigit(this.peek())) {
      value += this.advance();
    }

    // Floating points
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      value += this.advance(); // consume '.'
      while (this.isDigit(this.peek())) {
        value += this.advance();
      }
    }

    this.tokens.push({
      type: 'NUMBER',
      value,
      line: startLine,
      column: startColumn,
      index: startIndex,
    });
  }

  private readIdentifier() {
    const startLine = this.line;
    const startColumn = this.column;
    const startIndex = this.index;
    let value = '';

    while (this.isAlphaNumeric(this.peek())) {
      value += this.advance();
    }

    const keywords = ['print', 'if', 'while'];
    const isKeyword = keywords.includes(value);

    this.tokens.push({
      type: isKeyword ? 'KEYWORD' : 'IDENTIFIER',
      value,
      line: startLine,
      column: startColumn,
      index: startIndex,
    });
  }

  private readOperator() {
    const startLine = this.line;
    const startColumn = this.column;
    const startIndex = this.index;
    const char = this.advance();
    const nextChar = this.peek();

    let value = char;

    if (
      (char === '=' && nextChar === '=') ||
      (char === '!' && nextChar === '=') ||
      (char === '>' && nextChar === '=') ||
      (char === '<' && nextChar === '=')
    ) {
      value += this.advance();
    }

    this.tokens.push({
      type: 'OPERATOR',
      value,
      line: startLine,
      column: startColumn,
      index: startIndex,
    });
  }
}

// ==========================================
// 2. PARSER
// ==========================================

export class Parser {
  private tokens: Token[];
  private current: number = 0;
  private errors: CompilerError[] = [];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): { ast: ASTNode | null; errors: CompilerError[] } {
    const statements: ASTNode[] = [];

    // Filter out potential compiler errors from Lexer before parsing
    while (!this.isAtEnd()) {
      try {
        const stmt = this.statement();
        if (stmt) statements.push(stmt);
      } catch (err: any) {
        // Recover to next statement (e.g. newline or brace)
        this.synchronize();
      }
    }

    const ast: ASTNode = {
      type: 'Program',
      line: 1,
      body: statements,
    };

    return { ast, errors: this.errors };
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private check(type: TokenType, value?: string): boolean {
    if (this.isAtEnd()) return false;
    const token = this.peek();
    if (token.type !== type) return false;
    if (value !== undefined && token.value !== value) return false;
    return true;
  }

  private match(type: TokenType, value?: string): boolean {
    if (this.check(type, value)) {
      this.advance();
      return true;
    }
    return false;
  }

  private consume(type: TokenType, message: string, value?: string): Token {
    if (this.check(type, value)) {
      return this.advance();
    }

    const token = this.peek();
    const err: CompilerError = {
      message,
      line: token.line,
      column: token.column,
      phase: 'Parser',
    };
    this.errors.push(err);
    throw new Error(message);
  }

  // Synchronize on statement boundaries to recover from errors
  private synchronize() {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().value === '}' || this.previous().value === ';') return;

      const nextToken = this.peek();
      if (nextToken.type === 'KEYWORD' && ['print', 'if', 'while'].includes(nextToken.value)) {
        return;
      }
      if (nextToken.type === 'IDENTIFIER') return;

      this.advance();
    }
  }

  // --- Grammar rules ---

  private statement(): ASTNode | null {
    if (this.match('KEYWORD', 'print')) {
      return this.printStatement();
    }
    if (this.match('KEYWORD', 'if')) {
      return this.ifStatement();
    }
    if (this.match('KEYWORD', 'while')) {
      return this.whileStatement();
    }
    if (this.match('IDENTIFIER')) {
      return this.assignmentStatement();
    }

    // If unexpected token, raise error
    const token = this.peek();
    const err: CompilerError = {
      message: `Unexpected statement starter: '${token.value}'`,
      line: token.line,
      column: token.column,
      phase: 'Parser',
    };
    this.errors.push(err);
    this.advance();
    throw new Error(err.message);
  }

  private printStatement(): ASTNode {
    const printToken = this.previous();
    this.consume('PUNCTUATION', "Expected '(' after 'print'", '(');
    const expr = this.expression();
    this.consume('PUNCTUATION', "Expected ')' after print expression", ')');

    return {
      type: 'PrintStatement',
      line: printToken.line,
      expr,
    };
  }

  private assignmentStatement(): ASTNode {
    const idToken = this.previous();
    const varName = idToken.value;

    this.consume('OPERATOR', `Expected '=' after variable name: '${varName}'`, '=');
    const valueExpr = this.expression();

    return {
      type: 'Assignment',
      line: idToken.line,
      varName,
      valueExpr,
    };
  }

  private ifStatement(): ASTNode {
    const ifToken = this.previous();
    const condition = this.comparisonExpression();

    this.consume('PUNCTUATION', "Expected '{' to start the 'if' body block", '{');
    const thenBody: ASTNode[] = [];
    while (!this.check('PUNCTUATION', '}') && !this.isAtEnd()) {
      try {
        const stmt = this.statement();
        if (stmt) thenBody.push(stmt);
      } catch (err) {
        this.synchronize();
      }
    }
    this.consume('PUNCTUATION', "Expected '}' to close the 'if' block", '}');

    return {
      type: 'IfStatement',
      line: ifToken.line,
      condition,
      thenBody,
    };
  }

  private whileStatement(): ASTNode {
    const whileToken = this.previous();
    const condition = this.comparisonExpression();

    this.consume('PUNCTUATION', "Expected '{' to start the 'while' block", '{');
    const bodyStatements: ASTNode[] = [];
    while (!this.check('PUNCTUATION', '}') && !this.isAtEnd()) {
      try {
        const stmt = this.statement();
        if (stmt) bodyStatements.push(stmt);
      } catch (err) {
        this.synchronize();
      }
    }
    this.consume('PUNCTUATION', "Expected '}' to close the 'while' block", '}');

    return {
      type: 'WhileStatement',
      line: whileToken.line,
      condition,
      bodyStatements,
    };
  }

  private expression(): ASTNode {
    return this.comparisonExpression();
  }

  private comparisonExpression(): ASTNode {
    let expr = this.additiveExpression();

    const compOperators = ['>', '<', '>=', '<=', '==', '!='];
    while (this.check('OPERATOR') && compOperators.includes(this.peek().value)) {
      const operatorToken = this.advance();
      const right = this.additiveExpression();
      expr = {
        type: 'CompareExpression',
        line: operatorToken.line,
        left: expr,
        operator: operatorToken.value,
        right,
      };
    }

    return expr;
  }

  private additiveExpression(): ASTNode {
    let expr = this.multiplicativeExpression();

    while (this.check('OPERATOR', '+') || this.check('OPERATOR', '-')) {
      const operatorToken = this.advance();
      const right = this.multiplicativeExpression();
      expr = {
        type: 'BinaryExpression',
        line: operatorToken.line,
        left: expr,
        operator: operatorToken.value,
        right,
      };
    }

    return expr;
  }

  private multiplicativeExpression(): ASTNode {
    let expr = this.primaryExpression();

    while (this.check('OPERATOR', '*') || this.check('OPERATOR', '/')) {
      const operatorToken = this.advance();
      const right = this.primaryExpression();
      expr = {
        type: 'BinaryExpression',
        line: operatorToken.line,
        left: expr,
        operator: operatorToken.value,
        right,
      };
    }

    return expr;
  }

  private primaryExpression(): ASTNode {
    if (this.match('NUMBER')) {
      return {
        type: 'NumberLiteral',
        line: this.previous().line,
        value: parseFloat(this.previous().value),
      };
    }

    if (this.match('IDENTIFIER')) {
      return {
        type: 'IdentifierLiteral',
        line: this.previous().line,
        name: this.previous().value,
      };
    }

    if (this.match('PUNCTUATION', '(')) {
      const expr = this.expression();
      this.consume('PUNCTUATION', "Expected ')' after enclosed expression", ')');
      return expr;
    }

    const token = this.peek();
    const err: CompilerError = {
      message: `Expected variable, number, or parenthesized expression, but found: '${token.value}'`,
      line: token.line,
      column: token.column,
      phase: 'Parser',
    };
    this.errors.push(err);
    throw new Error(err.message);
  }
}

// ==========================================
// 3. BYTECODE GENERATOR
// ==========================================

export class BytecodeGenerator {
  private instructions: VMInstruction[] = [];
  private uniqueIdCounter: number = 0;

  generate(ast: ASTNode): VMInstruction[] {
    this.instructions = [];
    this.uniqueIdCounter = 0;
    this.compileNode(ast);
    this.emit('HALT', undefined, ast.line);
    return this.instructions;
  }

  private emit(op: VMOpcode, arg?: string | number, line?: number) {
    const id = `inst-${this.uniqueIdCounter++}`;
    this.instructions.push({ id, op, arg, line });
  }

  private compileNode(node: ASTNode) {
    switch (node.type) {
      case 'Program':
        if (node.body) {
          node.body.forEach((stmt) => this.compileNode(stmt));
        }
        break;

      case 'Assignment':
        if (node.valueExpr) {
          this.compileNode(node.valueExpr);
        }
        this.emit('STORE', node.varName, node.line);
        break;

      case 'PrintStatement':
        if (node.expr) {
          this.compileNode(node.expr);
        }
        this.emit('PRINT', undefined, node.line);
        break;

      case 'NumberLiteral':
        this.emit('PUSH', node.value, node.line);
        break;

      case 'IdentifierLiteral':
        this.emit('LOAD', node.name, node.line);
        break;

      case 'BinaryExpression':
        if (node.left && node.right) {
          this.compileNode(node.left);
          this.compileNode(node.right);
          const opMap: Record<string, VMOpcode> = {
            '+': 'ADD',
            '-': 'SUB',
            '*': 'MUL',
            '/': 'DIV',
          };
          const op = opMap[node.operator || '+'] || 'ADD';
          this.emit(op, undefined, node.line);
        }
        break;

      case 'CompareExpression':
        if (node.left && node.right) {
          this.compileNode(node.left);
          this.compileNode(node.right);
          const opMap: Record<string, VMOpcode> = {
            '==': 'EQ',
            '!=': 'NE',
            '>': 'GT',
            '<': 'LT',
            '>=': 'GTE',
            '<=': 'LTE',
          };
          const op = opMap[node.operator || '=='] || 'EQ';
          this.emit(op, undefined, node.line);
        }
        break;

      case 'IfStatement':
        if (node.condition && node.thenBody) {
          // Push condition code
          this.compileNode(node.condition);

          // We'll placeholder the JMP_IF_FALSE jump target offset
          const jumpIfFalseIndex = this.instructions.length;
          this.emit('JMP_IF_FALSE', 0, node.line);

          // Compile then branch
          node.thenBody.forEach((stmt) => this.compileNode(stmt));

          // Set the correct target relative offset (the instruction after the 'then' block)
          // Store actual instruction index to jump to
          const targetIndex = this.instructions.length;
          this.instructions[jumpIfFalseIndex].arg = targetIndex;
        }
        break;

      case 'WhileStatement':
        if (node.condition && node.bodyStatements) {
          const loopStartIndex = this.instructions.length;

          // Compile loop condition
          this.compileNode(node.condition);

          // Placeholder JMP_IF_FALSE jump target
          const jumpIfFalseIndex = this.instructions.length;
          this.emit('JMP_IF_FALSE', 0, node.line);

          // Compile loop body
          node.bodyStatements.forEach((stmt) => this.compileNode(stmt));

          // Emit back jump to loop condition
          this.emit('JMP', loopStartIndex, node.line);

          // Resolve outer jump target to instruction right after standard loop
          const loopEndIndex = this.instructions.length;
          this.instructions[jumpIfFalseIndex].arg = loopEndIndex;
        }
        break;
    }
  }
}

// ==========================================
// PIPELINE FACADE
// ==========================================

export function compileSource(source: string): CompilerResult {
  const errors: CompilerError[] = [];

  // Stage 1: Lexical Analysis
  const lexer = new Lexer(source);
  const { tokens, errors: lexerErrors } = lexer.tokenize();
  errors.push(...lexerErrors);

  // If we have fatal lexer errors, we shouldn't continue
  if (lexerErrors.length > 0) {
    return { tokens, ast: null, instructions: [], errors };
  }

  // Stage 2: Parsing / Syntactic Analysis
  const parser = new Parser(tokens);
  let ast: ASTNode | null = null;
  try {
    const parseResult = parser.parse();
    ast = parseResult.ast;
    errors.push(...parseResult.errors);
  } catch (err: any) {
    // If major parsing error is unrecovered
    return { tokens, ast: null, instructions: [], errors };
  }

  if (errors.length > 0 || !ast) {
    return { tokens, ast, instructions: [], errors };
  }

  // Stage 3: Code Generation / Translation
  const generator = new BytecodeGenerator();
  let instructions: VMInstruction[] = [];
  try {
    instructions = generator.generate(ast);
  } catch (err: any) {
    errors.push({
      message: `Bytecode codegen failed: ${err.message}`,
      line: 1,
      column: 1,
      phase: 'Codegen',
    });
  }

  return {
    tokens,
    ast,
    instructions,
    errors,
  };
}
