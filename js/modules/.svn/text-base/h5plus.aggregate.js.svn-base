define(['h5plus.metainfo','h5plus.pandora','h5plus.storage','h5plus.toolkit'], function(metaInfoObj,pandora,storage,toolkit) {
	'use strict';

	var h5uuid,
		tmpUUID = storage.getSession(pandora.h5uuid),
		pageTitle = document.title,
		urlParam = toolkit.urlParamObj,
		locationHref = window.location.href;
	if(tmpUUID) {
		//如果session storage中没有h5uuid,表示用户没有进行再pageTitle次访问, session storage中会在关闭页面时清空.
		h5uuid = tmpUUID;
	} else {
		h5uuid = toolkit.fastUUID();
		storage.setSession(pandora.h5uuid, h5uuid);
	}
	var shareChannelMap = {
		singlemessage : 'friend',
		timeline : 'timeline'
	};
	//微信wx.config方法debug如果是true,会添加from参数(参数值是friend和timeline)在页面url上, 传播并分享出去
	var shareChannelSrc = shareChannelMap[urlParam[pandora.urlParam.wxShareChannel]];
	//保存用户埋点所有数据
	var aggregation = {
		h5program : metaInfoObj.platformId,
		h5uuid : h5uuid,
		h5pjtid : metaInfoObj.projectId,
		wxOpenid : '',
		wxCountry : '',
		wxProvince : '',
		wxCity : '',
		wxGender : '',
		wxAvatar : '',
		wxNickname : '',
		account : metaInfoObj.account,
		pageTitle : pageTitle,
		pageUrl : locationHref,
		fromOpenid : urlParam[pandora.urlParam.fromOpenid]?urlParam[pandora.urlParam.fromOpenid]:'',//默认使用urlParam.fromOpenid对应的参数值作为分享者微信标识
		sourceChannel : shareChannelSrc?shareChannelSrc:'',
		site_name : metaInfoObj.site_name,
		project_name : metaInfoObj.project_name,
		original_page_url : locationHref.split('?')[0]
	};
	return aggregation;
});
