import { Router } from 'express';
import { createIdGenerator } from '../utils/id-generator';

const userIdGenerator = createIdGenerator();

export default ({ state }) => {
  const router = Router();

  router.post('/login', (req, res) => {
    const { name } = req.body;
    const avatarUrl = 'http://thecatapi.com/api/images/get?format=src&type=jpg';

    if (req.session.user) {
      const user = state.users.find(user => user.id === req.session.user.id);
      res.send(user);
    }

    if (state.users.findIndex(user => user.name === name) > -1) {
      res.status(409).send('This name is already used');
      return;
    }

    const user = {
      id: userIdGenerator.getNextId(),
      name,
      avatarUrl
    };

    req.session.user = user;
    state.users.push(user);
    res.send(user);
  });

  router.delete('/session', (req, res) => {
    if (!req.session.user) {
      res.status(401).send('Unauthorized');
      return;
    }

    const userId = req.session.user.id;
    req.session.user = undefined;
    state.rooms = state.rooms.map(room => {
      room.userIds = room.userIds.filter(id => id !== userId)
    });

    res.send({ status: 'ok' });
  });

  return router;
};
