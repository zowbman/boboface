//stsTreeManage
//stsTreePrivilege 权限
//权限列表
var stsTreeListTemplate = '<tr>' +
				           '<td>{index}</td>' +
				           '<td>{title}</td>' +
				           '<td>{allowadd}</td>' +
				           '<td>{allowedit}</td>' +
				           '<td>{allowdelete}</td>' +
				           '<td>{addTimeToData}</td>' +
				           '<td><a class="btn btn-default btn-xs" href="javascript:;" onclick="getStsTreePrivilegeSetting({id});" role="button">权限</a></td>' +
				           '</tr>';
$(function(){
	loadStsTreePrivilege();
});
function loadStsTreePrivilege(pageUrl){
	var url = '/boboface/json/v1/serviceTree/treeListByPage?pageSize=10';
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
		    		$('#stsTreePrivilegeList').empty();
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
						$('#stsTreePrivilegeList').append(nano(stsTreeListTemplate, item));
					});
					paging('stsTreePrivilegePaging',data.data.pageInfo,'loadStsTreePrivilege',data.data.pageUrl);
		    	}
		    },
		    error: function() {  
	        	alert('请求异常.');
	      	}
		});
}

//修改权限配置
var stsTreeTitleTemplate = '<h4 class="modal-title">{title}</h4>';

var stsTreeBodyTemplate = '<tr>' +
				           '<td><div class="checkbox"><label><input name="serviceTree.allowadd" type="checkbox" {allowadd.isChecked} value="1" disabled>Y</label></div></td>' +
				           '<td><div class="checkbox"><label><input name="serviceTree.allowedit" type="checkbox" {allowedit.isChecked} value="1">Y</label></div></td>' +
				           '<td><div class="checkbox"><label><input name="serviceTree.allowdelete" type="checkbox" {allowdelete.isChecked} value="1">Y</label></div></td>' +
				           '</tr>' +
				           '<input name="serviceTree.id" type="hidden" value="{id}">';

function getStsTreePrivilegeSetting (id){
	//获取对应stsTree 数据
	$.ajax({
			type: 'GET',
			url: '/boboface/json/v1/serviceTree/' + id,
		    data: null,
		    success: function(data){
		    	if(data.code != 100000){
		    		alert(data.msg);
		    	}else{
		    		if(data.data == null){
		    			alert('请求节点数据为空');
		    		}else{
		    			$('#stsTreePrivilege-titile').empty();
						$('#stsTreePrivilege-titile').append(nano(stsTreeTitleTemplate, data.data.serviceTree));
						$('#stsTreePrivilege-body').empty();
						if(data.data.serviceTree.allowadd == 1)
							data.data.serviceTree.allowadd = {isChecked : 'checked'};
						if(data.data.serviceTree.allowedit == 1)
							data.data.serviceTree.allowedit = {isChecked : 'checked'};
						if(data.data.serviceTree.allowdelete == 1)
							data.data.serviceTree.allowdelete = {isChecked : 'checked'};
						$('#stsTreePrivilege-body').append(nano(stsTreeBodyTemplate, data.data.serviceTree));
						$('#stsTreePrivilegeModal').modal('show');
		    		}
		    	}
		    },
		    error: function() {  
	        	alert('请求异常.');
	      	}
		});
}
$('#saveStsPrivilegeBtn').click(function(){
	$('#stsTreePrivilegeModal').modal("hide");
	$('#messageModal-title').empty();
	$('#messageModal-title').append(nano(messageTitleTemplate, {title:'注意'}));
	$('#messageModal-body').empty();
	$('#messageModal-body').append(nano(messageBodyTemplate, {body:'是否更改stsTree权限?'}));
	$('#messageModal-btn').empty();
	$('#messageModal-btn').append(nano(messageYesBtnTemplate, {method:'saveStsTreePrivilegeSetting()'}));
	$('#messageModal').modal('show');
});

//保存stsTree权限配置方法
function saveStsTreePrivilegeSetting(){
	var msg,type;
	var form = $('#stsTreePrivilegeModal-form');
	$.ajax({
			type: 'POST',
			url: '/boboface/json/v1/serviceTree/savePrivilege',
		    data: {
		    	'serviceTree.id':form.find('[name="serviceTree.id"]').val(),
		    	'serviceTree.allowadd':(typeof(form.find('[name="serviceTree.allowadd"]:checked').val()) == 'undefined' ? 0 : form.find('[name="serviceTree.allowadd"]:checked').val()),
		    	'serviceTree.allowedit':(typeof(form.find('[name="serviceTree.allowedit"]:checked').val()) == 'undefined' ? 0 : form.find('[name="serviceTree.allowedit"]:checked').val()),
		    	'serviceTree.allowdelete':(typeof(form.find('[name="serviceTree.allowdelete"]:checked').val()) == 'undefined' ? 0 : form.find('[name="serviceTree.allowdelete"]:checked').val())
		    },
		    success: function(data){
		    	if(data.code != 100000){
		    		type = 'danger';
		    	}else{
		    		type = 'success';
		    		loadStsTreePrivilege();
		    		loadTreeList();
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