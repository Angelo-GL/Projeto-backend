const bcrypt = require('bcrypt-nodejs')
const { use } = require('passport')

module.exports = app =>{
    const {existsOrError, notExistsOrError, equalsOrError} = app.api.validations

    const encryptPassWord = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    //Salva e atualiza usuário
    const save = async (req, res) =>{
        const user = {...req.body}

        if(req.params.id) user.id = req.params.id

        try {
            existsOrError(user.name, "Nome não informado")
            existsOrError(user.email, "E-mail não informado")
            existsOrError(user.password, "Senha não informada")
            existsOrError(user.confirmPassWord, "Confrmação de senha não informada")
            equalsOrError(user.password, user.confirmPassWord, "Senhas não conferem")

            //Verifica se o usuário ja esta cadastrado
            const userFromDB = await app.db('users')
                .where({email: user.email}).first()
            if(!user.id){
                notExistsOrError(userFromDB, "Usuário já cadastrado")
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }

        user.password = encryptPassWord(user.password)
        delete user.confirmPassWord

        if(user.id){
            app.db('users')
                .update(user)
                .where({id: user.id})
                .then(_ => res.status(204).send())
                .catch(err => res.status(500)).send(err)
        }else{
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500)).send(err)
        }

    }

    //Listar usuários
    const get = async (req, res) =>{
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    return {save, get}
}