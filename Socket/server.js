let userDetailArr = [];
let channelsList = [];

function bootstrapSocketServer(io) {
	io.on('connection', (socket) => {
		console.log('inside bootstrapSocketServer');

			socket.on('register',(regDetails)=>{
					console.log('username '+regDetails.username);
					console.log('Channel '+regDetails.channels);
					console.log('socket id '+socket.id);

				if(regDetails.username!=='' && regDetails.username!=='Anonymous')
				{
					userDetailArr.push({
						socketId: socket.id,
						userId: regDetails.username
					});
					let channelArray;
					channelArray = regDetails.channels;
					socket.emit('welcomeMessage','Welcome '+regDetails.username+' !!');
					channelArray.forEach(element => {
						console.log('element > '+element);
						socket.join(element);
					 //   socket.emit('welcomeMessage',regDetails.username);	
						socket.emit('addedToChannel',{channel:element});
					});
				}
				});
				socket.on('message',(message)=>{
					console.log('new message is >   '+ message.message);
					console.log('username is >   '+ message.username);
					console.log('channel is >   '+ message.channel);
					console.log('socket id'+socket.id);
 
					let userInfo = userDetailArr.filter(user => user.socketId === socket.id);
					console.log('userInfo socketId:  '+userInfo[0].socketId);
					console.log('userInfo userId:  '+userInfo[0].userId);
					socket.broadcast.emit('newMessage',{ username: userInfo[0].userId,
						 message: message.message });
				});
				socket.on('joinChannel',(data)=>{
					console.log('selected channel:  '+ data.channel);
					if(data.channel!=='')
					{
					channelsList.push(data);
					console.log('channelsList '+channelsList);
					socket.join(data.channel);
					io.sockets.emit('addedToChannel',{channel:data.channel});
					}
				});
				socket.on('leaveChannel', (data)=>{
						console.log( 'user has left from channel '+ data.channel)
						if(data.channel!== '')
						{
						socket.leave(data.channel);
						io.sockets.emit( "removedFromChannel" ,' user has left the channel'+data.channel)
						}
				});
				
				
	});
}



module.exports = bootstrapSocketServer;