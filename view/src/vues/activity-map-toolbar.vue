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
			<div v-for="name in packageNames">
				<button class="btn btn-outline dark sbold" @click="changePackage(name);"> {{name}} </button>
				<br/>
			</div>
        </div>
    </div>
    <!-- END THEME PANEL -->
</div>
<!-- END PAGE TOOLBAR -->
</template>
<script>
module.exports = {
	created: function() {
		var me = this;
        $.get('/getAllPackageNames', function(data) {
            me.packageNames = data.packageNames;
        });
	},
	data: function() {
		return {
			packageNames: []
		};
	},
	methods: {
		changePackage: function(name) {
			window.app.$refs.activityMap.packageName = name;
			window.app.$refs.activityMap.draw();
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