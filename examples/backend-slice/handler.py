from fastapi import APIRouter
from .service import LoginService
from .schemas import LoginRequest, LoginResponse

router = APIRouter()

# === BEGIN USER CODE ===
@router.post("")
def handle_login(request: LoginRequest) -> LoginResponse:
    service = LoginService()
    return service.execute(request)
# === END USER CODE ===
