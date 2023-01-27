module.exports = app => {
    const { existsOrError, notExistsOrError} = app.api.validations

    const save  = (req, res) => {
        const article = {...req.body}
        if(req.params.id) article.id = req.params.id

        try {
            existsOrError(article.name, 'Nome não informado!')
            existsOrError(article.description, 'Descrição não informada!')
            existsOrError(article.categoryId, 'Categoria não informada!')
            existsOrError(article.userId, 'Autor não informado!')
            existsOrError(article.content, 'Conteudo não informado')
        } catch (msg) {
            res.status(400).send(msg)
        }

        if(article.id){
            app.db('articles')
                .update(article)
                .where({id: article.id})
                .then(_ => res.status(204).send({message: 'Artigo Atualizado'}))
                .catch(err => res.status(500).send(err))
        }else{
            app.db('articles')
                .insert(article)
                .then(_ => res.status(204).send({message: 'Artigo cadastrado'}))
                .catch(err => res.status(500).send(err))
        }

    }

    const remove = async (req, res) =>{
        try {
            const rowsDeleted = await app.db('articles')
                .where({id: req.params.id}).del()
            notExistsOrError(rowsDeleted, 'Artigo não encontrado!')

            res.status(204).send({message: "Atigo excluido"})
        } catch (msg) {
            res.status(500).send(msg)
        }
    }

    //Paginação

    const limit = 10
}