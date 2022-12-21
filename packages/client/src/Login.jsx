import { useState, useEffect, useRef } from 'react';
import {
  setIdCookie,
  getIdCookie,
  removeIdCookie,
  isLoggedIn,
} from './modules/cookieHandler';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faUser, faX } from '@fortawesome/free-solid-svg-icons';
import { getUser, readUser } from './modules/useEndpoints';

export function Login(props) {
  const [username, setUsername] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [password, setPassword] = useState('');
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [warning, setWarning] = useState('');

  /**
   * handleClickOutside adapted from:
   * https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
   * author: Paul Fitzgerald
   */
  const ref = useRef(null);

  useEffect(() => {
    // Once on render
    // Read cookies to update user data
    setUserData();

    // Handle click helper for signin window
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handleClose();
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      const user = await getUser(username, password);
      setIdCookie(user._id);
      setWarning('');
      setUserData();
      handleClose();
      alert('Successfully logged in!');
    } catch (err) {
      console.error(err.message);
      setWarning(err.message);
    }
  };

  const handleSignOut = () => {
    removeIdCookie();
    setUserData();
    handleClose();
    alert('Successfully logged out!');
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setDialogIsOpen(false);
  };

  const setUserData = async () => {
    props.setIsLoggedIn(isLoggedIn());
    if (isLoggedIn()) {
      //debugger;
      try {
        const user = await readUser(getIdCookie());
        setCurrentUser(user.username);
      } catch (err) {
        console.error(err.message);
        setCurrentUser();
        console.log('No userIdCookie info stored.');
      }
    }
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
    if (isLoggedIn()) {
      setUserData();
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
          </div>
          <button onClick={handleSignOut}>Sign Out?</button>
        </div>
      );
    } else {
      signIn = (
        <div id="signin" role="dialog" ref={ref}>
          <button id="close-signin" onClick={handleClose}>
            <FontAwesomeIcon icon={faX} size="1x" />
          </button>
          <h2>Sign In</h2>
          <form className="user-info" method="dialog" onSubmit={handleSignIn}>
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
            <p className="font-warning">{warning}</p>
          </form>
          <Link to="/register">Don't have a login? Register here</Link>
        </div>
      );
    }
  }

  return <div id="signin-container">{signIn}</div>;
}
