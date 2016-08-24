//show.bs.modal
//shown.bs.modal
//hide.bs.modal
//hidden.bs.modal
//loaded.bs.modal
//高权模态框
$('#highLevelPrivilegeModal').on('shown.bs.modal', function (e) {
	$('#highLevelPrivilegeModal').find('input').focus();
});
$('#highLevelPrivilegeModal').on('hidden.bs.modal', function (e) {
	$('#highLevelPrivilegeModal').find('form')[0].reset();
});