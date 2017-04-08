<template>
<!-- BEGIN PAGE TOOLBAR -->
<div class="page-toolbar">
    <!-- BEGIN THEME PANEL -->
    <div class="btn-group btn-theme-panel">
        <a href="javascript:;" class="btn dropdown-toggle" data-toggle="dropdown">
            <i class="icon-settings"></i>
        </a>
        <div class="dropdown-menu pull-right dropdown-custom hold-on-click page-toolbar-content">
            <h3>Package List</h3>
			<span class="sbold">{{packageName}}</span>
			<div v-for="name in packageNames">
				<button class="btn btn-outline dark sbold" @click="changePackage(name);"> {{name}} </button>
				<br/>
			</div>
			<br/>
			<br/>
			<h3>Data Update</h3>
			<button class="btn btn-outline dark sbold" @click="analyze();"> Analyze </button>
        </div>
    </div>
    <!-- END THEME PANEL -->
</div>
<!-- END PAGE TOOLBAR -->
</template>
<script>
module.exports = {
	mounted: function() {
		var me = this;
        $.get('/api/getAllPackageNames', function(data) {
            me.packageNames = data.packageNames;
        });
	},
	data: function() {
		return {
			packageNames: [],
			packageName: ''
		};
	},
	methods: {
		changePackage: function(name) {
			var me = this;
			me.packageName = name;
			window.app.$refs.activityMap.packageName = name;
			window.app.$refs.activityMap.draw();
		},
		analyze: function() {
			$.blockUI({
				message: '<div class="loading-message loading-message-boxed"><span>&nbsp;&nbsp;작업중...</span></div>',
				baseZ: 9996,
				css: {
					top: '10%',
					border: '0',
					padding: '0',
					backgroundColor: 'none'
				},
				overlayCSS: {
					backgroundColor: '#555',
					opacity: 0.25,
					cursor: 'wait'
				}
			});
			$.get('/analyze', function(data) {
				bootbox.alert(data.cnt + '개 분석 완료. 새로고침 해주세요.');
				$.unblockUI();
			});
		}
	}
};
</script>

<style lang="sass" scoped>
	.page-toolbar-content {
		padding: 12px 24px 24px 24px;
		.btn {
			padding: 6px 12px 6px 12px;
		}
	}
</style>