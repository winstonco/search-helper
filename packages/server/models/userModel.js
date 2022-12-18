import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
  _id: ObjectId,
  username: { type: String, unique: true, required: true, dropDups: true },
  password: { type: String, required: true },
});

export const User = mongoose.model('User', UserSchema);
