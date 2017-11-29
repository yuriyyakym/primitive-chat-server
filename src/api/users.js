import { Router } from 'express';
import { createIdGenerator } from '../utils/id-generator';

const userIdGenerator = createIdGenerator();

export default ({ state }) => {
  const router = Router();

  router.get('/', (req, res) => {
    res.send(state.users);
  });

  return router;
};
