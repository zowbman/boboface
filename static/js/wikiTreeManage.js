//wikiTreeManage
//wikiTreePrivilege 权限
//权限列表
var wikiTreeListTemplate = '<tr>' +
				           '<td>{index}</td>' +
				           '<td>{title}</td>' +
				           '<td>{allowadd}</td>' +
				           '<td>{allowedit}</td>' +
				           '<td>{allowdelete}</td>' +
				           '<td>{addTimeToData}</td>' +
				           '<td><a class="btn btn-default btn-xs" href="javascript:;" onclick="getWikiTreePrivilegeSetting({id});" role="button">权限</a></td>' +
				           '</tr>';
$(function(){
	loadWikiTreePrivilege();
});
function loadWikiTreePrivilege(pageUrl){
	var url = '/boboface/json/v1/wiki/treeListByPage?pageSize=8';
	if(typeof(pageUrl) != 'undefined')
		url = pageUrl;
	$.ajax({
			type: 'GET',
			url: url,
		    data: null,
		    success: function(data){
		    	if(data.code != 100000){
		    		alert(data.msg);
		    	}else{
		    		$('#wikiTreePrivilegeList').empty();
		    		$.each(data.data.list, function(i, item){
		    			if(item.allowadd == 1){
		    				item.allowadd = 'Y';
		    			}else{
		    				item.allowadd = 'N';
		    			}
		    			if(item.allowedit == 1){
		    				item.allowedit = 'Y';
		    			}else{
		    				item.allowedit = 'N';
		    			}
		    			if(item.allowdelete == 1){
		    				item.allowdelete = 'Y';
		    			}else{
		    				item.allowdelete = 'N';
		    			}
		    			item.index = ++i;
						$('#wikiTreePrivilegeList').append(nano(wikiTreeListTemplate, item));
					});
					paging('wikiTreePrivilegePaging',data.data.pageInfo,'loadWikiTreePrivilege',data.data.pageUrl);
		    	}
		    },
		    error: function() {  
	        	alert('请求异常.');
	      	}
		});
}

//修改权限配置
var wikiTreeTitleTemplate = '<h4 class="modal-title">{title}</h4>';

var wikiTreeBodyTemplate = '<tr>' +
				           '<td><div class="checkbox"><label><input name="wikiTree.allowadd" type="checkbox" {allowadd.isChecked} value="1">Y</label></div></td>' +
				           '<td><div class="checkbox"><label><input name="wikiTree.allowedit" type="checkbox" {allowedit.isChecked} value="1">Y</label></div></td>' +
				           '<td><div class="checkbox"><label><input name="wikiTree.allowdelete" type="checkbox" {allowdelete.isChecked} value="1">Y</label></div></td>' +
				           '</tr>' +
				           '<input name="wikiTree.id" type="hidden" value="{id}">';

function getWikiTreePrivilegeSetting (id){
	//获取对应wikiTree 数据
	$.ajax({
			type: 'GET',
			url: '/boboface/json/v1/wiki/tree/' + id,
		    data: null,
		    success: function(data){
		    	if(data.code != 100000){
		    		alert(data.msg);
		    	}else{
		    		if(data.data == null){
		    			alert('请求节点数据为空');
		    		}else{
		    			$('#wikiTreePrivilege-titile').empty();
						$('#wikiTreePrivilege-titile').append(nano(wikiTreeTitleTemplate, data.data.wikiTree));
						$('#wikiTreePrivilege-body').empty();
						if(data.data.wikiTree.allowadd == 1)
							data.data.wikiTree.allowadd = {isChecked : 'checked'};
						if(data.data.wikiTree.allowedit == 1)
							data.data.wikiTree.allowedit = {isChecked : 'checked'};
						if(data.data.wikiTree.allowdelete == 1)
							data.data.wikiTree.allowdelete = {isChecked : 'checked'};
						$('#wikiTreePrivilege-body').append(nano(wikiTreeBodyTemplate, data.data.wikiTree));
						$('#wikiTreePrivilegeModal').modal('show');
		    		}
		    	}
		    },
		    error: function() {  
	        	alert('请求异常.');
	      	}
		});
	/*	$('#wikiTreePrivilegeList').on('click','.wikiTreePrivilegeBtn',function(){
	});*/
}
$('#saveWikiPrivilegeBtn').click(function(){
	$('#wikiTreePrivilegeModal').modal("hide");
	$('#messageModal-title').empty();
	$('#messageModal-title').append(nano(messageTitleTemplate, {title:'注意'}));
	$('#messageModal-body').empty();
	$('#messageModal-body').append(nano(messageBodyTemplate, {body:'是否更改wikiTree权限?'}));
	$('#messageModal-btn').empty();
	$('#messageModal-btn').append(nano(messageYesBtnTemplate, {method:'saveWikiTreePrivilegeSetting()'}));
	$('#messageModal').modal('show');
});

//保存wikiTree权限配置方法
function saveWikiTreePrivilegeSetting(){
	var msg,type;
	var form = $('#wikiTreePrivilegeModal-form');
	$.ajax({
			type: 'POST',
			url: '/boboface/json/v1/wiki/tree/savePrivilege',
		    data: {
		    	'wikiTree.id':form.find('[name="wikiTree.id"]').val(),
		    	'wikiTree.allowadd':(typeof(form.find('[name="wikiTree.allowadd"]:checked').val()) == 'undefined' ? 0 : form.find('[name="wikiTree.allowadd"]:checked').val()),
		    	'wikiTree.allowedit':(typeof(form.find('[name="wikiTree.allowedit"]:checked').val()) == 'undefined' ? 0 : form.find('[name="wikiTree.allowedit"]:checked').val()),
		    	'wikiTree.allowdelete':(typeof(form.find('[name="wikiTree.allowdelete"]:checked').val()) == 'undefined' ? 0 : form.find('[name="wikiTree.allowdelete"]:checked').val())
		    },
		    success: function(data){
		    	if(data.code != 100000){
		    		type = 'danger';
		    	}else{
		    		type = 'success';
		    		loadWikiTreePrivilege();
		    	}
		    	msg = data.msg;
		    },
		    error: function() {  
		    	type = 'danger';
		    	msg = '请求异常';
	      	},
	      	complete: function(){
	      		$('#messageModal').modal('hide');
	      		showDialog(msg,type);
	      	}
		});
};