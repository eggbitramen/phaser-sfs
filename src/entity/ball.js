import eventManager from '../tools/eventmanager';

let delta;
const g = 100;
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

    setBall(params) {
        this.setPosition(params.getDouble('x'), params.getDouble('y'));
		this.vx = params.getDouble('vx');
		this.vy = params.getDouble('vy');
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
