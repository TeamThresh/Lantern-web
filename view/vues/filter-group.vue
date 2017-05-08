<template lang="pug">
div.filter-group
	div.title Filter Group
	div.input
		input.form-control(type=text placeholder='...filter name')
		button.btn.btn-success SAVE
	div.groups
		span.group.hvr-bounce-in 차부장님용
		span.group.hvr-bounce-in 게임폐인들꺼
		span.group.hvr-bounce-in 매크로 의심
		span.group.hvr-bounce-in 동북아친구들
		span.group.hvr-bounce-in 피쉬앤칩스 Awkkk
		span.group.hvr-bounce-in 헤이브루클린~
		span.group.hvr-bounce-in 의경친구들1090기
</template>

<script>
module.exports = {
	data() {
		return {
			groups: []
		}
	},
	mounted() {

	}
}
</script>

<style lang="sass" scoped>
div.filter-group {
	padding: 0 10px 10px 10px;

	div.title {
		margin: 0 0 15px 0;
		color: #fff;
		font-weight: bold;
		font-size: 13px;
	}
	div.input {
		margin: 0 0 15px 0;

		input {
			width: 75%;
			display: inline-block;
		}
		button {
			width: 25%;
			vertical-align: top;
		}
	}
	div.groups {
		span.group {
			border: 1px solid #eee;
			margin: 0 10px 7px 0;
			padding: 5px 10px 5px 10px;
			color: white;
			display: inline-block;
			background-color: rgba(0, 0, 0, 0);
			font-weight: bold;
			font-size: 13px;
			border-radius: 26px !important;

			&:hover {
				background-color: #fff;
				color: black;
			}
		}
	}
}
</style>
