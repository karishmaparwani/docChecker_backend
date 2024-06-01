// const { verifySignUp } = require("../middlewares");
const User = require("../controllers/users.controller");
const {
  validateBodyParams,
  validatePathParams,
} = require("../middlewares/schemaValidator");
const { checkDuplicateUsername } = require("../middlewares/verifySignUp");
const { updateExpertProfile, updateUserProfile, UserName } =
  require("../jsonSchema").user;

const { verifyToken } = require("../middlewares").authJwt;
const { verifyRole } = require("../middlewares");
const { ROLES } = require("../config/constants");

module.exports = function (app) {
  // app.post("/api/auth/signup", User.create);

  app.put(
    "/api/updateExpertProfile/:username",
    [
      verifyToken,
      verifyRole([ROLES.MODERATOR]),
      validateBodyParams(updateExpertProfile),
      validatePathParams(UserName),
    ],
    User.updateProfile
  );

  app.put(
    "/api/updateCustomerProfile/:username",
    [
      verifyToken,
      verifyRole([ROLES.CUSTOMER]),
      validateBodyParams(updateUserProfile),
      validatePathParams(UserName),
    ],
    User.updateProfile
  );

  app.patch(
    "/api/updateUsername",
    [
      verifyToken,
      verifyRole([ROLES.MODERATOR, ROLES.CUSTOMER]),
      validateBodyParams(UserName),
      checkDuplicateUsername,
    ],
    User.updateUserName
  );

  app.delete(
    "/api/deleteUser/:username",
    [
      verifyToken,
      verifyRole([ROLES.MODERATOR, ROLES.CUSTOMER]),
      validatePathParams(UserName),
    ],
    User.deleteUser
  );
};
