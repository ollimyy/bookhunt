class Book {
    constructor(isbn, title, author) {
        this.code = this.generateCode(),
        this.isbn = isbn,
        this.title = title,
        this.author = author,
        this.bookdrops = []
    }

    generateCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        const length = 6;
        let code = '';

        for(let i = 0; i < length; i++){
            const randomIndex = Math.floor(Math.random() * chars.length);
            code += chars.charAt(randomIndex);
        }

        return code;
    }
}

export default Book;