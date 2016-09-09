//adsServerManage
 //ads挂载服务器业务树 递归方法
function adsMountServerServiceTree(serviceTree,tree,trees){
    $.each(serviceTree,function(i,item){
        if(item.childServiceTree.length > 0){
            adsMountServerServiceTree(item.childServiceTree,item,trees);
        }else{
            var t;
            if(typeof(tree.title) == "undefined"){
                t = {id : item.id, title : (item.title)};
            }else{
                t = {id : item.id, title : (tree.title + ' - ' + item.title)};
            }
            trees.push(t);
            return t;
        }
    });
    return trees;
}
//加载业务树
$(function(){
    $.ajax({
        type: 'GET',
        url: "/boboface/json/v1/serviceTree/adsMountProjectServiceTree",
        data: null,
        success: function(data){
            if(data.code == 100000){
                $('#serverServiceTree').empty();
                $('#serverServiceTree').append(nano(serviceTreeListTemplate, {'title' : '请选择所属业务树','id' : '-1'}));
                if(data.data.maxDepth >=3){
	                var rootServiceTree = data.data.rootServiceTree;
	                var tree = adsMountServerServiceTree(rootServiceTree.childServiceTree,{},[]);
	                $.each(tree,function(i,item){
	                    item.title = data.data.rootServiceTree.title + ' - ' + item.title;
	                    $('#serverServiceTree').append(nano(serviceTreeListTemplate,item));
	                });
                }
            }else{
                condole.log('业务树请求失败');
            }
        },
        error: function() {
            console.log('业务树请求异常');
        }
    });
});
//adsServerList
//服务器列表
var adsServerListTemplate = '<tr>' +
				           '<td><input type="checkbox" {serverMount} value="{ip}"></td>' +
				           '<td>{ip}</td>' +
				           '<td>{serverName}</td>' +
				           '<td>{regionId}</td>' +
				           '<td><div class="adsServerTitle hideTitle">{title}</div></td>' +
				           '<td><a class="btn btn-default btn-xs" href="javascript:;" role="button">查看详情</a></td>' +
				           '</tr>';
$(function(){
	loadAdsServerList();
});
/*业务树选择*/
$('#serverServiceTree').change(function(){
	if($(this).val() == -1){
		$('#adsServerList').find('input').attr('checked',false);
		return;
	}
	loadAdsServerList($(this).val());
});
function loadAdsServerList(serverTreeId){
	$.ajax({
			type: 'GET',
			url: '/boboface/json/v1/server/list',
		    data: {
		    	serverTreeId : serverTreeId
		    },
		    success: function(data){
		    	if(data.code != 100000){
		    		alert(data.msg);
		    	}else{
		    		$('#adsServerList').empty();
		    		$.each(data.data.list, function(i, item){
						$('#adsServerList').append(nano(adsServerListTemplate, item));
					});
		    	}
		    },
		    error: function() {  
	        	alert('请求异常.');
	      	}
		});
}