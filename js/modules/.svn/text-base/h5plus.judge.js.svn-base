define(['h5plus.toolkit','h5plus.dya.script', 'wx.info.inject', 'h5plus.config', 'h5plus.metainfo'], 
	function(toolkit, scriptMan, wxInject, configObj, metainfo) {
	'use strict';

	var paths = configObj.paths;
	function appH5sdkAndInject() {
		//只在微信浏览器中浏览时, 自动加载h5sdk以及注入微信相关埋点.
		if(!toolkit.isWechat()) return;
		if(!window.h5sdk) {
			//如果页面上没有引入h5sdk, 则先引入在注入埋点代码
			scriptMan.loadScript(paths.h5sdk, function() {
				wxInject.run();
			});
		} else {
			//如果页面已经引入h5sdk, 则注入埋点代码
			wxInject.run();
		}
	};
	if(metainfo.hasWechatCode == 'n' && configObj.ifInject(metainfo.account)) {
		//如果不包含微信任何代码, 需要统计scroll, click, read, share
		appH5sdkAndInject();
	} else if(metainfo.hasWechatCode == 'y') {
		
	} else {
		//如果是非微信网页应用,需要统计
	}
});