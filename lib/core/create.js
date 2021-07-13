const program = require('commander');

const { 
  createProjectAction, 
  addCpnAction, 
  addPageAndRoute,
  addStoreAction 
} = require('./actions');

const createCommands = () => {
  program
    .command('create <project> [others...]') //指令
    .description('clone a repository into a folder')
    .action(createProjectAction)

  program
    .command('addcpn <name>')
    .description('add vue component, 例如：why addcpn helloWord')
    .action((name) => {
      addCpnAction(name, program.dest || 'src/components');
    })
  
  program
    .command('addpage <page>')
    .description('add vue page and router config, 例如: why addpage Home [-d src/pages]')
    .action((page) => {
      addPageAndRoute(page, program.dest || 'src/pages');
    })

  program
    .command('addstore <store>')
    .description('add vue page and router config, 例如: why addpage Home [-d src/pages]')
    .action((store) => {
      addStoreAction(store, program.dest || 'src/store/modules')
    })
}

module.exports = createCommands;