function loader(source) {
  console.log(source);
  console.log('loader3');
  return source;
}

module.exports = loader;
