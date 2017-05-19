(function(window, document) {
	var config = {};
	!function(){
		config.env = 'test';
		config.h5sdk = (config.env=='test'?('http://test.h5plus.net'):(config.env=='prod'?'http://h5plus.net':'')) + '/frontend/js/h5sdk/1.01/h5sdk.js';
		config.account = {
			test: {
				//瑞雪云公众号是完整授权
				fullGrant: 1,
				componentAppId : 'wxe1d1bbc0cda53aa3',
				weixin_id: 'gh_ce89dcb24ea1',
				pid: '55cbf3a3986a9b483376f279'
			},
			prod: {
				//h5plus公众号
				fullGrant: 1,
				componentAppId : 'wx2aeb95ce677f8e7e',
				weixin_id: 'gh_7996537d8300',
				pid: '55cc2ada0a4f42e010250333'
			}
		};
	}();
	//是否是微信浏览器,pc客户端移动设备端的微信都算
	var isWechat = function() {
        var mFlagArr = /MicroMessenger/i;
        return mFlagArr.test(window.navigator.userAgent);
	}();
	//本部分代码有重要功能,用来判断是否加载了h5plus-amd文件
	var loadScript = function(src, callback) {
        var el = document.createElement('script'), loaded = false;
        el.onload = el.onreadystatechange = function() {
            if (!loaded && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
                loaded = true;
                if (typeof callback === 'function') {
                    callback();
                }
            }
        };
        el.src = src;
        document.head.appendChild(el);
    };
	/*
    function appStart() {
     	//开发过程中使用
    	loadScript(['/frontend/js/h5event/1.0/require.config.js'], function() {
        	loadScript(['/frontend/js/h5event/1.0/ut.run.js'], function() {});
        });
    };
	*/
    function appStart() {
    	//上生产环境时使用
    	loadScript('/frontend/js/h5event/1.0/h5event.min.js', function() {});
    };

	if(isWechat) {
		h5sdk.setComponentAppId(config.account[config.env]['componentAppId']);
		h5sdk.wxOpenidInit(config.account[config.env]['pid'],config.account[config.env]['weixin_id'], config.account[config.env]['fullGrant']);
	}
	/*
	var tmp = h5sdk.callAPIByName('55cbf3a3986a9b483376f279',
								'ruixue.tools.mts.api.findpaging',
								{},
								function(res){
									console.log(res);
								},function(res){
									console.log(res);
								});
	*/
	//loadScript('/frontend/js/requirejs/2.1.22/require.js', appStart);
	loadScript('/frontend/js/h5plus-amd/2.1/require.min.js', appStart);
})(window, document)
