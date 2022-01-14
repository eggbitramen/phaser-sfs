let instance = null;    // act as singleton

let players = [];
let properties = {};

export default class GameManager {
    constructor()
    { }

    static getInstance()
    {
        if (instance == null) instance = new GameManager();
        return instance;
    }

    initPlayers(players_obj)
    {
        players = new Array(2);
        let player_keys = players_obj.getKeysArray();
        for (const key in player_keys) {
            let player_obj = players_obj.getSFSObject(player_keys[key]);
            let player = {
				index: player_obj.getInt('index'),
                name: player_obj.getUtfString('name'),
                nickname: player_obj.getUtfString('nickname'),
                avatar_url: player_obj.getUtfString('avatar'),
                score: 0
            };
            players[player.index] = player;
        }
    }

    getAllPlayers()
    {
        return players;
    }

    getPlayerByName(name)
    {
        players.forEach( function(player) {
            if (player.name == name)
                return player;
        });
        return null;
    }

    clearAllPlayers()
    {
        players = [];
    }

    setProperty(elements)
    {
        properties = Object.assign(properties, elements);
    }

    getProperty(name)
    {
        return properties[name];
    }

    getProperties()
    {
        return properties;
    }
}
