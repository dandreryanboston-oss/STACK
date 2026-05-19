/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExamplePreset } from './types';

export const PRESETS_EN: ExamplePreset[] = [
  {
    name: '1. Basic Arithmetic',
    description: 'Demonstrates basic variables, addition, and printing. Great for seeing STORE, LOAD, and PUSH.',
    code: `# Basic mathematical operations
x = 5
y = x + 3
print(y)
`,
  },
  {
    name: '2. Math Precedence',
    description: 'Shows that multiplication and division have higher precedence than additions. Observe AST structure.',
    code: `# Precedence evaluation: 5 + (3 * 2) - 1
result = 5 + 3 * 2 - 1
print(result)

# Parentheses grouping: (5 + 3) * 2
grouped = (5 + 3) * 2
print(grouped)
`,
  },
  {
    name: '3. If-Else Control',
    description: 'Implements custom branches with comparisons and jumps. JMP_IF_FALSE is used to skip instructions.',
    code: `# Conditional checks
threshold = 10
score = 15

if score >= threshold {
  print(1)  # Success indicator
  status = 100
}

if score < threshold {
  print(0)  # Failure indicator
  status = 0
}

# Print status variable
print(status)
`,
  },
  {
    name: '4. While Loops',
    description: 'A countdown / loop sequence that stores variable increments and jumps back using JMP.',
    code: `# Loop while iteration < 5
count = 0
while count < 5 {
  count = count + 1
  print(count)
}
`,
  },
  {
    name: '5. Bug: Division by Zero',
    description: 'Simulates a runtime VM panic error when dividing by zero. Helps teach stack safety parameters.',
    code: `# Runtime VM Panic Case
numerator = 25
denominator = 0
result = numerator / denominator
print(result)
`,
  },
  {
    name: '6. Bug: Undefined Variable',
    description: 'Attempts to load a variable that has not been initialized. Observe VM runtime state crashing safely.',
    code: `# Accessing uninitialized memory
a = 15
sum = a + b
print(sum)
`,
  },
  {
    name: '7. Parser Syntax Error',
    description: 'Demos syntactic checks. See the parser highlight errors immediately without executing.',
    code: `# Syntactic syntax errors: missing brackets
value = 10
if value > 5
  print(value)
}
`,
  }
];

export const PRESETS_ES: ExamplePreset[] = [
  {
    name: '1. Aritmética Básica',
    description: 'Muestra variables básicas, sumas e impresiones de consola. Excelente para ver STORE, LOAD y PUSH.',
    code: `# Operaciones matemáticas básicas
x = 5
y = x + 3
print(y)
`,
  },
  {
    name: '2. Precedencia de Operaciones',
    description: 'Muestra que la multiplicación y división tienen mayor jerarquía que las sumas. Observa la estructura del AST.',
    code: `# Evaluación de precedencia: 5 + (3 * 2) - 1
resultado = 5 + 3 * 2 - 1
print(resultado)

# Agrupación con paréntesis: (5 + 3) * 2
agrupado = (5 + 3) * 2
print(agrupado)
`,
  },
  {
    name: '3. Control de Flujo (If-Else)',
    description: 'Implementa bifurcaciones con comparaciones y saltos. JMP_IF_FALSE se usa para saltar instrucciones.',
    code: `# Validaciones condicionales
umbral = 10
puntaje = 15

if puntaje >= umbral {
  print(1)  # Indicador de éxito
  estado = 100
}

if puntaje < umbral {
  print(0)  # Indicador de fallo
  estado = 0
}

# Imprimir variable de estado
print(estado)
`,
  },
  {
    name: '4. Bucles (While)',
    description: 'Una secuencia de cuenta regresiva/bucle que guarda incrementos de variables y salta hacia atrás con JMP.',
    code: `# Ejecutar mientras iteración < 5
contador = 0
while contador < 5 {
  contador = contador + 1
  print(contador)
}
`,
  },
  {
    name: '5. Error: División por Cero',
    description: 'Simula un error de pánico en tiempo de ejecución de la MV al dividir por cero. Enseña parámetros de seguridad de la pila.',
    code: `# Caso de pánico de la MV
numerador = 25
denominador = 0
resultado = numerador / denominador
print(resultado)
`,
  },
  {
    name: '6. Error: Variable No Definida',
    description: 'Intenta cargar una variable que no ha sido inicializada. Observa cómo el estado de la MV falla de forma segura.',
    code: `# Accediendo a memoria no inicializada
a = 15
suma = a + b
print(suma)
`,
  },
  {
    name: '7. Error Sintáctico de Parser',
    description: 'Demuestra controles sintácticos. Mira cómo el parser resalta errores de inmediato sin llegar a ejecutar.',
    code: `# Error de sintaxis: falta cerrar llaves
valor = 10
if valor > 5
  print(valor)
}
`,
  }
];

// For fallback, export backward compatible PRESETS pointing to English
export const PRESETS = PRESETS_EN;
