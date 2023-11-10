class Bookdrop {
    constructor(longitude, latitude, book, clue) {
        this.longitude = longitude,
        this.latitude = latitude,
        this.book = book,
        this.clue = clue,
        this.collected_at = null
    }
}

export default Bookdrop;