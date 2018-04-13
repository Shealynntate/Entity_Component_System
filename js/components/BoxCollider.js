// ---------------------------------------------------------------------------------------
//
//  Box Collider
//
//      - Contains 
//      - Detects 
// ---------------------------------------------------------------------------------------

// TODO: Hold normals for collisions

class BoxCollider extends Component
{
    constructor()
    {
        super();
        
        this.isTrigger = false;
        
        this.scale = new Vector2(1, 1);
        this.offset = new Vector2();
        this.normal0 = new Vector2(1, 0);
        this.normal1 = new Vector2(0, 1);
    }

    serialize()
    {
        var data =
        {
            "trigg"    : this.isTrigger,
            "sca_x"    : this.scale.x,
            "sca_y"    : this.scale.y,
            "off_x"    : this.offset.x,
            "off_y"    : this.offset.y,
            "norm_0_x" : this.normal0.x,
            "norm_0_y" : this.normal0.y,
            "norm_1_x" : this.normal1.x,
            "norm_1_y" : this.normal1.y
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
                case "trigg":
                    this.isTrigger = (p[1] == 'true');
                    break;
                case "sca_x": 
                    this.scale.x = Number(p[1]);
                    break;
                case "sca_y": 
                    this.scale.y = Number(p[1]);
                    break;
                case "off_x":
                    this.offset.x = Number(p[1]);
                    break;
                case "off_y": 
                    this.offset.y = Number(p[1]);
                    break;
                case "norm_0_x":
                    this.normal0.x = Number(p[1]);
                    break;
                case "norm_0_y":
                    this.normal0.y = Number(p[1]);
                    break;
                case "norm_1_x":
                    this.normal1.x = Number(p[1]);
                    break;
                case "norm_1_y":
                    this.normal1.y = Number(p[1]);
                    break;
            }
        });
    }

    duplicate()
    {
        var c = new BoxCollider();

        c.scale = this.scale.copy();
        c.offset = this.offset.copy();
        c.normal0 = this.normal0.copy();
        c.normal1 = this.normal1.copy();

        return c;
    }
}