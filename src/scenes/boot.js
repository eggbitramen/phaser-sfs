export default class Boot extends Phaser.Scene {
    constructor()
    {
        super('boot');
    }

    preload()
    {
        let {width, height} = this.sys.game.canvas;
        this.game.width = width;
        this.game.height = height;

        this.load.setPath('./assets/images/');
        this.load.image('lobby-bg', 'lobby-bg.png');
        this.load.image('button-00', 'button-00.png');
        this.load.image('button-01', 'button-01.png');
        this.load.image('sprtxt-start', 'sprtxt-start.png');
        this.load.image('sprtxt-cancel', 'sprtxt-cancel.png');
        this.load.image('sprtxt-exit', 'sprtxt-exit.png');
        this.load.image('sprtxt-rematch', 'sprtxt-rematch.png');

        this.load.once('complete', () => {
            this.goToLogin();
        });
    }

    create()
    {

        //add objects
        this.add.text(this.game.width / 2, this.game.height / 2, "Loading ...").setOrigin(0.5, 0.5);
    }

    goToLogin()
    {
        this.scene.stop('boot');
        this.scene.start('login');
    }
}