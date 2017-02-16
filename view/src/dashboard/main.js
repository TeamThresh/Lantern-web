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



// var obj = {
//     "children":[
//       {
//          "name":"a",
//          "value":2,"children":[{"name": "b", "value": 2,"children":[]}]
//       },{
//          "name":"unix`0xfffffffffb800c7c",
//          "value":1,"children":[{"name": "b", "value": 1,"children":[]}]
//       },
//    ],
//    "name":"root",
//    "value":3
   
// }

d3.json('/test', function(err, data) {
    var stackTraces = [];
    data = data.data;
    for( var i=0; i<data.length; i++ ) {
        if( data[i].type === 'res' && data[i].app !== undefined && data[i].app.thread_trace !== undefined ) {
            var p = stackTraces; // point to stackTrace
            var stackTrace = data[i].app.thread_trace;
            for( var j=stackTrace.length-1; j>=0; j-- ) {
                var found = false; // 스택트레이스가 일치안했으면 새로만들어야하기 때문에
                // for( var k=0; k<p.length; k++ ) {
                //     if( p[k].name == stackTrace[j] ) {
                //         // 일치하는 스택트레이스
                //         p[k].value++;
                //         p = p[k].children;
                //         found = true;
                //     }
                // }
                if( p.length > 0 && p[p.length - 1].name == stackTrace[j] ) {
                    p[p.length - 1].value++;
                    p = p[p.length - 1].children;
                    found = true;
                }
                if( !found ) {
                    p.push({'name': stackTrace[j], 'value': 1, 'children': []});
                    p = p[p.length - 1].children;
                }
            }
        }
    }
    var obj = {'name': 'root', 'value': 0, 'children': []};
    for( var i=0; i<stackTraces.length; i++ ) {
        obj.value += stackTraces[i].value;
    }
    obj.children = stackTraces;
    console.log(obj);
    // d3.flameGraph('#flame-graph', obj).size([1400, 500]).cellHeight(15).zoomEnabled(true).render();
    var flameGraph = d3.flameGraph().width(1400).height(540).sort(false);
    d3.select('#flame-graph').datum(obj).call(flameGraph);

});