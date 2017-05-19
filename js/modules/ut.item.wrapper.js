define(['h5plus.aggregate','h5plus.pandora', 'h5plus.toolkit', 'h5plus.rmr.util','h5plus.storage','h5plus.config'], 
	function(aggregation,pandora,toolkit,util,storage,configObj) {
	'use strict';

	//var pid = aggregation.pid;
	var devicePlatform = toolkit.isMobile()?'mobile':'pc';
	var orientation = '', lideRotate;
	var storageConfig = pandora;

	(function() {
		//PC浏览器没有orientation属性
		if(window.orientation==undefined ||window.orientation==null) return;

		lideRotate = function() {
			var modeMap = {
				'm-90' : 'landscape',
				'm90' : 'landscape',
				'm0' : 'portrait'
			};
			return modeMap['m' + window.orientation];
		};
		orientation = lideRotate();
		toolkit.bindEvent(window, 'orientationchange', function() {
    		orientation = lideRotate();
    	}, false);
	})();
	var logStrGenerator = function(utItemObj) {
		var separator_1st = storageConfig.string.separator_1st;
		var separator_2nd = storageConfig.string.separator_2nd;
		var resultArr = [];
		var attrsWrapper = storageConfig[utItemObj.action_type + 'AttrWrapper'];
		attrsWrapper.forEach(function(item, index) {
			resultArr.push(item + separator_2nd + utItemObj[item]);
		});
		return resultArr.join(separator_1st);
	};
	var addItemWrapper = function(itemObj) {
		//操作类型包括'scroll','click','view','share',否则不会记录
		if(!itemObj.action_type) return;
		itemObj = itemWrapper(itemObj);
		//操作类型包括'scroll','click','view','share',否则不会记录
		var typeCode = storageConfig[itemObj.action_type + 'TypeCode'];
		if(configObj.ifUploadToServer(itemObj.action_type)) {
			//如果typeCode没指定或操作类型是scroll、click、share
			toolkit.ROP.send(typeCode, logStrGenerator(itemObj), function(res) {
				
			});
		} else {
			addItem(itemObj);
//			util.addItem(itemObj);
		}
	};
	var addItem = function(utLog) {
		var actionType = utLog.action_type;
		var logArr = storage.getStorage(pandora[actionType]);
		logArr = toolkit.evalize(logArr);
		if(logArr = toolkit.ifValidArray(logArr)) logArr.push(utLog);
		storage.setStorage(pandora[actionType], utLogTransiter.wrap(logArr));
	};
	var utLogTransiter = (function() {
        function Construct() {
        	this.pattern = '';
            this.wrap = function(inputArr) {
            	var resArr = [];
            	inputArr.forEach(function(item, index) {
            		resArr.push(JSON.stringify(item));
            	});
            	return '[' + resArr.join(',') + ']';
            };
        };
        return new Construct();
    })();
	var itemWrapper = function(itemObj) {
		//针对要传入的数据进行封装一下，增加一些公用的属性以及属性值
		var timestamp = toolkit.now();
		toolkit.extend(itemObj, {
			h5program : aggregation.h5program,
			h5uuid : 	aggregation.h5uuid,
			h5pjtid : 	aggregation.h5pjtid,
			weixin_id: 		aggregation.account,
			weixin_openid: 	aggregation.wxOpenid,
			weixin_country: aggregation.wxCountry,
			weixin_province:aggregation.wxProvince,
			weixin_city: 	aggregation.wxCity,
			weixin_nick_name: 		aggregation.wxNickname,
			weixin_gender: 		aggregation.wxGender,
			weixin_header_img_url: aggregation.wxAvatar,
			page_title: 	aggregation.pageTitle,
			page_url: 		aggregation.pageUrl,
			ip: 			aggregation.ip,
			country: 		aggregation.country,
			province: 		aggregation.province,
			city: 			aggregation.city,
			site_name : 	aggregation.site_name,
			project_name : 	aggregation.project_name,
			orientation: orientation,
			platform:devicePlatform,
			create_time:timestamp,
			original_page_url : aggregation.original_page_url
		});
		return itemObj;
	};
	//addItem方法把参数中传入的item加入到本地存储或者直接上传到服务器上
	//wrapItem方法对参数中传入的item增加公用的属性,并返回增加属性后的js对象
	//logStrGenerator方法对参数中传入的item按照配置中约定的参数的顺序排列以及连接字符串形式,进行连接, 并返回
	return {
		appendItem : addItemWrapper,
		wrapItem: itemWrapper,
		logStrGenerator: logStrGenerator
	};
});
