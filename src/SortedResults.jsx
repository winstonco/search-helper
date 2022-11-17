import React, { useState } from 'react';
import parse from 'html-react-parser';

export function SortedResults(props) {
  const [results, setResults] = useState([{ title: '', link: '', id: '' }]);

  // Sort
  const raw = props.rawArticles;
  switch (props.sort) {
    case 'date':
      // sort raw by date, mutating raw
      raw.forEach();
      break;
    case 'relevant':
      break;
    default:
      console.log('default sort');
  }
  setResults(raw);

  const resultsList = results.map((item) => {
    // using props.sort -- default
    // sort articles and set resultsList
    return (
      <li key={item.id}>
        <a href={item.link} target="_blank" rel="nooperner noreferrer">
          {parse(item.title)}
        </a>
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
