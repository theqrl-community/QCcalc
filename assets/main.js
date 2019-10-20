function range(start, count) {
  return Array.apply(0, Array(count))
    .map((element, index) => index + start);
}

var stuff = {"cumulative_prob_168hrs_25x25x25x25_100yrs":new Array(100).fill(0) };

var data = [{
  x: range(2019,100),
  y: stuff["cumulative_prob_168hrs_25x25x25x25_100yrs"],
  type: 'bar'
}];

var layout = {
    yaxis: {
        autorange: false,
        range: [0,1],
        showgrid: false
    },
    xaxis: {
		autorange: false,
      range: [2019,2060]
    },
    // to highlight the timestamp we use shapes and create a rectangular
    shapes: [
        {
            type: 'rect',
            xref: 'x',
            yref: 'paper',
            x0: '2019',
            y0: 0,
            x1: '2021',
            y1: 1,
            fillcolor: '#00FF00',
            opacity: 0.5,
            line: {
                width: 0
            },
                    layer:'below'
        },
        {
            type: 'rect',
            xref: 'x',
            yref: 'paper',
            x0: '2021',
            y0: 0,
            x1: '2024',
            y1: 1,
            fillcolor: '#FFFF00',
            opacity: 0.5,
            line: {
                width: 0
            },
          layer:'below'
        },
        {
            type: 'rect',
            xref: 'x',
            yref: 'paper',
            x0: '2024',
            y0: 0,
            x1: '2060',
            y1: 1,
            fillcolor: '#FF0000',
            opacity: 0.5,
            line: {
                width: 0
            },
          layer:'below'
                   
        }
    ]
};
Plotly.newPlot('myDiv', data, layout, {responsive: true});

function plott() {
	Plotly.restyle('myDiv', 'y', [stuff["cumulative_prob_168hrs_25x25x25x25_100yrs"]]);	
}

function update_plot() {
  	var increaseInQubits = $('.qc_progress [name=increaseInQubits]').val();
  	var algorithmicImprovement = $('.qc_progress [name=algorithmicImprovement]').val();
  	var errorRateImprovement = $('.qc_progress [name=errorRateImprovement]').val();
  	
  	var text = "cumulative_prob_168hrs_"+increaseInQubits+"x"+algorithmicImprovement+"x"+errorRateImprovement+"x25_100yrs";

  	console.log(text);

	Plotly.animate('myDiv', 
		{
			data: [ {y: stuff[text] }],
			traces: [0]
		}, 
		{
			transition: {
			 	duration: 150,
			 	easing: 'cubic-in-out'
			},
			frame: {
				duration: 150
			}
		});
}


$(function() {
	$.getJSON("/assets/0.json",function(json){
    	stuff = json;   
    	update_plot();       
	});    
	$('input').on('load change textInput input', function() {
  		update_plot();
	});
})