"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/getPolls";
exports.ids = ["pages/api/getPolls"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "(api)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nlet prisma;\nprisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9saWIvcHJpc21hLnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBRUEsSUFBSUMsTUFBSjtBQUVBQSxNQUFNLEdBQUcsSUFBSUQsd0RBQUosRUFBVDtBQUVBLGlFQUFlQyxNQUFmIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc3JjLy4vbGliL3ByaXNtYS50cz85ODIyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gJ0BwcmlzbWEvY2xpZW50JztcblxubGV0IHByaXNtYTogUHJpc21hQ2xpZW50O1xuXG5wcmlzbWEgPSBuZXcgUHJpc21hQ2xpZW50KCk7XG5cbmV4cG9ydCBkZWZhdWx0IHByaXNtYTsiXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwicHJpc21hIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./lib/prisma.ts\n");

/***/ }),

/***/ "(api)/./pages/api/getPolls.ts":
/*!*******************************!*\
  !*** ./pages/api/getPolls.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/prisma */ \"(api)/./lib/prisma.ts\");\n// Next.js API route support: https://nextjs.org/docs/api-routes/introduction\n\n/** \n * @description: This is the API endpoint for getting the siblings & path indices of an address in a specified merkle tree.\n */\n\nfunction mapPolls(polls) {\n  return polls.map(poll => {\n    return {\n      id: poll.id,\n      title: poll.title,\n      groupDescription: poll.groupDescription,\n      description: poll.description,\n      createdAt: new Date(poll.createdAt).toUTCString(),\n      deadline: new Date(poll.deadline).toUTCString(),\n      active: poll.createdAt < poll.deadline\n    };\n  });\n}\n/** \n * @function: handler\n * @description: This is the handler for the API endpoint.\n */\n\n\nasync function handler(req, res) {\n  if (req.method !== 'GET') {\n    res.status(405).json({\n      name: \"GET endpoint\",\n      polls: []\n    });\n  }\n\n  var pollsReceived = await _lib_prisma__WEBPACK_IMPORTED_MODULE_0__[\"default\"].poll.findMany();\n  const pollOutputs = mapPolls(pollsReceived);\n  res.status(200).json({\n    name: \"Got polls\",\n    polls: pollOutputs\n  });\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvZ2V0UG9sbHMudHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUdBO0FBRUE7QUFDQTtBQUNBOztBQWlCQSxTQUFTQyxRQUFULENBQWtCQyxLQUFsQixFQUFpQztFQUMvQixPQUFPQSxLQUFLLENBQUNDLEdBQU4sQ0FBVUMsSUFBSSxJQUFJO0lBQ3ZCLE9BQU87TUFDTEMsRUFBRSxFQUFFRCxJQUFJLENBQUNDLEVBREo7TUFFTEMsS0FBSyxFQUFFRixJQUFJLENBQUNFLEtBRlA7TUFHTEMsZ0JBQWdCLEVBQUVILElBQUksQ0FBQ0csZ0JBSGxCO01BSUxDLFdBQVcsRUFBRUosSUFBSSxDQUFDSSxXQUpiO01BS0xDLFNBQVMsRUFBRSxJQUFJQyxJQUFKLENBQVNOLElBQUksQ0FBQ0ssU0FBZCxFQUF5QkUsV0FBekIsRUFMTjtNQU1MQyxRQUFRLEVBQUUsSUFBSUYsSUFBSixDQUFTTixJQUFJLENBQUNRLFFBQWQsRUFBd0JELFdBQXhCLEVBTkw7TUFPTEUsTUFBTSxFQUFFVCxJQUFJLENBQUNLLFNBQUwsR0FBaUJMLElBQUksQ0FBQ1E7SUFQekIsQ0FBUDtFQVNELENBVk0sQ0FBUDtBQVdEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7OztBQUNlLGVBQWVFLE9BQWYsQ0FDYkMsR0FEYSxFQUViQyxHQUZhLEVBR2I7RUFDQSxJQUFJRCxHQUFHLENBQUNFLE1BQUosS0FBZSxLQUFuQixFQUEwQjtJQUN4QkQsR0FBRyxDQUFDRSxNQUFKLENBQVcsR0FBWCxFQUFnQkMsSUFBaEIsQ0FBcUI7TUFDbkJDLElBQUksRUFBRSxjQURhO01BQ0dsQixLQUFLLEVBQUU7SUFEVixDQUFyQjtFQUdEOztFQUVELElBQUltQixhQUFhLEdBQUcsTUFBTXJCLGlFQUFBLEVBQTFCO0VBQ0EsTUFBTXVCLFdBQVcsR0FBR3RCLFFBQVEsQ0FBQ29CLGFBQUQsQ0FBNUI7RUFFQUwsR0FBRyxDQUFDRSxNQUFKLENBQVcsR0FBWCxFQUFnQkMsSUFBaEIsQ0FBcUI7SUFBQ0MsSUFBSSxFQUFFLFdBQVA7SUFBb0JsQixLQUFLLEVBQUVxQjtFQUEzQixDQUFyQjtBQUNEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc3JjLy4vcGFnZXMvYXBpL2dldFBvbGxzLnRzPzk0Y2QiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gTmV4dC5qcyBBUEkgcm91dGUgc3VwcG9ydDogaHR0cHM6Ly9uZXh0anMub3JnL2RvY3MvYXBpLXJvdXRlcy9pbnRyb2R1Y3Rpb25cbmltcG9ydCB7IFBvbGwgfSBmcm9tICdAcHJpc21hL2NsaWVudCc7XG5pbXBvcnQgdHlwZSB7IE5leHRBcGlSZXF1ZXN0LCBOZXh0QXBpUmVzcG9uc2UgfSBmcm9tICduZXh0J1xuaW1wb3J0IHByaXNtYSBmcm9tICcuLi8uLi9saWIvcHJpc21hJztcblxuLyoqIFxuICogQGRlc2NyaXB0aW9uOiBUaGlzIGlzIHRoZSBBUEkgZW5kcG9pbnQgZm9yIGdldHRpbmcgdGhlIHNpYmxpbmdzICYgcGF0aCBpbmRpY2VzIG9mIGFuIGFkZHJlc3MgaW4gYSBzcGVjaWZpZWQgbWVya2xlIHRyZWUuXG4gKi9cblxudHlwZSBQb2xsT3V0cHV0ID0ge1xuICBpZDogbnVtYmVyLFxuICB0aXRsZTogc3RyaW5nLFxuICBncm91cERlc2NyaXB0aW9uOiBzdHJpbmcsXG4gIGRlc2NyaXB0aW9uOiBzdHJpbmcsXG4gIGNyZWF0ZWRBdDogc3RyaW5nLFxuICBkZWFkbGluZTogc3RyaW5nLFxuICBhY3RpdmU6IGJvb2xlYW5cbn1cblxudHlwZSBEYXRhID0ge1xuICAgIG5hbWU6IHN0cmluZyxcbiAgICBwb2xsczogUG9sbE91dHB1dFtdXG59XG5cbmZ1bmN0aW9uIG1hcFBvbGxzKHBvbGxzOiBQb2xsW10pIHtcbiAgcmV0dXJuIHBvbGxzLm1hcChwb2xsID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHBvbGwuaWQsXG4gICAgICB0aXRsZTogcG9sbC50aXRsZSxcbiAgICAgIGdyb3VwRGVzY3JpcHRpb246IHBvbGwuZ3JvdXBEZXNjcmlwdGlvbixcbiAgICAgIGRlc2NyaXB0aW9uOiBwb2xsLmRlc2NyaXB0aW9uLFxuICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShwb2xsLmNyZWF0ZWRBdCkudG9VVENTdHJpbmcoKSxcbiAgICAgIGRlYWRsaW5lOiBuZXcgRGF0ZShwb2xsLmRlYWRsaW5lKS50b1VUQ1N0cmluZygpLFxuICAgICAgYWN0aXZlOiBwb2xsLmNyZWF0ZWRBdCA8IHBvbGwuZGVhZGxpbmVcbiAgICB9O1xuICB9KTtcbn1cblxuLyoqIFxuICogQGZ1bmN0aW9uOiBoYW5kbGVyXG4gKiBAZGVzY3JpcHRpb246IFRoaXMgaXMgdGhlIGhhbmRsZXIgZm9yIHRoZSBBUEkgZW5kcG9pbnQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoXG4gIHJlcTogTmV4dEFwaVJlcXVlc3QsXG4gIHJlczogTmV4dEFwaVJlc3BvbnNlPERhdGE+XG4pIHtcbiAgaWYgKHJlcS5tZXRob2QgIT09ICdHRVQnKSB7XG4gICAgcmVzLnN0YXR1cyg0MDUpLmpzb24oe1xuICAgICAgbmFtZTogXCJHRVQgZW5kcG9pbnRcIiwgcG9sbHM6IFtdXG4gICAgfSlcbiAgfVxuXG4gIHZhciBwb2xsc1JlY2VpdmVkID0gYXdhaXQgcHJpc21hLnBvbGwuZmluZE1hbnkoKVxuICBjb25zdCBwb2xsT3V0cHV0cyA9IG1hcFBvbGxzKHBvbGxzUmVjZWl2ZWQpO1xuXG4gIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtuYW1lOiBcIkdvdCBwb2xsc1wiLCBwb2xsczogcG9sbE91dHB1dHN9KTtcbn1cbiJdLCJuYW1lcyI6WyJwcmlzbWEiLCJtYXBQb2xscyIsInBvbGxzIiwibWFwIiwicG9sbCIsImlkIiwidGl0bGUiLCJncm91cERlc2NyaXB0aW9uIiwiZGVzY3JpcHRpb24iLCJjcmVhdGVkQXQiLCJEYXRlIiwidG9VVENTdHJpbmciLCJkZWFkbGluZSIsImFjdGl2ZSIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJtZXRob2QiLCJzdGF0dXMiLCJqc29uIiwibmFtZSIsInBvbGxzUmVjZWl2ZWQiLCJmaW5kTWFueSIsInBvbGxPdXRwdXRzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/getPolls.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/getPolls.ts"));
module.exports = __webpack_exports__;

})();