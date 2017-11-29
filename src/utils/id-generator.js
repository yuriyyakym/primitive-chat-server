export const createIdGenerator = (start = 0) => {
  let nextId = start;
  return {
    getNextId: () => {
      return nextId++;
    }
  }
};
