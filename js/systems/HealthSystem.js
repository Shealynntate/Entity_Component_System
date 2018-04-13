
class HealthSystem extends System
{
    constructor(manager)
    {
        super(manager);

        this.BIT_MASK = (CTYPE.TRANSFORM | CTYPE.RESPAWN);

        this.deathLine = -10;
    }

    update()
    {
        if (mode == MODE.EDITOR) return;

        var system = this;

        // TODO: Handle health management here.
        this.manager.entities.forEach(function (entity)
        {
            if (entity.partOfSystem(system.BIT_MASK))
            {
                var transform = entity.getComponent(CTYPE.TRANSFORM);
                var respawn = entity.getComponent(CTYPE.RESPAWN);

                if (transform.position.y < system.deathLine)
                {
                    // Trigger respawn notification / animation.
                    transform.position = respawn.position.copy();
                    transform.rotation = respawn.rotation.copy();

                    if (entity.hasComponent(CTYPE.RIGIDBODY))
                    {
                        var rb = entity.getComponent(CTYPE.RIGIDBODY);
                        rb.position = transform.position.copy();
                        rb.velocity = new Vector2();
                    }

                }
            }
        });
    }
}