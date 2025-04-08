import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchBook } from '../lib/data';

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const books = await searchBook(searchQuery);
    console.log('books:', books);
    console.log(searchQuery);
  }
  return (
    <>
      <div>
        <form id="search-books" onSubmit={handleSearch}>
          <label className="homeSearch" htmlFor="search">
            Search
          </label>
          <input
            type="search"
            id="search"
            name="search"
            placeholder="Search for book by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button id="search-button">Search</button>
        </form>
      </div>
      <div className="navigate-new margin-top-6">
        <p>Can't find the book you're looking for? Click below!</p>
        <Link to="/details/new" className="white-text form-link">
          NEW
        </Link>
      </div>
    </>
  );
}
