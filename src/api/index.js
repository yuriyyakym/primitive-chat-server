import { Router } from 'express';
import users from './users';
import rooms from './rooms';
import session from './session';

const rejectUnauthorized = (req, res, next) => {
  if (!req.session.user) {
    res.status(401).send('Unauthorized');
    return;
  }

  next();
}

export default ({ config, state }) => {
  const api = Router();
  const params = { config, state };

  api.use(session(params));
  api.use(rejectUnauthorized);
  api.use('/users', users(params));
  api.use('/rooms', rooms(params));

  return api;
};
