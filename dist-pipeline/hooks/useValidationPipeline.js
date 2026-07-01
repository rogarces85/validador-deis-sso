var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/react/cjs/react.production.js
var require_react_production = __commonJS({
  "node_modules/react/cjs/react.production.js"(exports) {
    "use strict";
    var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
    var REACT_PORTAL_TYPE = Symbol.for("react.portal");
    var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
    var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
    var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
    var REACT_CONSUMER_TYPE = Symbol.for("react.consumer");
    var REACT_CONTEXT_TYPE = Symbol.for("react.context");
    var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
    var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
    var REACT_MEMO_TYPE = Symbol.for("react.memo");
    var REACT_LAZY_TYPE = Symbol.for("react.lazy");
    var REACT_ACTIVITY_TYPE = Symbol.for("react.activity");
    var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
    function getIteratorFn(maybeIterable) {
      if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return "function" === typeof maybeIterable ? maybeIterable : null;
    }
    var ReactNoopUpdateQueue = {
      isMounted: function() {
        return false;
      },
      enqueueForceUpdate: function() {
      },
      enqueueReplaceState: function() {
      },
      enqueueSetState: function() {
      }
    };
    var assign = Object.assign;
    var emptyObject = {};
    function Component(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    Component.prototype.isReactComponent = {};
    Component.prototype.setState = function(partialState, callback) {
      if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables."
        );
      this.updater.enqueueSetState(this, partialState, callback, "setState");
    };
    Component.prototype.forceUpdate = function(callback) {
      this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
    };
    function ComponentDummy() {
    }
    ComponentDummy.prototype = Component.prototype;
    function PureComponent(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
    pureComponentPrototype.constructor = PureComponent;
    assign(pureComponentPrototype, Component.prototype);
    pureComponentPrototype.isPureReactComponent = true;
    var isArrayImpl = Array.isArray;
    function noop() {
    }
    var ReactSharedInternals = { H: null, A: null, T: null, S: null };
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function ReactElement(type, key, props) {
      var refProp = props.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== refProp ? refProp : null,
        props
      };
    }
    function cloneAndReplaceKey(oldElement, newKey) {
      return ReactElement(oldElement.type, newKey, oldElement.props);
    }
    function isValidElement(object) {
      return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    function escape(key) {
      var escaperLookup = { "=": "=0", ":": "=2" };
      return "$" + key.replace(/[=:]/g, function(match) {
        return escaperLookup[match];
      });
    }
    var userProvidedKeyEscapeRegex = /\/+/g;
    function getElementKey(element, index) {
      return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
    }
    function resolveThenable(thenable) {
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenable.reason;
        default:
          switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
            function(fulfilledValue) {
              "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
            },
            function(error) {
              "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
            }
          )), thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
          }
      }
      throw thenable;
    }
    function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
      var type = typeof children;
      if ("undefined" === type || "boolean" === type) children = null;
      var invokeCallback = false;
      if (null === children) invokeCallback = true;
      else
        switch (type) {
          case "bigint":
          case "string":
          case "number":
            invokeCallback = true;
            break;
          case "object":
            switch (children.$$typeof) {
              case REACT_ELEMENT_TYPE:
              case REACT_PORTAL_TYPE:
                invokeCallback = true;
                break;
              case REACT_LAZY_TYPE:
                return invokeCallback = children._init, mapIntoArray(
                  invokeCallback(children._payload),
                  array,
                  escapedPrefix,
                  nameSoFar,
                  callback
                );
            }
        }
      if (invokeCallback)
        return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
          return c;
        })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(
          callback,
          escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
            userProvidedKeyEscapeRegex,
            "$&/"
          ) + "/") + invokeCallback
        )), array.push(callback)), 1;
      invokeCallback = 0;
      var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
      if (isArrayImpl(children))
        for (var i = 0; i < children.length; i++)
          nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if (i = getIteratorFn(children), "function" === typeof i)
        for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
          nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if ("object" === type) {
        if ("function" === typeof children.then)
          return mapIntoArray(
            resolveThenable(children),
            array,
            escapedPrefix,
            nameSoFar,
            callback
          );
        array = String(children);
        throw Error(
          "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
        );
      }
      return invokeCallback;
    }
    function mapChildren(children, func, context) {
      if (null == children) return children;
      var result = [], count = 0;
      mapIntoArray(children, result, "", "", function(child) {
        return func.call(context, child, count++);
      });
      return result;
    }
    function lazyInitializer(payload) {
      if (-1 === payload._status) {
        var ctor = payload._result;
        ctor = ctor();
        ctor.then(
          function(moduleObject) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 1, payload._result = moduleObject;
          },
          function(error) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 2, payload._result = error;
          }
        );
        -1 === payload._status && (payload._status = 0, payload._result = ctor);
      }
      if (1 === payload._status) return payload._result.default;
      throw payload._result;
    }
    var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
      if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
        var event = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
          error
        });
        if (!window.dispatchEvent(event)) return;
      } else if ("object" === typeof process && "function" === typeof process.emit) {
        process.emit("uncaughtException", error);
        return;
      }
      console.error(error);
    };
    var Children = {
      map: mapChildren,
      forEach: function(children, forEachFunc, forEachContext) {
        mapChildren(
          children,
          function() {
            forEachFunc.apply(this, arguments);
          },
          forEachContext
        );
      },
      count: function(children) {
        var n = 0;
        mapChildren(children, function() {
          n++;
        });
        return n;
      },
      toArray: function(children) {
        return mapChildren(children, function(child) {
          return child;
        }) || [];
      },
      only: function(children) {
        if (!isValidElement(children))
          throw Error(
            "React.Children.only expected to receive a single React element child."
          );
        return children;
      }
    };
    exports.Activity = REACT_ACTIVITY_TYPE;
    exports.Children = Children;
    exports.Component = Component;
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.Profiler = REACT_PROFILER_TYPE;
    exports.PureComponent = PureComponent;
    exports.StrictMode = REACT_STRICT_MODE_TYPE;
    exports.Suspense = REACT_SUSPENSE_TYPE;
    exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
    exports.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function(size) {
        return ReactSharedInternals.H.useMemoCache(size);
      }
    };
    exports.cache = function(fn) {
      return function() {
        return fn.apply(null, arguments);
      };
    };
    exports.cacheSignal = function() {
      return null;
    };
    exports.cloneElement = function(element, config, children) {
      if (null === element || void 0 === element)
        throw Error(
          "The argument must be a React element, but you passed " + element + "."
        );
      var props = assign({}, element.props), key = element.key;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
      var propName = arguments.length - 2;
      if (1 === propName) props.children = children;
      else if (1 < propName) {
        for (var childArray = Array(propName), i = 0; i < propName; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      return ReactElement(element.type, key, props);
    };
    exports.createContext = function(defaultValue) {
      defaultValue = {
        $$typeof: REACT_CONTEXT_TYPE,
        _currentValue: defaultValue,
        _currentValue2: defaultValue,
        _threadCount: 0,
        Provider: null,
        Consumer: null
      };
      defaultValue.Provider = defaultValue;
      defaultValue.Consumer = {
        $$typeof: REACT_CONSUMER_TYPE,
        _context: defaultValue
      };
      return defaultValue;
    };
    exports.createElement = function(type, config, children) {
      var propName, props = {}, key = null;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
      var childrenLength = arguments.length - 2;
      if (1 === childrenLength) props.children = children;
      else if (1 < childrenLength) {
        for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      if (type && type.defaultProps)
        for (propName in childrenLength = type.defaultProps, childrenLength)
          void 0 === props[propName] && (props[propName] = childrenLength[propName]);
      return ReactElement(type, key, props);
    };
    exports.createRef = function() {
      return { current: null };
    };
    exports.forwardRef = function(render) {
      return { $$typeof: REACT_FORWARD_REF_TYPE, render };
    };
    exports.isValidElement = isValidElement;
    exports.lazy = function(ctor) {
      return {
        $$typeof: REACT_LAZY_TYPE,
        _payload: { _status: -1, _result: ctor },
        _init: lazyInitializer
      };
    };
    exports.memo = function(type, compare) {
      return {
        $$typeof: REACT_MEMO_TYPE,
        type,
        compare: void 0 === compare ? null : compare
      };
    };
    exports.startTransition = function(scope) {
      var prevTransition = ReactSharedInternals.T, currentTransition = {};
      ReactSharedInternals.T = currentTransition;
      try {
        var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
        null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
        "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
      } catch (error) {
        reportGlobalError(error);
      } finally {
        null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
      }
    };
    exports.unstable_useCacheRefresh = function() {
      return ReactSharedInternals.H.useCacheRefresh();
    };
    exports.use = function(usable) {
      return ReactSharedInternals.H.use(usable);
    };
    exports.useActionState = function(action, initialState, permalink) {
      return ReactSharedInternals.H.useActionState(action, initialState, permalink);
    };
    exports.useCallback = function(callback, deps) {
      return ReactSharedInternals.H.useCallback(callback, deps);
    };
    exports.useContext = function(Context) {
      return ReactSharedInternals.H.useContext(Context);
    };
    exports.useDebugValue = function() {
    };
    exports.useDeferredValue = function(value, initialValue) {
      return ReactSharedInternals.H.useDeferredValue(value, initialValue);
    };
    exports.useEffect = function(create, deps) {
      return ReactSharedInternals.H.useEffect(create, deps);
    };
    exports.useEffectEvent = function(callback) {
      return ReactSharedInternals.H.useEffectEvent(callback);
    };
    exports.useId = function() {
      return ReactSharedInternals.H.useId();
    };
    exports.useImperativeHandle = function(ref, create, deps) {
      return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
    };
    exports.useInsertionEffect = function(create, deps) {
      return ReactSharedInternals.H.useInsertionEffect(create, deps);
    };
    exports.useLayoutEffect = function(create, deps) {
      return ReactSharedInternals.H.useLayoutEffect(create, deps);
    };
    exports.useMemo = function(create, deps) {
      return ReactSharedInternals.H.useMemo(create, deps);
    };
    exports.useOptimistic = function(passthrough, reducer) {
      return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
    };
    exports.useReducer = function(reducer, initialArg, init) {
      return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
    };
    exports.useRef = function(initialValue) {
      return ReactSharedInternals.H.useRef(initialValue);
    };
    exports.useState = function(initialState) {
      return ReactSharedInternals.H.useState(initialState);
    };
    exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
      return ReactSharedInternals.H.useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
      );
    };
    exports.useTransition = function() {
      return ReactSharedInternals.H.useTransition();
    };
    exports.version = "19.2.4";
  }
});

// node_modules/react/cjs/react.development.js
var require_react_development = __commonJS({
  "node_modules/react/cjs/react.development.js"(exports, module) {
    "use strict";
    "production" !== process.env.NODE_ENV && (function() {
      function defineDeprecationWarning(methodName, info) {
        Object.defineProperty(Component.prototype, methodName, {
          get: function() {
            console.warn(
              "%s(...) is deprecated in plain JavaScript React classes. %s",
              info[0],
              info[1]
            );
          }
        });
      }
      function getIteratorFn(maybeIterable) {
        if (null === maybeIterable || "object" !== typeof maybeIterable)
          return null;
        maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
        return "function" === typeof maybeIterable ? maybeIterable : null;
      }
      function warnNoop(publicInstance, callerName) {
        publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
        var warningKey = publicInstance + "." + callerName;
        didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error(
          "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
          callerName,
          publicInstance
        ), didWarnStateUpdateForUnmountedComponent[warningKey] = true);
      }
      function Component(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function ComponentDummy() {
      }
      function PureComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function noop() {
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x) {
              }
          }
        return null;
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        newKey = ReactElement(
          oldElement.type,
          newKey,
          oldElement.props,
          oldElement._owner,
          oldElement._debugStack,
          oldElement._debugTask
        );
        oldElement._store && (newKey._store.validated = oldElement._store.validated);
        return newKey;
      }
      function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
      }
      function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function escape(key) {
        var escaperLookup = { "=": "=0", ":": "=2" };
        return "$" + key.replace(/[=:]/g, function(match) {
          return escaperLookup[match];
        });
      }
      function getElementKey(element, index) {
        return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape("" + element.key)) : index.toString(36);
      }
      function resolveThenable(thenable) {
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
          default:
            switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
              function(fulfilledValue) {
                "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
              },
              function(error) {
                "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            )), thenable.status) {
              case "fulfilled":
                return thenable.value;
              case "rejected":
                throw thenable.reason;
            }
        }
        throw thenable;
      }
      function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = typeof children;
        if ("undefined" === type || "boolean" === type) children = null;
        var invokeCallback = false;
        if (null === children) invokeCallback = true;
        else
          switch (type) {
            case "bigint":
            case "string":
            case "number":
              invokeCallback = true;
              break;
            case "object":
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = true;
                  break;
                case REACT_LAZY_TYPE:
                  return invokeCallback = children._init, mapIntoArray(
                    invokeCallback(children._payload),
                    array,
                    escapedPrefix,
                    nameSoFar,
                    callback
                  );
              }
          }
        if (invokeCallback) {
          invokeCallback = children;
          callback = callback(invokeCallback);
          var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
          isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
            return c;
          })) : null != callback && (isValidElement(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
            callback,
            escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
              userProvidedKeyEscapeRegex,
              "$&/"
            ) + "/") + childKey
          ), "" !== nameSoFar && null != invokeCallback && isValidElement(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
          return 1;
        }
        invokeCallback = 0;
        childKey = "" === nameSoFar ? "." : nameSoFar + ":";
        if (isArrayImpl(children))
          for (var i = 0; i < children.length; i++)
            nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if (i = getIteratorFn(children), "function" === typeof i)
          for (i === children.entries && (didWarnAboutMaps || console.warn(
            "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
          ), didWarnAboutMaps = true), children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
            nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if ("object" === type) {
          if ("function" === typeof children.then)
            return mapIntoArray(
              resolveThenable(children),
              array,
              escapedPrefix,
              nameSoFar,
              callback
            );
          array = String(children);
          throw Error(
            "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return invokeCallback;
      }
      function mapChildren(children, func, context) {
        if (null == children) return children;
        var result = [], count = 0;
        mapIntoArray(children, result, "", "", function(child) {
          return func.call(context, child, count++);
        });
        return result;
      }
      function lazyInitializer(payload) {
        if (-1 === payload._status) {
          var ioInfo = payload._ioInfo;
          null != ioInfo && (ioInfo.start = ioInfo.end = performance.now());
          ioInfo = payload._result;
          var thenable = ioInfo();
          thenable.then(
            function(moduleObject) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 1;
                payload._result = moduleObject;
                var _ioInfo = payload._ioInfo;
                null != _ioInfo && (_ioInfo.end = performance.now());
                void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
              }
            },
            function(error) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 2;
                payload._result = error;
                var _ioInfo2 = payload._ioInfo;
                null != _ioInfo2 && (_ioInfo2.end = performance.now());
                void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            }
          );
          ioInfo = payload._ioInfo;
          if (null != ioInfo) {
            ioInfo.value = thenable;
            var displayName = thenable.displayName;
            "string" === typeof displayName && (ioInfo.name = displayName);
          }
          -1 === payload._status && (payload._status = 0, payload._result = thenable);
        }
        if (1 === payload._status)
          return ioInfo = payload._result, void 0 === ioInfo && console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
            ioInfo
          ), "default" in ioInfo || console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
            ioInfo
          ), ioInfo.default;
        throw payload._result;
      }
      function resolveDispatcher() {
        var dispatcher = ReactSharedInternals.H;
        null === dispatcher && console.error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
        );
        return dispatcher;
      }
      function releaseAsyncTransition() {
        ReactSharedInternals.asyncTransitions--;
      }
      function enqueueTask(task) {
        if (null === enqueueTaskImpl)
          try {
            var requireString = ("require" + Math.random()).slice(0, 7);
            enqueueTaskImpl = (module && module[requireString]).call(
              module,
              "timers"
            ).setImmediate;
          } catch (_err) {
            enqueueTaskImpl = function(callback) {
              false === didWarnAboutMessageChannel && (didWarnAboutMessageChannel = true, "undefined" === typeof MessageChannel && console.error(
                "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
              ));
              var channel = new MessageChannel();
              channel.port1.onmessage = callback;
              channel.port2.postMessage(void 0);
            };
          }
        return enqueueTaskImpl(task);
      }
      function aggregateErrors(errors) {
        return 1 < errors.length && "function" === typeof AggregateError ? new AggregateError(errors) : errors[0];
      }
      function popActScope(prevActQueue, prevActScopeDepth) {
        prevActScopeDepth !== actScopeDepth - 1 && console.error(
          "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
        );
        actScopeDepth = prevActScopeDepth;
      }
      function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
        var queue = ReactSharedInternals.actQueue;
        if (null !== queue)
          if (0 !== queue.length)
            try {
              flushActQueue(queue);
              enqueueTask(function() {
                return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
              });
              return;
            } catch (error) {
              ReactSharedInternals.thrownErrors.push(error);
            }
          else ReactSharedInternals.actQueue = null;
        0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
      }
      function flushActQueue(queue) {
        if (!isFlushing) {
          isFlushing = true;
          var i = 0;
          try {
            for (; i < queue.length; i++) {
              var callback = queue[i];
              do {
                ReactSharedInternals.didUsePromise = false;
                var continuation = callback(false);
                if (null !== continuation) {
                  if (ReactSharedInternals.didUsePromise) {
                    queue[i] = callback;
                    queue.splice(0, i);
                    return;
                  }
                  callback = continuation;
                } else break;
              } while (1);
            }
            queue.length = 0;
          } catch (error) {
            queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
          } finally {
            isFlushing = false;
          }
        }
      }
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
        isMounted: function() {
          return false;
        },
        enqueueForceUpdate: function(publicInstance) {
          warnNoop(publicInstance, "forceUpdate");
        },
        enqueueReplaceState: function(publicInstance) {
          warnNoop(publicInstance, "replaceState");
        },
        enqueueSetState: function(publicInstance) {
          warnNoop(publicInstance, "setState");
        }
      }, assign = Object.assign, emptyObject = {};
      Object.freeze(emptyObject);
      Component.prototype.isReactComponent = {};
      Component.prototype.setState = function(partialState, callback) {
        if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, partialState, callback, "setState");
      };
      Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
      };
      var deprecatedAPIs = {
        isMounted: [
          "isMounted",
          "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
          "replaceState",
          "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
      };
      for (fnName in deprecatedAPIs)
        deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      ComponentDummy.prototype = Component.prototype;
      deprecatedAPIs = PureComponent.prototype = new ComponentDummy();
      deprecatedAPIs.constructor = PureComponent;
      assign(deprecatedAPIs, Component.prototype);
      deprecatedAPIs.isPureReactComponent = true;
      var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = {
        H: null,
        A: null,
        T: null,
        S: null,
        actQueue: null,
        asyncTransitions: 0,
        isBatchingLegacy: false,
        didScheduleLegacyUpdate: false,
        didUsePromise: false,
        thrownErrors: [],
        getCurrentStack: null,
        recentlyCreatedOwnerStacks: 0
      }, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      deprecatedAPIs = {
        react_stack_bottom_frame: function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = deprecatedAPIs.react_stack_bottom_frame.bind(
        deprecatedAPIs,
        UnknownOwner
      )();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
        if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
          var event = new window.ErrorEvent("error", {
            bubbles: true,
            cancelable: true,
            message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
            error
          });
          if (!window.dispatchEvent(event)) return;
        } else if ("object" === typeof process && "function" === typeof process.emit) {
          process.emit("uncaughtException", error);
          return;
        }
        console.error(error);
      }, didWarnAboutMessageChannel = false, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = false, isFlushing = false, queueSeveralMicrotasks = "function" === typeof queueMicrotask ? function(callback) {
        queueMicrotask(function() {
          return queueMicrotask(callback);
        });
      } : enqueueTask;
      deprecatedAPIs = Object.freeze({
        __proto__: null,
        c: function(size) {
          return resolveDispatcher().useMemoCache(size);
        }
      });
      var fnName = {
        map: mapChildren,
        forEach: function(children, forEachFunc, forEachContext) {
          mapChildren(
            children,
            function() {
              forEachFunc.apply(this, arguments);
            },
            forEachContext
          );
        },
        count: function(children) {
          var n = 0;
          mapChildren(children, function() {
            n++;
          });
          return n;
        },
        toArray: function(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        },
        only: function(children) {
          if (!isValidElement(children))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return children;
        }
      };
      exports.Activity = REACT_ACTIVITY_TYPE;
      exports.Children = fnName;
      exports.Component = Component;
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.Profiler = REACT_PROFILER_TYPE;
      exports.PureComponent = PureComponent;
      exports.StrictMode = REACT_STRICT_MODE_TYPE;
      exports.Suspense = REACT_SUSPENSE_TYPE;
      exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
      exports.__COMPILER_RUNTIME = deprecatedAPIs;
      exports.act = function(callback) {
        var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
        actScopeDepth++;
        var queue = ReactSharedInternals.actQueue = null !== prevActQueue ? prevActQueue : [], didAwaitActCall = false;
        try {
          var result = callback();
        } catch (error) {
          ReactSharedInternals.thrownErrors.push(error);
        }
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        if (null !== result && "object" === typeof result && "function" === typeof result.then) {
          var thenable = result;
          queueSeveralMicrotasks(function() {
            didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
              "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
            ));
          });
          return {
            then: function(resolve, reject) {
              didAwaitActCall = true;
              thenable.then(
                function(returnValue) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  if (0 === prevActScopeDepth) {
                    try {
                      flushActQueue(queue), enqueueTask(function() {
                        return recursivelyFlushAsyncActWork(
                          returnValue,
                          resolve,
                          reject
                        );
                      });
                    } catch (error$0) {
                      ReactSharedInternals.thrownErrors.push(error$0);
                    }
                    if (0 < ReactSharedInternals.thrownErrors.length) {
                      var _thrownError = aggregateErrors(
                        ReactSharedInternals.thrownErrors
                      );
                      ReactSharedInternals.thrownErrors.length = 0;
                      reject(_thrownError);
                    }
                  } else resolve(returnValue);
                },
                function(error) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(
                    ReactSharedInternals.thrownErrors
                  ), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
                }
              );
            }
          };
        }
        var returnValue$jscomp$0 = result;
        popActScope(prevActQueue, prevActScopeDepth);
        0 === prevActScopeDepth && (flushActQueue(queue), 0 !== queue.length && queueSeveralMicrotasks(function() {
          didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
            "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
          ));
        }), ReactSharedInternals.actQueue = null);
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        return {
          then: function(resolve, reject) {
            didAwaitActCall = true;
            0 === prevActScopeDepth ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
              return recursivelyFlushAsyncActWork(
                returnValue$jscomp$0,
                resolve,
                reject
              );
            })) : resolve(returnValue$jscomp$0);
          }
        };
      };
      exports.cache = function(fn) {
        return function() {
          return fn.apply(null, arguments);
        };
      };
      exports.cacheSignal = function() {
        return null;
      };
      exports.captureOwnerStack = function() {
        var getCurrentStack = ReactSharedInternals.getCurrentStack;
        return null === getCurrentStack ? null : getCurrentStack();
      };
      exports.cloneElement = function(element, config, children) {
        if (null === element || void 0 === element)
          throw Error(
            "The argument must be a React element, but you passed " + element + "."
          );
        var props = assign({}, element.props), key = element.key, owner = element._owner;
        if (null != config) {
          var JSCompiler_inline_result;
          a: {
            if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
              config,
              "ref"
            ).get) && JSCompiler_inline_result.isReactWarning) {
              JSCompiler_inline_result = false;
              break a;
            }
            JSCompiler_inline_result = void 0 !== config.ref;
          }
          JSCompiler_inline_result && (owner = getOwner());
          hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
          for (propName in config)
            !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
        }
        var propName = arguments.length - 2;
        if (1 === propName) props.children = children;
        else if (1 < propName) {
          JSCompiler_inline_result = Array(propName);
          for (var i = 0; i < propName; i++)
            JSCompiler_inline_result[i] = arguments[i + 2];
          props.children = JSCompiler_inline_result;
        }
        props = ReactElement(
          element.type,
          key,
          props,
          owner,
          element._debugStack,
          element._debugTask
        );
        for (key = 2; key < arguments.length; key++)
          validateChildKeys(arguments[key]);
        return props;
      };
      exports.createContext = function(defaultValue) {
        defaultValue = {
          $$typeof: REACT_CONTEXT_TYPE,
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        };
        defaultValue.Provider = defaultValue;
        defaultValue.Consumer = {
          $$typeof: REACT_CONSUMER_TYPE,
          _context: defaultValue
        };
        defaultValue._currentRenderer = null;
        defaultValue._currentRenderer2 = null;
        return defaultValue;
      };
      exports.createElement = function(type, config, children) {
        for (var i = 2; i < arguments.length; i++)
          validateChildKeys(arguments[i]);
        i = {};
        var key = null;
        if (null != config)
          for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = true, console.warn(
            "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
          )), hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key), config)
            hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i[propName] = config[propName]);
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength) i.children = children;
        else if (1 < childrenLength) {
          for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
            childArray[_i] = arguments[_i + 2];
          Object.freeze && Object.freeze(childArray);
          i.children = childArray;
        }
        if (type && type.defaultProps)
          for (propName in childrenLength = type.defaultProps, childrenLength)
            void 0 === i[propName] && (i[propName] = childrenLength[propName]);
        key && defineKeyPropWarningGetter(
          i,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return ReactElement(
          type,
          key,
          i,
          getOwner(),
          propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports.createRef = function() {
        var refObject = { current: null };
        Object.seal(refObject);
        return refObject;
      };
      exports.forwardRef = function(render) {
        null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error(
          "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
        ) : "function" !== typeof render ? console.error(
          "forwardRef requires a render function but was given %s.",
          null === render ? "null" : typeof render
        ) : 0 !== render.length && 2 !== render.length && console.error(
          "forwardRef render functions accept exactly two parameters: props and ref. %s",
          1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
        );
        null != render && null != render.defaultProps && console.error(
          "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
        );
        var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
        Object.defineProperty(elementType, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
          }
        });
        return elementType;
      };
      exports.isValidElement = isValidElement;
      exports.lazy = function(ctor) {
        ctor = { _status: -1, _result: ctor };
        var lazyType = {
          $$typeof: REACT_LAZY_TYPE,
          _payload: ctor,
          _init: lazyInitializer
        }, ioInfo = {
          name: "lazy",
          start: -1,
          end: -1,
          value: null,
          owner: null,
          debugStack: Error("react-stack-top-frame"),
          debugTask: console.createTask ? console.createTask("lazy()") : null
        };
        ctor._ioInfo = ioInfo;
        lazyType._debugInfo = [{ awaited: ioInfo }];
        return lazyType;
      };
      exports.memo = function(type, compare) {
        null == type && console.error(
          "memo: The first argument must be a component. Instead received: %s",
          null === type ? "null" : typeof type
        );
        compare = {
          $$typeof: REACT_MEMO_TYPE,
          type,
          compare: void 0 === compare ? null : compare
        };
        var ownName;
        Object.defineProperty(compare, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
          }
        });
        return compare;
      };
      exports.startTransition = function(scope) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        currentTransition._updatedFibers = /* @__PURE__ */ new Set();
        ReactSharedInternals.T = currentTransition;
        try {
          var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
          null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
          "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && (ReactSharedInternals.asyncTransitions++, returnValue.then(releaseAsyncTransition, releaseAsyncTransition), returnValue.then(noop, reportGlobalError));
        } catch (error) {
          reportGlobalError(error);
        } finally {
          null === prevTransition && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          )), null !== prevTransition && null !== currentTransition.types && (null !== prevTransition.types && prevTransition.types !== currentTransition.types && console.error(
            "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
          ), prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
        }
      };
      exports.unstable_useCacheRefresh = function() {
        return resolveDispatcher().useCacheRefresh();
      };
      exports.use = function(usable) {
        return resolveDispatcher().use(usable);
      };
      exports.useActionState = function(action, initialState, permalink) {
        return resolveDispatcher().useActionState(
          action,
          initialState,
          permalink
        );
      };
      exports.useCallback = function(callback, deps) {
        return resolveDispatcher().useCallback(callback, deps);
      };
      exports.useContext = function(Context) {
        var dispatcher = resolveDispatcher();
        Context.$$typeof === REACT_CONSUMER_TYPE && console.error(
          "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
        );
        return dispatcher.useContext(Context);
      };
      exports.useDebugValue = function(value, formatterFn) {
        return resolveDispatcher().useDebugValue(value, formatterFn);
      };
      exports.useDeferredValue = function(value, initialValue) {
        return resolveDispatcher().useDeferredValue(value, initialValue);
      };
      exports.useEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useEffect(create, deps);
      };
      exports.useEffectEvent = function(callback) {
        return resolveDispatcher().useEffectEvent(callback);
      };
      exports.useId = function() {
        return resolveDispatcher().useId();
      };
      exports.useImperativeHandle = function(ref, create, deps) {
        return resolveDispatcher().useImperativeHandle(ref, create, deps);
      };
      exports.useInsertionEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useInsertionEffect(create, deps);
      };
      exports.useLayoutEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useLayoutEffect(create, deps);
      };
      exports.useMemo = function(create, deps) {
        return resolveDispatcher().useMemo(create, deps);
      };
      exports.useOptimistic = function(passthrough, reducer) {
        return resolveDispatcher().useOptimistic(passthrough, reducer);
      };
      exports.useReducer = function(reducer, initialArg, init) {
        return resolveDispatcher().useReducer(reducer, initialArg, init);
      };
      exports.useRef = function(initialValue) {
        return resolveDispatcher().useRef(initialValue);
      };
      exports.useState = function(initialState) {
        return resolveDispatcher().useState(initialState);
      };
      exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
        return resolveDispatcher().useSyncExternalStore(
          subscribe,
          getSnapshot,
          getServerSnapshot
        );
      };
      exports.useTransition = function() {
        return resolveDispatcher().useTransition();
      };
      exports.version = "19.2.4";
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  }
});

