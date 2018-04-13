// ---------------------------------------------------------------------------------------
//
//  RigidBody
//
//      - Contains position, velocity, gravity scalar, and mass of Entity
//      - Overrides Transform.position
// ---------------------------------------------------------------------------------------

class RigidBody extends Component
{
    constructor()
    {
        super();
        
        this.applyGravity = false;
        this.gravityScalar = 1.0;
        
        this.invMass = 1.0;

        this.position = new Vector2();
        this.velocity = new Vector2();
    }

    get mass()
    {
        return 1.0 / this.invMass;
    }

    serialize()
    {
        var data =
        {
            "pos_x" : this.position.x,
            "pox_y" : this.position.y,
            "vel_x" : this.velocity.x,
            "vel_y" : this.velocity.y,
            "inv_m" : this.invMass,
            "g_sca" : this.gravityScalar,
            "g_app" : this.applyGravity,
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
                case "vel_x": 
                    this.velocity.x = Number(p[1]);
                    break;
                case "vel_y": 
                    this.velocity.y = Number(p[1]);
                    break;
                case "inv_m": 
                    this.invMass = Number(p[1]);
                    break;
                case "g_sca": 
                    this.gravityScalar = Number(p[1]);
                    break;
                case "g_app": 
                    this.applyGravity = (p[1] == 'true');
                    break;
            }
        });
    }

    duplicate()
    {
        var c = new RigidBody();
        
        c.applyGravity = this.applyGravity;
        c.gravityScalar = this.gravityScalar;
        
        c.invMass = this.invMass;

        c.position = this.position.copy();
        c.velocity = this.velocity.copy();

        return c;
    }
}