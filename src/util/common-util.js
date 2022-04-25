class CommonUtil{
    parseJSON(item){
        return JSON.parse(JSON.stringify(item))
    }
}

module.exports = CommonUtil