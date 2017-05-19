/*
	rmr默认保存到localStorage中或者cookie中做长久保存 
*/
define(['h5plus.storage', 'h5plus.pandora', 'h5plus.toolkit'], function(storage, pandora, toolkit) {
	'use strict';

	var addItem, getItem, reset; 
	var UT = {
		getStorage: function(logType) {
			return storage.getStorage(pandora[logType]);
		},
		setStorage: function(actionType, jsonUTLog) {
			storage.setStorage(jsonUTLog.action_type, jsonUTLog);
			//如果存储中没有该类型,则要保存进入存储.并用数组形式保存起来.
			var pendingAddUTLog = storage.getStorage(pandora[actionType]);
			//将现在有的ut记录取出
			if((pendingAddUTLog = toolkit.ifValidArray(pendingAddUTLog))) {
				pendingAddUTLog.push(jsonUTLog);
			}
			storage.setStorage(pandora[actionType], utLogTransiter.wrap(pendingAddUTLog));
		}
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

	reset = function(actionType, remainLogArr) {
		if(!remainLogArr || remainLogArr.length == 0) {
			//如果传入的是空数组或者null或者undefined
			storage.removeStorage(pandora[actionType]);
		} else {
			//如果传入的是非空的数组
			storage.setStorage(pandora[actionType], toolkit.arrayToJsonStr(remainLogArr));
		}
	};
	getItem = function(key) {
		var item = storage.getStorage(pandora[key]);
		item = toolkit.evalize(item);
		return item?item:[];
	};
	
	return {
		reset : reset,
		getItem: getItem
	};
});