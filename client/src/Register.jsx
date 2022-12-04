import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setIdCookie } from './modules/cookieHandler';
import { createUser } from './modules/useEndpoints';

export function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    //debugger;
    try {
      createUser(username, password)
        .then((res) => res.json())
        .then((res) => {
          setIdCookie(res.insertedId);
        });
    } catch (err) {
      console.error(err);
      console.log('Error: Username and password already exists!');
      setDialogIsOpen(true);
    }

    navigate('/results');
  };

  return (
    <>
      <h1>Register:</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            required
          />
        </label>
        <input type="submit" value="Register" />
      </form>
      <dialog id="warning" open={dialogIsOpen}>
        Error: Username and password already exists
        <button
          onClick={() => {
            setDialogIsOpen(false);
          }}
        >
          <FontAwesomeIcon icon={faX} />
        </button>
      </dialog>
    </>
  );
}
