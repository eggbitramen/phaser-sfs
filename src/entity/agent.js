import eventManager from '../tools/eventmanager';
import GameManager from '../tools/gamemanager';

export default class Agent extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, mirrored, player, kick_dir)
    {
        super(scene, x, y)

        //  init pos
        this.init_x = this.x;
        this.init_y = this.y;

        this.gm = GameManager.getInstance();

        let color = mirrored ? 'red' : 'green';
        let offset = mirrored ? 1 : -1;
        this.shoe = this.scene.add.sprite(0, 0, color + '_shoe')
            .setOrigin(0.5 + 0.1 * offset, 0.05)
            .setFlipX(mirrored)
            .setScale(0.45);
        this.head = this.scene.add.sprite(0, 0, color + '_head')
            .setOrigin(0.5, 0.65)
            .setFlipX(mirrored)
            .setScale(0.75);

        this.add(this.shoe);
        this.add(this.head);

        //  self player marker
        if (player.name == this.gm.getProperty('user_id')) {
            let marker_size = 20;
            this.marker = this.scene.add.triangle(20, -70, 0, 0, marker_size, -marker_size * 3/2, - marker_size, -marker_size * 3/2, 0xb1eb34);
            this.marker.setStrokeStyle(2, 0x92c22b);
            this.add(this.marker);
        }

        this.name = player.name;
        this.nickname = player.nickname;

        this.dir = "";
        this.act = "";

        // Tweens
        this.tweens = {};
        this.tweens.jump = this.scene.tweens.add({
            targets: this.shoe,
            duration: 200,
            angle: 20 * this.kick_dir,
            paused: true,
            yoyo: true,
            onComplete: () => { this.shoe.angle = 0 }
        });
        this.tweens.hi = this.scene.tweens.add({
            targets: this.shoe,
            duration: 100,
            angle: -20 * this.kick_dir,
            paused: true,
            yoyo: true,
            onComplete: () => { this.shoe.angle = 0 }
        });
        this.tweens.lo = this.scene.tweens.add({
            targets: this.shoe,
            duration: 100,
            angle: -30 * this.kick_dir,
            paused: true,
            yoyo: true,
            onComplete: () => { this.shoe.angle = 0 }
        });

        //  events
        eventManager.on('set_act', this.setAction, this);
        eventManager.on('dispatch_controller', getSend, this);

        this.scene.events.once(Phaser.Scenes.SHUTDOWN, () => {
            eventManager.off('set_act', this.setAction, this);
            eventManager.off('dispatch_controller', getSend, this);
        });
    }

    getName()
    {
        return this.name;
    }

    getNickName()
    {
        return this.nickname;
    }

    setAction(params)
    {
        if (params.getUtfString('name') == this.name)
        {
            this.x = params.getDouble('x');
            this.y = params.getDouble('y');

            this.dir = params.getUtfString('dir') ? params.getUtfString('dir') : this.dir;
            this.act = params.getUtfString('act') ? params.getUtfString('act') : this.act;
            
        }
    }

    update(time, delta)
    {
        //  movement

		/*
        switch (this.dir) {
            case 'right':
                this.body.velocity.x = SPEED * delta;
                this.rotateHeadTo(-10);
                break;
            case 'left':
                this.body.velocity.x = -SPEED * delta;
                this.rotateHeadTo(10);
                break;
            case 'idle':
                this.body.velocity.x = 0;
                this.rotateHeadTo(0);
                break;
            default:        //  idle
                this.body.velocity.x = 0;
                break;
        }

        switch (this.act) {
            case 'jump':
                this.body.velocity.y = -JUMP_STR * delta;
                this.tweens.jump.play(true);
                break;
            case 'hi':
                if (this.name == this.gm.getProperty('user_id')) spread(this);
                this.tweens.hi.play(true);
                break;
            case 'lo':
                if (this.name == this.gm.getProperty('user_id')) spread(this);
                this.tweens.lo.play(true);
                break;
        }
		*/
        this.act = "";        
    }

    rotateHeadTo(dest)
    {
        let vec = dest - this.head.angle;
        let dif = Math.abs(vec);
        if (dif > 1) {
            this.head.angle += 5 * Math.sign(vec);
        }
    }

    rotateShoeTo(dest)
    {

    }

    reload()
    {
        //send('act', {dir: 'idle', x: this.init_x, y: this.init_y, no_sync: true});
        this.dir = 'idle';
        this.act = '';
        this.setPosition(this.init_x, this.init_y);
    }
}

function getSend(cmd) {

    if (cmd.sender == this.name) {
        cmd.obj.x = this.x;
        cmd.obj.y = this.y;

        delete cmd.sender;

        eventManager.emit('send', cmd);
    }
}

function send(req, obj) {
    let cmd = {
        req: req,
        obj: obj
    };
    eventManager.emit('send', cmd);
    // console.log(obj.x + " ... " + obj.y);
}
