import eventManager from '../tools/eventmanager';

export default class Lobby extends Phaser.Scene {
    constructor()
    {
        super('lobby');
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

        // add events
        this.find_match_btn.on('pointerup', () => {
            this.toggleLobbyState();
        });

        eventManager.on('ready', this.showReadyMember, this);
        eventManager.on('enter-matchwrapper', this.enterMatchWrapper, this);

        this.game.events.on(Phaser.Core.Events.HIDDEN, () => {
            this.forceExitMatch();
        }, this);
        
        this.events.once(Phaser.Scenes.SHUTDOWN, () => {
            this.find_match_btn.off('pointerup', () => {
                this.toggleLobbyState();
            });
            eventManager.off('ready', this.showReadyMember, this);
            eventManager.off('enter-matchwrapper', this.enterMatchWrapper, this);

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

    toggleLobbyState() {
        if (this.menu_state == 0)
        {
            this.menu_state = 1;
            this.find_match_txt.setTexture('sprtxt-cancel');
            this.tutorial_cont.setVisible(false);
            this.find_match_cont.setVisible(true);
    
            eventManager.emit('find-match');
        }
        else
        {
            this.menu_state = 0;
            this.find_match_txt.setTexture('sprtxt-start');
            this.find_match_cont.setVisible(false);
            this.tutorial_cont.setVisible(true);
    
            eventManager.emit('exit-match');
        }
    }

    forceExitMatch()
    {
        if (this.menu_state == 1) {
            this.toggleLobbyState();
        }
    }
}