require('dotenv').config()
const request = require('request')

module.exports = (req, res) => {
    const id = req.query
    console.log(id)
    const url = `http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${id}&apikey=${process.env.API_KEY}`
    request(url, (err, resp, body) => {
        if (resp.statusCode === 200) {
            res.send(body)
        }
    })
}