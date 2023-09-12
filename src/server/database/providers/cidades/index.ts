import * as create from './Create';
import * as count from './Count';
import * as deleteById from './DeleteById';
import * as getAll from './GetAll';
import * as getById from './GetById';
import * as updateById from './UpdateById';

export const CidadesProvider = {
  ...count,
  ...create,
  ...deleteById,
  ...getAll,
  ...getById,
  ...updateById
};