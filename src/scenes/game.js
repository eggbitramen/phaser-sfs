export default class GamePlay extends Phaser.Scene
{
    constructor()
    {
        super('gameplay');
    }

    create()
    {
        //  static images, backgrounds
        this.add.image('bg_night', 0, 0);
        this.add.image('tribune', 0, 0);
        this.add.image('supporters', 0, 0);
        this.add.image('field', 0, 0);
        this.add.image('dirt', 0, 0);

        this.add.text(0,0,"hahe");

        console.log('Begin Game');
    }
}