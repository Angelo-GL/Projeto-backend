const mongoose = require('mongoose')

mongoose.set("strictQuery", true);
mongoose.connect('mongodb://127.0.0.1:27017/projeto', { useNewUrlParser:true })
    .catch(e => {
        const msg = "ERRO: Não foi possível conectar com MongoDB"
        console.log('\x1b[41m%s\x1b[37m', msg, '\x1b[0m');
    })
