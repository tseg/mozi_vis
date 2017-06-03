var Forced = function(opts){
	console.log(opts.data);
	//load the argument for config object
    this.nodes = opts.data.nodes;
    this.edges = opts.data.links;
	
	console.log(opts.data.links);
	//forced layout charge value
	this.charge = -300;
	
	//define the height and width
	this.width = opts.width;
	this.height = opts.height;
	
	//this.data = opts.data; 
	this.element = opts.element;
	
	//create the graph
	this.draw();
}

Forced.prototype.draw = function(){
	var margin = {top: -5, right: -5, bottom: -5, left: -5};
	//setup parent element
	this.element.innerHTML = '';	
	
	//set node and edge of the graph 
	var nodes = this.nodes, 
	//edges = this.edges;
	Links = this.edges;
	
	//mapping the json links in to edges to use atom index 
	var edges = [];
	Links.forEach(function(e) {
		var sourceIndex = nodes.findIndex(function(item, i){
		  return item.handle === e.sourceHandle;
		});

		var targetIndex = nodes.findIndex(function(item, i){
		  return item.handle === e.targetHandle;
		});
		
		edges.push({
			source: sourceIndex,
			target: targetIndex,
			sourceHandle: e.sourceHandle,
			targetHandle: e.targetHandle,
			arrow: e.arrow,
			label: e.label,
		});
	});
	
	var zoom = d3.behavior.zoom()
				.scaleExtent([1, 10])
				.on("zoom", zoomed);
		
	var	force = d3.layout.force()
				.charge(this.charge)
				.linkDistance(this.width/3.05)  //define the link distance between nodes that are connected.
				.size([this.width, this.height])
				.on("tick", tick);

	var drag = d3.behavior.drag()
				.origin(function(d) { return d;})
				.on("dragstart", dragstarted)
				.on("drag", dragged)
				.on("dragend", dragended);
					
	var svg = d3.select(this.element)
				.append('svg')
				.attr('width', this.width)// + margin.left + margin.right)
				.attr('height', this.height)// + margin.top + margin.bottom)
				.append("g")
				//.attr("transform", "translate(" + margin.left + "," + margin.right + ")")
				.call(zoom);

	var rect = svg.append("rect")
				.attr("width", this.width)
				.attr("height", this.height)
				.style("fill", "none") //it can be customizer
				.style("pointer-events", "all");
			
		force.nodes(nodes)
			.links(edges)
			.start();
	
		// define arrow markers for graph links
		svg.append('svg:defs').append('svg:marker')
			.attr('id', 'start-arrow')
			.attr('viewBox', '0 -5 10 10')
			.attr('refX', -10)
			.attr("refY", 0)
			.attr('markerWidth', 6)
			.attr('markerHeight', 6)
			.attr('orient', 'auto')
			.append('svg:path')
			.attr('d', 'M0,0L10,-5L10,5')
			.attr('fill', '#000');

		svg.append('svg:defs').append('svg:marker')
			.attr('id', 'end-arrow')
			.attr('viewBox', '0 -5 10 10')
			.attr('refX', 20)
			.attr('markerWidth', 6)
			.attr('markerHeight', 6)
			.attr('orient', 'auto')
		  .append('svg:path')
			.attr('d', 'M0,-5L10,0L0,5')
			.attr('fill', '#000');

	var isNode = function (atom) {
			return atom["type"].match("Node$");
		};
		
	var edge = svg.selectAll('.link')
				.data(edges)
				.enter() // add links as paths to the svg
				.append('path') 
				.attr('class', 'link')
				.attr('id', function(d, i){return "link" + i; })// make sure the link has a unique id for it to get referenced from the link label textPath
				.attr("marker-start", function(d){ return (d.arrow == ">")? "url(#start-arrow)" : "";})
				.attr("marker-end", function(d){ return (d.arrow == "<") ? "url(#end-arrow)" : "";});
				
	var linkLable = svg.selectAll('.link-label')
						.data(edges)
						.enter()
						.append('text')
						.attr('text-anchor', 'middle')
						.append('textPath')
						.attr('class', 'link-label')
						.attr('startOffset', '50%')
						.attr('xlink:href', function(d, i){ return '#link' + i; })
						.text(function(d){ return d.label;});
	/*	
	var edge = svg.selectAll(".link")
				.data(edges)
				.enter()
				.append("g")
				.attr("class", "link")
				.append('line');
				

				
		edge.append('svg:path')
				.attr("class", "line")
				//.attr('id', function(d){return d.id;});
				.attr("marker-start", function(d){ return (d.arrow == ">")? "url(#end-arrow)" : "";})
				.attr("marker-end", function(d){ return (d.arrow == "<") ? "url(#start-arrow)" : "";});
				
	
	        edge.append("path")
				.attr("class", "text_path")
				.attr("id", function (d, i) {
					return "edge_" + i;
				});
                
            edge.append("text")
				.attr("dy", "-4")
				.append("textPath")
				.attr('xlink:href', function (d, i) { return "#edge_" + i; })
				.attr("startOffset", "50%")
				.text(function (d) {
					return d.label;
				});*/
		 
	var node = svg.selectAll(".node")
				.data(nodes)
				.enter()
				.append('g')
				.attr('class', 'node')
				.call(drag);
		
		//append circle to node object and setting the radius 
		node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
			.append('circle')
			.attr('r', 12);
		
		//appending text to the node
		node.append("text")
			.attr("x", 16)
			.attr("dy", "-4")
			.attr("startOffset", "50%")
			.text(function(d)  { return (d.name.length > 10) ? d.name.substr(0, 8) + "..." : d.name;})
			.attr("font-size", "10px");
		
		//on mouse hover events 
		node.on("mouseover", mouseover)
            .on("mouseout", mouseout);
			
		function tick(){
			/*edge.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; });*/
			edge.attr('d', function (d) {
				 return (d.source.x < d.target.x)
					? 'M' + d.source.x + ',' + d.source.y
					+ 'L' + d.target.x + ',' + d.target.y
					: 'M' + d.target.x + ',' + d.target.y
					+ 'L' + d.source.x + ',' + d.source.y;
				});
		  
			node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		}
		

		//zoom function definition 
		function zoomed() {
			svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		}
		
		function dragged(d) {
			d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
		}
		
		function dragstarted(d) {
			d3.event.sourceEvent.stopPropagation();
			d3.select(this).classed("dragging", true);
			force.start();
		}
		
		function dragended(d) {
          d3.select(this).classed("dragging", false);
        }
		
		function mouseover() { // nodes on mouse over
			d3.select(this).select("circle").transition()
				.duration(750)
				.attr("r", 16);

			d3.select(this).select("text").attr("font-size", "20px");
		}

		function mouseout() { // nodes on mouse out
				d3.select(this).select("circle").transition()
					.duration(750)
					.attr("r", function (d) {return 12;});
			d3.select(this).select("text").attr("font-size", "10px");
		}

}
//setting new data to the view
Forced.prototype.setData = function(newData) {
    this.nodes = newData.nodes;
    this.edges = newData.links;
    // full redraw needed
    this.draw();
}

Forced.prototype.setCharge = function(newValue){
	console.log(newValue);
	this.charge = newValue;
	
	this.draw();
}

Forced.prototype.linkDistance = function(newValue){
	console.log(newValue);
	this.linkDistance = newValue;
	
	this.draw();
}