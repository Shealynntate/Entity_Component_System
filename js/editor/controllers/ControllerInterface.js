
class ControllerInterface
{
    constructor()
    {
        this.types = 
        [
            CTYPE.TRANSFORM, 
            CTYPE.RIGIDBODY, 
            CTYPE.SPRITE, 
            CTYPE.BOX_COLLIDER, 
            CTYPE.USER_INPUT,
            CTYPE.RESPAWN, 
        ];

        this.scene_hierarchy_controller = new HierarchyController('scene-entity-hierarchy');
        this.controllers = 
        [
            new TransformController('transform-data-wrap'),
            new RigidBodyController('rigidbody-data-wrap'),
            new SpriteController('sprite-data-wrap'),
            new ColliderController('collider-data-wrap'),
            new UserInputController('user-input-data-wrap'),
            new RespawnController('respawn-data-wrap'),
        ];

        this.hookupInterface();
    }

    hookupInterface()
    {
        this.controllers.forEach(controller =>
        {
            controller.hookupFields();
        });

        this.scene_hierarchy_controller.hookupFields();
    }

    setFields(entity)
    {
        this.scene_hierarchy_controller.setFields(entity);

        for (var i = 0; i < this.types.length; ++i)
        {
            if (entity.hasComponent(this.types[i]))
            {
                this.controllers[i].show();
                this.controllers[i].setFields(entity.getComponent(this.types[i]));
            }
            else
            {
                this.controllers[i].hide();
            }
        }
    }

    clearFields()
    {
        this.controllers.forEach(controller =>
        {
            controller.clearFields();
        });

        this.scene_hierarchy_controller.clearFields();
    }

    removeEntity(entity)
    {
        this.scene_hierarchy_controller.removeElement(entity);
    }

    addEntity(entity)
    {
        this.scene_hierarchy_controller.addElement(entity);
    }
}