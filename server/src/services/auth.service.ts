import { User } from "../../shared/database";
import bcrypt from "bcryptjs";

interface SignupData {
  name?: string;
  email: string;
  password: string;
}

interface SigninData {
  email: string;
  password: string;
}

class AuthService {
  static async signup({ name, email, password }: SignupData): Promise<any> {
    if (!email || !password) {
      throw new Error("Заполните все поля");
    }

    const hashpass = await bcrypt.hash(password, 10);

    const [user, isCreated] = await User.findOrCreate({
      where: { email },
      defaults: {
        name: name || null,
        hashpass,
        role: "user",
      },
    });

    if (!isCreated) {
      throw new Error("Пользователь с таким email уже есть");
    }

    const plainUser = user.get({ plain: true });
    delete plainUser.hashpass;

    return plainUser;
  }

  static async signin({ email, password }: SigninData): Promise<any> {
    if (!email || !password) {
      throw new Error("Заполните все поля");
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error("Неверные данные");
    }

    const correct = await bcrypt.compare(password, user.hashpass);

    if (!correct) {
      throw new Error("Неверные данные");
    }

    const plainUser = user.get({ plain: true });
    delete plainUser.hashpass;

    return plainUser;
  }

  static async getUserById(id: number) {
    try {
      const user = await User.findByPk(id);

      if (!user) return null;

      // Возвращаем в формате, который ожидает фронт
      return {
        id: user.id,
        userName: user.userName || user.name, // ← пробуем оба варианта
        email: user.email,
      };
    } catch (error) {
      console.error("GetUserById error:", error);
      return null;
    }
  }
}

export default AuthService;
