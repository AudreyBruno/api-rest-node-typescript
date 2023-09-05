import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';


describe('Cidades - UpdateById', () => {

  it('Atualiza registro', async () => {

    const res = await testServer
      .post('/cidades')
      .send({ nome: 'Coronel Vivida' });

    expect(res.statusCode).toEqual(StatusCodes.CREATED);

    const resAtualizada = await testServer
      .put(`/cidades/${res.body}`)
      .send({ nome: 'Coronel' });

    expect(resAtualizada.statusCode).toEqual(StatusCodes.NO_CONTENT);

  });

  it('Tenta atualizar registro que não existe', async () => {

    const res = await testServer
      .put('/cidades/99999')
      .send({ nome: 'Coronel' });

    expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.body).toHaveProperty('errors.default');
  });

});