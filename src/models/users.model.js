const mongoose = require("mongoose");
const { Schema } = mongoose;

const ROLES = {
  ADMIN: "admin",
  MODERATOR: "moderator",
  CUSTOMER: "customer",
};

const USER_ACTIVATION_STATUS = {
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  PENDING: "pending",
};

const ProfileSchema = new mongoose.Schema({
  profileSummary: String,
  linkedInUrl: String,
  yearsOfExperience: Number,
  domainOfExpertise: String,
  industry: String,
});
const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: String,
    profile: {
      type: ProfileSchema,
      default: null,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
    },
    activation_status: {
      status: {
        type: String,
        enum: Object.values(USER_ACTIVATION_STATUS),
      },
      message: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function (next) {
  if (!this.activation_status.status) {
    switch (this.role) {
      case ROLES.MODERATOR:
        this.activation_status.status = USER_ACTIVATION_STATUS.PENDING;
        break;
      case ROLES.CUSTOMER:
        this.activation_status.status = USER_ACTIVATION_STATUS.ACCEPTED;
        break;
      default:
        this.activation_status.status = USER_ACTIVATION_STATUS.PENDING;
    }
  }

  if(!this.isActive){
    switch (this.role) {
      case ROLES.MODERATOR:
        this.isActive = false;
        break;
      case ROLES.CUSTOMER:
        this.isActive = true;
        break;
      default:
        this.isActive = true;
    }
  }
  next();
});

UserSchema.method("toJSON", function () {
  const { ...object } = this.toObject();

  object.fullname = object.firstname + " " + object.lastname;

  return object;
});

const Users = mongoose.model("Users", UserSchema);

module.exports = {
  Users,
  ROLES,
  USER_ACTIVATION_STATUS,
};
