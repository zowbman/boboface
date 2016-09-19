//wiki默认内容
var wikiContent = "# Boboface' wiki";
//ads默认内容
var adsContent = "loading...";
//消息模态框模板
//头
var messageTitleTemplate = '<h4 class="modal-title">{title}</h4>';
//内容
var messageBodyTemplate = '<p style="word-break:break-all;">{body}</p>';
//确认按钮
var messageYesBtnTemplate = '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>'+
							'<button onclick="{method}" type="button" class="btn btn-primary">确定</button>';
//警告框模板
var alertTemplate = '<div class="alert {type} alert-dismissible fade in" role="alert">' +
					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
					'<strong>{name}</strong> {msg}' +
					'</div>';
//公共模态框消息方法（底部显示）
var alertBoxTime;
//success、warning、danger、info(default)
function showDialog(msg,type){
	var name;
	if(type == 'success'){
		type = 'alert-success';
		name = 'Success';
	}else if(type == 'warning'){
		type = 'alert-warning';
		name = 'Warning';
	}else if(type == 'danger'){
		type = 'alert-danger';
		name = 'Danger';
	}else{
		type = 'alert-info';
		name = 'Info';
	}
	var data = {type:type,name:name,msg:msg};
	$('#alertBox').empty();
	$('#alertBox').append(nano(alertTemplate, data));
	alertBoxHide();
}
function alertBoxHide(){
	alertBoxTime = setTimeout(function(){//3秒关闭警告框
		$('#alertBox').children('div').first().alert('close');
	},3000);
}
$(function(){
	$('#alertBox').hover(function(){
		clearTimeout(alertBoxTime);
	},function(){
		alertBoxHide();
	});
});

//公共模态框消息方法（弹框显示）
function alertDialog(title, body){
	$('#messageModal-title').empty();
	$('#messageModal-title').append(nano(messageTitleTemplate, {title:title}));
	$('#messageModal-body').empty();
	$('#messageModal-body').append(nano(messageBodyTemplate, {body:body}));
	$('#messageModal').modal('show');
}

//分页模板
//tagetName 分页容器
//pageInfo 分页信息
//methodName 方法名
//pageUrl 分页Url
function paging(tagetName,pageInfo,methodName,pageUrl){
	var onclickMethod;
	//头部
	onclickMethod = methodName + '(\'' + pageUrl + pageInfo.prePage  + '\')';
	var pagingTemplate = '<ul class="pagination pagination-sm">' +
						  '<li '+ (pageInfo.hasFirstPage ? 'class="disabled"' : '') +'>' +
						    '<a class="page" onclick="'+ (!pageInfo.hasFirstPage ? onclickMethod : 'javascript:;') +'" aria-label="Previous">' +
						      '<span aria-hidden="true">&laquo;</span>' +
						    '</a>' +
						  '</li>';
	//中部
	$.each(pageInfo.navigatepageNums, function(i, item){
		if(pageInfo.pageNum == item){
			pagingTemplate += '<li class="active"><a value="' + pageUrl + item + '" onclick="javascript:;">'+ item +'</a></li>';
		}else{
			onclickMethod = methodName + '(\'' + pageUrl + item  + '\')';
			pagingTemplate += '<li><a class="page" onclick="'+onclickMethod+'">'+ item +'</a></li>';
		}
	});
	//尾部
	onclickMethod = methodName + '(\'' + pageUrl + pageInfo.nextPage  + '\')';
	pagingTemplate += '<li '+ (pageInfo.hasLastPage ? 'class="disabled"' : '') +'>' +
					  '<a class="page" onclick="'+ (!pageInfo.hasLastPage ? onclickMethod : 'javascript:;') +'" aria-label="Next">' +
					  '<span aria-hidden="true">&raquo;</span>' +
					  '</a>' +
					  '</li>' +
					  '</ul>';
	$('#' + tagetName).empty();
	$('#' + tagetName).append(nano(pagingTemplate, {pageInfo}));
}
//高权模块
var highLevel;
$(document).keypress(function(e){
	if(e.ctrlKey && e.which == 13 || e.which == 10) {
		$('#highLevelPrivilegeModal').modal('show');
	} else if (e.shiftKey && e.which==13 || e.which == 10) {
		$('#highLevelPrivilegeModal').modal('show');
	}
});

$(function(){
	$.ajax({
			type: 'GET',
			url: '/boboface/json/v1/highLevel/status',
		    data: null,
		    async: false,
		    success: function(data){
		    	if(data.code != 100000){
		    		highLevel = 0;
		    	}else{
		    		highLevel = data.data.status;
		    	}
		    },
		    error: function() {
		    	highLevel = 0;
	      	}
		});
		if(highLevel == 1){
			$('#mytab').find('.highLevel').attr('style','display:block!important;');
			$('#hightLevel-mytab').find('.highLevel').attr('style','display:block!important;');
		}
		$('#highLevelPrivilegeModal').find('form').submit(function(){
			var msg,type;
			$.ajax({
				type: 'GET',
				url: '/boboface/json/v1/highLevel',
			    data: {
			    	cmd: $('#highLevelCmdInput').val()
			    },
			    success: function(data){
			    	if(data.code != 100000){
			    		type = 'danger';
			    		msg = data.msg;
			    	}else{
			    		type = 'success';
		    			$('#highLevelPrivilegeModal').modal('hide');
		    			setTimeout(function(){
							window.location.reload();
						},3000);
						msg = data.data.msg;
			    	}
			    },
			    error: function() {  
		        	type = 'danger';
			    	msg = '请求异常';
		      	},
		      	complete: function(){
		      		$('#highLevelPrivilegeModal').modal('hide');
		      		showDialog(msg,type);
		      	}
			});
		return false;
	});
});