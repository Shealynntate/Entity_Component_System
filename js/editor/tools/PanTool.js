
class PanTool extends Tool
{
    constructor(canvas)
    {
        super(canvas);
    }

    update()
    {
        if (EditorMouse.isActive)
        {
            var delta = EditorMouse.deltaPosition;
            MainCamera.offset.x += delta.x;
            MainCamera.offset.y += delta.y;
        }
    }

    collisionCheck(transform)
    {
        return true;
    }

    type()
    {
        return TOOL.PAN;
    }
}