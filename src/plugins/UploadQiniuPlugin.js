const qiniu = require('qiniu');
const path = require('path');

class UploadQiniuPlugin {
  constructor(options = {}) {
    let {bucket, domain, accessKey, secretKey} = options;
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    let putPolicy = new qiniu.rs.PutPolicy({scope: bucket});
    this.uploadToken = putPolicy.uploadToken(mac);
    let config = new qiniu.conf.Config();
    this.formUploader = new qiniu.form_up.FormUploader(config);
    this.putExtra = new qiniu.form_up.PutExtra();
  }

  apply (compiler) {
    compiler.hooks.afterEmit.tapPromise('UploadQiniuPlugin', compilation => {
      let assets = compilation.assets;
      let promises = [];
      Object.keys(assets).forEach(filename => {
        promises.push(this.upload(filename));
      });
      return Promise.all(promises);
    });
  }

  upload(filename) {
    return new Promise((resolve, reject) => {
      let realPath = path.resolve(__dirname, '../dist', filename);
      this.formUploader.putFile(this.uploadToken, filename, realPath, this.putExtra, (err, res) => {
        console.log(res);
        if (err) {
          reject(err);
        }
        if (res.statusCode === 200) {
          resolve(res);
        }
      });
    })
  }
}

module.exports = UploadQiniuPlugin;
