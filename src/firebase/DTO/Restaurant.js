class Restaurant{
    constructor(id, name, description, location, open_time, close_time, status) {
        this.id = id
        this.name = name
        this.description = description
        this.location = location
        this.open_time = open_time
        this.close_time = close_time
        this.status = status? status: "WaitConfirm"
    }
}

module.exports = Restaurant