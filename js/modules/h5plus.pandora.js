define(function() {
	'use strict';
	//本来想把公用的几个属性单独使用一个数组存放起来，但是因为rmr修改日志表的话，实在太繁琐，不如把公用属性分配给各个日志表对应的数组中。重复也只能将就。
	//所有的rmr属性值序列
	var attrsWrapperOfClick = ['h5program','h5uuid','h5pjtid','platform','action_type','weixin_id','weixin_openid','weixin_country','weixin_province','weixin_city','weixin_nick_name','weixin_gender','weixin_header_img_url','page_title','page_url','original_page_url','site_name','project_name',,'create_time','orientation','ip','country','province','city','node_name','click_desc','attrs'];
	var attrsWrapperOfView = ['h5program','h5uuid','h5pjtid','platform','action_type','weixin_id','weixin_openid','weixin_country','weixin_province','weixin_city','weixin_nick_name','weixin_gender','weixin_header_img_url','page_title','page_url','original_page_url','site_name','project_name','create_time','orientation','ip','country','province','city','resolution','browser_user_agent','online_duration','source_channel','from_openid'];
	var attrsWrapperOfScroll = ['h5program','h5uuid','h5pjtid','platform','action_type','weixin_id','weixin_openid','weixin_country','weixin_province','weixin_city','weixin_nick_name','weixin_gender','weixin_header_img_url','page_title','page_url','original_page_url','site_name','project_name','create_time','orientation','ip','country','province','city','scroll_cnt','scroll_to_bottom'];
	var attrsWrapperOfShare = ['h5program','h5uuid','h5pjtid','platform','action_type','weixin_id','weixin_openid','weixin_country','weixin_province','weixin_city','weixin_nick_name','weixin_gender','weixin_header_img_url','page_title','page_url','original_page_url','site_name','project_name','create_time','orientation','ip','country','province','city','share_channel'];
	//动态加载js文件
    var CONFIG = {
    	urlParam: {
    		wxShareChannel : 'from',
    		fromOpenid : 'h5plus_propagate_source_openid'
    	},
		desc : 'data-h5event-click-desc',
		platform : 'data-h5event-platform',
		attr : 'data-h5event-attributes',
		node: 'data-h5event-nodeName',
		/*
		正式rmr日志表
		clickTypeCode: '853efd8b-ea31-4e6e-8bb3-0acf024ebe46',
		viewTypeCode: 'eaf5a928-923a-414b-8c63-cad04081a3fa',
		scrollTypeCode: '13604d8a-9f3b-4466-87d0-c6eb941fbb1c',
		shareTypeCode: 'f70dafd4-0bc1-4ad4-9fa4-a7919dc54f5c',
		*/
		/*测试rmr日志表*/
		clickTypeCode: '8baa754f-3781-4188-b4fd-2de5996332ef',
		viewTypeCode: '0ba27e75-f58b-41d5-878a-0fdbabdc0b7d',
		scrollTypeCode: 'cf055497-f1ee-44f1-ad73-d38c1ab050e5',
		shareTypeCode: 'a0f3c2bc-4e34-4b30-b2a0-a3f8c5361ca3',
		/*测试rmr日志表*/


		clickAttrWrapper : attrsWrapperOfClick,
		viewAttrWrapper : attrsWrapperOfView,
		scrollAttrWrapper : attrsWrapperOfScroll,
		shareAttrWrapper : attrsWrapperOfShare,
		click: 'h5_utclick_identifier',
		view: 'h5_utview_identifier',
		scroll: 'h5_utscroll_identifier',
		h5uuid : 'h5_uuid_identifier',
		string : {
			'separator_1st': ',,',
			'separator_2nd': '::'
		},
		limits: {
			cookie: 1,
			localStorage: 1
		},
		interval: 1500
	};

	return CONFIG;
});
