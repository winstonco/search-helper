import express from 'express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import util from 'util';

import { Link, User } from './models/index.js';

const saltRounds = 10;

const router = express.Router();

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
    console.log(newUser);
    res.json({ _id: newUser._id, username: newUser.username });
  } catch (err) {
    console.log(`Error when creating new user (username: ${username})`);
    console.log(err);
    res
      .status(409)
      .send(`Error when creating new user (username: ${username})`);
  }
});

router.post('/getUser', async (req, res) => {
  const { username, password } = req.body;
  try {
    const myUser = await User.findOne({ username }).exec();
    const isValid = myUser && (await bcrypt.compare(password, myUser.password));
    if (isValid) {
      res.json({ _id: myUser._id, username: myUser.username });
    } else {
      res.status(400).send('Invalid username or password');
    }
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

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
    console.log(util.inspect(user, false, 100, true));
    // console.log(Link.collection);
    // console.log(myUser);
    res.json({ username: user.username, savedLinks: user.savedLinks });
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router.delete('/deleteUser', async (req, res) => {
  const { _id } = req.body;
  try {
    await User.deleteOne({ _id }).exec();
    res.send('Successfully deleted user');
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

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
    res.status(400).send(`Failed to add Link of (${title}, ${link})`);
  }
});

router.put('/remLink', async (req, res) => {
  const { _id } = req.body;
  try {
    await Link.deleteOne({ _id }).exec();
    res.send('Successfully deleted link');
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

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
