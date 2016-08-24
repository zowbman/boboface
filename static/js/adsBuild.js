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
//项目发布
$('#adsBuildForm').submit(function(){
	var _form = $('#adsBuildForm');
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
		    }
		});
	return false;
});