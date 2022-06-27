"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(targetDirectory) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const silent = options.silent;
  let stats;

  try {
    stats = _fs.default.statSync(targetDirectory);
  } catch {
    if (silent) {
      return false;
    } else {
      throw new Error('Directory "' + targetDirectory + '" does not exist.');
    }
  }

  if (!stats.isDirectory()) {
    if (silent) {
      return false;
    } else {
      throw new Error('"' + targetDirectory + '" is not a directory.');
    }
  }

  const indexFilePath = _path.default.resolve(targetDirectory, './' + (options.outputFile || 'index.js'));

  try {
    _fs.default.statSync(indexFilePath);
  } catch {
    return true;
  }

  const indexFile = _fs.default.readFileSync(indexFilePath, 'utf8');

  if (!indexFile.match(_constants.CREATE_INDEX_PATTERN)) {
    if (silent) {
      return false;
    } else {
      throw new Error('"' + indexFilePath + '" unsafe index.');
    }
  }

  return true;
};

exports.default = _default;
//# sourceMappingURL=validateTargetDirectory.js.map