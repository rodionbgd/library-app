export type Book = {
  id: number;
  title: string;
  authors: AuthorBase[];
  formats: {
    "image/jpeg": string;
  };
  rate: number;
  price: number | undefined;
  bookshelves?: [];
};

export type Author = Omit<AuthorBase, "name"> & {
  id: number;
  books: Book[];
};

export type AuthorObj = {
  [key: string]: Author;
};

export type AuthorBase = {
  name: string;
  birth_year: string | number;
  death_year: string | number;
};
