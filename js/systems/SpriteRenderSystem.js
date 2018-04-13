
class SpriteRenderSystem extends System
{
    constructor(manager)
    {
        super(manager);

        this.BIT_MASK = (CTYPE.TRANSFORM | CTYPE.SPRITE);
    }

    update()
    {
        var system = this;

        this.manager.entities.forEach(function (entity)
        {
            if (entity.partOfSystem(system.BIT_MASK))
            {
                var transform = entity.getComponent(CTYPE.TRANSFORM);
                var sprite = entity.getComponent(CTYPE.SPRITE);
                
                var position = transform.position;
                var rotation = transform.rotationInRadians;
                var w = transform.scale.x;
                var h = transform.scale.y;
                var start = new Vector2(position.x - w / 2.0, position.y + h / 2.0);

                var canvas = sprite.canvas;

                // Draw texture with tile and offset values
                canvas.start();
                canvas.transform(position, rotation);
                canvas.drawTexture(start, w, h, sprite.tile, sprite.offset, sprite.texture);
                canvas.end();
            }
        });
    }
}