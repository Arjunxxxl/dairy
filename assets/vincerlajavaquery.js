(function () {
	// body...
	$('a#signup').on('click',function(){
			$('div.loginform').css('visibility','visible ').hide().fadeIn(1000);
	});

	$('a#login').on('click',function(){
			$('div.olduser').css('visibility','visible ').hide().fadeIn(1000);
	});

	$('.back').on('click',function(){
		if($('div.loginform').is(':visible')){
		$('div.loginform').hide().delay(500).fadeOut(2000);
											}
		else{
		$('div.olduser').hide().delay(500).fadeOut(2000);
		}
	});

})();