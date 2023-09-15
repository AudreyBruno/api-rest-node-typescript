import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';


describe('Pessoas - UpdateById', () => {
  let accessToken = '';
  let cidadeId: number | undefined = undefined;

  beforeAll(async () =>{
    const email = 'getById-pessoas@gmail.com';
    const senha = '12345678';
    const nome = 'Teste';
    await testServer.post('/cadastrar').send({ nome, email, senha });
    const singInRes = await testServer.post('/entrar').send({ email, senha });

    accessToken = singInRes.body.accessToken;

    const resCidade = await testServer
      .post('/cidades')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Teste' });

    cidadeId = resCidade.body;
  });

  it('Atualiza registro', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        nome: 'Audrey Update',
        email: 'audreyupdate@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resAtualizada = await testServer
      .put(`/pessoas/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        nome: 'Audrey Update',
        email: 'audreyupdates@gmail.com',
      });
    expect(resAtualizada.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  it('Tenta atualizar registro que não existe', async () => {
    const res1 = await testServer
      .put('/pessoas/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        nome: 'Audrey Update',
        email: 'audreyupdates@gmail.com',
      });

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});
