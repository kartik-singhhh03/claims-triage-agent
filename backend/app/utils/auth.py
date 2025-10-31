# backend/utils.py

def simple_routing(extracted: dict) -> dict:
    """
    Input: dict with keys 'severity', 'complexity', 'fraud'
    Returns dict with 'assigned_to'
    """
    assigned = "Standard Claims Team"
    fraud = str(extracted.get("fraud", "")).lower()
    severity = int(extracted.get("severity") or 1)
    complexity = str(extracted.get("complexity", "")).lower()

    if fraud in ("yes", "true") or ("fraud" in extracted and extracted.get("fraud") == "yes"):
        assigned = "Fraud Investigation"
    elif severity >= 4:
        assigned = "Senior Adjuster"
    elif complexity == "high":
        assigned = "Special Handling"

    return {"assigned_to": assigned}
