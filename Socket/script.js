function userAddedAlert(data)
{
	let divNode;
	let strongNode;
	let prefixTextNode;
	let suffixTextnode;
	let buttonNode;
	let spanNode;
	
	// creates 'div' node
	divNode = document.createElement("div");
	// sets attribute 'class' to <div> node
	divNode.setAttribute('class','alert alert-success alert-dismissible fade show');
	divNode.setAttribute('role','alert');
	//buttonNode = document.createElement("BUTTON");
    prefixTextNode = document.createTextNode('You are added to ');
    divNode.appendChild(prefixTextNode);
	
	strongNode = document.createElement("strong");
	strongNode.innerHTML = data;
	divNode.appendChild(strongNode);

	suffixTextnode = document.createTextNode(' successfully!');
	divNode.appendChild(suffixTextnode);
	
	buttonNode = document.createElement('button');
	buttonNode.setAttribute('type','button');
	buttonNode.setAttribute('class','close');
	buttonNode.setAttribute('data-dismiss','alert');
	buttonNode.setAttribute('aria-label','close');

	spanNode = document.createElement('span');
	spanNode.setAttribute('aria-hidden','true');
	spanNode.innerHTML = '&times;';

	buttonNode.appendChild(spanNode);
	divNode.appendChild(buttonNode);
	document.getElementById('alertContainer').appendChild(divNode);
}

function displayMsg(message)
{
	let divNode;
	let innerDiv;
	let outerDiv;
	let pElement;
	let msg = 'Me : ';
	let chatContainer = document.getElementById('chatContainer');
	msg += message;
	// creates 'div' node
	divNode = document.createElement("div");
	// sets attribute 'class' to <div> node
	divNode.setAttribute('class','col-12');
	// creates 'div' node
	outerDiv = document.createElement("div");
	// sets attribute 'class' to <div> node
	outerDiv.setAttribute('class','card sent-message');
	// creates 'div' node
	innerDiv = document.createElement("div");
	// sets attribute 'class' to <div> node
	innerDiv.setAttribute('class','card-body');
	// creates 'p' node
	pElement = document.createElement("p");
	// sets attribute 'class' to <p> node
	pElement.setAttribute('class','card-text');
	pElement.innerHTML = msg;
	
	innerDiv.appendChild(pElement);
	outerDiv.appendChild(innerDiv);
	divNode.appendChild(outerDiv);
	
	chatContainer.insertBefore(divNode, chatContainer.childNodes[0]);
}

function displayOthersMsg(message,userName)
{
	let divNode;
	let innerDiv;
	let outerDiv;
	let pElement;
	let chatContainer = document.getElementById('chatContainer');
	let msg = userName+' : ';
	msg += message;
	// creates 'div' node
	divNode = document.createElement("div");
	// sets attribute 'class' to <div> node
	divNode.setAttribute('class','col-12');
	// creates 'div' node
	outerDiv = document.createElement("div");
	// sets attribute 'class' to <div> node
	outerDiv.setAttribute('class','card sent-message');
	// creates 'div' node
	innerDiv = document.createElement("div");
	// sets attribute 'class' to <div> node
	innerDiv.setAttribute('class','card-body');
	// creates 'p' node
	pElement = document.createElement("p");
	// sets attribute 'class' to <p> node
	pElement.setAttribute('class','card-text');
	pElement.innerHTML = msg;
	
	innerDiv.appendChild(pElement);
	outerDiv.appendChild(innerDiv);
	divNode.appendChild(outerDiv);
	
	chatContainer.insertBefore(divNode, chatContainer.childNodes[0]);
}

function displaySystemMsg(userName)
{
	let divNode;
	let innerDiv;
	let outerDiv;
	let pElement;
	let dispMsg = 'System : '+userName;

	// creates 'div' node
	divNode = document.createElement("div");
	// sets attribute 'class' to <div> node
	divNode.setAttribute('class','col-12');
	// creates 'div' node
	outerDiv = document.createElement("div");
	// sets attribute 'class' to <div> node
	outerDiv.setAttribute('class','card received-message');
	// creates 'div' node
	innerDiv = document.createElement("div");
	// sets attribute 'class' to <div> node
	innerDiv.setAttribute('class','card-body');
	// creates 'p' node
	pElement = document.createElement("p");
	// sets attribute 'class' to <p> node
	pElement.setAttribute('class','card-text');
	pElement.innerHTML = dispMsg;
	
	innerDiv.appendChild(pElement);
	outerDiv.appendChild(innerDiv);
	divNode.appendChild(outerDiv);
	
	document.getElementById('chatContainer').appendChild(divNode);
	
}

function populateChannels(channel)
{
	let channelOptions = "";
	channelOptions += "<option>" + channel + "</option>";
	document.getElementById("channelsList").innerHTML = channelOptions;
}

function removeChannel()
{
	let channelOptions = "";
	channelOptions += "<option></option>";
	document.getElementById("channelsList").innerHTML = channelOptions;
}

function sendMessage(event,socket) {
	event.preventDefault();
	console.log('sending new message! '+ document.getElementById('message').value);
	displayMsg(document.getElementById('message').value);
	let message = document.getElementById('message').value;
	let channel = document.getElementById('channel').value;
	let username = document.getElementById('username').value;

	console.log('message:  '+message);
	console.log('channel:  '+channel);
	console.log('username:  '+username);
	socket.emit('message',{username,channel,message});
}

function joinChannel(event,socket) {
	let selectedChannel = document.getElementById('newchannel');
	console.log('Joining channel '+ selectedChannel.value);	
	if(selectedChannel.value!==''){
		populateChannels(selectedChannel.value);
		socket.emit('joinChannel',{channel:selectedChannel.value});
	}
	
}

function leaveChannel(event,socket) {
	let selectedChannel = document.getElementById('newchannel');
	console.log('leaving channel '+ selectedChannel.value);
	if(selectedChannel.value!=='')
	{
		populateChannels(selectedChannel.value);
		socket.emit('leaveChannel',{channel:selectedChannel.value});
	}
}

function onWelcomeMessageReceived(userName) {
	console.log('System : Welcome '+userName+' !!');	
	displaySystemMsg(userName,'',false);
}

function onNewMessageReceived(messageObject) {
	console.log('New message received : '+messageObject.message);
	console.log('user name : '+messageObject.username);
	displayOthersMsg(messageObject.message,messageObject.username);
}

function onAddedToNewChannelReceived(channelObject) {
	console.log('onAddedToNewChannelReceived  ' + channelObject.channel);
	populateChannels(channelObject.channel);
	userAddedAlert(channelObject.channel);
}

function onRemovedFromChannelReceived(data) {
	console.log('onRemovedFromChannelReceived '+ data);
	removeChannel();
}

module.exports = {
	sendMessage,
	joinChannel,
	leaveChannel,
	onWelcomeMessageReceived,
	onNewMessageReceived,
	onAddedToNewChannelReceived,
	onRemovedFromChannelReceived
};

// You will get error - Uncaught ReferenceError: module is not defined
// while running this script on browser which you shall ignore
// as this is required for testing purposes and shall not hinder
// it's normal execution
