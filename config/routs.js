module.exports = app =>{
    //Rotas de Users
    app.route('/users')
        .post(app.api.user.save)
        .get(app.api.user.get)
    app.route('/users/:id')
        .put(app.api.user.save)
    app.route('/users/:id')
        .get(app.api.user.getId)
    
    //Rotas de categoria
    app.route("users/categories")
        .post(app.api.category.save)
}