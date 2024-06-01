const Joi = require("joi");

const AddReviewSchema = Joi.object({
  attachment_name: Joi.string().required(),
  attachment: Joi.string().required(),
  relevant: Joi.number().min(0).max(50).required(),
  reasonForReview: Joi.string().required(),
  description: Joi.string().optional(),
  docType: Joi.string().required(),
});

const GetReviewByDocId = Joi.object({
    docId: Joi.string().required().length(10)
});

module.exports = {
    AddReviewSchema,
    GetReviewByDocId
}