import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('Cidades - GetById', () => {
  let accessToken = '';

  beforeAll(async () =>{
    const email = 'getById-cidades@gmail.com';
    const senha = '12345678';
    const nome = 'Teste';
    await testServer.post('/cadastrar').send({ nome, email, senha });
    const singInRes = await testServer.post('/entrar').send({ email, senha });

    accessToken = singInRes.body.accessToken;
  });

  it('Busca registro por id', async () => {
    const res = await testServer
      .post('/cidades')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Coronel Vivida' });

    expect(res.statusCode).toEqual(StatusCodes.CREATED);

    const resBuscada = await testServer
      .get(`/cidades/${res.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(resBuscada.statusCode).toEqual(StatusCodes.OK);
    expect(resBuscada.body).toHaveProperty('nome');
  });

  it('Tenta buscar registro que não existe', async () => {
    const res = await testServer
      .get('/cidades/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.body).toHaveProperty('errors.default');
  });

});