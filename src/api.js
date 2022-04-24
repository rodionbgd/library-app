export async function getBooks(page = 1) {
  try {
    const response = await fetch(`https://gutendex.com/books/?page=${page}`);
    if (response.status !== 200) {
      console.error("Unable to fetch data");
    }
    const data = await response.json();
    const books = data.results;
    books.forEach((book) => {
      book.rate = Math.ceil(Math.random() * 5);
    });
    return books;
  } catch (e) {
    console.error("Unable to fetch data");
    return [];
  }
}
