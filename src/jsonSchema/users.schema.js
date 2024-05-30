const Joi = require("joi");

exports.user = Joi.object({
  emailId: Joi.string().email().required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});

exports.moderator = Joi.object({
  emailId: Joi.string().email().required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  profile: Joi.object({
    profileSummary: Joi.string(),
    linkedInUrl: Joi.string(),
    yearsOfExperience: Joi.number(),
    domainOfExpertise: Joi.string(),
    industry: Joi.string(),
  }),
});

exports.loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const BASE_SCHEMA = Joi.object({
  id: Joi.string().required(),
  emailId: Joi.string().email().required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  username: Joi.string().required(),
});

exports.updateUserProfile = BASE_SCHEMA.keys({
  profile: Joi.object({
    profileSummary: Joi.string().optional(),
    linkedInUrl: Joi.string().optional(),
    yearsOfExperience: Joi.number().optional(),
    domainOfExpertise: Joi.string().optional(),
    industry: Joi.string().optional(),
  }),
});

exports.updateExpertProfile = BASE_SCHEMA.keys({
  profile: Joi.object({
    profileSummary: Joi.string().required(),
    linkedInUrl: Joi.string().required(),
    yearsOfExperience: Joi.number().required(),
    domainOfExpertise: Joi.string().required(),
    industry: Joi.string().required(),
  }),
});

exports.isUserIdExists = Joi.object({
  userId: Joi.string().required(),
});

exports.UserName = Joi.object({
  username: Joi.string().required(),
});
