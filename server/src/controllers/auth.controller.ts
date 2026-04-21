// import { Request, Response } from "express";
// import AuthService from "../services/auth.service";
// import generateTokens from "../utils/generateTokens";
// import jwt from "jsonwebtoken";
// import cookieConfig from "../configs/cookie.config";
// import dotenv from "dotenv";

// dotenv.config();

// interface UserPayload {
//   id: number;
//   email: string;
//   name?: string;
// }

// class AuthController {
//   static async signup(req: Request, res: Response): Promise<void> {
//     try {
//       const user = await AuthService.signup(req.body);
//       console.log(req.body);

//       const { refreshToken, accessToken } = generateTokens({
//         id: user.id,
//         email: user.email,
//       });

//       res
//         .cookie("refreshToken", refreshToken, cookieConfig.refresh)
//         .json({ user, accessToken });
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({ message: (err as Error).message });
//     }
//   }

//   static async signin(req: Request, res: Response): Promise<void> {
//     try {
//       const user = await AuthService.signin(req.body);

//       const { refreshToken, accessToken } = generateTokens({
//         id: user.id,
//         email: user.email,
//       });

//       res
//         .cookie("refreshToken", refreshToken, cookieConfig.refresh)
//         .json({ user, accessToken });
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({ message: (err as Error).message });
//     }
//   }

//   static async refresh(req: Request, res: Response): Promise<void> {
//     try {
//       const { refreshToken: oldRefreshToken } = req.cookies;
      

//       if (!oldRefreshToken) {
//         res.status(401).json({ message: "No refresh token" });
//         return;
//       }
//       const { user } = jwt.verify(
//         oldRefreshToken,
//         process.env.REFRESH_TOKEN_SECRET!
//       ) as { user: UserPayload };


//       const { refreshToken, accessToken } = generateTokens({
//         id: user.id,
//         email: user.email,
//       });

//       res
//         .cookie("refreshToken", refreshToken, cookieConfig.refresh)
//         .json({ user, accessToken });
//     } catch (err) {
//       console.log(err);
//       res.status(401).json({ message: (err as Error).message });
//     }
//   }

//   static async logout(req: Request, res: Response): Promise<void> {
//     res.clearCookie("refreshToken").sendStatus(204);
//   }
// }

// export default AuthController;

import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import generateTokens from "../utils/generateTokens";
import jwt from "jsonwebtoken";
import cookieConfig from "../configs/cookie.config";
import dotenv from "dotenv";

dotenv.config();

interface UserPayload {
  id: number;
  email: string;
  name?: string;
}

class AuthController {
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const user = await AuthService.signup(req.body);
      console.log(req.body);

      const { refreshToken, accessToken } = generateTokens({
        id: user.id,
        email: user.email,
      });

      res
        .cookie("refreshToken", refreshToken, cookieConfig.refresh)
        .json({ 
          user: {
            id: user.id,
            userName: user.userName,
            email: user.email
          }, 
          accessToken 
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: (err as Error).message });
    }
  }

  static async signin(req: Request, res: Response): Promise<void> {
    try {
      const user = await AuthService.signin(req.body);

      const { refreshToken, accessToken } = generateTokens({
        id: user.id,
        email: user.email,
      });

      res
        .cookie("refreshToken", refreshToken, cookieConfig.refresh)
        .json({ 
          user: {
            id: user.id,
            userName: user.userName,
            email: user.email
          }, 
          accessToken 
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: (err as Error).message });
    }
  }

  static async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken: oldRefreshToken } = req.cookies;

      if (!oldRefreshToken) {
        res.status(401).json({ message: "No refresh token" });
        return;
      }

      const payload = jwt.verify(
        oldRefreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as UserPayload;

      if (!payload || !payload.id) {
        res.status(401).json({ message: "Invalid token payload" });
        return;
      }

      // Получаем пользователя из БД с userName
      const user = await AuthService.getUserById(payload.id);
      
      if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      const { refreshToken, accessToken } = generateTokens({
        id: user.id,
        email: user.email,
      });

      res
        .cookie("refreshToken", refreshToken, cookieConfig.refresh)
        .json({ 
          user: {
            id: user.id,
            userName: user.userName,  // ← ключевое поле
            email: user.email
          }, 
          accessToken 
        });
        
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: (err as Error).message });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie("refreshToken", cookieConfig.refresh);
    res.status(204).send();
  }
}

export default AuthController;