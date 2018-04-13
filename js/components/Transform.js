
// ---------------------------------------------------------------------------------------
//
//  Transform
//
//      - Contains dimensions and rotation of sprite
//      - Contains position if no rigidbody is attached
//      - All entites must have a transform
//
// ---------------------------------------------------------------------------------------
class Transform extends Component
{
    constructor()
    {
        super();

        this.position = new Vector2();
        this.rotation = new Vector2(1, 0);
        this.scale = new Vector2(0.8, 0.8);
    }

    get rotationInDegrees()
    {
        var theta = Math.atan2(this.rotation.y, this.rotation.x);
        
        return rad2Deg(theta);
    }

    set rotationInDegrees(theta)
    {
        theta *= Math.PI / 180.0;
        
        this.rotation.x = Math.cos(theta);
        this.rotation.y = Math.sin(theta);
    }

    get rotationInRadians()
    {
        return Math.atan2(this.rotation.y, this.rotation.x);
    }

    set rotationInRadians(theta)
    {
        this.rotation.x = Math.cos(theta);
        this.rotation.y = Math.sin(theta);
    }

    addRotationInRadians(theta)
    {
        var t = this.rotationInRadians + theta;

        this.rotation.x = Math.cos(t);
        this.rotation.y = Math.sin(t);
    }

    transformPoint(point)
    {
        // TODO: Use Matrix2 for rotation?
        
        // TODO: Need to separate primitive shapes for transform
        
        var p = point.Sub(this.position);
        
        var rotX = p.x * this.rotation.x - p.y * this.rotation.y;
        var rotY = p.x * this.rotation.y + p.y * this.rotation.x;

        return new Vector2(2 * rotX / this.scale.x, 2 * rotY / this.scale.y);
    }

    translatePoint(p)
    {
        return p.Sub(this.position);
    }

    invTranslatePoint(p)
    {
        return p.Add(this.position);
    }

    rotatePoint(p)
    {
        var rotX = p.x * this.rotation.x - p.y * this.rotation.y;
        var rotY = p.x * this.rotation.y + p.y * this.rotation.x;

        return new Vector2(rotX, rotY);
    }

    invRotatePoint(p)
    {
        var rotX = p.x * this.rotation.x + p.y * this.rotation.y;
        var rotY = -p.x * this.rotation.y + p.y * this.rotation.x;

        return new Vector2(rotX, rotY);
    }

    invTransformPoint(point)
    {
        var p = new Vector2(point.x * this.scale.x * 0.5, 
                            point.y * this.scale.y * 0.5);
        
        var rotX = p.x * this.rotation.x + p.y * this.rotation.y;
        var rotY = -p.x * this.rotation.y + p.y * this.rotation.x;

        p = new Vector2(rotX, rotY);

        return p.Add(this.position);
    }

    serialize()
    {
        var data =
        {
            "pos_x" : this.position.x,
            "pos_y" : this.position.y,
            "rot_x" : this.rotation.x,
            "rot_y" : this.rotation.y,
            "sca_x" : this.scale.x,
            "sca_y" : this.scale.y,
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
                case "pos_x":
                    this.position.x = Number(p[1]);
                    break;
                case "pos_y":
                    this.position.y = Number(p[1]);
                    break;
                case "rot_x": 
                    this.rotation.x = Number(p[1]);
                    break;
                case "rot_y": 
                    this.rotation.y = Number(p[1]);
                    break;
                case "sca_x": 
                    this.scale.x = Number(p[1]);
                    break;
                case "sca_y": 
                    this.scale.y = Number(p[1]);
                    break;
            }
        });
    }

    duplicate()
    {
        var t = new Transform();

        t.position = this.position.copy();
        t.rotation = this.rotation.copy();
        t.scale = this.scale.copy();

        return t;
    }
}