const ENDPOINT_URL = process.env.REACT_APP_ENDPOINT_URL ?? '/api/';

/**
 * Creates a new user document. Given password is encrypted.
 * Duplicate usernames not allowed.
 *
 * @param {string} username The new user's username
 * @param {string} password The new user's password
 * @returns {{ _id: string, username: string }} The new user's oid and username
 * @throws An error if there was an error creating new user
 */
const createUser = async (username, password) => {
  const res = await fetch(ENDPOINT_URL + 'createUser', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
  if (res.ok) {
    return await res.json();
  } else {
    throw new Error(await res.json());
  }
};

/**
 * Gets the ObjectId of a user given username and password.
 * (Main login method)
 *
 * @param {string} username The username
 * @param {string} password The raw password
 * @returns {{ _id: string, username: string }} The user's oid and username
 * @throws An error if oid is not found
 */
const getUser = async (username, password) => {
  try {
    const res = await fetch(ENDPOINT_URL + 'getUser', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    if (res.ok) {
      return await res.json();
    } else {
      throw new Error(await res.json());
    }
  } catch (err) {
    throw err;
  }
};

/**
 * Reads the info of a user.
 *
 * @param {string} id The ObjectId of the user
 * @returns {{
 *  username: string,
 *  saved: {
 *    google: [{ link: string, title: string }],
 *    se: [{ link: string, title: string }]
 *  }
 * }} The user's username and saved links
 */
const readUser = async (id) => {
  const res = await fetch(ENDPOINT_URL + 'read', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _id: id,
    }),
  });
  if (res.ok) {
    const user = await res.json();
    const toSend = {
      username: user.username,
      saved: {
        google: [],
        se: [],
      },
    };
    user.savedLinks.forEach((item) => {
      if (item.source === 'google') {
        toSend.saved.google.push({ link: item.link, title: item.title });
      } else if (item.source === 'se') {
        toSend.saved.se.push({ link: item.link, title: item.title });
      }
    });
    return toSend;
  } else {
    throw new Error(await res.json());
  }
};

/**
 * Deletes a user.
 *
 * @param {string} _id The ObjectId of the user
 * @returns {{ acknowledged: boolean, deletedCount: number }} The document returned by deleteOne()
 */
const deleteUser = async (_id) => {
  const res = await fetch(ENDPOINT_URL + 'deleteUser', {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _id,
    }),
  });
  if (res.ok) {
    return await res.json();
  } else {
    throw new Error(await res.json());
  }
};

/**
 * Saves a link to a user.
 *
 * @param {string} _id The ObjectId of the user
 * @param {string} site The source (google or se)
 * @param {string} title The title of the link
 * @param {string} link The link url
 *
 * @typedef {Object} Link
 * @property {string} link The link url
 * @property {mongoose.Types.ObjectId} user The User's ObjectId
 * @property {'google' | 'se'} source The source of the link
 * @property {string} title The title of the link
 * @property {mongoose.Types.ObjectId} _id The Link's ObjectId
 * @returns {Link} The Link added
 */
const addLink = async (_id, site, title, link) => {
  const res = await fetch(ENDPOINT_URL + 'addLink', {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _id,
      site,
      title,
      link,
    }),
  });
  if (res.ok) {
    return await res.json();
  } else {
    throw new Error(await res.json());
  }
};

/**
 * Removes a saved link tied to a user.
 *
 * @param {string} _id The ObjectId of the user
 * @param {string} site The source (google or se)
 * @param {string} title The title of the link
 * @param {string} link The link url
 * @returns {{ acknowledged: boolean, deletedCount: number }} The document returned by deleteOne()
 */
const remLink = async (_id, site, title, link) => {
  const res = await fetch(ENDPOINT_URL + 'remLink', {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _id,
      site,
      title,
      link,
    }),
  });
  if (res.ok) {
    return await res.json();
  } else {
    throw new Error(await res.json());
  }
};

/**
 * Checks if a link is saved to a user.
 *
 * @param {string} _id The ObjectId of the user
 * @param {string} site The source (google or se)
 * @param {string} title The title of the link
 * @param {string} link The link url
 * @returns {boolean} True if the user has the link saved
 */
const containsLink = async (_id, site, title, link) => {
  const res = await fetch(ENDPOINT_URL + 'containsLink', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _id,
      site,
      title,
      link,
    }),
  });
  if (res.ok) {
    return (await res.json()) ? true : false;
  } else {
    throw new Error(await res.json());
  }
};

export {
  createUser,
  getUser,
  readUser,
  deleteUser,
  addLink,
  remLink,
  containsLink,
};
