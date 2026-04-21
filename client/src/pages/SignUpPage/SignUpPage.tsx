import {
  UserRegisterSchema,
  type UserRegister,
} from "../../entities/User/types/userSchema";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "../../shared/hooks/hooks";
import { signUp } from "../../entities/User/model/userThunks";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

export default function SignUpPage(): React.JSX.Element {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserRegister>({ resolver: zodResolver(UserRegisterSchema) });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const onSubmit = (data: UserRegister): void => {
    void dispatch(signUp(data));
    reset();
    void navigate("/main");
  };

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Введите имя</Form.Label>
          <Form.Control
            type="text"
            {...register("name")}
            placeholder="Enter name"
          />
          {errors.name && <p className={styles.error}>{errors.name.message}</p>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Введите почту</Form.Label>
          <Form.Control
            type="email"
            {...register("email")}
            placeholder="Enter email"
          />
          <Form.Text className="text-muted">
            Не рекомендуем делиться своей почтой с кем-либо еще.
          </Form.Text>
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Введите пароль</Form.Label>
          <Form.Control
            type="password"
            {...register("password")}
            placeholder="Enter password"
          />
          <Form.Text className="text-muted">
            Не говорите пароль никому в целях безопасности
          </Form.Text>
          {errors.password && (
            <p className={styles.error}>{errors.password.message}</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
          <Form.Label>Подтвердите пароль</Form.Label>
          <Form.Control
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm password"
          />
          <Form.Text className="text-muted">
            Не говорите пароль никому в целях безопасности
          </Form.Text>
          {errors.password && (
            <p className={styles.error}>{errors.confirmPassword?.message}</p>
          )}
        </Form.Group>
        <Button type="submit">Зарегистрироваться</Button>
      </Form>
    </div>
  );
}
