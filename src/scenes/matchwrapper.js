import eventManager from '../tools/eventmanager';
import GameManager from '../tools/gamemanager';

let gm;

let avatar_container;
let countdown;

export default class MatchWrapper extends Phaser.Scene {
    constructor()
    {
        super('matchwrapper');
    }

    init()
    {
        gm = GameManager.getInstance();
    }

    create()
    {
        this.add.image(0, 0, 'lobby-bg').setScale(2);

        avatar_container = this.add.container(this.game.width / 2, this.game.height / 2);
        let postgame_container = this.add.container(this.game.width / 2, this.game.height / 2);

        this.header = this.add.text(0, -this.game.height / 3, "")
            .setOrigin(0.5, 0.5)
            .setFontStyle('bold')
            .setFontSize(70);
        
        let crown = this.add.image(0, 0, 'crown').setOrigin(0.5, 0.645).setVisible(false).setScale(0.85);

        avatar_container.add([this.header, crown]);

        let players = gm.getAllPlayers();
        for (const p in players) {
            let player = players[p];
            let avatar_image = this.add.image(0, 0, 'avatar-none').setOrigin(0.5, 0.5);
            let avatar_name = this.add.text(0, 0, player.nickname).setOrigin(0.5, 0.5).setFontSize(35).setFontStyle('bold').setStroke(0x000000, 7);
            avatar_image.setPosition(((-players.length / 2) + parseInt(p) * 2) * avatar_image.width, -50);
            avatar_name.setPosition(avatar_image.x, avatar_image.y + 110);

            //attach crown
            if (gm.getProperty('winner') == player.name) {
                crown.setPosition(avatar_image.x, avatar_image.y);
                crown.setVisible(true);
            }

            let field_score = this.add.rectangle(avatar_image.x, avatar_image.y + 70, 100, 40, 0x000000, 0.5).setOrigin(0.5, 0.5);
			let arc_left = this.add.arc(field_score.x - field_score.width/2, field_score.y, field_score.height/2, 90, 270, false, 0x000000, 0.5);
			let arc_right = this.add.arc(field_score.x + field_score.width/2, field_score.y, field_score.height/2, -90, 90, false, 0x000000, 0.5);
            let txt_score = this.add.text(field_score.x, field_score.y - field_score.height / 2, 'score').setOrigin(0.5, 0.5).setFontSize(20).setStroke(0x000000, 5);
            let t_score = this.add.text(field_score.x, field_score.y, player.score).setOrigin(0.5, 0.5).setFontSize(25);
            avatar_container.add([avatar_image, avatar_name]);
            postgame_container.add([field_score, arc_left, arc_right, txt_score, t_score]);
        }

        countdown = this.add.text(0, this.game.height / 3, "5")
            .setOrigin(0.5, 0.5)
            .setFontStyle('bold')
            .setFontSize(70);
        avatar_container.add(countdown);

        let offset = [-1, 1];
        let icname = ['iccoin', 'icdiamond']
        let field_black = [];
        let currency_icon = [];
        this.txt_currency = [];
        for (const i in offset) {
            field_black[i] = this.add.rectangle(150 * offset[i], 150, 180, 60, 0x000000, 0.5).setOrigin(0.5, 0.5);
			let arc_left = this.add.arc(field_black[i].x - field_black[i].width/2, field_black[i].y, field_black[i].height/2, 90, 270, false, 0x000000, 0.5);
			let arc_right = this.add.arc(field_black[i].x + field_black[i].width/2, field_black[i].y, field_black[i].height/2, -90, 90, false, 0x000000, 0.5);
            currency_icon[i] = this.add.image(field_black[i].x - field_black[i].width * 1/2, field_black[i].y, icname[i]).setOrigin(0.5, 0.5);
            this.txt_currency[i] = this.add.text(field_black[i].x, field_black[i].y, '-').setOrigin(0.5, 0.5).setFontSize(30);
            
            postgame_container.add([field_black[i], arc_left, arc_right, currency_icon[i], this.txt_currency[i]]);
        }

        let btn_exit = this.add.sprite(-this.game.width * 1/6, 260, 'button-00')
            .setOrigin(0.5, 0.5);
        let txt_exit = this.add.image(btn_exit.x, btn_exit.y, 'sprtxt-exit').setOrigin(0.5, 0.5);

        this.btn_rematch = this.add.sprite(this.game.width * 1/6, 260, 'button-00')
            .setOrigin(0.5, 0.5);
		this.btn_rematch.setInteractive();
        let txt_rematch = this.add.image(this.btn_rematch.x, this.btn_rematch.y, 'sprtxt-rematch').setOrigin(0.5, 0.5);
        postgame_container.add([btn_exit, txt_exit, this.btn_rematch, txt_rematch]);

        if (gm.getProperty('game_state') == 1) {
            this.header.setText("STARTING MATCH ...");
            postgame_container.setVisible(false);
        }
        else
        {
            //  get currencies
            let cmd = {
                req: 'currency',
                obj: null
            };
            eventManager.emit('send', cmd);

            this.header.setText("RESULT");
            countdown.setVisible(false);
            postgame_container.setVisible(true);

            btn_exit.setInteractive();
            // btn_rematch.setInteractive();
        }

        //  events
        eventManager.on('countdown', this.changeCountdown, this);
        eventManager.on('start_game', this.startGame, this);
        eventManager.on('enter-loby', this.enterLoby, this);
        eventManager.on('update-currency', this.updateCurrency, this);
		eventManager.on('end_game', this.forceEndGame, this);

        btn_exit.on('pointerup', () => {
            eventManager.emit('disconnect');
        });

        this.btn_rematch.on('pointerup', () => {
            rematch(this);
        });

		this.game.events.once(Phaser.Core.Events.HIDDEN, () => {
            lostFocus(this);
        }, this);

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            eventManager.off('countdown');
            eventManager.off('start_game');
            eventManager.off('enter-loby');
            eventManager.off('update-currency');
			eventManager.off('end_game');

            btn_exit.off('pointerup');
    
            this.btn_rematch.off('pointerup');

            this.game.events.off(Phaser.Core.Events.HIDDEN);
        });
    }

    //  update code here

    changeCountdown(count)
    {
        countdown.setText(count);
    }

    startGame()
    {
        this.scene.stop(this);
        this.scene.start('gameplay');
    }

    enterLoby()
    {
        this.scene.stop(this);
        this.scene.start('lobby');
    }

    updateCurrency(currency)
    {
        this.txt_currency[0].setText(currency.getInt('coin'));
        this.txt_currency[1].setText(currency.getInt('diamond'));

        if (currency.getInt('coin') <= parseInt(gm.getProperty('fee'))) {
            this.btn_rematch.alpha = 0.5;
        }
        else
        {
            this.btn_rematch.setInteractive();
                    }
    }

	forceEndGame()
	{
		gm.setProperty({game_state: 2});
		this.scene.stop(this);
		this.scene.start('matchwrapper');
		console.log("force end game");
	}
}

function lostFocus(self) {

	send('walk_out', null);

    if (gm.getProperty('game_state') == 1)
	{
		gm.setProperty({game_state: 2});
		self.scene.stop(self);
		self.scene.start('matchwrapper');
	}
	else
	{
		gm.setProperty({game_state: 1});
		self.scene.stop(self);
        self.scene.start('lobby');
	}
}

function rematch(self) {
    gm.setProperty({game_state: 1, winner: ""});
    self.scene.stop(self);
    self.scene.start('lobby', {rematch: true});
}

function send(req, obj) {
	
    let cmd = {
        req: req,
        obj: obj
    };
    eventManager.emit('send', cmd);
}
