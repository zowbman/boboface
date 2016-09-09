//zTree
var zTreeObj;
var setting = {
  	view: {
    	fontCss : {'font-size':'14px',color:'#337ab7','height':'22px'},
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
		beforeClick: zTreeBeforeClick
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
			zTreeObj = $.fn.zTree.init($("#serverTree"), setting, data.data.list);
			//展开所有节点
			zTreeObj.expandAll(true); 
		});
}

//ztree event
function zTreeOnClick(event, treeId, treeNode) {
	$('#adsContent').load('/tpl/adsServerManage.html');
};

function zTreeBeforeClick(treeId, treeNode, clickFlag) {
	return (!treeNode.isParent);
};