import { useMemo, useState } from "react";
import BookForm from "../components/BookForm.jsx";
import BookTable from "../components/BookTable.jsx";

const sortOptions = [
  { value: "title", label: "Title" },
  { value: "author", label: "Author" },
  { value: "publisher", label: "Publisher" },
  { value: "publishedDate", label: "Published date" },
  { value: "authorAge", label: "Author age" },
];

const getSortValue = (book, sortKey) => {
  if (sortKey === "publishedDate") {
    return new Date(book.publishedDate).getTime() || 0;
  }
  if (sortKey === "authorAge") {
    return book.authorAge ?? 0;
  }
  return String(book[sortKey] || "").toLowerCase();
};

export default function BookListPage({
  books,
  loading,
  error,
  editingBook,
  onCreate,
  onUpdate,
  onDelete,
  onEdit,
  onCancelEdit,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");

  const filteredBooks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filtered = books.filter((book) => {
      if (!normalizedSearch) return true;
      return (
        String(book.title || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(book.author || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(book.publisher || "")
          .toLowerCase()
          .includes(normalizedSearch)
      );
    });

    return filtered.sort((a, b) => {
      const aValue = getSortValue(a, sortKey);
      const bValue = getSortValue(b, sortKey);
      if (aValue === bValue) return 0;
      const compare = aValue > bValue ? 1 : -1;
      return sortDirection === "asc" ? compare : -compare;
    });
  }, [books, searchTerm, sortKey, sortDirection]);

  return (
    <main className="page">
      <div className="layout-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>{editingBook ? "Edit book" : "Add a new book"}</h2>
              <p className="muted">
                All fields validate age, email, and required strings.
              </p>
            </div>
          </div>
          <div className="panel-body">
            <BookForm
              editingBook={editingBook}
              onCreate={onCreate}
              onUpdate={onUpdate}
              onCancelEdit={onCancelEdit}
            />
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Inventory</h2>
              <p className="muted">
                {books.length} books available - scroll to view more
              </p>
            </div>
            <div className="panel-controls">
              <input
                className="search-input"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search title, author, publisher"
              />
              <select
                className="select"
                value={sortKey}
                onChange={(event) => setSortKey(event.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    Sort by {option.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="ghost"
                onClick={() =>
                  setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
                }
              >
                {sortDirection === "asc" ? "Ascending" : "Descending"}
              </button>
            </div>
          </div>
          <div className="panel-body">
            {loading && <div className="status">Loading books...</div>}
            {error && !loading && <div className="status error">{error}</div>}
            {!loading && !error && (
              <BookTable
                books={filteredBooks}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
