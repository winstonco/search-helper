import React, { useState } from 'react';
import { Searcher } from './modules/searcher.js';
import { Settings } from './Settings.jsx';
import { useNavigate } from 'react-router-dom';

const searcher = new Searcher();

export function Search({ setRawArticles, settings, setSettings }) {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');

  const updateResults = async (site, sort, seSite = settings.seSite) => {
    if (!question) {
      return <div>No question given.</div>;
    }
    //'how to --good learn chinese !-happy --expensive';
    let sq = searcher.toSearchQuery(question);
    // debugger;
    console.log(sq);
    console.log(settings.site);
    console.log(settings);
    switch (site) {
      case 'se':
        setRawArticles(await searcher.searchStackExchange(seSite, sq, sort));
        break;
      case 'google':
        setRawArticles(await searcher.searchGoogle(sq, sort));
        break;
      default:
        setRawArticles([
          { title: 'dummytitle', link: 'dummylink', id: 'dummyid' },
        ]);
    }
    // console.table(rawArticles);
  };

  const handleSiteChange = (newSite) => {
    if (newSite === 'se') {
      const newSeSite = prompt(
        'What site in the Stack Exchange network to search from?',
        'stackoverflow'
      );
      setSettings({
        ...settings,
        site: newSite,
        seSite: newSeSite,
      });
      updateResults(newSite, settings.sort, newSeSite);
    } else {
      setSettings({
        ...settings,
        site: newSite,
      });
      updateResults(newSite, settings.sort);
    }
    console.log(newSite);
  };

  const handleSortChange = (newSort) => {
    setSettings({
      ...settings,
      sort: newSort,
    });
    updateResults(settings.site, newSort, settings.seSite);
    console.log(newSort);
  };

  return (
    <>
      <Settings setSite={handleSiteChange} setSort={handleSortChange} />
      <form
        className="search-bar"
        onSubmit={(event) => {
          updateResults(settings.site, settings.sort, settings.seSite);
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
