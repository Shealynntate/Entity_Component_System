
var CTYPE = 
{
    TRANSFORM     : 1 << 0,
    RIGIDBODY     : 1 << 1,
    SPRITE        : 1 << 2,
    BOX_COLLIDER  : 1 << 3,
    USER_INPUT    : 1 << 4,
    AABB_COLLIDER : 1 << 5,
    RESPAWN       : 1 << 6,
};

class Component
{
    constructor()
    {
        this.entity = null;
    }

    init()
    {

    }

    serialize()
    {
        return "";
    }

    deserialize(data)
    {

    }

    duplicate()
    {
        return null;
    }
}

class Entity
{
    constructor()
    {
        this.alive = true;
        this.name = 'New Entity';

        this.components = [];
        this.componentOrder = [];
        this.componentBitset = 0;
    }

    isAlive()
    {
        return this.alive;
    }

    addComponent(type)
    {
        var component = null;

        switch (type)
        {
            case CTYPE.TRANSFORM:
                component = new Transform();
                break;
            case CTYPE.RIGIDBODY:
                component = new RigidBody();
                break;
            case CTYPE.SPRITE:
                // TODO: Pass in canvas
                component = new Sprite(gameCanvases[CANVAS_TYPE.FOREGROUND]);
                break;
            case CTYPE.BOX_COLLIDER:
                component = new BoxCollider();
                break;
            case CTYPE.USER_INPUT:
                component = new UserInput();
                UserInputActive = true;
                break;
            case CTYPE.AABB_COLLIDER:
                component = new AABBCollider();
                break;
            case CTYPE.RESPAWN:
                component = new Respawn();
        }

        if (component)
        {
            this.components.push(component);
            this.componentOrder.push(type);
            this.componentBitset |= type;
        }

        return component;
    }

    removeComponent(type)
    {
        if (!this.hasComponent(type)) return;

        var index = this.componentOrder.indexOf(type);
        this.components.splice(index, 1);
        this.componentOrder.splice(index, 1);
        this.componentBitset ^= type;

        if (type == CTYPE.USER_INPUT)
            UserInputActive = false;
    }

    hasComponent(type)
    {
        return (this.componentBitset & type) > 0;
    }

    partOfSystem(mask)
    {
        return (this.componentBitset & mask) == mask;
    }

    getComponent(type)
    {
        var index = this.componentOrder.findIndex(function(e) 
        {
            return e == type;
        });
        
        return (index >= 0) ? this.components[index] : null;
    }

    serialize()
    {
        var data = 'isAlive:' + this.alive +  ',name:' + this.name + '[';
        
        for (var i = 0; i < this.components.length; ++i)
            data += this.componentOrder[i] + '$' + this.components[i].serialize() + '|';

        return data;
    }

    deserialize(data)
    {
        var entity = this;

        var elements = data.split('[');
        var local = elements[0];
        var localData = local.split(',');
        
        // Setting local fields
        for (var i = 0; i < localData.length; ++i)
        {
            var fields = localData[i].split(':');
            switch (fields[0])
            {
                case 'isAlive':
                    entity.isAlive = (fields[1] == 'true');
                    break;
                case 'name':
                    entity.name = fields[1];
                    break;
            }
        }
        
        var comps = elements[1].split('|');

        // Setting component fields
        for (var i = 0; i < comps.length; ++i)
        {
            if (comps[i] != "")
            {
                var c = comps[i].split('$');
                var type = Number(c[0]);
                
                this.addComponent(type);
                this.components[i].deserialize(c[1]);
            }
        }

    }

    duplicate()
    {
        var e = new Entity();

        e.alive = this.alive;
        e.name = this.name;
        e.componentBitset = this.componentBitset;

        for (var i = 0; i < this.components.length; ++i)
        {
            // Only one User Input controlled entity allowed.
            if (this.componentOrder[i] != CTYPE.USER_INPUT)
            {
                e.componentOrder.push(this.componentOrder[i]);
                e.components.push(this.components[i].duplicate());
            }
            else
            {
                e.componentBitset ^= CTYPE.USER_INPUT; 
            }
        }


        return e;
    }

    destroy()
    {
        this.componentOrder.forEach(type =>
        {
            this.removeComponent(type);
        });
    }
}

class System
{
    constructor(manager)
    {
        this.manager = manager;
        this.BIT_MASK = 0;
    }

    update()
    {
       
    }
}

class ECSManager
{
    constructor()
    {
        this.entities = [];
        this.systems = [];
        
        this.systems.push(new EditorMovementSystem(this));
        this.systems.push(new MovementSystem(this));
        this.systems.push(new CollisionSystem(this));
        this.systems.push(new SpriteRenderSystem(this));
        this.systems.push(new HealthSystem(this));
    }

    update()
    {
        this.systems.forEach(function (system)
        {
            system.update();
        });
    }

    addEntity()
    {
        var entity = new Entity();
        
        // All entites have Transform by default
        entity.addComponent(CTYPE.TRANSFORM);

        this.entities.push(entity);
        
        return entity;
    }

    removeEntity(entity)
    {
        entity.destroy();
        var i = this.entities.indexOf(entity);
        this.entities.splice(i, 1);
    }

    duplicateEntity(entity)
    {
        var e = entity.duplicate();
        this.entities.push(e);

        return e;
    }

    serialize()
    {
        var data = '';
        
        for (var i = 0; i < this.entities.length; ++i)
            data += this.entities[i].serialize() + '{';
        
        return data;
    }

    deserialize(data)
    {
        var elements = data.split('{');
    
        for (var i = 0; i < elements.length; ++i)
        {
            if (elements[i] != '')
            {
                var entity = new Entity();
                
                entity.deserialize(elements[i]);
                
                this.entities.push(entity);
            }
        }
    }
}