
class Timer
{
    constructor()
    {
        this.targetFrameRate = 0.016;
        
        this.deltaTime = 0;
        
        this.prevFrameTime = Date.now();
        this.currentFrameTime = this.prevFrameTime;

        this.display = document.getElementById('fps-wrap').children[0];
        this.displayCount = 0;
        this.fps = 0;
    }

    //TODO: Get timing metric from request animation frame...
    startFrame()
    {
        this.currentFrameTime = Date.now();

        this.deltaTime += (this.currentFrameTime - this.prevFrameTime) / 1000.0;

        if (this.deltaTime < this.targetFrameRate)
        {
            this.prevFrameTime = this.currentFrameTime;
            return false;
        }

        return true;
    }

    endFrame()
    {
        this.fps += this.deltaTime;
        
        // TODO: Move into display controller
        if (mode == MODE.LIVE)
        {
            this.displayCount++;
            if (this.displayCount == 30)
            {
                this.display.textContent = "FPS: " + (30.0 / this.fps).toFixed(1);
                this.displayCount = 0;
                this.fps = 0;
            }
        }

        this.prevFrameTime = this.currentFrameTime;
        this.deltaTime = 0;

    }
}

/*
var fpsFrameCount = 0;
var fps = 0;

// Display FPS in corner - updates every 10 frames
fpsFrameCount++;

if (fpsFrameCount == 10)
{
    fps = (1.0 / deltaTime).toFixed(1);
    fpsFrameCount = 0;
}

var pos = new Vector2(30, 860);
foregroundCTX.save();
foregroundCTX.globalAlpha = 1;
foregroundCTX.fillStyle = '#4f9a96';
foregroundCTX.font = '16px Oxygen Mono';
foregroundCTX.fillText('FPS: ' + fps, pos.x, foregroundCTX.canvas.height - pos.y);
foregroundCTX.restore();
*/