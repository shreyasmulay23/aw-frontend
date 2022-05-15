const getAllNames = "https://api.anything.world/poly-names";

const getSingleName = (name) =>
  `https://shr-aw-backend.herokuapp.com/api/anything?name=${name}`;

const searchByNames = (searchString) =>
  `https://shr-aw-backend.herokuapp.com/api/anything?search=${searchString}&fuzzy=false`;

const clearCache = `https://shr-aw-backend.herokuapp.com/api/anything/clear-cache`;

export const apiContext = {
  getAllNames,
  getSingleName,
  clearCache,
  searchByNames,
};
