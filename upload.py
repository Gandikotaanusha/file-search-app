from fastapi import APIRouter, UploadFile, File
from app.core.embeddings import add_file
import docx
from PyPDF2 import PdfReader

router = APIRouter()

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    content = ""
    data = await file.read()
    if file.filename.endswith(".txt"):
        content = data.decode()
    elif file.filename.endswith(".pdf"):
        reader = PdfReader(data)
        for page in reader.pages:
            content += page.extract_text() + "\n"
    elif file.filename.endswith(".docx"):
        doc = docx.Document(data)
        for para in doc.paragraphs:
            content += para.text + "\n"
    else:
        return {"error": "Unsupported file type"}

    add_file(content, file.filename)
    return {"filename": file.filename, "message": "File indexed successfully"}
