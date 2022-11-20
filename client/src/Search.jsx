import React, { useState } from 'react';
import { Searcher } from './modules/searcher.js';
import { Settings } from './Settings.jsx';
import { useNavigate } from 'react-router-dom';

const searcher = new Searcher('languagelearning');

export function Search(props) {
  const navigate = useNavigate();

  const [question, setQuestion] = useState('');

  const updateResults = async () => {
    if (!question) {
      return <div>No question given.</div>;
    } //'how to --good learn chinese !-happy --expensive';
    //debugger;
    let sq = searcher.toSearchQuery(question);
    console.log(sq);
    switch (props.site) {
      case 'stackexchange':
        props.setRawArticles(
          await searcher.searchStackExchange('languagelearning', sq)
        );
        break;
      case 'google':
        props.setRawArticles(await searcher.searchGoogle(sq));
        break;
      default:
        props.setRawArticles([
          { title: 'dummytitle', link: 'dummylink', id: 'dummyid' },
        ]);
    }
    // console.table(rawArticles);
  };

  return (
    <>
      <Settings
        site={props.site}
        setSite={props.setSite}
        setSort={props.setSort}
      />
      <form
        className="search-bar"
        onSubmit={(event) => {
          updateResults();
          event.preventDefault();
          navigate('/results');
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
    </>
  );
}
