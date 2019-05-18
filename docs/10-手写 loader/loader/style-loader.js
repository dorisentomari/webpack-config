let loadUtils = require('loader-utils');

function loader(source) {
  let style = `
    let style = document.createElement('style');
    style.innerHTML = ${JSON.stringify(source)};
    document.head.appendChild(style);
  `;
  return style;
}

// 在 style-loader 上写了 pitch
// 剩余的请求
loader.pitch = function (remainingRequest) {
  console.log('remainingRequest');
  console.log(remainingRequest);
  let style = `
    let style = document.createElement('style');
    style.innerHTML = ${loadUtils.stringifyRequest(this, '!!' + remainingRequest)};
    document.head.appendChild(style);
  `;
  return style;
};

module.exports = loader;
