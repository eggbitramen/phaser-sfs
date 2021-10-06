var avaCont;

export default class MatchWrapper extends Phaser.Scene {
    constructor()
    {
        super('matchwrapper');
    }

    create()
    {
        this.add.image(0, 0, 'lobby-bg').setScale(2);

        avaCont = this.add.container(this.game.width / 2, this.game.height / 2);
        /*
            iterate avatars here
        */
    }
}