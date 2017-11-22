import { Router } from 'express';
import facets from './facets';

export default ({ config, state }) => {
  const api = Router();
  api.use('/users', users({ config, state }));

  return api;
}
