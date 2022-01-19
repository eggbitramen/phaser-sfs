import eventManager from '../tools/eventmanager';

let delta;
const g = 150;
const f = 10;

export default class Ball extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'ball');
        this.name = 'ball';

        //  Init Pos
        this.init_x = this.x;
        this.init_y = this.y;

		this.vx = 0;
		this.vy = 0;

		this.enabled = false;

        this.setScale(1.3);
        this.setOrigin(0.5, 0.5);
		console.log("diameter : " + this.height / 2);

		this.command = [];

		console.log(this);

		this.warpto = this.scene.tweens.add({
			targets: this,
			x: this.x,
			y: this.y,
			duration: 100,
			paused: true,
			onComplete: () => {
				this.runCommand()
			}
		});

		//events
        eventManager.on('set_ball', this.setBall, this);
		eventManager.once('begin_game', () => {
			this.enabled = true;
		});
        this.scene.events.once(Phaser.Scenes.SHUTDOWN, () => {
            eventManager.off('set_ball', this.setBall, this);
        });

		this.create();
    }

	create()
	{
		console.log("Ball create");
	}

    update(time, _delta)
    {
        delta = _delta / 1000;
		if (this.enabled)
		{
			this.rotation += this.vx * delta / 50;

			let cx = this.x + this.vx * delta;
			let cy = this.y + (this.vy + g) * delta;

			if (cx - this.height/2 < 0)
				cx = this.height/2;
			else if (cx + this.height/2 > 1280)
				cx = 1280 - this.height/2;

			if (cy - this.height/2 < 0)
			{
				cy = this.height/2;
				this.vy += g;
			}
			else if (cy + this.height/2 >= 490)
			{
				this.vy = 0;	
				cy = 490 - this.height/2;
			}
			else
			{
				this.vy += g;
			}

			this.setPosition(cx, cy);
		}
    }

	warp(x, y)
	{
		this.warpto.updateTo('x', x);
		this.warpto.updateTo('y', y);
		this.warpto.play(true);
	}

    setBall(params) {
		
		this.setPosition(params.getDouble('x'), params.getDouble('y'));
		this.vx = params.getDouble('vx');
		this.vy = params.getDouble('vy');

		/*
		let move = {
			x: params.getDouble('x'),
			y: params.getDouble('y'),
			vx: params.getDouble('vx'),
			vy: params.getDouble('vy')
		}

		this.command.push(move);
		console.log(this.command.length);

		if (this.command.length == 1)
			this.warp(move.x, move.y);
			*/
	}

	runCommand()
	{
		if (this.command.length <= 1)
		{
			this.setPosition(this.command[0].x, this.command[0].y);
			this.vx = this.command[0].vx;
			this.vy = this.command[0].vy;
			this.command = [];
		}
		else
		{
			this.command.shift();
			this.warp(this.command[0].x, this.command[0].y);
		}
	}

    reload() {
        this.overlaps = [];
		this.setPosition(this.init_x, this.init_y);
    }
}

function send(req, obj, self) {
	
	let cmd = {
		req: req,
		obj: obj
	};

	eventManager.emit('send', cmd);
}
