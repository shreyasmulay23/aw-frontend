const API_KEY = "0HPZNJ7-SK94QFP-N19SSMV-RA0WQPH";

const getAllNames = "https://api.anything.world/poly-names";

const getSingleName = (name) =>
  `https://shr-aw-backend.herokuapp.com/api/anything?name=${name}`;

const searchByNames = (searchString) =>
  `https://shr-aw-backend.herokuapp.com/api/anything?search=${searchString}&fuzzy=false`;

export const apiContext = {
  getAllNames,
  getSingleName,
  searchByNames,
  API_KEY,
};
