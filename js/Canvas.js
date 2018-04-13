
class Canvas
{
    constructor(id)
    {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
    }

    clear()
    {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    resize(w, h)
    {
        this.canvas.width = w;
        this.canvas.height = h;
        
        this.canvas.style.width = w.toString() + 'px';
        this.canvas.style.height = h.toString() + 'px';
    }

    invert(y)
    {
        return (this.canvas.height * globalScale.scale) - y;
    }

    get height()
    {
        return this.canvas.height;
    }

    get width()
    {
        return this.canvas.width;
    }

    start()
    {
        this.ctx.save();
    }

    end()
    {
        this.ctx.restore();
    }

    // Wrapper functions around ctx draw functions to apply PPM scale
    moveTo(x, y)
    {
        var scale = globalScale.invScale;
        this.ctx.moveTo(scale * x, scale * y);
    }

    lineTo(x, y)
    {
        var scale = globalScale.invScale;
        this.ctx.lineTo(scale * x, scale * y);
    }

    strokeRect(x, y, w, h)
    {
        var scale = globalScale.invScale;
        this.ctx.strokeRect(scale * x, scale * y, scale * w, scale * h);
    }

    fillRect(x, y, w, h)
    {
        var scale = globalScale.invScale;
        this.ctx.fillRect(scale * x, scale * y, scale * w, scale * h);
    }

    arc(x, y, r, s, e)
    {
        var scale = globalScale.invScale;
        this.ctx.arc(scale * x, scale * y, scale * r, s, e);
    }

    translate(x, y)
    {
        var scale = globalScale.invScale;
        this.ctx.translate(scale * x, scale * y);
    }

    drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    {
        var scale = globalScale.invScale;

        this.ctx.drawImage(
            image,
            sx, sy, 
            sWidth, sHeight,
            scale * dx, scale * dy, 
            scale * dWidth, scale * dHeight
        );
    }

    drawLine(sX, sY, eX, eY, width, color)
    {
        var offset = MainCamera.offset;

        this.ctx.beginPath();

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;

        this.moveTo(sX + offset.x, this.invert(sY + offset.y));
        this.lineTo(eX + offset.x, this.invert(eY + offset.y));

        this.ctx.stroke();
    }

    // Take in center and dimensions of box
    drawRectOutline(x, y, w, h, width, color)
    {
        var offset = MainCamera.offset;

        x -= w / 2.0;
        y += h / 2.0;

        this.ctx.lineWidth = width;
        this.ctx.strokeStyle = color;

        this.strokeRect(x + offset.x, this.invert(y + offset.y), w, h);
    }

    drawRectFilled(x, y, w, h, color)
    {
        var offset = MainCamera.offset;

        x -= w / 2.0;
        y += h / 2.0;
        
        this.ctx.fillStyle = color;
        this.fillRect(x + offset.x, this.invert(y + offset.y), w, h);
    }

    // Given bottom-center point of triangle
    drawTriangeOutline(x, y, b, h, color)
    {
        var offset = MainCamera.offset;

        var inv_y = this.invert(y + offset.y);
        
        this.ctx.strokeStyle = color;

        this.ctx.beginPath();
        this.moveTo(x + offset.x - b / 2.0, inv_y);
        this.lineTo(x + offset.x + b / 2.0, inv_y);
        this.lineTo(x + offset.x, this.invert(y + offset.y + h));
        this.lineTo(x + offset.x - b / 2.0, inv_y);
        this.ctx.stroke();
    }

    drawTriangeFilled(x, y, b, h, color)
    {
        var offset = MainCamera.offset;

        var inv_y = this.invert(y + offset.y);
        
        this.ctx.fillStyle = color;

        this.ctx.beginPath();
        this.moveTo(x + offset.x - b / 2.0, inv_y);
        this.lineTo(x + offset.x + b / 2.0, inv_y);
        this.lineTo(x + offset.x, this.invert(y + offset.y + h));
        this.lineTo(x + offset.x - b / 2.0, inv_y);
        this.ctx.fill();
    }

    drawCircle(x, y, radius, width, color)
    {
        var offset = MainCamera.offset;

        this.ctx.lineWidth = width;
        this.ctx.strokeStyle = color;

        this.ctx.beginPath();
        this.arc(x + offset.x, this.invert(y + offset.y), radius, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    // TODO: Add offset values
    drawTexture(start, width, height, tile, offset, texture)
    {
        var cameraOffset = MainCamera.offset;

        var position = start.Add(cameraOffset);
        var unitW = width / tile.x;
        var unitH = height / tile.y;

        var w = 0;

        var imageWidth = texture.width;
        var imageHeight = texture.height;

        while (w < width)
        {
            var scaleW = Math.min(1.0, Math.abs((w - width) / unitW));
            position.y = start.y + cameraOffset.y;
            var h = 0;

            while (h < height)
            {
                var scaleH = Math.min(1.0, Math.abs((h - height) / unitH));

                this.drawImage(
                    texture,
                    0, 0, imageWidth * scaleW, imageHeight * scaleH,  // Source Image
                    position.x, this.invert(position.y), unitW * scaleW, unitH * scaleH  // Dest Canvas
                );

                position.y -= unitH * scaleH;
                h = Math.min(height, h + unitH * scaleH);
            }

            position.x += unitW * scaleW;
            w = Math.min(width, w + unitW * scaleW);
        }
    }

    transform(position, rotation)
    {
        var offset = MainCamera.offset;

        var y = this.invert(position.y + offset.y);
        var x = position.x + offset.x;

        this.translate(x, y);
        this.ctx.rotate(rotation);
        this.translate(-x, -y);
    }
}