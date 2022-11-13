import React, { useState } from 'react';
import { Searcher } from './modules/searcher.js';

const searcher = new Searcher('languagelearning');

export function Search(props) {
  const [question, setQuestion] = useState(
    'Enter a question or search terms...'
  );
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
      <div className="search-bar">
        <form
          onSubmit={(event) => {
            updateResults();
            event.preventDefault();
          }}
        >
          <label>
            <input
              type="text"
              value={question}
              onChange={(event) => {
                setQuestion(event.target.value);
              }}
            />
          </label>
          <input type="submit" value="Search" />
        </form>
      </div>
      <ul id="articles">{resultsList}</ul>
    </div>
  );
}
