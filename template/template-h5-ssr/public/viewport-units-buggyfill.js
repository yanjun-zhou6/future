/*!
 * viewport-units-buggyfill v0.6.2
 * @web: https://github.com/rodneyrehm/viewport-units-buggyfill/
 * @author: Rodney Rehm - http://rodneyrehm.de/en/
 */

(function() {
  (function(root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define([], factory);
    } else if (typeof exports === 'object') {
      // Node. Does not work with strict CommonJS, but
      // only CommonJS-like enviroments that support module.exports,
      // like Node.
      module.exports = factory();
    } else {
      // Browser globals (root is window)
      root.viewportUnitsBuggyfill = factory();
    }
  }(this, function() {
    'use strict';
    /* global document, window, navigator, location, XMLHttpRequest, XDomainRequest, CustomEvent */

    var initialized = false;
    var options;
    var userAgent = window.navigator.userAgent;
    var viewportUnitExpression = /:(\s*)(calc\([\s\S]*)?([+-]?[0-9.]+)(vh|vw|vmin|vmax)/g;
    var urlExpression = /(https?:)?\/\//
    var forEach = [].forEach;
    var dimensions;
    var declarations;
    var styleNode;
    var isBuggyIE = /MSIE [0-9]\./i.test(userAgent);
    var isOldIE = /MSIE [0-8]\./i.test(userAgent);
    var isOperaMini = userAgent.indexOf('Opera Mini') > -1;

    var isMobileSafari = /(iPhone|iPod|iPad).+AppleWebKit/i.test(userAgent) && (function() {
      // Regexp for iOS-version tested against the following userAgent strings:
      // Example WebView UserAgents:
      // * iOS Chrome on iOS8: "Mozilla/5.0 (iPad; CPU OS 8_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) CriOS/39.0.2171.50 Mobile/12B410 Safari/600.1.4"
      // * iOS Facebook on iOS7: "Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Mobile/11D201 [FBAN/FBIOS;FBAV/12.1.0.24.20; FBBV/3214247; FBDV/iPhone6,1;FBMD/iPhone; FBSN/iPhone OS;FBSV/7.1.1; FBSS/2; FBCR/AT&T;FBID/phone;FBLC/en_US;FBOP/5]"
      // Example Safari UserAgents:
      // * Safari iOS8: "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4"
      // * Safari iOS7: "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A4449d Safari/9537.53"
      var iOSversion = userAgent.match(/OS (\d)/);
      // viewport units work fine in mobile Safari and webView on iOS 8+
      return iOSversion && iOSversion.length > 1 && parseInt(iOSversion[1]) < 10;
    })();

    var isBadStockAndroid = (function() {
      // Android stock browser test derived from
      // http://stackoverflow.com/questions/24926221/distinguish-android-chrome-from-stock-browser-stock-browsers-user-agent-contai
      var isAndroid = userAgent.indexOf(' Android ') > -1;
      if (!isAndroid) {
        return false;
      }

      var isStockAndroid = userAgent.indexOf('Version/') > -1;
      if (!isStockAndroid) {
        return false;
      }

      var versionNumber = parseFloat((userAgent.match('Android ([0-9.]+)') || [])[1]);
      // anything below 4.4 uses WebKit without *any* viewport support,
      // 4.4 has issues with viewport units within calc()
      return versionNumber <= 4.4;
    })();

    // added check for IE10, IE11 and Edge < 20, since it *still* doesn't understand vmax
    // http://caniuse.com/#feat=viewport-units
    if (!isBuggyIE) {
      isBuggyIE = !!navigator.userAgent.match(/MSIE 10\.|Trident.*rv[ :]*1[01]\.| Edge\/1\d\./);
    }

    // Polyfill for creating CustomEvents on IE9/10/11
    // from https://github.com/krambuhl/custom-event-polyfill
    try {
      // eslint-disable-next-line no-new, no-use-before-define
      new CustomEvent('test');
    } catch (e) {
      var CustomEvent = function(event, params) {
        var evt;
        params = params || {
          bubbles: false,
          cancelable: false,
          detail: undefined,
        };

        evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      };
      CustomEvent.prototype = window.Event.prototype;
      window.CustomEvent = CustomEvent; // expose definition to window
    }

    function debounce(func, wait) {
      var timeout;
      return function() {
        var context = this;
        var args = arguments;
        var callback = function() {
          func.apply(context, args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(callback, wait);
      };
    }

    // from http://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
    function inIframe() {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    }

    function initialize(initOptions) {
      if (initialized) {
        return;
      }

      if (initOptions === true) {
        initOptions = {
          force: true,
        };
      }

      options = initOptions || {};
      options.isMobileSafari = isMobileSafari;
      options.isBadStockAndroid = isBadStockAndroid;

      if (options.ignoreVmax && !options.force && !isOldIE) {
        // modern IE (10 and up) do not support vmin/vmax,
        // but chances are this unit is not even used, so
        // allow overwriting the "hacktivation"
        // https://github.com/rodneyrehm/viewport-units-buggyfill/issues/56
        isBuggyIE = false;
      }

      if (isOldIE || (!options.force && !isMobileSafari && !isBuggyIE && !isBadStockAndroid && !isOperaMini && (!options.hacks || !options.hacks.required(options)))) {
        // this buggyfill only applies to mobile safari, IE9-10 and the Stock Android Browser.
        if (window.console && isOldIE) {
          console.info('viewport-units-buggyfill requires a proper CSSOM and basic viewport unit support, which are not available in IE8 and below');
        }

        return {
          init: function() {},
        };
      }

      // fire a custom event that buggyfill was initialize
      window.dispatchEvent(new CustomEvent('viewport-units-buggyfill-init'));

      options.hacks && options.hacks.initialize(options);

      initialized = true;
      styleNode = document.createElement('style');
      styleNode.id = 'patched-viewport';
      document[options.appendToBody ? 'body' : 'head'].appendChild(styleNode);

      // Issue #6: Cross Origin Stylesheets are not accessible through CSSOM,
      // therefore download and inject them as <style> to circumvent SOP.
      importCrossOriginLinks(function() {
        var _refresh = debounce(refresh, options.refreshDebounceWait || 100);
        // doing a full refresh rather than updateStyles because an orientationchange
        // could activate different stylesheets
        window.addEventListener('orientationchange', _refresh, true);
        // orientationchange might have happened while in a different window
        window.addEventListener('pageshow', _refresh, true);

        if (options.force || isBuggyIE || inIframe()) {
          window.addEventListener('resize', _refresh, true);
          options._listeningToResize = true;
        }

        options.hacks && options.hacks.initializeEvents(options, refresh, _refresh);

        refresh();
      });
    }

    function updateStyles() {
      styleNode.textContent = getReplacedViewportUnits();
      // move to the end in case inline <style>s were added dynamically
      styleNode.parentNode.appendChild(styleNode);
      // fire a custom event that styles were updated
      window.dispatchEvent(new CustomEvent('viewport-units-buggyfill-style'));
    }

    function refresh() {
      if (!initialized) {
        return;
      }

      findProperties();

      // iOS Safari will report window.innerWidth and .innerHeight as 0 unless a timeout is used here.
      // TODO: figure out WHY innerWidth === 0
      setTimeout(function() {
        updateStyles();
      }, 1);
    }

    // http://stackoverflow.com/a/23613052
    function processStylesheet(ss) {
      // cssRules respects same-origin policy, as per
      // https://code.google.com/p/chromium/issues/detail?id=49001#c10.
      try {
        if (!ss.cssRules) { return; }
      } catch (e) {
        if (e.name !== 'SecurityError') { throw e; }
        return;
      }
      // ss.cssRules is available, so proceed with desired operations.
      var rules = [];
      for (var i = 0; i < ss.cssRules.length; i++) {
        var rule = ss.cssRules[i];
        rules.push(rule);
      }
      return rules;
    }

    function findProperties() {
      declarations = [];
      forEach.call(document.styleSheets, function(sheet) {
        var cssRules = processStylesheet(sheet);

        if (!cssRules || sheet.ownerNode.id === 'patched-viewport' || sheet.ownerNode.getAttribute('data-viewport-units-buggyfill') === 'ignore') {
          // skip entire sheet because no rules are present, it's supposed to be ignored or it's the target-element of the buggyfill
          return;
        }

        if (sheet.media && sheet.media.mediaText && window.matchMedia && !window.matchMedia(sheet.media.mediaText).matches) {
          // skip entire sheet because media attribute doesn't match
          return;
        }

        forEach.call(cssRules, findDeclarations);
      });

      return declarations;
    }

    function findDeclarations(rule) {
      if (rule.type === 7) {
        var value;

        // there may be a case where accessing cssText throws an error.
        // I could not reproduce this issue, but the worst that can happen
        // this way is an animation not running properly.
        // not awesome, but probably better than a script error
        // see https://github.com/rodneyrehm/viewport-units-buggyfill/issues/21
        try {
          value = rule.cssText;
        } catch (e) {
          return;
        }

        viewportUnitExpression.lastIndex = 0;
        if (viewportUnitExpression.test(value) && !urlExpression.test(value)) {
          // KeyframesRule does not have a CSS-PropertyName
          declarations.push([rule, null, value]);
          options.hacks && options.hacks.findDeclarations(declarations, rule, null, value);
        }

        return;
      }

      if (!rule.style) {
        if (!rule.cssRules) {
          return;
        }

        forEach.call(rule.cssRules, function(_rule) {
          findDeclarations(_rule);
        });

        return;
      }

      forEach.call(rule.style, function(name) {
        var value = rule.style.getPropertyValue(name);
        // preserve those !important rules
        if (rule.style.getPropertyPriority(name)) {
          value += ' !important';
        }

        viewportUnitExpression.lastIndex = 0;
        if (viewportUnitExpression.test(value)) {
          declarations.push([rule, name, value]);
          options.hacks && options.hacks.findDeclarations(declarations, rule, name, value);
        }
      });
    }

    function getReplacedViewportUnits() {
      dimensions = getViewport();

      var css = [];
      var buffer = [];
      var open;
      var close;

      declarations.forEach(function(item) {
        var _item = overwriteDeclaration.apply(null, item);
        var _open = _item.selector.length ? (_item.selector.join(' {\n') + ' {\n') : '';
        var _close = new Array(_item.selector.length + 1).join('\n}');

        if (!_open || _open !== open) {
          if (buffer.length) {
            css.push(open + buffer.join('\n') + close);
            buffer.length = 0;
          }

          if (_open) {
            open = _open;
            close = _close;
            buffer.push(_item.content);
          } else {
            css.push(_item.content);
            open = null;
            close = null;
          }

          return;
        }

        if (_open && !open) {
          open = _open;
          close = _close;
        }

        buffer.push(_item.content);
      });

      if (buffer.length) {
        css.push(open + buffer.join('\n') + close);
      }

      // Opera Mini messes up on the content hack (it replaces the DOM node's innerHTML with the value).
      // This fixes it. We test for Opera Mini only since it is the most expensive CSS selector
      // see https://developer.mozilla.org/en-US/docs/Web/CSS/Universal_selectors
      if (isOperaMini) {
        css.push('* { content: normal !important; }');
      }

      return css.join('\n\n');
    }

    function overwriteDeclaration(rule, name, value) {
      var _value;
      var _selectors = [];

      _value = value.replace(viewportUnitExpression, replaceValues);

      if (options.hacks) {
        _value = options.hacks.overwriteDeclaration(rule, name, _value);
      }

      if (name) {
        // skipping KeyframesRule
        _selectors.push(rule.selectorText);
        _value = name + ': ' + _value + ';';
      }

      var _rule = rule.parentRule;
      while (_rule) {
        if (_rule.media) {
          _selectors.unshift('@media ' + _rule.media.mediaText);
        } else if (_rule.conditionText) {
          _selectors.unshift('@supports ' + _rule.conditionText);
        }

        _rule = _rule.parentRule;
      }

      return {
        selector: _selectors,
        content: _value,
      };
    }

    function replaceValues(match, number, unit) {
      var _base = dimensions[unit];
      var _number = parseFloat(number) / 100;
      return (_number * _base) + 'px';
    }

    function getViewport() {
      var vh = window.innerHeight;
      var vw = window.innerWidth;

      return {
        vh: vh,
        vw: vw,
        vmax: Math.max(vw, vh),
        vmin: Math.min(vw, vh),
      };
    }

    function importCrossOriginLinks(next) {
      var _waiting = 0;
      var decrease = function() {
        _waiting--;
        if (!_waiting) {
          next();
        }
      };

      forEach.call(document.styleSheets, function(sheet) {
        if (!sheet.href || origin(sheet.href) === origin(location.href) || sheet.ownerNode.getAttribute('data-viewport-units-buggyfill') === 'ignore') {
          // skip <style> and <link> from same origin or explicitly declared to ignore
          return;
        }

        _waiting++;
        convertLinkToStyle(sheet.ownerNode, decrease);
      });

      if (!_waiting) {
        next();
      }
    }

    function origin(url) {
      return url.slice(0, url.indexOf('/', url.indexOf('://') + 3));
    }

    function convertLinkToStyle(link, next) {
      getCors(link.href, function() {
        var style = document.createElement('style');
        style.media = link.media;
        style.setAttribute('data-href', link.href);
        style.textContent = this.responseText;
        link.parentNode.replaceChild(style, link);
        next();
      }, next);
    }

    function getCors(url, success, error) {
      var xhr = new XMLHttpRequest();
      if ('withCredentials' in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open('GET', url, true);
      } else if (typeof XDomainRequest !== 'undefined') {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open('GET', url);
      } else {
        throw new Error('cross-domain XHR not supported');
      }

      xhr.onload = success;
      xhr.onerror = error;
      xhr.send();
      return xhr;
    }

    return {
      version: '0.6.1',
      findProperties: findProperties,
      getCss: getReplacedViewportUnits,
      init: initialize,
      refresh: refresh,
    };
  }));
})();
/*!
 * viewport-units-buggyfill.hacks v0.6.2
 * @web: https://github.com/rodneyrehm/viewport-units-buggyfill/
 * @author: Zoltan Hawryluk - http://www.useragentman.com/
 */

(function() {
  (function(root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define([], factory);
    } else if (typeof exports === 'object') {
      // Node. Does not work with strict CommonJS, but
      // only CommonJS-like enviroments that support module.exports,
      // like Node.
      module.exports = factory();
    } else {
      // Browser globals (root is window)
      root.viewportUnitsBuggyfillHacks = factory();
    }
  }(this, function() {
    'use strict';

    var calcExpression = /calc\(/g;
    var quoteExpression = /["']/g;
    var userAgent = window.navigator.userAgent;
    var isBuggyIE = /MSIE [0-9]\./i.test(userAgent);

    // added check for IE10, IE11 and Edge < 20, since it *still* doesn't understand vmax
    // http://caniuse.com/#feat=viewport-units
    if (!isBuggyIE) {
      isBuggyIE = !!navigator.userAgent.match(/MSIE 10\.|Trident.*rv[ :]*1[01]\.| Edge\/1\d\./);
    }

    // iOS SAFARI, IE9, or Stock Android: abuse "content" if "viewport-units-buggyfill" specified
    function checkHacks(declarations, rule, name, value) {
      var needsHack = name === 'content' && value.indexOf('viewport-units-buggyfill') > -1;
      if (!needsHack) {
        return;
      }

      var fakeRules = value.replace(quoteExpression, '');
      fakeRules.split(';').forEach(function(fakeRuleElement) {
        var fakeRule = fakeRuleElement.split(':');
        if (fakeRule.length !== 2) {
          return;
        }

        var name = fakeRule[0].trim();
        if (name === 'viewport-units-buggyfill') {
          return;
        }

        var value = fakeRule[1].trim();
        declarations.push([rule, name, value]);
        if (calcExpression.test(value)) {
          var webkitValue = value.replace(calcExpression, '-webkit-calc(');
          declarations.push([rule, name, webkitValue]);
        }
      });
    }

    return {
      required: function(options) {
        return options.isMobileSafari || isBuggyIE;
      },

      initialize: function() {},

      initializeEvents: function(options, refresh, _refresh) {
        if (options.force) {
          return;
        }

        if (isBuggyIE && !options._listeningToResize) {
          window.addEventListener('resize', _refresh, true);
          options._listeningToResize = true;
        }
      },

      findDeclarations: function(declarations, rule, name, value) {
        if (name === null) {
          // KeyframesRule does not have a CSS-PropertyName
          return;
        }

        checkHacks(declarations, rule, name, value);
      },

      overwriteDeclaration: function(rule, name, _value) {
        if (isBuggyIE && name === 'filter') {
          // remove unit "px" from complex value, e.g.:
          // filter: progid:DXImageTransform.Microsoft.DropShadow(OffX=5.4px, OffY=3.9px, Color=#000000);
          _value = _value.replace(/px/g, '');
        }

        return _value;
      },
    };
  }));
})();

;(function () {
	'use strict';

	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	function FastClick(layer, options) {
		var oldOnClick;

		options = options || {};

		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;


		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;


		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;


		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;


		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;


		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;

		/**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
		this.tapTimeout = options.tapTimeout || 700;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function() { return method.apply(context, arguments); };
		}


		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}

		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function(type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};

			layer.addEventListener = function(type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function(event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}

	/**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
	var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function(target) {
		switch (target.nodeName.toLowerCase()) {

		// Don't send a synthetic click to disabled inputs (issue #62)
		case 'button':
		case 'select':
		case 'textarea':
			if (target.disabled) {
				return true;
			}

			break;
		case 'input':

			// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
			if ((deviceIsIOS && target.type === 'file') || target.disabled) {
				return true;
			}

			break;
		case 'label':
		case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
		case 'video':
			return true;
		}

		return (/\bneedsclick\b/).test(target.className);
	};


	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function(target) {
		switch (target.nodeName.toLowerCase()) {
		case 'textarea':
			return true;
		case 'select':
			return !deviceIsAndroid;
		case 'input':
			switch (target.type) {
			case 'button':
			case 'checkbox':
			case 'file':
			case 'image':
			case 'radio':
			case 'submit':
				return false;
			}

			// No point in attempting to focus disabled inputs
			return !target.disabled && !target.readOnly;
		default:
			return (/\bneedsfocus\b/).test(target.className);
		}
	};


	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function(targetElement, event) {
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};

	FastClick.prototype.determineEventType = function(targetElement) {

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}

		return 'click';
	};


	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function(targetElement) {
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month' && targetElement.type !== 'email') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};


	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function(targetElement) {
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while (parentElement);
		}

		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};


	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};


	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function(event) {
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];

		if (deviceIsIOS) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}

			if (!deviceIsIOS4) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			event.preventDefault();
		}

		return true;
	};


	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function(event) {
		var touch = event.changedTouches[0], boundary = this.touchBoundary;

		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}

		return false;
	};


	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function(event) {
		if (!this.trackingClick) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};


	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function(labelElement) {

		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};


	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function(event) {
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}

		if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}

		targetTagName = targetElement.tagName.toLowerCase();
		if (targetTagName === 'label') {
			forElement = this.findControl(targetElement);
			if (forElement) {
				this.focus(targetElement);
				if (deviceIsAndroid) {
					return false;
				}

				targetElement = forElement;
			}
		} else if (this.needsFocus(targetElement)) {

			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
				this.targetElement = null;
				return false;
			}

			this.focus(targetElement);
			this.sendClick(targetElement, event);

			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if (!deviceIsIOS || targetTagName !== 'select') {
				this.targetElement = null;
				event.preventDefault();
			}

			return false;
		}

		if (deviceIsIOS && !deviceIsIOS4) {

			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
				return true;
			}
		}

		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if (!this.needsClick(targetElement)) {
			event.preventDefault();
			this.sendClick(targetElement, event);
		}

		return false;
	};


	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.onTouchCancel = function() {
		this.trackingClick = false;
		this.targetElement = null;
	};


	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onMouse = function(event) {

		// If a target element was never set (because a touch event was never fired) allow the event
		if (!this.targetElement) {
			return true;
		}

		if (event.forwardedTouchEvent) {
			return true;
		}

		// Programmatically generated events targeting a specific element should be permitted
		if (!event.cancelable) {
			return true;
		}

		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

			// Prevent any user-added listeners declared on FastClick element from being fired.
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			} else {

				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}

			// Cancel the event
			event.stopPropagation();
			event.preventDefault();

			return false;
		}

		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};


	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onClick = function(event) {
		var permitted;

		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if (this.trackingClick) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}

		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if (event.target.type === 'submit' && event.detail === 0) {
			return true;
		}

		permitted = this.onMouse(event);

		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if (!permitted) {
			this.targetElement = null;
		}

		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};


	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.destroy = function() {
		var layer = this.layer;

		if (deviceIsAndroid) {
			layer.removeEventListener('mouseover', this.onMouse, true);
			layer.removeEventListener('mousedown', this.onMouse, true);
			layer.removeEventListener('mouseup', this.onMouse, true);
		}

		layer.removeEventListener('click', this.onClick, true);
		layer.removeEventListener('touchstart', this.onTouchStart, false);
		layer.removeEventListener('touchmove', this.onTouchMove, false);
		layer.removeEventListener('touchend', this.onTouchEnd, false);
		layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};


	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function(layer) {
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;
		var firefoxVersion;

		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') {
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (chromeVersion) {

			if (deviceIsAndroid) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}

			// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		if (deviceIsBlackBerry10) {
			blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// user-scalable=no eliminates click delay.
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if (document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
			}
		}

		// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		// Firefox version - zero for other browsers
		firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (firefoxVersion >= 27) {
			// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

			metaViewport = document.querySelector('meta[name=viewport]');
			if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
				return true;
			}
		}

		// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
		// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
		if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		return false;
	};


	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	FastClick.attach = function(layer, options) {
		return new FastClick(layer, options);
	};


	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

		// AMD. Register as an anonymous module.
		define(function() {
			return FastClick;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}
}());