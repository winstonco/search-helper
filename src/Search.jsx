import React, { useState } from 'react';
import { Searcher } from './modules/searcher.js';
import { Settings } from './Settings.jsx';
import { SortedResults } from './SortedResults.jsx';

const searcher = new Searcher('languagelearning');

export function Search(props) {
  const [question, setQuestion] = useState('');
  const [site, setSite] = useState('google');
  const [sort, setSort] = useState('default');

  let rawArticles;

  const updateResults = async () => {
    if (!question) {
      return <div>No question given.</div>;
    } //'how to --good learn chinese !-happy --expensive';

    let sq = searcher.toSearchQuery(question);
    console.log(sq);
    switch (site) {
      case 'stackexchange':
        rawArticles = await searcher.searchStackExchange(
          'languagelearning',
          sq
        );
        break;
      case 'google':
        rawArticles = await searcher.searchGoogle(sq);
        break;
      default:
        rawArticles = [
          { title: 'dummytitle', link: 'dummylink', id: 'dummyid' },
        ];
    }
    console.log(rawArticles);
  };

  return (
    <div className="search">
      <Settings site={site} setSite={setSite} setSort={setSort} />
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

      <SortedResults rawArticles={rawArticles} sort={sort} />
    </div>
  );
}
