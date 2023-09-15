import { Request, Response } from 'express';
import * as yup from 'yup';
import { StatusCodes } from 'http-status-codes';

import { validation } from '../../shared/middleware';
import { IUsuario } from '../../database/models';
import { UsuariosProvider } from '../../database/providers/usuarios';

interface IBodyProps extends Omit<IUsuario, 'id'> {}

export const singUpValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    email: yup.string().required().email().min(10),
    senha: yup.string().required().min(8),
    nome: yup.string().required().min(3),
  })),
}));

export const singUp = async (req: Request<{}, {}, IBodyProps>, res: Response) => {

  const result = await UsuariosProvider.create(req.body);

  if (result instanceof Error){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  return res.status(StatusCodes.CREATED).json(result);
  
};