import { useState } from 'react';
import { searchBookShop } from '../lib/data';
import { useCart } from '../components/useCart';
import { useNavigate } from 'react-router-dom';

export type BookProps = {
  bookId: number;
  title: string;
  author: string;
  imageUrl: string;
  bookSummary: string;
};

export function Catalog() {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<BookProps[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    const books = await searchBookShop(search);
    setIsLoading(false);
    if (books.length === 0) return;
    setSearchResults(books);
    console.log('books:', books);
  }

  function handleAddToCart(book: BookProps) {
    if (!book) throw new Error('Should never happen');
    addToCart(book);
    alert(`Added ${book?.title} to cart`);
    navigate('/cart');
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <form id="search-books" onSubmit={handleSearch}>
          <label className="homeSearch" htmlFor="search">
            Book Shop
          </label>
          <input
            type="search"
            id="search"
            name="search"
            placeholder="Search for book by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button id="search-button">Search</button>
        </form>
      </div>
      {searchResults && (
        <div className="search-results">
          {searchResults.map((book, index) => (
            <div
              key={index}
              className="block cursor-pointer text-gray-900 rounded border border-gray-300 mb-4">
              <div className="flex-auto p-6">
                <img className="cart-image" src={book.imageUrl}></img>
                <h5 className="font-bold mb-3">{book.title}</h5>
                <h5 className="font-bold mb-3">{book.author}</h5>
                <h6>$20</h6>
                <h6>{book.bookSummary}</h6>
                <button onClick={() => handleAddToCart(book)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
