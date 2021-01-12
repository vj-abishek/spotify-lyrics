require('dotenv').config()

const request = require('request')
const querystring = require('querystring')

//global variable
const CLIENT_ID = process.env.CLIENT_ID
const CLINET_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000/callback'
        : process.env.redirect_url
const FRONTEND_URI =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : process.env.FRONTEND_URI


module.exports = (req, res) => {
    if (req.method === "GET") {
        const code = req.query.code || null
        console.log(code)
        if (code !== null) {
            const base64Code = new Buffer.from(
                `${CLIENT_ID}:${CLINET_SECRET}`
            ).toString('base64')
            console.log('base64:', base64Code)

            const authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                form: {
                    code: code,
                    redirect_uri: REDIRECT_URI,
                    grant_type: 'authorization_code',
                },
                headers: {
                    Authorization: `Basic ${base64Code}`,
                },
                json: true,
            }
            //request for access token
            request.post(authOptions, function (error, response, body) {
                console.log(error, response.statusCode)
                if (!error && response.statusCode === 200) {
                    const access_token = body.access_token
                    const refresh_token = body.refresh_token

                    // we can also pass the token to the browser to make requests from there
                    res.redirect(
                        `${FRONTEND_URI}/lyrics#${querystring.stringify({
                            access_token,
                            refresh_token,
                        })}`
                    )
                } else {
                    res.redirect(`/#${querystring.stringify({ error: 'invalid_token' })}`)
                }
            })
        }
    }
}