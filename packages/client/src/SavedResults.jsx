import React, { useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarReg } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import { addLink, readUser, remLink } from './modules/useEndpoints';
import { getIdCookie, isLoggedIn } from './modules/cookieHandler';
import { useEffect } from 'react';

export function SavedResults({ settings }) {
  const navigate = useNavigate();
  const [googleLinks, setGoogleLinks] = useState([]);
  const [seLinks, setSeLinks] = useState([]);

  const setStarredArrays = useCallback(async () => {
    if (isLoggedIn()) {
      const user = await readUser(getIdCookie());
      setGoogleLinks(user.saved.google);
      setSeLinks(user.saved.se);
    } else {
      setGoogleLinks([]);
      setSeLinks([]);
    }
  }, []);

  useEffect(() => {
    // Once on render, set starred arrays if id cookies were saved
    setStarredArrays();
  }, [setStarredArrays]);

  /**
   * Checks a link in the correct database if it is starred or not.
   * @param {String} link The link to find.
   * @param {String} site The site to check.
   * @returns A FontAwesome star icon, either a filled in or regular star if starred or not.
   */
  const checkStarred = (site, title, link) => {
    switch (site) {
      case 'google':
        if (googleLinks.some((item) => item.link === link)) {
          return (
            <button onClick={() => remFav(site, title, link)}>
              <FontAwesomeIcon icon={faStarSolid} />
            </button>
          );
        } else {
          return (
            <button onClick={() => addFav(site, title, link)}>
              <FontAwesomeIcon icon={faStarReg} />
            </button>
          );
        }
      case 'se':
        if (seLinks.some((item) => item.link === link)) {
          return (
            <button onClick={() => remFav(site, title, link)}>
              <FontAwesomeIcon icon={faStarSolid} />
            </button>
          );
        } else {
          return (
            <button onClick={() => addFav(site, title, link)}>
              <FontAwesomeIcon icon={faStarReg} />
            </button>
          );
        }
      default:
        return (
          <button onClick={() => addFav(site, title, link)}>
            <FontAwesomeIcon icon={faStarReg} />
          </button>
        );
    }
  };

  const addFav = async (site, title, link) => {
    if (isLoggedIn()) {
      await addLink(getIdCookie(), site, title, link);
      console.log(`Added link: ${link}`);
      setStarredArrays();
    }
  };
  const remFav = async (site, title, link) => {
    if (isLoggedIn()) {
      await remLink(getIdCookie(), site, title, link);
      console.log(`Removed link: ${link}`);
      setStarredArrays();
    }
  };

  let savedList;
  switch (settings.site) {
    case 'google':
      savedList = googleLinks.map((item) => {
        if (item.id === '-1') {
          // Error id
          return <li key={item.id}>{item.title}</li>;
        }
        return (
          <li key={item.id}>
            <a href={item.link} target="_blank" rel="nooperner noreferrer">
              {item.title}
            </a>
            {checkStarred(settings.site, item.title, item.link)}
          </li>
        );
      });
      break;
    case 'se':
      savedList = seLinks.map((item) => {
        console.log(item);
        if (item.id === '-1') {
          // Error id
          return <li key={item.id}>{item.title}</li>;
        }
        return (
          <li key={item.id}>
            <a href={item.link} target="_blank" rel="nooperner noreferrer">
              {item.title}
            </a>
            {checkStarred(settings.site, item.title, item.link)}
          </li>
        );
      });
      break;
    default:
  }

  return (
    <div className="articles">
      <div className="options">
        <button
          onClick={() => {
            navigate('/results');
          }}
        >
          <h3>Results</h3>
        </button>
        <button
          onClick={() => {
            navigate('/saved');
          }}
        >
          <h3>Saved</h3>
        </button>
      </div>
      <ul>{savedList}</ul>
    </div>
  );
}
