import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';


describe('Pessoas - Create', () => {
  let cidadeId: number | undefined = undefined;
  beforeAll(async () => {
    const resCidade = await testServer
      .post('/cidades')
      .send({ nome: 'Teste' });

    cidadeId = resCidade.body;
  });
  
  it('Cria registro', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({
        cidadeId,
        email: 'audrey@gmail.com',
        nome: 'Audrey Bruno',
      });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });

  it('Cadastra registro 2', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({
        cidadeId,
        nome: 'Maria Silva',
        email: 'maria@gmail.com',
      });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });

  it('Tenta criar registro com email duplicado', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({
        cidadeId,
        nome: 'Eduarda',
        email: 'eduarda@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');

    const res2 = await testServer
      .post('/pessoas')
      .send({
        cidadeId,
        email: 'eduarda@gmail.com',
        nome: 'Eduarda Duplicada',
      });
    expect(res2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res2.body).toHaveProperty('errors.default');
  });

  it('Tenta criar registro com nome muito curto', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({
        cidadeId,
        email: 'eduarda@gmail.com',
        nome: 'Du',
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome');
  });

  it('Tenta criar registro sem nome', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({
        cidadeId,
        email: 'audrey@gmail.com',
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.nome');
  });

  it('Tenta criar registro sem email', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({
        cidadeId,
        nome: 'Audrey',
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });

  it('Tenta criar registro com email inválido', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({
        cidadeId,
        email: 'audrey gmail.com',
        nome: 'Audrey Siqueira',
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });

  it('Tenta criar registro sem cidadeId', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({
        email: 'audreyteste@gmail.com',
        nome: 'Audrey Teste',
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.cidadeId');
  });

  it('Tenta criar registro com cidadeId inválido', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({
        cidadeId: 'teste',
        email: 'juca@gmail.com',
        nome: 'Juca da Silva',
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.cidadeId');
  });

  it('Tenta criar registro sem enviar nenhuma propriedade', async () => {
    const res1 = await testServer
      .post('/pessoas')
      .send({});

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
    expect(res1.body).toHaveProperty('errors.body.cidadeId');
    expect(res1.body).toHaveProperty('errors.body.nome');
  });
});
