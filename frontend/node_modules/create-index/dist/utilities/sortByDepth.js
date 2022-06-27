"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = paths => {
  return _lodash.default.sortBy(paths, path => {
    return -path.split('/').length;
  });
};

exports.default = _default;
//# sourceMappingURL=sortByDepth.js.map