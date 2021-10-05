export default class MatchWrapper extends Phaser.Scene {
    constructor()
    {
        super('matchwrapper');
    }

    preload()
    {
        //preload assets here
    }

    create()
    {
        this.add.text(10, 10, "Finding Match");
    }
}