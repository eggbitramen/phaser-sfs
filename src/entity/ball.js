import eventManager from '../tools/eventmanager';

const MASS_GRAVITY = 5000;

let delta;

export default class Ball extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'ball');
        this.name = 'ball';

        //  Init Pos
        this.init_x = this.x;
        this.init_y = this.y;

        this.setScale(1.3);
        this.setOrigin(0.5, 0.5);

        this.scene.physics.world.enable(this);
        this.body.setCircle(this.width / 2);
        // this.scene.physics.add.collider(this, this.scene.solidGroup, checkCollide, null, this);
        this.scene.physics.add.overlap(this, this.scene.overlap_list, checkOverlap, null, this);

        eventManager.emit('register_overlap', this);

        this.overlaps = [];
        this.synced = true;

		//events
        eventManager.on('set_ball', this.setBall, this);
        eventManager.on('spread', this.receiveSpread, this);

        this.scene.events.once(Phaser.Scenes.SHUTDOWN, () => {
            eventManager.off('set_ball', this.setBall, this);
            eventManager.off('spread', this.receiveSpread, this);
        });

        this.body.setGravityY(MASS_GRAVITY);
    }

	create()
	{
		console.log("Ball create");
		send('ball', {x: this.init_x, y: this.init_y, velocity_x: 0, velocity_y: 0, touch: 'none'}, this);
	}

    update(time, _delta)
    {
        delta = _delta;

        this.rotation += 0.00001 * this.body.velocity.x * _delta;

        //  clear overlaps
        let overlap_list = this.scene.overlap_list.getChildren();
        for (const i in overlap_list) {
            if (!this.scene.physics.overlap(this, overlap_list[i]))
            {
                let ioverlap = this.overlaps.indexOf(overlap_list[i].name);
                if (ioverlap != -1) 
                {
                    this.overlaps.splice(ioverlap, 1);
                }
            }
        }

        let solid_list = this.scene.solidGroup.getChildren();
        for (const i in solid_list) {
            if(this.scene.physics.collide(this, solid_list[i], checkCollide, null, this))
            {

            }else{
                let isolid = this.overlaps.indexOf(solid_list[i].name);
                if (isolid != -1) 
                {
                    this.overlaps.splice(isolid, 1);
                    console.log(solid_list[i].name + " cleared");
                }
            }
        }
    }

    receiveSpread(sender)
    {
        let distance = Math.abs( Phaser.Math.Distance.Between(this.x, this.y, sender.x, sender.y) );
        if (distance < 90 + this.width / 2) {
            let x_vel = 0;
            let y_vel = 0;

            switch (sender.act) {
                case 'lo':
                    x_vel = 150 * sender.kick_dir;
                    y_vel = -1000;
                    break;
            
                case 'hi':
                    x_vel = 100 * sender.kick_dir;
                    y_vel = -1700;
                    break;
            }

            send('ball', {x: this.x, y: this.y, velocity_x: x_vel, velocity_y: y_vel, touch: sender.name}, this);
        }
    }

    interact(sender)
    {
        let bounce_result = bounceCircle(this, sender);
        
        if (this.body.velocity.y == 0) {
            send('ball', {x: this.x, y: this.y, velocity_x: 50 * bounce_result.x_dir, velocity_y: -350, touch: sender.name}, this);
        } else {
            send('ball', {x: this.x, y: this.y, dir_x: bounce_result.x_dir, dir_y: bounce_result.y_dir, touch: sender.name}, this);
        }
        
    }

    setBall(params) {

        if (params.getDouble('velocity_y') == 0) {
            this.body.setGravityY(0);
        }
        else
        {
            this.body.setGravityY(MASS_GRAVITY);
        }

        this.setPosition(params.getDouble('x'), params.getDouble('y'));
        this.body.setVelocity(params.getDouble('velocity_x') * delta, params.getDouble('velocity_y')) * delta;
		this.synced = true;
		send('confirm', null, this);
    }

    reload() {
        this.overlaps = [];
        //send('ball', {x: this.init_x, y: this.init_y, velocity_x: 0, velocity_y: -1000, no_sync: true});
        this.setPosition(this.init_x, this.init_y);
        this.body.setVelocity(0, 0);
    }
}

function logCollide() {
    console.log("Colliding");
}

function checkCollide(self, other) {
    if (!self.overlaps.includes(other.name)) {   // on overlap start
        self.overlaps.push(other.name);
        
        //   bounce
        bounce(self, other);
    }
}

function checkOverlap(self, other) {
    if (!self.overlaps.includes(other.name)) {   // on overlap start
        self.overlaps.push(other.name);
        
        //  goalpal
        gPal(self, other);

        //   score
        score(other);
    }
}

function gPal(self, static_body) {
    switch (static_body.name) {
        case 'solid_left':
            send('ball', {x: self.x, y: self.y, dir_x: 1, dir_y: -1, touch: static_body.name}, this);
            break;
        case 'solid_right':
            send('ball', {x: self.x, y: self.y, dir_x: -1, dir_y: -1, touch: static_body.name}, this);
            break;
    }
}

function score(goal) {
    if (goal.owner != null)
    {
        send('score_one', { owner: goal.owner }, this);
    }
}

function bounce(self, static_body) {

    let x_dir = Math.sign(self.body.velocity.x);
    let y_dir = Math.sign(self.body.velocity.y);
    let bounce_result = null;

    switch (static_body.name) {
        case 'rect_down':
            y_dir = -1;
            break;
        case 'rect_up':
            y_dir = 1;
            break;
        case 'rect_left':
            x_dir = 1;
            break;
        case 'rect_right':
            x_dir = -1;
            break;
        case 'rect_down':
            y_dir = -1;
            break;
    }

    send('ball', {x: self.x, y: self.y, dir_x: x_dir, dir_y: y_dir, touch: static_body.name}, this);
}

function bounceCircle(self, other) {

    let angle = Phaser.Math.Angle.Between(other.x, other.y, self.x, self.y) * (180 / Math.PI);
        
    let x_dir = Math.sign(self.body.velocity.x);
    let y_dir = Math.sign(self.body.velocity.y);

    if (-45 < angle && angle <= 45) {
        x_dir = 1;
    }
    else if (45 < angle && angle <= 135) {
        y_dir = 1;
    }
    else if(-135 < angle && angle <= -45) {
        y_dir = 1;
    }
    else {
        x_dir = -1;
    }

    return {x_dir: x_dir, y_dir: y_dir};
}

function send(req, obj, this_obj) {
	
	let cmd = {
		req: req,
		obj: obj
	};

	if (req == 'ball')
	{
		console.log(this_obj);
		/*if	(self.synced)
		{*/	
			eventManager.emit('send', cmd);
		//}
	}
	else
	{
		eventManager.emit('send', cmd);
	}
}
