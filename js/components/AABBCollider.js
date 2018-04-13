// ---------------------------------------------------------------------------------------
//
//  Axis-Aligned Bounding Box Collider
//
//      - Contains 
//      - Detects 
// ---------------------------------------------------------------------------------------

class AABBCollider extends Component
{
    constructor()
    {
        super();
        
        this.scale = new Vector2(100, 100);
        this.offset = new Vector2();
    }

    serialize()
    {
        var data =
        {
            "sca_x" : this.scale.x,
            "sca_y" : this.scale.y,
            "off_x" : this.offset.x,
            "off_y" : this.offset.y 
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
            }
        });
    }

    duplicate()
    {
        var c = new AABBCollider();

        c.scale = this.scale.copy();
        c.offset = this.offset.copy();

        return c;
    }
}