/**
 * @author Craig Thayer <cthayer@sazze.com>
 * @copyright 2015 Sazze, Inc.
 */

var _ = require('lodash');

var defaultResponse = {
  id: '',
  stdout: '',
  stderr: '',
  exitCode: -1,
  signal: null
};

function Response(resp) {
  _.merge(this, defaultResponse, resp);
}

module.exports = Response;