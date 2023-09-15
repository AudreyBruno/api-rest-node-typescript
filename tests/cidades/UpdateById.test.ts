import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';


describe('Cidades - UpdateById', () => {
  let accessToken = '';

  beforeAll(async () =>{
    const email = 'updateById-cidades@gmail.com';
    const senha = '12345678';
    const nome = 'Teste';
    await testServer.post('/cadastrar').send({ nome, email, senha });
    const singInRes = await testServer.post('/entrar').send({ email, senha });

    accessToken = singInRes.body.accessToken;
  });

  it('Atualiza registro', async () => {
    const res = await testServer
      .post('/cidades')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Coronel Vivida' });

    expect(res.statusCode).toEqual(StatusCodes.CREATED);

    const resAtualizada = await testServer
      .put(`/cidades/${res.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Coronel' });

    expect(resAtualizada.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  it('Tenta atualizar registro que não existe', async () => {
    const res = await testServer
      .put('/cidades/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Coronel' });

    expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.body).toHaveProperty('errors.default');
  });

});