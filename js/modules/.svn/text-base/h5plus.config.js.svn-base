define(function() {
	'use strict';

	var configObj = {
		env: 'test',
		wxjssdkUrl : window.location.protocol + '//res.wx.qq.com/open/js/jweixin-1.0.0.js',
		paths: {
			h5sdk: 'http://test.h5plus.net/frontend/js/h5sdk/1.01/h5sdk.js',
			netInfoPath : 'http://h5plus.net/H5PlusISV/page_info.php',
			rmrAPIUrl : 'http://canal.ruixuesoft.com:30000/log'
		},
		ifInject: function(pageAccount) {
			return (configObj.env == 'test' && pageAccount == configObj['account' + configObj.env]) || (configObj.env == 'demo' && pageAccount == configObj['account' + configObj.env]) || (configObj.env == 'prod' && pageAccount == configObj['account' + configObj.env]);	
		},
		ifUploadToServer : function(actionType) {
			if(actionType == 'share') return true;
			else if(actionType == 'click') return false;
			else if(actionType == 'view') return false;
			else if(actionType == 'scroll') return true;
		}
	};
	return configObj;
});
