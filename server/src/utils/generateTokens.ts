import jwt from "jsonwebtoken";
import jwtConfig from "../configs/jwt.config";
import dotenv from "dotenv";

dotenv.config();

interface TokenPayload {
  id: number;
  email: string;
  role?: string;
}

interface Tokens {
  refreshToken: string;
  accessToken: string;
}

function generateTokens(payload: TokenPayload): Tokens {
  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET!,
    jwtConfig.refresh  // ✅ теперь правильный тип
  );
  
  const accessToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET!,
    jwtConfig.access  // ✅ теперь правильный тип
  );

  return { refreshToken, accessToken };
}

export default generateTokens;