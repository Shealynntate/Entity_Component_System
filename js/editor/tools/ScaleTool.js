

class ScaleTool extends Tool
{
    constructor(canvas)
    {
        super(canvas);
        
        this.lineColor = 'rgba(0, 0, 0, 0.25)';
        this.xBoxColor = 'rgba(255, 0, 0, 1)';
        this.yBoxColor = 'rgba(0, 255, 0, 1)';

        this.lineExtension = 40;
        this.boxSize = 16;

        this.activeZone = null;  // Part of tool user clicks on
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
                // Only assign a new active zone if user is first clicking down
                if (this.activeZone == null)
                {
                    var point = transform.translatePoint(EditorMouse.start);
                    point = transform.rotatePoint(point);

                    var w = transform.scale.x / 2.0;
                    var h = transform.scale.y / 2.0;

                    if (this.collisionCheckXAxis(transform, point, w, h))
                        this.activeZone = 'xAxis';
                    else if (this.collisionCheckYAxis(transform, point, w, h))
                        this.activeZone = 'yAxis';
                }

                var delta = EditorMouse.deltaPosition;

                if (this.activeZone == 'xAxis')
                {
                    transform.scale.x += delta.x;
                    updateAABB(ActiveEntity);
                }
                else if (this.activeZone == 'yAxis')
                {
                    transform.scale.y += delta.y;
                    updateAABB(ActiveEntity);
                }
            }
            else
            {
                this.activeZone = null;
            }     
        } 
        else
        {
            this.activeZone = null;
        }
    }

    drawSelection(transform)
    {
        var origin = transform.position;
        var w = transform.scale.x / 2.0;
        var h = transform.scale.y / 2.0;

        var scale = globalScale.scale;
        var boxSize = this.boxSize * scale;
        var line = this.lineExtension * scale;

        this.canvas.start();

        this.canvas.transform(origin, transform.rotationInRadians);

        // Gray guidelines
        this.canvas.drawLine(origin.x, origin.y, origin.x, origin.y + h + line, 2, this.lineColor);
        this.canvas.drawLine(origin.x, origin.y, origin.x + w + line, origin.y, 2, this.lineColor);
        this.canvas.drawRectOutline(origin.x, origin.y, w, h, 2, this.lineColor);

        // Tool Boxes
        this.canvas.drawRectFilled(origin.x + w + line + boxSize / 2, origin.y, boxSize, boxSize, this.xBoxColor);
        this.canvas.drawRectFilled(origin.x, origin.y + line + h + boxSize / 2, boxSize, boxSize, this.yBoxColor);

        this.canvas.end();
    }

    collisionCheck(transform)
    {
        var point = transform.translatePoint(EditorMouse.start);
        point = transform.rotatePoint(point);
        var w = transform.scale.x / 2.0;
        var h = transform.scale.y / 2.0;

        return this.collisionCheckXAxis(transform, point, w, h) ||
               this.collisionCheckYAxis(transform, point, w, h);
    }

    collisionCheckXAxis(transform, point, w, h)
    {
        var scale = globalScale.scale;
        var boxDim = 0.5 * this.boxSize * scale;
        var line = this.lineExtension * scale;

        var x = point.x - (w + line + boxDim);
        
        return (Math.abs(x) <= boxDim && Math.abs(point.y) <= boxDim);
    }

    collisionCheckYAxis(transform, point, w, h)
    {
        var scale = globalScale.scale;
        var boxDim = 0.5 * this.boxSize * scale;
        var line = this.lineExtension * scale;

        var y = point.y - (h + line + boxDim);
        
        return (Math.abs(point.x) <= boxDim && Math.abs(y) <= boxDim);
    }

    type()
    {
        return TOOL.SCALE;
    }
}