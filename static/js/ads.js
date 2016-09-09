//zTree
var zTreeObj;
var setting = {
  	view: {
    	fontCss : {'font-size':'14px',color:'#337ab7','height':'22px'},
    	addHoverDom: addHoverDom,
    	removeHoverDom: removeHoverDom
  	},
  	edit: {
		enable: true,
		showRemoveBtn: showRemoveBtn,
		showRenameBtn: showRenameBtn
	},
  	data : {
  			key :{
  				name : 'title'
  			},
			simpleData : {
				enable : true,
				idKey : "id",
				pIdKey : "parentid"
			}
	},
	callback: {
		onClick: zTreeOnClick,
		beforeClick: zTreeBeforeClick,
		beforeDrag: beforeDrag,
		beforeEditName: beforeEditName,
		beforeRemove: beforeRemove,
		beforeRename: beforeRename,
		onRemove: onRemove,
		onRename: onRename
	}
};

$(function(){
	loadTreeList();//加载tree数据
});
//loadTreeList
function loadTreeList(){

	var flag = true;
	var href;

	if('/ads/template' == window.location.pathname){
		href = '/boboface/json/v1/ads/treeList/template';
	}else if('/ads/unitlScript' == window.location.pathname){
		href = '/boboface/json/v1/ads/treeList/unitlScript';
	}else{
		flag = false;
	}

	if(!flag)
		return;

	$.get(href, null, function(data) {
		if(data.code != 100000){
			console.log('加载ads tree失败')
			return;
		}
		zTreeObj = $.fn.zTree.init($("#adsTree"), setting, data.data.list);
	});
}

//ztree event
function zTreeOnClick(event, treeId, treeNode) {

	var href;

	if('/ads/template' == window.location.pathname){
		href = '/boboface/json/v1/ads/content/' + treeNode.id + '/template';
	}else if('/ads/unitlScript' == window.location.pathname){
		href ='/boboface/json/v1/ads/content/' + treeNode.id + '/unitlScript';
	}else{
		flag = false;
	}

	$.get(href, null, function(data) {
		if(data.code != 100000){
			console.log('加载ads content失败')
			return;
		}

		if(data.data.content.content == null){
			myCodeMirror.setValue(adsContent);
		}else{
			myCodeMirror.setValue(data.data.content.content);
		}
		myCodeMirror.treeNode = {id:treeNode.id};
		$('#adsBtnBox').find('div').last().attr('style','display:block');
	});
};

function zTreeBeforeClick(treeId, treeNode, clickFlag) {
	return (!treeNode.isParent);
};

