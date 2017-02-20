document.addEventListener("DOMContentLoaded", function() {

});

// var cpuChart = Highcharts.chart('cpu-chart', {
// 		chart: {
//             type: 'bar'
//         },
//         title: {
//             text: 'Fruit Consumption'
//         },
//         xAxis: {
//             categories: ['Apples', 'Bananas', 'Oranges']
//         },
//         yAxis: {
//             title: {
//                 text: 'Fruit eaten'
//             }
//         },
//         series: [{
//             name: 'Jane',
//             data: [1, 0, 4]
//         }, {
//             name: 'John',
//             data: [5, 7, 3]
//         }]
// 	});


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


// d3.json('/test', function(err, data) {
//     var stackTraces = [];
//     data = data.data;
//     for( var i=0; i<data.length; i++ ) {
//         if( data[i].type === 'res' && data[i].app !== undefined && data[i].app.thread_trace !== undefined ) {
//             var p = stackTraces; // point to stackTrace
//             var stackTrace = data[i].app.thread_trace;
//             for( var j=stackTrace.length-1; j>=0; j-- ) {
//                 var found = false; // 스택트레이스가 일치안했으면 새로만들어야하기 때문에
//                 // for( var k=0; k<p.length; k++ ) {
//                 //     if( p[k].name == stackTrace[j] ) {
//                 //         // 일치하는 스택트레이스
//                 //         p[k].value++;
//                 //         p = p[k].children;
//                 //         found = true;
//                 //     }
//                 // }
//                 if( p.length > 0 && p[p.length - 1].name == stackTrace[j] ) {
//                     p[p.length - 1].value++;
//                     p = p[p.length - 1].children;
//                     found = true;
//                 }
//                 if( !found ) {
//                     p.push({'name': stackTrace[j], 'value': 1, 'children': []});
//                     p = p[p.length - 1].children;
//                 }
//             }
//         }
//     }
//     var obj = {'name': 'root', 'value': 0, 'children': []};
//     for( var i=0; i<stackTraces.length; i++ ) {
//         obj.value += stackTraces[i].value;
//     }
//     obj.children = stackTraces;
//     console.log(obj);

//     var flameGraph = d3.flameGraph().width(1400).height(540).sort(false);
//     d3.select('#flame-graph').datum(obj).call(flameGraph);

// });

d3.json('/test', function(err, data) {
    var stackTraces = [];

    data = data.data;
    for( var i=0; i<data.length; i++ ) {
        if( data[i].type === 'res' && data[i].app !== undefined && data[i].app.thread_trace !== undefined ) {
            stackTraces.push(data[i].app.thread_trace.reverse());
        }
    }

    var flameGraphData = convertToFlameGraphData(stackTraces);
    console.log(flameGraphData);

    var flameGraph = d3.flameGraph().width(1400).height(540).sort(false);
    d3.select(document.querySelectorAll('.graph')[0]).datum(flameGraphData).call(flameGraph);
});

// d3.json('/testMany', function(err, data) {
//     var stackTraces = [];
//     var res = data;

//     for( var j=0; j<res.length; j++ ) {
//         data = res[j].data;
//         var stackTrace = [];

//         for( var i=0; i<data.length; i++ ) {
//             if( data[i].type === 'res' && data[i].app !== undefined && data[i].app.thread_trace !== undefined ) {
//                 stackTrace.push(data[i].app.thread_trace.reverse());
//             }
//         }
//         stackTraces.push(stackTrace);
//     }

//     // draw
//     var flameGraph = d3.flameGraph().sort(false);

//     for( var i=0; i<stackTraces.length; i++ ) {
//         var d = convertToFlameGraphData(stackTraces[i]);
//         var graph = document.querySelectorAll('.graph')[i];
//         d3.select(graph).datum(d).call(flameGraph);
//     }
// });







