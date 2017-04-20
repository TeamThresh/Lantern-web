<template>
	<!-- BEGIN SIDEBAR -->
	<div class="page-sidebar-wrapper">
		<!-- BEGIN SIDEBAR -->
		<!-- DOC: Set data-auto-scroll="false" to disable the sidebar from auto scrolling/focusing -->
		<!-- DOC: Change data-auto-speed="200" to adjust the sub menu slide up/down speed -->
		<div class="page-sidebar navbar-collapse collapse">
			<!-- BEGIN SIDEBAR MENU -->
			<!-- DOC: Apply "page-sidebar-menu-light" class right after "page-sidebar-menu" to enable light sidebar menu style(without borders) -->
			<!-- DOC: Apply "page-sidebar-menu-hover-submenu" class right after "page-sidebar-menu" to enable hoverable(hover vs accordion) sub menu mode -->
			<!-- DOC: Apply "page-sidebar-menu-closed" class right after "page-sidebar-menu" to collapse("page-sidebar-closed" class must be applied to the body element) the sidebar sub menu mode -->
			<!-- DOC: Set data-auto-scroll="false" to disable the sidebar from auto scrolling/focusing -->
			<!-- DOC: Set data-keep-expand="true" to keep the submenues expanded -->
			<!-- DOC: Set data-auto-speed="200" to adjust the sub menu slide up/down speed -->
			<a class="btn blue" id="btnAppName">
				<i class="fa fa-dropbox fa-4"></i>
				Dropbox
			</a>
			<ul class="page-sidebar-menu   page-header-fixed" data-keep-expanded="false" data-auto-scroll="false" data-slide-speed="200">
				<li class="nav-item start">
					<a href="/" class="nav-link">
						<i class="icon-home"></i>
						<span class="title">Dashboard</span>
					</a>
				</li>
				<!-- Performance -->
				<li class="heading">
					<h3 class="uppercase">Performance</h3>
				</li>
				<li class="nav-item  ">
					<a href="/activityDetail/cpu" class="nav-link">
						<i class="icon-layers"></i>
						<span class="title">CPU/Memory</span>
					</a>
				</li>
				<li class="nav-item">
					<a href="/activityDetail/network" class="nav-link">
						<i class="icon-feed"></i>
						<span class="title">Network</span>
					</a>
				</li>
				<!-- Crash -->
				<li class="heading">
					<h3 class="uppercase">Crash</h3>
				</li>
				<li class="nav-item">
					<a href="/" class="nav-link">
						<i class="icon-wrench"></i>
						<span class="title">Crash</span>
					</a>
				</li>
				<!-- User -->
				<li class="heading">
					<h3 class="uppercase">User</h3>
				</li>
				<li class="nav-item">
					<a href="/" class="nav-link">
						<i class="icon-user"></i>
						<span class="title">User Flow</span>
					</a>
				</li>
				<li class="nav-item">
					<a href="/" class="nav-link">
						<i class="icon-puzzle"></i>
						<span class="title">Device Usage</span>
					</a>
				</li>
				<!-- Report -->
				<li class="heading">
					<h3 class="uppercase">Report</h3>
				</li>
				<li class="nav-item">
					<a href="/" class="nav-link">
						<i class="icon-docs"></i>
						<span class="title">Onepage Report</span>
					</a>
				</li>
				<li class="nav-item">
					<a href="/" class="nav-link">
						<i class="icon-bar-chart"></i>
						<span class="title">Statistics</span>
					</a>
				</li>
			</ul>
			<!-- END SIDEBAR MENU -->
		</div>
		<!-- END SIDEBAR -->
	</div>
	<!-- END SIDEBAR -->
</template>

<script>
</script>

<style lang="sass" scoped>
	/* side bar height 길게 */
	div.page-container, div.page-sidebar-wrapper, div.page-sidebar {
		height: 100% !important;
	}
	div.page-sidebar-wrapper {
		display: inline !important;
	}
	a#btnAppName {
		margin: 0;
		padding: 0 0 0 20px;
		width: 100%;
		height: 50px;
		display: block;
		// background-color: #007eed;
		text-align: left;
		line-height: 50px;

		& > i {
			font-size: 27px;
			vertical-align: middle;
		}
	}
</style>