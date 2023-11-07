class Bookdrop {
    constructor(bookISBN, longitude, latitude, clue) {
        this.id = this.generateId()
        this.bookISBN = bookISBN,
        this.longitude = longitude,
        this.latitude = latitude,
        this.clue = clue,
        this.isCollected = false
    }
    generateId(){
        const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const length = 6;
        let id = ''

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            id += characters.charAt(randomIndex)
        }

        return id;
    }
}

export default Bookdrop;