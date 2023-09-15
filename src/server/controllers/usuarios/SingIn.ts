import { Request, Response } from 'express';
import * as yup from 'yup';
import { StatusCodes } from 'http-status-codes';

import { validation } from '../../shared/middleware';
import { IUsuario } from '../../database/models';
import { UsuariosProvider } from '../../database/providers/usuarios';
import { JWTService, PasswordCrypto } from '../../shared/services';

interface IBodyProps extends Omit<IUsuario, 'id' | 'nome'> {}

export const singInValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    email: yup.string().required().min(10).email(),
    senha: yup.string().required().min(8),
  })),
}));

export const singIn = async (req: Request<{}, {}, IBodyProps>, res: Response) => {

  const { email, senha } = req.body;

  const usuario = await UsuariosProvider.getByEmail(email);

  if (usuario instanceof Error){
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: {
        default: 'Email ou senha são inválidos'
      }
    });
  }

  const passwordMatch = await PasswordCrypto.verifyPassword(senha, usuario.senha);
  if (!passwordMatch){
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: {
        default: 'Email ou senha são inválidos'
      }
    });
  } else {
    const accessToken = JWTService.sign({ uid: usuario.id });
    if (accessToken === 'JWT_SECRET_NOT_FOUND'){
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: {
          default: 'Erro ao gerar o token de acesso'
        }
      });
    }

    return res.status(StatusCodes.OK).json({ accessToken });
  }
  
};