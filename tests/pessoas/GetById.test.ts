import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';


describe('Pessoas - GetById', () => {
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

  it('Busca registro por id', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        nome: 'Audrey',
        email: 'audreygetbyid@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resBuscada = await testServer
      .get(`/pessoas/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(resBuscada.statusCode).toEqual(StatusCodes.OK);
    expect(resBuscada.body).toHaveProperty('nome');
  });
  
  it('Tenta buscar registro que não existe', async () => {
    const res1 = await testServer
      .get('/pessoas/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty('errors.default');
  });
});
