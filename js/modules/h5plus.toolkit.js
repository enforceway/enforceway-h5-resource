define(['h5plus.config'], function(configObj) {
    'use strict';

	var paths = configObj.paths;
    var h5plusToolkit = {}, DOMContentLoaded, extend, ajax, hasOwn = Object.prototype.hasOwnProperty;
	h5plusToolkit.browser = window.navigator.userAgent;
    //是否dom loaded
    var domReadyWatcher = (function() {
        function Construct() {
            this.ifReady = function() {
                return (this.instantiated == true) ? true : false;
            };
            this.instantiated = false;
            this.ready = function() {
                var tmpFn = null;
                this.instantiated = true;
                while ((tmpFn = this.callbackQueue.shift())) {
                    tmpFn();
                }
            };
            this.callbackQueue = [];
            this.clear = function() {
                this.callbackFn = [];
            };
            this.push = function(callbackFn) {
            	callbackFn();
            	return;
                if (this.instantiated === true) {
                    callbackFn();
                } else {
                    this.callbackQueue.push(callbackFn);
                }
            };
        };
        return new Construct();
    })();
    var ifMobility, isWechat;
    var toString = Object.prototype.toString;
    var locationHref = window.location.href;
    (function() {
        //多重集成
        extend = function() {
            var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;
            if (typeof target === "boolean") {
                deep = target;
                target = arguments[1] || {};
                i = 2;
            }
            if (typeof target !== "object" && !isFunction(target)) {
                target = {};
            }
            if (length === i) {
                target = this;
                --i;
            }
            for (; i < length; i++) {
                if ((options = arguments[i]) != null) {
                    for (name in options) {
                        src = target[name];
                        copy = options[name];
                        if (target === copy) {
                            continue;
                        }
                        if (deep && copy && (UTIL.isPlainObject(copy) || (copyIsArray = UTIL.isArray(copy)))) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && UTIL.isArray(src) ? src : [];
                            } else {
                                clone = src && UTIL.isPlainObject(src) ? src : {};
                            }
                            target[name] = extend(deep, clone, copy);
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }
            return target;
        };
        //数组是否支持indexOf
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function(searchElement, fromIndex) {
                var k;
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }
                var O = Object(this);
                var len = O.length >>> 0;
                if (len === 0) {
                    return -1;
                }
                var n = +fromIndex || 0;
                if (Math.abs(n) === Infinity) {
                    n = 0;
                }
                if (n >= len) {
                    return -1;
                }
                k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
                while (k < len) {
                    if (k in O && O[k] === searchElement) {
                        return k;
                    }
                    k++;
                }
                return -1;
            };
        }
        //数组是否支持forEach
        if (!Array.prototype.forEach) {
            Array.prototype.forEach = function forEach(callback, thisArg) {
                var T, k;
                if (this == null) {
                    throw new TypeError("this is null or not defined");
                }
                var O = Object(this);
                var len = O.length >>> 0;
                if (typeof callback !== "function") {
                    throw new TypeError(callback + " is not a function");
                }
                if (arguments.length > 1) {
                    T = thisArg;
                }
                k = 0;

                while (k < len) {
                    var kValue;
                    if (k in O) {
                        kValue = O[k];
                        callback.call(T, kValue, k, O);
                    }
                    k++;
                }
            };
        }
        //元素是否符合正则数组中某一个正则要求
        var inRegArray = function(elem, array, i) {
            var len;
            if (array) {
                len = array.length;
                i = i ? i < 0 ? Math.max(0, len + i) : i : 0;
                for (; i < len; i++) {
                    if (i in array && array[i].test(elem)) {
                        return true;
                    }
                }
            }
            return false;
        };
        if(!document.head) {
            document.head = document.getElementsByTagName('head')[0];
		}

        //通过User-Agent判断是否是移动浏览器
        ifMobility = function() {
        	//这些认定为移动浏览器
            var mFlagArr = [/Opera Mobi/i, /MQQBro/i, /IPhone/i, /IPad/i, /Mobile Safari/i, /Windows Phone/i, /Opera Mini/i];
            //这些也认定为移动浏览器
            mFlagArr.concat["Android", "SymbianOS", "iPod"];
            var appVersion = window.navigator.appVersion;
            return inRegArray(appVersion, mFlagArr);
        };
        isWechat = function() {
            var mFlagArr = /MicroMessenger/i;
            return mFlagArr.test(h5plusToolkit.browser);
        };
        var isPlainObject = function(obj) {
            if (!obj || toString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval) {
                return false;
            }
            if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
            var key;
            for (key in obj) {}
            return key === undefined || hasOwn.call(obj, key);
        };
        var isArray = function(inputArr) {
            return Object.prototype.toString.call(inputArr) === '[object Array]';
        };
        var isFunction = function(func) {
            return (typeof(func) == 'function');
        };
        var isObject = function(obj) {
            return (Object.prototype.toString.call(obj) === '[object Object]');
        };
		//页面参数集成为js object部分
        var locHref = locationHref;
        var urlParamsToJson = function(urlstr) {
            if (urlstr) {
	            var obj = {};
                var strArr = urlstr.split('&');
                for (var i = 0; i < strArr.length; i++) {
                	//如果截取部分是空字符串,则跳过
                	if(!strArr[i]) continue;
                    var temArr = strArr[i].split('=');
                    if(temArr.length != 2) continue;

                    obj[temArr[0]] = temArr[1];
                }
                return obj;
            } else {
                return {};
            }
        };
        locHref = locHref.split('?');
        //确认下页面url是否有?,包含一些额外的参数,这里要取得的额外参数有from和pandora模块中的fromOpenid对应的值
        locHref[1]?(locHref = locHref[1]):(locHref = null);
        if(!locHref) {
        	locHref = {};
        } else {
        	locHref = urlParamsToJson(locHref);
        }
        extend(h5plusToolkit, {
        	urlParamObj : locHref,
            isPlainObject : isPlainObject,
            isArray : isArray,
            isFunction : isFunction,
            isObject : isObject,
            isWechat : isWechat,
            isMobile : ifMobility
        });
    })();

    (function() {
        //事件绑定以及解除
        var bindEvent, removeEvent;
        if (document.addEventListener) {
            bindEvent = function(context, name, func, capture) {
                if (capture == undefined) {
                    capture = false;
                }
                context.addEventListener(name, func, false);
            };
            removeEvent = function(context, name, func) {
                context.removeEventListener(name, func);
            };
            DOMContentLoaded = function() {
                if (domReadyWatcher.ifReady()) return;
                domReadyWatcher.ready();
                document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
            };
        } else if (document.attachEvent) {
            bindEvent = function(context, name, func, capture) {
                if (capture == undefined) {
                    capture = false;
                }
                if (!/^on/.test(name)) {
                    name += 'on';
                }
                context.attachEvent('' + name, func, false);
            };
            removeEvent = function(context, name, func) {
                context.detachEvent('on' + name, func);
            };
            DOMContentLoaded = function() {
                if (domReadyWatcher.ifReady()) return;
                // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                if (document.readyState === "complete") {
                    domReadyWatcher.ready();
                    document.detachEvent("onreadystatechange", DOMContentLoaded);
                }
            };
        }
        var now = (Date.now)?(Date.now):(function(){new Date().getTime()});
        var arrToJsonString = function(jsonArr) {
            if(!jsonArr || jsonArr.length === 0) return null;
            var resArr = [];
            jsonArr.forEach(function(item, index) {
                resArr.push(JSON.stringify(item));
            });
            return '[' + resArr.join(',') + ']';
        };
        extend(h5plusToolkit, {
            removeEvent: removeEvent,
            bindEvent: bindEvent,
            now: now,
            arrayToJsonStr: arrToJsonString
        });
    })();

    //throttle和debounce
    (function() {
        var throttle = function(func, wait, options) {
            var context, args, result;
            var timeout = null;
            // 上次执行时间点
            var previous = 0;
            if (!options) options = {};
            // 延迟执行函数
            var later = function() {
                // 若设定了开始边界不执行选项，上次执行时间始终为0
                previous = options.leading === false ? 0 : h5plusToolkit.now();
                timeout = null;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            };
            return function() {
                var nowtimestamp = h5plusToolkit.now();
                // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
                if (!previous && options.leading === false) previous = nowtimestamp;
                // 延迟执行时间间隔
                var remaining = wait - (nowtimestamp - previous);
                context = this;
                args = arguments;
                // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
                // remaining大于时间窗口wait，表示客户端系统时间被调整过
                if (remaining <= 0 || remaining > wait) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = nowtimestamp;
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                    //如果延迟执行不存在，且没有设定结尾边界不执行选项
                } else if (!timeout && options.trailing !== false) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        };
        var debounce = function(func, wait, immediate) {
            var timeout, args, context, timestamp, result;
            var later = function() {
                // 据上一次触发时间间隔
                var last = h5plusToolkit.now() - timestamp;
                // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
                if (last < wait && last > 0) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = null;
                    // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
                    if (!immediate) {
                        result = func.apply(context, args);
                        if (!timeout) context = args = null;
                    }
                }
            };
            return function() {
                context = this;
                args = arguments;
                timestamp = h5plusToolkit.now();
                var callNow = immediate && !timeout;
                // 如果延时不存在，重新设定延时
                if (!timeout) timeout = setTimeout(later, wait);
                if (callNow) {
                    result = func.apply(context, args);
                    context = args = null;
                }

                return result;
            };
        };
        extend(h5plusToolkit, {
            throttle: throttle,
            debounce: debounce
        });
    })();

    //异步请求方法部分
    (function() {
        var getReg = /^get$/i,
            postReg = /^post$/i,
            deleteReg = /^delete$/i;
        var appJsonReg = /application\/json/i,
            wformReg = /x-www-form-urlencoded/i;
        var objectToFlatQryStr = function(targetObj) {
            var paramArr = [];
            for (var tmpAttr in targetObj) {
                if (typeof(targetObj[tmpAttr]) == 'object') {
                    objectToFlatQryStr(targetObj[tmpAttr]);
                } else if (typeof(targetObj[tmpAttr]) == 'function') {

                } else {
                    paramArr.push(tmpAttr + '=' + targetObj[tmpAttr]);
                }
            }
            return paramArr.join('&');
        };
        var ajaxCall = function(burl, paramStr, succFnResp, errorFnResp, requestParamObj) {
            var ifCache = requestParamObj.cache;
            var ifAsync = requestParamObj.async;
            var postOrGet = requestParamObj.type;
            var timeout = requestParamObj.timeout;
            var contentType = requestParamObj.contentType;
            var timeoutTimer = null;
            var param = '';
            var isXML = false;
            var isCache = false;
            var http_request = false;
            function doHttpRequest() {
                if (window.XMLHttpRequest) {
                    http_request = new XMLHttpRequest();
                    if (http_request.overrideMimeType) {
                        http_request.overrideMimeType('text/xml');
                    }
                } else if (window.ActiveXObject) {
                    try {
                        http_request = new ActiveXObject("Msxml2.XMLHTTP");
                    } catch (e) {
                        try {
                            http_request = new ActiveXObject("Microsoft.XMLHTTP");
                        } catch (e) {}
                    }
                }
                if (!http_request) {
                    alert('无法初始化http请求对象');
                    return false;
                }
                http_request.onreadystatechange = handleStateChange;
                http_request.open(postOrGet, burl, ifAsync);
                http_request.setRequestHeader("Content-Type", contentType);
                if (postReg.test(postOrGet)) {
                    if (paramStr) {
                        http_request.send(paramStr);
                    } else {
                        http_request.send(null);
                    }
                } else if (getReg.test(postOrGet) || deleteReg.test(postOrGet)) {
                    http_request.send(null);
                }
                if (ifAsync && timeout > 0) {
                    timeoutTimer = setTimeout(function() {
                        http_request.abort('timeout');
                        clearTimeout(timeoutTimer);
                        errorFnRes({
                            err_code: 506,
                            err_msg: '访问超时'
                        });
                    }, timeout);
                }
            };

            function handleStateChange() {
                if (http_request.readyState == 4 && http_request.status == 200) {
                    clearTimeout(timeoutTimer);
                    var content;
                    content = http_request.responseText;
                    var json = null;
                    try {
                        json = eval('(' + content + ')');
                    } catch (e) {
                        if (UTIL.debug_mode) {
                            alert('链接: ' + burl + ', 返回的json格式不正确:' + e.message);
                        }
                        throw new Error(e.message);
                    }
                    succFnResp(json);
                } else if (http_request.readyState == 4) {
                    if (http_request.status >= 400) {
                        errorFnResp();
                    } else if (http_request.status >= 500) {
                        errorFnResp();
                    }
                }
            };
            doHttpRequest();
        };
        ajax = function(optionsObj) {
            var dataStr = '';
            var paramDataObj = optionsObj.data ? optionsObj.data : {};
            var url = optionsObj.url;
            var success;
            var error;
            var method = optionsObj.method;
            var contentType = optionsObj.contentType;
            var type = optionsObj.type;
            var tmpObj = {
                dataType: 'json',
                async: true,
                cache: false,
                contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                success: function() {},
                error: function() {}
            };
            extend(tmpObj, optionsObj);
            if (appJsonReg.test(tmpObj.contentType)) {
                tmpObj.contentType = 'application/json;charset=utf-8';
                dataStr = JSON.stringify(paramDataObj);
            } else if (wformReg.test(tmpObj.contentType)) {
                dataStr = objectToFlatQryStr(paramDataObj);
            }
            (function() {
                success = tmpObj.success;
                error = tmpObj.error;
                delete tmpObj.url;
                delete tmpObj.data;
                delete tmpObj.error;
                delete tmpObj.success;
            })();
            /* 对参数格式进行处理,主要便于测试  */
            if(getReg.test(tmpObj.type) && dataStr !== '') {
                if(url.indexOf('?') === -1) {
                    url += '?';
                }
                if(url.lastIndexOf('?') === (url.length - 1)) {
                    url += dataStr;
                } else {
                    url += '&' + dataStr;
                }
                dataStr = '';
            }
            ajaxCall(url, dataStr, success, error, tmpObj);
        };
        extend(h5plusToolkit, {
            ajax: ajax
        });
    })();

    //ROP RMR log 记录部分
    (function() {
    	var serverUrl = paths.rmrAPIUrl;
        var logeObj = {
            ropLogs: {},
            serverUrl: serverUrl,
            config: function(a) {
                this.serverUrl = a
            },
            add: function(a, b, c) {
                if (!a || !b) return alert("rmr传入参数错误."), !1;
                c || (c = (new Date).getTime()), this.ropLogs["logList"] || (this.ropLogs["logList"] = []);
                var d = {};
                return d.type = a, d.content = b, d.logTime = c, this.ropLogs["logList"].push(d), !0;
            },
            clear: function() {
                this.ropLogs["logList"] = []
            },
            send: function(a, b) {
                if (!this.serverUrl) return alert("请先进行config操作");
                var jsonLogObj = this.ropLogs["logList"];
                ajax({
                    type: "POST",
                    url: serverUrl,
                    contentType: 'application/json',
                    data: {
                        logList: jsonLogObj
                    },
                    success: a,
                    error: b
                });
            }
        };
        var send = function(typeCode, logStr, sendSuccFn, sendErrFn) {
            var result = logeObj.add(typeCode, logStr);
            if (result) {
                logeObj.send(sendSuccFn, sendErrFn);
                logeObj.clear();
            }
        };
        //typecode, json格式的参数, 成功回调, 失败回调
        var rmrLogHandler = function(typeCode, utlogStr, sendSuccFn, sendErrFn) {
        	if(!sendSuccFn) sendSuccFn = function(){};
        	if(!sendErrFn) sendErrFn = function(){};
            send(typeCode, utlogStr, sendSuccFn, sendErrFn);
        };
        extend(h5plusToolkit, {
            ROP: {send : rmrLogHandler}
        });
    })();

    //meta 查询
	(function() {
		var metaQry = null;
		function toArray(pseudoArray) {
			return Array.prototype.slice.call(pseudoArray);
		};
		if(document.querySelector) {
			metaQry = function() {
				return document.querySelectorAll('meta');
			};
			metaQry = function(metaName) {
				if(metaName != '') {
					metaName = "name='" + metaName + "'";
					return document.querySelector("meta[" + metaName + "]");
				} else {
					metaName = "name";
					var metas = document.querySelectorAll("meta[" + metaName + "]");
					metas = toArray(metas);
					var metaObj = {};
					for(var indexer = 0, len = metas.length, item;indexer < len; indexer++) {
						item = metas[indexer];
						metaObj[item['name']] = item['content'];
					}
					/*metas.forEach(function(item, index) {
						metaObj[item['name']] = item['content'];
					});*/
					return metaObj;
				}
			}
		} else {
			metaQry = function(metaName) {
				var metaObj = {};
				var metas = document.getElementsByTagName('meta');
				for(var indexer = 0, len = metas.length; indexer < len; indexer++) {
					if(metaName != '' && metaName == metas[indexer]['name']) {
						return etas[indexer];
					} else if(metaName == '' && metas[indexer]['name']) {
						metaObj[metas[indexer]['name']] = metas[indexer]['content'];
					}
				}
				return metaObj;
			};
		}
		
		extend(h5plusToolkit, {
			queryMeta: function(metaName) {
				return metaQry(metaName.trim());
			}
		});
	})();
    extend(h5plusToolkit, {
        'extend' : extend,
        'ready' : function(fn) {
            domReadyWatcher.push(fn);
        }
    });
    //生成uuid
    !function(){
        // Private array of chars to use
        var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = function(len, radix) {
            var chars = CHARS, uuid = [], i;
            radix = radix || chars.length;
            if (len) {
                // Compact form
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
            } else {
                // rfc4122, version 4 form
                var r;
                // rfc4122 requires these characters
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';
                // Fill in random data.  At i==19 set the high bits of clock sequence as
                // per rfc4122, sec. 4.1.5
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }
            return uuid.join('');
        };
        // A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
        // by minimizing calls to random()
		var uuidFast = function() {
            var chars = CHARS, uuid = new Array(36), rnd = 0, r;
            for (var i = 0; i < 36; i++) {
                if (i == 8 || i == 13 || i == 18 || i == 23) {
                    uuid[i] = '-';
                } else if (i == 14) {
                    uuid[i] = '4';
                } else {
                    if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                    r = rnd & 0xf;
                    rnd = rnd >> 4;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
            return uuid.join('');
        };
		/*// A more compact, but less performant, RFC4122v4 solution:
		var uuidCompact = function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };*/
    	var uuidMaker = function(){
    		return "enforceway";
    	};
    	extend(h5plusToolkit, {
    		fastUUID: uuidFast,
    		uuid : uuid
    	});
    }();
    //ifvalidarray返回一个空数组或者null
    //evalize使用js 的eval方法，返回一个null或者eval后的js表达式
    !function(){
    	var ifValidArray = function(jsonArrStr) {
			if(jsonArrStr == null || jsonArrStr == undefined) jsonArrStr = '[]';
			if(h5plusToolkit.isArray(jsonArrStr)) return jsonArrStr;
			try {
				jsonArrStr = eval('(' + jsonArrStr + ')');
				return jsonArrStr;
			} catch(e) {
				return null;
			}
		};
    	function evalize(expressionString) {
			try{
				expressionString = eval('(' + expressionString + ')');
			} catch(e) {
				expressionString = null;
			}
			return expressionString;
	    };
	    extend(h5plusToolkit, {
    		evalize: evalize,
    		ifValidArray : ifValidArray
    	});
    }();

    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
        window.addEventListener("load", DOMContentLoaded, false);
    } else if (document.attachEvent) {
        document.attachEvent("onreadystatechange", DOMContentLoaded);
        window.attachEvent("onload", DOMContentLoaded);
    }
    return h5plusToolkit;
});
