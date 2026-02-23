from .repository import LoginRepository
from .schemas import LoginRequest, LoginResponse

class LoginService:
    def __init__(self) -> None:
        self.repo = LoginRepository()

    # === BEGIN USER CODE ===
    def execute(self, request: LoginRequest) -> LoginResponse:
        user = self.repo.get_user_by_email(request.email)

        if not user:
            raise UserNotFoundError()

        if not user.is_active:
            raise AccountLockedError()

        if not verify_password(request.password, user.password_hash):
            raise InvalidCredentialsError()

        self.repo.update_last_login(user.id)

        token = generate_jwt(user.id, expires_in=86400)
        return LoginResponse(jwt_token=token, expires_in=86400)
    # === END USER CODE ===
