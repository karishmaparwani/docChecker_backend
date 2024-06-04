const mongoose = require("mongoose");
const Users = require("./users.model");

const { REVIEW_STATUS } = require("../config/constants");

const ReviewerSchema = new mongoose.Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  reviewerEmailId: {
    type: String,
  },
  username: {
    type: String,
  },
});

ReviewerSchema.method("toJSON", function () {
  const { ...object } = this.toObject();

  object.fullname = object.firstname + " " + object.lastname;

  return object;
});

const ReviewSchema = new mongoose.Schema(
  {
    docId: {
      type: String,
      required: true,
      unique: true,
    },
    attachment_name: {
      type: String,
      required: true,
    },
    attachment: {
      type: String,
      required: true,
    },
    relevantExp: {
      type: Number,
      validate: {
        validator: function (v) {
          return v >= 0 && v <= 50;
        },
        message: "Experience must be between 0 and 50",
      },
    },
    reasonForReview: {
      type: String,
    },
    description: {
      type: String,
    },
    docType: {
      type: String,
      required: true,
    },
    reviewStatus: {
      type: String,
      enum: Object.values(REVIEW_STATUS),
    },
    reviewerId: {
      type: mongoose.ObjectId,
      required: false,
      default: null,
    },
    // reviewerDetails: {
    //   type: Users.schema,
    //   required: false,
    //   default: null,
    // },
    reviewerUsername: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.ObjectId,
      required: true,
    },
    updatedBy: {
      type: mongoose.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Reviews = mongoose.model("Reviews", ReviewSchema);

module.exports = Reviews;
