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
const { roleCheck } = require("../middlewares");
const { ROLES } = require("../models");

module.exports = function (app) {
  // app.post("/api/auth/signup", User.create);

  app.put(
    "/api/updateExpertProfile/:username",
    [
      verifyToken,
      roleCheck([ROLES.MODERATOR]),
      validateBodyParams(updateExpertProfile),
      validatePathParams(UserName),
    ],
    User.updateProfile
  );

  app.put(
    "/api/updateCustomerProfile/:username",
    [
      verifyToken,
      roleCheck([ROLES.CUSTOMER]),
      validateBodyParams(updateUserProfile),
      validatePathParams(UserName),
    ],
    User.updateProfile
  );

  app.patch(
    "/api/updateUsername",
    [
      verifyToken,
      roleCheck([ROLES.MODERATOR, ROLES.CUSTOMER]),
      validateBodyParams(UserName),
      checkDuplicateUsername,
    ],
    User.updateUserName
  );

  app.delete(
    "/api/deleteUser/:username",
    [
      verifyToken,
      roleCheck([ROLES.MODERATOR, ROLES.CUSTOMER]),
      validatePathParams(UserName),
    ],
    User.deleteUser
  );
};
