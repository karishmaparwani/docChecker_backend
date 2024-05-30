const mongoose = require("mongoose");

const ROLES = {
  ADMIN: "admin",
  MODERATOR: "moderator",
  CUSTOMER: "customer",
};

const UserSchema = new mongoose.Schema(
  {
    firstname: String,
    lastname: String,
    emailId: String,
    username: String,
    password: String,
    token: String,
    profile: {
      profileSummary: String,
      linkedInUrl: String,
      yearsOfExperience: Number,
      domainOfExpertise: String,
      industry: String,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
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

// module.exports = Users;
// exports.ROLES = ROLES;

module.exports = {
  Users,
  ROLES
}

