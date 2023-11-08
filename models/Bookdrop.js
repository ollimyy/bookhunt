class Bookdrop {
    constructor(bookISBN, longitude, latitude, clue) {
        this.bookISBN = bookISBN,
        this.longitude = longitude,
        this.latitude = latitude,
        this.clue = clue,
        this.collected_at = null
    }
}

export default Bookdrop;