const ENDPOINT_URL = 'search-helper-production.up.railway.app/api/';

const getUser = async (username, password) => {
  return await fetch(ENDPOINT_URL + 'getUser', {
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
};

const createUser = async (username, password) => {
  return await fetch(ENDPOINT_URL + 'createUser', {
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
};

const readUser = async (id) => {
  return await fetch(ENDPOINT_URL + 'read', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _id: id,
    }),
  });
};

const addLink = async (_id, site, title, link) => {
  return await fetch(ENDPOINT_URL + 'addLink', {
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
};

const remLink = async (_id, site, title, link) => {
  return await fetch(ENDPOINT_URL + 'remLink', {
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
};

const containsLink = async (_id, site, title, link) => {
  return await fetch(ENDPOINT_URL + 'containsLink', {
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
  }).then((res) => res.json());
};

export { getUser, createUser, readUser, addLink, remLink, containsLink };
