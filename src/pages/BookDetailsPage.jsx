import { Link, useNavigate, useParams } from "react-router-dom";

export default function BookDetailsPage({ books, loading, error, onDelete }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = books.find((item) => item.id === id);

  if (loading) {
    return (
      <main className="page">
        <section className="panel details-panel">
          <div className="status">Loading book details...</div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <section className="panel details-panel">
          <div className="status error">{error}</div>
          <Link className="link-button" to="/">
            Back to inventory
          </Link>
        </section>
      </main>
    );
  }

  if (!book) {
    return (
      <main className="page">
        <section className="panel details-panel">
          <h2>Book not found</h2>
          <p className="muted">
            We could not locate that book in the inventory.
          </p>
          <Link className="link-button" to="/">
            Back to inventory
          </Link>
        </section>
      </main>
    );
  }

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Delete this book from the inventory? This cannot be undone."
    );
    if (confirmed) {
      onDelete(book.id);
      navigate("/");
    }
  };

  return (
    <main className="page">
      <section className="panel details-panel">
        <div className="details-header">
          <div>
            <Link className="link-button" to="/">
              Back
            </Link>
            <h2>{book.title}</h2>
            <p className="muted">by {book.author}</p>
          </div>
          <button type="button" className="danger" onClick={handleDelete}>
            Delete
          </button>
        </div>

        <div className="details-body">
          <div className="details-grid">
            <div>
              <span className="label">Author Email</span>
              <span>{book.authorEmail || "N/A"}</span>
            </div>
            <div>
              <span className="label">Author Age</span>
              <span>{book.authorAge ?? "N/A"}</span>
            </div>
            <div>
              <span className="label">Publisher</span>
              <span>{book.publisher || "N/A"}</span>
            </div>
            <div>
              <span className="label">Published Date</span>
              <span>{book.publishedDate || "N/A"}</span>
            </div>
            <div>
              <span className="label">ISBN</span>
              <span>{book.isbn || "N/A"}</span>
            </div>
          </div>

          <div className="overview">
            <h3>Overview</h3>
            <p>{book.overview}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
