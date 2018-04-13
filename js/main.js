// ---------------------------------------------------------------------------------------
//
// Global Constants and Variables
//
// ---------------------------------------------------------------------------------------

var Manager;
var GameTime;
var Editor;

var ActiveTool = null;
var ActiveEntity = null;

var UserInputActive = true;
var EditorMouse = null;

//  Canvases
var CANVAS_TYPE = 
{ 
    BACKGROUND : 0,
    MIDGROUND  : 1,
    FOREGROUND : 2,

    PALETTE    : 0,
};

var gameCanvases = [];
var editorCanvases = [];

// Game Mode
var MODE = 
{
    'EDITOR' : 0, 
    'LIVE' : 1
};

var mode = MODE.EDITOR;

// Cameras
var LiveCamera;
var EditorCamera;
var MainCamera;

var globalScale;
var DeathLine = -5;

function levelHandler(name) 
{
  level = createLevel(name, player);
}

//TODO : Make this set-able in Editor
var canvasBackground = '#6995F8';
var mustardColor = '#c0a062';
var blueColor = '#4f9a96';

var urlMediaBase = "http://www.shealyntate.com/wp-content/uploads/2018/WebPlatformer/media/";

// ---------------------------------------------------------------------------------------
//
//  Window Callback Functions
//
// ---------------------------------------------------------------------------------------

window.onload = function()
{
    awake();
};

window.onresize = resizeCanvases;

// ---------------------------------------------------------------------------------------
//
//  Initialization
//
// ---------------------------------------------------------------------------------------
function awake()
{
     // Note: Order added matters!
     gameCanvases.push(new Canvas('backgroundCanvas'));
     gameCanvases.push(new Canvas('midgroundCanvas'));
     gameCanvases.push(new Canvas('foregroundCanvas'));
     editorCanvases.push(new Canvas('colorPalette'));
 
     document.getElementById('backgroundCanvas').style.backgroundColor = canvasBackground;
 
     globalScale = new GlobalScale();
     resizeCanvases();

     Manager = new ECSManager();
     GameTime = new Timer();

     loadLevelData();
}

function init(data)
{
    Manager.deserialize(data);

    LiveCamera = new ObjectCamera(Manager.entities[0], gameCanvases[gameCanvases.length - 1]);
    EditorCamera = new SceneCamera(Manager.entities[0], gameCanvases[gameCanvases.length - 1]);
    MainCamera = EditorCamera;
    
    EditorMouse = new Mouse();
    Editor = new EditorInterface();
    Editor.clearFields();

    graphicsLoop();
}

function resizeCanvases()
{
    var style = window.getComputedStyle(document.getElementById('game-content'));

    var w = parseFloat(style.getPropertyValue('width'));
    var h = parseFloat(style.getPropertyValue('height'));

    globalScale.windowWidth = w;
    
    gameCanvases.forEach(function(canvas) { canvas.resize(w, h); });
    
    var palette = editorCanvases[CANVAS_TYPE.PALETTE];
    editorCanvases.forEach(function(canvas) 
    { 
        if (canvas != palette)    
            canvas.resize(w, h); 
    });
}

// ---------------------------------------------------------------------------------------
//
//  Main Loop
//
// ---------------------------------------------------------------------------------------
function graphicsLoop()
{
    var animationID = window.requestAnimationFrame(graphicsLoop);
    
    // Start loop if enough time has passed
    if (!GameTime.startFrame()) return;

    // Clear Canvases for next blit
    gameCanvases.forEach(function (canvas) { canvas.clear(); });
    
    if (mode == MODE.EDITOR)
    {
        editorCanvases.forEach(function (canvas) { canvas.clear(); });
    }
    
    MainCamera.update();

    // Entity Component System
    Manager.update();

    if (mode === MODE.EDITOR)
    {
        ActiveTool.update();
    }

    GameTime.endFrame();
}


