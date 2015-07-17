/**
 * @author Craig Thayer <cthayer@sazze.com>
 * @copyright 2015 Sazze, Inc.
 */

var crypto = require('crypto');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var moment = require('moment');

function Auth() {

}

Auth.headerPattern = /^RC [^\s;]+;[^\s;]+;.+$/;
Auth.headerName = 'authorization';
Auth.sigAlgorithm = 'RSA-SHA256';
Auth.sigEncoding = 'base64';

Auth.createSig = function (name, keyDir, callback) {
  if (!_.isFunction(callback)) {
    callback = _.noop;
  }

  Auth.loadCert(keyDir, name + '.key', function (err, key) {
    if (err) {
      callback(err);
      return;
    }

    var sign = crypto.createSign(Auth.sigAlgorithm);
    var iso8601 = moment().toISOString();

    sign.update(iso8601);

    try {
      var sig = sign.sign(key, Auth.sigEncoding);
    } catch (e) {
      callback(e);
      return;
    }

    var header = 'RC ' + [name, iso8601, sig].join(';');

    callback(null, header);
  });
};

Auth.parseHeader = function (header) {
  return header.replace('RC ', '').split(';', 3);
};

Auth.checkSig = function (header, certDir, callback) {
  if (!_.isFunction(callback)) {
    callback = _.noop;
  }

  if (!header || !_.isString(header) || !header.match(Auth.headerPattern)) {
    callback(new Error('Invalid format for authorization header: ' + header), false);
    return;
  }

  var sigArray = Auth.parseHeader(header);

  Auth.loadCert(certDir, sigArray[0], function (err, cert) {
    if (err) {
      callback(err, false);
      return;
    }

    var verify = crypto.createVerify(Auth.sigAlgorithm);

    verify.update(sigArray[1]);

    try {
      if (!verify.verify(cert, sigArray[2], Auth.sigEncoding)) {
        // Invalid signature
        callback(null, false);
        return;
      }
    } catch (e) {
      callback(e, false);
      return;
    }

    callback(null, true);
  });
};

Auth.loadCert = function (dir, name, callback) {
  if (!_.isFunction(callback)) {
    callback = _.noop;
  }

  fs.readFile(path.join(dir, name), {encoding: 'ascii'}, function (err, cert) {
    callback(err, cert);
  });
};

module.exports = Auth;