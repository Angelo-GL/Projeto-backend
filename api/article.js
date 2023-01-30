const queries = require('./queries')
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
            existsOrError(rowsDeleted, 'Artigo não encontrado!')

            res.status(204).send({message: "Atigo excluido"})
        } catch (msg) {
            res.status(500).send(msg)
        }
    }

    //Paginação

    const limit = 10
    const get = async(req, res) => {
        const page = req.query.page || 1

        const result = await app.db('articles').count('id').first()
        const count = parseInt(result.count)
        
        app.db('articles')
            .select('id', 'name', 'description')
            .limit(limit).offset(page * limit - limit)
            .then(articles => res.json({data: articles, count, limit}))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('articles')
            .where({id: req.params.id})
            .first() //pega o primeiro elemento do array
            .then(article => {
                article.content = article.content.toString()
                return res.json(article)
            })
            .catch(err => res.status(500).send(err))
    }

    //Busca os artigos a partir do Id da categoria (Outro metodo de paginação)
    const getByCategory = async(req, res) =>{
        const categoryId = req.params.id
        const page = req.query.page || 1
        const categories = await app.db.raw(queries.categryWithChildren, categoryId )
        const ids = categories.rows.map(c => c.id)

        app.db({a: 'articles', u: 'users'})
            .select('a.id', 'a.name', 'a.description', 'a.imageUrl', {author: 'u.name'})
            .limit(limit).offset(page * limit - limit) 
            .whereRaw('?? == ??', ['u.id', 'a.userId'])
            .whereIn('categoryId', ids)
            .orderBy('a.id', 'desc')
            .then(articles => res.json(articles))
            .catch(err => res.status(500).send(err))
    }


    return {save, remove, get, getById, getByCategory}
}