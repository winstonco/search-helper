import { Search } from './Search';
import React, { useState } from 'react';
import { SortedResults } from './SortedResults';
import { SavedResults } from './SavedResults';
import { Routes, Route } from 'react-router-dom';
import { Login } from './Login';

export function Main() {
  const [sort, setSort] = useState('default');
  const [rawArticles, setRawArticles] = useState();
  const [site, setSite] = useState('google');

  return (
    <>
      <Login />
      <div className="main">
        <a href="/">
          <h1>Search Helper</h1>
        </a>
        <div className="search">
          <Search
            setRawArticles={setRawArticles}
            setSort={setSort}
            sort={sort}
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
    </>
  );
}
