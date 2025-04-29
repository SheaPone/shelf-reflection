import { useState } from 'react';
import { readReviews, Review } from '../lib/data';
import { FaPencilAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { useEffect } from 'react';

export function ReviewList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedPhrase, setSearchedPhrase] = useState('');
  const [error, setError] = useState<unknown>();
  const { user } = useUser();

  useEffect(() => {
    async function load() {
      try {
        const reviews = await readReviews();
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
      review.bookTitle.toLowerCase().includes(phrase) ||
      review.author.toLowerCase().includes(phrase) ||
      review.review.toLowerCase().includes(phrase)
    );
  });

  return (
    <div className="container margin-auto">
      <div className="row">
        <div className="column-full d-flex justify-between align-center black-text margin-top-2">
          <h1>My Reviews</h1>
          <label className="review-search margin-top-2" htmlFor="search">
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
            <p className="no-reviews">No Reviews yet! :(</p>
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
  return (
    <>
      <li>
        <div className="row">
          <div className="column-half">
            <img
              className="input-b-radius form-image margin-top"
              src={review.photoUrl}
              alt=""
            />
          </div>
          <div className="column-half">
            <div className="row">
              <div className="column-full d-flex justify-between margin-top black-text">
                <h3>{review.bookTitle}</h3>
                <Link
                  className="float-right"
                  to={`/details/${review.reviewId}`}>
                  <FaPencilAlt />
                </Link>
              </div>
              <div className="column-full d-flex justify-between black-text">
                <h3>{review.author}</h3>
              </div>
            </div>
            <div className="float-left margin-left pink">
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
    </>
  );
}
