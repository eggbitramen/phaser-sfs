import eventManager from '../tools/eventmanager';

let delta;
const g = 10;

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

        this.setScale(1.3);
        this.setOrigin(0.5, 0.5);

		//events
        eventManager.on('set_ball', this.setBall, this);
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

        /*this.rotation += 0.00001 * this.body.velocity.x * _delta;*/

		this.setPosition(this.x + (this.vx * delta), this.y + ((this.vy + g) * delta))

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
