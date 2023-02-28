//Body-parse -> interpreta o body da requisição (JSOM, TXT, XML..)
//Cors -> permite que de uma utra aplicação acesse a api que estamos desenvolvend (Integras front end e back)
// consign -> responsavel por colocar a api dentro de app (centraliza, e ajuda a definir a dependencia entre os arquivos)
const bodyParser = require('body-parser')
const cors = require("cors")

module.exports = app => {
    app.use(bodyParser.json())
    app.use(cors())
}


