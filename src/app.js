import * as Phaser from 'phaser'
import { eventManager } from './tools/eventmanager'
import SFSClient from './tools/sfsclient'

import Boot from './scenes/boot'
import Login from './scenes/login'
import Lobby from './scenes/lobby'
import MatchWrapper from './scenes/matchwrapper'

//import Boot from ''

var game_config = {
    type: Phaser.AUTO,
    width: 720,
    height: 1280,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 720
    },
    scene: [Boot, Login, Lobby, MatchWrapper]
}

var sfs = new SFSClient();
var game = new Phaser.Game(game_config);

/*---------- logger --------------------*/