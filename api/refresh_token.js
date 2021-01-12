require('dotenv').config()

const request = require('request')

module.exports = (req, res) => {
    if (req.method === "GET") {
        // requesting access token from refresh token
        console.log('FROM :/refresh_token')
        console.log(req.query.refresh_token)
        const refresh_token = req.query.refresh_token
        console.log(refresh_token, process.env.CLIENT_SECRET)
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                Authorization: `Basic ${new Buffer.from(
                    `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
                ).toString('base64')}`,
            },
            form: {
                grant_type: 'refresh_token',
                refresh_token,
            },
            json: true,
        }

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const access_token = body.access_token
                res.send({ access_token })
            }
        })
    }
}