<template lang="pug">
span.crash-rank-marker
	button.btn(:class='classObject' @click='click') {{crashRank}}
	sweet-modal(ref='modal')
		| Which rank do you want to mark?
		template(slot='button')
			button.btn.btn-danger(@click='mark(0)') major
			span &nbsp;
			button.btn.btn-warning(@click='mark(1)') minor
			span &nbsp;
			button.btn.btn-default(@click='mark(2)') unhandle
</template>

<script>
export default {
	props: ['crashRank'],
	data() {
		return {
			app: this.$root.app
		}
	},
	computed: {
		classObject() {
			return {
				'btn-default': this.crashRank == 'unhandle',
				'btn-danger': this.crashRank == 'major',
				'btn-warning': this.crashRank == 'minor'
			}
		}
	},
	watch: {

	},
	methods: {
		click() {
			this.$refs.modal.open()
		},
		mark(n) {
			this.$refs.modal.close()
			let crashRank = this.crashRank
			switch( n ) {
				case 0:
					crashRank = 'major'
					break
				case 1:
					crashRank = 'minor'
					break
				case 2:
					crashRank = 'unhandle'
					break
			}
			this.$emit('mark', crashRank)
		}
	},
	mounted() {

	}
}
</script>

<style lang="sass">
</style>
