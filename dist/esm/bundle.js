function noop() {}

function assign(tar, src) {
	for (var k in src) tar[k] = src[k];
	return tar;
}

function assignTrue(tar, src) {
	for (var k in src) tar[k] = 1;
	return tar;
}

function appendNode(node, target) {
	target.appendChild(node);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function createElement(name) {
	return document.createElement(name);
}

function createText(data) {
	return document.createTextNode(data);
}

function createComment() {
	return document.createComment('');
}

function addListener(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function removeListener(node, event, handler) {
	node.removeEventListener(event, handler, false);
}

function setAttribute(node, attribute, value) {
	node.setAttribute(attribute, value);
}

function blankObject() {
	return Object.create(null);
}

function destroy(detach) {
	this.destroy = noop;
	this.fire('destroy');
	this.set = noop;

	this._fragment.d(detach !== false);
	this._fragment = null;
	this._state = {};
}

function _differs(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function fire(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		var handler = handlers[i];

		if (!handler.__calling) {
			try {
				handler.__calling = true;
				handler.call(this, data);
			} finally {
				handler.__calling = false;
			}
		}
	}
}

function get() {
	return this._state;
}

function init(component, options) {
	component._handlers = blankObject();
	component._bind = options._bind;

	component.options = options;
	component.root = options.root || component;
	component.store = options.store || component.root.store;
}

function on(eventName, handler) {
	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set(newState) {
	this._set(assign({}, newState));
	if (this.root._lock) return;
	this.root._lock = true;
	callAll(this.root._beforecreate);
	callAll(this.root._oncreate);
	callAll(this.root._aftercreate);
	this.root._lock = false;
}

function _set(newState) {
	var oldState = this._state,
		changed = {},
		dirty = false;

	for (var key in newState) {
		if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign(assign({}, oldState), newState);
	this._recompute(changed, this._state);
	if (this._bind) this._bind(changed, this._state);

	if (this._fragment) {
		this.fire("state", { changed: changed, current: this._state, previous: oldState });
		this._fragment.p(changed, this._state);
		this.fire("update", { changed: changed, current: this._state, previous: oldState });
	}
}

function callAll(fns) {
	while (fns && fns.length) fns.shift()();
}

function _mount(target, anchor) {
	this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
}

var proto = {
	destroy,
	get,
	fire,
	on,
	set,
	_recompute: noop,
	_set,
	_mount,
	_differs
};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var cookieUniversalCommon = createCommonjsModule(function (module) {
module.exports=function(e){function t(o){if(r[o])return r[o].exports;var n=r[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,t),n.l=!0,n.exports}var r={};return t.m=e,t.c=r,t.d=function(e,r,o){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:o});},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,r){var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n=r(1);e.exports=function(t,r){var i=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],a="object"===("undefined"==typeof document?"undefined":o(document))&&"string"==typeof document.cookie,s="object"===(void 0===t?"undefined":o(t))&&"object"===(void 0===r?"undefined":o(r))&&void 0!==e,u=!a&&!s||a&&s,f=function(e){if(s){var o=t.headers.cookie||"";return e&&(o=r.getHeaders(),o=o["set-cookie"]?o["set-cookie"].map(function(e){return e.split(";")[0]}).join(";"):""),o}if(a)return document.cookie||""},c=function(){var e=r.getHeader("Set-Cookie");return (e="string"==typeof e?[e]:e)||[]},p=function(e){return r.setHeader("Set-Cookie",e)},d=function(e,t){if(!t)return e;try{return JSON.parse(e)}catch(t){return e}},l={parseJSON:i,set:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{path:"/"};if(!u)if(t="object"===(void 0===t?"undefined":o(t))?JSON.stringify(t):t,s){var i=c();i.push(n.serialize(e,t,r)),p(i);}else document.cookie=n.serialize(e,t,r);},setAll:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];u||Array.isArray(e)&&e.forEach(function(e){var t=e.name,r=void 0===t?"":t,o=e.value,n=void 0===o?"":o,i=e.opts,a=void 0===i?{path:"/"}:i;l.set(r,n,a);});},get:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{fromRes:!1,parseJSON:l.parseJSON};if(u)return "";var r=n.parse(f(t.fromRes)),o=r[e];return d(o,t.parseJSON)},getAll:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{fromRes:!1,parseJSON:l.parseJSON};if(u)return {};var t=n.parse(f(e.fromRes));for(var r in t)t[r]=d(t[r],e.parseJSON);return t},remove:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{path:"/"};if(!u){var r=l.get(e);t.expires=new Date(0),r&&l.set(e,"",t);}},removeAll:function(){if(!u){var e=n.parse(f());for(var t in e)l.remove(t);}},nodeCookie:n};return l};},function(e,t,r){function o(e,t){if("string"!=typeof e)throw new TypeError("argument str must be a string");for(var r={},o=t||{},n=e.split(u),s=o.decode||a,f=0;f<n.length;f++){var c=n[f],p=c.indexOf("=");if(!(p<0)){var d=c.substr(0,p).trim(),l=c.substr(++p,c.length).trim();'"'==l[0]&&(l=l.slice(1,-1)),void 0==r[d]&&(r[d]=i(l,s));}}return r}function n(e,t,r){var o=r||{},n=o.encode||s;if("function"!=typeof n)throw new TypeError("option encode is invalid");if(!f.test(e))throw new TypeError("argument name is invalid");var i=n(t);if(i&&!f.test(i))throw new TypeError("argument val is invalid");var a=e+"="+i;if(null!=o.maxAge){var u=o.maxAge-0;if(isNaN(u))throw new Error("maxAge should be a Number");a+="; Max-Age="+Math.floor(u);}if(o.domain){if(!f.test(o.domain))throw new TypeError("option domain is invalid");a+="; Domain="+o.domain;}if(o.path){if(!f.test(o.path))throw new TypeError("option path is invalid");a+="; Path="+o.path;}if(o.expires){if("function"!=typeof o.expires.toUTCString)throw new TypeError("option expires is invalid");a+="; Expires="+o.expires.toUTCString();}if(o.httpOnly&&(a+="; HttpOnly"),o.secure&&(a+="; Secure"),o.sameSite){switch("string"==typeof o.sameSite?o.sameSite.toLowerCase():o.sameSite){case!0:a+="; SameSite=Strict";break;case"lax":a+="; SameSite=Lax";break;case"strict":a+="; SameSite=Strict";break;default:throw new TypeError("option sameSite is invalid")}}return a}function i(e,t){try{return t(e)}catch(t){return e}}/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
t.parse=o,t.serialize=n;var a=decodeURIComponent,s=encodeURIComponent,u=/; */,f=/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;}]);
});

