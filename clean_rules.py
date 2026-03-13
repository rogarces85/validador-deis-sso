import json
import re
import os

def parse_secciones(filepath):
    sections = {}
    current_sheet = None
    if not os.path.exists(filepath):
        print(f"Error: {filepath} no existe.")
        return {}
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            sheet_match = re.match(r'## Hoja: (\w+)', line)
            if sheet_match:
                current_sheet = sheet_match.group(1)
                sections[current_sheet] = []
                continue
            
            section_match = re.search(r'Fila (\d+)\*\*: (.*)', line)
            if section_match and current_sheet:
                row = int(section_match.group(1))
                name = section_match.group(2).strip()
                sections[current_sheet].append((row, name))
    
    # Sort by row
    for sheet in sections:
        sections[sheet].sort()
    return sections

def get_section_for_cell(sheet, cell_expr, sections_map):
    if sheet not in sections_map:
        return ""
    
    # Find all row numbers in the expression (handling ranges like L20:L21)
    rows = [int(r) for r in re.findall(r'\d+', cell_expr)]
    if not rows:
        return ""
    
    # Use the first row mentioned
    target_row = rows[0]
    
    best_section = ""
    for row_start, name in sections_map[sheet]:
        if target_row >= row_start:
            best_section = name
        else:
            break
    return best_section

def clean_expression(expr):
    sheet = None
    if not isinstance(expr, str):
        return None, expr
    match = re.search(r'(\w+)!', expr)
    if match:
        sheet = match.group(1)
        # Remove sheet prefixes and any enclosing parentheses if they were just for the prefix
        expr = re.sub(r'\w+!', '', expr)
        # Handle cases like A01!(...) -> (...) -> ...
        if expr.startswith('(') and expr.endswith(')'):
             # Check if there are other parentheses
             if expr.count('(') == 1 and expr.count(')') == 1:
                expr = expr[1:-1]
    return sheet, expr

def process_rules(json_path, sections_map):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for sheet_key in data['validaciones']:
        for rule in data['validaciones'][sheet_key]:
            orig_e1 = rule.get('expresion_1', '')
            orig_e2 = rule.get('expresion_2', '')
            
            s1_sheet, s1_expr = clean_expression(orig_e1)
            s2_sheet, s2_expr = clean_expression(orig_e2)
            
            final_sheet_1 = s1_sheet or rule.get('rem_sheet', sheet_key)
            # If s2_sheet is present, use it. Otherwise, check if rem_sheet_2 exists, or fallback to final_sheet_1
            final_sheet_2 = s2_sheet or rule.get('rem_sheet_2', final_sheet_1)
            
            rule['expresion_1'] = s1_expr
            rule['expresion_2'] = s2_expr
            rule['rem_sheet'] = final_sheet_1
            rule['rem_sheet_2'] = final_sheet_2
            
            rule['seccion_expresion_1'] = get_section_for_cell(final_sheet_1, str(s1_expr), sections_map)
            rule['seccion_expresion_2'] = get_section_for_cell(final_sheet_2, str(s2_expr), sections_map)
            
            if 'seccion' in rule:
                rule['seccion'] = rule['seccion_expresion_1']

            msg_parts = []
            msg_parts.append(f"REM {final_sheet_1}")
            
            if rule['seccion_expresion_1']:
                msg_parts.append(rule['seccion_expresion_1'])
            
            op_text = "debe ser igual a"
            op = rule.get('operador', '==')
            if op == "!=": op_text = "debe ser distinto de"
            elif op == "<=": op_text = "debe ser menor o igual a"
            elif op == ">=": op_text = "debe ser mayor o igual a"
            elif op == "<": op_text = "debe ser menor que"
            elif op == ">": op_text = "debe ser mayor que"
            
            comp_text = f"Celdas ({s1_expr}) {op_text}"
            
            if final_sheet_1 != final_sheet_2:
                comp_text += f" | REM {final_sheet_2}"
            
            if rule['seccion_expresion_2'] and rule['seccion_expresion_2'] != rule['seccion_expresion_1']:
                comp_text += f" | {rule['seccion_expresion_2']}"
            
            comp_text += f" | celda ({s2_expr})"
            
            msg_parts.append(comp_text)
            rule['mensaje'] = " | ".join([p for p in msg_parts if p])

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    base_dir = r'c:\xampp\htdocs\www\Validador2026'
    SECCIONES_PATH = os.path.join(base_dir, 'data', 'secciones.md')
    RULES_PATH = os.path.join(base_dir, 'data', 'Rules_nuevas.json')
    
    sections = parse_secciones(SECCIONES_PATH)
    if sections:
        process_rules(RULES_PATH, sections)
        print("Procesamiento completado.")
    else:
        print("No se pudieron cargar las secciones.")
