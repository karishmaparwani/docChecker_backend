const { Experts } = require("../models");

exports.create = (userId, username) => {
  return new Promise((resolve, reject) => {
    const Expert = new Experts({
      userId,
      username,
    });

    Expert.save(Expert)
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};
