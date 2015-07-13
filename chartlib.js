var CHARTLIB = function(width, height, margin) {
	
	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);
	
	var y = d3.scale.linear()
		.range([height, 0]);
	
	var xAxis = d3.svg.axis()
		.orient("bottom");
		
	var yAxis = d3.svg.axis()
		.orient("left")
		.ticks(10);

	var color = ["#72548C",
				"#069B25",
				"#953919",
				"#A69D6B",
				"#397BC3",
				"#E2855C",
				"#926007",
				"#97A748",
				"#738FBA",
				"#4E589B"];
	//var color = ['rgb(141,211,199)','rgb(255,255,179)','rgb(190,186,218)','rgb(251,128,114)','rgb(128,177,211)','rgb(253,180,98)','rgb(179,222,105)','rgb(252,205,229)','rgb(217,217,217)'];
	//var color = d3.scale.category20()
	//	.domain([0, 19]);
		
	var monochrome = color[4];

	var arc = d3.svg.arc()
			.outerRadius(height*0.5)
			.innerRadius(0);

	var pie = d3.layout.pie()
			.sort(null)
			.value(function(d) { return d; });

	return {
		makePie: function(svg, data, isMonoChrome) {
	
		  var g = svg.selectAll(".arc")
			  .data(pie(data))
			.enter().append("g")
			  .attr("class", "arc")
			  .attr("transform", "translate(" + (width*0.5 + margin.left) + ',' + (height*0.5 + margin.top) + ")");

		  g.append("path")
			  .attr("d", arc)
			  .style("fill", function(d, i) { return (isMonoChrome) ? monochrome : color[i]; })
//			  .style("fill", function(d, i) { return (isMonoChrome) ? monochrome : color(i); })
			  .style('stroke', function(d, i) { return (isMonoChrome) ? 'white' : 'none'; });

		  g.append("text")
			  .attr("transform", getLabelPosition)
			  .attr("dy", ".35em")
			  .attr('class', 'label')
			  .style("text-anchor", "middle")
			  .text(function(d, i) { return String.fromCharCode(65 + i); });
		},
		
		makeBar: function(svg, data, hasYAxis) {

			x.domain(data.map(function(d, i) { return String.fromCharCode(65 + i); }));
				xAxis.scale(x);
			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(" + margin.left + ", " + (height + margin.top) + ")")
				.call(xAxis);

			var yDomain = getMaxOfArray(data);
			y.domain([0, yDomain]);
			yAxis.scale(y);
			if (hasYAxis) {
				svg.append("g")
					.attr("class", "y axis")
					.attr("transform", "translate(" + (margin.left - 12) + ", " + margin.top + ")")
					.call(yAxis)
					.append("text")
						.attr("transform", "rotate(-90)")
						.attr("y", 6)
						.attr("dy", ".71em")
						.style("text-anchor", "end")
						.text("%");
			}

			svg.selectAll(".bar")
					.data(data)
				.enter().append("rect")
					.attr("class", "bar")
					.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
					.style("fill", monochrome)
					.attr("x", function(d, i) { return x(String.fromCharCode(65 + i)); })
					.attr("width", x.rangeBand())
					.attr("y", function(d) { return y(d); })
					.attr("height", function(d) { return y(yDomain - d); });

		}
	}

	function getMaxOfArray(numArray) {
			return Math.max.apply(null, numArray);
	}

	// use pie center to arc centroid angle to push label to outside of arc
	function getLabelPosition(d) {
		var c = arc.centroid(d),
			x = c[0],
			y = c[1],
			h = Math.sqrt(x*x + y*y),
			labelr = height*0.5 + 10;
		return "translate(" + (x/h * labelr) +  ',' + (y/h * labelr) +  ")"; 
	}


}