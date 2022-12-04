import Cookies from 'universal-cookie';
const cookies = new Cookies();

const setIdCookie = (id) => {
  // debugger;
  if (id) {
    cookies.set('myId', id, {
      path: '/',
      secure: false,
      sameSite: 'lax',
      httpOnly: false,
    });
  }
};

const getIdCookie = () => {
  return cookies.get('myId', {
    path: '/',
    secure: false,
    sameSite: 'lax',
    httpOnly: false,
  });
};

const removeIdCookie = () => {
  if (getIdCookie !== '') {
    cookies.remove('myId', {
      path: '/',
      secure: false,
      sameSite: 'lax',
      httpOnly: false,
    });
  }
};

export { setIdCookie, getIdCookie, removeIdCookie };
