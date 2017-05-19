require([
	'h5plus.toolkit',
	'h5plus.dya.script',
	'h5plus.config',
	'h5plus.aggregate',
	'ut.event.binder',
	'ut.logUploader',
	'h5plus.judge' /* 业务级别模块 */
], function(toolkit,scriptManager, config, aggregate, binder, logloader) {
	'use strict';
	//处理ip和地区
	var paths = config.paths;
	scriptManager.loadScript(paths.netInfoPath, function() {
		var netInfo = window.h5NetInfo;
		aggregate.ip = netInfo.ip;
		aggregate.country = netInfo.country;
		aggregate.province = netInfo.province;
		aggregate.city = netInfo.city;
    });
    logloader.run();
    binder.runScroll();
    binder.runClick();
    binder.runView();
    //保存piwikid、应用平台标识、是否是微信网页应用标识、微信网页应用的pid和weixin_id所在meta
	window.h5event = toolkit;
});
