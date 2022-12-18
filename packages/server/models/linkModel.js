import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const LinkSchema = new Schema({
  _id: ObjectId,
  user: { type: ObjectId, ref: 'User', required: true },
  source: { type: String, required: true, enum: ['google', 'se'] },
  title: { type: String, required: true },
  link: { type: String, required: true },
});

LinkSchema.index({ user: 1, title: 1 }, { unique: true });

export const Link = mongoose.model('Link', LinkSchema);
