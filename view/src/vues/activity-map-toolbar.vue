<template>
<!-- BEGIN PAGE TOOLBAR -->
<div class="page-toolbar">
    <!-- BEGIN THEME PANEL -->
    <div class="btn-group btn-theme-panel">
        <a href="javascript:;" class="btn dropdown-toggle" data-toggle="dropdown">
            <i class="icon-settings"></i>
        </a>
        <div class="dropdown-menu theme-panel pull-right dropdown-custom hold-on-click">
            <h3>Package List</h3>
			<button class="btn btn-outline dark sbold" v-for="name in packageNames" @click="changePackage(name);"> {{name}} </button>
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
</style>