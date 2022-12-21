import express from 'express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import util from 'util';

import { Link, User } from './models/index.js';

const saltRounds = 10;

const router = express.Router();

/**
 * Creates a new user document. Given password is encrypted.
 * Duplicate usernames not allowed.
 *
 * req.body:
 * @param username The new user's username
 * @param password The new user's password
 * @returns { _id, username } The new user's oid and username
 */
router.post('/createUser', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashed = await new Promise((res, rej) =>
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) rej(err);
        else res(hash);
      })
    );
    const newUser = await User.create({
      _id: mongoose.Types.ObjectId(),
      username,
      password: hashed,
    });
    // console.log(newUser);
    res.json({ _id: newUser._id, username: newUser.username });
  } catch (err) {
    console.log(`Error when creating new user (username: ${username})`);
    console.log(err);
    res
      .status(409)
      .json(`Error when creating new user (username: ${username})`);
  }
});

/**
 * Login method.
 * Gets the ObjectId of a user given username and password.
 *
 * req.body:
 * @param username The username
 * @param password The raw password
 * @returns { _id, username } The user's oid and username
 */
router.post('/getUser', async (req, res) => {
  const { username, password } = req.body;
  try {
    const myUser = await User.findOne({ username }).exec();
    const isValid = myUser && (await bcrypt.compare(password, myUser.password));
    if (isValid) {
      res.json({ _id: myUser._id, username: myUser.username });
    } else {
      res.status(400).json('Invalid username or password');
    }
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

/**
 * Reads the info of a user.
 *
 * req.body:
 * @param _id The ObjectId of the user
 * @returns { username, savedLinks } The user's info
 */
router.post('/read', async (req, res) => {
  const { _id } = req.body;
  try {
    // const myUser = await User.findOne({ _id }).exec();
    // // Get savedLinks
    // const userLinks = await Link.find({ user: _id }).exec();
    const user = (
      await User.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(_id) } },
        {
          $lookup: {
            from: Link.collection.collectionName,
            foreignField: 'user',
            localField: '_id',
            as: 'savedLinks',
          },
        },
        { $limit: 1 },
      ]).exec()
    )[0];
    // console.log(util.inspect(user, false, 100, true));
    // console.log(Link.collection);
    // console.log(myUser);
    res.json({ username: user.username, savedLinks: user.savedLinks });
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

/**
 * Deletes a user.
 *
 * req.body:
 * @param _id The ObjectId of the user
 */
router.delete('/deleteUser', async (req, res) => {
  const { _id } = req.body;
  try {
    await User.deleteOne({ _id }).exec();
    res.json('Successfully deleted user');
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

/**
 * Saves a link to a user.
 *
 * req.body:
 * @param _id The ObjectId of the user
 * @param site The source (google or se)
 * @param title The title of the link
 * @param link The link url
 */
router.put('/addLink', async (req, res) => {
  const { _id, site, title, link } = req.body;
  try {
    const linkId = mongoose.Types.ObjectId();
    const newLink = await Link.create({
      _id: linkId,
      user: _id,
      source: site,
      title,
      link,
    });
    res.json(newLink);
  } catch (err) {
    console.error(err);
    res.status(400).json(`Failed to add Link of (${title}, ${link})`);
  }
});

/**
 * Removes a saved link tied to a user.
 *
 * req.body:
 * @param _id The ObjectId of the user
 * @param site The source (google or se)
 * @param title The title of the link
 * @param link The link url
 */
router.put('/remLink', async (req, res) => {
  const { _id, site, title, link } = req.body;
  try {
    res.json(
      await Link.deleteOne({ user: _id, source: site, title, link }).exec()
    );
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

/**
 * Checks if a link is saved to a user.
 *
 * req.body:
 * @param _id The ObjectId of the user
 * @param site The source (google or se)
 * @param title The title of the link
 * @param link The link url
 *
 * @returns true if the user has the link saved
 */
router.post('/containsLink', async (req, res) => {
  const { _id, site, title, link } = req.body;
  try {
    const exists = await Link.exists({
      user: _id,
      source: site,
      title,
      link,
    }).exec();
    res.json(exists);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// router.delete('/deleteAll', async (req, res) => {
//   await users.deleteMany({});
//   res.send('Deleted all.');
// });

export default router;
