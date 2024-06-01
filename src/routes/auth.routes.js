// const { verifySignUp } = require("../middlewares");
const User = require('../controllers/users.controller');
const { validateBodyParams } = require('../middlewares').jsonValidator;
const { checkDuplicateUsernameOrEmail } = require('../middlewares').verifySignUp;
const { user, loginSchema, moderator } = require('../jsonSchema').user;

module.exports = function (app) {
  // app.post("/api/auth/signup", User.create);

  app.post("/api/auth/signup", [validateBodyParams(user), checkDuplicateUsernameOrEmail], User.signUp);

  app.post("/api/auth/expert/signup", [validateBodyParams(moderator), checkDuplicateUsernameOrEmail], User.expertSignUp);

  app.post("/api/auth/login", validateBodyParams(loginSchema), User.login);

  app.post("/api/auth/signout", User.signOut);
};
