/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Lang = 'en' | 'es';

export const TRANSLATIONS = {
  en: {
    // Header
    appName: 'StackLang VM',
    tagline: 'Educational Bytecode Compiler & Stack Virtual Machine',
    tokens_label: 'TOKENS:',
    bytecode_label: 'BYTECODE:',
    vm_status_label: 'VM STATUS:',
    status_running: 'running',
    status_error: 'error',
    status_completed: 'completed',
    status_idle: 'idle',

    // Compiler Pipeline Controls
    educational_map: 'EDUCATIONAL MAP',
    pipeline_title: 'Compiler Pipeline Diagram',
    pipeline_desc: 'Follow the transformations as the source code transitions from human text to binary stack bytecode.',
    comp_failed: 'Compilation Failed',

    // Stages
    source_code_name: 'Source Code',
    source_code_desc: 'High-level instructions',
    lexer_name: 'Lexer',
    lexer_desc: 'Tokenizes character stream',
    parser_name: 'Parser & AST',
    parser_desc: 'Generates Syntax Tree',
    codegen_name: 'Bytecode Gen',
    codegen_desc: 'Compiles to stack inst',
    vm_name: 'Stack VM',
    vm_desc: 'Sequential CPU executor',

    // Stage Stats
    phase_one: 'Phase 1',
    tokens_count: '{count} Tokens',
    lexer_idle: 'Idle',
    tree_valid: 'Tree Valid',
    syntax_error: 'Syntax Error',
    instructions_count: '{count} Instructions',
    codegen_idle: 'Idle',
    step_simulator: 'Step Simulator',

    // Control bar
    play_sim: 'Run Sim',
    pause_sim: 'Pause Sim',
    step_inst: 'Step Inst',
    step_inst_title: 'Step forwards one instruction bytecode step',
    step_back: 'Step Back',
    step_back_title: 'Step backward in virtual history steps',
    reset_vm: 'Reset VM',
    clock_speed: 'Clock Speed:',

    // Source Editor
    editor_title: 'SOURCE_EDITOR',
    presets_label: 'Presets:',
    compile_button: 'COMPILE',
    cheat_sheet_title: 'Language Cheat Sheet',
    cheat_sheet_math: 'Math',
    cheat_sheet_output: 'Output',
    cheat_sheet_check: 'Check',
    cheat_sheet_loops: 'Loops',
    errors_header: 'SYNTAX ERRORS ENCOUNTERED:',
    line_lbl: 'Line',
    col_lbl: 'Col',

    // Bytecode Viewer
    phase_four: 'PHASE 4',
    bytecode_panel_title: 'Intermediate Bytecode Panel',
    bytecode_panel_desc: 'Stack instruction bytecode output derived from compilation codegen traversal.',
    ip_tracker: 'IP: #{ip} / {total}',
    empty_bytecode_title: 'No bytecode instruction list generated',
    empty_bytecode_desc: 'Compile code to initialize the VM',
    bytecode_note: 'Pulsing indigo row represents target VM Execution IP. IP increments automatically after instruction execution.',

    // Runtime VM Stack
    stack_title: 'Runtime VM Stack (LIFO)',
    stack_desc: 'Temporary operands stack memory. Elements are inserted via PUSH and extracted via POP.',
    empty_stack_title: 'Stack is empty',
    empty_stack_desc: 'PUSH instructions insert elements',
    stack_note: 'Pops always occur on the top element, then it cascades down. Last-In-First-Out semantics.',

    // RAM Variable table
    ram_title: 'CPU Variable Memory Space (RAM)',
    ram_desc: 'Key-value cell storage for allocated registers on the stack compile mapping.',
    empty_ram_title: 'No variables declared',
    empty_ram_desc: 'Assignments like x = 5 initialize RAM',
    id_header: 'Identifier',
    type_header: 'Data Type',
    value_header: 'Stored Value',
    ram_note: 'LOAD <var> instruction reads values back from these memory grids to push onto the Stack.',

    // VM Console
    console_title: 'OUTPUT TERMINAL',
    debugger_title: 'INSTRUCTION LOGGER',
    copy_logs_tooltip: 'Copy logs',
    clear_console_tooltip: 'Clear console',
    empty_console: 'Console output stream is empty',
    empty_debugger: 'Debugger instructions trace is empty',

    // Inspection Subworkspace
    ast_tab_title: 'AST Syntax Analyzer',
    tokens_tab_title: 'Token Stream Lexer',
    tab_info: 'Click stages on the pipeline diagram to switch analyzer tabs!',

    // Lexer Token Stream Output
    lexer_output_title: 'Lexer Output — Token Stream',
    lexer_output_desc: 'Visualizing processed syntax substrings, matching patterns into semantic categories.',
    empty_tokens_title: 'No active tokens',
    empty_tokens_desc: 'Type or compile code to start',
    token_type_keywords: 'Keywords',
    token_type_identifiers: 'Identifiers',
    token_type_operators: 'Operators',
    token_type_literals: 'Literals',
    token_type_punctuation: 'Punctuation',

    // AST Explorer
    phase_three: 'PHASE 3',
    ast_explorer_title: 'Abstract Syntax Tree (AST) Explorer',
    ast_explorer_desc: 'Singly nested grammatical nodes showing grouping structures before assembler codegen translation.',
    ast_visual_tab: 'Visual Tree',
    ast_json_tab: 'JSON Stream',
    empty_ast_title: 'No AST parsed yet',
    empty_ast_desc: 'Check compiler validation issues',
    ast_note: 'Precedence evaluation: Parser shapes multiplication branches deeper than level additions to preserve PEMDAS semantics.',
    ast_node_var: 'var',

    // Footer
    footer_text: 'Interactive Computer Science Educational Companion — Powered by StackMachine Core v1.1.0',
    footer_env: 'May 2026 Sandbox Environment',
  },
  es: {
    // Header
    appName: 'MV de StackLang',
    tagline: 'Compilador Educativo de Bytecode y Máquina Virtual de Pila',
    tokens_label: 'TOKENS:',
    bytecode_label: 'BYTECODE:',
    vm_status_label: 'ESTADO MV:',
    status_running: 'en ejecución',
    status_error: 'error',
    status_completed: 'completado',
    status_idle: 'inactivo',

    // Compiler Pipeline Controls
    educational_map: 'MAPA EDUCATIVO',
    pipeline_title: 'Diagrama de Flujo del Compilador',
    pipeline_desc: 'Sigue las transformaciones a medida que el código fuente pasa de texto humano a bytecode de pila binario.',
    comp_failed: 'Compilación Fallida',

    // Stages
    source_code_name: 'Código Fuente',
    source_code_desc: 'Instrucciones de alto nivel',
    lexer_name: 'Analizador Léxico',
    lexer_desc: 'Tokeniza el flujo de caracteres',
    parser_name: 'Analizador Sintáctico y AST',
    parser_desc: 'Genera el Árbol Sintáctico (AST)',
    codegen_name: 'Gen de Bytecode',
    codegen_desc: 'Compila a instrucciones de pila',
    vm_name: 'MV de Pila',
    vm_desc: 'Ejecutor secuencial de CPU',

    // Stage Stats
    phase_one: 'Fase 1',
    tokens_count: '{count} Tokens',
    lexer_idle: 'Inactivo',
    tree_valid: 'Árbol Válido',
    syntax_error: 'Error de Sintaxis',
    instructions_count: '{count} Instrucciones',
    codegen_idle: 'Inactivo',
    step_simulator: 'Simulador de Pasos',

    // Control bar
    play_sim: 'Ejecutar Sim',
    pause_sim: 'Pausar Sim',
    step_inst: 'Paso Inst',
    step_inst_title: 'Avanzar un paso de instrucción bytecode',
    step_back: 'Paso Atrás',
    step_back_title: 'Retroceder en el historial de pasos de la MV',
    reset_vm: 'Reiniciar MV',
    clock_speed: 'Velocidad de Reloj:',

    // Source Editor
    editor_title: 'EDITOR_DE_CODIGO',
    presets_label: 'Ejemplos:',
    compile_button: 'COMPILAR',
    cheat_sheet_title: 'Machete de Lenguaje',
    cheat_sheet_math: 'Matemáticas',
    cheat_sheet_output: 'Salida',
    cheat_sheet_check: 'Validación',
    cheat_sheet_loops: 'Bucles',
    errors_header: 'ERRORES DE SINTAXIS ENCONTRADOS:',
    line_lbl: 'Línea',
    col_lbl: 'Col',

    // Bytecode Viewer
    phase_four: 'FASE 4',
    bytecode_panel_title: 'Panel de Bytecode Intermedio',
    bytecode_panel_desc: 'Flujo de bytecode de instrucciones de pila obtenido de la generación de código.',
    ip_tracker: 'IP: #{ip} / {total}',
    empty_bytecode_title: 'No se ha generado lista de instrucciones de bytecode',
    empty_bytecode_desc: 'Compila el código para inicializar la máquina virtual',
    bytecode_note: 'La fila índigo pulsante representa el IP de ejecución de la MV. El IP se incrementa automáticamente tras ejecutar.',

    // Runtime VM Stack
    stack_title: 'Pila en Tiempo de Ejecución (LIFO)',
    stack_desc: 'Memoria temporal de operandos de la pila. Se insertan datos con PUSH y se extraen con POP.',
    empty_stack_title: 'La pila está vacía',
    empty_stack_desc: 'Las instrucciones PUSH insertan elementos',
    stack_note: 'Las extracciones (POP) ocurren en el elemento superior. Semántica Último en Entrar, Primero en Salir.',

    // RAM Variable table
    ram_title: 'Espacio de Memoria de Variables (RAM)',
    ram_desc: 'Almacenamiento clave-valor para registros asignados en el mapa de compilación.',
    empty_ram_title: 'No se han declarado variables',
    empty_ram_desc: 'Asignaciones como x = 5 inicializan la RAM',
    id_header: 'Identificador',
    type_header: 'Tipo de Dato',
    value_header: 'Valor Guardado',
    ram_note: 'La instrucción LOAD <var> lee valores de estas celdas y los introduce (PUSH) en la pila.',

    // VM Console
    console_title: 'TERMINAL DE SALIDA',
    debugger_title: 'REGISTRO DE INSTRUCCIONES',
    copy_logs_tooltip: 'Copiar registros',
    clear_console_tooltip: 'Limpiar consola',
    empty_console: 'La salida de consola está vacía',
    empty_debugger: 'El registro de depuración está vacío',

    // Inspection Subworkspace
    ast_tab_title: 'Analizador Sintáctico AST',
    tokens_tab_title: 'Analizador Léxico',
    tab_info: '¡Haz clic en las etapas del diagrama para cambiar de pestaña!',

    // Lexer Token Stream Output
    lexer_output_title: 'Resultado del Analizador Léxico — Flujo de Tokens',
    lexer_output_desc: 'Visualización de subcadenas sintácticas procesadas y emparejadas con categorías semánticas.',
    empty_tokens_title: 'No hay tokens activos',
    empty_tokens_desc: 'Escribe o compila código para comenzar',
    token_type_keywords: 'Palabras clave',
    token_type_identifiers: 'Identificadores',
    token_type_operators: 'Operadores',
    token_type_literals: 'Literales',
    token_type_punctuation: 'Puntuación',

    // AST Explorer
    phase_three: 'FASE 3',
    ast_explorer_title: 'Explorador de Árbol de Sintaxis Abstracta (AST)',
    ast_explorer_desc: 'Nodos gramaticales anidados que muestran agrupaciones antes de la traducción de codegen.',
    ast_visual_tab: 'Árbol Visual',
    ast_json_tab: 'Datos JSON',
    empty_ast_title: 'Aún no se ha analizado ningún AST',
    empty_ast_desc: 'Verifica los problemas de validación del compilador',
    ast_note: 'Evaluación de precedencia: El analizador anida la multiplicación más profundo que la suma para preservar la jerarquía aritmética.',
    ast_node_var: 'var',

    // Footer
    footer_text: 'Compañero Educativo Interactivo de Ciencias de la Computación — Impulsado por StackMachine Core v1.1.0',
    footer_env: 'Entorno de Sandbox de Mayo de 2026',
  },
};
