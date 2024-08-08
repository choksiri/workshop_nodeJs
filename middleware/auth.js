const jwt = require('jsonwebtoken')

const middleware = {
    authToken: async (req, res, next) => {
        try {
            let token = req.headers.authorization.split(' ')[1]
            let is_check = await jwt.verify(token,process.env.KEY_TOKEN)
            if (!is_check) return res.status(401).send('Unauthorized')
            next()
        } catch (error) {
            res.status(500).send(error.message)
        }

    }
}

module.exports = { ...middleware }