// ---------------------------------------------------------------------------------------
//
//  Respawn
//
//      - Contains 
//      - Detects 
// ---------------------------------------------------------------------------------------

class Respawn extends Component
{
    constructor()
    {
        super();

        this.position = new Vector2(500, 500);
        this.rotation = new Vector2(1, 0);
        this.respawnOnDeath = true;

        this.image = document.getElementById('respawn_icon');
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

    serialize()
    {
        var data =
        {
            "on_death" : this.respawnOnDeath,
            "pos_x"    : this.position.x,
            "pos_y"    : this.position.y,
            "rot_x"    : this.rotation.x,
            "rot_y"    : this.rotation.y,
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
                case "on_death": 
                    this.respawnOnDeath = (p[1] == 'true');
                    break;
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
            }
        });
    }

    duplicate()
    {
        var c = new Respawn();
        
        c.position = this.position.copy();
        c.rotation = this.rotation.copy();
        c.respawnOnDeath = this.respawnOnDeath;
        c.image = this.image;

        return c;
    }
}