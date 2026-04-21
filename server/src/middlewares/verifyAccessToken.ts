import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface UserPayload {
  id: number;
  email: string;
  role?: string;
}

interface CustomRequest extends Request {
  user?: UserPayload;
}

function verifyAccessToken(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    console.log(authHeader);

    if (!authHeader) {
      res.status(401).send("Нет заголовка Authorization");
      return;
    }

    const accessToken = authHeader.split(" ")[1];
    const user = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!
    ) as UserPayload; 

    req.user = user;
    res.locals.user = user;

    next();
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: (err as Error).message });
  }
}

export default verifyAccessToken;