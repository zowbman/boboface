//adsProjectManage
//adsProjectList
//权限列表
var adsProjectListTemplate = '<tr>' +
				           '<td><a href="/adsBuild?id={id}" target="_blank">{id}</a></td>' +
				           '<td>{appname}</td>' +
				           '<td>{introduction}</td>' +
				           '<td>{storagepath}</td>' +
				           '<td><a class="btn btn-default btn-xs" href="javascript:;" role="button">查看详情</a></td>' +
				           '</tr>';
$(function(){
	loadAdsProjectList();
});
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