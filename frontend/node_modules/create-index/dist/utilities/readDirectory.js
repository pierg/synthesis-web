"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _lodash = _interopRequireDefault(require("lodash"));

var _hasIndex = _interopRequireDefault(require("./hasIndex"));

var _validateTargetDirectory = _interopRequireDefault(require("./validateTargetDirectory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const hasNoExtension = fileName => {
  const matches = fileName.match(/\./g);
  return !matches;
};

const hasMultipleExtensions = fileName => {
  const matches = fileName.match(/\./g);
  return matches && matches.length > 1;
};

const isSafeName = fileName => {
  return /^[_a-z][\w.]*$/i.test(fileName);
};

const stripExtension = fileName => {
  const pos = fileName.lastIndexOf('.');

  if (pos === -1) {
    return fileName;
  }

  return fileName.slice(0, Math.max(0, pos));
};

const removeDuplicates = (files, preferredExtension) => {
  return _lodash.default.filter(files, fileName => {
    const withoutExtension = stripExtension(fileName);
    const mainAlternative = withoutExtension + '.' + preferredExtension;

    if (mainAlternative === fileName) {
      return true;
    }

    return !_lodash.default.includes(files, mainAlternative);
  });
};

const removeIgnoredFiles = function (files) {
  let ignorePatterns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (ignorePatterns.length === 0) {
    return files;
  }

  const patterns = ignorePatterns.map(pattern => {
    if (_lodash.default.startsWith(pattern, '/') && _lodash.default.endsWith(pattern, '/')) {
      const patternWithoutSlashes = pattern.slice(1, -1);
      return new RegExp(patternWithoutSlashes);
    }

    return new RegExp(pattern);
  });
  return _lodash.default.filter(files, fileName => {
    let pattern;

    for (pattern of patterns) {
      if (fileName.match(pattern) !== null) {
        return false;
      }
    }

    return true;
  });
};

var _default = function _default(directoryPath) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!(0, _validateTargetDirectory.default)(directoryPath, options)) {
    return false;
  }

  const _options$extensions = options.extensions,
        extensions = _options$extensions === void 0 ? ['js'] : _options$extensions,
        _options$config = options.config,
        config = _options$config === void 0 ? {} : _options$config,
        _options$ignoreDirect = options.ignoreDirectories,
        ignoreDirectories = _options$ignoreDirect === void 0 ? false : _options$ignoreDirect;
  let children;
  children = _fs.default.readdirSync(directoryPath);
  children = _lodash.default.filter(children, fileName => {
    const absolutePath = _path.default.resolve(directoryPath, fileName);

    const isDirectory = _fs.default.statSync(absolutePath).isDirectory();

    if (!isSafeName(fileName)) {
      return false;
    }

    if (hasNoExtension(fileName) && !isDirectory) {
      return false;
    }

    if (hasMultipleExtensions(fileName)) {
      return false;
    }

    if (_lodash.default.startsWith(fileName, options.outputFile || 'index.js')) {
      return false;
    }

    if (!isDirectory && !extensions.some(extension => {
      return _lodash.default.endsWith(fileName, '.' + extension);
    })) {
      return false;
    }

    if (isDirectory && (!(0, _hasIndex.default)(absolutePath, options) || ignoreDirectories)) {
      return false;
    }

    return true;
  });
  children = removeDuplicates(children, extensions[0]);
  children = removeIgnoredFiles(children, config.ignore);
  return children.sort();
};

exports.default = _default;
//# sourceMappingURL=readDirectory.js.map