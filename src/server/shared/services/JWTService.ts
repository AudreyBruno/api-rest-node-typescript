import * as jwt from 'jsonwebtoken';

interface IjwtData {
  uid: number;
}

const sign = (data: IjwtData): string | 'JWT_SECRET_NOT_FOUND' => {
  if (!process.env.JWT_SECRET) return 'JWT_SECRET_NOT_FOUND';

  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const verify = (token: string): IjwtData | 'JWT_SECRET_NOT_FOUND' | 'INVALID_TOKEN' =>{
  if (!process.env.JWT_SECRET) return 'JWT_SECRET_NOT_FOUND';

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof decoded === 'string'){
      return 'INVALID_TOKEN';
    }

    return decoded as IjwtData;
  } catch (error) {
    return 'INVALID_TOKEN';
  }
};

export const JWTService = {
  sign,
  verify,
};