import jwtConfig from "./jwt.config";
import dotenv from "dotenv";

dotenv.config();

interface CookieConfig {
  refresh: {
    maxAge: number;
    httpOnly: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none";
  };
}

// Преобразуем expiresIn в миллисекунды
const getMaxAge = (expiresIn: string | number | undefined): number => {
  if (!expiresIn) return 7 * 24 * 60 * 60 * 1000; // default 7 days
  
  const strExpiresIn = String(expiresIn);
  const value = parseInt(strExpiresIn);
  const unit = strExpiresIn.replace(/[0-9]/g, "");
  
  switch (unit) {
    case "d": return value * 24 * 60 * 60 * 1000;
    case "h": return value * 60 * 60 * 1000;
    case "m": return value * 60 * 1000;
    default: return value * 1000;
  }
};

const cookieConfig: CookieConfig = {
  refresh: {
    maxAge: getMaxAge(jwtConfig.refresh.expiresIn),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
};

export default cookieConfig;