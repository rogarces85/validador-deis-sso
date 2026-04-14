import json
import os
import copy

base_dir = r"c:\xampp\htdocs\www\Validador2026\data"
rf_path = os.path.join(base_dir, "reglas_finales.json")

with open(rf_path, "r", encoding="utf-8") as f:
    rf = json.load(f)

# The mappings based on the agrupador-validaciones skill
hospital_codes = {
    "HBSJO": "123100",
    "HPU": "123101",
    "HRN": "123102"
}

base_rules = {"validaciones": {}}
hospital_rules = {"validaciones": {}}
posta_rules = {"validaciones": {}}
samu_rules = {"validaciones": {}}

for sheet, rules in rf.items():
    for rule in rules:
        r = copy.deepcopy(rule)
        
        # Determine destination
        dest = base_rules
        exp2 = r.get("expresion_2", "")
        # convert integer to string safely if needed
        exp2_str = str(exp2).upper()
        
        if "SOLO POSTAS" in exp2_str:
            dest = posta_rules
            r["aplicar_a_tipo"] = ["Posta de Salud Rural (PSR)"]
        elif "SOLO HBSJO" in exp2_str or "SOLO HPU" in exp2_str or "SOLO HRN" in exp2_str:
            dest = hospital_rules
            r["aplicar_a_tipo"] = ["HOSPITAL"] # Based on skill
            aplicar_a = []
            if "HBSJO" in exp2_str: aplicar_a.append("123100")
            if "HPU" in exp2_str: aplicar_a.append("123101")
            if "HRN" in exp2_str: aplicar_a.append("123102")
            if aplicar_a:
                r["aplicar_a"] = aplicar_a
        elif "SAMU" in exp2_str:
            dest = samu_rules
        elif "EXCLUSIVO" in r.get("mensaje", "").upper():
            # e.g., "Uso exclusivo Centros de Atención VIH-SIDA"
            if "HBSJO" in r.get("mensaje", "").upper():
                dest = hospital_rules
                r["aplicar_a"] = ["123100"]
                r["aplicar_a_tipo"] = ["HOSPITAL"]
        
        # Default destination is base_rules which applies transversally
        if sheet not in dest["validaciones"]:
            dest["validaciones"][sheet] = []
        dest["validaciones"][sheet].append(r)

# Write to rules folder
rules_dir = os.path.join(base_dir, "rules")
os.makedirs(rules_dir, exist_ok=True)

with open(os.path.join(rules_dir, "base.json"), "w", encoding="utf-8") as f:
    json.dump(base_rules, f, indent=4, ensure_ascii=False)

with open(os.path.join(rules_dir, "hospital.json"), "w", encoding="utf-8") as f:
    json.dump(hospital_rules, f, indent=4, ensure_ascii=False)

with open(os.path.join(rules_dir, "posta.json"), "w", encoding="utf-8") as f:
    json.dump(posta_rules, f, indent=4, ensure_ascii=False)

with open(os.path.join(rules_dir, "samu.json"), "w", encoding="utf-8") as f:
    json.dump(samu_rules, f, indent=4, ensure_ascii=False)

print("Split completed successfully!")
