function generateId() {
  let id = 1;

  return function () {
    const generateId = id;
    id++;
    return generateId;
  };
}

export default generateId();
