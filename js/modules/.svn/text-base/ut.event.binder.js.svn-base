define(['h5plus.toolkit', 'ut.item.wrapper', 'h5plus.pandora','h5plus.rmr.util','h5plus.aggregate'], 
	function(toolkit, itemWrapper, pandora,util,aggregate) {
	'use strict';

	var defaultFn = function(e) {
		//var target = e.target ||  e.srcElement;
		if(window.event) window.event.returnValue = true;
	};
	var scanningList = [
	    {nodetype: 'button', ifform: 'non-form'},
	    {nodetype: 'input', ifform : 'form'},
	    {nodetype: 'a', ifform : 'non-form', ondefault: defaultFn}
	];
	var scanningFilter = {
		'input': ['value'],//'checkbox','text','button','radio','password','reset','submit','file'
		'a': [{'title':[/$\s/g]},{'href':[/$\s/g]}]
	};
	//屏幕分辨率
	var screenTH = {
		height: window.screen.height,
		width: window.screen.width
	};

	//绑定阅读事件
	var getItem = util.getItem, reset = util.reset;
	function onload4View() {
		//如果是微信浏览器,则不进行页面浏览操作的捕获
		var intervalHandler = null;
		var interval = pandora.interval;
		function setViewIntervalHandler() {
			var singleUTLog,utlogsArr,endTimestamp;
			intervalHandler = setInterval(function() {
				utlogsArr = getItem('view');
				//utlogsArr这时候肯定是一个数组，如果没有数值则是一个空数组
				endTimestamp = toolkit.now();
				singleUTLog = utlogsArr.pop();
				if(!singleUTLog) {
					//如果是第一次保存的话, singleUTLog肯定是undefined或者是null
					singleUTLog = itemWrapper.wrapItem({
						action_type: 'view',
						resolution : screenTH.width +'*' + screenTH.height,
						browser_user_agent: toolkit.browser,
						start_time: toolkit.now(),
						online_duration: 0,
						source_channel: aggregate.sourceChannel,
						from_openid: aggregate.fromOpenid
					});
				}
				singleUTLog.online_duration = endTimestamp - singleUTLog.start_time;
				utlogsArr.push(singleUTLog);
				reset('view', utlogsArr);
			}, interval);
		};
		
		setViewIntervalHandler();
		/*return;
		var startTimestamp = toolkit.now(), 
			endTimestamp, 
			ended = false,
			pageDeadOrTimeout,
			pageDeadOrTimeout = setTimeout(function() {
				clearTimeout(pageDeadOrTimeout);
				endTimestamp = toolkit.now();
				itemWrapper.appendItem({
					action_type: 'view',
					resolution : screenTH.width +'*' + screenTH.height,
					browser_user_agent: toolkit.browser,
					online_duration: 1800000,
					source_channel: null,
					from_openid: null
				});
				ended = true;
			}, 1800000);
		var timeLengthCalc = function() {
			if(ended) return;
			endTimestamp = toolkit.now();
			ended = true;
			itemWrapper.appendItem({
				action_type: 'view',
				resolution : screenTH.width +'*' + screenTH.height,
				browser_user_agent: toolkit.browser,
				start_time: startTimestamp,
				online_duration: endTimestamp - startTimestamp,
				source_channel: null,
				from_openid: null
			});
		};
		var onunloaded = false;
		document.body.onbeforeunload = function (e) {
			if(onunloaded == false) {
				onunloaded = true;
			} else {
				return;
			}
			timeLengthCalc();
			e = e || window.event;
		};
		document.body.onunload = function (e) {
			if(onunloaded == false) {
				onunloaded = true;
			} else {
				return;
			}
			timeLengthCalc();
		};
		*/
	};

	//绑定滚动事件
	var documentHeight = 0,
		contentHeight = 0;
	function onload4Scroll() {
		var topQueue = [],
			startScrollTop,
			scrollDebounce = toolkit.debounce(function() {
				var endScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				var scrollCnt = topQueue.length;
				itemWrapper.appendItem({
					action_type: 'scroll',
					scroll_cnt: scrollCnt,
					scroll_to_bottom: (endScrollTop + documentHeight) >= contentHeight,
				}), startScrollTop = null, topQueue = [];
			}, 1000, false);
		documentHeight = document.documentElement.clientHeight;
		//body有可能还没加载完成
		contentHeight = Math.max(document.documentElement.offsetHeight, document.body?document.body.offsetHeight:0),
		toolkit.bindEvent(window, 'scroll', function() {
			if(!startScrollTop) startScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			topQueue.push({counter: 'scroll_counter'});
			scrollDebounce();
		});

		//如果是非浏览器, 浏览器窗口可以缩放
		if (!toolkit.isMobile()) {
			toolkit.bindEvent(window, 'resize', function() {
				documentHeight = document.documentElement.clientHeight || document.body.clientHeight, 
				contentHeight = document.documentElement.offsetHeight || document.body.offsetHeight;
			});
		}
	};

	//绑定点击事件
	function onload4Click() {
		var actionName = toolkit.isMobile()?'touchstart':'click';
		var type, ifFormTag, ondefault;
		var h5eventCaptureEvnt = function(e) {
			var item = e.srcElement || e.target;
			itemWrapper.appendItem({
				action_type: 'click',
				node_name : item.getAttribute(pandora.node),
				click_desc : item.getAttribute(pandora.desc),
				attrs : item.getAttribute(pandora.attr)
			});
			e.cancelBubble = true;
			//if(e.preventDefault) e.preventDefault();
			if(e.stopPropagation) e.stopPropagation();
			if(ondefault) ondefault(e);
		};
		//绑定事件的函数
		var scanAllListFn = function() {
			scanningList.forEach(function(typeObj, index) {
				type = typeObj.nodetype;
				ifFormTag = typeObj.ifform ==='non-form'?false:true;
				ondefault = typeObj.ondefault;
				var nodesList = document.querySelectorAll(type);
				nodesList = Array.prototype.slice.call(nodesList, 0);
				//scan all nodes
				nodesList.forEach(function(item, index) {
					if(!item.hasAttribute(pandora.node)) {
						//元素属性及值
						if(item.attributes && item.attributes.length) {
							var attrArr=[];
							for(var indexer=0,len=item.attributes.length;indexer<len;indexer++) {
								attrArr.push("{attrname:'" + item.attributes[indexer].name +"',attrvalue:'" + item.attributes[indexer].value +"'}");
							}
							item.setAttribute(pandora.attr, attrArr.join(','));
						}
						item.setAttribute(pandora.node, item.nodeName);
						//元素的描述
						item.setAttribute(pandora.desc, ifFormTag?item.value:item.innerText);
					}
					//重新绑定点击事件
					toolkit.bindEvent(item, actionName, h5eventCaptureEvnt);
				});
			});
		};
		//默认上来即对所有节点进行遍历
		scanAllListFn();
		var scanAllListFnDebouncer = toolkit.debounce(function() {
			scanAllListFn();
		}, 1000, false);
		//如果dom结构发生变动, 移除此前form tags上绑定的事件，并重新绑定事件
		toolkit.bindEvent(document, 'DOMNodeInserted', function() {
			scanAllListFnDebouncer();
		});
	};

	return {
		runScroll : onload4Scroll,
		runView : onload4View,
		runClick : onload4Click,
	};
});
