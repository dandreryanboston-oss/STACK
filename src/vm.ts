/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VMInstruction, VMState, VMHistorySnapshot } from './types';

export const MAX_CYCLES = 1000; // Educational cycle limit to prevent crashes / hot infinite loops

export class VirtualMachine {
  private instructions: VMInstruction[];
  private state: VMState;
  private history: VMHistorySnapshot[] = [];

  constructor(instructions: VMInstruction[]) {
    this.instructions = instructions;
    this.state = this.getInitialState();
  }

  private getInitialState(): VMState {
    return {
      ip: 0,
      stack: [],
      variables: {},
      console: [],
      status: 'idle',
      error: null,
      currentCycle: 0,
      instructionLog: [],
    };
  }

  reset() {
    this.state = this.getInitialState();
    this.history = [];
  }

  getState(): VMState {
    return { ...this.state, stack: [...this.state.stack], variables: { ...this.state.variables } };
  }

  getHistoryLength(): number {
    return this.history.length;
  }

  // Backup snapshot for step-backwards debugger functionality
  private captureSnapshot() {
    this.history.push({
      ip: this.state.ip,
      stack: [...this.state.stack],
      variables: { ...this.state.variables },
      console: [...this.state.console],
      status: this.state.status,
      error: this.state.error,
      currentCycle: this.state.currentCycle,
    });
  }

  // Debugging: Step backward in VM execution history
  stepBackward(): boolean {
    if (this.history.length === 0) return false;
    const snapshot = this.history.pop()!;
    this.state = {
      ...this.state,
      ...snapshot,
    };
    return true;
  }

  // Execute a single bytecode instruction step
  stepForward(): VMState {
    if (this.state.status === 'completed' || this.state.status === 'error') {
      return this.getState();
    }

    if (this.state.status === 'idle') {
      this.state.status = 'running';
    }

    if (this.state.ip >= this.instructions.length) {
      this.state.status = 'completed';
      this.state.instructionLog.push("System: Execution reached standard EOF.");
      return this.getState();
    }

    if (this.state.currentCycle >= MAX_CYCLES) {
      this.state.status = 'error';
      this.state.error = `Loop Limit Exceeded (Max ${MAX_CYCLES} cycles. High probability of infinite loop)`;
      this.state.instructionLog.push(`[ERROR] Infinite loop safeguard activated: limit of ${MAX_CYCLES} cycles reached.`);
      return this.getState();
    }

    this.captureSnapshot();
    const instruction = this.instructions[this.state.ip];
    this.state.currentCycle++;

    try {
      this.executeInstruction(instruction);
    } catch (err: any) {
      this.state.status = 'error';
      this.state.error = err.message || 'Unknown virtual machine error.';
      this.state.instructionLog.push(`[ERROR] ${this.state.error}`);
    }

    return this.getState();
  }

