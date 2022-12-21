const ENDPOINT_URL = process.env.REACT_APP_ENDPOINT_URL ?? '/api/';

const getUser = async (username, password) => {
  return await (
    await fetch(ENDPOINT_URL + 'getUser', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
  ).json();
};

const createUser = async (username, password) => {
  return await (
    await fetch(ENDPOINT_URL + 'createUser', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
  ).json();
};

const readUser = async (id) => {
  const user = await (
    await fetch(ENDPOINT_URL + 'read', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _id: id,
      }),
    })
  ).json();
  // console.log(user);
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
  console.log(toSend);
  return toSend;
};

const addLink = async (_id, site, title, link) => {
  return await (
    await fetch(ENDPOINT_URL + 'addLink', {
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
    })
  ).json();
};

const remLink = async (_id, site, title, link) => {
  return await (
    await fetch(ENDPOINT_URL + 'remLink', {
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
    })
  ).json();
};

const containsLink = async (_id, site, title, link) => {
  return await (
    await fetch(ENDPOINT_URL + 'containsLink', {
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
    })
  ).json();
};

export { getUser, createUser, readUser, addLink, remLink, containsLink };
