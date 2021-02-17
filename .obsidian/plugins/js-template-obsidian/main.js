var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (callback, module2) => () => {
  if (!module2) {
    module2 = {exports: {}};
    callback(module2.exports, module2);
  }
  return module2.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", {value: module2, enumerable: true})), module2);
};

// src/Plugin.ts
var require_Plugin = __commonJS((exports) => {
  __markAsModule(exports);
  __export(exports, {
    JsTemplatePlugin: () => JsTemplatePlugin
  });
  var import_obsidian = __toModule(require("obsidian"));
  var JsTemplatePlugin = class extends import_obsidian.Plugin {
    async onload() {
      this.settings = await this.loadData() ?? {templates: {}};
      this.addCommand({
        id: "js-template-runner",
        name: "Run JS template",
        callback: () => {
          const maybeTemplate = Object.keys(this.settings.templates)[0];
          eval(this.settings.templates[maybeTemplate]);
        }
      });
    }
  };
});

// src/index.ts
__markAsModule(exports);
__export(exports, {
  default: () => import_Plugin.JsTemplatePlugin
});
var import_Plugin = __toModule(require_Plugin());
