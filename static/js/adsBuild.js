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
		    	}
		    }
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

	$.ajax({
			type: 'POST',
			url: "/boboface/json/v1/ads/projectBuild",
		    data: {
		    	appId: _form.find('input[name="appId"]').val(),
		    	appBranch: _form.find('input[name="appBranch"]').val(),
		    	branchTag: _form.find('input[name="branchTag"]').val()
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