var Cookie = unwrapExports(cookieUniversalCommon);

/* src/components/banner.svelte generated by Svelte v2.9.7 */

const cookies = Cookie();

function data() {
  return {
    cookieName: 'beyonk_gdpr',
    shown: true,
    heading: 'GDPR Notice',
    description: "We use cookies to offer a better browsing experience, analyze site traffic, personalize content, and serve targeted advertisements. Please review our privacy policy & cookies information page. By clicking accept, you consent to our privacy policy & use of cookies.",
    groups: {
      analytics: function () {
        console.log('No analytics cookies specified');
      },
      tracking: function () {
        console.log('No tracking cookies specified');
      },
      marketing: function () {
        console.log('No marketing cookies specified');
      },
      necessary: function () {
        console.log('No necessary cookies specified');
      },
    },
    choices: {
      necessary: true,
      marketing: true,
      analytics: true,
      tracking: true
    }
  }
}
var methods = {
  choose () {
    const { groups, choices, cookieName } = this.get();
    cookies.set(cookieName, { choices });
    const types = Object.keys(choices);
    types
      .filter(t => !!choices[t])
      .forEach(t => {
        groups[t]();
      });
    this.set({ shown: false });
  }
};

function oncreate() {
  const { cookieName } = this.get();
  const cookie = cookies.get(cookieName);
  if (cookie) {
    this.set({ shown: false });
  }
}
function add_css() {
	var style = createElement("style");
	style.id = 'svelte-7yn18i-style';
	style.textContent = "@import url('https://fonts.googleapis.com/css?family=Montserrat:600');h1.svelte-7yn18i{font-size:18px;font-weight:bold;margin:0}h2.svelte-7yn18i{font-size:14px;line-height:16px}h1.svelte-7yn18i,h2.svelte-7yn18i,label.svelte-7yn18i,button.svelte-7yn18i{color:#fff;font-family:'Montserrat', sans-serif}.wrapper.svelte-7yn18i{z-index:99999;position:fixed;bottom:0;display:flex;flex-direction:row;width:100vw;background-color:rgba(7, 9, 15, 0.75);color:#fff;padding:20px}.text.svelte-7yn18i{margin-right:20px}.right.svelte-7yn18i{display:flex;flex-direction:column;justify-content:center;min-width:200px;text-align:center;flex-grow:1}ul.svelte-7yn18i{display:inline-block;list-style-type:none;margin:0;padding:0}ul.svelte-7yn18i>li.svelte-7yn18i{display:inline-block}.operations.svelte-7yn18i{text-align:left}input[type=\"checkbox\"].svelte-7yn18i{display:none}input[type=\"checkbox\"]+label.svelte-7yn18i{display:block;position:relative;padding-left:35px;padding-right:15px;margin-bottom:10px;font-size:14px/20px;cursor:pointer;user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}input[type=\"checkbox\"]+label.svelte-7yn18i:before{content:'';display:block;width:20px;height:20px;border:1px solid #D6C3C9;position:absolute;left:0;top:0;opacity:.6;-webkit-transition:all .12s, border-color .08s;transition:all .12s, border-color .08s}input[type=\"checkbox\"]:checked+label.svelte-7yn18i:before{width:10px;top:-5px;left:5px;border-radius:0;opacity:1;border-top-color:transparent;border-left-color:transparent;-webkit-transform:rotate(45deg);transform:rotate(45deg)}button.svelte-7yn18i{font-size:14px;max-width:200px;text-transform:uppercase;font-weight:bold;padding:1vh 1vw;color:#fff;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);border-radius:4px;background-color:#ff9273;border:0;border:4px solid #ff9273;cursor:pointer;transition:all 0.3s ease}button.svelte-7yn18i:hover{background-color:#fff;color:#ff9273}@media only screen and (max-width: 600px){.wrapper.svelte-7yn18i{flex-direction:column}.operations.svelte-7yn18i{margin-bottom:35px}button.svelte-7yn18i{max-width:100vw;margin-bottom:2vh}}";
	appendNode(style, document.head);
}

