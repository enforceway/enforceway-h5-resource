define(['h5plus.toolkit'], function(toolkit) {
	'use strict';

	var metaNames = {
		piwik_Id : 'h5plus-piwikid',
		platform : 'h5plus-usertrack-platform',
		pid : 'h5plus-wechat-pid',
		account : 'h5plus-wechat-account',
		wxCode : 'h5plus-has-wechatcode',
		site_name: 'h5plus-site-name',
		project_name: 'h5plus-project-name'
	};
	//所有的user track指示信息
	var metasObj = toolkit.queryMeta('');
	var judge = {
		projectId : metasObj[metaNames.piwik_Id]?metasObj[metaNames.piwik_Id]:'',
		platformId : metasObj[metaNames.platform]?metasObj[metaNames.platform]:'',
		project_name : metasObj[metaNames.project_name]?metasObj[metaNames.project_name]:'',
		site_name : metasObj[metaNames.site_name]?metasObj[metaNames.site_name]:'',

		hasWechatCode : metasObj[metaNames.wxCode]?metasObj[metaNames.wxCode]:'',
		pid : metasObj[metaNames.pid]?metasObj[metaNames.pid]:'',
		account : metasObj[metaNames.account]?metasObj[metaNames.account]:''
	};
	return judge;
});
