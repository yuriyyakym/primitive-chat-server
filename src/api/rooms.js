import { Router } from 'express';
import { selectRoomById } from '../models/selectors';
import { createIdGenerator } from '../utils/id-generator';

const roomIdGenerator = createIdGenerator(1);
const messageIdGenerator = createIdGenerator(0);

const unknownRoomGuard = (room, res) => {
  if (!room) {
    res.status(404).send('Unknown room');
    return true;
  }
  return false;
}

export default ({ state }) => {
  const router = Router();

  router.get('/', (req, res) => {
    const roomsList = state.rooms.map(room => ({
      id: room.id,
      name: room.name
    }));
    res.send(roomsList);
  });

  router.get('/:roomId', (req, res) => {
    const { roomId, from } = req.query;
    const room = selectRoomById(Number(roomId));

    if(unknownRoomGuard(room, res)) {
      return;
    }

    res.send(room);
  });

  router.post('/:roomId/join', (req, res) => {
    const { roomId } = req.query;
    const userId = req.session.user.id;
    const room = selectRoomById(Number(roomId));

    if(unknownRoomGuard(room, res)) {
      return;
    }

    room.userIds = Array.from(
      new Set([ ...room.userIds, userId ])
    );

    return room;
  });

  router.post('/:roomId/leave', (req, res) => {
    const { roomId } = req.query;
    const userId = req.session.user.id;
    const room = selectRoomById(Number(roomId));

    if(unknownRoomGuard(room, res)) {
      return;
    }

    room.usersIds = room.usersIds.filter(id !== userId);
    res.send({ result: 'ok' });
  });

  router.post('/:roomId/message', (req, res) => {
    const { roomId } = req.query;
    const { text } = req.body;
    const userId = req.session.user.id;
    const room = selectRoomById(Number(roomId));

    if(unknownRoomGuard(room, res)) {
      return;
    }

    if (room.usersIds.indexOf(userId) === -1) {
      res.status(403).send('You need to join chat first');
      return;
    }

    const message = {
      id: messageIdGenerator.getNextId(),
      userId,
      text,
      timestamp: Number(new Date())
    };

    room.messages.push(message);
    res.send(message);
  });

  router.post('/', (req, res) => {
    const { name } = req.body;
    const roomId = roomIdGenerator.getNextId();
    const room = {
      name,
      id: roomId,
      userIds: [],
      messages: []
    };
    state.rooms.push(room);
    res.send(room);
  });

  return router;
};
