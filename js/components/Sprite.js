
// ---------------------------------------------------------------------------------------
//
//  Sprite
//
//      - 
//      - 
//      - 
//
// ---------------------------------------------------------------------------------------

class Sprite extends Component
{
    constructor(canvas)
    {
        super();

        this.canvas = canvas;

        this.hasTexture = false;
        this._texture = null;
        this.tile = new Vector2(1, 1);
        this.offset = new Vector2(0, 0);
        this.material = null;
    }

    set texture(value)
    {
        this._texture = value;
        
        if (this._texture != null)
            this.hasTexture = true;
    }

    get texture()
    {
        return this._texture;
    }

    serialize()
    {
        var data =
        {
            "canvas" : null,  //this.canvas,
            "has_T"  : this.hasTexture,
            "tex"    : this._texture.id,
            "til_x"  : this.tile.x,
            "til_y"  : this.tile.y,
            "off_x"  : this.offset.x,
            "off_y"  : this.offset.y,
            "mat"    : this.material,
        }
        
        var result = "";

        for (var key in data)
            result += key + ':' + data[key] + ',';

        return result;
    }

    deserialize(data)
    {
        var properties = data.split(',');
        properties.forEach(property => 
        {
            var p = property.split(':');
            
            switch (p[0])
            {
                case "canvas":
                    //this.canvas = p[1];
                    break;
                case "has_T":
                    this.hasTexture = (p[1] == 'true');
                    break;
                case "tex": 
                    this._texture = document.getElementById(p[1]);
                    break;
                case "mat": 
                    this.material = p[1];
                    break;
                case "til_x":
                    this.tile.x = Number(p[1]);
                    break;
                case "til_y":
                    this.tile.y = Number(p[1]);
                    break;
                case "off_x":
                    this.offset.x = Number(p[1]);
                    break;
                case "off_y":
                    this.offset.y = Number(p[1]);
                    break;
            }
        });
    }

    duplicate()
    {
        var c = new Sprite(this.canvas);
        
        c.hasTexture = this.hasTexture;
        c._texture = this._texture;
        c.tile = this.tile.copy();
        c.offset = this.offset.copy();
        c.material = this.material;

        return c;
    }
}