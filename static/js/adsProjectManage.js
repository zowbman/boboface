//adsProjectManage
//adsProjectList
var adsProjectListTemplate = '<tr>' +
				           '<td><a href="/adsBuild?id={id}" target="_blank">{id}</a></td>' +
				           '<td>{appname}</td>' +
				           '<td>{introduction}</td>' +
				           '<td>{storagepath}</td>' +
				           '<td><a class="btn btn-default btn-xs" href="javascript:;" onclick="adsProjectDetail({id});" role="button">查看详情</a></td>' +
				           '</tr>';
$(function(){
	loadAdsProjectList();
});
/*项目自动化部署列表*/
function loadAdsProjectList(pageUrl){
	var treeObj = $.fn.zTree.getZTreeObj("stsTree");
	var nodes = treeObj.getSelectedNodes();
	if(nodes.length == 0)
		return;
	var url = '/boboface/json/v1/ads/projectList/' + nodes[0].id + '?pageSize=10';
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
		    		$('#adsProjectList').empty();
		    		$.each(data.data.list, function(i, item){
						$('#adsProjectList').append(nano(adsProjectListTemplate, item));
					});
					paging('adsProjectPaging',data.data.pageInfo,'loadAdsProjectList',data.data.pageUrl);
		    	}
		    },
		    error: function() {  
	        	alert('请求异常.');
	      	}
		});
}

/*项目详情*/

//修改权限配置
var adsProjectDetailTitleTemplate = '<h4 class="modal-title">{title}</h4>';

var adsProjectDetailBodyTemplate = '<tr>' +
				           '<td><div class="checkbox"><label><input name="serviceTree.allowadd" type="checkbox" {allowadd.isChecked} value="1" disabled>Y</label></div></td>' +
				           '<td><div class="checkbox"><label><input name="serviceTree.allowedit" type="checkbox" {allowedit.isChecked} value="1">Y</label></div></td>' +
				           '<td><div class="checkbox"><label><input name="serviceTree.allowdelete" type="checkbox" {allowdelete.isChecked} value="1">Y</label></div></td>' +
				           '</tr>' +
				           '<input name="serviceTree.id" type="hidden" value="{id}">';

function adsProjectDetail(appId){
	$.ajax({
			type: 'GET',
			url: "/boboface/json/v1/ads/projectDetail/" + appId,
		    data: null,
		    success: function(data){
		    	if(data.code != 100000){
		    		alertDialog('注意','查看项目详情请求出错，请刷新重试!');
		    	}else{
		    		var servicetreeid = data.data.adsProject.servicetreeid;
		    		$('#adsProjectDetail-titile').empty();
					$('#adsProjectDetail-titile').append(nano(adsProjectDetailTitleTemplate, {title : data.data.adsProject.introduction + "(" + data.data.adsProject.appname + ")"}));
					$('#adsProjectDetail-form').empty();
					$('#adsProjectDetail-form').load('../tpl/adsProjectEdit.html',function(){
						$.ajax({
						    type: 'GET',
				            url: "/boboface/json/v1/serviceTree/adsMountProjectServiceTree",
				            data: null,
				            success: function(data){
				                if(data.code == 100000){
				                    $('#projectServiceTree').empty();
				                    $('#projectServiceTree').append(nano(serviceTreeListTemplate, {'title' : '请选择所属业务树','id' : '-1'}));
				                    if(data.data.maxDepth >=3){
				                        var rootServiceTree = data.data.rootServiceTree;
				                        var tree = adsMountProjectServiceTree(rootServiceTree.childServiceTree,{},[]);
				                        $.each(tree,function(i,item){
				                            item.title = data.data.rootServiceTree.title + ' - ' + item.title;
				                            $('#projectServiceTree').append(nano(serviceTreeListTemplate,item));
				                        });
				                        $('#projectServiceTree').val(servicetreeid);
				                    }
				                }else{
				                    condole.log('业务树请求失败');
				                }
				            },
				            error: function() {
				                console.log('业务树请求异常');
				            }
				        });
				        $('#projectId').val(data.data.adsProject.id);
						$('#projectName').val(data.data.adsProject.appname);//项目名称
						$('#introduction').val(data.data.adsProject.introduction);//项目简介
						$('#storagePath').val(data.data.adsProject.storagepath);//存储路径
						$('#gitPath').val(data.data.adsProject.gitpath);//仓库地址
						$('#runUser').val(data.data.adsProject.runuser);//运行账号
						$('#runGroup').val(data.data.adsProject.rungroup);//账号属组
					});
		    		$('#adsProjectDetailModal').modal('show');
		    	}
		    },
		    error: function() {  
		    	alertDialog('注意','查看项目详情请求出错，请刷新重试!');
	      	}
		});
}