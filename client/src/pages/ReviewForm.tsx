import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Review, addReview } from '../lib/data';

export function ReviewForm() {
  const [photoUrl, setPhotoUrl] = useState<string>();
  const [review, setReview] = useState<Review>();
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const newReview = Object.fromEntries(formData) as unknown as Review;
      setReview(newReview);
      addReview(newReview);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(`Error adding review: ` + String(err));
    }
  }
  return (
    <div className="container">
      <div className="row">
        <div className="column-half d-flex justify-between margin-top">
          <h2>New Review</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="column-half">
            <img
              className="input-b-radius form-image"
              src={photoUrl || '/images/placeholder-image-square.jpg'}
              alt="review"
            />
          </div>
          <div className="column-half">
            <label className="margin-bottom-1 d-block">
              Book Title
              <input
                name="bookTitle"
                defaultValue={review?.bookTitle ?? ''}
                required
                className="input-b-color text-padding input-b-radius purple-outline input-height margin-bottom-2 d-block width-100"
                type="text"
              />
            </label>
            <label className="margin-bottom-1 d-block">
              Author
              <input
                name="author"
                defaultValue={review?.author ?? ''}
                required
                className="input-b-color text-padding input-b-radius purple-outline input-height margin-bottom-2 d-block width-100"
                type="text"
              />
            </label>
            <label className="margin-bottom-1 d-block">
              Photo URL
              <input
                name="photoUrl"
                defaultValue={review?.photoUrl ?? ''}
                required
                className="input-b-color text-padding input-b-radius purple-outline input-height margin-bottom-2 d-block width-100"
                type="text"
                onChange={(e) => setPhotoUrl(e.target.value)}
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
                      defaultValue={review?.rating ?? ''}
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
                defaultValue={review?.review ?? ''}
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
          </div>
        </div>
      </form>
    </div>
  );
}
