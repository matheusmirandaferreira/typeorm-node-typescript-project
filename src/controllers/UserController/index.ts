import { Request, Response } from 'express';

import { UserRepository } from '../../repository';

const repo = new UserRepository();

export class UserController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const result = await repo.login({ email, password });

    if (result instanceof Error)
      return res.status(400).json({ message: result.message });

    return res.json(result);
  }

  async createUser(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const result = await repo.createUser({ name, email, password });

      if (result instanceof Error)
        return res
          .status(422)
          .json({ message: result.message, errors: result.cause });

      return res.json(result);
    } catch (err) {
      console.log('err', err);
      return res
        .status(500)
        .json({ message: 'Houve um erro ao criar o usuário' });
    }
  }
}
