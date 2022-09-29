import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader: string = req.headers.authorization;

  if (!authHeader)
    return res.status(401).send({ error: 'Não foi informado um token' });

  const parts: string[] = authHeader.split(' ');

  if (!(parts.length === 2))
    return res.status(401).send({ error: 'Token inválido' });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: 'Token inválido' });
  }

  jwt.verify(token, process.env.SECRET, (err, decode) => {
    if (err) return res.status(400).send({ error: 'Token inválido' });

    return next();
  });
};
