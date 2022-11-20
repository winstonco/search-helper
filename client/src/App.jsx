import './App.css';
import { Search } from './Search';
import React, { useState } from 'react';
import { SortedResults } from './SortedResults';
import { SavedResults } from './SavedResults';
import { Routes, Route } from 'react-router-dom';

function App() {
  const [sort, setSort] = useState('default');
  const [rawArticles, setRawArticles] = useState();
  const [site, setSite] = useState('google');

  return (
    <div className="App">
      <a href="/">
        <h1>Search Helper</h1>
      </a>
      <div className="search">
        <Search
          setSort={setSort}
          setRawArticles={setRawArticles}
          setSite={setSite}
          site={site}
        />
        <Routes>
          <Route
            path="/results"
            element={
              <SortedResults
                rawArticles={rawArticles}
                sort={sort}
                site={site}
              />
            }
          />
          <Route path="/saved" element={<SavedResults />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
