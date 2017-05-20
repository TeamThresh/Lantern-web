<template lang="pug">
div.filter-group
	div.title Filter Group
	div.input
		input.form-control(type=text placeholder='...filter name' v-model='tmpGroupName' maxlength='50')
		button.btn.btn-success(@click='createGroup(tmpGroupName)') SAVE
	div.groups
		span.group.hvr-bounce-in(v-for='group in app.filterGroups') {{ group.name }}
</template>

<script>
module.exports = {
	data() {
		return {
			groups: [],
			tmpGroupName: '',
			app: this.$root.app
		}
	},
	watch: {
		'app.packageName': 'fetch'
	},
	methods: {
		fetch() {
			$.get(`/api/group/${this.app.packageName}`).then(res => {
				if( ! (res instanceof Array && res.length > 0) ) {
				}
				this.app.filterGroups = []
				res.forEach(g => this.app.filterGroups.push(g))
			})
		},
		createSampleGroups() {
			let max = Math.floor(Math.random() * 10) + 1
			let groups = []
			for( let i=0; i<max; i++ ) {
				groups.push({
					name: `group${i + 1}`,
					filters: {
						location: ['asd','asdf']
					}
				})
			}
			return groups
		},
		createGroup(name) {
			let filters = this.app.getFilters()
			$.ajax({
				type: 'post',
				url: `/api/group/${this.app.packageName}/${name}`,
				data: filters,
				success(res) {
					this.fetch()
				},
				error(err) {
					alert('그룹 등록 도중 오류가 발생하였습니다\n' + err)
				}
			})
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
