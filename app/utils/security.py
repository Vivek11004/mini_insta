from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def _safe(password: str) -> str:
    return password.encode("utf-8")[:72].decode("utf-8", errors="ignore")

def hash_password(password: str) -> str:
    return pwd_context.hash(_safe(password))

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(_safe(plain), hashed)
