

class MoveTool extends Tool
{
    constructor(canvas)
    {
        super(canvas);

        this.lineColor = 'rgba(0, 0, 0, 0.25)';
        this.xBoxColor = 'rgba(255, 0, 0, 1)';
        this.yBoxColor = 'rgba(0, 255, 0, 1)';
        this.lineExtension = 40;
        this.boxSize = 20;

        this.activeZone = null;  // Part of tool user clicks on
    }

    update()
    {
        if (ActiveEntity)
        {
            var transform = ActiveEntity.getComponent(CTYPE.TRANSFORM);
            this.drawSelection(transform);

            if (EditorMouse.isActive)
            {
                // Only assign a new active zone if user is first clicking down
                if (this.activeZone == null)
                {
                    var point = transform.translatePoint(EditorMouse.start);
                    
                    var w = transform.scale.x;
                    var h = transform.scale.y;

                    if (this.collisionCheckXAxis(transform, point, w, h))
                        this.activeZone = 'xAxis';
                    else if (this.collisionCheckYAxis(transform, point, w, h))
                        this.activeZone = 'yAxis';
                    else
                        this.activeZone = 'transform';
                }
                
                var delta = EditorMouse.deltaPosition;
                
                if (this.activeZone == 'xAxis')
                {
                    transform.position.x += delta.x;
                }
                else if (this.activeZone == 'yAxis')
                {
                    transform.position.y += delta.y;
                }
                else if (this.activeZone == 'transform')
                {
                    transform.position.x += delta.x;
                    transform.position.y += delta.y;
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
        super.drawSelection(ActiveEntity);

        var origin = transform.position;
        var w = transform.scale.x;
        var h = transform.scale.y;

        var scale = globalScale.scale;
        var box = this.boxSize * scale;
        var line = this.lineExtension * scale;

        this.canvas.start();

        // Gray guidelines
        this.canvas.drawLine(origin.x, origin.y, origin.x, origin.y + h + line, 2, this.lineColor);
        this.canvas.drawLine(origin.x, origin.y, origin.x + w + line, origin.y, 2, this.lineColor);

        // Tool Boxes
        this.canvas.drawTriangeFilled(origin.x, origin.y + h + line, box, box, this.yBoxColor);
        this.canvas.transform(new Vector2(origin.x + w + line, origin.y), Math.PI / 2);
        this.canvas.drawTriangeFilled(origin.x + w + line, origin.y, box, box, this.xBoxColor);

        this.canvas.end();
    }

    collisionCheck(transform)
    {
        var point = transform.translatePoint(EditorMouse.start);
        var w = transform.scale.x;
        var h = transform.scale.y;

        return this.collisionCheckXAxis(transform, point, w, h) ||
               this.collisionCheckYAxis(transform, point, w, h);
    }

    collisionCheckXAxis(transform, point, w, h)
    {
        var scale = globalScale.scale;
        var dim = 0.5 * this.boxSize * scale;
        var line = this.lineExtension * scale;

        var x = point.x - (w + line + dim);
        
        return (Math.abs(x) <= dim && Math.abs(point.y) <= dim);
    }

    collisionCheckYAxis(transform, point, w, h)
    {
        var scale = globalScale.scale;
        var dim = 0.5 * this.boxSize * scale;
        var line = this.lineExtension * scale;

        var y = point.y - (h + line + dim);
        
        return (Math.abs(point.x) <= dim && Math.abs(y) <= dim);
    }

    type()
    {
        return TOOL.MOVE;
    }
}