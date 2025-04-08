import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../lib/data';
import { searchBook } from '../lib/data';

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[] | null>(null);
  const [searchModal, setSearchModal] = useState(false);
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const books = await searchBook(searchQuery);
    setSearchResults(books);
    setSearchModal(true);
    console.log('books:', books);
  }
  function closeModal() {
    setSearchModal(false);
    setSearchResults(null);
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
      {searchModal && searchResults && (
        <div className="modal-container">
          <button onClick={closeModal}>X</button>
          <h2>Search Results</h2>
        </div>
      )}
    </>
  );
}
