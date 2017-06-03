var car = {
	wheel: 6,
	color: "blue"
};

car.attr = function(key, value){
	switch(key){
		case 'wheel':
			if(arguments.length < 2)
				return this.wheel;
		
			this.wheel = value;
			break
		case 'color':
			if(arguments.length < 2)
				return this.color;
			
			this.color = value;
			break;
		default: 
			console.log("Undefined Attribute");
	}
	
	return this;
};
