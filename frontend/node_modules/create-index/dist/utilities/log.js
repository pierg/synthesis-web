"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default() {
  for (var _len = arguments.length, append = new Array(_len), _key = 0; _key < _len; _key++) {
    append[_key] = arguments[_key];
  }

  // eslint-disable-next-line no-console
  console.log(_chalk.default.dim('[' + (0, _moment.default)().format('HH:mm:ss') + ']'), ...append);
};

exports.default = _default;
//# sourceMappingURL=log.js.map