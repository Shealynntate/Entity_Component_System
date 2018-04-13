
// ---------------------------------------------------------------------------------------
//
//  User Input
//
//      - Just on the Player Entity for now
//      - Indicates move set of Entity
//      - 
//
// ---------------------------------------------------------------------------------------
class UserInput extends Component
{
    constructor()
    {
        super();

        this.canJump = true;
        this.canMove = true;
        this.moveSpeed = 0.2;
        this.jumpHeight = 7;
        
        this.inAir = false;
        this.jumpCooldown = 40;
        this.cooldown = this.jumpCooldown;
    }

    serialize()
    {
        var data =
        {
            "can_J"  : this.canJump,
            "can_M"  : this.canMove,
            "in_Ar"  : this.inAir,
            "speed"  : this.moveSpeed,
            "height" : this.jumpHeight,
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
                case "can_J":
                    this.canJump = (p[1] == 'true');
                    break;
                case "can_M":
                    this.canMove = (p[1] == 'true');
                    break;
                case "in_Ar": 
                    this.inAir = (p[1] == 'true');
                    break;
                case "speed":
                    this.moveSpeed = Number(p[1]);
                    break;
                case "height":
                    this.jumpHeight = Number(p[1]);
                    break;
            }
        });
    }

    duplicate()
    {
        var c = new UserInput();
        
        c.canJump = this.canJump;
        c.canMove = this.canMove;
        c.moveSpeed = this.moveSpeed;
        c.jumpHeight = this.jumpHeight;
        
        c.inAir = this.inAir;
        c.jumpCooldown = this.jumpCooldown;
        c.cooldown = 0;

        return c;
    }
}