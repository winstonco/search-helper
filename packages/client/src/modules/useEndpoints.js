const ENDPOINT_URL = process.env.REACT_APP_ENDPOINT_URL ?? '/api/';

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
    return await res.json();
  } else {
    throw new Error(await res.json());
  }
};

export { getUser, createUser, readUser, addLink, remLink, containsLink };
