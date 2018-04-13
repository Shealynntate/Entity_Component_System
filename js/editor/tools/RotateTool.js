

class RotateTool extends Tool
{
    constructor(canvas)
    {
        super(canvas);

        this.color = '#2C142D';
        this.radiusBuffer = 20;
    }

    update()
    {
        if (ActiveEntity)
        {
            super.drawSelection(ActiveEntity);
            
            var transform = ActiveEntity.getComponent(CTYPE.TRANSFORM);
            
            this.drawSelection(transform);

            if (EditorMouse.isActive)
            {
                var threshold = 0.1;

                var origin = transform.position;
                var start = EditorMouse.start.Sub(origin).normalize();
                var current = EditorMouse.position.Sub(origin).normalize();
                var diff = current.Sub(start);

                var theta = start.dot(current) * .1;

                if (diff.length() > threshold)
                {
                    if (start.x >= 0 && current.x >= 0)
                    {
                        // In Quadrants I and IV
                        if (start.y < current.y)
                            theta *= -1;
                    }
                    else if (start.x <= 0 && current.x <= 0)
                    {
                        // In Quadrants II and III
                        if (start.y > current.y)
                            theta *= -1;
                    }
                    else if (start.y >= 0 && current.y >= 0)
                    {
                        // In Quadrants I and II
                        if (start.x > current.x)
                            theta *= -1;
                    }
                    else if (start.y <= 0 && current.y <= 0)
                    {
                        // In Quadrants III and IV
                        if (start.x < current.x)
                            theta *= -1;
                    }
                    
                    transform.addRotationInRadians(theta);

                    EditorMouse.update();

                    updateAABB(ActiveEntity);
                }
            }
        }
    }

    toolRadius(transform)
    {
        var w = transform.scale.x / 2.0;
        var h = transform.scale.y / 2.0;
        
        return Math.max(w, h) + this.radiusBuffer * globalScale.scale;
    }

    collisionCheck(transform)
    {
        var point = transform.transformPoint(EditorMouse.start);
        var radius = this.toolRadius(transform);

        return (Math.abs(point.x) <= radius && Math.abs(point.y) <= radius);
    }

    drawSelection(transform)
    {
        var origin = transform.position;
        var rotation = transform.rotationInRadians;
        var radius = this.toolRadius(transform);
        
        // Draw outer circle
        this.canvas.start();
        this.canvas.drawCircle(origin.x, origin.y, radius, 3, this.color);
        this.canvas.end();

        // Draw lines
        this.canvas.start();
        this.canvas.transform(origin, rotation);
        this.canvas.drawLine(origin.x, origin.y - radius, origin.x, origin.y + radius, 1, this.color);
        this.canvas.drawLine(origin.x - radius, origin.y, origin.x + radius, origin.y, 1, this.color);
        this.canvas.end();
    }

    type()
    {
        return TOOL.ROTATE;
    }
}