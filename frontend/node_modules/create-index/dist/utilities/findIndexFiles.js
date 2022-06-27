"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _lodash = _interopRequireDefault(require("lodash"));

var _glob = _interopRequireDefault(require("glob"));

var _validateTargetDirectory = _interopRequireDefault(require("./validateTargetDirectory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(directoryPath) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let fileName;
  let targetDirectories;
  fileName = options.fileName || 'index.js';
  fileName = './**/' + fileName;
  targetDirectories = _glob.default.sync(_path.default.join(directoryPath, fileName));
  targetDirectories = _lodash.default.filter(targetDirectories, targetDirectoryPath => {
    return (0, _validateTargetDirectory.default)(_path.default.dirname(targetDirectoryPath), {
      outputFile: options.fileName,
      silent: options.silent
    });
  });
  targetDirectories = _lodash.default.map(targetDirectories, _path.default.dirname);
  return targetDirectories;
};

exports.default = _default;
//# sourceMappingURL=findIndexFiles.js.map