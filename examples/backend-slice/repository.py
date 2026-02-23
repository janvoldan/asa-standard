from .schemas import LoginRequest, LoginResponse

class LoginRepository:
    # === BEGIN USER CODE ===
    def get_user_by_email(self, email: str):
        # TODO: implement database query
        raise NotImplementedError()

    def update_last_login(self, user_id: str) -> None:
        # TODO: implement last_login update
        raise NotImplementedError()
    # === END USER CODE ===
