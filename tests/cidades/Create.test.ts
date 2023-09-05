import { testServer } from '../jest.setup';
import { StatusCodes } from 'http-status-codes';

describe('Cidades - Create', () => {

  it('Cria registro', async () => {

    const res = await testServer
      .post('/cidades')
      .send({ nome: 'Coronel Vivida' });

    expect(res.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res.body).toEqual('number');

  });

  it('Tenta criar registro com nome muito curto', async () => {

    const res = await testServer
      .post('/cidades')
      .send({ nome: 'Co' });

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors.body.nome');

  });

});