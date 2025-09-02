import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
}, { timestamps: true });

UserSchema.pre("save", async function(next){
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.compare = function(pw){ return bcrypt.compare(pw, this.password); };

export default mongoose.model("User", UserSchema);
