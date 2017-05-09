<template lang="pug">
div.filter-group
	div.title Filter Group
	div.input
		input.form-control(type=text placeholder='...filter name' v-model='tmpGroupName')
		button.btn.btn-success(@click='createGroup') SAVE
	div.groups
		span.group.hvr-bounce-in(v-for='group in groups') {{ group.name }}
</template>

<script>
module.exports = {
	data() {
		return {
			groups: [],
			tmpGroupName: ''
		}
	},
	methods: {
		createSampleGroups() {
			let max = Math.floor(Math.random() * 10) + 1
			let groups = []
			for( let i=0; i<max; i++ ) {
				groups.push({
					hash: 'ad8f7ad8f7ad78fa',
					name: `group${i + 1}`
				})
			}
			return groups
		},
		createGroup() {
			this.groups.push({
				hash: 'tmp',
				name: this.tmpGroupName
			})
			this.tmpGroupName = ''
		}
	},
	mounted() {
		this.groups = this.createSampleGroups()
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
