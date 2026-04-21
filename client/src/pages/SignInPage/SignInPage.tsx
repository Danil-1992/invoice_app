import { signIn } from '../../entities/User/model/userThunks';
import type { UserLogin } from '../../entities/User/types/userSchema';
import { UserLoginSchema } from '../../entities/User/types/userSchema';
import { useAppDispatch } from '../../shared/hooks/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router';

export default function SignInPage(): React.JSX.Element {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLogin>({ resolver: zodResolver(UserLoginSchema) });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = (data: UserLogin): void => {
    void dispatch(signIn(data));
    reset();
    void navigate('/main');
  };
  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Введите почту</Form.Label>
          <Form.Control type="text" {...register('email')} placeholder="Enter email" />
          {errors.email && <p>{errors.email.message}</p>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Введите пароль</Form.Label>
          <Form.Control type="text" {...register('password')} placeholder="Enter password" />
          {errors.password && <p>{errors.password.message}</p>}
        </Form.Group>
        <Button type="submit">Войти</Button>
      </Form>
    </div>
  );
}
