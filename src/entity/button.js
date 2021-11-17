
export default class Button extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, texture, name)
    {
        super(scene, x, y);
        this.name = name;

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
    }

    reset()
    {
        this.button_img.clearTint();
    }
}