
var MOUSE_STATE =
{
    CLICK    : 0,  // Set only for first update() after clicking
    ACTIVE   : 1,  // Clicked and held down
    RELEASE  : 2,  // Set only for first update() after releasing 
    INACTIVE : 3,  // Not clicked
};

class Mouse
{
    constructor()
    {
        this._start = new Vector2(-9999, -9999);
        this._position = new Vector2(-9999, -9999);
        this._state = MOUSE_STATE.INACTIVE;

        this.listen();
    }

    listen()
    {
        var m = this;

        var content = document.getElementById('game-content');
        var palette = document.getElementById('colorPalette');

        content.addEventListener('mousedown', function () { m.input(event, 'click'); });
        content.addEventListener('mouseup', function () { m.input(event, 'release'); });
        content.addEventListener('mousemove', function () { m.input(event, 'move'); });
        
        palette.addEventListener('mousedown', function () { m.input(event, 'down'); });
    }

    input(event, status)
    {
        var h = event.currentTarget.height;
        h = (h != undefined) ? h : gameCanvases[CANVAS_TYPE.FOREGROUND].height;

        var scale = globalScale.scale;
        this._position.x = event.offsetX * scale;
        this._position.y = (h - event.offsetY) * scale;

        if (status == 'click')
        {
            this._start.x = this._position.x;
            this._start.y = this._position.y;
            
            this._state = MOUSE_STATE.CLICK;
        }
        else if (status == 'release')
        {
            this._state = MOUSE_STATE.RELEASE;
        }
        else if (status == 'move')
        {

        }
    }

    get state()
    {
        var s = this._state;

        if (this._state == MOUSE_STATE.CLICK)
            this._state = MOUSE_STATE.ACTIVE;
        else if (this._state == MOUSE_STATE.RELEASE)
            this._state = MOUSE_STATE.INACTIVE;
        
        return s;
    }

    get isActive()
    {
        return this._state == MOUSE_STATE.CLICK || this._state == MOUSE_STATE.ACTIVE;
    }

    get deltaPosition()
    {
        var delta = new Vector2();
        delta.x = this._position.x - this._start.x;
        delta.y = this._position.y - this._start.y;

        this._start.x = this._position.x;
        this._start.y = this._position.y;

        return delta;
    }

    update()
    {
        this._start = this._position.copy();
    }

    get position()
    {
        var offset = MainCamera.offset;

        return this._position.Sub(offset);
    }

    get start()
    {
        var offset = MainCamera.offset;

        return this._start.Sub(offset);
    }
}