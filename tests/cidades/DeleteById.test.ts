import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('Cidades - DeleteById', () => {

  it('Apaga registro', async () => {

    const res = await testServer
      .post('/cidades')
      .send({ nome: 'Coronel Vivida' });

    expect(res.statusCode).toEqual(StatusCodes.CREATED);

    const resApagada = await testServer
      .delete(`/cidades/${res.body}`)
      .send();

    expect(resApagada.statusCode).toEqual(StatusCodes.NO_CONTENT);

  });

  it('Tenta apagar registro que não existe', async () => {

    const res = await testServer
      .delete('/cidades/99999')
      .send();

    expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.body).toHaveProperty('errors.default');
  });

});