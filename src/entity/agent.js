import eventManager from '../tools/eventmanager';

const SPEED = 40;
const JUMP_STR = 100;

export default class Agent extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, mirrored, player)
    {
        super(scene, x, y)

        let color = mirrored ? 'red' : 'green';
        let offset = mirrored ? 1 : -1;
        let shoe = this.scene.add.sprite(0, 0, color + '_shoe')
            .setOrigin(0.5 + 0.1 * offset, 0.05)
            .setFlipX(mirrored)
            .setScale(0.45);
        let head = this.scene.add.sprite(0, 0, color + '_head')
            .setOrigin(0.5, 0.65)
            .setFlipX(mirrored)
            .setScale(0.75);

        this.add(shoe);
        this.add(head);

        this.setSize(110, 110);
        this.scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        this.body.setCircle(55);

        this.scene.physics.add.collider(this.scene.solidGroup, this);

        this.name = player.name;
        this.nickname = player.nickname;

        this.dir = "";
        this.act = "";

        //  events
        eventManager.on('set_act', this.setAction, this);

        this.scene.events.once(Phaser.Scenes.SHUTDOWN, () => {
            eventManager.off('set_act', this.setAction, this);
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
            this.dir = params.getUtfString('dir') ? params.getUtfString('dir') : this.dir;
            this.act = params.getUtfString('act') ? params.getUtfString('act') : this.act;
        }
    }

    update(time, delta)
    {
        //  movement
        switch (this.dir) {
            case 'right':
                this.body.velocity.x = SPEED * delta;
                break;
            case 'left':
                this.body.velocity.x = -SPEED * delta;
                break;
            case 'idle':
                this.body.velocity.x = 0;
                break;
            default:        //  idle
                this.body.velocity.x = 0;
                break;
        }

        switch (this.act) {
            case 'jump':
                this.body.velocity.y = -JUMP_STR * delta;
                break;
        }
        this.act = "";
    }
}