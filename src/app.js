import * as Phaser from 'phaser'
import * as SFS2X from 'sfs2x-api'

import Boot from './scenes/boot'
import Login from './scenes/login'
import MatchWrapper from './scenes/matchwrapper'

//import Boot from ''

var game_config = {
    type: Phaser.AUTO,
    width: 720,
    height: 1280,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 720,
        height: 1280
    },
    scene: [Boot, Login, MatchWrapper]
}

var game_properties = {
    game_room_groupname : 'punchout', //sfs group name
    players : 2 //player needed
}

var sfs_config = {
    host: '127.0.0.1',
    port: 8090,
    zone: 'BasicExamples',
    debug: false,
    useSSl: false
}

var game = new Phaser.Game(game_config);
game.sfs = new SFS2X.SmartFox(sfs_config);
game.game_properties = game_properties

game.sfs.logger.level = SFS2X.LogLevel.DEBUG;
game.sfs.logger.enableConsoleOutput = true;
game.sfs.logger.enableEventDispatching = true;

game.sfs.logger.addEventListener(SFS2X.LoggerEvent.DEBUG, onDebugLogged, this);
game.sfs.logger.addEventListener(SFS2X.LoggerEvent.INFO, onInfoLogged, this);
game.sfs.logger.addEventListener(SFS2X.LoggerEvent.WARNING, onWarningLogged, this);
game.sfs.logger.addEventListener(SFS2X.LoggerEvent.ERROR, onErrorLogged, this);

game.sfs.addEventListener(SFS2X.SFSEvent.CONNECTION, onConnection, this);
game.sfs.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, onConnectionLost, this);
game.sfs.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, onLoginError, this);
game.sfs.addEventListener(SFS2X.SFSEvent.LOGIN, onLogin, this);
game.sfs.addEventListener(SFS2X.SFSEvent.LOGOUT, onLogout, this);
game.sfs.addEventListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, onRoomJoinError, this);
game.sfs.addEventListener(SFS2X.SFSEvent.ROOM_JOIN, onRoomJoin, this);
game.sfs.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, onExtensionResponse, this);

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
    game.sfs.send(new SFS2X.LoginRequest(game.game_properties.user_id));
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
    console.log(event.user.name);
	let websiteId = new SFS2X.SFSUserVariable("website_id", game.game_properties.website_id);
	let nickname = new SFS2X.SFSUserVariable("nickname", game.game_properties.nickname);
	let sessionToken = new SFS2X.SFSUserVariable("session_token", game.game_properties.session_token);
	
	game.sfs.send(new SFS2X.SetUserVariablesRequest([websiteId, nickname, sessionToken]));
    game.sfs.send(new SFS2X.JoinRoomRequest("The Lobby"));
}

function onLogout(event)
{
	game.sfs.disconnect();
}

function onRoomJoinError(event)
{
    
}

function onRoomJoin(event)
{
    console.log(event);

    switch (event.room.name) {
        case "The Lobby":
            game.scene.stop("login");
            game.scene.start("matchwrapper");
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