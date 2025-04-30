import { useState } from 'react';
import { readFeed, Review, summaryBook } from '../lib/data';
import { FaComment } from 'react-icons/fa';
import { useUser } from '../components/useUser';
import { useEffect } from 'react';

export function Feed() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedPhrase, setSearchedPhrase] = useState('');
  const [error, setError] = useState<unknown>();
  const { user } = useUser();

  useEffect(() => {
    async function load() {
      try {
        const reviews = await readFeed();
        setReviews(reviews);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (user) load();
  }, []);
  if (!user) return <div>Login to continue</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        Error Loading Reviews:{' '}
        {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }

  const filteredReviews = reviews.filter((review) => {
    const phrase = searchedPhrase.toLowerCase();
    return (
      review.username?.toLowerCase().includes(phrase) ||
      review.bookTitle.toLowerCase().includes(phrase) ||
      review.author.toLowerCase().includes(phrase) ||
      review.review.toLowerCase().includes(phrase)
    );
  });

  return (
    <div className="container margin-top-2 margin-auto">
      <div className="row">
        <div className="column-full d-flex justify-between align-center black-text margin-bottom-4">
          <h1>Feed</h1>
          <label className="review-search" htmlFor="search">
            <input
              type="search"
              id="search"
              name="search"
              placeholder="Search through reviews"
              value={searchedPhrase}
              onChange={(e) => setSearchedPhrase(e.target.value)}
            />
          </label>
        </div>
      </div>
      <div className="row">
        <div className="column-full">
          {reviews.length === 0 ? (
            <p className="no-reviews">No posts yet! :(</p>
          ) : (
            <ul className="review-ul">
              {filteredReviews.map((review) => (
                <ReviewCard key={review.reviewId} review={review} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

type ReviewProps = {
  review: Review;
};

function ReviewCard({ review }: ReviewProps) {
  const [summaryModal, setSummaryModal] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  async function openSummary() {
    setSummaryModal(true);
    if (!summary) {
      setIsLoadingSummary(true);
      await handleSummary();
    }
  }

  async function handleSummary() {
    setSummaryError(null);
    try {
      const result = await summaryBook(review.bookTitle);
      setSummary(result);
    } catch (error: any) {
      setSummaryError(error.message || 'Error retrieving summary');
    } finally {
      setIsLoadingSummary(false);
    }
  }

  function handleCloseSummaryModal() {
    setSummaryModal(false);
  }

  return (
    <>
      <li>
        <p className="float-left margin-bottom-2 bold underline">
          Posted by: {review.username?.toUpperCase()}
        </p>
        <div className="row margin-bottom-6">
          <div className="column-half">
            <img
              className="input-b-radius form-image "
              src={review.photoUrl}
              alt=""
            />
          </div>
          <div className="column-half">
            <div className="row ">
              <div className="column-full d-flex justify-between black-text">
                <h3>{review.bookTitle}</h3>
                <FaComment className="pink" onClick={openSummary} />
              </div>
              <div className="column-full d-flex justify-between black-text">
                <h3>{review.author}</h3>
              </div>
            </div>
            <div className="float-left margin-left-1 pink">
              {[...Array(5)].map((_, index) => {
                index += 1;
                return (
                  <i
                    key={index}
                    id={`star-${index}`}
                    className={
                      index <= review.rating
                        ? 'fa-solid fa-star star filled'
                        : 'fa-regular fa-star star'
                    }
                  />
                );
              })}
            </div>
            <div className="column-full d-flex justify-between black-text">
              <p>{review.review}</p>
            </div>
          </div>
        </div>
      </li>
      {summaryModal && review.bookTitle && (
        <div
          id="modalContainer"
          className="modal-container d-flex justify-center align-center">
          <div className="modal column-full">
            <div className="d-flex justify-between align-center">
              <p>Book Summary</p>
              <button className="searchModal" onClick={handleCloseSummaryModal}>
                X
              </button>
            </div>
            <div className="modal-results">
              {isLoadingSummary && <p>Loading summary...</p>}
              {summaryError && <p className="error">{summaryError}</p>}
              {summary && <p>{summary || 'Loading summary...'}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
