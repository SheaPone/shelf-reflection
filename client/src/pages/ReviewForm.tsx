import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addReview,
  readReview,
  removeReview,
  updateReview,
  type Review,
} from '../lib/data';

export function ReviewForm() {
  const { reviewId } = useParams();
  const [photoUrl, setPhotoUrl] = useState<string>();
  const isEditing = reviewId && reviewId !== 'new';
  const [error, setError] = useState<unknown>();
  const [reviews, setReviews] = useState<Review>();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function load(id: number) {
      setIsLoading(true);
      try {
        const review = await readReview(id);
        if (!review) throw new Error(`Review with ID ${id} not found`);
        setReviews(review);
        setPhotoUrl(review.photoUrl);
        setRating(review.rating);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (isEditing) load(+reviewId);
  }, [reviewId, isEditing]);

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
      if (isEditing) {
        updateReview({ ...reviews, ...newReview });
      } else {
        addReview(newReview);
      }
      navigate('/myreviews');
    } catch (err) {
      console.error(err);
      alert(`Error adding review: ` + String(err));
    }
  }

  function handleDelete() {
    if (!reviews?.reviewId) throw new Error('Should not be possible');
    try {
      removeReview(reviews.reviewId);
      navigate('/myreviews');
    } catch (err) {
      console.error(err);
      alert(`Error deleting review: ` + String(err));
    }
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        Error Loading Review with ID {reviewId}:{' '}
        {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }

  return (
    <div className="container margin-auto">
      <div className="row">
        <div className="column-half d-flex justify-between margin-top-2">
          <h2>{isEditing ? 'Edit Review' : 'New Review'}</h2>
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
                defaultValue={reviews?.bookTitle ?? ''}
                required
                className="input-b-color text-padding input-b-radius purple-outline input-height margin-bottom-2 d-block width-100"
                type="text"
              />
            </label>
            <label className="margin-bottom-1 d-block">
              Author
              <input
                name="author"
                defaultValue={reviews?.author ?? ''}
                required
                className="input-b-color text-padding input-b-radius purple-outline input-height margin-bottom-2 d-block width-100"
                type="text"
              />
            </label>
            <label className="margin-bottom-1 d-block">
              Photo URL
              <input
                name="photoUrl"
                defaultValue={reviews?.photoUrl ?? ''}
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
                      defaultValue={reviews?.rating ?? ''}
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
                defaultValue={reviews?.review ?? ''}
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
            {isEditing && (
              <button
                className="delete-review-button"
                type="button"
                onClick={() => setIsDeleting(true)}>
                Delete Review
              </button>
            )}
            <button className="input-b-radius text-padding pink-background white-text">
              SAVE
            </button>
          </div>
        </div>
      </form>
      {isDeleting && (
        <div
          id="modalContainer"
          className="modal-container d-flex justify-center align-center">
          <div className="delete-modal row">
            <div className="delete-review-title column-full d-flex justify-center">
              <p>Are you sure you want to delete this review?</p>
            </div>
            <div className="column-full d-flex justify-between">
              <button
                className="cancel modal-button"
                onClick={() => setIsDeleting(false)}>
                Cancel
              </button>
              <button
                className=" confirm modal-button red-background white-text"
                onClick={handleDelete}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
