export default class Agent extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, mirrored)
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

        let collider = this.scene.add.circle(0, 0, 55, 0x9842f5, 150)
            .setOrigin(0.5, 0.5);

        this.add(shoe);
        this.add(head);
        this.add(collider);
    }

    update()
    {

    }
}