const BOOKS_ENDPOINT =
  "https://openlibrary.org/search.json?q=programming&limit=18";

const clampNumber = (value, min, max) => Math.min(Math.max(value, min), max);

const buildOverview = (doc) => {
  if (Array.isArray(doc.first_sentence) && doc.first_sentence[0]) {
    return doc.first_sentence[0];
  }
  if (doc.first_sentence && typeof doc.first_sentence === "string") {
    return doc.first_sentence;
  }
  if (doc.subtitle) {
    return doc.subtitle;
  }
  return "Overview not available. Add details from the inventory form.";
};

const buildEmail = (author) => {
  if (!author) return "author@books.local";
  const sanitized = author
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, ".");
  return `${sanitized || "author"}@books.local`;
};

export const fetchBooks = async () => {
  const response = await fetch(BOOKS_ENDPOINT);
  if (!response.ok) {
    throw new Error("Unable to fetch books from the API.");
  }
  const data = await response.json();
  const currentYear = new Date().getFullYear();

  return (data.docs || []).map((doc, index) => {
    const author = doc.author_name?.[0] || "Unknown Author";
    const publishYear = doc.first_publish_year || currentYear;
    const id = doc.key?.replace("/works/", "") || `${publishYear}-${index}`;
    const authorAge = clampNumber(
      currentYear - publishYear + 28,
      25,
      90
    );

    return {
      id,
      title: doc.title || "Untitled Book",
      author,
      authorAge,
      authorEmail: buildEmail(author),
      publisher: doc.publisher?.[0] || "Unknown Publisher",
      publishedDate: `${publishYear}-01-01`,
      overview: buildOverview(doc),
      isbn: doc.isbn?.[0] || "N/A",
    };
  });
};
