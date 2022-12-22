import { Search } from './Search';
import React, { useState } from 'react';
import { SortedResults } from './SortedResults';
import { SavedResults } from './SavedResults';
import { Routes, Route, Link } from 'react-router-dom';
import { Login } from './Login';

export function Main() {
  const [rawArticles, setRawArticles] = useState();
  const [settings, setSettings] = useState({
    sort: 'default',
    site: 'google',
    seSite: 'stackexchange',
  });

  return (
    <>
      <Login />
      <div className="main">
        <Link to="/">
          <h1>Search Helper</h1>
        </Link>

        <div className="search">
          <Search
            setRawArticles={setRawArticles}
            settings={settings}
            setSettings={setSettings}
          />
          <Routes>
            <Route
              path="/results"
              element={
                <SortedResults
                  propRawArticles={rawArticles}
                  settings={settings}
                />
              }
            />
            <Route
              path="/saved"
              element={<SavedResults settings={settings} />}
            />
          </Routes>
        </div>
      </div>
    </>
  );
}
