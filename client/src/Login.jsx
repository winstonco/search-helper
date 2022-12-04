import { useState, useEffect, useRef } from 'react';
import {
  setIdCookie,
  getIdCookie,
  removeIdCookie,
} from './modules/cookieHandler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faUser, faX } from '@fortawesome/free-solid-svg-icons';
import { getUser, readUser } from './modules/useEndpoints';

export function Login(props) {
  const [username, setUsername] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [currentPass, setCurrentPass] = useState('');
  const [password, setPassword] = useState('');
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [warning, setWarning] = useState('');

  /**
   * handleClickOutside adapted from:
   * https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
   * author: Paul Fitzgerald
   */
  const ref = useRef(null);
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    getUser(username, password)
      .then((res) => res.json())
      .then((res) => {
        setIdCookie(res._id);
        setWarning('');
        setUserData();
        handleClose();
        alert('Successfully logged in!');
      })
      .catch((err) => {
        setWarning('Error: User not found!');
        console.log('Error: User not found!');
      });
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setDialogIsOpen(false);
  };

  const setUserData = async () => {
    await readUser(getIdCookie())
      .then((res) => res.json())
      .then((res) => {
        setCurrentUser(res.username);
        setCurrentPass(res.password);
      })
      .catch((err) => {
        console.log('No userIdCookie info stored.');
      });
  };

  let signIn;
  // Sign in form not open
  if (!dialogIsOpen) {
    signIn = (
      <button
        id="signin-btn"
        onClick={() => {
          setDialogIsOpen(true);
        }}
      >
        <h2>Sign In</h2>
      </button>
    );
  } else {
    // Sign in form open, if logged in show user and log out
    if (currentUser && currentPass) {
      signIn = (
        <div id="signin" role="dialog" ref={ref}>
          <button id="close-signin" onClick={handleClose}>
            <FontAwesomeIcon icon={faX} size="1x" />
          </button>
          <h2>Sign In</h2>
          <div className="user-info">
            <h3>Currently Signed In As:</h3>
            <div className="user-info-item">
              <FontAwesomeIcon icon={faUser} />
              <p>{currentUser}</p>
            </div>
            <div className="user-info-item">
              <FontAwesomeIcon icon={faKey} />
              <p>{currentPass}</p>
            </div>
          </div>
          <a
            href="/"
            onClick={() => {
              removeIdCookie();
              setUserData();
            }}
          >
            Sign Out?
          </a>
        </div>
      );
    } else {
      signIn = (
        <div id="signin" role="dialog" ref={ref}>
          <button id="close-signin" onClick={handleClose}>
            <FontAwesomeIcon icon={faX} size="1x" />
          </button>
          <h2>Sign In</h2>
          <form className="user-info" method="dialog" onSubmit={handleSubmit}>
            <label>
              <FontAwesomeIcon icon={faUser} />
              <input
                type="text"
                placeholder="Username:"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
                required
              />
            </label>
            <label>
              <FontAwesomeIcon icon={faKey} />
              <input
                type="password"
                placeholder="Password:"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                required
              />
            </label>
            <input type="submit" value="Sign In" />
            <p id="signin-warning">{warning}</p>
          </form>
          <a href="/register">Don't have a login? Register here</a>
        </div>
      );
    }
  }

  return <div id="signin-container">{signIn}</div>;
}
