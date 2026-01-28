import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import BookDetailsPage from "./pages/BookDetailsPage.jsx";
import BookListPage from "./pages/BookListPage.jsx";
import { fetchBooks } from "./services/booksApi.js";

const STORAGE_KEY = "bookInventory";

const createId = () =>
  globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const addIdIfMissing = (book) => ({
  ...book,
  id: book.id || createId(),
});

export default function App() {
  const [books, setBooks] = useState([]);
  const [editingBookId, setEditingBookId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadBooks = async () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setBooks(parsed.map(addIdIfMissing));
          setLoading(false);
          setIsReady(true);
          return;
        } catch (storageError) {
          console.warn("Unable to parse stored inventory.", storageError);
        }
      }

      try {
        const apiBooks = await fetchBooks();
        setBooks(apiBooks.map(addIdIfMissing));
      } catch (apiError) {
        setError(apiError.message || "Unable to load book inventory.");
      } finally {
        setLoading(false);
        setIsReady(true);
      }
    };

    loadBooks();
  }, []);

  useEffect(() => {
    if (isReady) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
  }, [books, isReady]);

  const editingBook = useMemo(
    () => books.find((book) => book.id === editingBookId) || null,
    [books, editingBookId]
  );

  const handleCreate = (book) => {
    setBooks((prev) => [addIdIfMissing(book), ...prev]);
  };

  const handleUpdate = (book) => {
    setBooks((prev) =>
      prev.map((item) => (item.id === book.id ? book : item))
    );
    setEditingBookId(null);
  };

  const handleDelete = (bookId) => {
    setBooks((prev) => prev.filter((book) => book.id !== bookId));
    if (editingBookId === bookId) {
      setEditingBookId(null);
    }
  };

  const handleEdit = (bookId) => {
    setEditingBookId(bookId);
  };

  const handleCancelEdit = () => {
    setEditingBookId(null);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Book Inventory Management System</h1>
          <p className="muted">
            Manage your collection, validate data, and explore details.
          </p>
        </div>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <BookListPage
              books={books}
              loading={loading}
              error={error}
              editingBook={editingBook}
              onCreate={handleCreate}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onCancelEdit={handleCancelEdit}
            />
          }
        />
        <Route
          path="/books/:id"
          element={
            <BookDetailsPage
              books={books}
              loading={loading}
              error={error}
              onDelete={handleDelete}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
