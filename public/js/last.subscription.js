$(document).ready(function(){
	setInterval(function(){
		$.get('/api/twitch/subscriptions/last/display_name').done(function(data){
			$('#subName').text(String('Bem vindo ').concat(data));
		});
	},10000);
});