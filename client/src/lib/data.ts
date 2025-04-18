export type Review = {
  reviewId?: number;
  bookTitle: string;
  author: string;
  photoUrl: string;
  rating: number;
  review: string;
  userId?: number;
  username?: string;
};

import { BookProps } from '../pages/Catalog';

export type Book = {
  title: string;
  author: string;
  photoUrl: string;
  bookId: number;
};

import { User } from '../components/UserContext';

const authKey = 'um.auth';

type Auth = {
  user: User;
  token: string;
};

export function saveAuth(user: User, token: string): void {
  const auth: Auth = { user, token };
  localStorage.setItem(authKey, JSON.stringify(auth));
}

export function removeAuth(): void {
  localStorage.removeItem(authKey);
}

export function readUser(): User | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).user;
}

export function readToken(): string | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).token;
}

export async function readReviews(): Promise<Review[]> {
  const token = readToken();
  const req = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await fetch('/api/reviews', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Review[];
}

export async function readReview(
  reviewId: number
): Promise<Review | undefined> {
  const token = readToken();
  const req = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await fetch(`/api/reviews/${reviewId}`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Review;
}

export async function addReview(review: Review): Promise<Review> {
  const token = readToken();
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(review),
  };
  const res = await fetch('/api/reviews', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Review;
}

export async function updateReview(review: Review): Promise<Review> {
  const token = readToken();
  const req = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(review),
  };
  const res = await fetch(`/api/reviews/${review.reviewId}`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Review;
}

export async function searchBook(query: string): Promise<Book[]> {
  const token = readToken();
  const response = await fetch(`/api/books?q=${encodeURIComponent(query)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.statusText);
  if (!response.ok) throw new Error(`fetch Error ${response.statusText}`);
  const data = await response.json();
  console.log(data);
  if (data.totalItems === 0) {
    alert('Book does not exist');
    return [];
  }
  const books = data.items.map((item: any) => {
    return {
      title: item.volumeInfo.title || 'Untitled',
      author: item.volumeInfo.authors ?? 'Author Unknown',
      photoUrl: item.volumeInfo.imageLinks?.thumbnail ?? '/images/blank.png',
      bookId: item.id,
    };
  });
  return books as Book[];
}

export async function removeReview(reviewId: number) {
  const token = readToken();
  const req = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await fetch(`/api/reviews/${reviewId}`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
}

export async function summaryBook(bookTitle: string): Promise<string> {
  const token = readToken();
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: bookTitle }),
  };
  const res = await fetch('/api/summary', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  const data = await res.json();
  return data.summary;
}

export async function readFeed(): Promise<Review[]> {
  const res = await fetch('/api/feed');
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Review[];
}

export async function searchBookShop(search: string): Promise<BookProps[]> {
  const token = readToken();
  const response = await fetch(`/api/books?q=${encodeURIComponent(search)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.statusText);
  if (!response.ok) throw new Error(`fetch Error ${response.statusText}`);
  const data = await response.json();
  console.log(data);
  if (data.totalItems === 0) {
    alert('Book does not exist');
    return [];
  }
  const books = data.items.map((item: any) => {
    return {
      bookId: item.id,
      title: item.volumeInfo.title || 'Untitled',
      author: item.volumeInfo.authors ?? 'Author Unknown',
      imageUrl: item.volumeInfo.imageLinks?.thumbnail ?? '/images/blank.png',
      bookSummary: item.volumeInfo.description ?? 'Description Unknown',
    };
  });
  return books as BookProps[];
}
