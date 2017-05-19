define(['h5plus.toolkit'], function(toolkit) {
	'use strict';

	var getSession, setSession, removeSession, getStorage, setStorage, removeStorage,
		cookie, removeCookie, reset;
	(function() {
		//使用cookie保存记录
		var pluses = /\+/g;
	    var extend = toolkit.extend;
	    var isFn = toolkit.isFunction;
	    function encode(s) {
	        return config.raw ? s : encodeURIComponent(s);
	    }

	    function decode(s) {
	        return config.raw ? s : decodeURIComponent(s);
	    }

	    function stringifyCookieValue(value) {
	        return encode(config.json ? JSON.stringify(value) : String(value));
	    }

	    function parseCookieValue(s) {
	        if (s.indexOf('"') === 0) {
	            // This is a quoted cookie as according to RFC2068, unescape...
	            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
	        }
	        try {
	            // Replace server-side written pluses with spaces.
	            // If we can't decode the cookie, ignore it, it's unusable.
	            // If we can't parse the cookie, ignore it, it's unusable.
	            s = decodeURIComponent(s.replace(pluses, ' '));
	            return config.json ? JSON.parse(s) : s;
	        } catch (e) {}
	    }
	    function read(s, converter) {
	        var value = config.raw ? s : parseCookieValue(s);
	        return isFn(converter) ? converter(value) : value;
	    }
	    var config = function(key, value, options) {
	        // Write
	        if (value !== undefined && !isFn(value)) {
	            options = extend({}, config.defaults, options);

	            if (typeof options.expires === 'number') {
	                var days = options.expires,
	                    t = options.expires = new Date();
	                t.setTime(+t + days * 864e+5);
	            }

	            return (document.cookie = [
	                encode(key), '=', stringifyCookieValue(value),
	                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
	                options.path ? '; path=' + options.path : '',
	                options.domain ? '; domain=' + options.domain : '',
	                options.secure ? '; secure' : ''
	            ].join(''));
	        }
	        // Read
	        var result = key ? undefined : {};
	        // To prevent the for loop in the first place assign an empty array
	        // in case there are no cookies at all. Also prevents odd result when
	        // calling cookie().
	        var cookies = document.cookie ? document.cookie.split('; ') : [];
	        for (var i = 0, l = cookies.length; i < l; i++) {
	            var parts = cookies[i].split('=');
	            var name = decode(parts.shift());
	            var cookie = parts.join('=');
	            if (key && key === name) {
	                // If second argument (value) is a function it's a converter...
	                result = read(cookie, value);
	                break;
	            }
	            // Prevent storing a cookie that we couldn't decode.
	            if (!key && (cookie = read(cookie)) !== undefined) {
	                result[name] = cookie;
	            }
	        }
	        return result;
	    };

	    config.defaults = {};

	    removeCookie = function(key, options) {
	        if (cookie(key) === undefined) {
	            return false;
	        }
	        // Must not alter options, thus extending a fresh object...
	        cookie(key, '', extend({}, options, {
	            expires: -1
	        }));
	        return !cookie(key);
	    };
	    cookie = config;
	})();
	var setCookie = function(key, value, options) {
		if(!options) {
			options = {expires : 0};
		}
		cookie(pkey, value, options);
	};
	//优先使用localStorage保存记录
	if(window.localStorage) {
		removeStorage = function(key) {
			localStorage.removeItem(key);
		};
		setStorage = function(key, value) {
			localStorage.setItem(key, value);
		};
		getStorage = function(key) {
			return localStorage.getItem(key);
		};
	} else {
		removeStorage = function(key) {
			cookie(key, 'pending dumped cookie', {
				expires: -1
			});
		};
	    setStorage = function(key, value) {
			cookie(key, value, {expires : 3650});
	    };
	    getStorage = function(key) {
	    	return cookie(key);
		};
	}
	//优先使用sessionStorage保存记录
	if(window.sessionStorage) {
		removeSession = function(key) {
			sessionStorage.removeItem(key);
		};
		setSession = function(key, value) {
			sessionStorage.setItem(key, value);
		};
		getSession = function(key) {
			return sessionStorage.getItem(key);
		};
	} else {
		removeSession = function(key, value) {
			cookie(key, value, {
				expires: -1
			});
		};
	    setSession = function(key, value) {
			cookie(key, value, {expires : 0});
	    };
	    getSession = function(key) {
	    	return cookie(key);
		};
	};
	return {
		removeSession : removeSession,
		getSession : getSession,
		setSession : setSession,
		removeStorage : removeStorage,
		getStorage : getStorage,
		setStorage : setStorage
	};
});