<template lang="pug">
div.get-started.mt-clipboard-container
	h2 First, Register Your App
	h4
		| input below infomations and click the button to get your &nbsp;
		code project key
	br
	input.form-control.input-xlarge(v-model='projectName', placeholder='project name(ex. Awesome Dude)', :disabled='isBlock')
	input.form-control.input-xlarge(v-model='packageName', placeholder='package name(ex. com.Software.Maestro)', :disabled='isBlock')
	div.mt-radio-inline
		label.mt-radio(:class='{"mt-radio-disabled": isBlock}')
			input(type='radio', v-model='type', value='android', :disabled='isBlock')
			img(width='25px' height='25px' src='/assets/img/android-logo.png')
			| android
			span
		//- unity not supported yet
		label.mt-radio.mt-radio-disabled
			input(type='radio' v-model='type' value='unity' disabled)
			img(width='25px' height='25px' src='/assets/img/unity-logo.png')
			| unity
			span
		button.btn.green(@click='send') get project key
	input.form-control.input-xlarge#project-key(v-model='projectKey' readonly placeholder='project key goes here')
	button.btn.yellow(@click='copy') copy
	br
	br
	br
	h2 Second, Edit Your Project
	div.markdown-body
	br
	br
	br
	h2(v-if='! isSucceed') Waiting For Data From Your App Installed LANTERN...
	template(v-if='isSucceed')
		h2 BOOYAH! You Just Did It!
		h4 your app version is {{this.appVersion}}
		h4 enjoy this LANTERN
</template>

<script>
export default {
	props: [],
	data() {
		return {
			app: this.$root.app,
			projectName: '',
			packageName: '',
			type: '',
			isBlock: false,
			projectKey: '',
			isSucceed: false,
			appVersion: '',
			appVersionCheckThreadId: ''
		}
	},
	watch: {

	},
	methods: {
		send() {
			// send
			this.$http.post(`/api/project/${this.packageName}`, {project_name: this.projectName, type: this.type}).then(res => {
				this.$http.get(`/api/project/${this.packageName}`).then(res => {
					// block input
					this.isBlock = true
					this.projectKey = res.body.project_key
					if( this.type == 'android' ) {
						this.loadAndroidGuide()
					}
				}, res => {
					alert('error occured when retrive informations of the project have been just created')
				})
			}, res => {
				alert('error occured when create new project')
			})
		},
		checkAppVersion() {
			// not sent, exit
			if( ! this.isBlock ) {
				return
			}
			// retrieve
			this.$http.get(`/api/packageNames`).then(res => {
				res.body.forEach(p => {
					if( p.package == this.packageName && p.name == this.projectName && p.type == this.type ) {
						if( p.app_ver != null ) {
							this.isSucceed = true
							this.appVersion = p.app_ver
							clearInterval(this.appVersionCheckThreadId)
							// pulsate
							$('.app-version').pulsate({color: 'red', reach: 50, speed: 100, glow: !0})
						}
					}
				})
			})
		},
		loadAndroidGuide() {
			this.$http.get(`https://raw.githubusercontent.com/TeamThresh/Lantern-sdk/master/README.md`).then(res => {
				let text = new window.showdown.Converter().makeHtml(res.body)
				$('.markdown-body').html(text)
				this.renderCodeBlock()
			})
		},
		renderCodeBlock() {
			$('pre code').each(function(i, block) {
				hljs.highlightBlock(block);
			});
		},
		copy() {
			$('#project-key').select()
			document.execCommand('copy')
		}
	},
	mounted() {
		this.renderCodeBlock()
		this.appVersionCheckThreadId = setInterval(this.checkAppVersion, 1000)
	}
}
</script>

<style lang="sass">
</style>
