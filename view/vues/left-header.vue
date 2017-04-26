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
			<!-- <a class="btn blue" id="btnAppName">
				<i class="fa fa-dropbox fa-4"></i>
				Dropbox
			</a> -->
			<ul class="page-sidebar-menu   page-header-fixed" data-keep-expanded="false" data-auto-scroll="false" data-slide-speed="200">
				<li class="heading">
					<h3 class="uppercase">Your App Information</h3>
				</li>
				<li class="nav-item">
					<a href="#" class="nav-link">
						<i class="fa fa-th-large"></i>
						<span class="title">Kakaotalk</span>
					</a>
				</li>
				<li class="nav-item">
					<a href="#" class="nav-link">
						<i class="fa fa-code-fork"></i>
						<span class="title">1.0.16</span>
					</a>
				</li>
				<li class="heading">
					<h3 class="uppercase">Filter</h3>
				</li>
				<li class="nav-item">
					<a href="#" class="nav-link">
						<i class="fa fa-filter"></i>
						<span class="title">some menus</span>
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
	// a#btnAppName {
	// 	margin: 0;
	// 	padding: 0 0 0 20px;
	// 	width: 100%;
	// 	height: 50px;
	// 	display: block;
	// 	// background-color: #007eed;
	// 	text-align: left;
	// 	line-height: 50px;
	//
	// 	& > i {
	// 		font-size: 27px;
	// 		vertical-align: middle;
	// 	}
	// }
</style>