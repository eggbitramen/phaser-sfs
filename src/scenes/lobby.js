import eventManager from '../tools/eventmanager';

export default class Lobby extends Phaser.Scene {
    constructor()
    {
        super('lobby');
    }

    init(data)
    {
        console.log(data);
        this.rematch = data.rematch;
    }

    create()
    {
        this.menu_state = 0
        this.add.image(0, 0, 'lobby-bg').setScale(2); //bg

        this.find_match_btn = this.add.sprite(0, 0, 'button-00').setOrigin(0.5, 0.5);
        this.find_match_btn.setPosition(this.game.width / 2, this.game.height - this.game.height / 5);
        this.find_match_btn.setInteractive();
        
        this.find_match_txt = this.add.sprite(0, 0, 'sprtxt-start').setOrigin(0.5, 0.5);
        this.find_match_txt.setPosition(this.find_match_btn.x, this.find_match_btn.y);

        this.tutorial_cont = this.add.container(this.game.width / 2, this.game.height / 2);
        this.tutorial_cont.setVisible(false);

        this.find_match_cont = this.add.container(this.game.width / 2, this.game.height / 2);
        this.find_match_cont.setVisible(false);
        
        this.find_match_info = this.add.text(0, 0, "Waiting for Players")
            .setOrigin(0.5, 0.5)
            .setFontSize(30)
            .setFontStyle('bold');
        this.find_match_cont.add(this.find_match_info);

        this.ready_member_txt = this.add.text(0, 75, "0 / 0")
            .setOrigin(0.5, 0.5)
            .setFontSize(30)
            .setFontStyle('bold');
        this.find_match_cont.add(this.ready_member_txt);

		/*		Tutorial	*/
		let text_prop = {
			wordWrap: {
				width: this.game.width/2 * 4/5
			}
		};
		this.texts = [
			"The sky above the port was the color of television, tuned to a dead channel.",
			"`It's not like I'm using,' Case heard someone say, as he shouldered his way ",
			"through the crowd around the door of the Chat. `It's like my body's developed",
			"this massive drug deficiency.' It was a Sprawl voice and a Sprawl joke."
		];
		this.tutorial_txt = this.add.text(this.game.width/4, this.game.height * 2/5, this.texts[0], text_prop).setOrigin(0.5, 0.5);
		this.tutorial_cont.add(this.tutorial_txt);

		let slide_mask = this.add.rectangle(-this.game.width/4, this.game.height * 2/5, this.game.height * 2/3, this.game.height * 2/3, 0x000000).setOrigin(0.5, 0.5);
		this.tutorial_cont.add(slide_mask);

        // add events
        this.find_match_btn.on('pointerup', () => {
            this.find_match_btn.alpha == 1.0
                this.toggleLobbyState();
        });

        // rematch
        if (this.rematch && this.menu_state == 0) {
            this.toggleLobbyState();
        }

        eventManager.on('ready', this.showReadyMember, this);
        eventManager.on('enter-matchwrapper', this.enterMatchWrapper, this);
        eventManager.on('lobby-state', this.lobbyState, this);

        this.game.events.on(Phaser.Core.Events.HIDDEN, () => {
            this.forceExitMatch();
        }, this);
        
        this.events.once(Phaser.Scenes.SHUTDOWN, () => {
            this.find_match_btn.off('pointerup', () => {
                this.toggleLobbyState();
            });
            eventManager.off('ready', this.showReadyMember, this);
            eventManager.off('enter-matchwrapper', this.enterMatchWrapper, this);
            eventManager.off('lobby-state', this.lobbyState, this);

            this.game.events.off(Phaser.Core.Events.HIDDEN, () => {
                this.forceExitMatch();
            }, this);
        });
    }

    showReadyMember(text)
    {
        this.ready_member_txt.setText(text);
    }

    enterMatchWrapper()
    {
        this.scene.stop(this);
        this.scene.start('matchwrapper');
    }

    toggleLobbyState() 
    {
        this.find_match_btn.alpha = 0.3;
        if (this.menu_state == 0)
        {
            this.menu_state = 1;
            this.find_match_txt.setTexture('sprtxt-cancel');
            eventManager.emit('find-match');
        }
        else
        {
            this.menu_state = 0;
            this.find_match_txt.setTexture('sprtxt-start');
            eventManager.emit('exit-match');
        }
    }

    lobbyState(room_name)
    {
        if (room_name == "The Lobby") {
            this.find_match_cont.setVisible(false);
            this.tutorial_cont.setVisible(true);
        }
        else
        {
            this.tutorial_cont.setVisible(false);
            this.find_match_cont.setVisible(true);
        }
        this.find_match_btn.alpha = 1.0;
    }

    forceExitMatch()
    {
        if (this.menu_state == 1) {
            this.toggleLobbyState();
        }
    }
}
