"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(directoryPath) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  const indexPath = _path.default.resolve(directoryPath, options.outputFile || 'index.js');

  try {
    _fs.default.statSync(indexPath);

    return true;
  } catch {
    return false;
  }
};

exports.default = _default;
//# sourceMappingURL=hasIndex.js.map