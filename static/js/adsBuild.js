//发布参数初始化
$(function(){
	var _form = $('#adsBuildForm');
	$.ajax({
			type: 'GET',
			url: "/boboface/json/v1/ads/project/" + _form.find('input[name="appId"]').val(),
		    data: null,
		    success: function(data){
		    	if(data.code != 100000){
		    		alert(data.msg);
		    	}else{
		    		_form.find('#appName').text(data.data.adsProject.appname + "(" + data.data.adsProject.introduction +")");
		    		_form.find('#appStoragePath').text(data.data.adsProject.storagepath);
		    		_form.find('input[name="serviceTreeId"]').val(data.data.adsProject.servicetreeid);
		    		adsProjectServerList();
		    	}
		    }
		});
});

var adsProjectServerListTemplate = '<tr>' +
					           '<td><input type="checkbox" value="{serverip}"></td>' +
					           '<td>{serverip}</td>' +
					           '<td>--</td>' +
					           '</tr>';
//项目部署服务器列表
function adsProjectServerList(pageUrl){
	var _form = $('#adsBuildForm');
	var url = '/boboface/json/v1/ads/projectServerList/' + _form.find('input[name="serviceTreeId"]').val();
	if(typeof(pageUrl) != 'undefined')
		url = pageUrl;
	//return;
	$.ajax({
			type: 'GET',
			url: url,
		    data: null,
		    success: function(data){
		    	if(data.code != 100000){
		    		alert(data.msg);
		    	}else{
		    		$('#adsProjectServerList').empty();
		    		$.each(data.data.list, function(i, item){
						$('#adsProjectServerList').append(nano(adsProjectServerListTemplate, item));
					});
					paging('adsProjectServerPaging',data.data.pageInfo,'adsProjectServerList',data.data.pageUrl);
		    	}
		    }
		});
}

//选中发布机器单选
$('#adsProjectServerList').on('change','input[type="checkbox"]',function(){
	$.each($(this).attr('checked',true).parent().parent().siblings(),function(i,item){
		$(item).find('input[type="checkbox"]').attr('checked',false);
	});
});

//改变校验样式
function createSTreeCheck(target,isError){
	if(isError){
		target.next().css('display','none');
		target.parent().removeClass('has-error');
		target.parent().addClass('has-success');
	}else{
		target.next().css('display','block');
		target.parent().addClass('has-error');
		target.parent().removeClass('has-success');
	}
}

//分支
$('input[name="appBranch"]').blur(function(){
	if($(this).val() != ''){
		createSTreeCheck($(this),true);
	}else{
		createSTreeCheck($(this),false);	
	}
});

//项目发布
$('#adsBuildForm').submit(function(){
	var _form = $('#adsBuildForm');

	var flag = true;
	//校验
	if($('input[name="appBranch"]').val() != ''){
		createSTreeCheck($('input[name="appBranch"]'),true);
	}else{
		createSTreeCheck($('input[name="appBranch"]'),false);
		flag = false;
	}

	if(!flag)
		return false;

	if(_form.find('input[type="checkbox"]:checked').length == 0){
		alertDialog('注意','请选择需要发布的机器!');
		return false;
	}

	$.ajax({
			type: 'POST',
			url: "/boboface/json/v1/ads/projectBuild",
		    data: {
		    	appId: _form.find('input[name="appId"]').val(),
		    	appBranch: _form.find('input[name="appBranch"]').val(),
		    	branchTag: _form.find('input[name="branchTag"]').val(),
		    	ip : _form.find('input[type="checkbox"]:checked').val()
		    },
		    beforeSend: function(){
		    	$('#adsBuildProgress').css('display','block');
		    },
		    success: function(data){
		    	$('#adsBuildProgress').css('display','none');
		    	$('#buildResultModal-body').empty();
				$('#buildResultModal-body').append(nano(messageBodyTemplate, {body:data.data.buildResult}));
		    	$('#buildResultModal').modal('show');
		    }
		});
	return false;
});