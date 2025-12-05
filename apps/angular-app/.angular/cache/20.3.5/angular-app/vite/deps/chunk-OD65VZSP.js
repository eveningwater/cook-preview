import {
  MediaMatcher
} from "./chunk-PGMLP4ER.js";
import {
  ANIMATION_MODULE_TYPE,
  InjectionToken,
  NgModule,
  inject,
  setClassMetadata,
  ɵɵdefineInjector,
  ɵɵdefineNgModule
} from "./chunk-OJPLSVIT.js";

// ../../node_modules/.pnpm/@angular+cdk@20.2.8_@angular+common@20.3.4_@angular+core@20.3.4_@angular+compiler@20.3._a5a6c8821922cdf8b00f81db2e18d4b9/node_modules/@angular/cdk/fesm2022/css-pixel-value.mjs
function coerceCssPixelValue(value) {
  if (value == null) {
    return "";
  }
  return typeof value === "string" ? value : `${value}px`;
}

// ../../node_modules/.pnpm/@angular+cdk@20.2.8_@angular+common@20.3.4_@angular+core@20.3.4_@angular+compiler@20.3._a5a6c8821922cdf8b00f81db2e18d4b9/node_modules/@angular/cdk/fesm2022/coercion.mjs
function coerceBooleanProperty(value) {
  return value != null && `${value}` !== "false";
}

// ../../node_modules/.pnpm/@angular+cdk@20.2.8_@angular+common@20.3.4_@angular+core@20.3.4_@angular+compiler@20.3._a5a6c8821922cdf8b00f81db2e18d4b9/node_modules/@angular/cdk/fesm2022/test-environment.mjs
function _isTestEnvironment() {
  return (
    // @ts-ignore
    typeof __karma__ !== "undefined" && !!__karma__ || // @ts-ignore
    typeof jasmine !== "undefined" && !!jasmine || // @ts-ignore
    typeof jest !== "undefined" && !!jest || // @ts-ignore
    typeof Mocha !== "undefined" && !!Mocha
  );
}

// ../../node_modules/.pnpm/@angular+cdk@20.2.8_@angular+common@20.3.4_@angular+core@20.3.4_@angular+compiler@20.3._a5a6c8821922cdf8b00f81db2e18d4b9/node_modules/@angular/cdk/fesm2022/platform.mjs
var PlatformModule = class _PlatformModule {
  static ɵfac = function PlatformModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PlatformModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _PlatformModule
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PlatformModule, [{
    type: NgModule,
    args: [{}]
  }], null, null);
})();

// ../../node_modules/.pnpm/@angular+cdk@20.2.8_@angular+common@20.3.4_@angular+core@20.3.4_@angular+compiler@20.3._a5a6c8821922cdf8b00f81db2e18d4b9/node_modules/@angular/cdk/fesm2022/layout.mjs
var LayoutModule = class _LayoutModule {
  static ɵfac = function LayoutModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LayoutModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _LayoutModule
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LayoutModule, [{
    type: NgModule,
    args: [{}]
  }], null, null);
})();

// ../../node_modules/.pnpm/@angular+material@20.2.8_77988740ae74fb4aaf3ed71e07feeca3/node_modules/@angular/material/fesm2022/animation.mjs
var MATERIAL_ANIMATIONS = new InjectionToken("MATERIAL_ANIMATIONS");
var AnimationCurves = class {
  static STANDARD_CURVE = "cubic-bezier(0.4,0.0,0.2,1)";
  static DECELERATION_CURVE = "cubic-bezier(0.0,0.0,0.2,1)";
  static ACCELERATION_CURVE = "cubic-bezier(0.4,0.0,1,1)";
  static SHARP_CURVE = "cubic-bezier(0.4,0.0,0.6,1)";
};
var AnimationDurations = class {
  static COMPLEX = "375ms";
  static ENTERING = "225ms";
  static EXITING = "195ms";
};
var reducedMotion = null;
function _getAnimationsState() {
  if (inject(MATERIAL_ANIMATIONS, { optional: true })?.animationsDisabled || inject(ANIMATION_MODULE_TYPE, { optional: true }) === "NoopAnimations") {
    return "di-disabled";
  }
  reducedMotion ??= inject(MediaMatcher).matchMedia("(prefers-reduced-motion)").matches;
  return reducedMotion ? "reduced-motion" : "enabled";
}
function _animationsDisabled() {
  return _getAnimationsState() !== "enabled";
}

export {
  coerceCssPixelValue,
  coerceBooleanProperty,
  _isTestEnvironment,
  MATERIAL_ANIMATIONS,
  AnimationCurves,
  AnimationDurations,
  _getAnimationsState,
  _animationsDisabled
};
//# sourceMappingURL=chunk-OD65VZSP.js.map