  private executeInstruction(inst: VMInstruction) {
    const { op, arg } = inst;
    let logMsg = `Step ${this.state.currentCycle}: [IP #${this.state.ip}] ${op}`;
    if (arg !== undefined) logMsg += ` ${arg}`;

    switch (op) {
      case 'PUSH': {
        if (arg === undefined) throw new Error('PUSH instruction demands a literal argument value.');
        const val = typeof arg === 'string' ? parseFloat(arg) : arg;
        if (isNaN(val)) {
          throw new Error(`PUSH received non-numeric: ${arg}`);
        }
        this.state.stack.push(val);
        this.state.ip++;
        break;
      }

      case 'POP': {
        if (this.state.stack.length === 0) {
          throw new Error('Empty stack access: cannot perform POP from empty stack data structures.');
        }
        this.state.stack.pop();
        this.state.ip++;
        break;
      }

      case 'LOAD': {
        if (arg === undefined) throw new Error('LOAD instruction demands variable identifier.');
        const varName = String(arg);
        if (!(varName in this.state.variables)) {
          throw new Error(`Undefined variable error: Variable '${varName}' has not been declared or initialized.`);
        }
        this.state.stack.push(this.state.variables[varName]);
        this.state.ip++;
        break;
      }

      case 'STORE': {
        if (arg === undefined) throw new Error('STORE instruction demands variable identifier.');
        if (this.state.stack.length === 0) {
          throw new Error(`Empty stack access: Unable to save value for variable '${arg}' from empty execution stack.`);
        }
        const val = this.state.stack.pop()!;
        this.state.variables[String(arg)] = val;
        this.state.ip++;
        break;
      }

      case 'ADD':
      case 'SUB':
      case 'MUL':
      case 'DIV': {
        if (this.state.stack.length < 2) {
          throw new Error(`Empty stack access: operator '${op}' expects at least 2 stack operands, but stack size is ${this.state.stack.length}.`);
        }
        const b = this.state.stack.pop()!;
        const a = this.state.stack.pop()!;

        if (typeof a !== 'number' || typeof b !== 'number') {
          throw new Error(`Type error: Operator '${op}' expected both numeric values, but found types: [${typeof a}, ${typeof b}]`);
        }

        let res = 0;
        if (op === 'ADD') res = a + b;
        else if (op === 'SUB') res = a - b;
        else if (op === 'MUL') res = a * b;
        else if (op === 'DIV') {
          if (b === 0) {
            throw new Error('Division by zero: Mathematical division by absolute zero value is banned.');
          }
          res = a / b;
        }

        // Limit values to clean float precissions for visual excellence
        res = Math.round(res * 1000) / 1000;

        this.state.stack.push(res);
        this.state.ip++;
        break;
      }

      case 'EQ':
      case 'NE':
      case 'GT':
      case 'LT':
      case 'GTE':
      case 'LTE': {
        if (this.state.stack.length < 2) {
          throw new Error(`Empty stack access: Operator '${op}' expects 2 values on stack, but stack size is ${this.state.stack.length}.`);
        }
        const b = this.state.stack.pop()!;
        const a = this.state.stack.pop()!;

        // Handle numeric and boolean comparisons
        let res = false;
        if (op === 'EQ') res = a === b;
        else if (op === 'NE') res = a !== b;
        else {
          if (typeof a !== 'number' || typeof b !== 'number') {
            throw new Error(`Type error: cannot perform relational operators on non-numeric value bounds.`);
          }
          if (op === 'GT') res = a > b;
          else if (op === 'LT') res = a < b;
          else if (op === 'GTE') res = a >= b;
          else if (op === 'LTE') res = a <= b;
        }

        this.state.stack.push(res);
        this.state.ip++;
        break;
      }

      case 'PRINT': {
        if (this.state.stack.length === 0) {
          throw new Error('Empty stack access: print() found empty execution stack context.');
        }
        const val = this.state.stack.pop()!;
        this.state.console.push(String(val));
        this.state.ip++;
        break;
      }

      case 'JMP_IF_FALSE': {
        if (arg === undefined) throw new Error('JMP_IF_FALSE instruction requires a numerical branch pointer target.');
        if (this.state.stack.length === 0) {
          throw new Error('Empty stack access: Conditional branch statement found empty evaluation stack.');
        }
        const cond = this.state.stack.pop()!;
        const target = typeof arg === 'string' ? parseInt(arg, 10) : (arg as number);

        if (!cond || cond === 0) {
          this.state.ip = target;
          logMsg += ` -> Jumped to instruction IP #${target}`;
        } else {
          this.state.ip++;
          logMsg += ` -> Condition true, proceeded past branch`;
        }
        break;
      }

      case 'JMP': {
        if (arg === undefined) throw new Error('JMP instruction requires unconditional target pointer identifier.');
        const target = typeof arg === 'string' ? parseInt(arg, 10) : (arg as number);
        this.state.ip = target;
        logMsg += ` -> Jumped to instruction IP #${target}`;
        break;
      }

      case 'HALT': {
        this.state.status = 'completed';
        this.state.ip++;
        this.state.instructionLog.push('System: Program finished execution with HALT signal.');
        return;
      }

      default:
        throw new Error(`Unknown instruction opcode: ${op}`);
    }

    this.state.instructionLog.push(logMsg);
  }
}
