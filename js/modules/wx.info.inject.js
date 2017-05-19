define(['h5plus.aggregate','h5plus.metainfo', 'h5plus.config', 'h5plus.dya.script','h5plus.toolkit','h5plus.pandora','ut.item.wrapper'], 
	function(aggregate, metaInfo, configObj, scriptMan, toolkit, pandora, itemWrapper) {
	'use strict';
	//首先需要把原始页面url中参数换成与当前浏览者有关的形式
	var pageUrl = aggregate.pageUrl;
	pageUrl = pageUrl.split('?')[0];
	function wxInfoObtain() {
		//window.h5sdk.wxOpenidInit(metaInfo.pid, metaInfo.account, 1);
		window.h5sdk.wxOpenidReady(function() {
			var openid = h5sdk.wxOpenid();
			var param = {
				open_id : openid,
				weixin_account : metaInfo.account,
				component_appid : configObj.componentAppId
			};
			function delay() {
				//获得用户的详细信息
				h5sdk.callAPIByName(metaInfo.pid, 'ruixue.external.weixin.userdetailinfo.get', param, function(result) {
					result = result.external_weixin_userdetailinfo_get_response;
					var genderMap = {
						'g1' : 'male',
						'g2' :'female'
					};
					///处理用户详细信息
					if(result && result.wxuserinfo) {
						var gender = genderMap['g' + result.wxuserinfo.sex];
						var newPageUrlBuilder = [];
						//1. 把from_openid换成当前浏览者的openid
						var urlParam = toolkit.urlParamObj;

						aggregate.wxOpenid = h5sdk.wxOpenid();
						aggregate.wxCountry = result.wxuserinfo.country;
						aggregate.wxProvince = result.wxuserinfo.province;
						aggregate.wxCity = result.wxuserinfo.city;
						aggregate.wxGender = gender?gender : 'null';
						aggregate.wxAvatar = result.wxuserinfo.head_image_url;
						aggregate.wxNickname = result.wxuserinfo.nick_name;
						//重新构造分享连接用于分享
						for(var tmpAttr in urlParam) {
							if(tmpAttr == pandora.urlParam.fromOpenid) {
								newPageUrlBuilder.push(tmpAttr + '=' + aggregate.wxOpenid);
								continue;
							}
							newPageUrlBuilder.push(tmpAttr + '=' + urlParam[tmpAttr]);
						}
						var newPageUrl = newPageUrlBuilder.join('&');
						aggregate.newPageUrl = pageUrl + '?' + newPageUrl;
					}
					//设置分享图标
					var allImgs = document.querySelectorAll('img');
					var picUrl = '';
					if(allImgs.length > 1) {
						picUrl = allImgs[1]['src'];
					}
					//成功获得了用户的详细信息后,才绑定分享方法
					h5sdk.wxInit(metaInfo.pid, metaInfo.account, function() {
						h5sdk.wxShareToFriend(aggregate.pageTitle, aggregate.newPageUrl, picUrl, '', function() {
							itemWrapper.appendItem({
								action_type: 'share',
								share_channel: 'friend'
							});
						});
						h5sdk.wxShareToTimeline(aggregate.pageTitle, aggregate.newPageUrl, picUrl, function() {
							itemWrapper.appendItem({
								action_type: 'share',
								share_channel: 'timeline'
							});
						});
					});
				});
			};
			//先加载微信jssdk url, h5sdk是对jssdk封装基础上才可以使用的
			setTimeout(delay, 0);
			/*
			scriptMan.loadScript(configObj.wxjssdkUrl, function() {

			});*/
		});
	};
	return {
		run: function() {
			wxInfoObtain();
		}
	};
});
