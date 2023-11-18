import Book from "../models/Book";

// https://openlibrary.org/dev/docs/api/books
const getBookByISBN = async (isbn) => {
    try {
        const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`);
        const bookData = await response.json();

        // Check if the ISBN exists in the response
        if (`ISBN:${isbn}` in bookData) {
            const bookInfo = bookData[`ISBN:${isbn}`];

            if (bookInfo.title && bookInfo.authors && bookInfo.authors.length > 0) {
                const title = bookInfo.title;
                const author = bookInfo.authors[0].name;
                const book = new Book(isbn, title, author);

                return book;

            } else {
                return null
            }

        } else {
            return null
        }

    } catch (error) {
        console.error(`Cannot fetch book information for ISBN: ${isbn}: ${error}`);
        return null;
    }
}

export { getBookByISBN };