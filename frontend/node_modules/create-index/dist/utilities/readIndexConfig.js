"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _hasIndex = _interopRequireDefault(require("./hasIndex"));

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(directoryPath) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!(0, _hasIndex.default)(directoryPath, options)) {
    return {};
  }

  const indexPath = _path.default.resolve(directoryPath, options.outputFile || 'index.js');

  const indexContents = _fs.default.readFileSync(indexPath, 'utf-8');

  const found = indexContents.match(_constants.CREATE_INDEX_PATTERN);
  const configLine = typeof found[1] === 'string' ? found[1].trim() : '';

  if (configLine.length === 0) {
    return {};
  }

  let config;

  try {
    config = JSON.parse(configLine);
  } catch {
    throw new Error('"' + indexPath + '" contains invalid configuration object.\n' + 'Configuration object must be a valid JSON.');
  }

  return config;
};

exports.default = _default;
//# sourceMappingURL=readIndexConfig.js.map