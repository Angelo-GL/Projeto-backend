const { get } = require("mongoose")

module.exports = app =>{
    //Rotas de Autenticação 
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)
    
    //Rotas de Users
    app.route('/users')
        .all(app.config.passport.authenticate())
        .post(app.api.user.save)
        .get(app.api.user.get)
    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.user.save)
        .get(app.api.user.getId)
    
    //Rotas de categoria
    app.route("/categories")
        .all(app.config.passport.authenticate())
        .post(app.api.category.save)
        .get(app.api.category.get)
    app.route('/categories/tree')
        .all(app.config.passport.authenticate())
        .get(app.api.category.getTree)
    app.route("/categories/:id")
        .all(app.config.passport.authenticate())
        .get(app.api.category.getId)
        .put(app.api.category.save)
        .delete(app.api.category.remove)
    
    //Rotas de Artigos
    app.route('/articles')
        .all(app.config.passport.authenticate())
        .post(app.api.article.save)
        .get(app.api.article.get)
    app.route('/articles/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.article.save)
        .get(app.api.article.getById)
        .delete(app.api.article.remove)
    app.route('/categories/:id/articles')
        .all(app.config.passport.authenticate())
        .get(app.api.article.getByCategory)

}