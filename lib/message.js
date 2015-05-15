/**
 * @author Craig Thayer <cthayer@sazze.com>
 * @copyright 2015 Sazze, Inc.
 */

var _ = require('lodash');

var defaultMsg = {
  id: '',
  command: '',
  options: {}   // for options, see: https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
};

function Message(msg) {
  if (!_.isPlainObject(msg)) {
    msg = {};
  }

  _.merge(this, defaultMsg, msg);
}

module.exports = Message;