import React from 'react';
import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Review, addReview } from '../lib/data';
import { Book } from '../lib/data';
import { searchBook } from '../lib/data';
import { useUser } from '../components/useUser';
export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const [formModal, setFormModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const navigate = useNavigate();
  const { user } = useUser();

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    const books = await searchBook(searchQuery);
    setIsLoading(false);
    if (books.length === 0) return;
    setSearchResults(books);
    setSearchModal(true);
  }

  function closeModal() {
    setSearchModal(false);
    setSearchResults(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const bookTitle = formData.get('bookTitle') as string;
      const author = formData.get('author') as string;
      const photoUrl = formData.get('photoUrl') as string;
      const review = formData.get('review') as string;
      const newReview: Review = {
        bookTitle,
        author,
        photoUrl,
        rating,
        review,
      };
      addReview(newReview);
      closeModal();
      navigate('/myreviews');
    } catch (err) {
      console.error(err);
      alert(`Error adding review: ` + String(err));
    }
  }

  function handleNewForm(book: Book) {
    setIsLoading(true);
    setSelectedBook(book);
    setSearchModal(false);
    setFormModal(true);
    setIsLoading(false);
  }

  function handleCancel() {
    setFormModal(false);
  }
  if (!user) return <div>Login to continue</div>;
  if (isLoading) return <div>Loading...</div>;
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
        <div
          id="modalContainer"
          className="modal-container d-flex justify-center align-center">
          <div className="modal column-full">
            <div className="d-flex justify-between align-center">
              <p>Search Results</p>
              <button className="searchModal" onClick={closeModal}>
                X
              </button>
            </div>
            <div className="modal-results">
              {searchResults.map((book) => (
                <div
                  key={book.bookId}
                  className="book-result d-flex align-center gap-1">
                  <div className="book-image">
                    <img
                      src={book.photoUrl}
                      alt={book.title}
                      className="cursor-pointer"
                      onClick={() => handleNewForm(book)}
                    />
                  </div>
                  <div className="book-info">
                    <p className="book-title">{book.title}</p>
                    <p className="book-author">{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {formModal && (
        <div
          id="modalContainer"
          className="modal-container d-flex justify-center align-center">
          <div className="book-modal book-modal-results">
            <div className="row">
              <div className="column-half d-flex justify-between">
                <h2>New Review</h2>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="column-half">
                  <img
                    className="input-b-radius form-image book-margin-left"
                    src={
                      selectedBook?.photoUrl ||
                      '/images/placeholder-image-square.jpg'
                    }
                    alt="review"
                  />
                </div>
                <div className="column-half">
                  <label className="margin-bottom-1 d-block">
                    Book Title
                    <input
                      name="bookTitle"
                      defaultValue={selectedBook?.title ?? ''}
                      required
                      className="input-b-color text-padding input-b-radius purple-outline input-height margin-bottom-2 d-block width-100"
                      type="text"
                    />
                  </label>
                  <label className="margin-bottom-1 d-block">
                    Author
                    <input
                      name="author"
                      defaultValue={selectedBook?.author ?? ''}
                      required
                      className="input-b-color text-padding input-b-radius purple-outline input-height margin-bottom-2 d-block width-100"
                      type="text"
                    />
                  </label>
                  <label className="margin-bottom-1 d-block">
                    Photo URL
                    <input
                      name="photoUrl"
                      defaultValue={selectedBook?.photoUrl ?? ''}
                      required
                      className="input-b-color text-padding input-b-radius purple-outline input-height margin-bottom-2 d-block width-100"
                      type="text"
                      onChange={(e) =>
                        setSelectedBook({
                          ...selectedBook!,
                          photoUrl: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label className="margin-bottom-1 d-block">
                    Rating
                    <div className="star-rating">
                      {[...Array(5)].map((_, index) => {
                        index += 1;
                        return (
                          <i
                            key={index}
                            id={`star-${index}`}
                            defaultValue={''}
                            className={
                              index <= rating
                                ? 'fa-solid fa-star star filled'
                                : 'fa-regular fa-star star'
                            }
                            onClick={() => setRating(index)}
                          />
                        );
                      })}
                    </div>
                  </label>
                </div>
              </div>
              <div className="row margin-bottom-1">
                <div className="column-full">
                  <label className="margin-bottom-1 d-block">
                    Review
                    <textarea
                      name="review"
                      defaultValue={''}
                      required
                      className="input-b-color text-padding input-b-radius purple-outline d-block width-100"
                      cols={30}
                      rows={10}
                    />
                  </label>
                </div>
              </div>
              <div className="row">
                <div className="column-full d-flex justify-between">
                  <button className="input-b-radius text-padding pink-background white-text">
                    SAVE
                  </button>
                  <button onClick={handleCancel}>Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
