class Restaurant{
    constructor(restaurant_id, name, description, location, open_time, close_time, status, owner) {
        this.restaurant_id = restaurant_id
        this.name = name
        this.description = description
        this.location = location
        this.open_time = open_time
        this.close_time = close_time
        this.status = status? status: "WaitConfirm"
        this.owner = owner
    }
}

module.exports = Restaurant