import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_PATH, override=True)

class Config:
    SECRET_KEY = (os.getenv("SECRET_KEY") or "dev-secret-key-change-this").strip()
    MYSQL_HOST = (os.getenv("DB_HOST") or "localhost").strip()
    MYSQL_USER = (os.getenv("DB_USER") or "root").strip()
    MYSQL_PASSWORD = os.getenv("DB_PASSWORD") or ""
    MYSQL_DB = (os.getenv("DB_NAME") or "hlis").strip()
    MYSQL_CURSORCLASS = "DictCursor"
