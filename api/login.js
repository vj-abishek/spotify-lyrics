require('dotenv').config()


//global variable
const CLIENT_ID = process.env.CLIENT_ID
const REDIRECT_URI =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000/callback'
        : process.env.redirect_url
const SCOPES = 'user-read-currently-playing user-read-recently-played'


module.exports = (req, res) => {
    if (req.method === "GET") {
        res.redirect(
            'https://accounts.spotify.com/authorize' +
            '?response_type=code' +
            '&client_id=' +
            CLIENT_ID +
            (SCOPES ? '&scope=' + encodeURIComponent(SCOPES) : '') +
            '&redirect_uri=' +
            encodeURIComponent(REDIRECT_URI)
        )
    } else {
        res.status(404)
    }
}