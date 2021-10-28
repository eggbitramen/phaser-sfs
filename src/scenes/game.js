import GameManager from '../tools/gamemanager';
import Agent from '../entity/agent';
import Ball from '../entity/ball';
import Controller from '../tools/controller';
import eventManager from '../tools/eventmanager';

let gm;

//  layers container
let background_cont;
let foreground_cont;
let entity_cont;

let entities = [];

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

        this.overlap_list = this.physics.add.group();
        
        //events
        eventManager.on('register_overlap', registerOverlap, this);

        this.events.once(Phaser.Scenes.SHUTDOWN, () => {
            eventManager.iff('register_overlap', registerOverlap, this);
        });

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
        scoreboard_cont.setPosition(this.game.width / 2, scoreboard.height * 0.6).setScale(0.7);

        scoreboard_cont.add(scoreboard);

        background_cont.add([bg_night, tribune, supporters, field, dirt, goal_backs[0], goal_backs[1]]);
        foreground_cont.add([light, goal_fronts[0], goal_fronts[1], scoreboard_cont]);

        //  world bounds and colliders
        let solids = [];
        solids[0] = this.add.container(field.width / 2, field.y + field.height * 9 / 8).setSize(field.width, field.height);
        solids[1] = this.add.container(goal_backs[0].width * 1 / 2, goal_backs[0].y - goal_backs[0].height + 20);
        solids[2] = this.add.container(goal_backs[1].x - goal_backs[1].width * 1.9 / 3, goal_backs[1].y - goal_backs[1].height + 20);
        this.solidGroup = this.physics.add.staticGroup(solids);
        solids[1].body.setCircle(40);
        solids[2].body.setCircle(40);

        //  moving actors
        let p1 = new Agent(this, field.width / 4, field.y + field.height * 4 / 10, false, gm.getAllPlayers()[0]);
        let p2 = new Agent(this, 3 / 4 * field.width, field.y + field.height * 4 / 10, true, gm.getAllPlayers()[1]);

        //  ball
        let ball = new Ball(this, field.width / 2, field.y + field.height / 2);

        entities = [p1, p2, ball];

        entity_cont.add([p1, p2, ball]);

        //  init controller
        this.controller = new Controller(this);
    }

    update(time, delta)
    {
        this.controller.update();
        for (const i_entity in entities) {
            entities[i_entity].update(time, delta);
        }
    }
}

function registerOverlap(object) {
    this.overlap_list.add(object);
    this.physics.add.overlap(object, this.overlap_list);
}