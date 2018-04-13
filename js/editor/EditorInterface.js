
class EditorInterface
{
    constructor()
    {
        this.types = 
        [
            CTYPE.TRANSFORM, 
            CTYPE.RIGIDBODY, 
            CTYPE.SPRITE, 
            CTYPE.BOX_COLLIDER, 
            CTYPE.USER_INPUT,
            CTYPE.RESPAWN, 
        ];

        this.editModeElements = [];
        this.liveModeElements = [];
        
        this.toolInterface = new ToolInterface();
        this.controllerInterface = new ControllerInterface();
        this.panelInterface = new PanelInterface();

        this.editModeElements.push(document.getElementById('save-wrap'));
        this.editModeElements.push(document.getElementById('tool-wrap'));
        this.liveModeElements.push(document.getElementById('fps-wrap'));

        this.AddComponentWindow = document.getElementById('add-component-window');
        this.componentWindows = 
        [
            null,                                               // placeholder
            document.getElementById('add-component-rigidbody'),
            document.getElementById('add-component-sprite'),
            document.getElementById('add-component-collider'),
            document.getElementById('add-component-user-input'),
            document.getElementById('add-component-respawn'),
        ];

        this.SelectTextureWindow = document.getElementById('texture-select-window');
    }

    setFields(entity)
    {
        this.controllerInterface.setFields(entity);

        // Other interface updating
        if (!$(this.AddComponentWindow).hasClass('hidden'))
        {
            // If the Add Component Window is showing, must update it for current Entity
            this.updateAddComponentWindow();
        }

        if (!entity.hasComponent(CTYPE.SPRITE))
        {
            $(this.SelectTextureWindow).addClass('hidden');
        }
    }
    
    updateAddComponentWindow()
    {
        // Only show components the Entity doesn't already have
        for (var i = 1; i < this.componentWindows.length; ++i)
        {
            if (ActiveEntity.hasComponent(this.types[i]))
                $(this.componentWindows[i]).addClass('hidden');
            else
                $(this.componentWindows[i]).removeClass('hidden');
            
            if (this.types[i] == CTYPE.USER_INPUT && UserInputActive)
                $(this.componentWindows[i]).addClass('hidden');
        }
    }

    clearFields()
    {
        this.controllerInterface.clearFields();

        // Other interface updating
        $(this.AddComponentWindow).addClass('hidden');
        $(this.SelectTextureWindow).addClass('hidden');
    }

    switchModes(button)
    {
        editorCanvases.forEach(function (canvas) { canvas.clear(); });
        
        if (mode == MODE.EDITOR)
        {
            mode = MODE.LIVE;
            button.src = 'media/icons/pause_icon.png';
            this.editModeElements.forEach(element =>
            {
                $(element).addClass('hidden');
            });
            this.liveModeElements.forEach(element =>
            {
                $(element).removeClass('hidden');
            });

            MainCamera = LiveCamera;
        }
        else
        {
            mode = MODE.EDITOR;
            button.src = 'media/icons/play_icon.png';
            this.editModeElements.forEach(element =>
            {
                $(element).removeClass('hidden');
            });
            this.liveModeElements.forEach(element =>
            {
                $(element).addClass('hidden');
            });

            MainCamera = EditorCamera;
        }
    }

    setActiveTool(tool)
    {
        this.toolInterface.setActiveTool(tool);
    }

    selectTexture(img)
    {
        var sprite = ActiveEntity.getComponent(CTYPE.SPRITE);
        sprite.texture = img;
    }

    addEntity(entity)
    {
        this.controllerInterface.addEntity(entity);
    }

    removeEntity(entity)
    {
        this.controllerInterface.removeEntity(entity);
    }

    setActivePanel(target)
    {
        this.panelInterface.setActivePanel(target);
    }
}

// ---------------------------------------------------------------------------------------

function toggleAddComponentWindow()
{
    if (ActiveEntity == null) return;

    $(Editor.AddComponentWindow).toggleClass('hidden');
    
   Editor.updateAddComponentWindow();
}

function toggleSelectTextureWindow()
{
    if (ActiveEntity == null) return;

    $(Editor.SelectTextureWindow).toggleClass('hidden');
}

// User adding new component to selected Entity
function addComponent(type)
{
    if (ActiveEntity == null) return;

    if (type == CTYPE.BOX_COLLIDER)
        ActiveEntity.addComponent(CTYPE.AABB_COLLIDER);

    ActiveEntity.addComponent(type);
    
    toggleAddComponentWindow();
    
    Editor.setFields(ActiveEntity);
}

// User removing component via minus button in inspector
function removeComponent(type)
{
    if (ActiveEntity == null) return;

    if (type == CTYPE.BOX_COLLIDER)
        ActiveEntity.removeComponent(CTYPE.AABB_COLLIDER);

    ActiveEntity.removeComponent(type);

    Editor.setFields(ActiveEntity);
}

// -----------------------------------------------------------------------------
//
// Save & Load
//
// -----------------------------------------------------------------------------
function loadLevelData()
{
    var data = localStorage.getItem('gameData');
    
    if (data == null || data == '')
    {
        data = levelData;
    }   

    init(data);
    
/*
    var save_url = '../media/gameData.dat'; 
    
    $.ajax(
    { 
        url     : save_url,
        contentType: 'text/plain',
        type: 'GET',
        headers: { 'x-my-custom-header': 'https' },
        error   : function(response, status, xhr) 
        { 
            console.log('Error: ' + response);
        },
        success : function(data) 
        {
            init(data);
        }
    });
    */
}

function saveLevelData()
{
    var ecs_data = Manager.serialize();

    localStorage.setItem('gameData', ecs_data);
    
    /*
    $.ajax(
    { 
        type: 'POST',
        dataType: 'text',
        url:   '../gameFileHandler.php',
        data:  'content=' + ecs_data,
        error: function(response, status, xhr) 
        {
            console('Error: ' + response);
        },
        success: function(response, status, xhr) 
        { 
            //console.log('Success: ' + response);
        }
    });
    */
}

// -----------------------------------------------------------------------------
//
// Add, Delete, & Duplicate Entity
//
// -----------------------------------------------------------------------------
function addEntity()
{
    var entity = Manager.addEntity();

    Editor.addEntity(entity);

    // TODO: Have a defaults for editor?
    var transform = entity.getComponent(CTYPE.TRANSFORM);
    transform.position = new Vector2(200, 200);

    var renderer = entity.addComponent(CTYPE.SPRITE);
    renderer.texture = document.getElementById('grassTile_01');
}

function deleteEntity()
{
    if (ActiveEntity == null) return;

    Editor.removeEntity(ActiveEntity);
    Manager.removeEntity(ActiveEntity);

    ActiveEntity = null;
}

function duplicateEntity()
{
    if (ActiveEntity == null) return;

    var entity = Manager.duplicateEntity(ActiveEntity);
    Editor.addEntity(entity);
}

// Handles Pixels Per Meter scaling and shrinking window scaling.
class GlobalScale
{
    constructor()
    {
        this.ppm = 100;
        this.width = 1;
    }

    set pixelsPerMeter(value)
    {
        this.ppm = value;
    }

    get pixelsPerMeter()
    {
        return this.ppm;
    }

    set windowWidth(value)
    {
        this.width = value / 1500;
    }

    get scale()
    {
        return 1.0 / (this.ppm * this.width);
    }

    get invScale()
    {
        return this.ppm * this.width;
    }
}