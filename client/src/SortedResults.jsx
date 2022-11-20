import parse from 'html-react-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarReg } from '@fortawesome/free-regular-svg-icons';

export function SortedResults(props) {
  // TEMP DATABASE
  /*
  users.john.saved {
    google {
      []
    }
    se {
      [id0, id1, ...]
    }
  }
  */
  const data = {
    googleLinks: [
      'https://en.wikipedia.org/wiki/A',
      'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a',
    ],
  };

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
    console.table(results);
  }

  /**
   * Checks a link in the correct database if it is starred or not.
   * @param {String} link The link to find.
   * @param {String} site The site to check.
   * @returns A FontAwesome star icon, either a filled in or regular star if starred or not.
   */
  const checkStarred = (link, site) => {
    if (data.googleLinks.includes(link)) {
      return (
        <button onClick={() => remFav(link)}>
          <FontAwesomeIcon icon={faStarSolid} />
        </button>
      );
    }
    return (
      <button onClick={() => addFav(link)}>
        <FontAwesomeIcon icon={faStarReg} />
      </button>
    );
  };

  /*
  Add and remove favorites from the temp data list
  */
  const addFav = (link) => {
    // Add link to data
    data.googleLinks.push(link);
    // star === faStarReg ? (star = faStarSolid) : (star = faStarReg);
    console.table(data.googleLinks);
  };
  const remFav = (link) => {
    // Add link to data
    let i = data.googleLinks.find(link);
    data.googleLinks.splice(i, i + 1);
    // star === faStarReg ? (star = faStarSolid) : (star = faStarReg);
    console.table(data.googleLinks);
  };

  const resultsList = results.map((item) => {
    // using default props.sort
    // sort articles and set resultsList
    console.log(item);
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
      <h3>Results</h3>
      <ul>{resultsList}</ul>
    </div>
  );
}