// node_modules/react/index.js
var require_react = __commonJS({
  "node_modules/react/index.js"(exports, module) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module.exports = require_react_production();
    } else {
      module.exports = require_react_development();
    }
  }
});

// services/remSeriesConfig.ts
function isEnabledSerie(serie) {
  return ENABLED_SERIES.includes(serie.toUpperCase());
}
function getAllowedMonthsForSerie(serie) {
  const serieUpper = serie.toUpperCase();
  return isEnabledSerie(serieUpper) ? MONTHS_BY_SERIE[serieUpper] : [];
}
function getMonthExpectationLabel(serie) {
  const allowedMonths = getAllowedMonthsForSerie(serie);
  return allowedMonths.length ? allowedMonths.join(" o ") : "serie habilitada";
}
function isMonthAllowedForSerie(serie, month) {
  return getAllowedMonthsForSerie(serie).includes(month);
}
function getMissingRequiredSheetsForSerie(serie, sheets) {
  if (serie.toUpperCase() !== "P") return [];
  const sheetSet = new Set(sheets);
  return SERIE_P_REQUIRED_SHEETS.filter((sheet) => !sheetSet.has(sheet));
}
var RECOGNIZED_SERIES, ENABLED_SERIES, SERIE_A_MONTHS, SERIE_P_MONTHS, SERIE_P_REQUIRED_SHEETS, MONTHS_BY_SERIE;
var init_remSeriesConfig = __esm({
  "services/remSeriesConfig.ts"() {
    RECOGNIZED_SERIES = ["A", "P", "D", "BM", "BS"];
    ENABLED_SERIES = ["A", "P"];
    SERIE_A_MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
    SERIE_P_MONTHS = ["06", "12"];
    SERIE_P_REQUIRED_SHEETS = [
      "NOMBRE",
      "P1",
      "P2",
      "P3",
      "P4",
      "P5",
      "P6",
      "P7",
      "P9",
      "P11",
      "P12",
      "P13"
    ];
    MONTHS_BY_SERIE = {
      A: SERIE_A_MONTHS,
      P: SERIE_P_MONTHS
    };
  }
});

// services/excelService.ts
var excelService_exports = {};
__export(excelService_exports, {
  ExcelReaderService: () => ExcelReaderService
});
import XLSX from "xlsx-js-style";
var ExcelReaderService;
var init_excelService = __esm({
  "services/excelService.ts"() {
    ExcelReaderService = class _ExcelReaderService {
      constructor() {
        this.workbook = null;
      }
      static getInstance() {
        if (!_ExcelReaderService.instance) {
          _ExcelReaderService.instance = new _ExcelReaderService();
        }
        return _ExcelReaderService.instance;
      }
      async loadFile(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const data = new Uint8Array(e.target?.result);
              this.workbook = XLSX.read(data, { type: "array" });
              resolve();
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });
      }
      getCellValue(sheetName, cellRef) {
        if (!this.workbook) return null;
        const sheet = this.workbook.Sheets[sheetName];
        if (!sheet) return null;
        const cell = sheet[cellRef];
        return cell ? cell.v : null;
      }
      getRangeSum(sheetName, rangeRef) {
        if (!this.workbook) return 0;
        const sheet = this.workbook.Sheets[sheetName];
        if (!sheet) return 0;
        const range = XLSX.utils.decode_range(rangeRef);
        let sum = 0;
        for (let R = range.s.r; R <= range.e.r; ++R) {
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const address = XLSX.utils.encode_cell({ r: R, c: C });
            const cell = sheet[address];
            if (cell && typeof cell.v === "number") {
              sum += cell.v;
            }
          }
        }
        return sum;
      }
      getSheets() {
        return this.workbook?.SheetNames || [];
      }
      /**
       * Skill_Excel_Concatenate: Extrae, limpia, concatena y castéa datos de múltiples celdas.
       * 
       * @param sheetName La hoja por defecto donde buscar
       * @param coordenadas Las celdas a concatenar
       * @param separador El separador opcional (default '')
       * @returns Un valor numérico garantizado
       */
      concatenateToNumber(sheetName, coordenadas, separador = "") {
        const valoresCrudos = coordenadas.map((ref) => {
          let sheet = sheetName;
          let targetRef = ref;
          if (ref.includes("!")) {
            const parts = ref.split("!");
            sheet = parts[0];
            targetRef = parts[1];
          }
          const rawValue = this.getCellValue(sheet, targetRef);
          return rawValue === null || rawValue === void 0 ? "" : String(rawValue);
        });
        const resultadoString = valoresCrudos.join(separador);
        const stringLimpio = resultadoString.replace(/[^0-9.,-]/g, "");
        const stringParseable = stringLimpio.replace(",", ".");
        const numeroFinal = parseFloat(stringParseable);
        return isNaN(numeroFinal) ? 0 : numeroFinal;
      }
    };
  }
});

