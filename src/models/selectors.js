export const selectUsers = state => state.users;

export const selectPrivateMessages = state => state.privateMessages;

export const selectRooms = state => state.rooms;
export const selectRoomById = (state, id) => selectRooms(state)
  .find(room => room.id === id);
