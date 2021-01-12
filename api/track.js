require('dotenv').config()

const request = require('request')
module.exports = (req, res) => {

    if (req.method === "GET") {
        //musixmatch URL
        const name = req.que
        const url = `https://api.musixmatch.com/ws/1.1/track.search?q_track=${name}&apikey=${process.env.API_KEY}&page_size=3&page=1&s_track_rating=desc`
        request.get(url, (err, resp, body) => {
            if (resp.statusCode === 200) {
                res.send(body)
            }
        })
    }
}