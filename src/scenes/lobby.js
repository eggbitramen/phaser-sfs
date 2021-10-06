
var tutorialRect;
var tutorialText;
var tutorialTextData;
var findMatchBtn;
var findMatchTxt;

export default class Lobby extends Phaser.Scene {
    constructor()
    {
        super('lobby');
    }

    create()
    {
        this.add.image(0, 0, 'lobby-bg').setScale(2); //bg

        this.anims.create({
            key: 'btstate',
            frames: [
                { key: 'button-00' },
                { key: 'button-01' }
            ],
            frameRate: 0,
            repeat: 0
        });
        
        this.anims.create({
            key: 'txtcmd',
            frames: [
                { key: 'sprtxt-start' },
                { key: 'sprtxt-cancel' },
                { key: 'sprtxt-rematch' },
                { key: 'sprtxt-exit' }
            ],
            frameRate: 0,
            repeat: 0
        });

        findMatchBtn = this.add.sprite(0, 0, 'button-00').play('btstate');
        findMatchBtn.setOrigin(0.5, 0.5);
        findMatchTxt = this.add.sprite(0, 0, 'sprtxt-start').play('txtcmd');
        findMatchTxt.setOrigin(0.5, 0.5);
        
        findMatchBtn.setPosition(this.game.width / 2, this.game.height - this.game.height / 5);
        findMatchTxt.setPosition(findMatchBtn.x, findMatchBtn.y);
    }
}