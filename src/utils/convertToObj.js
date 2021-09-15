export const convertToObject = arr => {
  return arr.reduce(
    (obj, item) =>
      Object.assign(obj, { [Object.keys(item)[0]]: Object.values(item)[0] }),
    {}
  );
};
