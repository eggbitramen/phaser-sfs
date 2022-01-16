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

		this.kick_dir = kick_dir;

		this.g = 150;

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

		this.vx = 0;
		this.vy = 0;
		this.r = 60;

        this.dir = "";
        this.act = "";

        // Tweens
		
		console.log(this.kick_dir);

        this.tweens = {};

		this.tweens.right = this.scene.tweens.add({
            targets: this.head,
            duration: 100,
            angle: -20,
            paused: true
        });
		this.tweens.left = this.scene.tweens.add({
            targets: this.head,
            duration: 100,
            angle: 20,
            paused: true
        });
		this.tweens.idle = this.scene.tweens.add({
            targets: this.head,
            duration: 100,
            angle: 0,
            paused: true
        });

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
			this.vx = params.getDouble('vx');
			this.vy = params.getDouble('vy');

			this.setPosition(params.getDouble('x'), params.getDouble('y'));

			if (params.getUtfString('dir'))
				this.dir = params.getUtfString('dir');
			if (params.getUtfString('act'))
				this.act = params.getUtfString('act');
        }
    }

    update(time, _delta)
    {
		let delta = _delta / 1000; 

		switch (this.dir) {
			case 'left':
				this.tweens.left.play(true);
				break;
			case 'right':
				this.tweens.right.play(true);
				break;
			case 'idle':
				this.head.angle = 0;
				break;
		}
		this.dir = "";

        switch (this.act) {
            case 'jump':
                this.tweens.jump.play(true);
                break;
            case 'hi':
				this.tweens.hi.play(true);
                break;
            case 'lo':
                this.tweens.lo.play(true);
                break;
        }
        this.act = "";
		
		let cx = this.x + this.vx * delta;
		let cy = this.y + (this.vy + this.g) * delta;

		// code for collision check
		if (cx - this.r < 0)
			cx = this.r;
		else if (cx + this.r > 1280)
			cx = 1280 - this.r;

		if (cy + this.r > 490)
		{
			cy = 490 - this.r;
			this.vy = 0;
		}
		else
			this.vy += this.g;

		this.setPosition(cx, cy);

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
