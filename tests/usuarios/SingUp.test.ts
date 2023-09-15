import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';


describe('Usuarios - SingUp', () => {
  
  it('Cria Usuario', async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({
        email: 'audreyteste@gmail.com',
        senha: '12345678',
        nome: 'Audrey Bruno',
      });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });

  it('Cadastra Usuario 2', async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({
        email: 'maria@gmail.com',
        senha: '12345678',
        nome: 'Maria',
      });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });

  it('Tenta criar registro com email duplicado', async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({
        nome: 'Eduarda',
        email: 'eduarda@gmail.com',
        senha: '12345678',
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');

    const res2 = await testServer
      .post('/cadastrar')
      .send({
        email: 'eduarda@gmail.com',
        nome: 'Eduarda Duplicada',
        senha: '12345678',
      });
    expect(res2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res2.body).toHaveProperty('errors.default');
  });

  it('Tenta criar registro com nome muito curto', async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({
        email: 'eduarda@gmail.com',
        nome: 'Du',
        senha: '12345678',
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome');
  });

  it('Tenta criar registro com senha muito curta', async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({
        email: 'eduarda@gmail.com',
        nome: 'Eduarda',
        senha: '123456',
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body');
  });

  it('Tenta criar registro com email muito curto', async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({
        email: 'e@gma.com',
        nome: 'Eduarda',
        senha: '12345678',
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body');
  });

  it('Tenta criar registro sem nome', async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({
        email: 'audrey@gmail.com',
        senha: '12345678',
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome');
  });

  it('Tenta criar registro sem email', async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({
        nome: 'Eduarda',
        senha: '12345678',
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });

  it('Tenta criar registro sem senha', async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({
        nome: 'Eduarda',
        email: 'audrey@gmail.com',
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.senha');
  });

  it('Tenta criar registro com email inválido', async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({
        email: 'eduarda gmail.com',
        nome: 'Eduarda',
        senha: '12345678',
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });

  it('Tenta criar registro sem enviar nenhuma propriedade', async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({});

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
    expect(res1.body).toHaveProperty('errors.body.senha');
    expect(res1.body).toHaveProperty('errors.body.nome');
  });
});
