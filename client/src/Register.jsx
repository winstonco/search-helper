import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faUser, faX } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setIdCookie } from './modules/cookieHandler';
import { createUser } from './modules/useEndpoints';

export function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [warning, setWarning] = useState();

  const handleSubmit = async (event) => {
    event.preventDefault();
    //debugger;
    createUser(username, password)
      .then((res) => res.json())
      .then((res) => {
        setIdCookie(res.insertedId);
        navigate('/results');
      })
      .catch((err) => {
        console.error(err);
        console.log('Error: Username and password already exists!');
        setPassword('');
        setWarning('Error: Username and password already exists!');
      });
  };

  return (
    <div className="register">
      <h1>Register:</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <FontAwesomeIcon icon={faUser} size="xl" />
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
          <FontAwesomeIcon icon={faKey} size="xl" />
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
        <input type="submit" value="Register" />
      </form>
      <p class="font-warning">{warning}</p>
    </div>
  );
}
