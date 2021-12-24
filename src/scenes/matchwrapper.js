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
            let txt_score = this.add.text(field_score.x, field_score.y - field_score.height / 2, 'score').setOrigin(0.5, 0.5).setFontSize(20).setStroke(0x000000, 5);
            let t_score = this.add.text(field_score.x, field_score.y, player.score).setOrigin(0.5, 0.5).setFontSize(25);
            avatar_container.add([avatar_image, avatar_name]);
            postgame_container.add([field_score, txt_score, t_score]);
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
            field_black[i] = this.add.rectangle(120 * offset[i], 170, 180, 60, 0x000000, 0.5).setOrigin(0.5, 0.5);
            currency_icon[i] = this.add.image(field_black[i].x - field_black[i].width * 3/5, field_black[i].y, icname[i]).setOrigin(0.5, 0.5);
            this.txt_currency[i] = this.add.text(field_black[i].x, field_black[i].y, '-').setOrigin(0.5, 0.5).setFontSize(30);
            
            postgame_container.add([field_black[i], currency_icon[i], this.txt_currency[i]]);
        }

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
        }

        //  events
        eventManager.on('countdown', this.changeCountdown, this);
        eventManager.on('start_game', this.startGame, this);
        eventManager.on('enter-loby', this.enterLoby, this);
        eventManager.on('update-currency', this.updateCurrency, this);

        this.game.events.on(Phaser.Core.Events.HIDDEN, () => {
            lostFocus();
        }, this);

        this.events.once(Phaser.Scenes.SHUTDOWN, () => {
            eventManager.off('countdown', this.changeCountdown, this);
            eventManager.off('start_game', this.startGame, this);
            eventManager.off('enter-loby', this.enterLoby, this);
            eventManager.off('update-currency', this.updateCurrency, this);

            this.game.events.off(Phaser.Core.Events.HIDDEN, () => {
                lostFocus();
            }, this);
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
    }
}

function lostFocus() {
    if (gm.getProperty('game_state') == 1)
        eventManager.emit('lost_focus');   
}