import React, { useCallback, useState } from 'react';
import parse from 'html-react-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarReg } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import { addLink, readUser, remLink } from './modules/useEndpoints';
import { getIdCookie, isLoggedIn } from './modules/cookieHandler';
import { useEffect } from 'react';

export function SortedResults(props) {
  const navigate = useNavigate();
  const [googleLinks, setGoogleLinks] = useState([]);
  const [seLinks, setSeLinks] = useState([]);

  const setStarredArrays = useCallback(async () => {
    if (props.isLoggedIn) {
      await readUser(getIdCookie()).then((res) =>
        res.json().then((res) => {
          console.log(res.saved.google);
          setGoogleLinks(res.saved.google);
        })
      );
      await readUser(getIdCookie()).then((res) =>
        res.json().then((res) => {
          setSeLinks(res.saved.se);
        })
      );
    } else {
      setGoogleLinks([]);
      setSeLinks([]);
    }
  }, [props.isLoggedIn]);

  useEffect(() => {
    setStarredArrays();
  }, [setStarredArrays]);

  // Sort
  const results = props.rawArticles || [];
  if (results && results.length > 0) {
    //debugger;
    switch (props.sort) {
      case 'date':
        // sort raw by date, mutating raw
        //raw.forEach();
        break;
      case 'relevant':
        break;
      default:
        console.log('default sort');
    }
    // console.table(results);
  }

  /**
   * Checks a link in the correct database if it is starred or not.
   * @param {String} link The link to find.
   * @param {String} site The site to check.
   * @returns A FontAwesome star icon, either a filled in or regular star if starred or not.
   */
  const checkStarred = (link, site) => {
    switch (site) {
      case 'google':
        if (googleLinks.includes(link)) {
          return (
            <button onClick={() => remFav(link)}>
              <FontAwesomeIcon icon={faStarSolid} />
            </button>
          );
        } else {
          return (
            <button onClick={() => addFav(link)}>
              <FontAwesomeIcon icon={faStarReg} />
            </button>
          );
        }
      case 'se':
        if (seLinks.includes(link)) {
          return (
            <button onClick={() => remFav(link)}>
              <FontAwesomeIcon icon={faStarSolid} />
            </button>
          );
        } else {
          return (
            <button onClick={() => addFav(link)}>
              <FontAwesomeIcon icon={faStarReg} />
            </button>
          );
        }
      default:
        return (
          <button onClick={() => addFav(link)}>
            <FontAwesomeIcon icon={faStarReg} />
          </button>
        );
    }
  };

  /*
  Add and remove favorites from the temp data list
  */
  const addFav = async (link) => {
    if (isLoggedIn()) {
      // star === faStarReg ? (star = faStarSolid) : (star = faStarReg);
      await addLink(getIdCookie(), props.site, link);
      console.log(`Added link: ${link}`);
      setStarredArrays();
    }
  };
  const remFav = async (link) => {
    if (isLoggedIn()) {
      // star === faStarReg ? (star = faStarSolid) : (star = faStarReg);
      await remLink(getIdCookie(), props.site, link);
      console.log(`Removed link: ${link}`);
      setStarredArrays();
    }
  };

  let resultsList;
  resultsList = results.map((item) => {
    // using default props.sort
    // sort articles and set resultsList
    return (
      <li key={item.id}>
        <a href={item.link} target="_blank" rel="nooperner noreferrer">
          {parse(item.title)}
        </a>
        {checkStarred(item.link, props.site)}
      </li>
    );
  });

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
      <ul>{resultsList}</ul>
    </div>
  );
}
