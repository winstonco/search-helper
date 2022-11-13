import React, { useState } from 'react';
import { Searcher } from './modules/searcher.js';
import { Settings } from './Settings.jsx';

const searcher = new Searcher('languagelearning');

export function Search(props) {
  const [question, setQuestion] = useState('');
  const [results, setResults] = useState([{ title: '', link: '', id: '' }]);

  const updateResults = async () => {
    if (!question) {
      return <div>No question given.</div>;
    } //'how to --good learn chinese !-happy --expensive';

    let sq = searcher.toSearchQuery(question);
    console.log(sq);

    let articles = await searcher.searchStackExchange('languagelearning', sq);
    //let articles = await searcher.searchGoogle(sq);
    //let articles = [{ title: 'dummytitle', link: 'dummylink', id: 'dummyid' }];
    console.log(articles);
    setResults(articles);
  };

  const resultsList = results.map((item) => {
    return (
      <li key={item.id}>
        <a href={item.link} target="_blank" rel="nooperner noreferrer">
          {item.title}
        </a>
      </li>
    );
  });

  return (
    <div className="search">
      <form
        className="search-bar"
        onSubmit={(event) => {
          updateResults();
          event.preventDefault();
        }}
      >
        <label>
          <input
            className="search-bar-input"
            type="text"
            value={question}
            placeholder="Enter a question or search terms..."
            onChange={(event) => {
              setQuestion(event.target.value);
            }}
          />
        </label>
        <input className="search-bar-submit" type="submit" value="Search" />
      </form>
      <Settings />
      <ul className="articles">{resultsList}</ul>
    </div>
  );
}
