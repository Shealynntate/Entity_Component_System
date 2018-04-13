
var TOOL =
{
    PAN    : 0,
    MOVE   : 1,
    ROTATE : 2,
    SCALE  : 3,
};

class ToolInterface
{
    constructor()
    {
        var canvas = gameCanvases[CANVAS_TYPE.FOREGROUND];

        this.buttons = [];
        
        var buttonItems = document.getElementById('transform-tool-buttons').children;
        for (var i = 0; i < buttonItems.length; ++i)
            this.buttons[i] = buttonItems[i];

        this.tools = 
        [
            new PanTool(canvas),
            new MoveTool(canvas),
            new RotateTool(canvas),
            new ScaleTool(canvas),
        ];

        this.setActiveTool(TOOL.PAN);
    }

    setActiveTool(tool)
    {
        ActiveTool = this.tools[tool];

        for (var i = 0; i < this.buttons.length; ++i)
        {
            if (i == tool)
                $(this.buttons[i]).addClass('active');
            else
                $(this.buttons[i]).removeClass('active');
        }

        if (tool == TOOL.PAN)
            $(document.getElementById('game-content')).addClass('pan-tool');
        else
            $(document.getElementById('game-content')).removeClass('pan-tool');
    }
}