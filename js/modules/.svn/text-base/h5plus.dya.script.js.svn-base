define(function(require, exports, module) {
    'use strict';

    if(!document.head) {
        document.head = document.getElementsByTagName('head')[0];
    }

    //动态加载js文件
    var loadScript = function(src, callback) {
        var el = document.createElement('script'), loaded = false;
        /* IE<9 不支持 onload所以也需要引用onreadystatechange,
        IE9 支持两种形式加载事件所以使用loaded变量防止运行两次*/
        el.onload = el.onreadystatechange = function() {
            if (!loaded && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
                loaded = true;
                if (typeof callback === 'function') {
                    callback();
                }
            }
        };
        if (loadScript.loaded.ifLoaded(src)) return;
        el.src = src;
        loadScript.loaded.push(src);
        document.head.appendChild(el);
    };
    //是否重复加载同一js文件
    loadScript.loaded = (function() {
        function Construct() {
            this.ifLoaded = function(src) {
                return this.loadedSrcQueue.indexOf(src) > -1 ? true : false;
            }
            this.loadedSrcQueue = [];
            this.push = function(scriptsrc) {
                this.loadedSrcQueue.push(scriptsrc);
            };
        };
        return new Construct();
    })();
    //多项加载时候执行
    var multiLoad = function(srcs, callback) {
        var dependencies = srcs.length;
        var dependencyOnloadCallback = function() {
            dependencies--;
            callback();
        };
        srcs.forEach(function(item, index) {
            loadScript(item, dependencyOnloadCallback);
        });
    };
    return {
        loadScript : loadScript,
        multiLoadScript : multiLoad
    };
});