function create_main_fragment(component, ctx) {
	var if_block_anchor;

	var if_block = (ctx.shown) && create_if_block(component, ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = createComment();
		},

		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insertNode(if_block_anchor, target, anchor);
		},

		p(changed, ctx) {
			if (ctx.shown) {
				if (if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block = create_if_block(component, ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},

		d(detach) {
			if (if_block) if_block.d(detach);
			if (detach) {
				detachNode(if_block_anchor);
			}
		}
	};
}

// (1:0) {#if shown}
function create_if_block(component, ctx) {
	var div, div_1, div_2, h1, text, text_1, h2, text_2, text_4, div_3, ul, li, input, text_5, label, li_1, input_1, text_8, label_1, li_2, input_2, text_11, label_2, li_3, input_3, text_14, label_3, text_19, div_4, button;

	function input_change_handler() {
		ctx.choices.necessary = input.checked;
		component.set({ choices: ctx.choices });
	}

	function input_1_change_handler() {
		ctx.choices.tracking = input_1.checked;
		component.set({ choices: ctx.choices });
	}

	function input_2_change_handler() {
		ctx.choices.analytics = input_2.checked;
		component.set({ choices: ctx.choices });
	}

	function input_3_change_handler() {
		ctx.choices.marketing = input_3.checked;
		component.set({ choices: ctx.choices });
	}

	function click_handler(event) {
		component.choose();
	}

	return {
		c() {
			div = createElement("div");
			div_1 = createElement("div");
			div_2 = createElement("div");
			h1 = createElement("h1");
			text = createText(ctx.heading);
			text_1 = createText("\n      ");
			h2 = createElement("h2");
			text_2 = createText(ctx.description);
			text_4 = createText("\n    ");
			div_3 = createElement("div");
			ul = createElement("ul");
			li = createElement("li");
			input = createElement("input");
			text_5 = createText("\n          ");
			label = createElement("label");
			label.textContent = "Neccessary Cookies";
			li_1 = createElement("li");
			input_1 = createElement("input");
			text_8 = createText("\n          ");
			label_1 = createElement("label");
			label_1.textContent = "Tracking Cookies";
			li_2 = createElement("li");
			input_2 = createElement("input");
			text_11 = createText("\n          ");
			label_2 = createElement("label");
			label_2.textContent = "Analytics Cookies";
			li_3 = createElement("li");
			input_3 = createElement("input");
			text_14 = createText("\n          ");
			label_3 = createElement("label");
			label_3.textContent = "Marketing Cookies";
			text_19 = createText("\n  ");
			div_4 = createElement("div");
			button = createElement("button");
			button.textContent = "Accept";
			h1.className = "svelte-7yn18i";
			h2.className = "svelte-7yn18i";
			div_2.className = "text svelte-7yn18i";
			addListener(input, "change", input_change_handler);
			setAttribute(input, "type", "checkbox");
			input.id = "gdpr-check-necessary";
			input.disabled = true;
			input.className = "svelte-7yn18i";
			label.htmlFor = "gdpr-check-necessary";
			label.className = "svelte-7yn18i";
			li.className = "svelte-7yn18i";
			addListener(input_1, "change", input_1_change_handler);
			setAttribute(input_1, "type", "checkbox");
			input_1.id = "gdpr-check-tracking";
			input_1.className = "svelte-7yn18i";
			label_1.htmlFor = "gdpr-check-tracking";
			label_1.className = "svelte-7yn18i";
			li_1.className = "svelte-7yn18i";
			addListener(input_2, "change", input_2_change_handler);
			setAttribute(input_2, "type", "checkbox");
			input_2.id = "gdpr-check-analytics";
			input_2.className = "svelte-7yn18i";
			label_2.htmlFor = "gdpr-check-analytics";
			label_2.className = "svelte-7yn18i";
			li_2.className = "svelte-7yn18i";
			addListener(input_3, "change", input_3_change_handler);
			setAttribute(input_3, "type", "checkbox");
			input_3.id = "gdpr-check-marketing";
			input_3.className = "svelte-7yn18i";
			label_3.htmlFor = "gdpr-check-marketing";
			label_3.className = "svelte-7yn18i";
			li_3.className = "svelte-7yn18i";
			ul.className = "svelte-7yn18i";
			div_3.className = "operations svelte-7yn18i";
			div_1.className = "left";
			addListener(button, "click", click_handler);
			button.type = "button";
			button.className = "svelte-7yn18i";
			div_4.className = "right svelte-7yn18i";
			div.className = "wrapper svelte-7yn18i";
		},

		m(target, anchor) {
			insertNode(div, target, anchor);
			appendNode(div_1, div);
			appendNode(div_2, div_1);
			appendNode(h1, div_2);
			appendNode(text, h1);
			appendNode(text_1, div_2);
			appendNode(h2, div_2);
			appendNode(text_2, h2);
			appendNode(text_4, div_1);
			appendNode(div_3, div_1);
			appendNode(ul, div_3);
			appendNode(li, ul);
			appendNode(input, li);

			input.checked = ctx.choices.necessary;

			appendNode(text_5, li);
			appendNode(label, li);
			appendNode(li_1, ul);
			appendNode(input_1, li_1);

			input_1.checked = ctx.choices.tracking;

			appendNode(text_8, li_1);
			appendNode(label_1, li_1);
			appendNode(li_2, ul);
			appendNode(input_2, li_2);

			input_2.checked = ctx.choices.analytics;

			appendNode(text_11, li_2);
			appendNode(label_2, li_2);
			appendNode(li_3, ul);
			appendNode(input_3, li_3);

			input_3.checked = ctx.choices.marketing;

			appendNode(text_14, li_3);
			appendNode(label_3, li_3);
			appendNode(text_19, div);
			appendNode(div_4, div);
			appendNode(button, div_4);
		},

		p(changed, _ctx) {
			ctx = _ctx;
			if (changed.heading) {
				text.data = ctx.heading;
			}

			if (changed.description) {
				text_2.data = ctx.description;
			}

			input.checked = ctx.choices.necessary;
			input_1.checked = ctx.choices.tracking;
			input_2.checked = ctx.choices.analytics;
			input_3.checked = ctx.choices.marketing;
		},

		d(detach) {
			if (detach) {
				detachNode(div);
			}

			removeListener(input, "change", input_change_handler);
			removeListener(input_1, "change", input_1_change_handler);
			removeListener(input_2, "change", input_2_change_handler);
			removeListener(input_3, "change", input_3_change_handler);
			removeListener(button, "click", click_handler);
		}
	};
}

function Banner(options) {
	init(this, options);
	this._state = assign(data(), options.data);
	this._intro = true;

	if (!document.getElementById("svelte-7yn18i-style")) add_css();

	if (!options.root) {
		this._oncreate = [];
	}

	this._fragment = create_main_fragment(this, this._state);

	this.root._oncreate.push(() => {
		oncreate.call(this);
		this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
	});

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);

		callAll(this._oncreate);
	}
}

assign(Banner.prototype, proto);
assign(Banner.prototype, methods);

function attachBanner (target, data = {}) {
  const banner = new Banner({
    target,
    data
  });
}

export { attachBanner };
