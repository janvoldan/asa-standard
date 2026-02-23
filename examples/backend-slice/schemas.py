from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    jwt_token: str
    expires_in: int
