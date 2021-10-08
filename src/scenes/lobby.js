import eventManager from '../tools/eventmanager';

var tutorialRect;
var tutorialText;
var tutorialTextData;
var findMatchBtn;
var findMatchTxt;
var tutorialCont;
var findMatchCont;

var menuState = 0; // 0 = tutorial, 1 = find match

export default class Lobby extends Phaser.Scene {
    constructor()
    {
        super('lobby');
    }

    create()
    {
        this.add.image(0, 0, 'lobby-bg').setScale(2); //bg

        findMatchBtn = this.add.sprite(0, 0, 'button-00').setOrigin(0.5, 0.5);
        findMatchBtn.setPosition(this.game.width / 2, this.game.height - this.game.height / 5);
        findMatchBtn.setInteractive();
        
        findMatchTxt = this.add.sprite(0, 0, 'sprtxt-start').setOrigin(0.5, 0.5);
        findMatchTxt.setPosition(findMatchBtn.x, findMatchBtn.y);

        tutorialCont = this.add.container(this.game.width / 2, this.game.height / 2);
        tutorialCont.setVisible(false);

        findMatchCont = this.add.container(this.game.width / 2, this.game.height / 2);
        findMatchCont.setVisible(false);
        let findMatchInfo = this.add.text(0, 0, "Finding Match").setOrigin(0.5, 0.5).setFontSize(30).setFontStyle('bold');
        findMatchCont.add(findMatchInfo);

        // add events
        findMatchBtn.on('pointerdown', () => {
            toggleLobbyState();
        });
        
        this.events.on(Phaser.Scenes.SHUTDOWN, () => {
            findMatchBtn.off('pointerdown', () => {
                toggleLobbyState();
            });
        });
    }
}

function toggleLobbyState() {
    if (menuState == 0)
    {
        menuState = 1;
        findMatchTxt.setTexture('sprtxt-cancel');
        tutorialCont.setVisible(false);
        findMatchCont.setVisible(true);

        eventManager.emit('find-match');
    }
    else
    {
        menuState = 0;
        findMatchTxt.setTexture('sprtxt-start');
        findMatchCont.setVisible(false);
        tutorialCont.setVisible(true);

        eventManager.emit('exit-match');
    }
}