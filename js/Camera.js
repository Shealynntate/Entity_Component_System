
// Note: Only Mouse.js and Canvas.js apply camera offset. Rest of classes operate in world space.

class ObjectCamera 
{
    constructor(player, _canvas)
    {
        this.playerTransform = player.getComponent(CTYPE.TRANSFORM);
        this.canvas = _canvas;

        this.offset = new Vector2();

        this.resize();
    }

    update()
    {
        var p = this.playerTransform.position.Add(this.offset);

        if (p.x < this.min_x)
        {
            this.offset.x += (this.min_x - p.x);
        }
        else if (p.x > this.max_x)
        {
            this.offset.x += (this.max_x - p.x);
        }

        if (p.y < this.min_y)
        {
            this.offset.y += (this.min_y - p.y);
        }
        else if (p.y > this.max_y)
        {
            this.offset.y += (this.max_y - p.y);
        }
    }

    resize()
    {
        var s = globalScale.scale;

        var w = this.canvas.width * s;
        var h = this.canvas.height * s;

        this.min_x = w / 3.0;
        this.min_y = h / 3.0;
        this.max_x = 2 * w / 3.0;
        this.max_y = 2 * h / 3.0;
    }
}

class SceneCamera
{
    constructor(_canvases)
    {
        this.canvases = _canvases;

        this.offset = new Vector2();

        this.resize();
    }

    update()
    {
        // var p = this.playerTransform.position.Add(this.offset);

        // if (p.x < this.min_x)
        // {
        //     this.offset.x += Math.min(this.min_x - p.x, this.delta);
        // }
        // else if (p.x > this.max_x)
        // {
        //     this.offset.x += Math.max(this.max_x - p.x, -this.delta);
        // }

        // if (p.y < this.min_y)
        // {
        //     this.offset.y += Math.min(this.min_y - p.y, this.delta);
        // }
        // else if (p.y > this.max_y)
        // {
        //     this.offset.y += Math.max(this.max_y - p.y, -this.delta);
        // }
    }

    resize()
    {
        // var w = this.canvases[0].width;
        // var h = this.canvases[0].height;

        // this.min_x = w / 4.0;
        // this.min_y = h / 4.0;
        // this.max_x = 3 * w / 4.0;
        // this.max_y = 3 * h / 4.0;
    }
}