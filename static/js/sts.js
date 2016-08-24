var pageStatus;//页面当前状态（根据加载按钮协定好参数）
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
	$.get("/boboface/json/v1/serviceTree/list", null, function(data) {
		if(data.code != 100000){
			console.log('加载service tree失败')
			return;
		}
		zTreeObj = $.fn.zTree.init($("#stsTree"), setting, data.data.list);
		//展开所有节点
		zTreeObj.expandAll(true); 
	});
}

//ztree event
function zTreeOnClick(event, treeId, treeNode) {
	$('#stsContent').load('/tpl/adsProjectManage.html');
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
	return false;
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
	var zTree = $.fn.zTree.getZTreeObj("stsTree");
	zTree.selectNode(treeNode);
	return confirm("进入节点 -- " + treeNode.title + " 的编辑状态吗？");
}
//删除节点(在此操作)
function beforeRemove(treeId, treeNode) {
	className = (className === "dark" ? "":"dark");
	var zTree = $.fn.zTree.getZTreeObj("stsTree");
	zTree.selectNode(treeNode);
	if(confirm("确认删除 节点 -- " + treeNode.title + " 吗？")){
		$.ajax({
				type: 'GET',
				url: "/boboface/json/v1/serviceTree/remove/" + treeNode.id,
			    data: null,
			    //async: false,
			    cache : false,
			    success: function(data){
			    	if(data.code != 100000){
			    		alert(data.msg);
			    	}else{
			    		loadTreeList();
			    		if(pageStatus == 'createSTree'){
			    			createSTree('createSTree');
			    		}else if(pageStatus == 'sTreePrivilege'){
							sTreePrivilege('sTreePrivilege');
			    		}else if(pageStatus == 'adsMountProject'){
			    			adsMountProject('adsMountProject');
			    		}
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
}
//重命名(在此操作)
function beforeRename(treeId, treeNode, newName, isCancel) {
	className = (className === "dark" ? "":"dark");
	var zTree = $.fn.zTree.getZTreeObj("stsTree");
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
				url: "/boboface/json/v1/serviceTree/rename/" + treeNode.id + "/" + newName,
			    data: null,
			    //async: false,
			    cache : false,
			    success: function(data){
			    	if(data.code != 100000){
			    		alert(data.msg);
			    		treeNode.title = oldName;
		        		zTree.editName(treeNode);
			    	}else{
			    		if(pageStatus == 'createSTree'){
		        			createSTree('createSTree');
		        		}else if(pageStatus == 'adsMountProject'){
		        			adsMountProject('adsMountProject');
		        		}
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
}

//业务树操作
//载入添加业务树表单
function createSTree(pageStatus){
	window.pageStatus = pageStatus;
	$('#stsContent').load('/tpl/stsTreeAdd.html');
}

var serviceTreeListTemplate = '<option value="{id}">{title}</option>';

//业务树类型选择
$('#stsContent').on('change','#serviceTreeType',function(){
	var _val = $(this).val();
	if(_val == '-1'){
		$('#parentServiceTree').empty();
		$('#parentServiceTree').append(nano(serviceTreeListTemplate, {'title' : '请选择所属业务树','id' : '-1'}));
		return;
	}

	$.ajax({
		type: 'GET',
		url: "/boboface/json/v1/serviceTree/parentServiceTree/" + _val,
	    data: null,
	    success: function(data){
	    	if(data.code == 100000){
		    	if(_val == 'second'){
		    		$('#parentServiceTree').empty();
		    		$('#parentServiceTree').append(nano(serviceTreeListTemplate, {'title' : '请选择所属业务树','id' : '-1'}));
		    		$('#parentServiceTree').append(nano(serviceTreeListTemplate, data.data.rootServiceTree));
		    	}else if(_val == 'third'){
		    		$('#parentServiceTree').empty();
		    		$('#parentServiceTree').append(nano(serviceTreeListTemplate, {'title' : '请选择所属业务树','id' : '-1'}));
		    		$.each(data.data.childrenServiceTrees,function(i,item){
		    			item.title = data.data.rootServiceTree.title + ' - ' + item.title;
						$('#parentServiceTree').append(nano(serviceTreeListTemplate,item));
		    		});
		    	}	
	    	}
	    },
	    error: function() {
	    	console.log('业务树请求异常');
      	}
	});
});

//改变校验样式
function createSTreeCheck(target,text,isError){
	target.prev().text(text);
	if(isError){
		target.parent().removeClass('has-error');
		target.parent().addClass('has-success');
	}else{
		target.parent().addClass('has-error');
		target.parent().removeClass('has-success');
	}
}

//树类型
$('#stsContent').on('change','#serviceTreeType',function(){
	if($(this).val() != '-1'){
		createSTreeCheck($(this),'树类型',true);
	}else{
		createSTreeCheck($(this),'请选择树类型',false);
	}
});

//所属业务树
$('#stsContent').on('change','#parentServiceTree',function(){
	if($(this).val() != '-1'){
		createSTreeCheck($(this),'所属业务树',true);
	}else{
		createSTreeCheck($(this),'请选择所属业务树',false);
	}
});

//业务树名称
$('#stsContent').on('blur','#serviceTreeName',function(){
	if($(this).val() != ''){
		createSTreeCheck($(this),'业务树名称',true);
	}else{
		createSTreeCheck($(this),'业务树名称不允许为空',false);
	}
});

//业务树添加
$('#stsContent').on('submit','#serviceTreeAddForm',function(){
	var _form = $(this);
	var flag = true;
	//校验
	if($('#serviceTreeType').val() != '-1'){
		createSTreeCheck($('#serviceTreeType'),'树类型',true);
	}else{
		createSTreeCheck($('#serviceTreeType'),'请选择树类型',false);
		flag = false;
	}
	if($('#parentServiceTree').val() != '-1'){
		createSTreeCheck($('#parentServiceTree'),'所属业务树',true);
	}else{
		createSTreeCheck($('#parentServiceTree'),'请选择所属业务树',false);
		flag = false;
	}
	if($('#serviceTreeName').val() != ''){
		createSTreeCheck($('#serviceTreeName'),'业务树名称',true);
	}else{
		createSTreeCheck($('#serviceTreeName'),'业务树名称不允许为空',false);
		flag = false;
	}

	if(flag){
		var msg,type;
		$.ajax({
			type: 'POST',
			url: '/boboface/json/v1/serviceTree/add',
		    data: {
		    	'serviceTree.parentid' : $('#parentServiceTree').val(),
		    	'serviceTree.title' : $('#serviceTreeName').val()
		    },
		    success: function(data){
		    	if(data.code != 100000){
		    		type = 'danger';
		    		msg = data.msg;
		    	}else{
		    		type = 'success';
					msg = data.data.msg;
					loadTreeList();
					_form[0].reset();
					$.each(_form.find('div'),function(i,item){
						$(item).removeClass('has-success');
					})
					$('#parentServiceTree').empty();
		    		$('#parentServiceTree').append(nano(serviceTreeListTemplate, {'title' : '请选择所属业务树','id' : '-1'}));
		    	}
		    	showDialog(msg,type);
		    }
		});
	}
	return false;
});

//业务树管理权限
function sTreePrivilege(pageStatus){
	window.pageStatus = pageStatus;
	$('#stsContent').load('/tpl/stsTreePrivilege.html');
}

//ads 项目挂载
function adsMountProject(pageStatus){
	$('#stsContent').load('/tpl/adsProjectAdd.html');
}

//所属业务树
if($('#projectServiceTree').val() != '-1'){
	createSTreeCheck($('#projectServiceTree'),'所属业务树',true);
}else{
	createSTreeCheck($('#projectServiceTree'),'请选择所属业务树',false);
	flag = false;
}
//项目名称
$('#stsContent').on('blur','#projectName',function(){
	if($(this).val() != ''){
		createSTreeCheck($(this),'项目名称',true);
	}else{
		createSTreeCheck($(this),'项目名称不允许为空',false);
	}
});

//项目简介
$('#stsContent').on('blur','#introduction',function(){
	if($(this).val() != ''){
		createSTreeCheck($(this),'项目简介',true);
	}else{
		createSTreeCheck($(this),'项目简介不允许为空',false);
	}
});

//项目路径
$('#stsContent').on('blur','#storagePath',function(){
	if($(this).val() != ''){
		createSTreeCheck($(this),'项目路径',true);
	}else{
		createSTreeCheck($(this),'项目路径不允许为空',false);
	}
});

//仓库地址
$('#stsContent').on('blur','#gitPath',function(){
	if($(this).val() != ''){
		createSTreeCheck($(this),'仓库地址',true);
	}else{
		createSTreeCheck($(this),'仓库不允许为空',false);	
	}
});

//运行账号
$('#stsContent').on('blur','#runUser',function(){
	if($(this).val() != ''){
		createSTreeCheck($(this),'运行账号',true);
	}else{
		createSTreeCheck($(this),'运行账号不允许为空',false);	
	}
});

//账号属组
$('#stsContent').on('blur','#runGroup',function(){
	if($(this).val() != ''){
		createSTreeCheck($(this),'账号属组',true);
	}else{
		createSTreeCheck($(this),'账号属组不允许为空',false);	
	}
});

//项目挂载
$('#stsContent').on('submit','#adsProjectAddForm',function(){
	var _form = $(this);
	var flag = true;
	//校验
	if($('#projectServiceTree').val() != '-1'){
		createSTreeCheck($('#projectServiceTree'),'所属业务树',true);
	}else{
		createSTreeCheck($('#projectServiceTree'),'请选择所属业务树',false);
		flag = false;
	}
	if($('#projectName').val() != ''){
		createSTreeCheck($('#projectName'),'项目名称',true);
	}else{
		createSTreeCheck($('#projectName'),'项目名称不允许为空',false);
		flag = false;
	}
	if($('#introduction').val() != ''){
		createSTreeCheck($('#introduction'),'项目简介',true);
	}else{
		createSTreeCheck($('#introduction'),'项目简介不允许为空',false);
		flag = false;
	}
	if($('#storagePath').val() != ''){
		createSTreeCheck($('#storagePath'),'项目路径',true);
	}else{
		createSTreeCheck($('#storagePath'),'项目路径不允许为空',false);
		flag = false;
	}

	if($('#gitPath').val() != ''){
		createSTreeCheck($('#gitPath'),'仓库地址',true);
	}else{
		createSTreeCheck($('#gitPath'),'仓库地址不允许为空',false);
		flag = false;
	}

	if($('#runUser').val() != ''){
		createSTreeCheck($('#runUser'),'运行账号',true);
	}else{
		createSTreeCheck($('#runUser'),'运行账号不允许为空',false);
		flag = false;
	}

	if($('#runGroup').val() != ''){
		createSTreeCheck($('#runGroup'),'账号属组',true);
	}else{
		createSTreeCheck($('#runGroup'),'账号属组不允许为空',false);
		flag = false;
	}

	if(flag){
		var msg,type;
		$.ajax({
			type: 'POST',
			url: '/boboface/json/v1/serviceTree/adsMountProject/add',
		    data: {
		    	'adsProject.servicetreeid' : $('#projectServiceTree').val(),
		    	'adsProject.appname' : $('#projectName').val(),
		    	'adsProject.introduction' : $('#introduction').val(),
		    	'adsProject.storagepath' : $('#storagePath').val()
		    },
		    success: function(data){
		    	if(data.code != 100000){
		    		type = 'danger';
		    		msg = data.msg;
		    	}else{
		    		type = 'success';
					msg = data.data.msg;
					_form[0].reset();
					$.each(_form.find('div'),function(i,item){
						$(item).removeClass('has-success');
					})
					$('#parentServiceTree').empty();
		    		$('#parentServiceTree').append(nano(serviceTreeListTemplate, {'title' : '请选择所属业务树','id' : '-1'}));
		    	}
		    	showDialog(msg,type);
		    }
		});
	}
	return false;
});