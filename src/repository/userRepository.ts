import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as emailValidator from 'email-validator';

import { User } from '../models';
import { AppDataSource } from '../database';
import { fieldsErrors } from '../utils/fieldsErrors';

type LoginParams = {
  email: string;
  password: string;
};

type CreateUserParams = {
  name: string;
  email: string;
  password: string;
};

const userRepository = AppDataSource.getRepository(User);

export class UserRepository {
  async login({ email, password }: LoginParams): Promise<Error | User> {
    const user = await userRepository.findOneBy({ email });

    if (!user) return new Error('Usuário não encontrado');

    if (!(await bcrypt.compare(password, user.password)))
      return new Error('Senha inválida');

    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: '7d',
    });

    return Object({ token, data: user });
  }

  async createUser({
    name,
    email,
    password,
  }: CreateUserParams): Promise<Error | User> {
    if (!name || !email || !password) {
      return new Error('Preencha todos os campos', {
        cause: fieldsErrors({ name, email, password }),
      });
    }

    if (!emailValidator.validate(email)) {
      return new Error('Preencha os campos corretamente', {
        cause: { email: 'E-mail inválido' },
      });
    }

    if ((await userRepository.findBy({ email })).length > 0) {
      return new Error('Usuário já existe');
    }

    const user = userRepository.create({ name, email, password });

    await userRepository.save(user);

    return user;
  }
}
