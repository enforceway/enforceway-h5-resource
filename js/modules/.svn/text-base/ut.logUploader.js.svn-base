define(['h5plus.rmr.util', 'h5plus.pandora', 'h5plus.toolkit', 'ut.item.wrapper'], 
	function(util, pandora, toolkit, itemWrapper) {
	'use strict';

	var getItem = util.getItem, reset = util.reset,storageConfig = pandora;
	function loadOnExec() {
		/*!function() {
			//cloudScrollLog
			var utlogsArr = getItem('scroll');
			try{
				utlogsArr = eval('(' + utlogsArr + ')');
			} catch(e) {
				utlogsArr = null;
			}
			if(!utlogsArr) return;
			if(limits > utlogsArr.length) return;
			toolkit.ROP.send('8a019171-6be0-4050-80a8-6d1a305cefd2', utlogsArr, function(res) {
				if(res.status == 'success') {
					reset('scroll', []);
				}
			});
		}();*/
		!function() {
			var utlogsArr = getItem('click');
			reset('click', []);
			if(!utlogsArr.length) return;
			var typeCode = storageConfig['clickTypeCode'];
			utlogsArr.forEach(function(item) {
				toolkit.ROP.send(typeCode, itemWrapper.logStrGenerator(item), function(res) {
				
				});
			});
		}();
		!function() {
			var utlogsArr = getItem('view');
			reset('view', []);
			if(!utlogsArr.length) return;
			var typeCode = storageConfig['viewTypeCode'];
			utlogsArr.forEach(function(item) {
				toolkit.ROP.send(typeCode, itemWrapper.logStrGenerator(item), function(res) {
				
				});
			});
		}();
	};
	return {
		run : loadOnExec
	};
});
