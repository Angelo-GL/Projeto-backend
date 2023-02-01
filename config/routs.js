const admin = require('./admin')

module.exports = app =>{
    //Rotas de Autenticação 
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)
    
    //Rotas de Users
    app.route('/users')
        .all(app.config.passport.authenticate())
        .post(admin( app.api.user.save))
        .get(admin(app.api.user.get))
    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .put(admin( app.api.user.save))
        .get(admin( app.api.user.getId))
    
    //Rotas de categoria
    app.route("/categories")
        .all(app.config.passport.authenticate())
        .post(admin( app.api.category.save))
        .get(admin( app.api.category.get))
    app.route('/categories/tree')
        .all(app.config.passport.authenticate())
        .get(app.api.category.getTree)
    app.route("/categories/:id")
        .all(app.config.passport.authenticate())
        .get(app.api.category.getId)
        .put(admin( app.api.category.save))
        .delete(admin(app.api.category.remove))
    
    //Rotas de Artigos
    app.route('/articles')
        .all(app.config.passport.authenticate())
        .post(admin(app.api.article.save))
        .get(admin(app.api.article.get))
    app.route('/articles/:id')
        .all(app.config.passport.authenticate())
        .put(admin( app.api.article.save ))
        .get(app.api.article.getById)
        .delete(admin( app.api.article.remove ))
    app.route('/categories/:id/articles')
        .all(app.config.passport.authenticate())
        .get(app.api.article.getByCategory)

}