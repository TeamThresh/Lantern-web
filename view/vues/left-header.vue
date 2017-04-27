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
					<h3 class="uppercase">Apps</h3>
				</li>
				<li class="nav-item start active">
					<a href="javascript:;" class="nav-link nav-toggle">
						<i class="fa fa-th-large"></i>
						<span class="title">{{app.packageName}}</span>
						<span class="selected"></span>
						<span class="arrow"></span>
					</a>
					<ul class="sub-menu">
						<template v-for="n in app.packageNames">
							<li :class="'nav-item ' + (n == app.packageName ? 'active' : '')">
								<a href="#" class="nav-link" @click="changePackageName(n)">
									<i class="fa fa-th-large"></i>
									<span class="title">{{n.substr(0, 20)}}</span>
								</a>
							</li>
							<li class="nav-item">
								<a href="#" class="nav-link">
									<i class="fa fa-code-fork"></i>
									<span class="title">{{Math.floor(Math.random() * 4) + '.' + Math.floor(Math.random() * 100) + '.' + Math.floor(Math.random() * 100)}}</span>
								</a>
							</li>
						</template>
					</ul>
				</li>
				<li class="heading">
					<h3 class="uppercase">Filter</h3>
				</li>
				<li class="nav-item">
					<a href="#" class="nav-link nav-toggle">
						<!-- <i class="fa fa-filter"></i> -->
						<span class="title">Devices</span>
						<span class="arrow"></span>
					</a>
					<ul class="sub-menu">
						<li class="nav-item">
							<a href="#" class="nav-link">갤럭시 S8 사쿠라 에디션</a>
						</li>
						<li class="nav-item">
							<a href="#" class="nav-link">갤럭시 S8+ 무궁화 에디션</a>
						</li>
						<li class="nav-item">
							<a href="#" class="nav-link">안철수 - 실망스럽습니다폰</a>
						</li>
						<li class="nav-item">
							<a href="#" class="nav-link">안철수 - 4초만에뭐하징?폰</a>
						</li>
					</ul>
				</li>
				<li class="nav-item">
					<a href="#" class="nav-link nav-toggle">
						<!-- <i class="fa fa-filter"></i> -->
						<span class="title">Location</span>
						<span class="arrow"></span>
					</a>
					<ul class="sub-menu">
						<li class="nav-item">
							<a href="#" class="nav-link">칸코쿠</a>
						</li>
						<li class="nav-item">
							<a href="#" class="nav-link">니뽄</a>
						</li>
						<li class="nav-item">
							<a href="#" class="nav-link">미구크</a>
						</li>
						<li class="nav-item">
							<a href="#" class="nav-link">유러브</a>
						</li>
					</ul>
				</li>
				<li class="nav-item">
					<a href="#" class="nav-link nav-toggle">
						<!-- <i class="fa fa-filter"></i> -->
						<span class="title">OS</span>
						<span class="arrow"></span>
					</a>
					<ul class="sub-menu">
						<li class="nav-item">
							<a href="#" class="nav-link">누가바(7.0)</a>
						</li>
						<li class="nav-item">
							<a href="#" class="nav-link">마시써로우(6.0)</a>
						</li>
						<li class="nav-item">
							<a href="#" class="nav-link">2NE1롤리팝(5.1)</a>
						</li>
						<li class="nav-item">
							<a href="#" class="nav-link">고디바 아이스크림(4.2)</a>
						</li>
					</ul>
				</li>
				<li class="nav-item">
					<a href="#" class="nav-link nav-toggle">
						<!-- <i class="fa fa-filter"></i> -->
						<span class="title">Filter Set</span>
						<span class="arrow"></span>
					</a>
					<ul class="sub-menu">
						<li class="nav-item">
							<a href="#" class="nav-link">이은찬이만든 필터셋1</a>
						</li>
						<li class="nav-item">
							<a href="#" class="nav-link">샐래디맛있땅</a>
						</li>
						<li class="nav-item">
							<a href="#" class="nav-link">연어샐러드는126kcal</a>
						</li>
						<li class="nav-item">
							<a href="#" class="nav-link">치킨샐러드는102kcal 헐대박 짱짜맨</a>
						</li>
					</ul>
				</li>
			</ul>
			<!-- END SIDEBAR MENU -->
		</div>
		<!-- END SIDEBAR -->
	</div>
	<!-- END SIDEBAR -->
</template>

<script>
	module.exports = {
		data() {
			return {
				app: this.$root.app
			}
		},
		methods: {
			changePackageName(name) {
				this.app.packageName = name;
				window.app.$refs.activityMap.draw();
			}
		},
		mounted() {
		}
	}
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