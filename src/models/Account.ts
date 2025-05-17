import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    provider: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from creating a new model if it already exists
const Account =
  mongoose.models.Account || mongoose.model("Account", accountSchema);

export default Account;
