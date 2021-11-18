import GameManager from '../tools/gamemanager';
import Agent from '../entity/agent';
import Ball from '../entity/ball';
import Button from '../entity/button';
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

        //  buttons
        let anch_y = dirt.y + dirt.height / 4;
        let anch_x_offset = dirt.width / 20;
        let bt_left = new Button(this, anch_x_offset * 3, anch_y, 'btn_left', 'left');
        let bt_right = new Button(this, anch_x_offset * 6, anch_y, 'btn_right', 'right');
        let bt_jump = new Button(this, anch_x_offset * 10.5, anch_y, 'btn_jump', 'jump');
        let bt_lo = new Button(this, anch_x_offset * 14, anch_y, 'btn_lo', 'lo');
        let bt_hi = new Button(this, anch_x_offset * 17.5, anch_y, 'btn_hi', 'hi');

        background_cont.add([bg_night, tribune, supporters, field, dirt, goal_backs[0], goal_backs[1]]);
        foreground_cont.add([light, goal_fronts[0], goal_fronts[1], scoreboard_cont, bt_left, bt_right, bt_jump, bt_lo, bt_hi]);

        //  world bounds and colliders
        let solids = [];
        solids[0] = this.add.container(field.width / 2, field.y + field.height * 9 / 8).setSize(field.width, field.height);
        solids[0].name = 'rect_down';
        solids[1] = this.add.container(field.width / 2, -50).setSize(field.width, 100);
        solids[1].name = 'rect_up';
        solids[2] = this.add.container(-50, this.game.height / 2).setSize(100, this.game.height);
        solids[2].name = 'rect_left';
        solids[3] = this.add.container(field.width + 50, this.game.height / 2).setSize(100, this.game.height);
        solids[3].name = 'rect_right';
        
        this.solidGroup = this.physics.add.staticGroup(solids);

        //  moving actors
        let p1 = new Agent(this, field.width / 4, field.y + field.height * 4 / 10, false, gm.getAllPlayers()[0]);
        p1.kick_dir = 1;
        let p2 = new Agent(this, 3 / 4 * field.width, field.y + field.height * 4 / 10, true, gm.getAllPlayers()[1]);
        p2.kick_dir = -1;

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