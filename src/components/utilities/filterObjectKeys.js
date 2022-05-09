// This utility constructs a new object out of an original object, filtering out a list of ignore keys.
const filterObjectKeys = (object, filterFunc) => {
  return Object.keys(object)
    .filter(filterFunc)
    .reduce((obj, key) => {
      obj[key] = object[key];
      return obj;
    }, {});
};

const filterIgnoreObjectKeys = (object, ignoreList) => {
  return filterObjectKeys(object, key => !ignoreList.includes(key));
};

export {
  filterObjectKeys,
  filterIgnoreObjectKeys
};
