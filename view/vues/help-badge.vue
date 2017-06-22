<template lang="html">
<i class="help-badge fa fa-question-circle" @mouseover="mouseover" @mouseout="mouseout">
	<div class="help-badge-msg-wrapper">
		<div class='help-badge-msg-before'> </div>
		<div class="help-badge-msg">{{msg}}</div>
	</div>
</i>
</template>

<script>
export default {
	props: ['msg', 'white'],
	methods: {
		mouseover() {
			$(this.$el).find('.help-badge-msg-wrapper').addClass('show')
		},
		mouseout() {
			$(this.$el).find('.help-badge-msg-wrapper').removeClass('show')
		}
	},
	mounted() {
		if( this.white !== undefined ) {
			$(this.$el).addClass('white')
		}
	}
}
</script>

<style lang="scss">
	.help-badge {
		margin-left: 5px;

		&.white {
			color: white;
		}

		.help-badge-msg-wrapper {
			display: none;

			&.show {
				display: block;
			}
		}
		.help-badge-msg-before {
			margin: 1px 0px 0px 3px;
			width: 10px;
			height: 10px;
			background-color: rgb(250, 249, 187);
			transform: rotate(45deg);
			z-index: 9999;
			position: absolute;
		}
		.help-badge-msg {
			margin: 5px 0px 0px -5px;
			padding: 15px 15px 15px 15px;
			background-color: rgb(250, 249, 187);
			color: black;
			z-index: 9999;
			position: absolute;
			font-size: 14px;
		}
	}
</style>
