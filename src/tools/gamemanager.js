var players = [];

export default class GameManager {      // act as singleton
    constructor()
    { }

    initPlayers(players_obj)
    {
        players = [];
        let player_keys = players_obj.getKeysArray();
        for (const key in player_keys) {
            let player = {
                name: players_obj[key].getUtfString('name'),
                nickname: players_obj[key].getUtfString('nickname'),
                avatar_url: players_obj[key].getUtfString('avatar')
            };
            players.push(player);
        }
    }

    getAllPlayers()
    {
        return players;
    }

    getPlayer(name)
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
}