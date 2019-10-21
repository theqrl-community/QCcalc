function range(start, count) {
  return Array.apply(0, Array(count))
    .map((element, index) => index + start);
}

var stuff = {"c168hrs_25x25x25x25_100yrs":new Array(100).fill(0) };

var data = [{
  x: range(2019,100),
  y: stuff["c168hrs_25x25x25x25_100yrs"],
  type: 'bar'
}];

var layout = {
    title: "Quantum Threat",
    yaxis: {
        title: "Cumulative chance of compromise",
        autorange: false,
        tickformat: '.1%',
        range: [0,1],
        showgrid: false
    },
    xaxis: {
        title: "year",
        autorange: true
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

function update_plot() {
  	var increaseInQubits = $('.qc_progress [name=increaseInQubits]').val();
  	var algorithmicImprovement = $('.qc_progress [name=algorithmicImprovement]').val();
  	var errorRateImprovement = $('.qc_progress [name=errorRateImprovement]').val();
  	var runtime = $('.qc_progress [name=runTime]').val();
    var uncertainty = $('.qc_progress [name=uncertainty]').val();

  	var text = "c"+runtime+"hrs_"+increaseInQubits+"x"+algorithmicImprovement+"x"+errorRateImprovement+"x"+uncertainty+"_100yrs";

  	console.log(text,[stuff[text]]);

    var start_year = 2019;
    var end_year = 2019 + stuff[text].length;

    console.log("End Year: "+end_year);

	Plotly.animate('myDiv', {
        layout: {
            xaxis: {range: [2019, end_year]}
        },
		data: [{
                y: stuff[text]        
            }],
            traces: [0]
		}, 
		{
			transition: {
			 	duration: 250,
			 	easing: 'cubic-in-out'
			},
			frame: {
				duration: 250
			}
		});

}


$(function() {
	$.getJSON("/assets/qccalc.json",function(json){
    	stuff = json;   
    	update_plot();       
	});    
	$('input, select').on('load change textInput input', function() {
  		update_plot();
	});
})