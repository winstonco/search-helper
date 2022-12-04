const ENDPOINT_URL = 'http://localhost:3001';

const getUser = async (username, password) => {
  return await fetch(ENDPOINT_URL + '/api/getUser', {
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
  return await fetch(ENDPOINT_URL + '/api/createUser', {
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
  return await fetch(ENDPOINT_URL + '/api/read', {
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

export { getUser, createUser, readUser };
