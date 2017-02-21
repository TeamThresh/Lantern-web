<template lang='pug'>
	div.flameGraph
</template>

<script>
	/**
	 * @param  {[Array]}    [
	 *                          ['stack1', 'stack2', 'stack3'],
	 *                          ['stack1', 'stack3'],
	 *                          ['stack1', 'stack5']
	 *                      ]
	 * @return {[Array]}    {
	 *                          'name': 'stack1',
	 *                          'value': 3,
	 *                          'children': [
	 *                              {
	 *                                  'name': 'stack2',
	 *                                  'value': 1,
	 *                                  'children': [
	 *                                      {
	 *                                          'name': 'stack3',
	 *                                          'value': 1,
	 *                                          'children': []
	 *                                      }
	 *                                  ]
	 *                              },
	 *                              {
	 *                                  'name': 'stack3',
	 *                                  'value': 1,
	 *                                  'children': []
	 *                              },
	 *                              {
	 *                                  'name': 'stack1',
	 *                                  'value': 1
	 *                                  'children': []
	 *                              }
	 *                          ]
	 *                      }
	 */
	function convertToFlameGraphData(data, rootStackName) {
	    var stackTrace = [];

	    for( var i=0; i<data.length; i++ ) {
	        var children = stackTrace;
	        for( var j=0; j<data[i].length; j++ ) {
	            if( children.length > 0 && children[children.length - 1].name == data[i][j] ) {
	                children[children.length - 1].value++;
	                children = children[children.length - 1].children;
	            } else {
	                children.push({
	                    'name': data[i][j],
	                    'value': 1,
	                    'children': []
	                });
	                children = children[children.length - 1].children;
	            }
	        }
	    }

	    if( ! rootStackName ) {
	        rootStackName = 'root';
	    }

	    var rootStack = {
	        'name': rootStackName,
	        'value': 0,
	        'children': []
	    };

	    rootStack.value = 0;
	    for( var i=0; i<stackTrace.length; i++ ) {
	        rootStack.value += stackTrace[i].value;
	    }

	    rootStack.children = stackTrace;
	    return rootStack;
	}

	module.exports = {
		mounted: function() {
			d3.json('/test', function(err, data) {
			    var stackTraces = [];

			    data = data.data;
			    for( var i=0; i<data.length; i++ ) {
			        if( data[i].type === 'res' && data[i].app !== undefined && data[i].app.thread_trace !== undefined ) {
			            stackTraces.push(data[i].app.thread_trace.reverse());
			        }
			    }

			    var flameGraphData = convertToFlameGraphData(stackTraces);
			    var width = $('.flameGraph').width();
			    var height = $('.flameGraph').height();

			    var flameGraph = d3.flameGraph().width(width).height(height).sort(false);
			    d3.select(document.querySelectorAll('.flameGraph')[0]).datum(flameGraphData).call(flameGraph);
			});
		}
	};
</script>

<style lang='sass' scoped>
@import "../layout/style.scss";

.flameGraph {
	width: 100%;
	height: 700px;

	* {
		width: 100%;
	}
}
</style>