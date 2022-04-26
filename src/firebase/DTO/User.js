class User{
    constructor(uid, email, first_name, last_name, role, deliver_status,
                address_first_line, address_second_line, city, country, postcode) {
        this.uid = uid
        this.email =email
        this.first_name= first_name
        this.last_name = last_name
        this.role = role
        this.deliver_status = deliver_status ? deliver_status : "waiting"
        this.address_first_line = address_first_line ? address_first_line : ""
        this.address_second_line = address_second_line ? address_second_line : ""
        this.city = city ? city : ""
        this.country = country ? country : ""
        this.postcode = postcode ? postcode : ""
    }
}

module.exports = User