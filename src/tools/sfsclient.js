import * as SFS2X from 'sfs2x-api'
import eventManager from './eventmanager';
import GameManager from './gamemanager';

let sfs;
let gm;

let sfs_config = {
    host: '127.0.0.1',
    port: 8090,
    zone: 'BasicExamples',
    debug: false,
    useSSl: false
};

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

        gm = GameManager.getInstance();
        gm.setProperty({
            room_group_name: 'gameroomdev',
            players: 2
        });

        // add sfs event dispatch
        eventManager.on('connect', this.connect, this);
        eventManager.on('find-match', this.findMatch, this);
        eventManager.on('send', this.send, this);
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
            gm.setProperty({
                user_id: sessionStorage.getItem("dewa.uid"),
                session_token: sessionStorage.getItem("dewa.session_token"),
                game_id: sessionStorage.getItem("dewa.game_id"),
                website_id: sessionStorage.getItem("dewa.website_id"),
                nickname: sessionStorage.getItem("dewa.username"),
                tournamentId: parseInt(sessionStorage.getItem("dewa.roomid")),
                fee: sessionStorage.getItem("dewa.fee"),
                prize: sessionStorage.getItem("dewa.prize"),
                isBotAllowed: parseInt(sessionStorage.getItem("dewa.bot"))
            });
        }
        else{
            sessionStorage.setItem("dewa.uid", "UserTest" + Math.floor(Math.random() * 50));
            sessionStorage.setItem("dewa.game_id", 11);
            sessionStorage.setItem("dewa.website_id", 1);
            sessionStorage.setItem("dewa.username", sessionStorage.getItem("dewa.uid") + "-nickname");
            sessionStorage.setItem("dewa.roomid", 10);
            
            gm.setProperty({
                user_id: sessionStorage.getItem("dewa.uid"),
                game_id: sessionStorage.getItem("dewa.game_id"),
                website_id: sessionStorage.getItem("dewa.website_id"),
                nickname: sessionStorage.getItem("dewa.username"),
                tournamentId: parseInt(sessionStorage.getItem("dewa.roomid")),
                isBotAllowed: 0
            });
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
        sfs.send(new SFS2X.LoginRequest(gm.getProperties().user_id));
    }

    createMatch()
    {
        let timeStamp = Date.now().toString();
        let roomName = "BM" + timeStamp;
        
        let settings = new SFS2X.SFSGameSettings(roomName);
        settings.maxUsers = gm.getProperties().players;
        settings.groupId = gm.getProperties().room_group_name;
        settings.isPublic = true;
        settings.minPlayersToStartGame = gm.getProperties().players;
        settings.notifyGameStarted = true;
        settings.extension = new SFS2X.RoomExtension("JavaScript", "bolamania.js");
        
        let roomId = new SFS2X.SFSRoomVariable("roomid", gm.getProperties().tournamentId);
        let isBotAllowed = new SFS2X.SFSRoomVariable("isBotAllowed", gm.getProperties().isBotAllowed);
        
        settings.variables = [roomId, isBotAllowed];

        sfs.send(new SFS2X.CreateSFSGameRequest(settings));
        
    }

    findMatch()
    {
        console.log('finding match');
        let existedRoomCount = sfs.roomManager.getRoomListFromGroup(gm.getProperties().room_group_name).length;
        if (existedRoomCount > 0)
        {
            let matchExpr = new SFS2X.MatchExpression("isStarted", SFS2X.BoolMatch.EQUALS, false)
                .and("roomid", SFS2X.NumberMatch.EQUALS, gm.getProperties().tournamentId);
            sfs.send(new SFS2X.QuickJoinGameRequest(matchExpr, [gm.getProperties().room_group_name], sfs.lastJoinedRoom));	
        } else {
            this.createMatch();
        }
    }

    send(cmd)
    {
        let object = new SFS2X.SFSObject();

        for (const key in cmd.obj) {
            if (cmd.obj.hasOwnProperty(key)) {
                switch (typeof cmd.obj[key]) {
                    case 'string':
                        object.putUtfString(key, cmd.obj[key]);
                        break;
                    case 'number':
                        object.putDouble(key, cmd.obj[key]);
                        break;
                }
            }
        }

        sfs.send(new SFS2X.ExtensionRequest(cmd.req, object, gm.getProperties().current_room));
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
    sfs.send(new SFS2X.LoginRequest(gm.getProperties().user_id));
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
    let websiteId = new SFS2X.SFSUserVariable("website_id", gm.getProperties().website_id);
	let nickname = new SFS2X.SFSUserVariable("nickname", gm.getProperties().nickname);
	let sessionToken = new SFS2X.SFSUserVariable("session_token", gm.getProperties().session_token);
	
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
    gm.setProperty({current_room: event.room});

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
        case 'ready_msg':
            console.log(event.params.getUtfString('value'));
            eventManager.emit('ready', event.params.getUtfString('value'));
            break;
        case 'ready':
            gm.initPlayers(event.params);
            eventManager.emit('enter-matchwrapper');
            break;
        case 'countdown':
            eventManager.emit('countdown', event.params.getUtfString('value'));
            if (event.params.getUtfString('value') == '0') {
                eventManager.emit('start_game');
            }
            break;
        case 'act':
            eventManager.emit('set_act', event.params);
            break;
        case 'ball':
            eventManager.emit('set_ball', event.params);
            break;
        case 'rend_score':
            eventManager.emit('rend_score', event.params);
            break;
        case 'reset':
            eventManager.emit('reset_layout');
            break;
    }
}