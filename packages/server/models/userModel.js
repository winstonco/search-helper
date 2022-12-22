import mongoose from 'mongoose';

import { Link } from './linkModel.js';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
  _id: ObjectId,
  username: { type: String, unique: true, required: true, dropDups: true },
  password: { type: String, required: true },
});

UserSchema.pre('deleteOne', async function () {
  console.log(this._conditions._id);
  const userId = this._conditions._id;
  await Link.deleteMany({ user: userId });
});

export const User = mongoose.model('User', UserSchema);
