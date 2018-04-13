
class EditorMovementSystem extends System
{
    constructor(manager)
    {
        super(manager);

        this.BIT_MASK = (CTYPE.TRANSFORM);

        this.keys = 
        {
            'Q'     : false,
            'W'     : false,
            'E'     : false,
            'R'     : false,
            'D'     : false,
            ' '     : false,
            'PLUS'  : false,
            'MINUS' : false,
            'DELTE' : false,
        };
        
        this.selectedEntity = null;

        this.listenForInput();
    }

    update()
    {
        var system = this;
        
        if (mode != MODE.EDITOR) return;

        // Handle mouse inputs
        if (EditorMouse.isActive)
        {
            // On click event, set active entity to whatever we clicked on/off
            if (EditorMouse.state == MOUSE_STATE.CLICK)
            {
                // Check to see if user clicked on Editor Tool collider
                if (ActiveEntity == null || !ActiveTool.collisionCheck(ActiveEntity.getComponent(CTYPE.TRANSFORM)))
                {
                    if (ActiveTool.type() == TOOL.PAN) return;

                    system.selectedEntity = null;

                    this.manager.entities.some(function (entity)
                    {
                        var transform = entity.getComponent(CTYPE.TRANSFORM);

                        if (system.detectPointCollision(transform))
                        {
                            system.selectedEntity = entity;
                            return true;
                        }
                    });
                }
            }   
            
            if (system.selectedEntity)
            {
                // TODO: Change to central "update all editor windows/html stuff" call
                Editor.setFields(system.selectedEntity);
            }
            else
            {
                // TODO: Change to central "clear all editor window/html stuff" call 
                Editor.clearFields();
            }

            ActiveEntity = system.selectedEntity;
        }

        // Handle keyboard inputs
        for (var k in system.keys)
        {
            if (system.keys[k])
            {
                switch(k)
                {
                    case 'Q':
                        Editor.setActiveTool(TOOL.PAN);
                        break;
                    case 'W':
                        Editor.setActiveTool(TOOL.MOVE);
                        break;
                    case 'E':
                        Editor.setActiveTool(TOOL.ROTATE);
                        break;
                    case 'R':
                        Editor.setActiveTool(TOOL.SCALE);
                        break;
                }
            }

        }
    }

    listenForInput()
    {
        var system = this;
        
        document.addEventListener('keydown', function () { system.keyboardInput(event, 'keydown'); });
        document.addEventListener('keyup', function () { system.keyboardInput(event, 'keyup'); });
        document.addEventListener('keypress', function () { system.keyboardInput(event, 'keydown'); });
    }

    keyboardInput(event, keyStatus)
    {
        var key = String.fromCharCode(event.keyCode);

        if (event.keyCode === 187) key = 'PLUS';
        if (event.keyCode === 189) key = 'MINUS';
        if (event.keyCode === 46 || event.keyCode === 8) key = 'DELETE';

        // Only record input on valid keys
        for (var k in this.keys)
        {
            if (k == key)
                this.keys[key] = keyStatus === 'keydown';
        }
    }

    detectPointCollision(transform)
    {
        var p = transform.transformPoint(EditorMouse.position);
        
        return  (Math.abs(p.x) < 1 && Math.abs(p.y) < 1);
    }
}