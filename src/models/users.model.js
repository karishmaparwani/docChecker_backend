const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  profileSummary: String,
  linkedInUrl: String,
  yearsOfExperience: Number,
  domainOfExpertise: String,
  industry: String,
});

const ActivationStatusSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["ACCEPTED", "REJECTED", "PENDING"],
  },
  message: String,
});

const UserSchema = new mongoose.Schema(
  {
    firstname: String,
    lastname: String,
    emailId: String,
    username: String,
    password: String,
    token: String,
    role: String,
    profile: {
      profileSummary: String,
      linkedInUrl: String,
      yearsOfExperience: Number,
      domainOfExpertise: String,
      industry: String,
    },
    activation_status: {
      status: {
        type: String,
        enum: ["ACCEPTED", "REJECTED", "PENDING"],
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

UserSchema.method("toJSON", function () {
  const { ...object } = this.toObject();

  object.fullname = object.firstname + " " + object.lastname;

  return object;
});

const Users = mongoose.model("Users", UserSchema);

module.exports = Users;
