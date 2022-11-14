import React, { useState } from 'react';
import parse from 'html-react-parser';
import { Searcher } from './modules/searcher.js';
import { Settings } from './Settings.jsx';

const searcher = new Searcher('languagelearning');

export function Search(props) {
  const [question, setQuestion] = useState('');
  const [results, setResults] = useState([{ title: '', link: '', id: '' }]);
  const [site, setSite] = useState('google');

  const updateResults = async () => {
    if (!question) {
      return <div>No question given.</div>;
    } //'how to --good learn chinese !-happy --expensive';

    let sq = searcher.toSearchQuery(question);
    console.log(sq);
    let articles;
    switch (site) {
      case 'stackexchange':
        articles = await searcher.searchStackExchange('languagelearning', sq);
        break;
      case 'google':
        articles = await searcher.searchGoogle(sq);
        break;
      default:
        articles = [{ title: 'dummytitle', link: 'dummylink', id: 'dummyid' }];
    }
    console.log(articles);
    setResults(articles);
  };

  const resultsList = results.map((item) => {
    return (
      <li key={item.id}>
        <a href={item.link} target="_blank" rel="nooperner noreferrer">
          {parse(item.title)}
        </a>
      </li>
    );
  });

  return (
    <div className="search">
      <Settings site={site} setSite={setSite} />
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

      <div className="articles">
        <h3>Results</h3>
        <ul>{resultsList}</ul>
      </div>
    </div>
  );
}
