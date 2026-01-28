import { useEffect, useMemo, useState } from "react";

const EMPTY_FORM = {
  title: "",
  author: "",
  authorAge: "",
  authorEmail: "",
  publisher: "",
  publishedDate: "",
  overview: "",
  isbn: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeBook = (book) => ({
  title: book.title || "",
  author: book.author || "",
  authorAge:
    book.authorAge === 0 || book.authorAge ? String(book.authorAge) : "",
  authorEmail: book.authorEmail || "",
  publisher: book.publisher || "",
  publishedDate: book.publishedDate || "",
  overview: book.overview || "",
  isbn: book.isbn && book.isbn !== "N/A" ? book.isbn : "",
});

export default function BookForm({
  editingBook,
  onCreate,
  onUpdate,
  onCancelEdit,
}) {
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingBook) {
      setFormValues(normalizeBook(editingBook));
    } else {
      setFormValues(EMPTY_FORM);
    }
    setErrors({});
  }, [editingBook]);

  const isEditing = useMemo(() => Boolean(editingBook), [editingBook]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formValues.title.trim()) {
      nextErrors.title = "Title is required.";
    }
    if (!formValues.author.trim()) {
      nextErrors.author = "Author name is required.";
    }
    if (!formValues.publisher.trim()) {
      nextErrors.publisher = "Publisher is required.";
    }
    if (!formValues.publishedDate) {
      nextErrors.publishedDate = "Published date is required.";
    }
    if (!formValues.overview.trim()) {
      nextErrors.overview = "Overview is required.";
    }
    if (!formValues.authorAge.trim()) {
      nextErrors.authorAge = "Author age is required.";
    } else if (!/^\d+$/.test(formValues.authorAge)) {
      nextErrors.authorAge = "Author age must be an integer.";
    } else {
      const ageValue = Number.parseInt(formValues.authorAge, 10);
      if (ageValue < 12 || ageValue > 120) {
        nextErrors.authorAge = "Author age must be between 12 and 120.";
      }
    }
    if (!formValues.authorEmail.trim()) {
      nextErrors.authorEmail = "Author email is required.";
    } else if (!EMAIL_PATTERN.test(formValues.authorEmail)) {
      nextErrors.authorEmail = "Author email must be a valid address.";
    }

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload = {
      id: editingBook?.id,
      title: formValues.title.trim(),
      author: formValues.author.trim(),
      authorAge: Number.parseInt(formValues.authorAge, 10),
      authorEmail: formValues.authorEmail.trim(),
      publisher: formValues.publisher.trim(),
      publishedDate: formValues.publishedDate,
      overview: formValues.overview.trim(),
      isbn: formValues.isbn.trim() || "N/A",
    };

    if (isEditing) {
      onUpdate(payload);
    } else {
      onCreate(payload);
      setFormValues(EMPTY_FORM);
    }
    setErrors({});
  };

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formValues.title}
            onChange={handleChange}
            placeholder="Enter book title"
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="author">Author</label>
          <input
            id="author"
            name="author"
            type="text"
            value={formValues.author}
            onChange={handleChange}
            placeholder="Author name"
          />
          {errors.author && (
            <span className="field-error">{errors.author}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="authorAge">Author Age</label>
          <input
            id="authorAge"
            name="authorAge"
            type="text"
            inputMode="numeric"
            value={formValues.authorAge}
            onChange={handleChange}
            placeholder="e.g. 42"
          />
          {errors.authorAge && (
            <span className="field-error">{errors.authorAge}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="authorEmail">Author Email</label>
          <input
            id="authorEmail"
            name="authorEmail"
            type="email"
            value={formValues.authorEmail}
            onChange={handleChange}
            placeholder="author@email.com"
          />
          {errors.authorEmail && (
            <span className="field-error">{errors.authorEmail}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="publisher">Publisher</label>
          <input
            id="publisher"
            name="publisher"
            type="text"
            value={formValues.publisher}
            onChange={handleChange}
            placeholder="Publisher name"
          />
          {errors.publisher && (
            <span className="field-error">{errors.publisher}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="publishedDate">Published Date</label>
          <input
            id="publishedDate"
            name="publishedDate"
            type="date"
            value={formValues.publishedDate}
            onChange={handleChange}
          />
          {errors.publishedDate && (
            <span className="field-error">{errors.publishedDate}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="isbn">ISBN (optional)</label>
          <input
            id="isbn"
            name="isbn"
            type="text"
            value={formValues.isbn}
            onChange={handleChange}
            placeholder="ISBN number"
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="overview">Overview</label>
        <textarea
          id="overview"
          name="overview"
          rows={5}
          value={formValues.overview}
          onChange={handleChange}
          placeholder="Short description of the book"
        />
        {errors.overview && (
          <span className="field-error">{errors.overview}</span>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="primary">
          {isEditing ? "Update Book" : "Add Book"}
        </button>
        {isEditing && (
          <button type="button" className="ghost" onClick={onCancelEdit}>
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}
