<template lang="pug">
div.card
	div.title-wrapper
		span.title {{title}}
	div.content
		slot
</template>

<script>
module.exports = {
	props: ['title']
}
</script>

<style lang="css" scoped>
div.card {
	margin: 0px 0px 10px 0px;
	padding: 10px 10px 10px 10px;
	background-color: #2e3139;
	border-radius: 5px !important;
}
div.card span.title {
	color: #fff;
	font-weight: bold;
	font-size: 13px;
}
div.card hr.title-line {
	margin: 0;
}
</style>
