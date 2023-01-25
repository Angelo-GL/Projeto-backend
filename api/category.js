module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validations

    const save = async (req, res) => {
        const category = { ...req.body }

        if (req.params.id) category.id = req.params.id

        try {
            existsOrError(category.name, "Nome não informado")

            const categoryFromDb = await app.db('categories')
                .where({ name: category.name })

            if (!category.id) {
                notExistsOrError(categoryFromDb, "Categoria já cadastrada")
            }
        } catch (error) {
            return res.status(400).send(msg)
        }


        if (category.id) {
            app.db('categories')
                .update(category)
                .where({ id: category.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('categories')
                .insert(category)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Código de categoria não informado.')

            const subcategoria = await app.db('categories')
                .where({ parentId: req.params.id })
            notExistsOrError(subcategoria, "Categria Possui subcategorias.")

            const articles = await app.db('articles')
                .where({ categoryId: req.params.id })
            notExistsOrError(articles, "Categoria possui artigos.")

            const rowsDeleted = await app.db('categories')
                .where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'Categoria não foi encontrada.')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)

        }
    }
    return { save }
}