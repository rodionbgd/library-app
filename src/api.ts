import axios from "axios";
import type { Book, AuthorObj } from "@/types";

export async function getAuthors(page = 1) {
  try {
    const response = await axios.get(
      `https://gutendex.com/books/?page=${page}`
    );
    if (response.status !== 200) {
      console.error("Unable to fetch data");
    }
    const books = await response.data.results;
    const authors = {} as AuthorObj;
    let lastId = 1;
    books.forEach((book: Book) => {
      book.rate = Math.ceil(Math.random() * 5);
      book.price = Math.ceil(Math.random() * 99 + 1);
      book.authors?.forEach((author) => {
        if (author.name in authors) {
          authors[author.name].books?.push(book);
          return;
        }
        const { name, ...authorDescription } = author;
        authors[name] = {
          books: [book],
          ...authorDescription,
          id: lastId,
        };
        lastId++;
      });
    });
    return authors;
  } catch (e) {
    console.error("Unable to fetch data");
    return {};
  }
}
