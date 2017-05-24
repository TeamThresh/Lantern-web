<template lang="pug">
div.filter-group
	div.title Filter Group
	div.input
		input.form-control(type=text placeholder='...filter name' v-model='tmpGroupName' maxlength='50')
		button.btn.btn-success(@click='createGroup(tmpGroupName)') SAVE
	div.groups
		span.group.reset.hvr-buzz-out(@click='reset') RESET
		span.group(v-for='group in groups' @click='click(group)')
			| {{group.name}}
			span.delete.hvr-grow-rotate(@click.stop='deleteGroup(group)')
				i.fa.fa-times
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
		'app.packageName'() {
			if( ! this.app.isInitDone ) {
				return
			}
			this.fetch()
		},
		'app.isInitDone'() {
			if( ! this.app.isInitDone ) {
				return
			}
			this.fetch()
		}
	},
	methods: {
		fetch() {
			this.groups = []
			// $.get(`/api/group/${this.app.packageName}`).then(res => {
			// 	res.forEach(groupName => {
			// 		$.get(`/api/group/${this.app.packageName}/${groupName}`).then(res => {
			// 			res.name = groupName
			// 			this.groups.push(res)
			// 		})
			// 	})
			// })
			this.app.server.group.get().then(res => {
				let data = res.body
				data.forEach(d => {
					this.app.server.group.get({name: d}).then(res => {
						let data = res.body
						data.name = d
						this.groups.push(data)
					})
				})
			})
		},
		createGroup(name) {
			let filters = this.app.filters
			this.app.server.group.save({name}, {filters}).then(res => {
				this.fetch()
				this.tmpGroupName = ''
			}, res => {
				alert('그룹 등록 도중 오류가 발생하였습니다\n')
				console.error(res)
			})
		},
		click(group) {
			this.app.filters.android = group.android
			this.app.filters.os = group.os
			this.app.filters.device = group.device
			this.app.filters.location = group.location
		},
		deleteGroup(group) {
			this.app.server.group.delete({name: group.name}).then(res => {
				this.fetch()
			}, res => {
				alert('그룹 삭제 도중 오류가 발생하였습니다\n')
				console.error(res)
			})
		},
		reset() {
			this.app.filters.activity = []
			this.app.filters.os = []
			this.app.filters.device = []
			this.app.filters.location = []
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

			&.reset {
				background-color: #d9480f;
			}

			span.delete {
				margin: 0 0 0 10px;
				color: red;
			}
		}
	}
}
</style>
