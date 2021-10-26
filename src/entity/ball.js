

export default class Ball extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'ball');
        this.setScale(1.3);
        this.setOrigin(0.5, 0.5);

        this.scene.physics.world.enable(this);
        this.body.setCircle(this.width / 2);
        this.body.setCollideWorldBounds(true);
        this.scene.physics.add.collider(this.scene.solidGroup, this);
    }

    update(time, delta)
    {
        
    }
}