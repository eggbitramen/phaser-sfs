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

        let header = this.add.text(0, -this.game.height / 3, "STARTING MATCH ...")
            .setOrigin(0.5, 0.5)
            .setFontStyle('bold')
            .setFontSize(70);
        avatar_container.add(header);

        let players = gm.getAllPlayers();
        for (const p in players) {
            let player = players[p];
            let avatar_image = this.add.image(0, 0, 'avatar-none').setOrigin(0.5, 0.5);
            let avatar_name = this.add.text(0, 0, player.name).setOrigin(0.5, 0.5).setFontSize(35).setFontStyle('bold');
            avatar_image.setPosition(((-players.length / 2) + parseInt(p) * 2) * avatar_image.width, 0);
            avatar_name.setPosition(avatar_image.x, avatar_image.y + 125);
            avatar_container.add(avatar_image);
            avatar_container.add(avatar_name);
        }

        countdown = this.add.text(0, this.game.height / 3, "5")
            .setOrigin(0.5, 0.5)
            .setFontStyle('bold')
            .setFontSize(70);
        avatar_container.add(countdown);

        //  events
        eventManager.on('countdown', this.changeCountdown, this);
        eventManager.on('start_game', this.startGame, this);

        this.events.once(Phaser.Scenes.SHUTDOWN, () => {
            eventManager.off('countdown', this.changeCountdown, this);
            eventManager.off('start_game', this.startGame, this);
        });
    }

    //  update code here

    changeCountdown(count)
    {
        countdown.setText(count);
    }

    startGame()
    {
        this.scene.start('gameplay');
    }
}