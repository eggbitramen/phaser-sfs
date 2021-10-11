import * as SFS2X from 'sfs2x-api'
import eventManager from './eventmanager';

var sfs;

var game_properties = {
    room_group_name : 'gameroomdev', //sfs group name
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

        // add sfs event dispatch
        eventManager.on('connect', this.connect, this);
        eventManager.on('find-match', this.findMatch, this);
    }

    getProperties() 
    {
        return game_properties;
    }

    getConfig() 
    {
        return sfs_config;
    }

    connect()
    {
        //fetch client data
        sessionStorage.clear();
        if (
        typeof sessionStorage["dewa.uid"] !== "undefined" &&
        typeof sessionStorage["dewa.roomid"] !== "undefined"
        )
        {
            game_properties.user_id = sessionStorage.getItem("dewa.uid");
            game_properties.session_token = sessionStorage.getItem("dewa.session_token");
            game_properties.game_id = sessionStorage.getItem("dewa.game_id");
            game_properties.website_id = sessionStorage.getItem("dewa.website_id");
            game_properties.nickname = sessionStorage.getItem("dewa.username");
            game_properties.tournamentId = parseInt(sessionStorage.getItem("dewa.roomid"));
            game_properties.fee = sessionStorage.getItem("dewa.fee");
            game_properties.prize = sessionStorage.getItem("dewa.prize");
            game_properties.isBotAllowed = parseInt(sessionStorage.getItem("dewa.bot"));
        }
        else{
            sessionStorage.setItem("dewa.uid", "UserTest" + Math.floor(Math.random() * 50));
            sessionStorage.setItem("dewa.game_id", 11);
            sessionStorage.setItem("dewa.website_id", 1);
            sessionStorage.setItem("dewa.username", sessionStorage.getItem("dewa.uid") + "-nickname");
            sessionStorage.setItem("dewa.roomid", 10);
            
            game_properties.user_id = sessionStorage.getItem("dewa.uid");
            game_properties.game_id = sessionStorage.getItem("dewa.game_id");
            game_properties.website_id = sessionStorage.getItem("dewa.website_id");
            game_properties.nickname = sessionStorage.getItem("dewa.username");
            game_properties.tournamentId = parseInt(sessionStorage.getItem("dewa.roomid"));
            
            game_properties.isBotAllowed = 0;
        }
        
        if (sfs.isConnected)
        {
            this.login();
        }
        else
        {
            sfs.connect();
        }
    }

    login()
    {
        sfs.send(new SFS2X.LoginRequest(game_properties.user_id));
    }

    createMatch()
    {
        let timeStamp = Date.now().toString();
        let roomName = "HB" + timeStamp;
        
        let settings = new SFS2X.SFSGameSettings(roomName);
        settings.maxUsers = game_properties.players;
        settings.groupId = game_properties.room_group_name;
        settings.isPublic = true;
        settings.minPlayersToStartGame = game_properties.players;
        settings.notifyGameStarted = true;
        settings.extension = new SFS2X.RoomExtension("JavaScript", "headball.js");
        
        let roomId = new SFS2X.SFSRoomVariable("roomid", game_properties.tournamentId);
        let isBotAllowed = new SFS2X.SFSRoomVariable("isBotAllowed", game_properties.isBotAllowed);
        
        settings.variables = [roomId, isBotAllowed];

        sfs.send(new SFS2X.CreateSFSGameRequest(settings));
        
    }

    findMatch()
    {
        console.log('finding match');
        let existedRoomCount = sfs.roomManager.getRoomListFromGroup(game_properties.room_group_name).length;
        if (existedRoomCount > 0)
        {
            let matchExpr = new SFS2X.MatchExpression("isStarted", SFS2X.BoolMatch.EQUALS, false)
                .and("roomid", SFS2X.NumberMatch.EQUALS, game_properties.tournamentId);
            sfs.send(new SFS2X.QuickJoinGameRequest(matchExpr, [game_properties.room_group_name], sfs.lastJoinedRoom));	
        } else {
            this.createMatch();
        }
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
    sfs.send(new SFS2X.LoginRequest(game_properties.user_id));
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
            eventManager.emit('enter-loby');
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
    switch (event.cmd) {
        case 'trace':
            console.log(event.params.getUtfString('msg'));
            break;
    }
}