# backend/extractors.py
from pathlib import Path
from pdfminer.high_level import extract_text
import pytesseract
from PIL import Image
import io

def extract_text_from_pdf(path: str) -> str:
    # Primary: pdfminer
    try:
        text = extract_text(path)
        if text and text.strip():
            return text
    except Exception:
        pass

    # Fallback: render images and OCR via pytesseract (requires poppler & tesseract)
    try:
        from pdf2image import convert_from_path
        pages = convert_from_path(path)
        text_pages = []
        for p in pages:
            text_pages.append(pytesseract.image_to_string(p))
        return "\n".join(text_pages)
    except Exception:
        return ""

def extract_text_from_txt(path: str) -> str:
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()

def extract(path: str) -> str:
    p = Path(path)
    suf = p.suffix.lower()
    if suf == ".pdf":
        return extract_text_from_pdf(str(p))
    elif suf in [".txt", ".md"]:
        return extract_text_from_txt(str(p))
    else:
        # future: support docx, images, email files
        return ""
