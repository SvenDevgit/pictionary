var socket = io();
var gameRole = 'Guesser';  
var setRole = function(connectionCount){
    console.log('connection count in set role '  + connectionCount);
      if(connectionCount == 1){
         gameRole = 'Drawer';
         console.log('we have a drawer');  
      }
      $('#role').text('your role is ' + gameRole);  
   }; 

var pictionary = function(connectionCount) {
   setRole(connectionCount); 
   if (gameRole == 'Drawer'){
      socket.emit('setword');
   } 
   console.log('in pictionary function gameRole ' + gameRole);
   var canvas, context;
   var mousedown = false;
   var guessBox 
   var showGuess = function(guess) {
      console.log(guess);
      $('#lastguess').text('last guess ' +  guess.toLowerCase());
   };

   var setWord = function(gameWord){
    console.log('in the setword function');
      $('#gameword').text('the word for this game is ' + gameWord); 
   }

   var onKeyDown = function(event) {
      if (event.keyCode != 13) { // Enter
         return;
      }
      console.log(guessBox.val());
      var guess = guessBox.val();
      socket.emit('guess', guess);
      showGuess(guess);
      guessBox.val('');
   };

   var connectionMessage = function(connectionCount){
      console.log('connection count ' + connectionCount);
      if (connectionCount == 1){
        console.log('there is only one player wait for new players');
      }

   };

   guessBox = $('#myguess input');
   guessBox.on('keydown', onKeyDown);
   
   var draw = function(position) {
      context.beginPath();
      context.arc(position.x, position.y, 6, 0, 2 * Math.PI);
      context.fill();
   };

   canvas = $('canvas');
   context = canvas[0].getContext('2d');
   canvas[0].width = canvas[0].offsetWidth;
   canvas[0].height = canvas[0].offsetHeight;

   if (gameRole == 'Drawer' ){
      canvas.on('mousedown', function() {
         mousedown = true;
         return mousedown;
      });
      canvas.on('mouseup', function() {
         mousedown = false;
         return mousedown;
      });
      canvas.on('mousemove', function(event) {
         if (mousedown){  
            var offset = canvas.offset();
            var position = {x: event.pageX - offset.left,
                           y: event.pageY - offset.top};
            socket.emit('draw', position);                
            draw(position);
          }  
      });
   }
   socket.on('draw', draw);
   socket.on('guess', showGuess);
   if (gameRole == 'Drawer'){
      socket.on('setword', setWord);
   }  
  socket.on('disconnect', connectionMessage);
};

$(document).ready(function() {
    socket.on('concount', pictionary);
    //pictionary();
});