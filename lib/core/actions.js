const { promisify } = require('util');
const path = require('path');

const open = require('open');
const download = promisify(require('download-git-repo'));

const { vueRepo } = require('../config/repo-conifg');
const { commandSpawn } = require('../utils/terminal');
const { compile, writeToFile, createDirSync } = require('../utils/utils');

// clone项目，启动项目actions
const createProjectAction = async (project) => {
  console.log("why helps you create your project~");
  
  // 1.clone项目
  await download(vueRepo, project, {clone: true});
  
  // 2.npm install 
  const command = process.platform === "win32" ? 'npm.cmd' : 'npm';
  await commandSpawn(command, ["install"], { cwd: `./${project}` });

  // 3.npm run serve
  commandSpawn(command, ['run', 'serve'], { cwd: `./${project}`});

  // 4.open browser 
  open("http://localhost:8080/");
}

// 下载组件actions
const addCpnAction = async (name, dest) => {
  // 1.编译ejs模板
  const result = await compile("vue-component.ejs", {name, lowerName: name.toLowerCase()});
  // 2.写入组件
  const targetPath = path.resolve(dest, `${name}.vue`);
  // console.log(targetPath);
  writeToFile(targetPath, result)
}

const addPageAndRoute = async (name, dest) => {
  // 1.编译ejs模板
  const data = {name, lowerNamew: name.toLowerCase()};
  const pageResult = await compile("vue-component.ejs", data);
  const routeResult = await compile('vue-router.ejs', data);

  // 2.写入文件
  const targetDest = path.resolve(dest, name.toLowerCase());
  if (createDirSync(targetDest)) {
    const targetPagePath = path.resolve(targetDest, `${name}.vue`);
    const targetRoutePath = path.resolve(targetDest, 'router.js');
    writeToFile(targetPagePath, pageResult); 
    writeToFile(targetRoutePath, routeResult); 
  }
}

const addStoreAction = async (name, dest) => {
  const data = {};
  const storeResult = await compile('vue-store.ejs', data);
  const typesResult = await compile('vue-types.ejs', data);

  const targetDest = path.resolve(dest, name.toLowerCase());
  if (createDirSync(targetDest)) {
    const targetStorePath = path.resolve(targetDest, `${name}.js`);
    const targetTypePath = path.resolve(targetDest, 'type.js');
    writeToFile(targetStorePath, storeResult);  
    writeToFile(targetTypePath, typesResult);  
  }
}

module.exports = {
  createProjectAction,
  addCpnAction,
  addPageAndRoute,
  addStoreAction
}