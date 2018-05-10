require('dotenv').config()
const path = require('path')

module.exports = {
    private:{
        name: process.env.private_name,
        pass: process.env.private_pass
    },
    proxyParams:{
        name: undefined,
        target: undefined,
        Referer: undefined
    },
    staticRootDir: path.join(process.cwd(), '../site')
}