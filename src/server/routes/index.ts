import { Router } from 'express';
import { CidadesController } from './../controllers';

const router = Router();

router.get('/', (_, res) => {
  return res.send('Chamada realizada com sucesso');
});

router.get('/cidades', CidadesController.getAllValidation, CidadesController.getAll);
router.get('/cidades/:id', CidadesController.getByIdValidation, CidadesController.getById);

router.delete('/cidades/:id', CidadesController.deleteByIdValidation, CidadesController.deleteById);

router.post('/cidades', CidadesController.createValidation, CidadesController.create);

router.put('/cidades/:id', CidadesController.updateByIdValidation, CidadesController.updateById);

export { router };