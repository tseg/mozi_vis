var Radial = function(opts){

	//load the argument for config object
    this.nodes = opts.data.nodes;
    this.edges = opts.data.links;
	
	//forced layout charge value
	this.charge = -300;
	
	//define the height and width
	this.width = opts.width;
	this.height = opts.height;
	
	//obtain the page element 
	this.element = opts.element;
	
	//create the graph
	this.draw();
}

Radial.prototype.draw = function(){
	var margin = {top: -5, right: -5, bottom: -5, left: -5};
	//setup parent element
	this.element.innerHTML = '';	
	
	//set node and edge of the graph 
	var nodes = this.nodes, 
	//var edges = this.edges;
	Links = this.edges;
	
}

// get nodes with no incoming node
function getRoot(nodes){
	var rootNodes=[];
	for (var a=0;a<nodes.length;a++)
	{
		if (nodes[a].incoming.length==0)
		{
			rootNodes.push(nodes[a]);
		}

	}
	return rootNodes;
}

var root = getRoot(AtomsFactory.nodes);
for(a=0; a < root.length; a++)
{
	roothandles.push(root[a].handle);       
}

// Locate nodes in a radial layout
function brfs(grph){
		traversedNodes=[];
		traversedNodes.push(grph.nodes[focusnode]);
		var marked={};
		while (traversedNodes.length != 0) {
			var v = traversedNodes.shift();
			//console.log(v);
			if(v == grph.nodes[focusnode])
			{ 
				v.x= w/2; v.y= h/2; v.fixed = true; v.px= w/2; v.py= h/2;
				marked[v.index]=true;
				var neghbours= [];
				//console.log(grph);
				var adjList = [];
				adjList=findchilds(v, grph);
				//console.log("childs" + adjList);
				for (var a=0;a< adjList.length;a++) {
					u=adjList[a];
					if(marked[u.index]!=true){
						marked[u.index]=true;
						neghbours.push(u);
						var currentAngle = startAngle + ((360/adjList.length) * (a));
						var currentAngleRadians = currentAngle * D2R;
						var radialPoint = {
							x: (w / 2) + radius * Math.cos(currentAngleRadians), 
							y: (h / 2) + radius * Math.sin(currentAngleRadians)
						};
						u.x = radialPoint.x;
						u.px = radialPoint.x;
						u.y = radialPoint.y;
						u.py = radialPoint.y;
						u.fixed = true;
					}
				}
				traversedNodes.push(neghbours);
				//console.log("Traversed nodes" + traversedNodes);
			} else if(v.length > 0) {
				rad= radius * ring;
				//console.log(v);
				//console.log(radius);
				var neghbours= [];
	
		for(var j=0; j< v.length; j++) {
			if (marked[v[j].label]=== false) {marked[v[j].label]=true;}
			adjList=findchilds(v[j], grph );
			for (var a=0; a< adjList.length; a++) {
				u=adjList[a];
				if(marked[u.index]!=true){
					marked[u.index]=true;
					neghbours.push(u);
				}
			}
		}
		for (var loc= 0; loc < neghbours.length; loc++) {   
			var currentAngle = startAngle + ((360/neghbours.length) * (loc));
			var currentAngleRadians = currentAngle * D2R;
			var radialPoint = {
				x: (w / 2) + rad * Math.cos(currentAngleRadians), 
				y: (h / 2) + rad * Math.sin(currentAngleRadians)
			};
			neghbours[loc].x = radialPoint.x;
			neghbours[loc].y = radialPoint.y;
			neghbours[loc].px = radialPoint.x;
			neghbours[loc].py = radialPoint.y;
			neghbours[loc].fixed = true;
		}
		
		if(neghbours.length !=0) {traversedNodes.push(neghbours);}
	}
	ring++;
	//console.log(ring);
	}
}

function findchilds(node, grph){
	//console.log(grph)
	var outnode=[];
	for(x=0; x< node.outgoing.length; x++) {
		outnode.push(node.outgoing[x].handle);
	}
	
	var innode=[]
	for(x=0; x< node.incoming.length; x++) {
		innode.push(node.incoming[x].handle);
	}

	var nodehandles = innode.concat(outnode);
	var n = [];

	for(x=0; x < nodehandles.length; x++) {
		if (grph.nodes[nodehandles[x]]) {
			n.push(grph.nodes[nodehandles[x]])
		}
	}
	return n;
}               

