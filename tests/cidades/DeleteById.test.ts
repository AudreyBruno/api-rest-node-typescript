import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('Cidades - DeleteById', () => {
  let accessToken = '';

  beforeAll(async () =>{
    const email = 'deleteById-cidades@gmail.com';
    const senha = '12345678';
    const nome = 'Teste';
    await testServer.post('/cadastrar').send({ nome, email, senha });
    const singInRes = await testServer.post('/entrar').send({ email, senha });

    accessToken = singInRes.body.accessToken;
  });

  it('Apaga registro', async () => {
    const res = await testServer
      .post('/cidades')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Coronel Vivida' });

    expect(res.statusCode).toEqual(StatusCodes.CREATED);

    const resApagada = await testServer
      .delete(`/cidades/${res.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(resApagada.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  it('Tenta apagar registro que não existe', async () => {
    const res = await testServer
      .delete('/cidades/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.body).toHaveProperty('errors.default');
  });

});