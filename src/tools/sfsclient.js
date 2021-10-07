import Phaser from 'phaser'

var sfs;

var game_properties = {
    room_group_name : 'headball', //sfs group name
    players : 2 //player needed
}

var sfs_config = {
    host: '127.0.0.1',
    port: 8090,
    zone: 'BasicExamples',
    debug: false,
    useSSl: false
}

export default class SFSClient {
    constructor()
    {
        sfs = new SFS2X.SmartFox(sfs_config);

        sfs.logger.level = SFS2X.LogLevel.DEBUG;
        sfs.logger.enableConsoleOutput = true;
        sfs.logger.enableEventDispatching = true;

        sfs.logger.addEventListener(SFS2X.LoggerEvent.DEBUG, onDebugLogged, this);
        sfs.logger.addEventListener(SFS2X.LoggerEvent.INFO, onInfoLogged, this);
        sfs.logger.addEventListener(SFS2X.LoggerEvent.WARNING, onWarningLogged, this);
        sfs.logger.addEventListener(SFS2X.LoggerEvent.ERROR, onErrorLogged, this);

        sfs.addEventListener(SFS2X.SFSEvent.CONNECTION, onConnection, this);
        sfs.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, onConnectionLost, this);
        sfs.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, onLoginError, this);
        sfs.addEventListener(SFS2X.SFSEvent.LOGIN, onLogin, this);
        sfs.addEventListener(SFS2X.SFSEvent.LOGOUT, onLogout, this);
        sfs.addEventListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, onRoomJoinError, this);
        sfs.addEventListener(SFS2X.SFSEvent.ROOM_JOIN, onRoomJoin, this);
        sfs.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, onExtensionResponse, this);
    }

    getProperties() 
    {
        return game_properties;
    }

    getConfig() 
    {
        return sfs_config;
    }
}

//sfs event callbacks

function onDebugLogged(event)
{
	console.log(event.message, "DEBUG", true);
}

function onInfoLogged(event)
{
	console.log(event.message, "INFO", true);
}

function onWarningLogged(event)
{
	console.log(event.message, "WARN", true);
}

function onErrorLogged(event)
{
	console.log(event.message, "ERROR", true);
}

function onConnection(event)
{
    console.log("Connected");
    sfs.send(new SFS2X.LoginRequest(game.game_properties.user_id));
}

function onConnectionLost(event)
{
	console.log("Game disconnected : " + event.reason);
	//returnToLobby();
}

function onLoginError(event)
{
    console.log("Login Error : " + event.reason);
}

function onLogin(event)
{
    let websiteId = new SFS2X.SFSUserVariable("website_id", game_properties.website_id);
	let nickname = new SFS2X.SFSUserVariable("nickname", game_properties.nickname);
	let sessionToken = new SFS2X.SFSUserVariable("session_token", game_properties.session_token);
	
	sfs.send(new SFS2X.SetUserVariablesRequest([websiteId, nickname, sessionToken]));
    sfs.send(new SFS2X.JoinRoomRequest("The Lobby"));
}

function onLogout(event)
{
	sfs.disconnect();
}

function onRoomJoinError(event)
{
    
}

function onRoomJoin(event)
{
    switch (event.room.name) {
        case "The Lobby":
            game.scene.stop("login");
            game.scene.start("lobby");
            break;
    }
}

function onRoomCreated(event)
{
	
}

function onRoomCreationError(event)
{
	console.log("Cannot create room : " + event.errorMessage);
}

function onExtensionResponse(event)
{

}