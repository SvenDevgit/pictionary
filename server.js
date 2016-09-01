var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var connectionCount = 0;

var WORDS = [
    "word", "letter", "number", "person", "pen", "class", "people",
    "sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
    "girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
    "land", "home", "hand", "house", "picture", "animal", "mother", "father",
    "brother", "sister", "world", "head", "page", "country", "question",
    "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
    "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
    "west", "child", "children", "example", "paper", "music", "river", "car",
    "foot", "feet", "book", "science", "room", "friend", "idea", "fish",
    "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
    "body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
    "rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
    "space"
];

function chooseRandomword(){
   var id = Math.floor((Math.random() * 100) - 1);
   console.log('id ' + id);
   var randomWord = WORDS[id];
   console.log('random word ' + randomWord);
   return randomWord;
};

console.log('words length ' + WORDS.length);

io.on('connect', function(socket) {
   console.log('client connected');

   connectionCount++;
   io.emit('concount', connectionCount);
   //io.emit('setWord', chooseRandomword());


   socket.on('draw', function(position) {
      socket.broadcast.emit('draw', position);
   });

   socket.on('guess', function(guess) {
      socket.broadcast.emit('guess', guess);
   });

   socket.on('setword', function(word){
   	console.log('in de setword listener');

   	  io.emit('setword',chooseRandomword());
   });

   socket.on('disconnect', function() {
      console.log('A user has disconnected');
      connectionCount--;
      io.emit('disconnect', connectionCount);
   });

});    

server.listen(process.env.PORT || 8080);

