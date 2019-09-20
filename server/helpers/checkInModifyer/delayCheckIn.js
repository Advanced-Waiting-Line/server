module.exports = (current, minutes) =>{
    current = new Date(current)
    return new Date(current.setTime(current.getTime() + (minutes*60000)))
}