module.exports = app =>{
    //Rotas de Users
    app.route('/users')
        .post(app.api.user.save)
        .get(app.api.user.get)
    app.route('/users/:id')
        .put(app.api.user.save)
        .get(app.api.user.getId)
    
    //Rotas de categoria
    app.route("/categories")
        .post(app.api.category.save)
        .get(app.api.category.get)
    app.route('/categories/tree')
        .get(app.api.category.getTree)
    app.route("/categories/:id")
        .get(app.api.category.getId)
        .put(app.api.category.save)
        .delete(app.api.category.remove)
    
}