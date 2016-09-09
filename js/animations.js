$(document).ready(function(){
	// $('.container').fadeIn(2000);
	$(".container").each(function(index) {
    	$(this).delay(400*index).fadeIn(1500);
	});
	$(".imgwrapper").each(function(index) {
    	$(this).delay(400*index).fadeIn(1500);
	});
	$("img").each(function(index) {
    	$(this).delay(400*index).fadeIn(1500);
	});
	$(".imgwrapper img").each(function(index) {
    	$(this).delay(400*index).fadeIn(1500);
	});
	
});