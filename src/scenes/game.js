import GameManager from '../tools/gamemanager';

let gm;

//  layers container
let background_cont;
let foreground_cont;
let entity_cont;

export default class GamePlay extends Phaser.Scene
{
    constructor()
    {
        super('gameplay');
    }

    init()
    {
        gm = GameManager.getInstance();
    }

    create()
    {
        background_cont = this.add.container(0, 0);
        entity_cont = this.add.container(0, 0);
        foreground_cont = this.add.container(0, 0);

        //  static images, backgrounds
        let bg_night = this.add.image(0, 0, 'bg_night').setOrigin(0, 0);
        let tribune = this.add.image(0, 0, 'tribune').setOrigin(0, 0);
        let supporters = this.add.image(0, bg_night.height, 'supporters').setOrigin(0, 0);
        let field = this.add.image(0, tribune.y + tribune.height, 'field').setOrigin(0, 0);
        let dirt = this.add.image(0, field.y + field.height, 'dirt').setOrigin(0, 0);
        let light = this.add.image(0, 0, 'stadium_light').setOrigin(0, 0);

        background_cont.add([bg_night, tribune, supporters, field, dirt]);
        foreground_cont.add(light);

        //  moving actors

        this.add.text(0,0,"hahe");

        console.log('Begin Game');
    }
}