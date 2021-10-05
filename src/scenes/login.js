import SFS2X from 'sfs2x-api'

export default class Login extends Phaser.Scene {
    constructor()
    {
        super('login');
    }

    init()
    {
        this.game_properties = this.game.game_properties;
        this.sfs = this.game.sfs;
        console.log(this);
    }

    create()
    {
        this.add.text(10, 10, "Connecting ...");
        credential(this.game.game_properties, this.sfs);
    }
}

function credential(game_properties, sfs) {

    //fetch game data
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
		
		game_properties.isBotAllowed = 1;
    }
    
    if (sfs.isConnected)
    {
        sfs.send(new SFS2X.LoginRequest(game_properties.user_id));
    }
    else
    {
        sfs.connect();
    }
}