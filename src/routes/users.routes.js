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

module.exports = function (app) {
  // app.post("/api/auth/signup", User.create);

  app.put(
    "/api/updateExpertProfile/:username",
    [
      verifyToken,
      validateBodyParams(updateExpertProfile),
      validatePathParams(UserName),
    ],
    User.updateProfile
  );

  app.put(
    "/api/updateCustomerProfile/:username",
    [
      verifyToken,
      validateBodyParams(updateUserProfile),
      validatePathParams(UserName),
    ],
    User.updateProfile
  );

  app.patch(
    "/api/updateUsername",
    [verifyToken, validateBodyParams(UserName), checkDuplicateUsername],
    User.updateUserName
  );

  app.delete(
    "/api/deleteUser/:username",
    [verifyToken, validatePathParams(UserName)],
    User.deleteUser
  );
};