// services/ruleEngine.ts
var ruleEngine_exports = {};
__export(ruleEngine_exports, {
  RuleEngineService: () => RuleEngineService
});
function generateUUID() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "10000000-1000-4000-8000-100000000000".replace(
    /[018]/g,
    (c) => (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}
var RuleEngineService;
var init_ruleEngine = __esm({
  "services/ruleEngine.ts"() {
    init_excelService();
    RuleEngineService = class {
      constructor() {
        this.excel = ExcelReaderService.getInstance();
      }
      formatValue(value) {
        return JSON.stringify(value);
      }
      normalizeEstablishmentType(type) {
        if (!type) return void 0;
        const normalized = type.trim().toUpperCase();
        if (normalized === "OTRO") {
          return "OTROS";
        }
        if (normalized === "POSTAS") {
          return "POSTA";
        }
        return normalized;
      }
      compareValues(v1, operador, v2) {
        switch (operador) {
          case "==":
            return v1 === v2;
          case "!=":
            return v1 !== v2;
          case ">":
            return Number(v1) > Number(v2);
          case "<":
            return Number(v1) < Number(v2);
          case ">=":
            return Number(v1) >= Number(v2);
          case "<=":
            return Number(v1) <= Number(v2);
          default:
            return false;
        }
      }
      getReferenceLabel(rule, value, omittedByCondition = false) {
        if (omittedByCondition) {
          return "No aplica: sin datos previos";
        }
        const isNoDataRule = rule.tipo === "SIMPLE" && rule.operador === "==" && Number(rule.expresion_2) === 0;
        if (isNoDataRule) {
          return "Sin registro esperado";
        }
        return `Referencia evaluada: ${this.formatValue(value)}`;
      }
      ruleAppliesToMetadata(rule, metadata) {
        const establishmentCode = metadata.codigoEstablecimiento;
        const establishmentType = this.normalizeEstablishmentType(metadata.tipoEstablecimiento);
        const exclusiveByCode = !!(rule.validacion_exclusiva && rule.aplicar_a?.length);
        const exclusiveByType = !!(rule.validacion_exclusiva && rule.aplicar_a_tipo?.length);
        if (rule.establecimientos_excluidos?.includes(establishmentCode)) {
          return false;
        }
        if (!exclusiveByCode && rule.aplicar_a && !rule.aplicar_a.includes(establishmentCode)) {
          return false;
        }
        if (rule.excluir_tipo?.length && establishmentType) {
          const excludedTypes = new Set(rule.excluir_tipo.map((type) => this.normalizeEstablishmentType(type)));
          if (excludedTypes.has(establishmentType)) {
            return false;
          }
        }
        if (!exclusiveByType && rule.aplicar_a_tipo?.length) {
          if (!establishmentType) {
            return false;
          }
          const allowedTypes = new Set(rule.aplicar_a_tipo.map((type) => this.normalizeEstablishmentType(type)));
          if (!allowedTypes.has(establishmentType)) {
            return false;
          }
        }
        return true;
      }
      async evaluate(rules, metadata) {
        const results = [];
        for (const rule of rules) {
          if (!this.ruleAppliesToMetadata(rule, metadata)) {
            continue;
          }
          let exclusiveTargetAllowed = false;
          const normalizedType = this.normalizeEstablishmentType(metadata.tipoEstablecimiento);
          if (rule.validacion_exclusiva && rule.aplicar_a) {
            const targetSet = new Set(rule.aplicar_a);
            exclusiveTargetAllowed = targetSet.has(metadata.codigoEstablecimiento);
          } else if (rule.validacion_exclusiva && rule.aplicar_a_tipo?.length) {
            const targetTypes = new Set(rule.aplicar_a_tipo.map((type) => this.normalizeEstablishmentType(type)));
            exclusiveTargetAllowed = !!normalizedType && targetTypes.has(normalizedType);
          }
          try {
            const result = await this.evaluateSingleRule(rule, false, exclusiveTargetAllowed);
            results.push(result);
          } catch (e) {
            results.push({
              ruleId: rule.id,
              descripcion: rule.mensaje,
              severidad: rule.severidad,
              resultado: false,
              valorActual: "Error",
              valorEsperado: rule.expresion_2,
              mensaje: `Falla t\xE9cnica: ${e instanceof Error ? e.message : "Desconocido"}`,
              id: generateUUID()
            });
          }
        }
        return results;
      }
      async evaluateSingleRule(rule, invertirOperador = false, exclusiveTargetAllowed = false) {
        const val1 = this.resolveExpression(rule.expresion_1, rule.rem_sheet);
        const val2 = this.resolveExpression(rule.expresion_2, rule.rem_sheet_2 || rule.rem_sheet);
        const v1 = val1 === null || val1 === void 0 ? 0 : val1;
        const v2 = val2 === null || val2 === void 0 ? 0 : val2;
        if (exclusiveTargetAllowed) {
          return {
            ruleId: rule.id,
            descripcion: rule.mensaje,
            severidad: rule.severidad,
            resultado: true,
            valorActual: val1,
            valorEsperado: val2,
            referenciaLabel: "Establecimiento autorizado para registrar",
            operador: rule.operador,
            valorReferencia: val2,
            comparacion: "No aplica: establecimiento autorizado",
            diferencia: void 0,
            rem_sheet: rule.rem_sheet,
            id: generateUUID(),
            cell: typeof rule.expresion_1 === "string" && !rule.expresion_1.includes("SUM") && !rule.expresion_1.includes("+") && !rule.expresion_1.includes(":") ? rule.expresion_1 : void 0,
            evidence: "Omitida: el establecimiento est\xE1 autorizado para registrar esta secci\xF3n."
          };
        }
        if (rule.condicion_previa) {
          const conditionalValue = this.resolveExpression(rule.condicion_previa.expresion, rule.rem_sheet);
          const normalizedConditionalValue = conditionalValue === null || conditionalValue === void 0 ? 0 : conditionalValue;
          const conditionPassed = this.compareValues(
            normalizedConditionalValue,
            rule.condicion_previa.operador,
            rule.condicion_previa.valor
          );
          if (!conditionPassed && rule.omitir_si_condicion_no_cumple) {
            return {
              ruleId: rule.id,
              descripcion: rule.mensaje,
              severidad: rule.severidad,
              resultado: true,
              valorActual: val1,
              valorEsperado: val2,
              referenciaLabel: this.getReferenceLabel(rule, val2, true),
              operador: rule.operador,
              valorReferencia: val2,
              comparacion: `${this.formatValue(normalizedConditionalValue)} ${rule.condicion_previa.operador} ${this.formatValue(rule.condicion_previa.valor)}`,
              diferencia: 0,
              rem_sheet: rule.rem_sheet,
              id: generateUUID(),
              evidence: "Omitida: la condici\xF3n previa no se cumple, no existen datos para comparar."
            };
          }
        }
        if ((val1 === null || val1 === void 0 || val1 === "") && (val2 === null || val2 === void 0 || val2 === "")) {
          return {
            ruleId: rule.id,
            descripcion: rule.mensaje,
            severidad: rule.severidad,
            resultado: true,
            valorActual: val1,
            valorEsperado: val2,
            referenciaLabel: this.getReferenceLabel(rule, val2),
            operador: rule.operador,
            valorReferencia: val2,
            comparacion: `${this.formatValue(v1)} ${rule.operador} ${this.formatValue(v2)}`,
            diferencia: 0,
            rem_sheet: rule.rem_sheet,
            id: generateUUID(),
            evidence: "Omitida: ambos valores son nulos o vac\xEDos (sin datos para comparar)."
          };
        }
        if (rule.omitir_si_v1_es_cero && (val1 === null || val1 === void 0 || val1 === "" || val1 === 0)) {
          return {
            ruleId: rule.id,
            descripcion: rule.mensaje,
            severidad: rule.severidad,
            resultado: true,
            valorActual: val1,
            valorEsperado: val2,
            referenciaLabel: this.getReferenceLabel(rule, val2),
            operador: rule.operador,
            valorReferencia: val2,
            comparacion: `${this.formatValue(v1)} ${rule.operador} ${this.formatValue(v2)}`,
            diferencia: typeof v2 === "number" ? -v2 : void 0,
            rem_sheet: rule.rem_sheet,
            id: generateUUID(),
            evidence: "Omitida: valor actual de la expresi\xF3n 1 es nulo, vac\xEDo o cero."
          };
        }
        if (rule.omitir_si_ambos_cero && v1 === 0 && v2 === 0) {
          return {
            ruleId: rule.id,
            descripcion: rule.mensaje,
            severidad: rule.severidad,
            resultado: true,
            valorActual: 0,
            valorEsperado: val2,
            referenciaLabel: this.getReferenceLabel(rule, val2),
            operador: rule.operador,
            valorReferencia: 0,
            comparacion: `${this.formatValue(v1)} ${rule.operador} ${this.formatValue(v2)}`,
            diferencia: 0,
            rem_sheet: rule.rem_sheet,
            id: generateUUID(),
            evidence: "Omitida: ambos valores son 0 (sin datos para comparar)."
          };
        }
        let operador = rule.operador;
        if (invertirOperador) {
          switch (operador) {
            case "==":
              operador = "!=";
              break;
            case "!=":
              operador = "==";
              break;
            case ">":
              operador = "<=";
              break;
            case "<":
              operador = ">=";
              break;
            case ">=":
              operador = "<";
              break;
            case "<=":
              operador = ">";
              break;
          }
        }
        const passed = this.compareValues(v1, operador, v2);
        const operadorEfectivo = invertirOperador ? `${operador} (invertido de ${rule.operador})` : operador;
        const comparacion = `${this.formatValue(v1)} ${operador} ${this.formatValue(v2)}`;
        const diferencia = typeof v1 === "number" && typeof v2 === "number" ? v1 - v2 : void 0;
        return {
          ruleId: rule.id,
          descripcion: rule.mensaje,
          severidad: rule.severidad,
          resultado: passed,
          valorActual: val1,
          valorEsperado: val2,
          referenciaLabel: this.getReferenceLabel(rule, val2),
          operador,
          valorReferencia: val2,
          comparacion,
          diferencia,
          rem_sheet: rule.rem_sheet,
          id: generateUUID(),
          cell: typeof rule.expresion_1 === "string" && !rule.expresion_1.includes("SUM") && !rule.expresion_1.includes("+") && !rule.expresion_1.includes(":") ? rule.expresion_1 : void 0,
          evidence: `Evaluado: ${JSON.stringify(v1)}. Comparado con: ${operadorEfectivo} ${JSON.stringify(v2)}.`
        };
      }
      resolveExpression(expr, defaultSheet) {
        if (typeof expr === "number") return expr;
        if (!expr || typeof expr !== "string") return 0;
        const trimmed = expr.trim();
        let index = 0;
        const peek = () => trimmed[index];
        const consume = () => trimmed[index++];
        const skipWhitespace = () => {
          while (index < trimmed.length && /\s/.test(trimmed[index])) index++;
        };
        const toNumber = (value) => Number(value ?? 0) || 0;
        const readReference = () => {
          const start = index;
          let nestedParens = 0;
          while (index < trimmed.length && !/[+\-*/(),\s]/.test(trimmed[index])) {
            index++;
            if (trimmed[index] === "(" && trimmed[index - 1] === "!") {
              nestedParens = 1;
              index++;
              while (index < trimmed.length && nestedParens > 0) {
                if (trimmed[index] === "(") nestedParens++;
                if (trimmed[index] === ")") nestedParens--;
                index++;
              }
              break;
            }
          }
          return trimmed.slice(start, index);
        };
        const resolveReference = (rawRef) => {
          if (!rawRef) return 0;
          let sheet = defaultSheet;
          let ref = rawRef;
          if (rawRef.includes("!")) {
            const bangIdx = rawRef.indexOf("!");
            sheet = rawRef.substring(0, bangIdx);
            ref = rawRef.substring(bangIdx + 1);
          }
          ref = ref.replace(/[()]/g, "");
          if (ref.includes(":")) {
            return toNumber(this.excel.getRangeSum(sheet, ref));
          }
          return toNumber(this.excel.getCellValue(sheet, ref));
        };
        const parseExpression = () => {
          let value = parseTerm();
          skipWhitespace();
          while (peek() === "+" || peek() === "-") {
            const operator = consume();
            const right = parseTerm();
            value = operator === "+" ? value + right : value - right;
            skipWhitespace();
          }
          return value;
        };
        const parseTerm = () => {
          let value = parseFactor();
          skipWhitespace();
          while (peek() === "*" || peek() === "/") {
            const operator = consume();
            const right = parseFactor();
            value = operator === "*" ? value * right : right === 0 ? 0 : value / right;
            skipWhitespace();
          }
          return value;
        };
        const parseSum = () => {
          index += 3;
          skipWhitespace();
          if (peek() !== "(") return 0;
          consume();
          let total = 0;
          skipWhitespace();
          while (index < trimmed.length && peek() !== ")") {
            total += parseExpression();
            skipWhitespace();
            if (peek() === ",") {
              consume();
              skipWhitespace();
            }
          }
          if (peek() === ")") consume();
          return total;
        };
        const parseFactor = () => {
          skipWhitespace();
          if (peek() === "+") {
            consume();
            return parseFactor();
          }
          if (peek() === "-") {
            consume();
            return -parseFactor();
          }
          if (peek() === "(") {
            consume();
            const value = parseExpression();
            skipWhitespace();
            if (peek() === ")") consume();
            return value;
          }
          if (trimmed.slice(index, index + 3).toUpperCase() === "SUM") {
            return parseSum();
          }
          if (/\d/.test(peek())) {
            const numericMatch = trimmed.slice(index).match(/^\d+(?:\.\d+)?/);
            if (numericMatch) {
              index += numericMatch[0].length;
              return Number(numericMatch[0]);
            }
          }
          return resolveReference(readReference());
        };
        return parseExpression();
      }
    };
  }
});

// types.ts
var init_types = __esm({
  "types.ts"() {
  }
});

// data/establishments.catalog.json
var require_establishments_catalog = __commonJS({
  "data/establishments.catalog.json"(exports, module) {
    module.exports = {
      version: "2026.2.0",
      generadoEl: "2026-06-14T00:00:00-04:00",
      servicioDeSalud: "Servicio de Salud Osorno",
      totalEstablecimientos: 77,
      establecimientos: [
        {
          codigo: "123010",
          nombre: "Direcci\xF3n Servicio Salud Osorno",
          comuna: "10301",
          tipo: "DIRECCION",
          activo: true
        },
        {
          codigo: "123011",
          nombre: "PRAIS",
          comuna: "10301",
          tipo: "OTROS",
          activo: true
        },
        {
          codigo: "123012",
          nombre: "Cl\xEDnica Dental M\xF3vil (Osorno)",
          comuna: "10301",
          tipo: "MOVIL",
          activo: true
        },
        {
          codigo: "123030",
          nombre: "Departamento de Atenci\xF3n Integral Funcionarios",
          comuna: "10301",
          tipo: "HOSPITAL",
          activo: true
        },
        {
          codigo: "123100",
          nombre: "Hospital Base San Jos\xE9 de Osorno",
          comuna: "10301",
          tipo: "HOSPITAL",
          activo: true
        },
        {
          codigo: "123101",
          nombre: "Hospital de Purranque Dr. Juan Hepp Dubiau",
          comuna: "10303",
          tipo: "HOSPITAL",
          activo: true
        },
        {
          codigo: "123102",
          nombre: "Hospital de R\xEDo Negro",
          comuna: "10305",
          tipo: "HOSPITAL",
          activo: true
        },
        {
          codigo: "123103",
          nombre: "Hospital de Puerto Octay",
          comuna: "10302",
          tipo: "HOSPITAL",
          activo: true
        },
        {
          codigo: "123104",
          nombre: "Hospital Futa Sruka Lawenche Kunko Mapu Mo",
          comuna: "10306",
          tipo: "HOSPITAL",
          activo: true
        },
        {
          codigo: "123105",
          nombre: "Hospital Pu Mulen Quilacahu\xEDn",
          comuna: "10307",
          tipo: "HOSPITAL",
          activo: true
        },
        {
          codigo: "123203",
          nombre: "Clinica Alemana Osorno",
          comuna: "10301",
          tipo: "OTROS",
          activo: true
        },
        {
          codigo: "123207",
          nombre: "Centro de Rehabilitaci\xF3n de Minusv\xE1lidos",
          comuna: "10303",
          tipo: "OTROS",
          activo: true
        },
        {
          codigo: "123300",
          nombre: "Centro de Salud Familiar Dr. Pedro J\xE1uregui",
          comuna: "10301",
          tipo: "CESFAM",
          activo: true
        },
        {
          codigo: "123301",
          nombre: "Centro de Salud Familiar Dr. Marcelo Lopetegui Adams",
          comuna: "10301",
          tipo: "CESFAM",
          activo: true
        },
        {
          codigo: "123302",
          nombre: "Centro de Salud Familiar Ovejer\xEDa",
          comuna: "10301",
          tipo: "CESFAM",
          activo: true
        },
        {
          codigo: "123303",
          nombre: "Centro de Salud Familiar Rahue Alto",
          comuna: "10301",
          tipo: "CESFAM",
          activo: true
        },
        {
          codigo: "123304",
          nombre: "Centro de Salud Familiar Entre Lagos",
          comuna: "10304",
          tipo: "CESFAM",
          activo: true
        },
        {
          codigo: "123305",
          nombre: "Centro de Salud Familiar San Pablo",
          comuna: "10307",
          tipo: "CESFAM",
          activo: true
        },
        {
          codigo: "123306",
          nombre: "Centro de Salud Familiar Pampa Alegre",
          comuna: "10301",
          tipo: "CESFAM",
          activo: true
        },
        {
          codigo: "123307",
          nombre: "Centro de Salud Familiar Purranque",
          comuna: "10303",
          tipo: "CESFAM",
          activo: true
        },
        {
          codigo: "123309",
          nombre: "Centro de Salud Familiar Practicante Pablo Araya",
          comuna: "10305",
          tipo: "CESFAM",
          activo: true
        },
        {
          codigo: "123310",
          nombre: "Centro de Salud Familiar Quinto Centenario",
          comuna: "10301",
          tipo: "CESFAM",
          activo: true
        },
        {
          codigo: "123311",
          nombre: "Centro de Salud Familiar Bah\xEDa Mansa",
          comuna: "10306",
          tipo: "CESFAM",
          activo: true
        },
        {
          codigo: "123312",
          nombre: "Centro de Salud Familiar Puaucho",
          comuna: "10306",
          tipo: "CESFAM",
          activo: true
        },
        {
          codigo: "123402",
          nombre: "Posta de Salud Rural Cuinco",
          comuna: "10306",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123404",
          nombre: "Posta de Salud Rural Pichi Damas",
          comuna: "10301",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123406",
          nombre: "Posta de Salud Rural Puyehue",
          comuna: "10304",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123407",
          nombre: "Posta de Salud Rural Desag\xFCe Rupanco",
          comuna: "10304",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123408",
          nombre: "Posta de Salud Rural \xD1adi Pichi-Damas",
          comuna: "10304",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123410",
          nombre: "Posta de Salud Rural Tres Esteros",
          comuna: "10305",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123411",
          nombre: "Centro Comunitario de Salud Familiar Corte Alto",
          comuna: "10303",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123412",
          nombre: "Posta de Salud Rural Crucero ( Purranque)",
          comuna: "10303",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123413",
          nombre: "Posta de Salud Rural Coligual",
          comuna: "10303",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123414",
          nombre: "Posta de Salud Rural Hueyusca",
          comuna: "10303",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123415",
          nombre: "Posta de Salud Rural Concordia",
          comuna: "10303",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123416",
          nombre: "Posta de Salud Rural Colonia Ponce",
          comuna: "10303",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123417",
          nombre: "Posta de Salud Rural La Naranja",
          comuna: "10303",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123419",
          nombre: "Posta de Salud Rural San Pedro de Purranque",
          comuna: "10303",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123420",
          nombre: "Posta de Salud Rural Collihuinco",
          comuna: "10303",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123422",
          nombre: "Posta de Salud Rural Rupanco",
          comuna: "10302",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123423",
          nombre: "Posta de Salud Rural Cascadas",
          comuna: "10302",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123424",
          nombre: "Posta de Salud Rural Piedras Negras",
          comuna: "10302",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123425",
          nombre: "Posta de Salud Rural Cancura",
          comuna: "10301",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123426",
          nombre: "Posta de Salud Rural Pellinada",
          comuna: "10302",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123427",
          nombre: "Posta de Salud Rural La Calo",
          comuna: "10302",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123428",
          nombre: "Posta de Salud Rural Coihueco (Puerto Octay)",
          comuna: "10302",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123430",
          nombre: "Posta de Salud Rural Purrehu\xEDn",
          comuna: "10306",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123431",
          nombre: "Posta de Salud Rural Aleucapi",
          comuna: "10306",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123432",
          nombre: "Posta de Salud Rural La Poza",
          comuna: "10307",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123434",
          nombre: "Posta de Salud Rural Huilma",
          comuna: "10305",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123435",
          nombre: "Posta de Salud Rural Pucopio",
          comuna: "10307",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123436",
          nombre: "Posta de Salud Rural Chanco ( San Pablo )",
          comuna: "10307",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123437",
          nombre: "Posta de Salud Rural Currim\xE1huida",
          comuna: "10307",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "123700",
          nombre: "Centro Comunitario de Salud Familiar Murrinumo",
          comuna: "10301",
          tipo: "CECOSF",
          activo: true
        },
        {
          codigo: "123701",
          nombre: "Centro Comunitario de Salud Familiar Manuel Rodr\xEDguez",
          comuna: "10301",
          tipo: "CECOSF",
          activo: true
        },
        {
          codigo: "123705",
          nombre: "Centro Comunitario de Salud Familiar El Encanto",
          comuna: "10304",
          tipo: "CECOSF",
          activo: true
        },
        {
          codigo: "123709",
          nombre: "Centro Comunitario de Salud Familiar Riachuelo",
          comuna: "10305",
          tipo: "CECOSF",
          activo: true
        },
        {
          codigo: "123800",
          nombre: "SAPU Dr. Pedro J\xE1uregui",
          comuna: "10301",
          tipo: "SAPU",
          activo: true
        },
        {
          codigo: "123801",
          nombre: "SAPU Rahue Alto",
          comuna: "10301",
          tipo: "SAPU",
          activo: true
        },
        {
          codigo: "200085",
          nombre: "SAPU Dr. Marcelo Lopetegui Adams",
          comuna: "10301",
          tipo: "SAPU",
          activo: true
        },
        {
          codigo: "200209",
          nombre: "COSAM Rahue",
          comuna: "10301",
          tipo: "OTROS",
          activo: true
        },
        {
          codigo: "200248",
          nombre: "CDR de Adultos Mayores con Demencia",
          comuna: "10301",
          tipo: "OTROS",
          activo: true
        },
        {
          codigo: "200445",
          nombre: "COSAM Oriente",
          comuna: "10301",
          tipo: "OTROS",
          activo: true
        },
        {
          codigo: "200455",
          nombre: "Centro Comunitario de Salud Familiar Barrio Estaci\xF3n",
          comuna: "10303",
          tipo: "CESFAM",
          activo: true
        },
        {
          codigo: "200477",
          nombre: "Unidad de Memoria AYEKAN",
          comuna: "10301",
          tipo: "OTROS",
          activo: true
        },
        {
          codigo: "200490",
          nombre: "Posta de Salud Rural Chamilco",
          comuna: "10306",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "200539",
          nombre: "Centro Referencia Diagn\xF3stico M\xE9dico Osorno",
          comuna: "10301",
          tipo: "OTROS",
          activo: true
        },
        {
          codigo: "200556",
          nombre: "Hospital Digital",
          comuna: "10301",
          tipo: "OTROS",
          activo: true
        },
        {
          codigo: "200747",
          nombre: "SAPU Entre Lagos",
          comuna: "10304",
          tipo: "SAPU",
          activo: true
        },
        {
          codigo: "200748",
          nombre: "SUR San Pablo",
          comuna: "10307",
          tipo: "SUR",
          activo: true
        },
        {
          codigo: "200749",
          nombre: "SUR Bah\xEDa Mansa",
          comuna: "10306",
          tipo: "SUR",
          activo: true
        },
        {
          codigo: "200750",
          nombre: "SUR Puaucho",
          comuna: "10306",
          tipo: "SUR",
          activo: true
        },
        {
          codigo: "201055",
          nombre: "Terap\xE9utica Peulla Ambulatoria",
          comuna: "10301",
          tipo: "OTROS",
          activo: true
        },
        {
          codigo: "201056",
          nombre: "Terap\xE9utica Peulla Residencial",
          comuna: "10301",
          tipo: "OTROS",
          activo: true
        },
        {
          codigo: "201483",
          nombre: "Centro Comunitario de Salud Familiar Las Cascadas",
          comuna: "10302",
          tipo: "CESFAM",
          activo: true
        },
        {
          codigo: "201667",
          nombre: "Posta de Salud Rural Chan Chan R\xEDo Negro",
          comuna: "10305",
          tipo: "POSTA",
          activo: true
        },
        {
          codigo: "202043",
          nombre: "Posta de Salud Rural Pucatrihue",
          comuna: "10306",
          tipo: "POSTA",
          activo: true
        }
      ]
    };
  }
});

// services/nombreSheetValidator.ts
var nombreSheetValidator_exports = {};
__export(nombreSheetValidator_exports, {
  NombreSheetValidator: () => NombreSheetValidator
});
function getAcceptedVersions(fileSerie) {
  return ACCEPTED_VERSIONS_BY_SERIE[fileSerie.toUpperCase()] || DEFAULT_ACCEPTED_VERSIONS;
}
function generateUUID2() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "10000000-1000-4000-8000-100000000000".replace(
    /[018]/g,
    (c) => (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}
var import_establishments_catalog, catalog, establishmentCodes, communeCodes, VALID_MONTHS, DEFAULT_ACCEPTED_VERSIONS, ACCEPTED_VERSIONS_BY_SERIE, NombreSheetValidator;
var init_nombreSheetValidator = __esm({
  "services/nombreSheetValidator.ts"() {
    init_excelService();
    init_types();
    import_establishments_catalog = __toESM(require_establishments_catalog(), 1);
    init_remSeriesConfig();
    catalog = import_establishments_catalog.default;
    establishmentCodes = new Set(catalog.establecimientos.map((e) => e.codigo));
    communeCodes = new Set(catalog.establecimientos.map((e) => e.comuna));
    VALID_MONTHS = new Set(
      Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"))
    );
    DEFAULT_ACCEPTED_VERSIONS = [
      "Versi\xF3n 1.2: Febrero 2026",
      "Versi\xF3n 1.1: Febrero 2026"
    ];
    ACCEPTED_VERSIONS_BY_SERIE = {
      A: DEFAULT_ACCEPTED_VERSIONS,
      P: ["Versi\xF3n 1.2: Junio 2026"]
    };
    NombreSheetValidator = class {
      constructor() {
        this.excel = ExcelReaderService.getInstance();
        this.SHEET = "NOMBRE";
      }
      /**
       * Read a cell from the NOMBRE sheet, returning its string value trimmed.
       * Returns empty string if cell is null/undefined/empty.
       */
      getCellString(cell) {
        const val = this.excel.getCellValue(this.SHEET, cell);
        if (val === null || val === void 0) return "";
        return String(val).trim();
      }
      /**
       * Run all NOMBRE sheet validations.
       * @param fileEstablishmentCode El código de establecimiento extraído del nombre del archivo.
       * @param fileMonth El mes extraído del nombre del archivo (ej. "03").
       */
      validate(fileEstablishmentCode, fileMonth, fileSerie = "A") {
        const results = [];
        let versionError = null;
        const acceptedVersions = getAcceptedVersions(fileSerie);
        const versionVal = this.getCellString("A9");
        if (!acceptedVersions.includes(versionVal)) {
          versionError = versionVal ? `Versi\xF3n de archivo no v\xE1lida para Serie ${fileSerie.toUpperCase()}: "${versionVal}". Se acepta: ${acceptedVersions.map((v) => `"${v}"`).join(" o ")}` : `La celda A9 no contiene la versi\xF3n del archivo para Serie ${fileSerie.toUpperCase()}. Se acepta: ${acceptedVersions.map((v) => `"${v}"`).join(" o ")}`;
          results.push(this.makeResult(
            "VAL_NOM01",
            "ERROR" /* ERROR */,
            `NOMBRE, ERROR: ${versionError}`,
            versionVal || "(vac\xEDo)",
            acceptedVersions.join(" | "),
            "A9"
          ));
        }
        const communeName = this.getCellString("B2");
        if (!communeName) {
          results.push(this.makeResult(
            "VAL_NOM02",
            "ERROR" /* ERROR */,
            "NOMBRE, ERROR: El nombre de la Comuna (celda B2) est\xE1 vac\xEDo.",
            "(vac\xEDo)",
            "Nombre de comuna",
            "B2"
          ));
        }
        const communeCells = ["C2", "D2", "E2", "F2", "G2"];
        const communeCodeResult = this.validateConcatenatedCode(
          communeCells,
          communeCodes,
          "comuna",
          "VAL_NOM03",
          "c\xF3digo de comuna"
        );
        results.push(...communeCodeResult);
        const estabName = this.getCellString("B3");
        if (!estabName) {
          results.push(this.makeResult(
            "VAL_NOM04",
            "ERROR" /* ERROR */,
            "NOMBRE, ERROR: El nombre del Establecimiento (celda B3) est\xE1 vac\xEDo.",
            "(vac\xEDo)",
            "Nombre de establecimiento",
            "B3"
          ));
        }
        const estabCells = ["C3", "D3", "E3", "F3", "G3", "H3"];
        const estabCodeResult = this.validateConcatenatedCode(
          estabCells,
          establishmentCodes,
          "establecimiento",
          "VAL_NOM05",
          "c\xF3digo de establecimiento",
          fileEstablishmentCode
        );
        results.push(...estabCodeResult);
        const monthName = this.getCellString("B6");
        if (!monthName) {
          results.push(this.makeResult(
            "VAL_NOM06",
            "ERROR" /* ERROR */,
            "NOMBRE, ERROR: El nombre del Mes (celda B6) est\xE1 vac\xEDo.",
            "(vac\xEDo)",
            "Nombre del mes",
            "B6"
          ));
        }
        const monthCells = ["C6", "D6"];
        const monthCodeResult = this.validateMonthCode(monthCells, fileMonth, fileSerie);
        results.push(...monthCodeResult);
        const responsibleName = this.getCellString("B11");
        if (!responsibleName) {
          results.push(this.makeResult(
            "VAL_NOM08",
            "ERROR" /* ERROR */,
            "NOMBRE, ERROR: El nombre del Responsable del Establecimiento (celda B11) est\xE1 vac\xEDo.",
            "(vac\xEDo)",
            "Nombre del responsable",
            "B11"
          ));
        }
        const statisticsChief = this.getCellString("B12");
        if (!statisticsChief) {
          results.push(this.makeResult(
            "VAL_NOM09",
            "ERROR" /* ERROR */,
            "NOMBRE, ERROR: El nombre del Jefe de Estad\xEDstica (celda B12) est\xE1 vac\xEDo.",
            "(vac\xEDo)",
            "Nombre del jefe de estad\xEDstica",
            "B12"
          ));
        }
        return { results, versionError };
      }
      /**
       * Validate cells individually (not empty) then concatenate and lookup against a catalog set.
       * Utiliza Skill_Excel_Concatenate para purgar el valor y evitar errores de casteo matemáticos.
       */
      validateConcatenatedCode(cells, catalogSet, entityLabel, ruleIdBase, codeLabel, fileEstablishmentCode) {
        const results = [];
        let hasEmpty = false;
        for (const cell of cells) {
          const val = this.getCellString(cell);
          if (!val) {
            hasEmpty = true;
            results.push(this.makeResult(
              ruleIdBase,
              "ERROR" /* ERROR */,
              `NOMBRE, ERROR: La celda ${cell} del ${codeLabel} est\xE1 vac\xEDa.`,
              "(vac\xEDo)",
              `D\xEDgito del ${codeLabel}`,
              cell
            ));
          }
        }
        const numericCode = this.excel.concatenateToNumber(this.SHEET, cells);
        const codeString = numericCode.toString();
        if (!hasEmpty) {
          if (!catalogSet.has(codeString)) {
            results.push(this.makeResult(
              ruleIdBase,
              "ERROR" /* ERROR */,
              `NOMBRE, ERROR: El ${codeLabel} resultante "${codeString}" (celdas ${cells.join("&")}) no corresponde a un ${entityLabel} v\xE1lido del cat\xE1logo.`,
              codeString,
              `C\xF3digo de ${entityLabel} v\xE1lido`,
              cells[0]
            ));
          }
          if (ruleIdBase === "VAL_NOM05" && fileEstablishmentCode && codeString !== fileEstablishmentCode) {
            results.push(this.makeResult(
              "VAL_NOM10",
              "ERROR" /* ERROR */,
              `NOMBRE, ERROR: El c\xF3digo de establecimiento en la hoja ("${codeString}") no coincide con el c\xF3digo del archivo ("${fileEstablishmentCode}").`,
              codeString,
              fileEstablishmentCode,
              cells[0]
            ));
          }
        }
        return results;
      }
      /**
       * Validate month code cells: each not empty, concatenated value is valid month 01-12.
       * Utiliza Skill_Excel_Concatenate
       */
      validateMonthCode(cells, fileMonth, fileSerie = "A") {
        const results = [];
        let hasEmpty = false;
        for (const cell of cells) {
          const val = this.getCellString(cell);
          if (!val) {
            hasEmpty = true;
            results.push(this.makeResult(
              "VAL_NOM07",
              "ERROR" /* ERROR */,
              `NOMBRE, ERROR: La celda ${cell} del c\xF3digo de mes est\xE1 vac\xEDa.`,
              "(vac\xEDo)",
              "D\xEDgito del mes",
              cell
            ));
          }
        }
        const numericMonth = this.excel.concatenateToNumber(this.SHEET, cells);
        const monthCode = numericMonth.toString().padStart(2, "0");
        if (!hasEmpty) {
          if (!VALID_MONTHS.has(monthCode)) {
            results.push(this.makeResult(
              "VAL_NOM07",
              "ERROR" /* ERROR */,
              `NOMBRE, ERROR: El c\xF3digo de mes resultante "${monthCode}" (celdas ${cells.join("&")}) no corresponde a un mes v\xE1lido (01-12).`,
              monthCode,
              "Mes v\xE1lido (01-12)",
              cells[0]
            ));
          } else if (!isMonthAllowedForSerie(fileSerie, monthCode)) {
            results.push(this.makeResult(
              "VAL_NOM12",
              "ERROR" /* ERROR */,
              `NOMBRE, ERROR: El c\xF3digo de mes resultante "${monthCode}" no es v\xE1lido para la Serie ${fileSerie.toUpperCase()}. Debe ser ${getMonthExpectationLabel(fileSerie)}.`,
              monthCode,
              `Mes v\xE1lido para Serie ${fileSerie.toUpperCase()}: ${getMonthExpectationLabel(fileSerie)}`,
              cells[0]
            ));
          }
          if (fileMonth && monthCode !== fileMonth) {
            results.push(this.makeResult(
              "VAL_NOM11",
              "ERROR" /* ERROR */,
              `NOMBRE, ERROR: El mes en la hoja ("${monthCode}") no coincide con el mes del archivo ("${fileMonth}").`,
              monthCode,
              fileMonth,
              cells[0]
            ));
          }
        }
        return results;
      }
      /**
       * Create a ValidationResult compatible with the existing system.
       */
      makeResult(ruleId, severidad, mensaje, valorActual, valorEsperado, cell) {
        return {
          id: generateUUID2(),
          ruleId,
          descripcion: mensaje,
          severidad,
          resultado: false,
          valorActual,
          valorEsperado,
          rem_sheet: this.SHEET,
          cell,
          mensaje,
          evidence: `Evaluado: ${JSON.stringify(valorActual)}. Esperado: ${JSON.stringify(valorEsperado)}.`
        };
      }
    };
  }
});

// services/filenameValidator.ts
var filenameValidator_exports = {};
__export(filenameValidator_exports, {
  FilenameValidatorService: () => FilenameValidatorService,
  VALID_SERIES: () => VALID_SERIES
});
var VALID_SERIES, _FilenameValidatorService, FilenameValidatorService;
var init_filenameValidator = __esm({
  "services/filenameValidator.ts"() {
    init_remSeriesConfig();
    VALID_SERIES = RECOGNIZED_SERIES;
    _FilenameValidatorService = class _FilenameValidatorService {
      validate(filename) {
        const errors = [];
        if (!filename.toLowerCase().match(/\.(xlsx|xlsm)$/)) {
          return { isValid: false, errors: ["El archivo debe ser extensi\xF3n .xlsx o .xlsm"] };
        }
        const match = filename.match(_FilenameValidatorService.REGEX_FORMAT);
        let codigo, serie, mes;
        if (match) {
          [, codigo, serie, mes] = match;
        } else {
          return {
            isValid: false,
            errors: ["Formato de nombre inv\xE1lido. Esperado: [Codigo6][Serie1-2][Mes2].xlsx (Ej: 123100A02.xlsx, 123100BM01.xlsx)"]
          };
        }
        const serieUpper = serie.toUpperCase();
        if (!_FilenameValidatorService.SERIES_SET.has(serieUpper)) {
          errors.push(`Serie no reconocida: "${serieUpper}". Series v\xE1lidas: ${VALID_SERIES.join(", ")}`);
        } else if (!isEnabledSerie(serieUpper)) {
          errors.push(`La Serie "${serieUpper}" no est\xE1 realizada en el sistema. Actualmente solo est\xE1n disponibles las Series ${ENABLED_SERIES.join(" y ")}.`);
        }
        const mesNum = parseInt(mes, 10);
        if (mesNum < 1 || mesNum > 12) {
          errors.push(`Mes inv\xE1lido: ${mes}. Debe ser entre 01 y 12.`);
        } else if (isEnabledSerie(serieUpper) && !isMonthAllowedForSerie(serieUpper, mes)) {
          errors.push(`Mes inv\xE1lido para Serie ${serieUpper}: ${mes}. Debe ser ${getMonthExpectationLabel(serieUpper)}.`);
        }
        if (errors.length > 0) {
          return { isValid: false, errors };
        }
        const metadata = {
          nombreOriginal: filename,
          serieRem: serieUpper,
          mes,
          periodo: "2026",
          // Año defaulting to 2026 as per project context
          codigoEstablecimiento: codigo,
          extension: filename.split(".").pop()
        };
        return { isValid: true, errors: [], metadata };
      }
    };
    // Regex format: [IDESTABLECIMIENTO][SERIE][MES].(xlsx|xlsm)
    // Ejemplo: 123100A02.xlsx, 123100BM01.xlsx
    // Grupos: 1: Codigo (6 digitos), 2: Serie (1-2 letras: A, P, D, BM, BS), 3: Mes (2 digitos)
    _FilenameValidatorService.REGEX_FORMAT = /^(\d{6})([A-Z]{1,2})(\d{2})\.(xlsx|xlsm)$/i;
    // js-set-map-lookups: O(1) lookup for valid series
    _FilenameValidatorService.SERIES_SET = new Set(VALID_SERIES.map((s) => s.toUpperCase()));
    FilenameValidatorService = _FilenameValidatorService;
  }
});

// data/reglas_finales.json
var reglas_finales_default;
var init_reglas_finales = __esm({
  "data/reglas_finales.json"() {
    reglas_finales_default = {
      A01: [
        {
          id: "A01-VAL001",
          seccion_expresion_1: "SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
          descripcion_expresion_1: "Control Preconcepcional en edades extremas de 10 a 14 a\xF1os - Preconcepciona M\xE9dico/a",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A01",
          expresion_1: "F11",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Control Preconcepcional en edades extremas de 10 a 14 a\xF1os - Preconcepciona M\xE9dico/a | F11"
        },
        {
          id: "A01-VAL002",
          seccion_expresion_1: "SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
          descripcion_expresion_1: "Control Preconcepcional en edades extremas de 10 a 14 a\xF1os - Preconcepciona Matron/a",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A01",
          expresion_1: "F12",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Control Preconcepcional en edades extremas de 10 a 14 a\xF1os - Preconcepciona Matron/a | F12"
        },
        {
          id: "A01-VAL003",
          seccion_expresion_1: "SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
          descripcion_expresion_1: "Control Preconcepcional en edades extremas de 45 a 54 a\xF1os - Preconcepciona M\xE9dico/a",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A01",
          expresion_1: "M11",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Control Preconcepcional en edades extremas de 45 a 54 a\xF1os - Preconcepciona M\xE9dico/a | M11"
        },
        {
          id: "A01-VAL004",
          seccion_expresion_1: "SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
          descripcion_expresion_1: "Control Preconcepcional en edades extremas de 45 a 54 a\xF1os - Preconcepciona Matron/a",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A01",
          expresion_1: "M12",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Control Preconcepcional en edades extremas de 45 a 54 a\xF1os - Preconcepciona Matron/a | M12"
        },
        {
          id: "A01-VAL005",
          seccion_expresion_1: "SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
          descripcion_expresion_1: "Control Preconcepcional en edades extremas de 50 a 54 a\xF1os - Preconcepciona M\xE9dico/a",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A01",
          expresion_1: "N11",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Control Preconcepcional en edades extremas de 50 a 54 a\xF1os - Preconcepciona M\xE9dico/a | N11"
        },
        {
          id: "A01-VAL006",
          seccion_expresion_1: "SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
          descripcion_expresion_1: "Control Preconcepcional en edades extremas de 50 a 54 a\xF1os - Preconcepciona Matron/a",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A01",
          expresion_1: "N12",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Control Preconcepcional en edades extremas de 50 a 54 a\xF1os - Preconcepciona Matron/a | N12"
        },
        {
          id: "A01-VAL007",
          seccion_expresion_1: "SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
          descripcion_expresion_1: "Control Prenatal en edades extremas de 50 a 54 a\xF1os - Prenatal M\xE9dico/a",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A01",
          expresion_1: "N13",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Control Prenatal en edades extremas de 50 a 54 a\xF1os - Prenatal M\xE9dico/a | N13"
        },
        {
          id: "A01-VAL008",
          seccion_expresion_1: "SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
          descripcion_expresion_1: "Control Prenatal en edades extremas de 50 a 54 a\xF1os - Prenatal Matron/a",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A01",
          expresion_1: "N14",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Control Prenatal en edades extremas de 50 a 54 a\xF1os - Prenatal Matron/a | N14"
        },
        {
          id: "A01-VAL009",
          seccion_expresion_1: "SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
          descripcion_expresion_1: "Control Post Parto en Edades Extremas 50 a 54 a\xF1os - M\xE9dico/a",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A01",
          expresion_1: "N15",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Control Post Parto en Edades Extremas 50 a 54 a\xF1os - M\xE9dico/a | N15"
        },
        {
          id: "A01-VAL010",
          seccion_expresion_1: "SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
          descripcion_expresion_1: "Control Post Parto en Edades Extremas 50 a 54 a\xF1os - Matron/a",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A01",
          expresion_1: "N16",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Control Post Parto en Edades Extremas 50 a 54 a\xF1os - Matron/a | N16"
        },
        {
          id: "A01-VAL011",
          seccion_expresion_1: "SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
          descripcion_expresion_1: "Control Regulaci\xF3n de Fecundidad en edades extremas 55 - 59 a\xF1os - M\xE9dico/a",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A01",
          expresion_1: "O31",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Control Regulaci\xF3n de Fecundidad en edades extremas 55 - 59 a\xF1os - M\xE9dico/a | O31"
        },
        {
          id: "A01-VAL012",
          seccion_expresion_1: "SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
          descripcion_expresion_1: "Control Regulaci\xF3n de Fecundidad en edades extremas 55 - 59 a\xF1os - M\xE9dico/a",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A01",
          expresion_1: "O32",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Control Regulaci\xF3n de Fecundidad en edades extremas 55 - 59 a\xF1os - M\xE9dico/a | O32"
        },
        {
          id: "A01-VAL013",
          seccion_expresion_1: "SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
          descripcion_expresion_1: "Control Regulaci\xF3n de Fecundidad en edades extremas 60 - 64 a\xF1os - M\xE9dico/a",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A01",
          expresion_1: "P31",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Control Regulaci\xF3n de Fecundidad en edades extremas 60 - 64 a\xF1os - M\xE9dico/a | P31"
        },
        {
          id: "A01-VAL014",
          seccion_expresion_1: "SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
          descripcion_expresion_1: "Control Regulaci\xF3n de Fecundidad en edades extremas 60 - 64 a\xF1os - M\xE9dico/a",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A01",
          expresion_1: "P32",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Control Regulaci\xF3n de Fecundidad en edades extremas 60 - 64 a\xF1os - M\xE9dico/a | P32"
        },
        {
          id: "A01-VAL015",
          seccion_expresion_1: "SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
          descripcion_expresion_1: "Control Regulaci\xF3n de Fecundidad en edades extremas 65 - 69 a\xF1os - M\xE9dico/a",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A01",
          expresion_1: "Q31",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Control Regulaci\xF3n de Fecundidad en edades extremas 65 - 69 a\xF1os - M\xE9dico/a | Q31"
        },
        {
          id: "A01-VAL016",
          seccion_expresion_1: "SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
          descripcion_expresion_1: "Control Regulaci\xF3n de Fecundidad en edades extremas 65 - 69 a\xF1os - M\xE9dico/a",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A01",
          expresion_1: "Q32",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Control Regulaci\xF3n de Fecundidad en edades extremas 65 - 69 a\xF1os - M\xE9dico/a | Q32"
        },
        {
          id: "A01-VAL017",
          seccion_expresion_1: "SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
          descripcion_expresion_1: "Control Regulaci\xF3n de Fecundidad en edades extremas 70 -74 a\xF1os - M\xE9dico/a",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A01",
          expresion_1: "R31",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Control Regulaci\xF3n de Fecundidad en edades extremas 70 -74 a\xF1os - M\xE9dico/a | R31"
        },
        {
          id: "A01-VAL018",
          seccion_expresion_1: "SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
          descripcion_expresion_1: "Control Regulaci\xF3n de Fecundidad en edades extremas 70 -74 a\xF1os - M\xE9dico/a",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A01",
          expresion_1: "R32",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Control Regulaci\xF3n de Fecundidad en edades extremas 70 -74 a\xF1os - M\xE9dico/a | R32"
        },
        {
          id: "A01-VAL019",
          seccion_expresion_1: "SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
          descripcion_expresion_1: "Control Regulaci\xF3n de Fecundidad en edades extremas 75 -79 a\xF1os - M\xE9dico/a",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A01",
          expresion_1: "S31",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Control Regulaci\xF3n de Fecundidad en edades extremas 75 -79 a\xF1os - M\xE9dico/a | S31"
        },
        {
          id: "A01-VAL020",
          seccion_expresion_1: "SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
          descripcion_expresion_1: "Control Regulaci\xF3n de Fecundidad en edades extremas 75 -79 a\xF1os - M\xE9dico/a",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A01",
          expresion_1: "S32",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Control Regulaci\xF3n de Fecundidad en edades extremas 75 -79 a\xF1os - M\xE9dico/a | S32"
        },
        {
          id: "A01-VAL021",
          seccion_expresion_1: "SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
          descripcion_expresion_1: "Control Regulaci\xF3n de Fecundidad en edades extremas 80 a\xF1os y M\xE1s - M\xE9dico/a",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A01",
          expresion_1: "T31",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Control Regulaci\xF3n de Fecundidad en edades extremas 80 a\xF1os y M\xE1s - M\xE9dico/a | T31"
        },
        {
          id: "A01-VAL022",
          seccion_expresion_1: "SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA",
          descripcion_expresion_1: "Control Regulaci\xF3n de Fecundidad en edades extremas 80 a\xF1os y M\xE1s - M\xE9dico/a",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A01",
          expresion_1: "T32",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA | Control Regulaci\xF3n de Fecundidad en edades extremas 80 a\xF1os y M\xE1s - M\xE9dico/a | T32"
        },
        {
          id: "A01-VAL023",
          seccion_expresion_1: "SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA / SECCI\xD3N B: CONTROLES DE SALUD SEG\xDAN CICLO VITAL",
          descripcion_expresion_1: "Control Pu\xE9rpera reci\xE9n nacido hasta 10 d\xEDas de vida m\xE1s Control de salud Menos de 1 Mes",
          tipo: "COMPUESTA",
          tipo_validacion: "COMPUESTA",
          rem_sheet: "A01",
          expresion_1: "C19+C20+C21+C22+C23+C24+C25+C26+F36+F37+F38",
          operador: "==",
          expresion_2: "C89",
          severidad: "ERROR",
          rem_sheet_2: "A05",
          seccion_expresion_2: "SECCI\xD3N E: INGRESOS A CONTROL DE SALUD DE RECI\xC9N NACIDOS",
          descripcion_expresion_2: "Ingresos a control de salud reci\xE9n Nacidos, Menores o igual a 28 d\xEDas",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM01 | SECCI\xD3N A: CONTROLES DE SALUD SEXUAL Y REPRODUCTIVA / SECCI\xD3N B: CONTROLES DE SALUD SEG\xDAN CICLO VITAL | Control Pu\xE9rpera reci\xE9n nacido hasta 10 d\xEDas de vida m\xE1s Control de salud Menos de 1 Mes | C19+C20+C21+C22+C23+C24+C25+C26+F36+F37+F38 == REM05 | SECCI\xD3N E: INGRESOS A CONTROL DE SALUD DE RECI\xC9N NACIDOS | Ingresos a control de salud reci\xE9n Nacidos, Menores o igual a 28 d\xEDas | C89"
        },
        {
          id: "A01-VAL024",
          seccion_expresion_1: "SECCI\xD3N B: CONTROLES DE SALUD SEG\xDAN CICLO VITAL",
          descripcion_expresion_1: "Controles de salud realizado por M\xE9dico/a, Enfermera/o Matrona/\xF3n en el rango de 10-14 a\xF1os",
          tipo: "COMPUESTA",
          tipo_validacion: "COMPUESTA",
          rem_sheet: "A01",
          expresion_1: "T36+T37+T38",
          operador: ">=",
          expresion_2: "C74",
          severidad: "ERROR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "SECCI\xD3N D: CONTROL DE SALUD INTEGRAL DE ADOLESCENTES",
          descripcion_expresion_2: "Total de controles seg\xFAn Lugar de control seg\xFAn edad 10 a 14 a\xF1os",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM01 | SECCI\xD3N B: CONTROLES DE SALUD SEG\xDAN CICLO VITAL | Controles de salud realizado por M\xE9dico/a, Enfermera/o Matrona/\xF3n en el rango de 10-14 a\xF1os | T36+T37+T38 >= REM01 | SECCI\xD3N D: CONTROL DE SALUD INTEGRAL DE ADOLESCENTES | Total de controles seg\xFAn Lugar de control seg\xFAn edad 10 a 14 a\xF1os | C74"
        },
        {
          id: "A01-VAL025",
          seccion_expresion_1: "SECCI\xD3N B: CONTROLES DE SALUD SEG\xDAN CICLO VITAL",
          descripcion_expresion_1: "Controles de salud realizado por M\xE9dico/a, Enfermera/o Matrona/\xF3n en el rango de 15-19 a\xF1os",
          tipo: "COMPUESTA",
          tipo_validacion: "COMPUESTA",
          rem_sheet: "A01",
          expresion_1: "U36+U37+U38",
          operador: ">=",
          expresion_2: "F74",
          severidad: "ERROR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "SECCI\xD3N D: CONTROL DE SALUD INTEGRAL DE ADOLESCENTES",
          descripcion_expresion_2: "Total de controles seg\xFAn Lugar de control seg\xFAn edad 15 a 19 a\xF1os",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM01 | SECCI\xD3N B: CONTROLES DE SALUD SEG\xDAN CICLO VITAL | Controles de salud realizado por M\xE9dico/a, Enfermera/o Matrona/\xF3n en el rango de 15-19 a\xF1os | U36+U37+U38 >= REM01 | SECCI\xD3N D: CONTROL DE SALUD INTEGRAL DE ADOLESCENTES | Total de controles seg\xFAn Lugar de control seg\xFAn edad 15 a 19 a\xF1os | F74"
        },
        {
          id: "A01-VAL026",
          seccion_expresion_1: "SECCI\xD3N B: CONTROLES DE SALUD SEG\xDAN CICLO VITAL",
          descripcion_expresion_1: "Control de salud Menos de 1 Mes, NO deber\xEDa ser registrado por el m\xE9dico salvo excepciones",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A01",
          expresion_1: "F36",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A01",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N B: CONTROLES DE SALUD SEG\xDAN CICLO VITAL | Control de salud Menos de 1 Mes, NO deber\xEDa ser registrado por el m\xE9dico salvo excepciones | F36"
        },
        {
          id: "A01-VAL027",
          seccion_expresion_1: "SECCI\xD3N B: CONTROLES DE SALUD SEG\xDAN CICLO VITAL",
          descripcion_expresion_1: "Controles de salud realizado por M\xE9dico/a, Enfermera/o en el rango 18 - 23 meses",
          tipo: "COMPUESTA",
          tipo_validacion: "COMPUESTA",
          rem_sheet: "A01",
          expresion_1: "O36+O37",
          operador: ">=",
          expresion_2: "L20+M20",
          severidad: "REVISAR",
          rem_sheet_2: "A03",
          seccion_expresion_2: "SECCI\xD3N A.2: RESULTADOS DE LA APLICACI\xD3N DE ESCALA DE EVALUACI\xD3N DEL DESARROLLO PSICOMOTOR",
          descripcion_expresion_2: "Aplicaci\xF3n test de Desarrollo Psicomotor en el rango 18 - 23 meses",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N B: CONTROLES DE SALUD SEG\xDAN CICLO VITAL | Controles de salud realizado por M\xE9dico/a, Enfermera/o en el rango 18 - 23 meses | O36+O37 >= REM03 | SECCI\xD3N A.2: RESULTADOS DE LA APLICACI\xD3N DE ESCALA DE EVALUACI\xD3N DEL DESARROLLO PSICOMOTOR | Aplicaci\xF3n test de Desarrollo Psicomotor en el rango 18 - 23 meses | L20+M20"
        },
        {
          id: "A01-VAL028",
          seccion_expresion_1: "SECCI\xD3N B: CONTROLES DE SALUD SEG\xDAN CICLO VITAL",
          descripcion_expresion_1: "Controles de salud realizado por M\xE9dico/a, Enfermera/o en el rango 24 - 47 meses",
          tipo: "COMPUESTA",
          tipo_validacion: "COMPUESTA",
          rem_sheet: "A01",
          expresion_1: "P36+P37",
          operador: ">=",
          expresion_2: "N20+O20",
          severidad: "REVISAR",
          rem_sheet_2: "A03",
          seccion_expresion_2: "SECCI\xD3N A.2: RESULTADOS DE LA APLICACI\xD3N DE ESCALA DE EVALUACI\xD3N DEL DESARROLLO PSICOMOTOR",
          descripcion_expresion_2: "Aplicaci\xF3n test de Desarrollo Psicomotor en el rango 24 - 47 meses",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM01 | SECCI\xD3N B: CONTROLES DE SALUD SEG\xDAN CICLO VITAL | Controles de salud realizado por M\xE9dico/a, Enfermera/o en el rango 24 - 47 meses | P36+P37 >= REM03 | SECCI\xD3N A.2: RESULTADOS DE LA APLICACI\xD3N DE ESCALA DE EVALUACI\xD3N DEL DESARROLLO PSICOMOTOR | Aplicaci\xF3n test de Desarrollo Psicomotor en el rango 24 - 47 meses | N20+O20"
        },
        {
          id: "A01-VAL029",
          seccion_expresion_1: "SECCI\xD3N B: CONTROLES DE SALUD SEG\xDAN CICLO VITAL",
          descripcion_expresion_1: "Controles de salud realizado por M\xE9dico/a, Enfermera/o en el rango 2 meses",
          tipo: "COMPUESTA",
          tipo_validacion: "COMPUESTA",
          rem_sheet: "A01",
          expresion_1: "H36+H37",
          operador: "==",
          expresion_2: "C92",
          severidad: "REVISAR",
          rem_sheet_2: "A03",
          seccion_expresion_2: "SECCI\xD3N B.3: APLICACI\xD3N DE ESCALA DE EDIMBURGO A GESTANTES Y MUJERES POST PARTO",
          descripcion_expresion_2: "Evaluaci\xF3n a mujeres/personas post parto s\xEDntomas de depresi\xF3n A los 2 meses",
          aplica_origen: "TODOS",
          omitir_si_ambos_cero: true,
          mensaje: "REVISAR | REM01 | SECCI\xD3N B: CONTROLES DE SALUD SEG\xDAN CICLO VITAL | Controles de salud realizado por M\xE9dico/a, Enfermera/o en el rango 2 meses | H36+H37 == REM03 | SECCI\xD3N B.3: APLICACI\xD3N DE ESCALA DE EDIMBURGO A GESTANTES Y MUJERES POST PARTO | Evaluaci\xF3n a mujeres/personas post parto s\xEDntomas de depresi\xF3n A los 2 meses | C92"
        },
        {
          id: "A01-VAL030",
          seccion_expresion_1: "SECCI\xD3N B: CONTROLES DE SALUD SEG\xDAN CICLO VITAL",
          descripcion_expresion_1: "Controles de salud realizado por M\xE9dico/a, Enfermera/o en el rango 6 meses",
          tipo: "COMPUESTA",
          tipo_validacion: "COMPUESTA",
          rem_sheet: "A01",
          expresion_1: "L36+L37",
          operador: "==",
          expresion_2: "C93",
          severidad: "REVISAR",
          rem_sheet_2: "A03",
          seccion_expresion_2: "SECCI\xD3N B.3: APLICACI\xD3N DE ESCALA DE EDIMBURGO A GESTANTES Y MUJERES POST PARTO",
          descripcion_expresion_2: "Evaluaci\xF3n a mujeres/personas post parto s\xEDntomas de depresi\xF3n A los 6 meses",
          aplica_origen: "TODOS",
          omitir_si_ambos_cero: true,
          mensaje: "REVISAR | REM01 | SECCI\xD3N B: CONTROLES DE SALUD SEG\xDAN CICLO VITAL | Controles de salud realizado por M\xE9dico/a, Enfermera/o en el rango 6 meses | L36+L37 == REM03 | SECCI\xD3N B.3: APLICACI\xD3N DE ESCALA DE EDIMBURGO A GESTANTES Y MUJERES POST PARTO | Evaluaci\xF3n a mujeres/personas post parto s\xEDntomas de depresi\xF3n A los 6 meses | C93"
        },
        {
          id: "A01-VAL031",
          seccion_expresion_1: "SECCI\xD3N B: CONTROLES DE SALUD SEG\xDAN CICLO VITAL",
          descripcion_expresion_1: "Controles de salud realizado por M\xE9dico/a, Enfermera/o Matrona/\xF3n en los rangos 10 - 14 a\xF1os y 15 - 19 a\xF1os",
          tipo: "COMPUESTA",
          tipo_validacion: "COMPUESTA",
          rem_sheet: "A01",
          expresion_1: "T36+T37+T38+U36+U37+U38",
          operador: "==",
          expresion_2: "C97",
          severidad: "ERROR",
          rem_sheet_2: "A03",
          seccion_expresion_2: "SECCI\xD3N C: RESULTADOS DE LA EVALUACI\xD3N DEL ESTADO NUTRICIONAL DEL ADOLESCENTE CON CONTROL SALUD INTEGRAL",
          descripcion_expresion_2: "Total Estado Nutricional par ambos Sexos",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM01 | SECCI\xD3N B: CONTROLES DE SALUD SEG\xDAN CICLO VITAL | Controles de salud realizado por M\xE9dico/a, Enfermera/o Matrona/\xF3n en los rangos 10 - 14 a\xF1os y 15 - 19 a\xF1os | T36+T37+T38+U36+U37+U38 == REM03 | SECCI\xD3N C: RESULTADOS DE LA EVALUACI\xD3N DEL ESTADO NUTRICIONAL DEL ADOLESCENTE CON CONTROL SALUD INTEGRAL | Total Estado Nutricional par ambos Sexos | C97"
        }
      ],
      A02: [
        {
          id: "A02-VAL001",
          seccion_expresion_1: "SECCI\xD3N A: EMP REALIZADO POR PROFESIONAL",
          descripcion_expresion_1: "Total EMP Realizados por Profesional para Ambos Sexos",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A02",
          expresion_1: "B11",
          operador: "==",
          expresion_2: "B21",
          severidad: "ERROR",
          rem_sheet_2: "A02",
          seccion_expresion_2: "SECCI\xD3N B: EMP SEG\xDAN RESULTADO DEL ESTADO NUTRICIONAL",
          descripcion_expresion_2: "Total EMP seg\xFAn Resultado del Estado Nutricional Ambos Sexos",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM02 | SECCI\xD3N A: EMP REALIZADO POR PROFESIONAL | Total EMP Realizados por Profesional para Ambos Sexos | B11 == REM02 | SECCI\xD3N B: EMP SEG\xDAN RESULTADO DEL ESTADO NUTRICIONAL | Total EMP seg\xFAn Resultado del Estado Nutricional Ambos Sexos | B21"
        },
        {
          id: "A02-VAL002",
          seccion_expresion_1: "SECCI\xD3N A: EMP REALIZADO POR PROFESIONAL",
          descripcion_expresion_1: "Total EMP realizados por profesional a Hombres",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A02",
          expresion_1: "C11",
          operador: "==",
          expresion_2: "C21",
          severidad: "ERROR",
          rem_sheet_2: "A02",
          seccion_expresion_2: "SECCI\xD3N B: EMP SEG\xDAN RESULTADO DEL ESTADO NUTRICIONAL",
          descripcion_expresion_2: "Total EMP seg\xFAn Resultado del Estado Nutricional a Hombres",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM02 | SECCI\xD3N A: EMP REALIZADO POR PROFESIONAL | Total EMP realizados por profesional a Hombres | C11 == REM02 | SECCI\xD3N B: EMP SEG\xDAN RESULTADO DEL ESTADO NUTRICIONAL | Total EMP seg\xFAn Resultado del Estado Nutricional a Hombres | C21"
        },
        {
          id: "A02-VAL003",
          seccion_expresion_1: "SECCI\xD3N A: EMP REALIZADO POR PROFESIONAL",
          descripcion_expresion_1: "Total EMP realizados por profesional a Mujeres",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A02",
          expresion_1: "D11",
          operador: "==",
          expresion_2: "D21",
          severidad: "ERROR",
          rem_sheet_2: "A02",
          seccion_expresion_2: "SECCI\xD3N B: EMP SEG\xDAN RESULTADO DEL ESTADO NUTRICIONAL",
          descripcion_expresion_2: "Total EMP seg\xFAn Resultado del Estado Nutricional a Mujeres",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM02 | SECCI\xD3N A: EMP REALIZADO POR PROFESIONAL | Total EMP realizados por profesional a Mujeres | D11 == REM02 | SECCI\xD3N B: EMP SEG\xDAN RESULTADO DEL ESTADO NUTRICIONAL | Total EMP seg\xFAn Resultado del Estado Nutricional a Mujeres | D21"
        },
        {
          id: "A02-VAL004",
          seccion_expresion_1: "SECCI\xD3N A: EMP REALIZADO POR PROFESIONAL",
          descripcion_expresion_1: "Total EMP realizado por Profesional, celda B17 debe corresponder solo a Postas",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A02",
          expresion_1: "B17",
          operador: "==",
          expresion_2: 0,
          severidad: "ERROR",
          rem_sheet_2: "A02",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "POSTAS",
          aplicar_a: [
            "123402",
            "123404",
            "123406",
            "123407",
            "123408",
            "123410",
            "123411",
            "123412",
            "123413",
            "123414",
            "123415",
            "123416",
            "123417",
            "123419",
            "123420",
            "123422",
            "123423",
            "123424",
            "123425",
            "123426",
            "123427",
            "123428",
            "123430",
            "123431",
            "123432",
            "123434",
            "123435",
            "123436",
            "123437",
            "200490",
            "201667",
            "202043"
          ],
          validacion_exclusiva: true,
          mensaje: "ERROR | REM02 | SECCI\xD3N A: EMP REALIZADO POR PROFESIONAL | Total EMP realizado por Profesional, celda B17 debe corresponder solo a Postas | B17"
        },
        {
          id: "A02-VAL005",
          seccion_expresion_1: "SECCI\xD3N A: EMP REALIZADO POR PROFESIONAL",
          descripcion_expresion_1: "Total EMP Realizados por Profesional para Ambos Sexos",
          tipo: "COMPUESTA",
          tipo_validacion: "COMPUESTA",
          rem_sheet: "A02",
          expresion_1: "B11",
          operador: "==",
          expresion_2: "C108+C110",
          severidad: "ERROR",
          rem_sheet_2: "A03",
          seccion_expresion_2: "SECCI\xD3N D.1: APLICACI\xD3N DE TAMIZAJE PARA EVALUAR EL NIVEL DE RIESGO DE CONSUMO DE ALCOHOL, TABACO Y OTRAS DROGAS",
          descripcion_expresion_2: "N\xBA de Audit (EMP/EMPAM) y N\xBA de Assist (EMP/EMPAM) para Ambos Sexos",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM02 | SECCI\xD3N A: EMP REALIZADO POR PROFESIONAL | Total EMP Realizados por Profesional para Ambos Sexos | B11 == REM03 | SECCI\xD3N D.1: APLICACI\xD3N DE TAMIZAJE PARA EVALUAR EL NIVEL DE RIESGO DE CONSUMO DE ALCOHOL, TABACO Y OTRAS DROGAS | N\xBA de Audit (EMP/EMPAM) y N\xBA de Assist (EMP/EMPAM) para Ambos Sexos | C108+C110"
        },
        {
          id: "A02-VAL006",
          seccion_expresion_1: "SECCI\xD3N A: EMP REALIZADO POR PROFESIONAL",
          descripcion_expresion_1: "Total EMP Realizados por Profesional en el rango de edad 15 - 19 a\xF1os",
          tipo: "COMPUESTA",
          tipo_validacion: "COMPUESTA",
          rem_sheet: "A02",
          expresion_1: "E11+F11",
          operador: "==",
          expresion_2: "C113",
          severidad: "ERROR",
          rem_sheet_2: "A03",
          seccion_expresion_2: "SECCI\xD3N D.1: APLICACI\xD3N DE TAMIZAJE PARA EVALUAR EL NIVEL DE RIESGO DE CONSUMO DE ALCOHOL, TABACO Y OTRAS DROGAS",
          descripcion_expresion_2: "N\xB0 de Craff aplicado (EMP)",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM02 | SECCI\xD3N A: EMP REALIZADO POR PROFESIONAL | Total EMP Realizados por Profesional en el rango de edad 15 - 19 a\xF1os | E11+F11 == REM03 | SECCI\xD3N D.1: APLICACI\xD3N DE TAMIZAJE PARA EVALUAR EL NIVEL DE RIESGO DE CONSUMO DE ALCOHOL, TABACO Y OTRAS DROGAS | N\xB0 de Craff aplicado (EMP) | C113"
        }
      ],
      A03: [
        {
          id: "A03-VAL001",
          seccion_expresion_1: "SECCI\xD3N A.2: RESULTADOS DE LA APLICACI\xD3N DE ESCALA DE EVALUACI\xD3N DEL DESARROLLO PSICOMOTOR",
          descripcion_expresion_1: "Total Aplicaci\xF3n test de Desarrollo Psicomotor Ambos Sexos",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A03",
          expresion_1: "C20",
          operador: "==",
          expresion_2: "C21+C22+C23+C24+C25+C26+C27+C28+C29+C30+C31+C32+C33+C34+C35+C36",
          severidad: "ERROR",
          rem_sheet_2: "A03",
          seccion_expresion_2: "SECCI\xD3N A.2: RESULTADOS DE LA APLICACI\xD3N DE ESCALA DE EVALUACI\xD3N DEL DESARROLLO PSICOMOTOR",
          descripcion_expresion_2: "Resultados de Aplicaci\xF3n test de Desarrollo Psicomotor",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM03 | SECCI\xD3N A.2: RESULTADOS DE LA APLICACI\xD3N DE ESCALA DE EVALUACI\xD3N DEL DESARROLLO PSICOMOTOR | Total Aplicaci\xF3n test de Desarrollo Psicomotor Ambos Sexos | C20 == REM03 | SECCI\xD3N A.2: RESULTADOS DE LA APLICACI\xD3N DE ESCALA DE EVALUACI\xD3N DEL DESARROLLO PSICOMOTOR | Resultados de Aplicaci\xF3n test de Desarrollo Psicomotor | C21+C22+C23+C24+C25+C26+C27+C28+C29+C30+C31+C32+C33+C34+C35+C36"
        },
        {
          id: "A03-VAL002",
          seccion_expresion_1: "SECCI\xD3N A.1: APLICACI\xD3N Y RESULTADOS DE PAUTA BREVE",
          descripcion_expresion_1: "Aplicaci\xF3n Pauta Breve en Ambos Sexos",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A03",
          expresion_1: "C13",
          operador: "==",
          expresion_2: "C14+C15",
          severidad: "ERROR",
          rem_sheet_2: "A03",
          seccion_expresion_2: "SECCI\xD3N A.1: APLICACI\xD3N Y RESULTADOS DE PAUTA BREVE",
          descripcion_expresion_2: "Resultados Normal y Alterado",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM03 | SECCI\xD3N A.1: APLICACI\xD3N Y RESULTADOS DE PAUTA BREVE | Aplicaci\xF3n Pauta Breve en Ambos Sexos | C13 == REM03 | SECCI\xD3N A.1: APLICACI\xD3N Y RESULTADOS DE PAUTA BREVE | Resultados Normal y Alterado | C14+C15"
        },
        {
          id: "A03-VAL003",
          seccion_expresion_1: "SECCI\xD3N A.4: RESULTADOS DE LA APLICACI\xD3N DE PROTOCOLO NEUROSENSORIAL",
          descripcion_expresion_1: "Total Aplicaci\xF3n de Protocolo Neurosensorial (1-2 meses) en ambos sexos",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A03",
          expresion_1: "C54",
          operador: "==",
          expresion_2: "C55+C56+C57",
          severidad: "ERROR",
          rem_sheet_2: "A03",
          seccion_expresion_2: "SECCI\xD3N A.4: RESULTADOS DE LA APLICACI\xD3N DE PROTOCOLO NEUROSENSORIAL",
          descripcion_expresion_2: "Total resultado Aplicaci\xF3n de Protocolo Neurosensorial (Normal, Anormal y Muy Anormal)",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM03 | SECCI\xD3N A.4: RESULTADOS DE LA APLICACI\xD3N DE PROTOCOLO NEUROSENSORIAL | Total Aplicaci\xF3n de Protocolo Neurosensorial (1-2 meses) en ambos sexos | C54 == REM03 | SECCI\xD3N A.4: RESULTADOS DE LA APLICACI\xD3N DE PROTOCOLO NEUROSENSORIAL | Total resultado Aplicaci\xF3n de Protocolo Neurosensorial (Normal, Anormal y Muy Anormal) | C55+C56+C57"
        },
        {
          id: "A03-VAL004",
          seccion_expresion_1: "SECCI\xD3N A.2: RESULTADOS DE LA APLICACI\xD3N DE ESCALA DE EVALUACI\xD3N DEL DESARROLLO PSICOMOTOR",
          descripcion_expresion_1: "Resultado Primera Evaluaci\xF3n Normal con Rezago",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A03",
          expresion_1: "C22",
          operador: "==",
          expresion_2: "B46",
          severidad: "ERROR",
          rem_sheet_2: "A03",
          seccion_expresion_2: "SECCI\xD3N A.3: NI\xD1OS Y NI\xD1AS CON REZAGO, D\xC9FICIT O RIESGO BIOPSICOSOCIAL DERIVADOS A ALGUNA MODALIDAD DE ESTIMULACI\xD3N EN LA PRIMERA EVALUACI\xD3N",
          descripcion_expresion_2: "Derivados a alguna Modalidad de estimulacion Normal con Rezago",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM03 | SECCI\xD3N A.2: RESULTADOS DE LA APLICACI\xD3N DE ESCALA DE EVALUACI\xD3N DEL DESARROLLO PSICOMOTOR | Resultado Primera Evaluaci\xF3n Normal con Rezago | C22 == REM03 | SECCI\xD3N A.3: NI\xD1OS Y NI\xD1AS CON REZAGO, D\xC9FICIT O RIESGO BIOPSICOSOCIAL DERIVADOS A ALGUNA MODALIDAD DE ESTIMULACI\xD3N EN LA PRIMERA EVALUACI\xD3N | Derivados a alguna Modalidad de estimulacion Normal con Rezago | B46"
        },
        {
          id: "A03-VAL005",
          seccion_expresion_1: "SECCI\xD3N A.2: RESULTADOS DE LA APLICACI\xD3N DE ESCALA DE EVALUACI\xD3N DEL DESARROLLO PSICOMOTOR",
          descripcion_expresion_1: "Resultado Primera Evaluaci\xF3n Riesgo",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A03",
          expresion_1: "C23",
          operador: "==",
          expresion_2: "B47",
          severidad: "ERROR",
          rem_sheet_2: "A03",
          seccion_expresion_2: "SECCI\xD3N A.3: NI\xD1OS Y NI\xD1AS CON REZAGO, D\xC9FICIT O RIESGO BIOPSICOSOCIAL DERIVADOS A ALGUNA MODALIDAD DE ESTIMULACI\xD3N EN LA PRIMERA EVALUACI\xD3N",
          descripcion_expresion_2: "Derivados a alguna Modalidad de estimulacion Normal con Riesgo",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM03 | SECCI\xD3N A.2: RESULTADOS DE LA APLICACI\xD3N DE ESCALA DE EVALUACI\xD3N DEL DESARROLLO PSICOMOTOR | Resultado Primera Evaluaci\xF3n Riesgo | C23 == REM03 | SECCI\xD3N A.3: NI\xD1OS Y NI\xD1AS CON REZAGO, D\xC9FICIT O RIESGO BIOPSICOSOCIAL DERIVADOS A ALGUNA MODALIDAD DE ESTIMULACI\xD3N EN LA PRIMERA EVALUACI\xD3N | Derivados a alguna Modalidad de estimulacion Normal con Riesgo | B47"
        },
        {
          id: "A03-VAL006",
          seccion_expresion_1: "SECCI\xD3N A.2: RESULTADOS DE LA APLICACI\xD3N DE ESCALA DE EVALUACI\xD3N DEL DESARROLLO PSICOMOTOR",
          descripcion_expresion_1: "Resultado Primera Evaluaci\xF3n Retraso",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A03",
          expresion_1: "C24",
          operador: "==",
          expresion_2: "B48",
          severidad: "ERROR",
          rem_sheet_2: "A03",
          seccion_expresion_2: "SECCI\xD3N A.3: NI\xD1OS Y NI\xD1AS CON REZAGO, D\xC9FICIT O RIESGO BIOPSICOSOCIAL DERIVADOS A ALGUNA MODALIDAD DE ESTIMULACI\xD3N EN LA PRIMERA EVALUACI\xD3N",
          descripcion_expresion_2: "Derivados a alguna Modalidad de estimulacion Normal con Retraso",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM03 | SECCI\xD3N A.2: RESULTADOS DE LA APLICACI\xD3N DE ESCALA DE EVALUACI\xD3N DEL DESARROLLO PSICOMOTOR | Resultado Primera Evaluaci\xF3n Retraso | C24 == REM03 | SECCI\xD3N A.3: NI\xD1OS Y NI\xD1AS CON REZAGO, D\xC9FICIT O RIESGO BIOPSICOSOCIAL DERIVADOS A ALGUNA MODALIDAD DE ESTIMULACI\xD3N EN LA PRIMERA EVALUACI\xD3N | Derivados a alguna Modalidad de estimulacion Normal con Retraso | B48"
        },
        {
          id: "A03-VAL007",
          seccion_expresion_1: "SECCI\xD3N B.2: APLICACI\xD3N DE ESCALA SEG\xDAN EVALUACI\xD3N DE RIESGO PSICOSOCIAL ABREVIADA A GESTANTES",
          descripcion_expresion_1: "Total Aplicaci\xF3n Evaluaci\xF3n al ingreso",
          tipo: "COMPUESTA",
          tipo_validacion: "COMPUESTA",
          rem_sheet: "A03",
          expresion_1: "B86",
          operador: "==",
          expresion_2: "C11",
          severidad: "ERROR",
          rem_sheet_2: "A05",
          seccion_expresion_2: "SECCI\xD3N A: INGRESOS DE GESTANTES A PROGRAMA PRENATAL",
          descripcion_expresion_2: "Total Gestantes Ingresadas",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM03 | SECCI\xD3N B.2: APLICACI\xD3N DE ESCALA SEG\xDAN EVALUACI\xD3N DE RIESGO PSICOSOCIAL ABREVIADA A GESTANTES | Total Aplicaci\xF3n Evaluaci\xF3n al ingreso | B86 == REM05 | SECCI\xD3N A: INGRESOS DE GESTANTES A PROGRAMA PRENATAL | Total Gestantes Ingresadas | C11"
        },
        {
          id: "A03-VAL008",
          seccion_expresion_1: "SECCI\xD3N D.1: APLICACI\xD3N DE TAMIZAJE PARA EVALUAR EL NIVEL DE RIESGO DE CONSUMO DE ALCOHOL, TABACO Y OTRAS DROGAS",
          descripcion_expresion_1: "Comopnentes de evaluacion de riesgo (N\xBA de Audit- N\xBA de Assis - N\xB0 de Craff )",
          tipo: "COMPUESTA",
          tipo_validacion: "COMPUESTA",
          rem_sheet: "A03",
          expresion_1: "C108+C109+C110+C111+C112+C113+C114",
          operador: "==",
          expresion_2: "C115+C116+C117",
          severidad: "ERROR",
          rem_sheet_2: "A03",
          seccion_expresion_2: "SECCI\xD3N D.1: APLICACI\xD3N DE TAMIZAJE PARA EVALUAR EL NIVEL DE RIESGO DE CONSUMO DE ALCOHOL, TABACO Y OTRAS DROGAS",
          descripcion_expresion_2: "Resultados de evaluaci\xF3n (Bajo riesgo-Consumo riesgoso/intermedio - Posible consumo perjudicial o dependencia )",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM03 | SECCI\xD3N D.1: APLICACI\xD3N DE TAMIZAJE PARA EVALUAR EL NIVEL DE RIESGO DE CONSUMO DE ALCOHOL, TABACO Y OTRAS DROGAS | Comopnentes de evaluacion de riesgo (N\xBA de Audit- N\xBA de Assis - N\xB0 de Craff ) | C108+C109+C110+C111+C112+C113+C114 == REM03 | SECCI\xD3N D.1: APLICACI\xD3N DE TAMIZAJE PARA EVALUAR EL NIVEL DE RIESGO DE CONSUMO DE ALCOHOL, TABACO Y OTRAS DROGAS | Resultados de evaluaci\xF3n (Bajo riesgo-Consumo riesgoso/intermedio - Posible consumo perjudicial o dependencia ) | C115+C116+C117"
        },
        {
          id: "A03-VAL009",
          seccion_expresion_1: "SECCION E: APLICACI\xD3N DE PAUTA DETECCI\xD3N DE FACTORES DE RIESGO BIOPSICOSOCIAL INFANTIL",
          descripcion_expresion_1: "Total de Aplicaciones Pauta de Riesgo Biopsicosocial en Control de Salud Infantil",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A03",
          expresion_1: "C213",
          operador: "==",
          expresion_2: "C214+C215",
          severidad: "ERROR",
          rem_sheet_2: "A03",
          seccion_expresion_2: "SECCION E: APLICACI\xD3N DE PAUTA DETECCI\xD3N DE FACTORES DE RIESGO BIOPSICOSOCIAL INFANTIL",
          descripcion_expresion_2: "total evaluacion Riesgo y Sin Riesgo",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM03 | SECCION E: APLICACI\xD3N DE PAUTA DETECCI\xD3N DE FACTORES DE RIESGO BIOPSICOSOCIAL INFANTIL | Total de Aplicaciones Pauta de Riesgo Biopsicosocial en Control de Salud Infantil | C213 == REM03 | SECCION E: APLICACI\xD3N DE PAUTA DETECCI\xD3N DE FACTORES DE RIESGO BIOPSICOSOCIAL INFANTIL | total evaluacion Riesgo y Sin Riesgo | C214+C215"
        },
        {
          id: "A03-VAL010",
          seccion_expresion_1: "SECCI\xD3N A.5: TIPO DE ALIMENTACI\xD3N NI\xD1OS Y NI\xD1AS CONTROLADOS",
          descripcion_expresion_1: "Tipos de alimentaci\xF3n (Lactancia Materna exclusiva (LME)- Lactancia Materna m\xE1s Formula L\xE1ctea (LM/FL), Formula L\xE1ctea (FL), Etc",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A03",
          expresion_1: "C61+C62+C63+C64+C65+C66",
          operador: "==",
          expresion_2: "C67",
          severidad: "ERROR",
          rem_sheet_2: "A03",
          seccion_expresion_2: "SECCI\xD3N A.5: TIPO DE ALIMENTACI\xD3N NI\xD1OS Y NI\xD1AS CONTROLADOS",
          descripcion_expresion_2: "Total de ni\xF1os y ni\xF1as controlados",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM03 | SECCI\xD3N A.5: TIPO DE ALIMENTACI\xD3N NI\xD1OS Y NI\xD1AS CONTROLADOS | Tipos de alimentaci\xF3n (Lactancia Materna exclusiva (LME)- Lactancia Materna m\xE1s Formula L\xE1ctea (LM/FL), Formula L\xE1ctea (FL), Etc | C61+C62+C63+C64+C65+C66 == REM03 | SECCI\xD3N A.5: TIPO DE ALIMENTACI\xD3N NI\xD1OS Y NI\xD1AS CONTROLADOS | Total de ni\xF1os y ni\xF1as controlados | C67"
        }
      ],
      A04: [
        {
          id: "A04-VAL001",
          seccion_expresion_1: "SECCI\xD3N B: CONSULTAS DE PROFESIONALES NO M\xC9DICOS",
          descripcion_expresion_1: "Consultas Nutricionista (Otras consultas), Nutricionista malnutrici\xF3n por exceso, Nutricionista malnutrici\xF3n por d\xE9ficit en ambos sexos",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A04",
          expresion_1: "B39+B40+B41",
          operador: "==",
          expresion_2: "B135+B136+B137",
          severidad: "ERROR",
          rem_sheet_2: "A04",
          seccion_expresion_2: "SECCI\xD3N K: CLASIFICACI\xD3N DE CONSULTA NUTRICIONAL POR GRUPO DE EDAD (Incluidas en secci\xF3n B)",
          descripcion_expresion_2: "Clasificaci\xF3n Nutricional (Mal nutrici\xF3n por riesgo a desnutrir/riesgo bajo peso, Mal nutrici\xF3n por riesgo obesidad sobrepeso, Estado nutricional normal )",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM04 | SECCI\xD3N B: CONSULTAS DE PROFESIONALES NO M\xC9DICOS | Consultas Nutricionista (Otras consultas), Nutricionista malnutrici\xF3n por exceso, Nutricionista malnutrici\xF3n por d\xE9ficit en ambos sexos | B39+B40+B41 == REM04 | SECCI\xD3N K: CLASIFICACI\xD3N DE CONSULTA NUTRICIONAL POR GRUPO DE EDAD (Incluidas en secci\xF3n B) | Clasificaci\xF3n Nutricional (Mal nutrici\xF3n por riesgo a desnutrir/riesgo bajo peso, Mal nutrici\xF3n por riesgo obesidad sobrepeso, Estado nutricional normal ) | B135+B136+B137"
        },
        {
          id: "A04-VAL002",
          seccion_expresion_1: "SECCI\xD3N L: CONSULTA DE LACTANCIA EN NI\xD1OS Y NI\xD1AS CONTROLADOS",
          descripcion_expresion_1: "Total Consultas Lactancia Materna",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A04",
          expresion_1: "C141+C142+C143",
          operador: "==",
          expresion_2: "C146+C147+C148+C149",
          severidad: "ERROR",
          rem_sheet_2: "A04",
          seccion_expresion_2: "SECCI\xD3N L: CONSULTA DE LACTANCIA EN NI\xD1OS Y NI\xD1AS CONTROLADOS",
          descripcion_expresion_2: "TotalConsulta de Lactancia por profesional (M\xE9dico/a, Matrona/\xF3n, Enfermera/o, Nutricionista )",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM04 | SECCI\xD3N L: CONSULTA DE LACTANCIA EN NI\xD1OS Y NI\xD1AS CONTROLADOS | Total Consultas Lactancia Materna | C141+C142+C143 == REM04 | SECCI\xD3N L: CONSULTA DE LACTANCIA EN NI\xD1OS Y NI\xD1AS CONTROLADOS | TotalConsulta de Lactancia por profesional (M\xE9dico/a, Matrona/\xF3n, Enfermera/o, Nutricionista ) | C146+C147+C148+C149"
        },
        {
          id: "A04-VAL003",
          seccion_expresion_1: "SECCI\xD3N I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCI\xD3N PRIMARIA",
          descripcion_expresion_1: "Despacho de recetas (Despacho Completo - Despacho Parcial) para tipo: Cr\xF3nica",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A04",
          expresion_1: "C114+D114",
          operador: "==",
          expresion_2: "E114+F114",
          severidad: "ERROR",
          rem_sheet_2: "A04",
          seccion_expresion_2: "SECCI\xD3N I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCI\xD3N PRIMARIA",
          descripcion_expresion_2: "Lugar de entrega: En Centro de Salud y En Domicilio para tipo: Cr\xF3nica",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM04 | SECCI\xD3N I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCI\xD3N PRIMARIA | Despacho de recetas (Despacho Completo - Despacho Parcial) para tipo: Cr\xF3nica | C114+D114 == REM04 | SECCI\xD3N I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCI\xD3N PRIMARIA | Lugar de entrega: En Centro de Salud y En Domicilio para tipo: Cr\xF3nica | E114+F114"
        },
        {
          id: "A04-VAL004",
          seccion_expresion_1: "SECCI\xD3N I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCI\xD3N PRIMARIA",
          descripcion_expresion_1: "Despacho de recetas (Despacho Completo - Despacho Parcial) para tipo: Morbilidad",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A04",
          expresion_1: "C115+D115",
          operador: "==",
          expresion_2: "E115+F115",
          severidad: "ERROR",
          rem_sheet_2: "A04",
          seccion_expresion_2: "SECCI\xD3N I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCI\xD3N PRIMARIA",
          descripcion_expresion_2: "Lugar de entrega: En Centro de Salud y En Domicilio para tipo: Morbilidad",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM04 | SECCI\xD3N I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCI\xD3N PRIMARIA | Despacho de recetas (Despacho Completo - Despacho Parcial) para tipo: Morbilidad | C115+D115 == REM04 | SECCI\xD3N I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCI\xD3N PRIMARIA | Lugar de entrega: En Centro de Salud y En Domicilio para tipo: Morbilidad | E115+F115"
        },
        {
          id: "A04-VAL005",
          seccion_expresion_1: "SECCI\xD3N I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCI\xD3N PRIMARIA",
          descripcion_expresion_1: "Despacho de recetas (Despacho Completo - Despacho Parcial) para tipo: Bajo control legal",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A04",
          expresion_1: "C116+D116",
          operador: "==",
          expresion_2: "E116+F116",
          severidad: "ERROR",
          rem_sheet_2: "A04",
          seccion_expresion_2: "SECCI\xD3N I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCI\xD3N PRIMARIA",
          descripcion_expresion_2: "Lugar de entrega: En Centro de Salud y En Domicilio para tipo: Bajo control legal",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM04 | SECCI\xD3N I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCI\xD3N PRIMARIA | Despacho de recetas (Despacho Completo - Despacho Parcial) para tipo: Bajo control legal | C116+D116 == REM04 | SECCI\xD3N I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCI\xD3N PRIMARIA | Lugar de entrega: En Centro de Salud y En Domicilio para tipo: Bajo control legal | E116+F116"
        },
        {
          id: "A04-VAL006",
          seccion_expresion_1: "SECCI\xD3N I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCI\xD3N PRIMARIA",
          descripcion_expresion_1: "Despacho de recetas Completo y Oportuno para tipo Cr\xF3nica",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A04",
          expresion_1: "M114",
          operador: "==",
          expresion_2: "L114",
          severidad: "ERROR",
          rem_sheet_2: "A04",
          seccion_expresion_2: "SECCI\xD3N I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCI\xD3N PRIMARIA",
          descripcion_expresion_2: "Despacho de recetas Completo",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM04 | SECCI\xD3N I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCI\xD3N PRIMARIA | Despacho de recetas Completo y Oportuno para tipo Cr\xF3nica | M114 == REM04 | SECCI\xD3N I.1: DESPACHO DE RECETAS DE PACIENTES AMBULATORIOS EN ATENCI\xD3N PRIMARIA | Despacho de recetas Completo | L114"
        }
      ],
      A05: [
        {
          id: "A05-VAL001",
          seccion_expresion_1: "SECCI\xD3N A: INGRESOS DE GESTANTES A PROGRAMA PRENATAL",
          descripcion_expresion_1: "Ingreso de Gestantes Ingresadas en edades (45 - 49 a\xF1os, 50 - 54 a\xF1os, 55 y m\xE1s a\xF1os)",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A05",
          expresion_1: "L11+L12+L13+L14+M11+M12+M13+M14+N11+N12+N13+N14",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A05",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM05 | SECCI\xD3N A: INGRESOS DE GESTANTES A PROGRAMA PRENATAL | Ingreso de Gestantes Ingresadas en edades (45 - 49 a\xF1os, 50 - 54 a\xF1os, 55 y m\xE1s a\xF1os) | L11+L12+L13+L14+M11+M12+M13+M14+N11+N12+N13+N14"
        },
        {
          id: "A05-VAL002",
          seccion_expresion_1: "SECCI\xD3N H: INGRESOS AL PROGRAMA DE SALUD CARDIOVASCULAR (PSCV)",
          descripcion_expresion_1: "Ingresos al PSCV en ambos sexos",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A05",
          expresion_1: "C119",
          operador: "<=",
          expresion_2: "C120+C121+C122+C123+C124+C125+C126+C127",
          severidad: "ERROR",
          rem_sheet_2: "A05",
          seccion_expresion_2: "SECCI\xD3N H: INGRESOS AL PROGRAMA DE SALUD CARDIOVASCULAR (PSCV)",
          descripcion_expresion_2: "Desglose del Programa de Salud Cardiovascular (Hipertensi\xF3n Arterial, Diabetes Mellitus, etc)",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM05 | SECCI\xD3N H: INGRESOS AL PROGRAMA DE SALUD CARDIOVASCULAR (PSCV) | Ingresos al PSCV en ambos sexos | C119 <= REM05 | SECCI\xD3N H: INGRESOS AL PROGRAMA DE SALUD CARDIOVASCULAR (PSCV) | Desglose del Programa de Salud Cardiovascular (Hipertensi\xF3n Arterial, Diabetes Mellitus, etc) | C120+C121+C122+C123+C124+C125+C126+C127"
        },
        {
          id: "A05-VAL003",
          seccion_expresion_1: "SECCI\xD3N J: INGRESOS Y EGRESOS AL PROGRAMA DE PACIENTES CON DEPENDENCIA LEVE, MODERADA Y SEVERA",
          descripcion_expresion_1: "Ingreso por Dependencia Leve, Moderada,Severa, severa (lesiones por presi\xF3n) en edades entre 65 a\xF1os y 80 a\xF1os y m\xE1s",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A05",
          expresion_1: "AF146+AF147+AF148+AF149+AF150+AG146+AG147+AG148+AG149+AG150+AH146+AH147+AH148+AH149+AH150+AI146+AI147+AI148+AI149+AI150+AJ146+AJ147+AJ148+AJ149+AJ150+AK146+AK147+AK148+AK149+AK150+AL146+AL147+AL148+AL149+AL150+AM146+AM147+AM148+AM149+AM150",
          operador: ">=",
          expresion_2: "C162",
          severidad: "ERROR",
          rem_sheet_2: "A05",
          seccion_expresion_2: "SECCI\xD3N K: INGRESOS AL PROGRAMA DEL ADULTO MAYOR SEG\xDAN CONDICI\xD3N DE FUNCIONALIDAD Y DEPENDENCIA",
          descripcion_expresion_2: "Subtotal Barthel (Dependiente Leve, Dependiente Moderado, Dependiente Grave, Dependiente Total)",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM05 | SECCI\xD3N J: INGRESOS Y EGRESOS AL PROGRAMA DE PACIENTES CON DEPENDENCIA LEVE, MODERADA Y SEVERA | Ingreso por Dependencia Leve, Moderada,Severa, severa (lesiones por presi\xF3n) en edades entre 65 a\xF1os y 80 a\xF1os y m\xE1s | AF146+AF147+AF148+AF149+AF150+AG146+AG147+AG148+AG149+AG150+AH146+AH147+AH148+AH149+AH150+AI146+AI147+AI148+AI149+AI150+AJ146+AJ147+AJ148+AJ149+AJ150+AK146+AK147+AK148+AK149+AK150+AL146+AL147+AL148+AL149+AL150+AM146+AM147+AM148+AM149+AM150 >= REM05 | SECCI\xD3N K: INGRESOS AL PROGRAMA DEL ADULTO MAYOR SEG\xDAN CONDICI\xD3N DE FUNCIONALIDAD Y DEPENDENCIA | Subtotal Barthel (Dependiente Leve, Dependiente Moderado, Dependiente Grave, Dependiente Total) | C162"
        },
        {
          id: "A05-VAL004",
          seccion_expresion_1: "SECCI\xD3N N: INGRESOS AL PROGRAMA DE SALUD MENTAL EN APS/ESPECIALIDAD",
          descripcion_expresion_1: "Ingresos al programa salud mental",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A05",
          expresion_1: "C193",
          operador: "==",
          expresion_2: "C204",
          severidad: "REVISAR",
          rem_sheet_2: "A05",
          seccion_expresion_2: "SECCI\xD3N N: INGRESOS AL PROGRAMA DE SALUD MENTAL EN APS/ESPECIALIDAD",
          descripcion_expresion_2: "Personas que posee uno o m\xE1s trastornos Mentales",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM05 | SECCI\xD3N N: INGRESOS AL PROGRAMA DE SALUD MENTAL EN APS/ESPECIALIDAD | Ingresos al programa salud mental | C193 == REM05 | SECCI\xD3N N: INGRESOS AL PROGRAMA DE SALUD MENTAL EN APS/ESPECIALIDAD | Personas que posee uno o m\xE1s trastornos Mentales | C204"
        },
        {
          id: "A05-VAL005",
          seccion_expresion_1: "SECCI\xD3N N: INGRESOS AL PROGRAMA DE SALUD MENTAL EN APS/ESPECIALIDAD",
          descripcion_expresion_1: "Personas con Diagn\xF3stico Trastornos Mentales",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A05",
          expresion_1: "C204",
          operador: "<=",
          expresion_2: "C205+C206+C207+C208+C209+C210+C211+C212+C213+C214+C215+C216+C217+C218+C219+C220+C221+C222+C223+C224+C225+C226+C227+C228+C229+C230+C231+C232+C233+C234+C235+C236+C237+C238+C239+C240+C241",
          severidad: "ERROR",
          rem_sheet_2: "A05",
          seccion_expresion_2: "SECCI\xD3N N: INGRESOS AL PROGRAMA DE SALUD MENTAL EN APS/ESPECIALIDAD",
          descripcion_expresion_2: "Desglose de Diagn\xF3sticos de Trastornos Mentales",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM05 | SECCI\xD3N N: INGRESOS AL PROGRAMA DE SALUD MENTAL EN APS/ESPECIALIDAD | Personas con Diagn\xF3stico Trastornos Mentales | C204 <= REM05 | SECCI\xD3N N: INGRESOS AL PROGRAMA DE SALUD MENTAL EN APS/ESPECIALIDAD | Desglose de Diagn\xF3sticos de Trastornos Mentales | C205+C206+C207+C208+C209+C210+C211+C212+C213+C214+C215+C216+C217+C218+C219+C220+C221+C222+C223+C224+C225+C226+C227+C228+C229+C230+C231+C232+C233+C234+C235+C236+C237+C238+C239+C240+C241"
        },
        {
          id: "A05-VAL006",
          seccion_expresion_1: "SECCI\xD3N R: INGRESOS Y EGRESOS DEL PROGRAMA DE VIH/SIDA",
          descripcion_expresion_1: "Ingresos y Egresos al programa VIH/SIDA (Uso exclusivo Centros de Atenci\xF3n VIH-SIDA)",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A05",
          expresion_1: "C329+C330+C331+C332+C333+C334+C335+C336+C337+C338+C339+D329+D330+D331+D332+D333+D334+D335+D336+D337+D338+D339+E329+E330+E331+E332+E333+E334+E335+E336+E337+E338+E339",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A05",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "HBSJO",
          aplicar_a: [
            "123100"
          ],
          validacion_exclusiva: true,
          mensaje: "REVISAR | REM05 | SECCI\xD3N R: INGRESOS Y EGRESOS DEL PROGRAMA DE VIH/SIDA | Ingresos y Egresos al programa VIH/SIDA (Uso exclusivo Centros de Atenci\xF3n VIH-SIDA) | C329+C330+C331+C332+C333+C334+C335+C336+C337+C338+C339+D329+D330+D331+D332+D333+D334+D335+D336+D337+D338+D339+E329+E330+E331+E332+E333+E334+E335+E336+E337+E338+E339"
        },
        {
          id: "A05-VAL007",
          seccion_expresion_1: "SECCI\xD3N S: INGRESOS Y EGRESOS POR COMERCIO SEXUAL",
          descripcion_expresion_1: "Ingresos y Egresos al programa Comercio Sexual (Uso exclusivo de Unidades Control Comercio Sexual)",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A05",
          expresion_1: "C344+C345+C346+D344+D345+D346+E344+E345+E346",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A05",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "HBSJO",
          aplicar_a: [
            "123100"
          ],
          validacion_exclusiva: true,
          mensaje: "REVISAR | REM05 | SECCI\xD3N S: INGRESOS Y EGRESOS POR COMERCIO SEXUAL | Ingresos y Egresos al programa Comercio Sexual (Uso exclusivo de Unidades Control Comercio Sexual) | C344+C345+C346+D344+D345+D346+E344+E345+E346"
        }
      ],
      A08: [
        {
          id: "A08-VAL001",
          seccion_expresion_1: "SECCI\xD3N A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA",
          descripcion_expresion_1: "Atenciones en UEH de Alta Complejidad corresponde solo a HOSPITAL BASE SAN JOSE OSORNO y HOSPITAL PURRANQUE",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A08",
          expresion_1: "E12+E13+E14+E15+F12+F13+F14+F15+G12+G13+G14+G15+H12+H13+H14+H15+I12+I13+I14+I15+J12+J13+J14+J15+K12+K13+K14+K15+L12+L13+L14+L15+M12+M13+M14+M15+N12+N13+N14+N15+O12+O13+O14+O15+P12+P13+P14+P15+Q12+Q13+Q14+Q15+R12+R13+R14+R15+S12+S13+S14+S15+T12+T13+T14+T15+U12+U13+U14+U15+V12+V13+V14+V15+W12+W13+W14+W15+X12+X13+X14+X15+Y12+Y13+Y14+Y15+Z12+Z13+Z14+Z15+AA12+AA13+AA14+AA15+AB12+AB13+AB14+AB15+AC12+AC13+AC14+AC15+AD12+AD13+AD14+AD15+AE12+AE13+AE14+AE15+AF12+AF13+AF14+AF15+AG12+AG13+AG14+AG15+AH12+AH13+AH14+AH15+AI12+AI13+AI14+AI15+AJ12+AJ13+AJ14+AJ15+AK12+AK13+AK14+AK15+AL12+AL13+AL14+AL15",
          operador: "==",
          expresion_2: 0,
          severidad: "ERROR",
          rem_sheet_2: "A08",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "HBSJO, HPU",
          aplicar_a: [
            "123100",
            "123101"
          ],
          validacion_exclusiva: true,
          mensaje: "ERROR | REM08 | SECCI\xD3N A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA | Atenciones en UEH de Alta Complejidad corresponde solo a HOSPITAL BASE SAN JOSE OSORNO y HOSPITAL PURRANQUE | E12+E13+E14+E15+F12+F13+F14+F15+G12+G13+G14+G15+H12+H13+H14+H15+I12+I13+I14+I15+J12+J13+J14+J15+K12+K13+K14+K15+L12+L13+L14+L15+M12+M13+M14+M15+N12+N13+N14+N15+O12+O13+O14+O15+P12+P13+P14+P15+Q12+Q13+Q14+Q15+R12+R13+R14+R15+S12+S13+S14+S15+T12+T13+T14+T15+U12+U13+U14+U15+V12+V13+V14+V15+W12+W13+W14+W15+X12+X13+X14+X15+Y12+Y13+Y14+Y15+Z12+Z13+Z14+Z15+AA12+AA13+AA14+AA15+AB12+AB13+AB14+AB15+AC12+AC13+AC14+AC15+AD12+AD13+AD14+AD15+AE12+AE13+AE14+AE15+AF12+AF13+AF14+AF15+AG12+AG13+AG14+AG15+AH12+AH13+AH14+AH15+AI12+AI13+AI14+AI15+AJ12+AJ13+AJ14+AJ15+AK12+AK13+AK14+AK15+AL12+AL13+AL14+AL15"
        },
        {
          id: "A08-VAL002",
          seccion_expresion_1: "SECCI\xD3N B: CATEGORIZACI\xD3N DE PACIENTES, PREVIA A LA ATENCI\xD3N M\xC9DICA U ODONTOL\xD3GICA",
          descripcion_expresion_1: "Categoriaziones C1,C2,C3,C4,C5 Corresponde solo a Establecimientos Alta, Mediana, Baja Complejidad, SAPU, SAR, SUR",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A08",
          expresion_1: "C61+C62+C63+C64+C65+C66+D61+D62+D63+D64+D65+D66+E61+E62+E63+E64+E65+E66+F61+F62+F63+F64+F65+F66+G61+G62+G63+G64+G65+G66+H61+H62+H63+H64+H65+H66+I61+I62+I63+I64+I65+I66+J61+J62+J63+J64+J65+J66+K61+K62+K63+K64+K65+K66+L61+L62+L63+L64+L65+L66+M61+M62+M63+M64+M65+M66+N61+N62+N63+N64+N65+N66+O61+O62+O63+O64+O65+O66+P61+P62+P63+P64+P65+P66+Q61+Q62+Q63+Q64+Q65+Q66+R61+R62+R63+R64+R65+R66+S61+S62+S63+S64+S65+S66+T61+T62+T63+T64+T65+T66+U61+U62+U63+U64+U65+U66+V61+V62+V63+V64+V65+V66+W61+W62+W63+W64+W65+W66+X61+X62+X63+X64+X65+X66+Y61+Y62+Y63+Y64+Y65+Y66+Z61+Z62+Z63+Z64+Z65+Z66+AA61+AA62+AA63+AA64+AA65+AA66+AB61+AB62+AB63+AB64+AB65+AB66+AC61+AC62+AC63+AC64+AC65+AC66+AD61+AD62+AD63+AD64+AD65+AD66+AE61+AE62+AE63+AE64+AE65+AE66+AF61+AF62+AF63+AF64+AF65+AF66+AG61+AG62+AG63+AG64+AG65+AG66+AH61+AH62+AH63+AH64+AH65+AH66+AI61+AI62+AI63+AI64+AI65+AI66+AJ61+AJ62+AJ63+AJ64+AJ65+AJ66+AK61+AK62+AK63+AK64+AK65+AK66+AL61+AL62+AL63+AL64+AL65+AL66",
          operador: "==",
          expresion_2: 0,
          severidad: "ERROR",
          rem_sheet_2: "A08",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "HOSPITALES, SAPU, SUR",
          aplicar_a: [
            "123030",
            "123100",
            "123101",
            "123102",
            "123103",
            "123104",
            "123105",
            "123800",
            "123801",
            "200085",
            "200747",
            "200748",
            "200749",
            "200750"
          ],
          validacion_exclusiva: true,
          mensaje: "ERROR | REM08 | SECCI\xD3N B: CATEGORIZACI\xD3N DE PACIENTES, PREVIA A LA ATENCI\xD3N M\xC9DICA U ODONTOL\xD3GICA | Categoriaziones C1,C2,C3,C4,C5 Corresponde solo a Establecimientos Alta, Mediana, Baja Complejidad, SAPU, SAR, SUR | C61+C62+C63+C64+C65+C66+D61+D62+D63+D64+D65+D66+E61+E62+E63+E64+E65+E66+F61+F62+F63+F64+F65+F66+G61+G62+G63+G64+G65+G66+H61+H62+H63+H64+H65+H66+I61+I62+I63+I64+I65+I66+J61+J62+J63+J64+J65+J66+K61+K62+K63+K64+K65+K66+L61+L62+L63+L64+L65+L66+M61+M62+M63+M64+M65+M66+N61+N62+N63+N64+N65+N66+O61+O62+O63+O64+O65+O66+P61+P62+P63+P64+P65+P66+Q61+Q62+Q63+Q64+Q65+Q66+R61+R62+R63+R64+R65+R66+S61+S62+S63+S64+S65+S66+T61+T62+T63+T64+T65+T66+U61+U62+U63+U64+U65+U66+V61+V62+V63+V64+V65+V66+W61+W62+W63+W64+W65+W66+X61+X62+X63+X64+X65+X66+Y61+Y62+Y63+Y64+Y65+Y66+Z61+Z62+Z63+Z64+Z65+Z66+AA61+AA62+AA63+AA64+AA65+AA66+AB61+AB62+AB63+AB64+AB65+AB66+AC61+AC62+AC63+AC64+AC65+AC66+AD61+AD62+AD63+AD64+AD65+AD66+AE61+AE62+AE63+AE64+AE65+AE66+AF61+AF62+AF63+AF64+AF65+AF66+AG61+AG62+AG63+AG64+AG65+AG66+AH61+AH62+AH63+AH64+AH65+AH66+AI61+AI62+AI63+AI64+AI65+AI66+AJ61+AJ62+AJ63+AJ64+AJ65+AJ66+AK61+AK62+AK63+AK64+AK65+AK66+AL61+AL62+AL63+AL64+AL65+AL66"
        },
        {
          id: "A08-VAL003",
          seccion_expresion_1: "SECCI\xD3N A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA",
          descripcion_expresion_1: "Atenci\xF3n M\xE9dica Ni\xF1o y Adulto Ambos Sexos",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A08",
          expresion_1: "B12",
          operador: "==",
          expresion_2: "B67",
          severidad: "ERROR",
          rem_sheet_2: "A08",
          seccion_expresion_2: "SECCI\xD3N B: CATEGORIZACI\xD3N DE PACIENTES, PREVIA A LA ATENCI\xD3N M\xC9DICA U ODONTOL\xD3GICA",
          descripcion_expresion_2: "Total de Categorizaciones pacientes (C1-C2-C3-C4-C5)",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM08 | SECCI\xD3N A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA | Atenci\xF3n M\xE9dica Ni\xF1o y Adulto Ambos Sexos | B12 == REM08 | SECCI\xD3N B: CATEGORIZACI\xD3N DE PACIENTES, PREVIA A LA ATENCI\xD3N M\xC9DICA U ODONTOL\xD3GICA | Total de Categorizaciones pacientes (C1-C2-C3-C4-C5) | B67"
        },
        {
          id: "A08-VAL004",
          seccion_expresion_1: "SECCI\xD3N A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA",
          descripcion_expresion_1: "Atenci\xF3n M\xE9dica Gineco-Obstetra /Matrona/\xF3n Ambos Sexos",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A08",
          expresion_1: "B13+B14",
          operador: "==",
          expresion_2: "B78",
          severidad: "ERROR",
          rem_sheet_2: "A08",
          seccion_expresion_2: "SECCI\xD3N B.1: CATEGORIZACI\xD3N DE PACIENTES DE URGENCIA GINECO OBST\xC9TRICA PREVIO A LA ATENCI\xD3N CL\xCDNICA POR MATR\xD3N (A) Y/O M\xC9DICO GINECO-OBSTETRA",
          descripcion_expresion_2: "Categorizaciones de Pacientes Obst\xE9trica C1-C2-C3-C4-C5)",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM08 | SECCI\xD3N A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA | Atenci\xF3n M\xE9dica Gineco-Obstetra /Matrona/\xF3n Ambos Sexos | B13+B14 == REM08 | SECCI\xD3N B.1: CATEGORIZACI\xD3N DE PACIENTES DE URGENCIA GINECO OBST\xC9TRICA PREVIO A LA ATENCI\xD3N CL\xCDNICA POR MATR\xD3N (A) Y/O M\xC9DICO GINECO-OBSTETRA | Categorizaciones de Pacientes Obst\xE9trica C1-C2-C3-C4-C5) | B78"
        },
        {
          id: "A08-VAL005",
          seccion_expresion_1: "SECCI\xD3N A.3: ATENCIONES DE URGENCIA REALIZADAS EN ESTABLECIMIENTOS DE BAJA COMPLEJIDAD",
          descripcion_expresion_1: "Atenci\xF3n M\xE9dica Ambos Sexos",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A08",
          expresion_1: "B31",
          operador: "==",
          expresion_2: "B67",
          severidad: "ERROR",
          rem_sheet_2: "A08",
          seccion_expresion_2: "SECCI\xD3N B: CATEGORIZACI\xD3N DE PACIENTES, PREVIA A LA ATENCI\xD3N M\xC9DICA U ODONTOL\xD3GICA",
          descripcion_expresion_2: "Total de Categorizaciones pacientes (C1-C2-C3-C4-C5)",
          aplica_origen: "HQUI,HMSJ,HRN,HPO,SAPU,SUR",
          aplicar_a: [
            "123105",
            "123104",
            "123102",
            "123103",
            "123800",
            "123801",
            "200085",
            "200747",
            "200748",
            "200749",
            "200750"
          ],
          mensaje: "ERROR | REM08 | SECCI\xD3N A.3: ATENCIONES DE URGENCIA REALIZADAS EN ESTABLECIMIENTOS DE BAJA COMPLEJIDAD | Atenci\xF3n M\xE9dica Ambos Sexos | B31 == REM08 | SECCI\xD3N B: CATEGORIZACI\xD3N DE PACIENTES, PREVIA A LA ATENCI\xD3N M\xC9DICA U ODONTOL\xD3GICA | Total de Categorizaciones pacientes (C1-C2-C3-C4-C5) | B67"
        },
        {
          id: "A08-VAL006",
          seccion_expresion_1: "SECCI\xD3N A.3: ATENCIONES DE URGENCIA REALIZADAS EN ESTABLECIMIENTOS DE BAJA COMPLEJIDAD",
          descripcion_expresion_1: "Atenciones UEH Baja Complejidad corresponde solo a Hospitales de Baja Complejidad, SUR y SAPU",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A08",
          expresion_1: "E31+E32+E33+E34+E35+E36+F31+F32+F33+F34+F35+F36+G31+G32+G33+G34+G35+G36+H31+H32+H33+H34+H35+H36+I31+I32+I33+I34+I35+I36+J31+J32+J33+J34+J35+J36+K31+K32+K33+K34+K35+K36+L31+L32+L33+L34+L35+L36+M31+M32+M33+M34+M35+M36+N31+N32+N33+N34+N35+N36+O31+O32+O33+O34+O35+O36+P31+P32+P33+P34+P35+P36+Q31+Q32+Q33+Q34+Q35+Q36+R31+R32+R33+R34+R35+R36+S31+S32+S33+S34+S35+S36+T31+T32+T33+T34+T35+T36+U31+U32+U33+U34+U35+U36+V31+V32+V33+V34+V35+V36+W31+W32+W33+W34+W35+W36+X31+X32+X33+X34+X35+X36+Y31+Y32+Y33+Y34+Y35+Y36+Z31+Z32+Z33+Z34+Z35+Z36+AA31+AA32+AA33+AA34+AA35+AA36+AB31+AB32+AB33+AB34+AB35+AB36+AC31+AC32+AC33+AC34+AC35+AC36+AD31+AD32+AD33+AD34+AD35+AD36+AE31+AE32+AE33+AE34+AE35+AE36+AF31+AF32+AF33+AF34+AF35+AF36+AG31+AG32+AG33+AG34+AG35+AG36+AH31+AH32+AH33+AH34+AH35+AH36+AI31+AI32+AI33+AI34+AI35+AI36+AJ31+AJ32+AJ33+AJ34+AJ35+AJ36+AK31+AK32+AK33+AK34+AK35+AK36+AL31+AL32+AL33+AL34+AL35+AL36",
          operador: "==",
          expresion_2: 0,
          severidad: "ERROR",
          rem_sheet_2: "A08",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "HQUI,HMSJ,HRN,HPO,SAPU,SUR",
          aplicar_a: [
            "123105",
            "123104",
            "123102",
            "123103",
            "123800",
            "123801",
            "200085",
            "200747",
            "200748",
            "200749",
            "200750"
          ],
          validacion_exclusiva: true,
          mensaje: "ERROR | REM08 | SECCI\xD3N A.3: ATENCIONES DE URGENCIA REALIZADAS EN ESTABLECIMIENTOS DE BAJA COMPLEJIDAD | Atenciones UEH Baja Complejidad corresponde solo a Hospitales de Baja Complejidad, SUR y SAPU | E31+E32+E33+E34+E35+E36+F31+F32+F33+F34+F35+F36+G31+G32+G33+G34+G35+G36+H31+H32+H33+H34+H35+H36+I31+I32+I33+I34+I35+I36+J31+J32+J33+J34+J35+J36+K31+K32+K33+K34+K35+K36+L31+L32+L33+L34+L35+L36+M31+M32+M33+M34+M35+M36+N31+N32+N33+N34+N35+N36+O31+O32+O33+O34+O35+O36+P31+P32+P33+P34+P35+P36+Q31+Q32+Q33+Q34+Q35+Q36+R31+R32+R33+R34+R35+R36+S31+S32+S33+S34+S35+S36+T31+T32+T33+T34+T35+T36+U31+U32+U33+U34+U35+U36+V31+V32+V33+V34+V35+V36+W31+W32+W33+W34+W35+W36+X31+X32+X33+X34+X35+X36+Y31+Y32+Y33+Y34+Y35+Y36+Z31+Z32+Z33+Z34+Z35+Z36+AA31+AA32+AA33+AA34+AA35+AA36+AB31+AB32+AB33+AB34+AB35+AB36+AC31+AC32+AC33+AC34+AC35+AC36+AD31+AD32+AD33+AD34+AD35+AD36+AE31+AE32+AE33+AE34+AE35+AE36+AF31+AF32+AF33+AF34+AF35+AF36+AG31+AG32+AG33+AG34+AG35+AG36+AH31+AH32+AH33+AH34+AH35+AH36+AI31+AI32+AI33+AI34+AI35+AI36+AJ31+AJ32+AJ33+AJ34+AJ35+AJ36+AK31+AK32+AK33+AK34+AK35+AK36+AL31+AL32+AL33+AL34+AL35+AL36"
        },
        {
          id: "A08-VAL007",
          seccion_expresion_1: "SECCI\xD3N B.1: CATEGORIZACI\xD3N DE PACIENTES DE URGENCIA GINECO OBST\xC9TRICA PREVIO A LA ATENCI\xD3N CL\xCDNICA POR MATR\xD3N (A) Y/O M\xC9DICO GINECO-OBSTETRA",
          descripcion_expresion_1: "Categoriaziones C1,C2,C3,C4,C5 Corresponde solo a Hospitales de Baja Complejidad, SUR y SAPU",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A08",
          expresion_1: "B78",
          operador: "==",
          expresion_2: 0,
          severidad: "ERROR",
          rem_sheet_2: "A08",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "HQUI,HMSJ,HRN,HPO,SAPU,SUR",
          aplicar_a: [
            "123105",
            "123104",
            "123102",
            "123103",
            "123800",
            "123801",
            "200085",
            "200747",
            "200748",
            "200749",
            "200750"
          ],
          validacion_exclusiva: true,
          mensaje: "ERROR | REM08 | SECCI\xD3N B.1: CATEGORIZACI\xD3N DE PACIENTES DE URGENCIA GINECO OBST\xC9TRICA PREVIO A LA ATENCI\xD3N CL\xCDNICA POR MATR\xD3N (A) Y/O M\xC9DICO GINECO-OBSTETRA | Categoriaziones C1,C2,C3,C4,C5 Corresponde solo a Hospitales de Baja Complejidad, SUR y SAPU | B78"
        },
        {
          id: "A08-VAL008",
          seccion_expresion_1: "SECCI\xD3N L: TRASLADOS PRIMARIOS A UNIDADES DE URGENCIA",
          descripcion_expresion_1: "Traslados SAMU (B\xE1sico-Avanzado",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A08",
          expresion_1: "C169+C170+D169+D170+E169+E170+F169+F170",
          operador: "==",
          expresion_2: 0,
          severidad: "ERROR",
          rem_sheet_2: "A08",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "SAMU",
          aplicar_a: [
            "123012"
          ],
          validacion_exclusiva: true,
          mensaje: "ERROR | REM08 | SECCI\xD3N L: TRASLADOS PRIMARIOS A UNIDADES DE URGENCIA | Traslados SAMU (B\xE1sico-Avanzado | C169+C170+D169+D170+E169+E170+F169+F170"
        },
        {
          id: "A08-VAL009",
          seccion_expresion_1: "SECCI\xD3N L: TRASLADOS PRIMARIOS A UNIDADES DE URGENCIA",
          descripcion_expresion_1: "Traslados (Enrutado,Basicos) corresponde solo a los siguientes establecimientos",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A08",
          expresion_1: "C171+D171+E171+F171",
          operador: "==",
          expresion_2: 0,
          severidad: "ERROR",
          rem_sheet_2: "A08",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "HRN-HPU-HMSJ-HQUI-CESFAM BAHIA MANSA-SAPU ENTRE LAGOS-SUR PUAUCHO- SUR BAHIA MANSA- SUR SANPABLO",
          aplicar_a: [
            "123102",
            "123101",
            "123104",
            "123105",
            "123311",
            "200747",
            "200750",
            "200749",
            "200748"
          ],
          validacion_exclusiva: true,
          mensaje: "ERROR | REM08 | SECCI\xD3N L: TRASLADOS PRIMARIOS A UNIDADES DE URGENCIA | Traslados (Enrutado,Basicos) corresponde solo a los siguientes establecimientos | C171+D171+E171+F171"
        },
        {
          id: "A08-VAL010",
          seccion_expresion_1: "SECCI\xD3N L: TRASLADOS PRIMARIOS A UNIDADES DE URGENCIA",
          descripcion_expresion_1: "Traslados No SAMU (Terrestre - Mar\xEDtimo - A\xE9reo)",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A08",
          expresion_1: "C172+C173+C174+D172+D173+D174+E172+E173+E174+F172+F173+F174",
          operador: "==",
          expresion_2: 0,
          severidad: "ERROR",
          rem_sheet_2: "A08",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM08 | SECCI\xD3N L: TRASLADOS PRIMARIOS A UNIDADES DE URGENCIA | Traslados No SAMU (Terrestre - Mar\xEDtimo - A\xE9reo) | C172+C173+C174+D172+D173+D174+E172+E173+E174+F172+F173+F174"
        },
        {
          id: "A08-VAL011",
          seccion_expresion_1: "SECCI\xD3N M: TRASLADO SECUNDARIO",
          descripcion_expresion_1: "Traslados Cr\xEDtico y No Cr\xEDtico (Terrestre - Mar\xEDtimo - A\xE9reo) que cuenten con Ambulancia excepto SAMU",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A08",
          expresion_1: "E178+E179+E180+E181+E182+E183",
          operador: "==",
          expresion_2: 0,
          severidad: "ERROR",
          rem_sheet_2: "A08",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS EXCEPTO SAMU",
          aplicar_a: [
            "123012"
          ],
          mensaje: "ERROR | REM08 | SECCI\xD3N M: TRASLADO SECUNDARIO | Traslados Cr\xEDtico y No Cr\xEDtico (Terrestre - Mar\xEDtimo - A\xE9reo) que cuenten con Ambulancia excepto SAMU | E178+E179+E180+E181+E182+E183"
        },
        {
          id: "A08-VAL012",
          seccion_expresion_1: "SECCI\xD3N J: LLAMADOS DE URGENCIA A CENTRO REGULADOR, CENTRO DE DESPACHO O CENTRO COORDINADOR",
          descripcion_expresion_1: "NO DEBE EXISTIR REGISTRO EN Centro Regulador, Centro de Despacho \xF3 Centro Coordinador",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A08",
          expresion_1: "C161+D161",
          operador: "==",
          expresion_2: 0,
          severidad: "ERROR",
          rem_sheet_2: "A08",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM08 | SECCI\xD3N J: LLAMADOS DE URGENCIA A CENTRO REGULADOR, CENTRO DE DESPACHO O CENTRO COORDINADOR | NO DEBE EXISTIR REGISTRO EN Centro Regulador, Centro de Despacho \xF3 Centro Coordinador | C161+D161"
        },
        {
          id: "A08-VAL013",
          seccion_expresion_1: "SECCI\xD3N A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA",
          descripcion_expresion_1: "Atenci\xF3n M\xE9dica Ni\xF1o y Adulto Ambos Sexos debe existir consistencia con",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A08",
          expresion_1: "B12",
          operador: ">=",
          expresion_2: "AS12",
          severidad: "ERROR",
          rem_sheet_2: "A08",
          seccion_expresion_2: "SECCI\xD3N A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA",
          descripcion_expresion_2: "Demanda de Urgencia",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM08 | SECCI\xD3N A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA | Atenci\xF3n M\xE9dica Ni\xF1o y Adulto Ambos Sexos debe existir consistencia con | B12 >= REM08 | SECCI\xD3N A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA | Demanda de Urgencia | AS12"
        },
        {
          id: "A08-VAL014",
          seccion_expresion_1: "SECCI\xD3N A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA",
          descripcion_expresion_1: "Atenci\xF3n M\xE9dica Gineco-Obstetra Ambos Sexos debe existir consistencia con",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A08",
          expresion_1: "B13",
          operador: ">=",
          expresion_2: "AS13",
          severidad: "ERROR",
          rem_sheet_2: "A08",
          seccion_expresion_2: "SECCI\xD3N A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA",
          descripcion_expresion_2: "Demanda de Urgencia",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM08 | SECCI\xD3N A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA | Atenci\xF3n M\xE9dica Gineco-Obstetra Ambos Sexos debe existir consistencia con | B13 >= REM08 | SECCI\xD3N A.1: ATENCIONES REALIZADAS EN UNIDADES DE EMERGENCIA HOSPITALARIA | Demanda de Urgencia | AS13"
        }
      ],
      A11: [
        {
          id: "A11-VAL001",
          seccion_expresion_1: "SECCI\xD3N A.1: EXAMEN VDRL POR GRUPO DE USUARIOS",
          descripcion_expresion_1: "Esta secci\xF3n solo le corresponde a HBSJO",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A11",
          expresion_1: "B13+B14+B15+B16+B17+B18+B19+B20+B21+B22+B23+B24+B25+B26+B27+B28+B29+B30+C13+C14+C15+C16+C17+C18+C19+C20+C21+C22+C23+C24+C25+C26+C27+C28+C29+C30",
          operador: "==",
          expresion_2: 0,
          severidad: "ERROR",
          rem_sheet_2: "A11",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "HBSJO",
          aplicar_a: [
            "123100"
          ],
          validacion_exclusiva: true,
          mensaje: "ERROR | REM11 | SECCI\xD3N A.1: EXAMEN VDRL POR GRUPO DE USUARIOS | Esta secci\xF3n solo le corresponde a HBSJO | B13+B14+B15+B16+B17+B18+B19+B20+B21+B22+B23+B24+B25+B26+B27+B28+B29+B30+C13+C14+C15+C16+C17+C18+C19+C20+C21+C22+C23+C24+C25+C26+C27+C28+C29+C30"
        },
        {
          id: "A11-VAL002",
          seccion_expresion_1: "SECCI\xD3N B.1: EX\xC1MENES SEG\xDAN GRUPOS DE USUARIOS POR CONDICI\xD3N DE HEPATITIS B, HEPATITIS C, CHAGAS, HTLV 1 Y SIFILIS",
          descripcion_expresion_1: "Uso Exclusivo Laboratorio que Procesan, le corresponde solo a HBSJO",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A11",
          expresion_1: "C144+C145+C146+C147+C148+D144+D145+D146+D147+D148+E144+E145+E146+E147+E148+F144+F145+F146+F147+F148+G144+G145+G146+G147+G148+H144+H145+H146+H147+H148+I144+I145+I146+I147+I148+J144+J145+J146+J147+J148+K144+K145+K146+K147+K148+L144+L145+L146+L147+L148+M144+M145+M146+M147+M148+N144+N145+N146+N147+N148+O144+O145+O146+O147+O148+P144+P145+P146+P147+P148",
          operador: "==",
          expresion_2: 0,
          severidad: "ERROR",
          rem_sheet_2: "A11",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "HBSJO",
          aplicar_a: [
            "123100"
          ],
          validacion_exclusiva: true,
          mensaje: "ERROR | REM11 | SECCI\xD3N B.1: EX\xC1MENES SEG\xDAN GRUPOS DE USUARIOS POR CONDICI\xD3N DE HEPATITIS B, HEPATITIS C, CHAGAS, HTLV 1 Y SIFILIS | Uso Exclusivo Laboratorio que Procesan, le corresponde solo a HBSJO | C144+C145+C146+C147+C148+D144+D145+D146+D147+D148+E144+E145+E146+E147+E148+F144+F145+F146+F147+F148+G144+G145+G146+G147+G148+H144+H145+H146+H147+H148+I144+I145+I146+I147+I148+J144+J145+J146+J147+J148+K144+K145+K146+K147+K148+L144+L145+L146+L147+L148+M144+M145+M146+M147+M148+N144+N145+N146+N147+N148+O144+O145+O146+O147+O148+P144+P145+P146+P147+P148"
        },
        {
          id: "A11-VAL003",
          seccion_expresion_1: "SECCI\xD3N B.2: EX\xC1MENES SEG\xDAN GRUPOS DE USUARIOS POR CONDICI\xD3N DE HEPATITIS B, HEPATITIS C, CHAGAS, HTLV 1 Y SIFILIS",
          descripcion_expresion_1: "Uso Exclusivo Compra Servicio, le corresponde solo a HBSJO",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A11",
          expresion_1: "C152+C153+C154+C155+C156+D152+D153+D154+D155+D156+E152+E153+E154+E155+E156+F152+F153+F154+F155+F156+G152+G153+G154+G155+G156+H152+H153+H154+H155+H156+I152+I153+I154+I155+I156+J152+J153+J154+J155+J156+K152+K153+K154+K155+K156+L152+L153+L154+L155+L156+M152+M153+M154+M155+M156+N152+N153+N154+N155+N156+O152+O153+O154+O155+O156+P152+P153+P154+P155+P156",
          operador: "==",
          expresion_2: 0,
          severidad: "ERROR",
          rem_sheet_2: "A11",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "HBSJO",
          aplicar_a: [
            "123100"
          ],
          validacion_exclusiva: true,
          mensaje: "ERROR | REM11 | SECCI\xD3N B.2: EX\xC1MENES SEG\xDAN GRUPOS DE USUARIOS POR CONDICI\xD3N DE HEPATITIS B, HEPATITIS C, CHAGAS, HTLV 1 Y SIFILIS | Uso Exclusivo Compra Servicio, le corresponde solo a HBSJO | C152+C153+C154+C155+C156+D152+D153+D154+D155+D156+E152+E153+E154+E155+E156+F152+F153+F154+F155+F156+G152+G153+G154+G155+G156+H152+H153+H154+H155+H156+I152+I153+I154+I155+I156+J152+J153+J154+J155+J156+K152+K153+K154+K155+K156+L152+L153+L154+L155+L156+M152+M153+M154+M155+M156+N152+N153+N154+N155+N156+O152+O153+O154+O155+O156+P152+P153+P154+P155+P156"
        },
        {
          id: "A11-VAL004",
          seccion_expresion_1: "SECCI\xD3N C.1: EX\xC1MENES DE VIH POR GRUPOS DE USUARIOS",
          descripcion_expresion_1: "Esta secci\xF3n solo le corresponde a HBSJO",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A11",
          expresion_1: "C161+C162+C163+C164+C165+C166+C167+C168+C169+C170+C171+C172+C173+C174+C175+C176+C177+C178+C179+C180+C181+C182+C183+D161+D162+D163+D164+D165+D166+D167+D168+D169+D170+D171+D172+D173+D174+D175+D176+D177+D178+D179+D180+D181+D182+D183",
          operador: "==",
          expresion_2: 0,
          severidad: "ERROR",
          rem_sheet_2: "A11",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "HBSJO",
          aplicar_a: [
            "123100"
          ],
          validacion_exclusiva: true,
          mensaje: "ERROR | REM11 | SECCI\xD3N C.1: EX\xC1MENES DE VIH POR GRUPOS DE USUARIOS | Esta secci\xF3n solo le corresponde a HBSJO | C161+C162+C163+C164+C165+C166+C167+C168+C169+C170+C171+C172+C173+C174+C175+C176+C177+C178+C179+C180+C181+C182+C183+D161+D162+D163+D164+D165+D166+D167+D168+D169+D170+D171+D172+D173+D174+D175+D176+D177+D178+D179+D180+D181+D182+D183"
        }
      ],
      A19a: [
        {
          id: "A19a-VAL001",
          seccion_expresion_1: "SECCI\xD3N B.1: ACTIVIDADES DE PROMOCI\xD3N SEG\xDAN ESTRATEGIAS Y CONDICIONANTES ABORDADAS Y N\xDAMERO DE PARTICIPANTES",
          descripcion_expresion_1: "Si existen registros TOTAL ACTIVIDADES (Eventos masivos - Reuniones de planificaci\xF3n participativa - Jornadas y seminarios - Educaci\xF3n grupal )",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A19a",
          expresion_1: "C129+C130+C131+C132+C133+C134+C135+C136+C137+C138+C139+C140+C141+C142+C143+C144+C145+C146+C147+C148",
          operador: "<=",
          expresion_2: "O129+O130+O131+O132+O133+O134+O135+O136+O137+O138+O139+O140+O141+O142+O143+O144+O145+O146+O147+O148",
          severidad: "ERROR",
          rem_sheet_2: "A19a",
          seccion_expresion_2: "SECCI\xD3N B.1: ACTIVIDADES DE PROMOCI\xD3N SEG\xDAN ESTRATEGIAS Y CONDICIONANTES ABORDADAS Y N\xDAMERO DE PARTICIPANTES",
          descripcion_expresion_2: "Total Participantes",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM19 | SECCI\xD3N B.1: ACTIVIDADES DE PROMOCI\xD3N SEG\xDAN ESTRATEGIAS Y CONDICIONANTES ABORDADAS Y N\xDAMERO DE PARTICIPANTES | Si existen registros TOTAL ACTIVIDADES (Eventos masivos - Reuniones de planificaci\xF3n participativa - Jornadas y seminarios - Educaci\xF3n grupal ) | C129+C130+C131+C132+C133+C134+C135+C136+C137+C138+C139+C140+C141+C142+C143+C144+C145+C146+C147+C148 <= REM19 | SECCI\xD3N B.1: ACTIVIDADES DE PROMOCI\xD3N SEG\xDAN ESTRATEGIAS Y CONDICIONANTES ABORDADAS Y N\xDAMERO DE PARTICIPANTES | Total Participantes | O129+O130+O131+O132+O133+O134+O135+O136+O137+O138+O139+O140+O141+O142+O143+O144+O145+O146+O147+O148"
        }
      ],
      A19b: [
        {
          id: "A19b-VAL001",
          seccion_expresion_1: "SECCI\xD3N A: ATENCI\xD3N OFICINAS DE INFORMACIONES",
          descripcion_expresion_1: "Total de Reclamos",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A19b",
          expresion_1: "B11",
          operador: ">=",
          expresion_2: "E11+F11+G11+H11+I11",
          severidad: "REVISAR",
          rem_sheet_2: "A19b",
          seccion_expresion_2: "SECCI\xD3N A: ATENCI\xD3N OFICINAS DE INFORMACIONES (SISTEMA INTEGRAL DE ATENCI\xD3N A USUARIOS)",
          descripcion_expresion_2: "Respuestas a reclamos (dentro/fuera de plazos o pendientes)",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM19 | SECCI\xD3N A: ATENCI\xD3N OFICINAS DE INFORMACIONES | Total de Reclamos | B11 >= REM19 | SECCI\xD3N A: ATENCI\xD3N OFICINAS DE INFORMACIONES (SISTEMA INTEGRAL DE ATENCI\xD3N A USUARIOS) | Respuestas a reclamos (dentro/fuera de plazos o pendientes) | E11+F11+G11+H11+I11"
        }
      ],
      A21: [
        {
          id: "A21-VAL001",
          seccion_expresion_1: "SECCI\xD3N C.1.1: PERSONAS ATENDIDAS EN EL PROGRAMA",
          descripcion_expresion_1: "Ingresos Total",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A21",
          expresion_1: "C31",
          operador: "==",
          expresion_2: "C32",
          severidad: "REVISAR",
          rem_sheet_2: "A21",
          seccion_expresion_2: "SECCI\xD3N C.1.1: PERSONAS ATENDIDAS EN EL PROGRAMA",
          descripcion_expresion_2: "Total Personas Atendidas",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM21 | SECCI\xD3N C.1.1: PERSONAS ATENDIDAS EN EL PROGRAMA | Ingresos Total | C31 == REM21 | SECCI\xD3N C.1.1: PERSONAS ATENDIDAS EN EL PROGRAMA | Total Personas Atendidas | C32"
        }
      ],
      A27: [
        {
          id: "A27-VAL001",
          seccion_expresion_1: "SECCI\xD3N A: PERSONAS QUE INGRESAN A EDUCACI\xD3N GRUPAL SEG\xDAN \xC1REAS TEM\xC1TICAS Y EDAD",
          descripcion_expresion_1: "Total Personas que ingresan Educaci\xF3n en grupo si existe registro debe",
          tipo: "CONDICIONAL",
          tipo_validacion: "DOBLE",
          rem_sheet: "A27",
          expresion_1: "D53",
          operador: ">",
          expresion_2: "D98",
          severidad: "REVISAR",
          rem_sheet_2: "A27",
          seccion_expresion_2: "SECCI\xD3N B: ACTIVIDADES DE EDUCACI\xD3N PARA LA SALUD SEG\xDAN PERSONAL QUE LAS REALIZA (SESIONES)",
          descripcion_expresion_2: "Total de Educaci\xF3n en grupo",
          aplica_origen: "TODOS",
          condicion_previa: {
            expresion: "D53",
            operador: ">",
            valor: 0
          },
          omitir_si_condicion_no_cumple: true,
          mensaje: "REVISAR | REM27 | SECCI\xD3N A: PERSONAS QUE INGRESAN A EDUCACI\xD3N GRUPAL SEG\xDAN \xC1REAS TEM\xC1TICAS Y EDAD | Total Personas que ingresan Educaci\xF3n en grupo si existe registro debe | D53 > REM27 | SECCI\xD3N B: ACTIVIDADES DE EDUCACI\xD3N PARA LA SALUD SEG\xDAN PERSONAL QUE LAS REALIZA (SESIONES) | Total de Educaci\xF3n en grupo | D98"
        },
        {
          id: "A27-VAL002",
          seccion_expresion_1: "SECCI\xD3N A: PERSONAS QUE INGRESAN A EDUCACI\xD3N GRUPAL SEG\xDAN \xC1REAS TEM\xC1TICAS Y EDAD",
          descripcion_expresion_1: "Si existe informaci\xF3n en Educaci\xF3n prenatal (Nutrici\xF3n-lactancia-crianza-autocuidado-preparaci\xF3n parto y otros)",
          tipo: "CONDICIONAL",
          tipo_validacion: "DOBLE",
          rem_sheet: "A27",
          expresion_1: "D23",
          operador: ">",
          expresion_2: "Y23+Z23+AA23",
          severidad: "REVISAR",
          rem_sheet_2: "A27",
          seccion_expresion_2: "SECCI\xD3N A: PERSONAS QUE INGRESAN A EDUCACI\xD3N GRUPAL SEG\xDAN \xC1REAS TEM\xC1TICAS Y EDAD",
          descripcion_expresion_2: "Gestantes (APS - Nivel Secundario - Nivel Terciario)",
          aplica_origen: "TODOS",
          condicion_previa: {
            expresion: "D23",
            operador: ">",
            valor: 0
          },
          omitir_si_condicion_no_cumple: true,
          mensaje: "REVISAR | REM27 | SECCI\xD3N A: PERSONAS QUE INGRESAN A EDUCACI\xD3N GRUPAL SEG\xDAN \xC1REAS TEM\xC1TICAS Y EDAD | Si existe informaci\xF3n en Educaci\xF3n prenatal (Nutrici\xF3n-lactancia-crianza-autocuidado-preparaci\xF3n parto y otros) | D23 > REM27 | SECCI\xD3N A: PERSONAS QUE INGRESAN A EDUCACI\xD3N GRUPAL SEG\xDAN \xC1REAS TEM\xC1TICAS Y EDAD | Gestantes (APS - Nivel Secundario - Nivel Terciario) | Y23+Z23+AA23"
        }
      ],
      A28: [
        {
          id: "A28-VAL001",
          seccion_expresion_1: "SECCI\xD3N A.1: INGRESOS Y EGRESOS A ATENCIONES DE REHABILITACI\xD3N EN EL NIVEL PRIMARIO",
          descripcion_expresion_1: "Ingresos al programa en ambos sexos",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A28",
          expresion_1: "B13",
          operador: ">=",
          expresion_2: "B61",
          severidad: "ERROR",
          rem_sheet_2: "A28",
          seccion_expresion_2: "SECCI\xD3N A.3: EVALUACI\xD3N INICIAL",
          descripcion_expresion_2: "Total Evaluaciones por (M\xE9dico/a - Kinesi\xF3logo/a - Terpeuta Ocupacional - Fonoaudi\xF3logo/a - Psic\xF3logo/a)",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM28 | SECCI\xD3N A.1: INGRESOS Y EGRESOS A ATENCIONES DE REHABILITACI\xD3N EN EL NIVEL PRIMARIO | Ingresos al programa en ambos sexos | B13 >= REM28 | SECCI\xD3N A.3: EVALUACI\xD3N INICIAL | Total Evaluaciones por (M\xE9dico/a - Kinesi\xF3logo/a - Terpeuta Ocupacional - Fonoaudi\xF3logo/a - Psic\xF3logo/a) | B61"
        },
        {
          id: "A28-VAL002",
          seccion_expresion_1: "SECCI\xD3N A.1: INGRESOS Y EGRESOS A ATENCIONES DE REHABILITACI\xD3N EN EL NIVEL PRIMARIO",
          descripcion_expresion_1: "Ingresos al programa en ambos sexos",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A28",
          expresion_1: "B13",
          operador: ">=",
          expresion_2: "B14",
          severidad: "ERROR",
          rem_sheet_2: "A28",
          seccion_expresion_2: "SECCI\xD3N A.1: INGRESOS Y EGRESOS A ATENCIONES DE REHABILITACI\xD3N EN EL NIVEL PRIMARIO",
          descripcion_expresion_2: "Ingresos con plan de tratamiento integral (PTI)",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM28 | SECCI\xD3N A.1: INGRESOS Y EGRESOS A ATENCIONES DE REHABILITACI\xD3N EN EL NIVEL PRIMARIO | Ingresos al programa en ambos sexos | B13 >= REM28 | SECCI\xD3N A.1: INGRESOS Y EGRESOS A ATENCIONES DE REHABILITACI\xD3N EN EL NIVEL PRIMARIO | Ingresos con plan de tratamiento integral (PTI) | B14"
        },
        {
          id: "A28-VAL003",
          seccion_expresion_1: "SECCI\xD3N A.1: INGRESOS Y EGRESOS A ATENCIONES DE REHABILITACI\xD3N EN EL NIVEL PRIMARIO",
          descripcion_expresion_1: "Ingresos al programa en ambos sexos",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A28",
          expresion_1: "B13",
          operador: ">=",
          expresion_2: "B15",
          severidad: "ERROR",
          rem_sheet_2: "A28",
          seccion_expresion_2: "SECCI\xD3N A.1: INGRESOS Y EGRESOS A ATENCIONES DE REHABILITACI\xD3N EN EL NIVEL PRIMARIO",
          descripcion_expresion_2: "Ingresos con plan de tratamiento integral (PTI) con objetivos para el trabajo",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM28 | SECCI\xD3N A.1: INGRESOS Y EGRESOS A ATENCIONES DE REHABILITACI\xD3N EN EL NIVEL PRIMARIO | Ingresos al programa en ambos sexos | B13 >= REM28 | SECCI\xD3N A.1: INGRESOS Y EGRESOS A ATENCIONES DE REHABILITACI\xD3N EN EL NIVEL PRIMARIO | Ingresos con plan de tratamiento integral (PTI) con objetivos para el trabajo | B15"
        },
        {
          id: "A28-VAL004",
          seccion_expresion_1: "SECCI\xD3N A.2: INGRESOS POR CONDICI\xD3N DE SALUD",
          descripcion_expresion_1: "Total ingreso (N\xB0 de personas)",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A28",
          expresion_1: "B29",
          operador: "<=",
          expresion_2: "B30+B31+B32+B33+B34+B35+B36+B37+B38+B39+B40+B41+B42+B43+B44+B45+B46+B47+B48+B49+B50+B51+B52",
          severidad: "ERROR",
          rem_sheet_2: "A28",
          seccion_expresion_2: "SECCI\xD3N A.2: INGRESOS POR CONDICI\xD3N DE SALUD",
          descripcion_expresion_2: "Desglose Total Ingreso (Dolor cervical agudo - Dolor lumbar agudo - Hombro doloroso agudo",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM28 | SECCI\xD3N A.2: INGRESOS POR CONDICI\xD3N DE SALUD | Total ingreso (N\xB0 de personas) | B29 <= REM28 | SECCI\xD3N A.2: INGRESOS POR CONDICI\xD3N DE SALUD | Desglose Total Ingreso (Dolor cervical agudo - Dolor lumbar agudo - Hombro doloroso agudo | B30+B31+B32+B33+B34+B35+B36+B37+B38+B39+B40+B41+B42+B43+B44+B45+B46+B47+B48+B49+B50+B51+B52"
        },
        {
          id: "A28-VAL005",
          seccion_expresion_1: "SECCI\xD3N B.1: INGRESOS Y EGRESOS A REHABILITACI\xD3N INTEGRAL",
          descripcion_expresion_1: "Total ingresos (N\xBA de personas)",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "A28",
          expresion_1: "B149",
          operador: "<=",
          expresion_2: "B150+B151+B152+B153+B154+B155+B156+B157+B158+B159+B160+B161+B162+B163+B164+B165+B166+B167+B168+B169+B170+B171+B172+B173+B174+B175+B176+B177",
          severidad: "ERROR",
          rem_sheet_2: "A28",
          seccion_expresion_2: "SECCI\xD3N B.1: INGRESOS Y EGRESOS A REHABILITACI\xD3N INTEGRAL",
          descripcion_expresion_2: "Desglose Ingresos por (Ingresos con plan de tratamiento integral (PTI)-Ataque cerebro vascular (ACV)-Traumatismo enc\xE9falo craneano (TEC)-Lesi\xF3n medular)",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM28 | SECCI\xD3N B.1: INGRESOS Y EGRESOS A REHABILITACI\xD3N INTEGRAL | Total ingresos (N\xBA de personas) | B149 <= REM28 | SECCI\xD3N B.1: INGRESOS Y EGRESOS A REHABILITACI\xD3N INTEGRAL | Desglose Ingresos por (Ingresos con plan de tratamiento integral (PTI)-Ataque cerebro vascular (ACV)-Traumatismo enc\xE9falo craneano (TEC)-Lesi\xF3n medular) | B150+B151+B152+B153+B154+B155+B156+B157+B158+B159+B160+B161+B162+B163+B164+B165+B166+B167+B168+B169+B170+B171+B172+B173+B174+B175+B176+B177"
        },
        {
          id: "A28-VAL006",
          seccion_expresion_1: "SECCI\xD3N B.1: INGRESOS Y EGRESOS A REHABILITACI\xD3N INTEGRAL",
          descripcion_expresion_1: "Se deben registrar solo en Tipo de atenci\xF3n Abierta",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A28",
          expresion_1: "AM150+AM151+AM152+AM153+AM154+AM155+AM156+AM157+AM158+AM159+AM160+AM161+AM162+AM163+AM164+AM165+AM166+AM167+AM168+AM169+AM170+AM171+AM172+AM173+AM174+AM175+AM176+AM177+AM178",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "A28",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "REVISAR | REM28 | SECCI\xD3N B.1: INGRESOS Y EGRESOS A REHABILITACI\xD3N INTEGRAL | Se deben registrar solo en Tipo de atenci\xF3n Abierta | AM150+AM151+AM152+AM153+AM154+AM155+AM156+AM157+AM158+AM159+AM160+AM161+AM162+AM163+AM164+AM165+AM166+AM167+AM168+AM169+AM170+AM171+AM172+AM173+AM174+AM175+AM176+AM177+AM178"
        }
      ],
      A29: [
        {
          id: "A29-VAL001",
          seccion_expresion_1: "SECCI\xD3N A: PROGRAMA DE RESOLUTIVIDAD ATENCI\xD3N PRIMARIA DE SALUD",
          descripcion_expresion_1: "Total interconsultas generadas en APS para resoluci\xF3n por especialidad oftalmolog\xEDa (UAPO y canasta integral)",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A29",
          expresion_1: "O12+P12",
          operador: "==",
          expresion_2: 0,
          severidad: "ERROR",
          rem_sheet_2: "A29",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM29 | SECCI\xD3N A: PROGRAMA DE RESOLUTIVIDAD ATENCI\xD3N PRIMARIA DE SALUD | Total interconsultas generadas en APS para resoluci\xF3n por especialidad oftalmolog\xEDa (UAPO y canasta integral) | O12+P12"
        },
        {
          id: "A29-VAL002",
          seccion_expresion_1: "SECCI\xD3N A: PROGRAMA DE RESOLUTIVIDAD ATENCI\xD3N PRIMARIA DE SALUD",
          descripcion_expresion_1: "Total interconsultas generadas en APS para resoluci\xF3n por especialidad otorrinolaringolog\xEDa (UAPORRINO y canasta integral) MAL INGRESADA",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A29",
          expresion_1: "M13+N13",
          operador: "==",
          expresion_2: 0,
          severidad: "ERROR",
          rem_sheet_2: "A29",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM29 | SECCI\xD3N A: PROGRAMA DE RESOLUTIVIDAD ATENCI\xD3N PRIMARIA DE SALUD | Total interconsultas generadas en APS para resoluci\xF3n por especialidad otorrinolaringolog\xEDa (UAPORRINO y canasta integral) MAL INGRESADA | M13+N13"
        }
      ],
      A30AR: [
        {
          id: "A30AR-VAL001",
          seccion_expresion_1: "SECCION A1: TELEINTERCONSULTA DE ESPECIALIDAD MEDICA POR HOSPITAL DIGITAL",
          descripcion_expresion_1: "No debe existir registro en este REM",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "A30AR",
          expresion_1: "B12+C12+D12+E12+F12+G12+H12+I12+J12+K12+L12+M12+N12+O12+P12+Q12",
          operador: "==",
          expresion_2: 0,
          severidad: "ERROR",
          rem_sheet_2: "A30AR",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          mensaje: "ERROR | REM30 | SECCION A1: TELEINTERCONSULTA DE ESPECIALIDAD MEDICA POR HOSPITAL DIGITAL | No debe existir registro en este REM | B12+C12+D12+E12+F12+G12+H12+I12+J12+K12+L12+M12+N12+O12+P12+Q12"
        }
      ],
      P1: [
        {
          id: "P01-VAL001",
          seccion_expresion_1: "SECCION D: GESTANTES Y PERSONAS DE 8\xB0 MES POST-PARTO EN CONTROL, SEG\xDAN ESTADO NUTRICIONAL",
          descripcion_expresion_1: "Total Gestantes en Control seg\xFAn estado nutricional",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P1",
          expresion_1: "C69",
          operador: "==",
          expresion_2: "B53",
          severidad: "ERROR",
          rem_sheet_2: "P1",
          seccion_expresion_2: "SECCION B: GESTANTES EN CONTROL CON EVALUACI\xD3N RIESGO BIOPSICOSOCIAL",
          descripcion_expresion_2: "Gestantes en Control con Riesgo Psicosocial",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P1 | SECCION D: GESTANTES Y PERSONAS DE 8\xB0 MES POST-PARTO EN CONTROL, SEG\xDAN ESTADO NUTRICIONAL | Total Gestantes en Control seg\xFAn estado nutricional | C69 | REM P1 | SECCION B: GESTANTES EN CONTROL CON EVALUACI\xD3N RIESGO BIOPSICOSOCIAL | Gestantes en Control con Riesgo Psicosocial | B53"
        },
        {
          id: "P01-VAL002",
          seccion_expresion_1: "SECCION C: GESTANTES EN RIESGO PSICOSOCIAL CON VISITA DOMICILIARIA INTEGRAL REALIZADA EN EL SEMESTRE",
          descripcion_expresion_1: "Gestantes en Riesgo Psicosocial con visita Domiciliaria (si B61 tiene informaci\xF3n multiplicar por total visitas C61)",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "P1",
          expresion_1: "B61*C61",
          operador: "==",
          expresion_2: 0,
          severidad: "REVISAR",
          rem_sheet_2: "P1",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "REVISAR | REM P1 | SECCION C: GESTANTES EN RIESGO PSICOSOCIAL CON VISITA DOMICILIARIA INTEGRAL REALIZADA EN EL SEMESTRE | Gestantes en Riesgo Psicosocial con visita Domiciliaria (si B61 tiene informaci\xF3n multiplicar por total visitas C61) | B61*C61"
        },
        {
          id: "P01-VAL003",
          seccion_expresion_1: "SECCION D: GESTANTES Y PERSONAS DE 8\xB0 MES POST-PARTO EN CONTROL, SEG\xDAN ESTADO NUTRICIONALL",
          descripcion_expresion_1: "Mujeres y Gestantes en Control con Consulta Nutricional, Estado Nutricional Obesa",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P1",
          expresion_1: "B65",
          operador: ">=",
          expresion_2: "B78",
          severidad: "ERROR",
          rem_sheet_2: "P1",
          seccion_expresion_2: "SECCION E: GESTANTES Y PERSONAS EN CONTROL CON CONSULTA NUTRICIONAL",
          descripcion_expresion_2: "Gestantes Por Exceso, Obesa",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P1 | SECCION D: GESTANTES Y PERSONAS DE 8\xB0 MES POST-PARTO EN CONTROL, SEG\xDAN ESTADO NUTRICIONALL | Mujeres y Gestantes en Control con Consulta Nutricional, Estado Nutricional Obesa | B65 | REM P1 | SECCION E: GESTANTES Y PERSONAS EN CONTROL CON CONSULTA NUTRICIONAL | Gestantes Por Exceso, Obesa | B78"
        },
        {
          id: "P01-VAL004",
          seccion_expresion_1: "SECCION D: GESTANTES Y PERSONAS DE 8\xB0 MES POST-PARTO EN CONTROL, SEG\xDAN ESTADO NUTRICIONAL",
          descripcion_expresion_1: "Mujeres y Gestantes en Control con Consulta Nutricional, Estado nutricional Sobrepeso",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P1",
          expresion_1: "B66",
          operador: ">=",
          expresion_2: "B79",
          severidad: "ERROR",
          rem_sheet_2: "P1",
          seccion_expresion_2: "SECCION E: GESTANTES Y PERSONAS EN CONTROL CON CONSULTA NUTRICIONAL",
          descripcion_expresion_2: "Gestantes Por exceso, Sobrepeso",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P1 | SECCION D: GESTANTES Y PERSONAS DE 8\xB0 MES POST-PARTO EN CONTROL, SEG\xDAN ESTADO NUTRICIONAL | Mujeres y Gestantes en Control con Consulta Nutricional, Estado nutricional Sobrepeso | B66 | REM P1 | SECCION E: GESTANTES Y PERSONAS EN CONTROL CON CONSULTA NUTRICIONAL | Gestantes Por exceso, Sobrepeso | B79"
        },
        {
          id: "P01-VAL005",
          seccion_expresion_1: "SECCION D: GESTANTES Y PERSONAS DE 8\xB0 MES POST-PARTO EN CONTROL, SEG\xDAN ESTADO NUTRICIONAL",
          descripcion_expresion_1: "Mujeres y Gestantes en Control con Consulta Nutricional, Estado Nutricional bajo Peso",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P1",
          expresion_1: "B68",
          operador: ">=",
          expresion_2: "B77",
          severidad: "ERROR",
          rem_sheet_2: "P1",
          seccion_expresion_2: "SECCION E: GESTANTES Y PERSONAS EN CONTROL CON CONSULTA NUTRICIONAL",
          descripcion_expresion_2: "Gestantes por Exceso, bajo Peso",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P1 | SECCION D: GESTANTES Y PERSONAS DE 8\xB0 MES POST-PARTO EN CONTROL, SEG\xDAN ESTADO NUTRICIONAL | Mujeres y Gestantes en Control con Consulta Nutricional, Estado Nutricional bajo Peso | B68 | REM P1 | SECCION E: GESTANTES Y PERSONAS EN CONTROL CON CONSULTA NUTRICIONAL | Gestantes por Exceso, bajo Peso | B77"
        },
        {
          id: "P01-VAL006",
          seccion_expresion_1: "SECCION F: MUJERES EN CONTROL DE CLIMATERIO",
          descripcion_expresion_1: "Mujeres en Control de Climaterio, poblaci\xF3n en control",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P1",
          expresion_1: "C84",
          operador: ">=",
          expresion_2: "B85",
          severidad: "ERROR",
          rem_sheet_2: "P1",
          seccion_expresion_2: "SECCION F: MUJERES EN CONTROL DE CLIMATERIO",
          descripcion_expresion_2: "Mujeres con Pauta Aplicada MRS",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P1 | SECCION F: MUJERES EN CONTROL DE CLIMATERIO | Mujeres en Control de Climaterio, poblaci\xF3n en control | C84 | REM P1 | SECCION F: MUJERES EN CONTROL DE CLIMATERIO | Mujeres con Pauta Aplicada MRS | B85"
        },
        {
          id: "P01-VAL007",
          seccion_expresion_1: "SECCION F: MUJERES EN CONTROL DE CLIMATERIO",
          descripcion_expresion_1: "Mujeres en Control de Climaterio, Mujeres con Pauta Aplicada MRS",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P1",
          expresion_1: "C85",
          operador: ">=",
          expresion_2: "B88",
          severidad: "ERROR",
          rem_sheet_2: "P1",
          seccion_expresion_2: "SECCION F: MUJERES EN CONTROL DE CLIMATERIO",
          descripcion_expresion_2: "Mujeres con MRS elevado",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P1 | SECCION F: MUJERES EN CONTROL DE CLIMATERIO | Mujeres en Control de Climaterio, Mujeres con Pauta Aplicada MRS | C85 | REM P1 | SECCION F: MUJERES EN CONTROL DE CLIMATERIO | Mujeres con MRS elevado | B88"
        },
        {
          id: "P01-VAL008",
          seccion_expresion_1: "SECCION F: MUJERES EN CONTROL DE CLIMATERIO",
          descripcion_expresion_1: "Mujeres en Control de Climaterio, Mujeres con MRS elevado",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P1",
          expresion_1: "B88",
          operador: ">=",
          expresion_2: "B89",
          severidad: "ERROR",
          rem_sheet_2: "P1",
          seccion_expresion_2: "SECCION F: MUJERES EN CONTROL DE CLIMATERIO",
          descripcion_expresion_2: "Mujeres c/Aplicaci\xF3n de terapia Menopausia seg\xFAn MRS",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P1 | SECCION F: MUJERES EN CONTROL DE CLIMATERIO | Mujeres en Control de Climaterio, Mujeres con MRS elevado | B88 | REM P1 | SECCION F: MUJERES EN CONTROL DE CLIMATERIO | Mujeres c/Aplicaci\xF3n de terapia Menopausia seg\xFAn MRS | B89"
        },
        {
          id: "P01-VAL009",
          seccion_expresion_1: "POBLACI\xD3N EN CONTROL POR PATOLOG\xCDAS DE ALTO RIESGO OBST\xC9TRICO",
          descripcion_expresion_1: "Poblaci\xF3n en Control por Patolog\xEDas de Alto Riesgo Obst\xE9trico",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "P1",
          expresion_1: "B160",
          operador: "==",
          expresion_2: 0,
          severidad: "ERROR",
          rem_sheet_2: "P1",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "HBSJO",
          serie: "P",
          aplicar_a: [
            "123100"
          ],
          validacion_exclusiva: true,
          mensaje: "ERROR | REM P1 | POBLACI\xD3N EN CONTROL POR PATOLOG\xCDAS DE ALTO RIESGO OBST\xC9TRICO | Poblaci\xF3n en Control por Patolog\xEDas de Alto Riesgo Obst\xE9trico | B160"
        }
      ],
      P2: [
        {
          id: "P02-VAL001",
          seccion_expresion_1: "SECCION A: POBLACI\xD3N EN CONTROL, SEG\xDAN ESTADO NUTRICIONAL PARA NI\xD1OS MENOR DE UN MES- 59 MESES",
          descripcion_expresion_1: "Poblaci\xF3n en Control, suma de C12 menos F12 y G12",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P2",
          expresion_1: "C12+(F12-G12)",
          operador: "==",
          expresion_2: "C39",
          severidad: "ERROR",
          rem_sheet_2: "P2",
          seccion_expresion_2: "SECCION A: POBLACI\xD3N EN CONTROL, SEG\xDAN ESTADO NUTRICIONAL PARA NI\xD1OS MENOR DE UN MES- 59 MESES",
          descripcion_expresion_2: "Poblaci\xF3n en Control, celda C39",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P2 | SECCION A: POBLACI\xD3N EN CONTROL, SEG\xDAN ESTADO NUTRICIONAL PARA NI\xD1OS MENOR DE UN MES- 59 MESES | Poblaci\xF3n en Control, suma de C12 menos F12 y G12 | C12+(F12-G12) | REM P2 | SECCION A: POBLACI\xD3N EN CONTROL, SEG\xDAN ESTADO NUTRICIONAL PARA NI\xD1OS MENOR DE UN MES- 59 MESES | Poblaci\xF3n en Control, celda C39 | C39"
        },
        {
          id: "P02-VAL002",
          seccion_expresion_1: "SECCION A: POBLACI\xD3N EN CONTROL, SEG\xDAN ESTADO NUTRICIONAL PARA NI\xD1OS MENOR DE UN MES- 59 MESES",
          descripcion_expresion_1: "Poblaci\xF3n en Control, celda C21",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P2",
          expresion_1: "C21",
          operador: "==",
          expresion_2: "SUM(H34:AG34)",
          severidad: "ERROR",
          rem_sheet_2: "P2",
          seccion_expresion_2: "SECCION A: POBLACI\xD3N EN CONTROL, SEG\xDAN ESTADO NUTRICIONAL PARA NI\xD1OS MENOR DE UN MES- 59 MESES",
          descripcion_expresion_2: "Poblaci\xF3n en Control, suma de H34 a AG34",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P2 | SECCION A: POBLACI\xD3N EN CONTROL, SEG\xDAN ESTADO NUTRICIONAL PARA NI\xD1OS MENOR DE UN MES- 59 MESES | Poblaci\xF3n en Control, celda C21 | C21 | REM P2 | SECCION A: POBLACI\xD3N EN CONTROL, SEG\xDAN ESTADO NUTRICIONAL PARA NI\xD1OS MENOR DE UN MES- 59 MESES | Poblaci\xF3n en Control, suma de H34 a AG34 | SUM(H34:AG34)"
        },
        {
          id: "P02-VAL003",
          seccion_expresion_1: "SECCION A: POBLACI\xD3N EN CONTROL, SEG\xDAN ESTADO NUTRICIONAL PARA NI\xD1OS MENOR DE UN MES- 59 MESES",
          descripcion_expresion_1: "Poblaci\xF3n en Control, celda C19",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P2",
          expresion_1: "C19",
          operador: "==",
          expresion_2: "SUM(H35:AG35)",
          severidad: "ERROR",
          rem_sheet_2: "P2",
          seccion_expresion_2: "SECCION A: POBLACI\xD3N EN CONTROL, SEG\xDAN ESTADO NUTRICIONAL PARA NI\xD1OS MENOR DE UN MES- 59 MESES",
          descripcion_expresion_2: "Poblaci\xF3n en Control, suma de H35 a AG35",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P2 | SECCION A: POBLACI\xD3N EN CONTROL, SEG\xDAN ESTADO NUTRICIONAL PARA NI\xD1OS MENOR DE UN MES- 59 MESES | Poblaci\xF3n en Control, celda C19 | C19 | REM P2 | SECCION A: POBLACI\xD3N EN CONTROL, SEG\xDAN ESTADO NUTRICIONAL PARA NI\xD1OS MENOR DE UN MES- 59 MESES | Poblaci\xF3n en Control, suma de H35 a AG35 | SUM(H35:AG35)"
        },
        {
          id: "P02-VAL004",
          seccion_expresion_1: "SECCION A: POBLACI\xD3N EN CONTROL, SEG\xDAN ESTADO NUTRICIONAL PARA NI\xD1OS MENOR DE UN MES- 59 MESES",
          descripcion_expresion_1: "Poblaci\xF3n en Control, celda C33",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P2",
          expresion_1: "C33",
          operador: "==",
          expresion_2: "SUM(H17:U17)+SUM(V22:AG22)-C38",
          severidad: "ERROR",
          rem_sheet_2: "P2",
          seccion_expresion_2: "SECCION A: POBLACI\xD3N EN CONTROL, SEG\xDAN ESTADO NUTRICIONAL PARA NI\xD1OS MENOR DE UN MES- 59 MESES",
          descripcion_expresion_2: "Poblaci\xF3n en Control, suma de H17 a U17 + V22 a AG22 menos C38",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P2 | SECCION A: POBLACI\xD3N EN CONTROL, SEG\xDAN ESTADO NUTRICIONAL PARA NI\xD1OS MENOR DE UN MES- 59 MESES | Poblaci\xF3n en Control, celda C33 | C33 | REM P2 | SECCION A: POBLACI\xD3N EN CONTROL, SEG\xDAN ESTADO NUTRICIONAL PARA NI\xD1OS MENOR DE UN MES- 59 MESES | Poblaci\xF3n en Control, suma de H17 a U17 + V22 a AG22 menos C38 | SUM(H17:U17)+SUM(V22:AG22)-C38"
        }
      ],
      P3: [
        {
          id: "P03-VAL001",
          seccion_expresion_1: "SECCI\xD3N A: EXISTENCIA DE POBLACI\xD3N EN CONTROL",
          descripcion_expresion_1: "Existencia de Poblaci\xF3n en Control, celda C37",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P3",
          expresion_1: "C37",
          operador: "<=",
          expresion_2: "C35+C36",
          severidad: "ERROR",
          rem_sheet_2: "P3",
          seccion_expresion_2: "SECCI\xD3N A: EXISTENCIA DE POBLACI\xD3N EN CONTROL",
          descripcion_expresion_2: "Existencia de Poblaci\xF3n en Control, suma de C35+C36",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P3 | SECCI\xD3N A: EXISTENCIA DE POBLACI\xD3N EN CONTROL | Existencia de Poblaci\xF3n en Control, celda C37 | C37 | REM P3 | SECCI\xD3N A: EXISTENCIA DE POBLACI\xD3N EN CONTROL | Existencia de Poblaci\xF3n en Control, suma de C35+C36 | C35+C36"
        },
        {
          id: "P03-VAL002",
          seccion_expresion_1: "SECCI\xD3N A: EXISTENCIA DE POBLACI\xD3N EN CONTROL",
          descripcion_expresion_1: "Existencia de Poblaci\xF3n en Control, celda C43",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P3",
          expresion_1: "C43",
          operador: "<=",
          expresion_2: "C37",
          severidad: "ERROR",
          rem_sheet_2: "P3",
          seccion_expresion_2: "SECCI\xD3N A: EXISTENCIA DE POBLACI\xD3N EN CONTROL",
          descripcion_expresion_2: "Existencia de Poblaci\xF3n en Control, celda C37",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P3 | SECCI\xD3N A: EXISTENCIA DE POBLACI\xD3N EN CONTROL | Existencia de Poblaci\xF3n en Control, celda C43 | C43 | REM P3 | SECCI\xD3N A: EXISTENCIA DE POBLACI\xD3N EN CONTROL | Existencia de Poblaci\xF3n en Control, celda C37 | C37"
        },
        {
          id: "P03-VAL003",
          seccion_expresion_1: "SECCI\xD3N A: EXISTENCIA DE POBLACI\xD3N EN CONTROL",
          descripcion_expresion_1: "Existencia de Poblaci\xF3n en Control, suma de C15 a C17",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P3",
          expresion_1: "C15+C16+C17",
          operador: "==",
          expresion_2: "C65+C66+C67+C68",
          severidad: "ERROR",
          rem_sheet_2: "P3",
          seccion_expresion_2: "SECCION D: NIVEL DE CONTROL DE POBLACION RESPIRATORIA CRONICA",
          descripcion_expresion_2: "Nivel de Control Poblaci\xF3n Respiratoria Cr\xF3nica, suma de C65 a C68",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P3 | SECCI\xD3N A: EXISTENCIA DE POBLACI\xD3N EN CONTROL | Existencia de Poblaci\xF3n en Control, suma de C15 a C17 | C15+C16+C17 | REM P3 | SECCION D: NIVEL DE CONTROL DE POBLACION RESPIRATORIA CRONICA | Nivel de Control Poblaci\xF3n Respiratoria Cr\xF3nica, suma de C65 a C68 | C65+C66+C67+C68"
        },
        {
          id: "P03-VAL004",
          seccion_expresion_1: "SECCI\xD3N A: EXISTENCIA DE POBLACI\xD3N EN CONTROL",
          descripcion_expresion_1: "Existencia de Poblaci\xF3n en Control, suma de C18 a C19",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P3",
          expresion_1: "C18+C19",
          operador: "==",
          expresion_2: "C69+C70+C71",
          severidad: "ERROR",
          rem_sheet_2: "P3",
          seccion_expresion_2: "SECCION D: NIVEL DE CONTROL DE POBLACION RESPIRATORIA CRONICA",
          descripcion_expresion_2: "Nivel de Control Poblaci\xF3n Respiratoria Cr\xF3nica, suma de C69 a C71",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P3 | SECCI\xD3N A: EXISTENCIA DE POBLACI\xD3N EN CONTROL | Existencia de Poblaci\xF3n en Control, suma de C18 a C19 | C18+C19 | REM P3 | SECCION D: NIVEL DE CONTROL DE POBLACION RESPIRATORIA CRONICA | Nivel de Control Poblaci\xF3n Respiratoria Cr\xF3nica, suma de C69 a C71 | C69+C70+C71"
        }
      ],
      P4: [
        {
          id: "P04-VAL001",
          seccion_expresion_1: "SECCI\xD3N A: PROGRAMA SALUD CARDIOVASCULAR (PSCV)",
          descripcion_expresion_1: "Programa Salud Cardiovascular, celda C12",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P4",
          expresion_1: "C12",
          operador: "<=",
          expresion_2: "C16+C17+C18",
          severidad: "ERROR",
          rem_sheet_2: "P4",
          seccion_expresion_2: "SECCI\xD3N A: PROGRAMA SALUD CARDIOVASCULAR (PSCV)",
          descripcion_expresion_2: "Programa Salud Cardiovascular, suma de C16 a C18",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P4 | SECCI\xD3N A: PROGRAMA SALUD CARDIOVASCULAR (PSCV) | Programa Salud Cardiovascular, celda C12 | C12 | REM P4 | SECCI\xD3N A: PROGRAMA SALUD CARDIOVASCULAR (PSCV) | Programa Salud Cardiovascular, suma de C16 a C18 | C16+C17+C18"
        },
        {
          id: "P04-VAL002",
          seccion_expresion_1: "SECCI\xD3N A: PROGRAMA SALUD CARDIOVASCULAR (PSCV)",
          descripcion_expresion_1: "Metas de Compensaci\xF3n PA<140/90 mmHg",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P4",
          expresion_1: "C28",
          operador: "<=",
          expresion_2: "C16",
          severidad: "ERROR",
          rem_sheet_2: "P4",
          seccion_expresion_2: "SECCI\xD3N B: METAS DE COMPENSACI\xD3N",
          descripcion_expresion_2: "Programa Salud Cardio Vascular, Hipertensi\xF3n Arterial",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P4 | SECCI\xD3N A: PROGRAMA SALUD CARDIOVASCULAR (PSCV) | Metas de Compensaci\xF3n PA<140/90 mmHg | C28 | REM P4 | SECCI\xD3N B: METAS DE COMPENSACI\xD3N | Programa Salud Cardio Vascular, Hipertensi\xF3n Arterial | C16"
        },
        {
          id: "P04-VAL003",
          seccion_expresion_1: "SECCI\xD3N A: PROGRAMA SALUD CARDIOVASCULAR (PSCV)",
          descripcion_expresion_1: "Metas de Compensaci\xF3n Colesterol <100 mg/dL",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P4",
          expresion_1: "C33",
          operador: "<=",
          expresion_2: "C18",
          severidad: "ERROR",
          rem_sheet_2: "P4",
          seccion_expresion_2: "SECCI\xD3N B: METAS DE COMPENSACI\xD3N",
          descripcion_expresion_2: "Programa Salud Cardio Vascular, Dislipidemia",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P4 | SECCI\xD3N A: PROGRAMA SALUD CARDIOVASCULAR (PSCV) | Metas de Compensaci\xF3n Colesterol <100 mg/dL | C33 | REM P4 | SECCI\xD3N B: METAS DE COMPENSACI\xD3N | Programa Salud Cardio Vascular, Dislipidemia | C18"
        },
        {
          id: "P04-VAL004",
          seccion_expresion_1: "SECCI\xD3N A: PROGRAMA SALUD CARDIOVASCULAR (PSCV)",
          descripcion_expresion_1: "Metas de Compensaci\xF3n HbA1C<7%",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P4",
          expresion_1: "C30",
          operador: "<=",
          expresion_2: "C17",
          severidad: "ERROR",
          rem_sheet_2: "P4",
          seccion_expresion_2: "SECCI\xD3N B: METAS DE COMPENSACI\xD3N",
          descripcion_expresion_2: "Programa Salud Cardio Vascular, Diabetes Mellitus Tipo 2",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P4 | SECCI\xD3N A: PROGRAMA SALUD CARDIOVASCULAR (PSCV) | Metas de Compensaci\xF3n HbA1C<7% | C30 | REM P4 | SECCI\xD3N B: METAS DE COMPENSACI\xD3N | Programa Salud Cardio Vascular, Diabetes Mellitus Tipo 2 | C17"
        },
        {
          id: "P04-VAL005",
          seccion_expresion_1: "SECCI\xD3N B: METAS DE COMPENSACI\xD3N",
          descripcion_expresion_1: "Metas de Compensaci\xF3n Hba1C< 7%",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P4",
          expresion_1: "C30",
          operador: ">=",
          expresion_2: "C32",
          severidad: "ERROR",
          rem_sheet_2: "P4",
          seccion_expresion_2: "SECCI\xD3N B: METAS DE COMPENSACI\xD3N",
          descripcion_expresion_2: "Metas de Compensaci\xF3n Hba1C<7%-PA",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P4 | SECCI\xD3N B: METAS DE COMPENSACI\xD3N | Metas de Compensaci\xF3n Hba1C< 7% | C30 | REM P4 | SECCI\xD3N B: METAS DE COMPENSACI\xD3N | Metas de Compensaci\xF3n Hba1C<7%-PA | C32"
        },
        {
          id: "P04-VAL006",
          seccion_expresion_1: "SECCI\xD3N A: PROGRAMA SALUD CARDIOVASCULAR (PSCV)",
          descripcion_expresion_1: "Metas de Compensaci\xF3n Tratamiento con Antiagentes Plaquetarios",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P4",
          expresion_1: "C40",
          operador: "<=",
          expresion_2: "C20+C21+C22",
          severidad: "ERROR",
          rem_sheet_2: "P4",
          seccion_expresion_2: "SECCI\xD3N B: METAS DE COMPENSACI\xD3N",
          descripcion_expresion_2: "Prog. Salud Cardiovascular, suma de C20:C22",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P4 | SECCI\xD3N A: PROGRAMA SALUD CARDIOVASCULAR (PSCV) | Metas de Compensaci\xF3n Tratamiento con Antiagentes Plaquetarios | C40 | REM P4 | SECCI\xD3N B: METAS DE COMPENSACI\xD3N | Prog. Salud Cardiovascular, suma de C20:C22 | C20+C21+C22"
        },
        {
          id: "P04-VAL007",
          seccion_expresion_1: "SECCI\xD3N A: PROGRAMA SALUD CARDIOVASCULAR (PSCV)",
          descripcion_expresion_1: "Metas de Compresi\xF3n Tratamiento con Estatina",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P4",
          expresion_1: "C41",
          operador: "<=",
          expresion_2: "C20+C21+C22",
          severidad: "ERROR",
          rem_sheet_2: "P4",
          seccion_expresion_2: "SECCI\xD3N B: METAS DE COMPENSACI\xD3N",
          descripcion_expresion_2: "Prog. Salud Cardiovascular, suma de C20:C22",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P4 | SECCI\xD3N A: PROGRAMA SALUD CARDIOVASCULAR (PSCV) | Metas de Compresi\xF3n Tratamiento con Estatina | C41 | REM P4 | SECCI\xD3N B: METAS DE COMPENSACI\xD3N | Prog. Salud Cardiovascular, suma de C20:C22 | C20+C21+C22"
        }
      ],
      P5: [
        {
          id: "P05-VAL001",
          seccion_expresion_1: "SECCION A: POBLACI\xD3N EN CONTROL POR CONDICI\xD3N DE FUNCIONALIDAD",
          descripcion_expresion_1: "Poblaci\xF3n en Control por Condici\xF3n de Funcionalidad",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P5",
          expresion_1: "SUM(B21:AG21)",
          operador: "==",
          expresion_2: "SUM(B38:AG38)",
          severidad: "ERROR",
          rem_sheet_2: "P5",
          seccion_expresion_2: "SECCION B: POBLACI\xD3N BAJO CONTROL POR ESTADO NUTRICIONAL",
          descripcion_expresion_2: "Poblaci\xF3n Bajo Control por Estado Nutricional",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P5 | SECCION A: POBLACI\xD3N EN CONTROL POR CONDICI\xD3N DE FUNCIONALIDAD | Poblaci\xF3n en Control por Condici\xF3n de Funcionalidad | SUM(B21:AG21) | REM P5 | SECCION B: POBLACI\xD3N BAJO CONTROL POR ESTADO NUTRICIONAL | Poblaci\xF3n Bajo Control por Estado Nutricional | SUM(B38:AG38)"
        },
        {
          id: "P05-VAL002",
          seccion_expresion_1: 'SECCION A.1: EXISTENCIA DE POBLACI\xD3N EN CONTROL EN PROGRAMA "M\xC1S ADULTOS MAYORES AUTOVALENTES" POR CONDICI\xD3N DE FUNCIONALIDAD',
          descripcion_expresion_1: "Programa M\xE1s Adultos Mayores Autovalentes",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "P5",
          expresion_1: "C29+D29",
          operador: "==",
          expresion_2: 0,
          severidad: "ERROR",
          rem_sheet_2: "P5",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "CESFAM",
          serie: "P",
          aplicar_a_tipo: [
            "CESFAM"
          ],
          validacion_exclusiva: true,
          mensaje: 'ERROR | REM P5 | SECCION A.1: EXISTENCIA DE POBLACI\xD3N EN CONTROL EN PROGRAMA "M\xC1S ADULTOS MAYORES AUTOVALENTES" POR CONDICI\xD3N DE FUNCIONALIDAD | Programa M\xE1s Adultos Mayores Autovalentes | C29+D29'
        }
      ],
      P6: [
        {
          id: "P06-VAL001",
          seccion_expresion_1: "SECCION A.1: POBLACI\xD3N EN CONTROL EN APS AL CORTE",
          descripcion_expresion_1: "Poblaci\xF3n en control al corte, personas con diagn\xF3stico de trastorno mentales",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P6",
          expresion_1: "C24",
          operador: "<=",
          expresion_2: "C13",
          severidad: "ERROR",
          rem_sheet_2: "P6",
          seccion_expresion_2: "SECCION A.1: POBLACI\xD3N EN CONTROL EN APS AL CORTE",
          descripcion_expresion_2: "Poblaci\xF3n en control al corte, n\xFAmero de personas en control",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P6 | SECCION A.1: POBLACI\xD3N EN CONTROL EN APS AL CORTE | Poblaci\xF3n en control al corte, personas con diagn\xF3stico de trastorno mentales | C24 | REM P6 | SECCION A.1: POBLACI\xD3N EN CONTROL EN APS AL CORTE | Poblaci\xF3n en control al corte, n\xFAmero de personas en control | C13"
        },
        {
          id: "P06-VAL002",
          seccion_expresion_1: "SECCION A.1: POBLACI\xD3N EN CONTROL EN APS AL CORTE",
          descripcion_expresion_1: "Poblaci\xF3n en control al corte, celda C24",
          tipo: "COMPUESTA",
          tipo_validacion: "COMPUESTA",
          rem_sheet: "P6",
          expresion_1: "C24",
          operador: "<=",
          expresion_2: "SUM(C25:C58)",
          severidad: "ERROR",
          rem_sheet_2: "P6",
          seccion_expresion_2: "SECCION A.1: POBLACI\xD3N EN CONTROL EN APS AL CORTE",
          descripcion_expresion_2: "Poblaci\xF3n en control al corte, suma de C25:C58",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P6 | SECCION A.1: POBLACI\xD3N EN CONTROL EN APS AL CORTE | Poblaci\xF3n en control al corte, celda C24 | C24 | REM P6 | SECCION A.1: POBLACI\xD3N EN CONTROL EN APS AL CORTE | Poblaci\xF3n en control al corte, suma de C25:C58 | SUM(C25:C58)"
        },
        {
          id: "P06-VAL003",
          seccion_expresion_1: "SECCION B.1: POBLACI\xD3N EN CONTROL EN ESPECIALIDAD AL CORTE",
          descripcion_expresion_1: "Poblaci\xF3n en control al corte, personas con diagn\xF3stico de trastorno mentales",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P6",
          expresion_1: "C86",
          operador: "<=",
          expresion_2: "C75",
          severidad: "ERROR",
          rem_sheet_2: "P6",
          seccion_expresion_2: "SECCION B.1: POBLACI\xD3N EN CONTROL EN ESPECIALIDAD AL CORTE",
          descripcion_expresion_2: "Poblaci\xF3n en control al corte, n\xFAmero de personas en control",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P6 | SECCION B.1: POBLACI\xD3N EN CONTROL EN ESPECIALIDAD AL CORTE | Poblaci\xF3n en control al corte, personas con diagn\xF3stico de trastorno mentales | C86 | REM P6 | SECCION B.1: POBLACI\xD3N EN CONTROL EN ESPECIALIDAD AL CORTE | Poblaci\xF3n en control al corte, n\xFAmero de personas en control | C75"
        },
        {
          id: "P06-VAL004",
          seccion_expresion_1: "SECCION B.1: POBLACI\xD3N EN CONTROL EN ESPECIALIDAD AL CORTE",
          descripcion_expresion_1: "Poblaci\xF3n en control al corte, celda C75",
          tipo: "COMPUESTA",
          tipo_validacion: "COMPUESTA",
          rem_sheet: "P6",
          expresion_1: "C75",
          operador: "<=",
          expresion_2: "SUM(C87:C120)",
          severidad: "ERROR",
          rem_sheet_2: "P6",
          seccion_expresion_2: "SECCION B.1: POBLACI\xD3N EN CONTROL EN ESPECIALIDAD AL CORTE",
          descripcion_expresion_2: "Poblaci\xF3n en control al corte, suma de C87:C120",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P6 | SECCION B.1: POBLACI\xD3N EN CONTROL EN ESPECIALIDAD AL CORTE | Poblaci\xF3n en control al corte, celda C75 | C75 | REM P6 | SECCION B.1: POBLACI\xD3N EN CONTROL EN ESPECIALIDAD AL CORTE | Poblaci\xF3n en control al corte, suma de C87:C120 | SUM(C87:C120)"
        }
      ],
      P7: [
        {
          id: "P07-VAL001",
          seccion_expresion_1: "SECCI\xD3N A. CLASIFICACI\xD3N DE LAS FAMILIAS SECTOR URBANO",
          descripcion_expresion_1: "Clasificaci\xF3n de las familias Sector Urbano, N\xB0 Familias Inscritas",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P7",
          expresion_1: "B10",
          operador: ">",
          expresion_2: "B11",
          severidad: "ERROR",
          rem_sheet_2: "P7",
          seccion_expresion_2: "SECCI\xD3N A. CLASIFICACI\xD3N DE LAS FAMILIAS SECTOR URBANO",
          descripcion_expresion_2: "Clasificaci\xF3n de las familias Sector Urbano, N\xB0 Familias Evaluadas encuesta familiar",
          aplica_origen: "TODOS",
          serie: "P",
          omitir_si_ambos_cero: true,
          mensaje: "ERROR | REM P7 | SECCI\xD3N A. CLASIFICACI\xD3N DE LAS FAMILIAS SECTOR URBANO | Clasificaci\xF3n de las familias Sector Urbano, N\xB0 Familias Inscritas | B10 | REM P7 | SECCI\xD3N A. CLASIFICACI\xD3N DE LAS FAMILIAS SECTOR URBANO | Clasificaci\xF3n de las familias Sector Urbano, N\xB0 Familias Evaluadas encuesta familiar | B11"
        },
        {
          id: "P07-VAL002",
          seccion_expresion_1: "SECCI\xD3N A. CLASIFICACI\xD3N DE LAS FAMILIAS SECTOR URBANO",
          descripcion_expresion_1: "Clasificaci\xF3n de las familias Sector Urbano, N\xB0 Familias Evaluadas encuesta familiar",
          tipo: "COMPUESTA",
          tipo_validacion: "COMPUESTA",
          rem_sheet: "P7",
          expresion_1: "B11",
          operador: ">",
          expresion_2: "B12+B13+B14",
          severidad: "ERROR",
          rem_sheet_2: "P7",
          seccion_expresion_2: "SECCI\xD3N A. CLASIFICACI\xD3N DE LAS FAMILIAS SECTOR URBANO",
          descripcion_expresion_2: "Clasificaci\xF3n de las familias Sector Urbano, N\xB0 de Familias en riesgo (Bajo-Medio-Alto)",
          aplica_origen: "TODOS",
          serie: "P",
          omitir_si_ambos_cero: true,
          mensaje: "ERROR | REM P7 | SECCI\xD3N A. CLASIFICACI\xD3N DE LAS FAMILIAS SECTOR URBANO | Clasificaci\xF3n de las familias Sector Urbano, N\xB0 Familias Evaluadas encuesta familiar | B11 | REM P7 | SECCI\xD3N A. CLASIFICACI\xD3N DE LAS FAMILIAS SECTOR URBANO | Clasificaci\xF3n de las familias Sector Urbano, N\xB0 de Familias en riesgo (Bajo-Medio-Alto) | B12+B13+B14"
        },
        {
          id: "P07-VAL003",
          seccion_expresion_1: "SECCI\xD3N A.1 CLASIFICACI\xD3N DE LAS FAMILIAS SECTOR RURAL",
          descripcion_expresion_1: "Clasificaci\xF3n de las familias Sector Urbano, N\xB0 familias inscritas",
          tipo: "DOBLE",
          tipo_validacion: "DOBLE",
          rem_sheet: "P7",
          expresion_1: "B17",
          operador: ">",
          expresion_2: "B18",
          severidad: "ERROR",
          rem_sheet_2: "P7",
          seccion_expresion_2: "SECCI\xD3N A.1 CLASIFICACI\xD3N DE LAS FAMILIAS SECTOR RURAL",
          descripcion_expresion_2: "Clasificaci\xF3n de las familias Sector Urbano, N\xB0 Familias Evaluadas encuesta familiar",
          aplica_origen: "TODOS",
          serie: "P",
          omitir_si_ambos_cero: true,
          mensaje: "ERROR | REM P7 | SECCI\xD3N A.1 CLASIFICACI\xD3N DE LAS FAMILIAS SECTOR RURAL | Clasificaci\xF3n de las familias Sector Urbano, N\xB0 familias inscritas | B17 | REM P7 | SECCI\xD3N A.1 CLASIFICACI\xD3N DE LAS FAMILIAS SECTOR RURAL | Clasificaci\xF3n de las familias Sector Urbano, N\xB0 Familias Evaluadas encuesta familiar | B18"
        },
        {
          id: "P07-VAL004",
          seccion_expresion_1: "SECCI\xD3N A.1 CLASIFICACI\xD3N DE LAS FAMILIAS SECTOR RURAL",
          descripcion_expresion_1: "Clasificaci\xF3n de las familias Sector Urbano, N\xB0 Familias Evaluadas encuesta familiar",
          tipo: "COMPUESTA",
          tipo_validacion: "COMPUESTA",
          rem_sheet: "P7",
          expresion_1: "B18",
          operador: ">",
          expresion_2: "B19+B20+B21",
          severidad: "ERROR",
          rem_sheet_2: "P7",
          seccion_expresion_2: "SECCI\xD3N A.1 CLASIFICACI\xD3N DE LAS FAMILIAS SECTOR RURAL",
          descripcion_expresion_2: "Clasificaci\xF3n de las familias Sector Urbano, N\xB0 de Familias en riesgo (Bajo-Medio-Alto)",
          aplica_origen: "TODOS",
          serie: "P",
          omitir_si_ambos_cero: true,
          mensaje: "ERROR | REM P7 | SECCI\xD3N A.1 CLASIFICACI\xD3N DE LAS FAMILIAS SECTOR RURAL | Clasificaci\xF3n de las familias Sector Urbano, N\xB0 Familias Evaluadas encuesta familiar | B18 | REM P7 | SECCI\xD3N A.1 CLASIFICACI\xD3N DE LAS FAMILIAS SECTOR RURAL | Clasificaci\xF3n de las familias Sector Urbano, N\xB0 de Familias en riesgo (Bajo-Medio-Alto) | B19+B20+B21"
        }
      ],
      P9: [],
      P11: [
        {
          id: "P11-VAL001",
          seccion_expresion_1: "SECCION A: POBLACI\xD3N EN CONTROL DEL PROGRAMA DE VIH/SIDA",
          descripcion_expresion_1: "Poblaci\xF3n en Control del Programa ITS",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "P11",
          expresion_1: "SUM(D12:D17)",
          operador: "==",
          expresion_2: 0,
          severidad: "ERROR",
          rem_sheet_2: "P11",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "HBSJO",
          serie: "P",
          aplicar_a: [
            "123100"
          ],
          validacion_exclusiva: true,
          mensaje: "ERROR | REM P11 | SECCION A: POBLACI\xD3N EN CONTROL DEL PROGRAMA DE VIH/SIDA | Poblaci\xF3n en Control del Programa ITS | SUM(D12:D17)"
        },
        {
          id: "P11-VAL002",
          seccion_expresion_1: "SECCION B: POBLACI\xD3N EN CONTROL POR COMERCIO SEXUAL",
          descripcion_expresion_1: "Poblaci\xF3n en Control por Comercio Sexual",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "P11",
          expresion_1: "B22",
          operador: "==",
          expresion_2: 0,
          severidad: "ERROR",
          rem_sheet_2: "P11",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "HBSJO",
          serie: "P",
          aplicar_a: [
            "123100"
          ],
          validacion_exclusiva: true,
          mensaje: "ERROR | REM P11 | SECCION B: POBLACI\xD3N EN CONTROL POR COMERCIO SEXUAL | Poblaci\xF3n en Control por Comercio Sexual | B22"
        }
      ],
      P12: [
        {
          id: "P12-VAL001",
          seccion_expresion_1: "SECCI\xD3N A: PROGRAMA DE CANCER DE CUELLO UTERINO",
          descripcion_expresion_1: "Poblaci\xF3n Femenina con PAP vigente (grupo-etario 25 a 64 a\xF1os)",
          tipo: "SIMPLE",
          tipo_validacion: "SIMPLE",
          rem_sheet: "P12",
          expresion_1: "SUM(B12:B19)",
          operador: "==",
          expresion_2: 0,
          severidad: "ERROR",
          rem_sheet_2: "P12",
          seccion_expresion_2: "",
          descripcion_expresion_2: "",
          aplica_origen: "TODOS",
          serie: "P",
          mensaje: "ERROR | REM P12 | SECCI\xD3N A: PROGRAMA DE CANCER DE CUELLO UTERINO | Poblaci\xF3n Femenina con PAP vigente (grupo-etario 25 a 64 a\xF1os) | SUM(B12:B19)"
        }
      ],
      P13: []
    };
  }
});

// data/rules/index.ts
var rules_exports = {};
__export(rules_exports, {
  default: () => rules_default,
  ruleSets: () => ruleSets
});
var universalRules, ruleSets, rules_default;
var init_rules = __esm({
  "data/rules/index.ts"() {
    init_reglas_finales();
    universalRules = { validaciones: reglas_finales_default };
    ruleSets = {
      BASE: universalRules,
      HOSPITAL: { validaciones: {} },
      POSTA: { validaciones: {} },
      CESFAM: { validaciones: {} },
      CECOSF: { validaciones: {} },
      SAPU: { validaciones: {} },
      SUR: { validaciones: {} },
      MOVIL: { validaciones: {} },
      SAMU: { validaciones: {} },
      OTROS: { validaciones: {} }
    };
    rules_default = ruleSets;
  }
});

// hooks/useValidationPipeline.ts
var import_react = __toESM(require_react(), 1);
init_remSeriesConfig();
var useValidationPipeline = () => {
  const [state, setState] = (0, import_react.useState)({
    file: null,
    metadata: null,
    establishment: null,
    results: [],
    isValidating: false,
    error: null,
    versionError: null
  });
  const resetState = (0, import_react.useCallback)(() => {
    setState({
      file: null,
      metadata: null,
      establishment: null,
      results: [],
      isValidating: false,
      error: null,
      versionError: null
    });
  }, []);
  const validateFile = (0, import_react.useCallback)(async (file) => {
    setState((prev) => ({ ...prev, isValidating: true, error: null, versionError: null, file }));
    try {
      const [
        excelServiceModule,
        ruleEngineModule,
        nombreSheetValidatorModule,
        filenameValidatorModule,
        catalogModule,
        ruleDictionaryModule
      ] = await Promise.all([
        Promise.resolve().then(() => (init_excelService(), excelService_exports)),
        Promise.resolve().then(() => (init_ruleEngine(), ruleEngine_exports)),
        Promise.resolve().then(() => (init_nombreSheetValidator(), nombreSheetValidator_exports)),
        Promise.resolve().then(() => (init_filenameValidator(), filenameValidator_exports)),
        Promise.resolve().then(() => __toESM(require_establishments_catalog(), 1)),
        Promise.resolve().then(() => (init_rules(), rules_exports))
      ]);
      const { ExcelReaderService: ExcelReaderService2 } = excelServiceModule;
      const { RuleEngineService: RuleEngineService2 } = ruleEngineModule;
      const { NombreSheetValidator: NombreSheetValidator2 } = nombreSheetValidatorModule;
      const { FilenameValidatorService: FilenameValidatorService2 } = filenameValidatorModule;
      const catalog2 = catalogModule.default;
      const ruleDictionary = ruleDictionaryModule.default;
      const filenameValidator = new FilenameValidatorService2();
      const establishmentByCode = new Map(
        catalog2.establecimientos.map((e) => [e.codigo, e])
      );
      const excelService = ExcelReaderService2.getInstance();
      await excelService.loadFile(file);
      const validationResult = filenameValidator.validate(file.name);
      if (!validationResult.isValid) {
        throw new Error(`Nombre de archivo inv\xE1lido: ${validationResult.errors.join(", ")}`);
      }
      const metadata = {
        nombreOriginal: file.name,
        tamano: file.size,
        serieRem: validationResult.metadata?.serieRem || "A",
        mes: validationResult.metadata?.mes || "01",
        periodo: validationResult.metadata?.periodo || "2026",
        codigoEstablecimiento: validationResult.metadata?.codigoEstablecimiento || "000000",
        extension: validationResult.metadata?.extension || "xlsx",
        sheets: excelService.getSheets()
      };
      const missingRequiredSheets = getMissingRequiredSheetsForSerie(metadata.serieRem, metadata.sheets || []);
      if (missingRequiredSheets.length > 0) {
        throw new Error(`El archivo Serie ${metadata.serieRem} no contiene las hojas obligatorias: ${missingRequiredSheets.join(", ")}. No puede validarse.`);
      }
      const establishment = establishmentByCode.get(metadata.codigoEstablecimiento) || null;
      const rawEstablishmentType = establishment?.tipo?.toUpperCase();
      const normalizedEstablishmentType = rawEstablishmentType === "OTRO" ? "OTROS" : rawEstablishmentType === "POSTAS" ? "POSTA" : establishment?.tipo;
      metadata.tipoEstablecimiento = normalizedEstablishmentType;
      const nombreValidator = new NombreSheetValidator2();
      const nombreOutput = nombreValidator.validate(metadata.codigoEstablecimiento, metadata.mes, metadata.serieRem);
      const ruleEngine = new RuleEngineService2();
      const tipoEstablecimiento = normalizedEstablishmentType?.toUpperCase() || "BASE";
      const baseRules = Object.values(ruleDictionary.BASE?.validaciones || {}).flat();
      const specificRules = ruleDictionary[tipoEstablecimiento] ? Object.values(ruleDictionary[tipoEstablecimiento].validaciones || {}).flat() : [];
      const allRules = [...baseRules, ...specificRules];
      const applicableRules = allRules.filter((r) => r.rem_sheet.startsWith(metadata.serieRem));
      const rulesToRun = applicableRules.length > 0 ? applicableRules : [];
      const ruleResults = await ruleEngine.evaluate(rulesToRun, metadata);
      const results = [...nombreOutput.results, ...ruleResults];
      setState({
        file,
        metadata,
        establishment,
        results,
        isValidating: false,
        error: null,
        versionError: nombreOutput.versionError
      });
    } catch (err) {
      console.error(err);
      setState((prev) => ({
        ...prev,
        isValidating: false,
        error: err.message || "Error desconocido durante la validaci\xF3n"
      }));
    }
  }, []);
  return {
    state,
    validateFile,
    resetState
  };
};
export {
  useValidationPipeline
};
/*! Bundled license information:

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
