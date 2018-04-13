
class MovementSystem extends System
{
    constructor(manager)
    {
        super(manager);

        this.BIT_MASK = (CTYPE.TRANSFORM | CTYPE.RIGIDBODY);
        this.GRAVITY = -9.8;

        this.keys = 
        {
            'W' : false,
            'A' : false,
            'S' : false,
            'D' : false,
            ' ' : false,
        };

        this.listenForInput();
    }

    update()
    {
        var system = this;
        
        this.manager.entities.forEach(function (entity)
        {
            if (entity.partOfSystem(system.BIT_MASK))
            {
                var transform = entity.getComponent(CTYPE.TRANSFORM);
                var rigidBody = entity.getComponent(CTYPE.RIGIDBODY);
                
                if (mode == MODE.EDITOR)
                {
                    // Sync's positions if user altered transform in Editor.
                    rigidBody.position = transform.position.copy();
                    return;
                }

                var invMass = rigidBody.invMass;
                var force = new Vector2();

                if (entity.hasComponent(CTYPE.USER_INPUT))
                {
                    var input = entity.getComponent(CTYPE.USER_INPUT);

                    if (system.keys['D'] && input.canMove)
                    {
                        if (input.inAir)
                            rigidBody.velocity.x += input.moveSpeed * 0.2;
                        else
                            rigidBody.velocity.x += input.moveSpeed;
                    }
                    if (system.keys['A'] && input.canMove)
                    {
                        if (input.inAir)
                            rigidBody.velocity.x += -input.moveSpeed * 0.2;
                        else
                            rigidBody.velocity.x += -input.moveSpeed;
                    }
                    if (system.keys[' '])
                    {
                        if (input.canJump && !input.inAir && input.cooldown == 0)
                        {
                            rigidBody.velocity.y += input.jumpHeight;
                            input.inAir = true;
                            input.cooldown = input.jumpCooldown;
                        }
                    }
                    input.cooldown = Math.max(input.cooldown - 1, 0);
                }

                if (rigidBody.applyGravity)
                {
                    var scalar = rigidBody.gravityScalar;
                    var grav = new Vector2(0, scalar * system.GRAVITY);

                    force.add(grav);
                }
                // TODO: Look into using Velocity Verlet integration for stability
                force.mult(invMass);
                rigidBody.velocity.add(force.Mult(GameTime.deltaTime));
                rigidBody.position.add(rigidBody.velocity.Mult(GameTime.deltaTime));
                
                // TODO: Make this better:
                rigidBody.velocity.x = clamp(4, -4, rigidBody.velocity.x);
                rigidBody.velocity.y = clamp(4, -4, rigidBody.velocity.y);
                
                // Keep Transform position up to date with rigidbody
                transform.position = rigidBody.position.copy();
            }
        });
    }

    listenForInput()
    {
        var system = this;

        document.addEventListener('keydown', function () { system.keyboardInput(event, 'keydown'); });
        document.addEventListener('keyup', function () { system.keyboardInput(event, 'keyup'); });
        document.addEventListener('keypress', function () { system.keyboardInput(event, 'keydown'); });
    }

    keyboardInput(event, keyStatus)
    {
        var key = String.fromCharCode(event.keyCode);
        
        if (key == 'W' || key == 'A' || key == 'S' || key == 'D' || key == ' ')
        {
            this.keys[key] = keyStatus === 'keydown';
            
            // Stop spacebar from auto-scrolling window
            if (key == ' ')
                event.preventDefault();
        }
    }
}