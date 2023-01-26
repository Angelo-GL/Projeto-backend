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
        } catch (msg) {
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

    const withPath = categories => {
        const getParent = (categories, parentId) => {
            const parent = categories.filter(parent => parent.id === parentId)
            return parent[0] ? parent[0]: null
        }

        const categoriesWhitePath = categories.map(category => {
            let path = category.name
            let parent = getParent(categories, category.parentId)
            while(parent){
                path = `${parent.name } > ${path}`
                parent = getParent(categories, parent.parentId)
            }
            
            return {...category, path}
        })

        categoriesWhitePath.sort((a, b) => {
            if(a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0
        })

        return categoriesWhitePath
    }

    const get = (req, res ) =>{
        app.db('categories')
            .then(categories => res.json(withPath(categories)))
            .catch(err => res.status(500).send(err))
    }

    const getId = (req, res) => {
        app.db('categories')
            .where({id: req.params.id})
            .first()
            .then(category => res.json(category))
            .catch(err => res.status(500).send(err))
    }

    //Transofrma um Arry de categorias em ua estrutura de arvore

    const toTree = (categories, tree) => {
        if(!tree) tree = categories.filter(c => !c.parentId)
        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode.id
            parentNode.children = toTree(categories, categories.filter(isChild))
            return parentNode
        })
        return tree
    }


    return { save, get, remove, getId }
}