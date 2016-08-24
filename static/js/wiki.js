//var editor = new EpicEditor().load();
var editor;
var readerOpts = {
  container: 'epiceditor',
  textarea: 'wikiContent',
  clientSideStorage: false,
  button: {
    preview: false,
    fullscreen: false,
    bar: "false"
  },
  focusOnLoad: false,
  shortcut: {
    modifier: 18,
    fullscreen: 70,
    preview: 80
  },
  string: {
    togglePreview: 'Toggle Preview Mode',
    toggleEdit: 'Toggle Edit Mode',
    toggleFullscreen: 'Enter Fullscreen'
  },
}

var writerOpts = {
  container: 'epiceditor',
  textarea: 'wikiContent',
  clientSideStorage: false,
  button: {
    preview: true,
    fullscreen: true,
    bar: "auto"
  },
  focusOnLoad: false,
  shortcut: {
    modifier: 18,
    fullscreen: 70,
    preview: 80
  },
  string: {
    togglePreview: 'Toggle Preview Mode',
    toggleEdit: 'Toggle Edit Mode',
    toggleFullscreen: 'Enter Fullscreen'
  },
}

//加载markdown编辑器
function　reloadEditor(highLevel){
	if(highLevel == 1){
		$('#wikiBtnBox').attr('style','display:block;');
		$('#epiceditor').attr('style','height:93%;');
		editor = new EpicEditor(writerOpts).load();
	}else{
		$('#wikiBtnBox').attr('style','display:none;');
		$('#epiceditor').attr('style','height:100%;');
		editor = new EpicEditor(readerOpts).load();
		editor.preview();
	}
	$(editor.getElement('previewer')).keypress(function(e){
		if(e.ctrlKey && e.which == 13 || e.which == 10) {
			$('#highLevelPrivilegeModal').modal('show');
		} else if (e.shiftKey && e.which==13 || e.which == 10) {
			$('#highLevelPrivilegeModal').modal('show');
		}
	});
	$(editor.getElement('editor')).keypress(function(e){
		if(e.ctrlKey && e.which == 13 || e.which == 10) {
			$('#highLevelPrivilegeModal').modal('show');
		} else if (e.shiftKey && e.which==13 || e.which == 10) {
			$('#highLevelPrivilegeModal').modal('show');
		}
	});
}
//卸载markdown编辑器
function unloadEditor(){
	editor.unload();
	$('#wikiBtnBox').attr('style','display:none;');
}

//zTree
var zTreeObj;
var setting = {
  	view: {
    	showIcon: false,
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
	$.get("/boboface/json/v1/wiki/treeList", null, function(data) {
		if(data.code != 100000){
			console.log('加载wiki tree失败')
			return;
		}
		zTreeObj = $.fn.zTree.init($("#wikiTree"), setting, data.data.list);
		//展开所有节点
		zTreeObj.expandAll(true); 
	});
}

//ztree event
function zTreeOnClick(event, treeId, treeNode) {
	$.get("/boboface/json/v1/wiki/content/" + treeNode.id, null, function(data) {
		if(data.code != 100000){
			console.log('加载wiki content失败')
			return;
		}
		if(data.data.wikiConten == null){
			$('#wikiContent').val(wikiContent);
		}else{
			$('#wikiContent').val(data.data.wikiConten.content);
		}
		writerOpts.treeNode = {id:treeNode.id};
		reloadEditor(highLevel);
	});
};

function zTreeBeforeClick(treeId, treeNode, clickFlag) {
	//return (!treeNode.isParent);
};

var log, className = "dark";
//是否允许拖拽
function beforeDrag(treeId, treeNodes) {
	return false;
}
//编辑显示
var newCount = 1;
function addHoverDom(treeId, treeNode) {
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
		var zTree = $.fn.zTree.getZTreeObj("wikiTree");
		$.ajax({
				type: 'GET',
				url: "/boboface/json/v1/wiki/tree/add/" + treeNode.id,
			    data: null,
			    //async: false,
			    cache : false,
			    success: function(data){
			    	if(data.code != 100000){
			    		alert(data.msg);
			    	}else{
			    		loadTreeList();
			    		/*zTree.addNodes(treeNode, 
			    			{
			    				id:data.data.wikiTree.id,
			    			 	pId:data.data.wikiTree.parentid,
			    			  	title:data.data.wikiTree.title
			    			});*/
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

//弹框
function showLog(str) {
	/*if (!log) log = $("#log");
	log.append("<li class='"+className+"'>"+str+"</li>");
	if(log.children("li").length > 8) {
		log.get(0).removeChild(log.children("li")[0]);
	}*/
	console.log(str);
}
//获取时间
function getTime() {
	var now= new Date(),
	h=now.getHours(),
	m=now.getMinutes(),
	s=now.getSeconds(),
	ms=now.getMilliseconds();
	return (h+":"+m+":"+s+ " " +ms);
}

//wikiContent
$('#saveWikiContent').click(function(){
	var msg,type;
	$.ajax({
			type: 'POST',
			url: '/boboface/json/v1/wiki/content/save',
		    data: {
		    	'wikiContent.wikitreeid': editor.settings.treeNode.id,//treeID
				'wikiContent.content': editor.editor.innerText,	//内容
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