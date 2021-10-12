const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// app.get('/', function(req, res) {
//     res.sendFile(__dirname + '/login.html');
// });

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});





var date;
var day ;
var month;
var year;
var hour;
var min;
var second;

function updateTime(){
date = new Date();
day = date.getDate();
month = date.getMonth()+1;
year= date.getFullYear()
hour=date.getHours();
min=date.getMinutes();
second = date.getSeconds();
}
setInterval(updateTime, 1000);

cols=['primary','dark','secondary','success','info','danger']
var vals=0;
users=[];


io.sockets.on('connection', function(socket) {
    socket.on('username',function(username){
    	if(vals>5) vals=0
        socket.username = username;
    	console.log(users);
    	for(var i=0;i<users.length;i++){
    		if(users[i]==socket.username){
    			 socket.emit('exist',socket.username);
    		}
    	}
        users.push(socket.username);
        
        io.emit('is_online', `🔵 <button type="button" class="btn btn-primary my-2">${socket.username} is Joined</button>
        	                     <button type="button" class="btn btn-light my-2 disabled">${hour}:${min}:${second}</button>`);
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', `🔴 <button type="button" class="btn btn-danger my-2">${socket.username} is Left</button>
        						 <button type="button" class="btn btn-light my-2 disabled">${hour}:${min}:${second}</button>`);
    })



    socket.on('chat_message', function(message) {

    	// var first_name = socket.username[0];
        io.emit('chat_message', ` <button type="button" class="btn btn-${cols[vals]} my-2 disabled" style="margin-left:10px">${socket.username}</button>
        					      <button type="button" class="btn btn-warning my-2 disabled" style="color:#000042">${message}</button>
        					      `);
    });

    vals++;

});



const server = http.listen(3000, function() {
    console.log('listening on *:3000');
});


