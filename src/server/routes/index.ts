import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = Router();

router.get('/', (_, res) => {
  return res.send('Olá dev');
});

router.post('/teste', (req, res) => {
  return res.sendStatus(StatusCodes.UNAUTHORIZED).json(req.body);
});

export { router };