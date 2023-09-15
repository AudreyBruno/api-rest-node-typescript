import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';


describe('Pessoas - GetAll', () => {
  let accessToken = '';
  let cidadeId: number | undefined = undefined;

  beforeAll(async () =>{
    const email = 'getAll-pessoas@gmail.com';
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

  it('Busca registros', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: 'audreygetall@gmail.com',
        nome: 'Audrey',
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resBuscada = await testServer
      .get('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(Number(resBuscada.header['x-total-count'])).toBeGreaterThan(0);
    expect(resBuscada.statusCode).toEqual(StatusCodes.OK);
    expect(resBuscada.body.length).toBeGreaterThan(0);
  });
});
