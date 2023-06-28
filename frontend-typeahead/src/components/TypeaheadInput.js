import React, { useState, useEffect } from 'react';
import SuggestionsList from './SuggestionsList';
import CacheManager from '../utils/CacheManager';

// This endpoint is from TheMovieDB https://developers.themoviedb.org/3/search/search-movies
// There is a missing query string `query` to make the search
const MOVIES_ENDPOINT =
  "https://api.themoviedb.org/3/search/movie?api_key=a0471c3efcac73e624b948daeda6085f";

export default function TypeaheadInput() {
    const [inputValue, setInputValue] = useState('');
    const [hasToShowTheList, setHasToShowTheList] = useState(false);
    const [isFetchingApi, setIsFetchingApi] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    const fetchSuggestions = () => {
        const cachedData = CacheManager.get(inputValue);
        if (cachedData) {
            setSuggestions(cachedData);

            return;
        }

        setIsFetchingApi(true)
        setHasToShowTheList(false)
        fetch(MOVIES_ENDPOINT + "&query=" + inputValue)
            .then(response => response.json())
            .then(data => {
                setSuggestions(data['results'] ?? []);
                CacheManager.store(inputValue, data['results'], 1);
                setHasToShowTheList(true)
            })
            .catch(error => {
                console.error('Error: ', error);
            })
            .finally(() => setIsFetchingApi(false))
    };

    useEffect(() => {
        if (!inputValue) {
            setHasToShowTheList(false)
        }

        const timer = setTimeout(() => {
            if (inputValue) {
                fetchSuggestions();
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [inputValue]);

    const handleInputChange = (e) => {
        setHasToShowTheList(true)
        setInputValue(e.target.value);
    };

    const handleInputBlur = () => {
        setHasToShowTheList(false)
        if (inputValue) {
            fetchSuggestions();

            return;
        }

        setSuggestions([]);
    };

  return (
    <div className="flex flex-col justify-center items-center">
      <input
        data-testid="input-search"
        className="text-lg text-primary border-primary border rounded-md w-48 focus:w-96 transition-all focus:outline-none p-1 mb-2"
        placeholder="Search"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={handleInputChange}
      />
      {hasToShowTheList && <SuggestionsList suggestions={suggestions} />}
      {isFetchingApi && <span>Loading...</span>}
    </div>
  );
}
