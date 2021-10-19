import GameManager from '../tools/gamemanager';
import Agent from '../entity/agent';
import Ball from '../entity/ball';

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
        
        let goal_backs = [];
        goal_backs[0] = this.add.image(0, field.y + field.height * 3 / 5, 'goal_back').setOrigin(0, 1);
        goal_backs[1] = this.add.image(field.width, field.y + field.height * 3 / 5, 'goal_back').setOrigin(1, 1).setFlipX(true);

        let goal_fronts = [];
        goal_fronts[0] = this.add.image(0, field.y + field.height * 7 / 10, 'goal_front').setOrigin(0, 1);
        goal_fronts[1] = this.add.image(field.width, field.y + field.height * 7 / 10, 'goal_front').setOrigin(1, 1).setFlipX(true);

        //  scoreboard components
        let scoreboard_cont = this.add.container();
        let scoreboard = this.add.image(0, 0, 'ui-scoreboard');
        scoreboard_cont.setPosition(this.game.width / 2, scoreboard.height * 0.6);

        

        scoreboard_cont.add(scoreboard);

        background_cont.add([bg_night, tribune, supporters, field, dirt, goal_backs[0], goal_backs[1]]);
        foreground_cont.add([light, goal_fronts[0], goal_fronts[1], scoreboard_cont]);

        //  moving actors
        let p1 = new Agent(this, field.width / 4, field.y + field.height * 4/ 10, false);
        let p2 = new Agent(this, 3 / 4 * field.width, field.y + field.height * 4/ 10, true);

        //  ball
        let ball = new Ball(this, field.width / 2, field.y + field.height / 2);

        entity_cont.add([p1, p2, ball]);

        console.log('Begin Game');
    }
}