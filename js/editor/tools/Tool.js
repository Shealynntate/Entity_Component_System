
class Tool
{
    constructor(canvas)
    {
        this.canvas = canvas;

        this.outline_color = '#EE744D';
        this.collider_color = '#00FF00';
        this.outline_buffer = 10;
        this.respawn_size = 60;
    }

    drawSelection(entity)
    {
        var transform = entity.getComponent(CTYPE.TRANSFORM);

        var origin = transform.position;
        var w = transform.scale.x;
        var h = transform.scale.y;

        this.canvas.start();
        
        if (entity.hasComponent(CTYPE.AABB_COLLIDER))
        {
            // Draw AABB
            var collider = entity.getComponent(CTYPE.AABB_COLLIDER);
            var scale = collider.scale;
            var offset = collider.offset;
            this.canvas.drawRectOutline(origin.x + offset.x, origin.y + offset.y, 
                                 scale.x, scale.y, 2, '#FF00FF');
        }

        if (entity.hasComponent(CTYPE.RESPAWN))
        {
            var respawn = entity.getComponent(CTYPE.RESPAWN);
            var position = respawn.position;
            var angle = respawn.rotationInRadians;
            var size = this.respawn_size * globalScale.scale;
            this.canvas.drawTexture(position, size, size, new Vector2(1, 1), new Vector2(0, 0), respawn.image);
            
        }

        this.canvas.transform(origin, transform.rotationInRadians);
        
        var buffer = this.outline_buffer * globalScale.scale;

        this.canvas.drawRectOutline(origin.x, origin.y, 
                                    w + buffer, h + buffer, 2, 
                                    this.outline_color);
            
        
        if (entity.hasComponent(CTYPE.BOX_COLLIDER))
        {
            var collider = entity.getComponent(CTYPE.BOX_COLLIDER);
            var scale = collider.scale;
            var offset = collider.offset;
            this.canvas.drawRectOutline(origin.x + offset.x, origin.y + offset.y, 
                                scale.x * w, scale.y * h, 2, this.collider_color);
        }

        this.canvas.end();
    }

    type()
    {
        return null;
    }
}