const {authSecret} = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app =>{
    const signin = async (req, res) => {
        if(!req.body.email || !req.body.password){
            return res.status(400).send('Informe usuário e senha!')
        }

        const user = await app.db('users')
            .where({email: req.body.email})
            .first()
        
        if(!user){
            return res.status(400).send('Usuário não encontrado!')
        }

        //Valida as senhas
        const isMatch = bcrypt.compareSync(req.body.password, user.password)
        if(!isMatch){
            return res.status(401).send('e-mail/senha inválido!')
        }
        //Data atual em segundos
        const now = Math.floor(Date.now() / 1000)

        //Conteud do token jwt
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            iat: now,
            exp: now + (60 * 60 * 24 * 3) //60 seg, 1(60) min, 24 horas, 3 dias
        }

        res.json( {
            ...payload,
            token: jwt.encode(payload, authSecret)
        } )
    }

    const validateToken = async (req, res) => {
        const userDate = req.body || null
        try {
            if(userDate){
                const token = jwt.decode(userDate.token, authSecret)
                if(new Date(token.exp * 100) > new Date()) {
                    return res.send(true)
                }
            }
        } catch (err) {
            //Problema com token            
        }

        res.send(false)
    }

    return {validateToken, signin }
}