var log, className = "dark";
//是否允许拖拽
function beforeDrag(treeId, treeNodes) {
	return false;
}
//编辑显示
var newCount = 1;
function addHoverDom(treeId, treeNode) {
	//暂时不启用
	return false;
	if(highLevel == 0) return;
	if(treeNode.allowadd == 0) return;
	if(typeof(treeNode.allowadd) == 'undefined') return;
	var sObj = $("#" + treeNode.tId + "_span");
	if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
	var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
		+ "' title='add node' onfocus='this.blur();'></span>";
	sObj.after(addStr);
	var btn = $("#addBtn_"+treeNode.tId);
	if (btn) btn.bind("click", function(){
		var zTree = $.fn.zTree.getZTreeObj("adsTree");
		$.ajax({
				type: 'GET',
				url: "/boboface/json/v1/ads/projectTemplateAdd/" + treeNode.id,
			    data: null,
			    //async: false,
			    cache : false,
			    success: function(data){
			    	if(data.code != 100000){
			    		alert(data.msg);
			    	}else{
			    		loadTreeList();
			    	}
			    },
			    error: function() {  
		        	alert("请求异常.");
		      	}
			});
		return false;
	});
};
//编辑隐藏
function removeHoverDom(treeId, treeNode) {
	$("#addBtn_"+treeNode.tId).unbind().remove();
};
//显示删除按钮
function showRemoveBtn(treeId, treeNode) {
	if(highLevel == 0)
		return false;
	if(typeof(treeNode.allowdelete) == 'undefined') 
		return false;
	if(treeNode.allowdelete == 0)
		return false;
	//return !treeNode.isFirstNode;
	return true;
}
//显示重命名按钮
function showRenameBtn(treeId, treeNode) {
	if(highLevel == 0)
		return false;
	if(typeof(treeNode.allowedit) == 'undefined') 
		return false;
	if(treeNode.allowedit == 0)
		return false;
	//return !treeNode.isLastNode;
	return true;
}
//编辑名字前
function beforeEditName(treeId, treeNode) {
	className = (className === "dark" ? "":"dark");
	showLog("[ "+getTime()+" beforeEditName ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.title);
	var zTree = $.fn.zTree.getZTreeObj("wikiTree");
	zTree.selectNode(treeNode);
	return confirm("进入节点 -- " + treeNode.title + " 的编辑状态吗？");
}
//删除节点(在此操作)
function beforeRemove(treeId, treeNode) {
	className = (className === "dark" ? "":"dark");
	showLog("[ "+getTime()+" beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.title);
	var zTree = $.fn.zTree.getZTreeObj("wikiTree");
	zTree.selectNode(treeNode);
	if(confirm("确认删除 节点 -- " + treeNode.title + " 吗？")){
		$.ajax({
				type: 'GET',
				url: "/boboface/json/v1/wiki/tree/remove/" + treeNode.id,
			    data: null,
			    //async: false,
			    cache : false,
			    success: function(data){
			    	if(data.code != 100000){
			    		alert(data.msg);
			    	}else{
			    		//zTree.removeNode(treeNode);
			    		loadTreeList();
			    		unloadEditor();
			    	}
			    },
			    error: function() {  
		        	alert("请求异常.");
		      	}
			});
	}
	return false;
}
//删除节点之后
function onRemove(e, treeId, treeNode) {
	showLog("[ "+getTime()+" onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.title);
}
//重命名(在此操作)
function beforeRename(treeId, treeNode, newName, isCancel) {
	className = (className === "dark" ? "":"dark");
	var zTree = $.fn.zTree.getZTreeObj("wikiTree");
	showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.title + (isCancel ? "</span>":""));
	if (newName.length == 0) {//重命名非空校验
		alert("节点名称不能为空.");
		setTimeout(function(){zTree.editName(treeNode)}, 10);
		return false;
	}
	var oldName = treeNode.title;//旧名称
	if(newName != treeNode.title){//是否重命名校验
		/*if(!treeNode.parentid){
			alert("父节点不能修改.");
			zTree.editName(treeNode);
			return false;
		}*/
		$.ajax({
				type: 'GET',
				url: "/boboface/json/v1/wiki/tree/rename/" + treeNode.id + "/" + newName,
			    data: null,
			    //async: false,
			    cache : false,
			    success: function(data){
			    	if(data.code != 100000){
			    		alert(data.msg);
			    		treeNode.title = oldName;
		        		zTree.editName(treeNode);
			    	}
			    },
			    error: function() {  
		        	alert("请求异常.");
		        	treeNode.title = oldName;
		        	zTree.editName(treeNode);
		        	return false;
		      	}
			});
	}
	return true;
}
//重命名之后
function onRename(e, treeId, treeNode, isCancel) {
	showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" onRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.title + (isCancel ? "</span>":""));
}

//codemirror
var myCodeMirror;
var adsContent = "";//空
$(function(){
	loadCodeMirror();
});
//加载编辑器
function loadCodeMirror(){
	myCodeMirror = CodeMirror.fromTextArea(document.getElementById("codemirror"),{
		mode:'shell',
		lineNumbers: true,
		theme:'monokai'
	});
}

//保存模板
$('#saveAdsTemplate').click(function(){
	var msg,type;
	$.ajax({
			type: 'POST',
			url: '/boboface/json/v1/ads/projectTemplate/save',
		    data: {
		    	'adsTemplate.id': myCodeMirror.treeNode.id,//templateId
				'adsTemplate.content': myCodeMirror.getValue()//模板内容
		    },
		    success: function(data){
		    	if(data.code != 100000){
		    		type = 'danger';
		    	}else{
	    			type = 'success';
		    	}
		    	msg = data.data.msg;
		    },
		    error: function() {  
	        	type = 'danger';
		    	msg = '请求异常';
	      	},
	      	complete: function(){
	      		showDialog(msg,type);
	      	}
		});
});

//保存工具脚本
$('#saveAdsUnitlScript').click(function(){
	var msg,type;
	$.ajax({
			type: 'POST',
			url: '/boboface/json/v1/ads/unitlScript/save',
		    data: {
		    	'adsUntilscript.id': myCodeMirror.treeNode.id,//unitlScriptId
				'adsUntilscript.content': myCodeMirror.getValue()//工具脚本内容
		    },
		    success: function(data){
		    	if(data.code != 100000){
		    		type = 'danger';
		    	}else{
	    			type = 'success';
		    	}
		    	msg = data.data.msg;
		    },
		    error: function() {  
	        	type = 'danger';
		    	msg = '请求异常';
	      	},
	      	complete: function(){
	      		showDialog(msg,type);
	      	}
		});
});