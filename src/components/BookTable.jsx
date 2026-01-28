import { Link } from "react-router-dom";

export default function BookTable({ books, onEdit, onDelete }) {
  if (!books.length) {
    return (
      <p className="muted">
        No books match your current search. Try adding a new entry.
      </p>
    );
  }

  const handleDelete = (bookId) => {
    const confirmed = window.confirm(
      "Delete this book from the inventory? This cannot be undone."
    );
    if (confirmed) {
      onDelete(bookId);
    }
  };

  return (
    <div className="table-wrapper" role="region" aria-label="Book inventory">
      <table className="book-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>Published</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>
                <Link className="book-link" to={`/books/${book.id}`}>
                  {book.title}
                </Link>
                <div className="subtle">ISBN: {book.isbn || "N/A"}</div>
              </td>
              <td>
                {book.author}
                <div className="subtle">Age: {book.authorAge ?? "N/A"}</div>
              </td>
              <td>{book.publisher || "N/A"}</td>
              <td>{book.publishedDate || "N/A"}</td>
              <td>
                <div className="action-group">
                  <Link className="link-button" to={`/books/${book.id}`}>
                    View
                  </Link>
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => onEdit(book.id)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => handleDelete(book.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
