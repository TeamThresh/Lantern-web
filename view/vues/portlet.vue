<template lang="html">
<div class="portlet light">
	<div class="portlet-title" v-if="!simple">
		<div class="caption">
			<span class="caption-subject bold uppercase">{{title}}</span>
			<span class="caption-helper">{{desc}}</span>
		</div>
		<div class="actions">
			<!-- <a class="btn btn-circle btn-icon-only btn-default" href="javascript:;">
				<i class="icon-cloud-upload"></i>
			</a> -->
			<a class="" :href="'/activityDetail/' + packageName + '/' + activityName + '/' + resourceType">
				<i class="material-icons">loupe</i>
			</a>
			<!-- <a class="btn btn-circle btn-icon-only btn-default" href="javascript:;">
				<i class="icon-trash"></i>
			</a>
			<a class="btn btn-circle btn-icon-only btn-default fullscreen" href="javascript:;"> </a> -->
		</div>
	</div>
	<div class="portlet-body">
		<div class="">
			<slot></slot>
		</div>
	</div>
</div>
</template>

<script>
module.exports = {
	props: [
		'title', 'desc', 'content', 'simple',
		'packageName', 'activityName', 'resourceType' // for top-right button
	]
}
</script>

<style lang="css" scoped>
	.portlet {
		/*background-color: #252734;*/
	}
</style>