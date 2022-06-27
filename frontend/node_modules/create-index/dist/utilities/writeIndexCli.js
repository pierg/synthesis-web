"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _lodash = _interopRequireDefault(require("lodash"));

var _chalk = _interopRequireDefault(require("chalk"));

var _createIndexCode = _interopRequireDefault(require("./createIndexCode"));

var _validateTargetDirectory = _interopRequireDefault(require("./validateTargetDirectory"));

var _readDirectory = _interopRequireDefault(require("./readDirectory"));

var _readIndexConfig = _interopRequireDefault(require("./readIndexConfig"));

var _sortByDepth = _interopRequireDefault(require("./sortByDepth"));

var _log = _interopRequireDefault(require("./log"));

var _findIndexFiles = _interopRequireDefault(require("./findIndexFiles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(directoryPaths) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let sortedDirectoryPaths;
  sortedDirectoryPaths = (0, _sortByDepth.default)(directoryPaths);
  (0, _log.default)('Target directories', sortedDirectoryPaths);
  (0, _log.default)('Output file', options.outputFile);

  if (options.updateIndex) {
    (0, _log.default)('Update index:', options.updateIndex ? _chalk.default.green('true') : _chalk.default.red('false'));
  } else {
    (0, _log.default)('Recursive:', options.recursive ? _chalk.default.green('true') : _chalk.default.red('false'));
    (0, _log.default)('Ignore unsafe:', options.ignoreUnsafe ? _chalk.default.green('true') : _chalk.default.red('false'));
    (0, _log.default)('Extensions:', _chalk.default.green(options.extensions));
  }

  if (options.updateIndex || options.recursive) {
    sortedDirectoryPaths = _lodash.default.map(sortedDirectoryPaths, directory => {
      return (0, _findIndexFiles.default)(directory, {
        fileName: options.updateIndex ? options.outputFile || 'index.js' : '*',
        silent: options.updateIndex || options.ignoreUnsafe
      });
    });
    sortedDirectoryPaths = _lodash.default.flatten(sortedDirectoryPaths);
    sortedDirectoryPaths = _lodash.default.uniq(sortedDirectoryPaths);
    sortedDirectoryPaths = (0, _sortByDepth.default)(sortedDirectoryPaths);
    (0, _log.default)('Updating index files in:', sortedDirectoryPaths.reverse().join(', '));
  }

  sortedDirectoryPaths = sortedDirectoryPaths.filter(directoryPath => {
    return (0, _validateTargetDirectory.default)(directoryPath, {
      outputFile: options.outputFile,
      silent: options.ignoreUnsafe
    });
  });

  _lodash.default.forEach(sortedDirectoryPaths, directoryPath => {
    let existingIndexCode;
    const config = (0, _readIndexConfig.default)(directoryPath, options);
    const siblings = (0, _readDirectory.default)(directoryPath, {
      config,
      extensions: options.extensions,
      ignoreDirectories: options.ignoreDirectories,
      silent: options.ignoreUnsafe
    });
    const indexCode = (0, _createIndexCode.default)(siblings, {
      banner: options.banner,
      config
    });

    const indexFilePath = _path.default.resolve(directoryPath, options.outputFile || 'index.js');

    try {
      existingIndexCode = _fs.default.readFileSync(indexFilePath, 'utf8');
      /* eslint-disable no-empty */
    } catch {}
    /* eslint-enable no-empty */


    _fs.default.writeFileSync(indexFilePath, indexCode);

    if (existingIndexCode && existingIndexCode === indexCode) {
      (0, _log.default)(indexFilePath, _chalk.default.yellow('[index has not changed]'));
    } else if (existingIndexCode && existingIndexCode !== indexCode) {
      (0, _log.default)(indexFilePath, _chalk.default.green('[updated index]'));
    } else {
      (0, _log.default)(indexFilePath, _chalk.default.green('[created index]'));
    }
  });

  (0, _log.default)('Done');
};

exports.default = _default;
//# sourceMappingURL=writeIndexCli.js.map