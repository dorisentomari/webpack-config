import source from './source';

console.log(source);

if (module.hot) {
  module.hot.accept('./source.js', (res) => {
    console.log('文件更新');
    console.log(res);
    require('./source');
  });
}
