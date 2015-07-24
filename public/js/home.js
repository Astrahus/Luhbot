function connect(){
  window.location = '/auth/twitch'
}

//getting luhzinha
$.ajax({
  url:'https://api.twitch.tv/kraken/users/luhzinhaluna',
  method: "GET",
  dataType: 'jsonp',
  headers:{'Accept':'application/vnd.twitchtv.v3+json'}
}).done(function(data){
  var template = '<div>'+
  '<a href="http://www.twitch.tv/luhzinhaluna" target="_blank">'+
  '<img src="img/twitch.svg" width="100" class="circle shadow-with-overlay image-overlay-effect">'+
  '<img src="'+data.logo+'" width="100" class="circle profile-img">'+
  '</a><span class="name grey-text text-lighten-5">'+data.display_name +
  '</span><span class="bottom-shadow-line"></span></div>'
  $('#contributors .first-slot').append(template);
})
// getting contributors
$.ajax({
  url:'https://api.github.com/repos/greenLabsTech/Luhbot/contributors',
  method: "GET"
}).done(function(members){
  for(member in members){
    var template = '<div class="contributor">'+
    '<a href="' + members[member].html_url + '" target="_blank">'+
    '<img src="img/github-circle.svg" width="100" class="circle shadow-with-overlay image-overlay-effect">'+
    '<img src="' + members[member].avatar_url + '" width="100" class="circle profile-img">'+
    '</a><span class="name grey-text text-lighten-5">'+members[member].login +
    '</span><span class="bottom-shadow-line"></span></div>'
    $('#contributors').append(template);
  }
});
