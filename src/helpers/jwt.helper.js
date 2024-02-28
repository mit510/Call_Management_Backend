const jwt = require("jsonwebtoken");
const { setJWT, getJWT } = require("./redis.helper");
const { storeUserRefreshJWT } = require("../model/user/User.model");
const { token } = require("morgan");
const JWT_ACCESS_SECRET =  'ljhhIT8YWE87^*8768kjksfs'
const JWT_REFRESH_SECRET =  'xzcvzxss$&^*(7ykKKJJHKU&hashf)'
const crateAccessJWT = async (email, _id) => {
  try {
    const accessJWT = await jwt.sign({ email }, JWT_ACCESS_SECRET, {
      expiresIn: "1d", //change this to 15m
    });

    await setJWT(accessJWT, _id);

    return Promise.resolve(accessJWT);
  } catch (error) {
    return Promise.reject(error);
  }
};

const crateRefreshJWT = async (email, _id) => {
  try {
    const refreshJWT = jwt.sign({ email }, JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });

    await storeUserRefreshJWT(_id, refreshJWT);

    return Promise.resolve(refreshJWT);
  } catch (error) {
    return Promise.reject(error);
  }
};

const verifyAccessJWT = (userJWT) => {
  try {
    return Promise.resolve(jwt.verify(userJWT, JWT_ACCESS_SECRET));
  } catch (error) {
    return Promise.resolve(error);
  }
};
const verifyRefreshJWT = (userJWT) => {
  try {
    return Promise.resolve(jwt.verify(userJWT, JWT_REFRESH_SECRET));
  } catch (error) {
    return Promise.resolve(error);
  }
};

module.exports = {
  crateAccessJWT,
  crateRefreshJWT,
  verifyAccessJWT,
  verifyRefreshJWT,
};
