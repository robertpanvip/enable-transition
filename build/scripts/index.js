const program = require('commander');
const compile = require('./compile');
const unpkg = require('./unpkg');
const publish = require('./publish');
program.on('--help', () => {
    console.log('  Usage:');
    console.log('        compile  compile project');
    console.log('        unpkg    unpkg project');
});
program
    .version('0.1.0')
    .action((options, destination) => {
        const command = destination[0];
        if (command === 'compile') {
            compile()
        }else if (command === 'unpkg') {
            unpkg()
        }else if (command === 'publish') {
            publish()
        }
    })
    .parse(process.argv);
