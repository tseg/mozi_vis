var outer = function(x){
	var sub_total = x;
	var inner = function(y){
		return sub_total + y;
	};
	return inner;
};