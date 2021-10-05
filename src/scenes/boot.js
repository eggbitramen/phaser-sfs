export default class Boot extends Phaser.Scene {
    constructor()
    {
        super('boot');
    }

    init()
    {

    }

    preload()
    {
        //preload assets here
    }

    create()
    {
        this.add.text(10, 10, "Loading ...");
        this.scene.stop("boot");
        this.game.scene.start("login")
    }
}