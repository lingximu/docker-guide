const program = require('commander');
const pkg = require('./package.json');

program
    .version(pkg.version)
    .command('app')
    .description('start app server')
    .option('-p, --port <port>', 'port (or $PORT)', Number, process.env.PORT || 8000)
    .action((options) => {
        const app = require('./src/server/app')({
            root: __dirname,
            port: options.port,
            type: 'app',
        });
        app.listen(options.port, (err) => {
            console.info(`Server listen on ${options.port}`);
            console.error('one error log!')
        });
    });

program.parse(process.argv);
