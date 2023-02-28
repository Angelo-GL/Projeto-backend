const schedule = require('node-schedule')

module.exports = app => {
    schedule.scheduleJob('*/1 * * * *', async function () {
        const userCount = await app.db('users').count('id').first()
        const categoryCount = await app.db('users').count('id').first()
        const articleCount = await app.db('users').count('id').first()

        const {Stat} = app.api.stat

        const lastStat = await Stat.findOne({}, {}, {sort: {'createdAt': -1}})

        const stat = new Stat({
            users: userCount.count,
            categories: categoryCount.count,
            articles: articleCount.count,
            createdAt: new Date() 
        })

        const chargeUsers = !lastStat || stat.users !== lastStat.users
        const chargeCategories = !lastStat || stat.categories !== lastStat.categories
        const chargeArticles = !lastStat || stat.articles !== lastStat.articles

        if(chargeUsers || chargeCategories || chargeArticles) {
            stat.save().then(() => console.log("[STATS] Estatísticas Atualizadas!"))
        }

    })
}