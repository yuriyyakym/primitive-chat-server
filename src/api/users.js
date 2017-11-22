import { Router } from 'express';
import { selectUsers } from '../models/selectors';

export default ({ state }) => {
  const router = Router();

  router.get((req, res) => {
    const loadedUsers = req.query.fetchedUsersIds;
    const users = selectUsers(state);
    const newUsers = users.filter(user => !loadedUsers.includes(user.id));
    res.send({ users });
  });

  return router;
};
