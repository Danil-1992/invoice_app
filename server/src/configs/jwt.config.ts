import { SignOptions } from "jsonwebtoken";

interface JwtConfig {
  refresh: SignOptions;
  access: SignOptions;
}

const jwtConfig: JwtConfig = {
  refresh: {
    expiresIn: "7d", 
  },
  access: {
    expiresIn: "15m", 
  },
};

export default jwtConfig;