import GameManager from '../tools/gamemanager';
import eventManager from '../tools/eventmanager';

let gm;

export default class Button extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, texture, name)
    {
        super(scene, x, y);
        this.name = name;

        gm = GameManager.getInstance();

        this.button_img = this.scene.add.image(0, 0, texture).setInteractive();
        this.add(this.button_img);

        //  events
        this.button_img.on('pointerdown', this.press, this);
        this.button_img.on('pointerup', this.reset, this);
        this.button_img.on('pointerout', this.reset, this);
    }

    press()
    {
        this.button_img.setTint(0x9fa6a5);
        preSend(this.name);
    }

    reset()
    {
        this.button_img.clearTint();
        if (this.name == 'left' || this.name == 'right') {
            send('act', {dir: 'idle'});
        }
    }
}

function preSend(cmd) {
    
    let obj = {};

    console.log(cmd);
    
    switch (cmd) {
        case 'left':
            obj.dir = cmd;
            break;
        case 'right':
            obj.dir = cmd;
            break;

        default:
            obj.act = cmd;
            break;
    }

    send('act', obj);
}

function send(req, obj) {
    let cmd = {
        req: req,
        sender: gm.getProperty('user_id'), 
        obj: obj
    };

    eventManager.emit('dispatch_controller', cmd);
}