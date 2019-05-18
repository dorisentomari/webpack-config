const HTMLPlugin = require('html-webpack-plugin');

// 把外链的标签，变成内联的
class InlineSourcePlugin {
  constructor({match}) {
    this.reg = match;
  }

  processTag(tag, compilation) {
    let newTag, url;
    if (tag.tagName === 'link' && this.reg.test(tag.attributes.href)) {
      newTag = {
        tagName: 'style',
        attributes: {
          type: 'text/css'
        }
      };
      url = tag.attributes.href;
    }
    if (tag.tagName === 'script' && this.reg.test(tag.attributes.src)) {
      newTag = {
        tagName: 'script',
        attributes: {
          type: 'application/javascrit'
        }
      };
      url = tag.attributes.src;
    }
    if (url) {
      // 文件的内容放在 innerHTML 属性上
      newTag.innerHTML = compilation.assets[url].source();
      delete compilation.assets[url];
      return newTag;
    }
    return tag;
  }

  // 处理引入标签的数据
  processTags(data, compilation) {
    let headTags = [];
    let bodyTags = [];
    data.headTags.forEach(headTag => {
      headTags.push(this.processTag(headTag, compilation));
    });
    data.bodyTags.forEach(bodyTag => {
      bodyTags.push(this.processTag(bodyTag, compilation));
    });
    return {...data, headTags, bodyTags};
  }

  apply(compiler) {
    // 要通过 webpackPlugin 实现功能
    compiler.hooks.compilation.tap('InlineSourcePlugin', compilation => {
      HTMLPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync('alterPlugin', (data, cb) => {
        data = this.processTags(data, compilation);
        cb(null, data);
      })
    });
  }

}


module.exports = InlineSourcePlugin;