//Draw Nodes
node = svg_g.selectAll(".node");
node = node.data(force.nodes());
node.enter().append("g").attr("class", "node");
node.call(force.drag().on("dragstart", function (d) {
			d3.event.sourceEvent.stopPropagation();
		}));
		node.append("circle").attr("r", function (d) {
			return utils.isLink(d) ? 6 : 14;
		});

node.append("text").attr("x", function(d) { return d.cx; }).attr("y", function(d) { return d.cy; });

node.on("mouseover", mouseover);
node.on("mouseout", mouseout);
node.on("click", function (sender) {

// depth-first search for nodes 
function dfs(node, graph){
	ans=[];
	traversedNodes=[];
	traversedNodes.push(node);
	allNodes=graph.nodes;
	marked={};
	while(traversedNodes.length!=0){
	var v = traversedNodes.pop();
	marked[v.index]=true;
	adjList= findchilds(v, graph);
	ans.push(v);
	for (var i=0;i<adjList.length;i++){
		u=adjList[i];
		if(marked[u.index]!=true){
			traversedNodes.push(u);
			marked[u.index]=true;
			}
		}           
	}
		return ans;
}
	
// monitor radial layout
	function radmonitor(){
		for (var c=1; c < ring-1; c++)
		{
		outerCircle = svg_g.append("circle")
							.attr({
								cx: w/2,
								cy: h/2,
								r: radius * c,
								fill: "none",
								stroke: "white" 
								});
		} 
		for (g=0; g < graph.nodes.length; g++)
		{
			if(sender.index != graph.nodes[g].index )
			{
				if (sender.x == graph.nodes[g].x && sender.y == graph.nodes[g].y && sender.px == graph.nodes[g].px && sender.px == graph.nodes[g].px)
				{ 
					var c = dfs(graph.nodes[g], graph);
						for(a=0; a < c.length; a++)
						{
							c[a].fixed = false;                                    
						}                                 
				}
			}
		}
	}

	if (scope.tool == 'select' || scope.tool == 'focus' || scope.tool == 'center' || scope.tool == 'getroot' || scope.tool == 'tree' ) {
		if (d3.event.shiftKey || d3.event.ctrlKey) {
			if (scope.selectedHandles.indexOf(sender.handle) == -1)
				scope.selectedHandles.push(sender.handle);
			else
				scope.selectedHandles.splice(scope.selectedHandles.indexOf(sender.handle), 1);
		} else {
			scope.selectedHandles = [sender.handle];
		}
		node.attr("class", function (d) {
			return scope.selectedHandles.indexOf(d.handle) == -1 ? "node" : "node node_selected";
		});
	}

	if (scope.tool == 'anchor') {
		sender.fixed = !d3.event.altKey;
	}
				
		if (scope.tool == 'focus') {
			ring =1;
			focusnode = sender.handle
			brfs(graph);
			radmonitor();
			var linksTohide = [];
			var nodeHandlesToShow = [sender["handle"]];
			
			for (var depth = 0; depth < 2; depth++) {
				
				var newHandlesToShow = [];
				for (var i = 0; i < nodeHandlesToShow.length; i++){
						if (AtomsFactory.atoms.hasOwnProperty(nodeHandlesToShow[i]))
						newHandlesToShow = newHandlesToShow.concat(utils.getAllNeighborHandles(AtomsFactory.atoms[nodeHandlesToShow[i]]));
				}
				
				for(a=0; a < newHandlesToShow.length; a++){
					for(b=0; b < graph.nodes.length; b++)
					{
						if(newHandlesToShow[a] == graph.nodes[b].handle)
						{ 
							if(graph.nodes[b].type == 'ListLink' || graph.nodes[b].type == 'SetLink') 
							{
								linksTohide = linksTohide.concat(graph.nodes[b].handle);
								newHandlesToShow = newHandlesToShow.concat(utils.getAllNeighborHandles(AtomsFactory.atoms[newHandlesToShow[a]]));
							}
						}   
					}
				}
				
				nodeHandlesToShow = nodeHandlesToShow.concat(newHandlesToShow);
				nodeHandlesToShow = $.unique(nodeHandlesToShow);
				
				//console.log(nodeHandlesToShow + "hide this" +linksTohide) ;
				node.style("opacity", function (d) {
					return (nodeHandlesToShow.indexOf(d["handle"]) > -1) ? 1 : 0.3;
				});
				
				var selected = node.filter(function (d, i) {
				   return d.type == 'ListLink';
				});
				
				selected.style("opacity", "0.3");
				var selected = node.filter(function (d, i) {
				   return d.type == 'ListLink';
				});
				
				selected.style("opacity", "0.3");
				edge.style("opacity", function (d) { return (nodeHandlesToShow.indexOf(d["source"]["handle"]) > -1 && nodeHandlesToShow.indexOf(d["target"]["handle"]) > -1) ? 1 : 0.05;});
			}
		}

		if(scope.tool == 'center'){
			ring =1;
			focusnode = sender.handle
			//console.log(sender);
			brfs(graph);
			radmonitor();
			force.on("tick", tick1);
			force.start();
		}
		
		  function tick(e) 
		  {                   
			var k = 15* e.alpha;
			 // Push sources up and targets down to form a weak tree.
				edge.selectAll("path.line").attr("d", function (d) {
				 return "M" + d.source.x + " " + d.source.y + "L " + d.target.x + " " + d.target.y;
			  });
			 edge
				 .each(function(d) { d.source.y -= k, d.target.y+=k; })
				 .attr("x1", function(d) { return d.source.x; })
				 .attr("y1", function(d) { return d.source.y; })
				 .attr("x2", function(d) { return d.target.x; })
				 .attr("y2", function(d) { return d.target.y; });
			 node
				 .attr("cx", function(d) { return d.x; })
				 .attr("cy", function(d) { return d.y; });
							
			 node.attr("transform", function (d) {
				 return "translate(" + d.x + "," + d.y + ")";
			 });
		   
		 }

		if(scope.tool == 'tree')
		{
			if(roothandles != 0)
			{
			
		  var nodestoexpand = dfs(sender, graph);
		  for(var j in nodestoexpand)
			{
				nodestoexpand[j].fixed = false;
			} 
		  //console.log(nodestoexpand);
		  var expand = [];
		  for(i=0; i < nodestoexpand.length; i++)
		  {
			  expand=expand.concat(nodestoexpand[i].handle);        
		  }
		  //console.log(expand.length);
			   node.style("opacity", function (d) {
			  return (expand.indexOf(d["handle"]) > -1 ) ? 1 : 0;
				 });
				edge.style("opacity", function (d) {
				 return (expand.indexOf(d["source"]["handle"]) > -1 && expand.indexOf(d["target"]["handle"]) > -1) ? 1: 0;                        
				  });
 
			 var selected = node.filter(function (d, i) {
							 
				 return roothandles.indexOf(d["handle"]) > -1;
				 });
			 selected.style("opacity", "1");    

		  force.on("tick",tick);
		  force.start();

		  }
	}

	if (scope.tool == 'getroot') {
			ring =1;
			focusnode = sender.handle
			brfs(graph);
			radmonitor();
			var nodeHandlesToShow = [ sender["handle"] ];
			var n = findchilds(sender, graph);
			for(var i in n)
			{
				if(n[i].isNode == null)
				{
					var ns = [];
					var c = findchilds(n[i], graph);
					for( var j in c)
					{                                   
						if(c[j].isNode != null)
						{
							ns.push(c[j].handle);
						}
						else
						{
							var a = findchilds(c[j], graph);
							for(var b in a)
							{
									if(c[j].isNode != null)
									{
										ns.push(c[j].handle);
									}
									
							}
						}
					}
						if(ns.length != 0)
						{
							nodeHandlesToShow.push(n[i].handle);
						nodeHandlesToShow = nodeHandlesToShow.concat(ns);
						}
				}
				else
				{
					nodeHandlesToShow.push(n[i].handle);
				}
			}
			nodeHandlesToShow = $.unique(nodeHandlesToShow);
			//console.log(nodeHandlesToShow);
			node.style("opacity", function (d) {
			return (nodeHandlesToShow.indexOf(d["handle"]) > -1) ? 1 : 0;
			});
			edge.style("opacity", function (d) {
			return (nodeHandlesToShow.indexOf(d["source"]["handle"]) > -1 && nodeHandlesToShow.indexOf(d["target"]["handle"]) > -1) ? 1: 0;
			});
	}

	scope.$apply();
	});