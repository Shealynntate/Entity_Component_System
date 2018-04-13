
class CollisionSystem extends System
{
    constructor(manager)
    {
        super(manager);

        this.BIT_MASK = (CTYPE.TRANSFORM | CTYPE.AABB_COLLIDER);
        this.GRAVITY = -9.8;
    }  

    update()
    {
        if (mode == MODE.EDITOR) return;
        
        var entities = this.manager.entities;

        for (var i = 0; i < entities.length - 1; ++i)
        {
            var entityA = entities[i];

            if (entityA.partOfSystem(this.BIT_MASK))
            {
                var transformA = entityA.getComponent(CTYPE.TRANSFORM);
                var colliderA = entityA.getComponent(CTYPE.AABB_COLLIDER);

                for (var j = i + 1; j < entities.length; ++j)
                {
                    var entityB = entities[j];
                    
                    if (entityB.partOfSystem(this.BIT_MASK))
                    {
                        var transformB = entityB.getComponent(CTYPE.TRANSFORM);
                        var colliderB = entityB.getComponent(CTYPE.AABB_COLLIDER);
                        
                        // Initial Check: are AABB colliding?
                        if (this.AABBCollision(transformA, colliderA, transformB, colliderB))
                        {
                            this.fineGrainCollision(entityA, transformA, colliderA, entityB, transformB, colliderB);
                        }
                    }       
                }
            }
        }
    }

    fineGrainCollision(entityA, transformA, colliderA, entityB, transformB, colliderB)
    {
        // TODO: Perform collision based on two types of colliders involved.
        //       Currently assuming both are BOX_COLLIDER's
        
        var collisionData = this.BoxColliderCollision(entityA, transformA, entityB, transformB);
        
        if (!collisionData) return;
        
        // Check if either has a rigidbody
        if (entityA.hasComponent(CTYPE.RIGIDBODY) && entityB.hasComponent(CTYPE.RIGIDBODY))
        {
            var rbA = entityA.getComponent(CTYPE.RIGIDBODY);
            var rbB = entityB.getComponent(CTYPE.RIGIDBODY);

            var massA = rbA.mass;
            var massB = rbB.mass;
            var totalMass = massA + massB;

            var velocityA = rbA.velocity.Mult((massA - massB) / totalMass);
            velocityA.add(rbB.velocity.Mult(2 * massB / totalMass));
            
            var velocityB = rbA.velocity.Mult(2 * massA / totalMass);
            velocityB.add(rbB.velocity.Mult((massB - massA) / totalMass));

            var depth = collisionData[0];
            var axis = collisionData[1];

            // TODO: Figure out which direction each RB moves along axis.
            this.resolveCollision(rbA, transformA, depth, axis);
            this.resolveCollision(rbB, transformB, -depth, axis);
            rbA.velocity = velocityA;
            rbB.velocity = velocityB;
        }
        else if (entityA.hasComponent(CTYPE.RIGIDBODY))
        {
            var depth = collisionData[0];
            var axis = collisionData[1];
            
            var rbA = entityA.getComponent(CTYPE.RIGIDBODY);
            
            this.resolveCollision(rbA, transformA, depth, axis);
        }
        else if (entityB.hasComponent(CTYPE.RIGIDBODY))
        {
            var depth = collisionData[0];
            var axis = collisionData[1];
            
            var rbB = entityB.getComponent(CTYPE.RIGIDBODY);
            
            this.resolveCollision(rbB, transformB, -depth, axis);
        }
        else
        {
            // Neither has rigidbody - can only trigger collision events...
        }

        // If entities have USER_INPUT - reset inAir fields on collisions with ground.
        if (collisionData[1].y > 0.7)
        {
            if (entityA.hasComponent(CTYPE.USER_INPUT))
            {
                var input = entityA.getComponent(CTYPE.USER_INPUT);
                input.inAir = false;
            }
            if (entityB.hasComponent(CTYPE.USER_INPUT))
            {
                var input = entityB.getComponent(CTYPE.USER_INPUT);
                input.inAir = false;
            }
        }
    } 

    resolveCollision(rb, transform, depth, axis)
    {
        rb.position.x += depth * axis.x;
        rb.position.y += depth * axis.y;
        rb.velocity.x *= (1 - Math.abs(axis.x));
        rb.velocity.y *= (1 - Math.abs(axis.y));

        // TODO: Better friction
        rb.velocity.x *= 0.9;
        //rbA.velocity.y *= 0.9;

        transform.position = rb.position.copy();
    }  

    AABBCollision(transformA, colliderA, transformB, colliderB)
    {
        // TODO: Account for collider offset
        var diff = transformA.position.Sub(transformB.position);

        var wA = colliderA.scale.x;
        var hA = colliderA.scale.y;
        var wB = colliderB.scale.x;
        var hB = colliderB.scale.y;

        var projectionX = Math.abs(diff.x) - (wA + wB) / 2.0;
        var projectionY = Math.abs(diff.y) - (hA + hB) / 2.0;
        
        return (projectionX < 0 && projectionY < 0);
    }

    BoxColliderCollision(entityA, tA, entityB, tB)
    {
        var cA = entityA.getComponent(CTYPE.BOX_COLLIDER);
        var cB = entityB.getComponent(CTYPE.BOX_COLLIDER);

        var n0A = tA.invRotatePoint(cA.normal0).normalize();
        var n1A = tA.invRotatePoint(cA.normal1).normalize();
        var n0B = tB.invRotatePoint(cB.normal0).normalize();
        var n1B = tB.invRotatePoint(cB.normal1).normalize();
        
        var axisIndex = -1;
        var result = -1;
        var bestResult = Number.MAX_VALUE;
        var axes = [ n0A, n1A, n0B, n1B ];
        
        var boundsA = new BoxBounds(tA, cA);
        var boundsB = new BoxBounds(tB, cB);
        
        // Check for collision and remember the axis with the smallest overlap.
        for (var i = 0; i < axes.length; ++i)
        {
            var axis = axes[i];
            
            boundsA.project(axis);
            boundsB.project(axis);

            var minA = boundsA.minProjection();
            var minB = boundsB.minProjection();
            var maxA = boundsA.maxProjection();
            var maxB = boundsB.maxProjection();
            
            var isCollision = ((minA < maxB && minB < maxA) ||
                               (minB < maxA && minA < maxB));

            // No collision on one axis means no collision at all.
            if (!isCollision)
            {
                axisIndex = -1;
                break;
            }

            if (minA < maxB && minB < maxA)
                result = Math.min(maxB - minA, maxA - minB);
            else
                result = Math.min(maxA - minB, minA - maxB);
            
            if (result < bestResult)
            {
                bestResult = result;
                axisIndex = i;
            }
        }

        // Return collision data
        if (axisIndex >= 0)
        {
            var centerA = tA.position.dot(axes[axisIndex]);
            var centerB = tB.position.dot(axes[axisIndex]);

            var multiplier = (centerA > centerB) ? 1 : -1;
            
            return [multiplier * bestResult, axes[axisIndex]];
        }

        return 0;
    }
}

class BoxBounds
{
    constructor(transform, collider)
    {
        var w = collider.scale.x * transform.scale.x / 2;
        var h = collider.scale.y * transform.scale.y / 2;
    
        // Construct 4 corners in local space
        this.ll = new Vector2(-w, -h);
        this.ul = new Vector2(-w, h);
        this.ur = new Vector2(w, h);
        this.lr = new Vector2(w, -h);
        
        // Transform to world space
        this.ll = transform.invRotatePoint(this.ll);
        this.ll = transform.invTranslatePoint(this.ll);

        this.ul = transform.invRotatePoint(this.ul);
        this.ul = transform.invTranslatePoint(this.ul);

        this.ur = transform.invRotatePoint(this.ur);
        this.ur = transform.invTranslatePoint(this.ur);

        this.lr = transform.invRotatePoint(this.lr);
        this.lr = transform.invTranslatePoint(this.lr);

        // Axis-project values
        this.projections = [];
    }

    project(axis)
    {
        this.projections[0] = this.ll.dot(axis);
        this.projections[1] = this.ul.dot(axis);
        this.projections[2] = this.ur.dot(axis);
        this.projections[3] = this.lr.dot(axis);
    }

    minProjection()
    {
        var minValue = this.projections[0];
        this.projections.forEach(p =>
        {
            if (p < minValue)
                minValue = p;
        });

        return minValue;
    }

    maxProjection()
    {
        var maxValue = this.projections[0];
        this.projections.forEach(p =>
        {
            if (p > maxValue)
                maxValue = p;
        });

        return maxValue;
    }
}

/*
// -------------------------------
//
// (Temp) Collision Detection Code
//
// -------------------------------
function runCollisions()
{
  var collision = false;
  
  sprites.forEach(function(entity)
  {
    var result = player.detectCollision(entity);
    
    if (result != 0) 
    {
        player.resolveCollision(entity, result.closestPoint, result.penetration);
        collision = true;
    }


    
  });

    //Air friction if no collisions detected
    if (!collision) player.addForce(new Vector2(-player.velocity.x, 0));
}

RigidBody.prototype.detectCollision = function(entity, axis)
{
    //TODO: switch statement based on collider types to call detection functions below

    var center = this.position.copy();
    entity.transform.transform(center);

    if (this.collider == COLLIDER.AABB)
    {
        switch (entity.rigidbody.collider)
        {
            case COLLIDER.AABB:
                return this.detectCollisionAABB(entity, center, axis);
        }
    }
    else if (this.collider == COLLIDER.SPHERE)
    {
        switch (entity.rigidbody.collider)
        {
            case COLLIDER.AABB:
                return this.detectCollisionSphereAABB(entity, center);
        }
    }
};

RigidBody.prototype.detectPointCollision = function(point)
{
    if (this.collider == COLLIDER.AABB)
        return this.detectPointCollisionAABB(point);
    else if (this.collider == COLLIDER.SPHERE)
        return this.detectPointCollisionSphere(point);
};

RigidBody.prototype.resolveCollision = function(entity, closestPoint, penetration)
{
    if (this.collider == COLLIDER.AABB)
    {
        if (entity.rigidbody.collider == COLLIDER.AABB)
            return this.resolveCollisionAABB(entity, closestPoint, penetration);
    }
    else if (this.collider == COLLIDER.SPHERE)
    {
        if (entity.rigidbody.collider == COLLIDER.AABB)
            return this.resolveCollisionSphereAABB(entity, closestPoint, penetration);
    }
};

RigidBody.prototype.detectCollisionAABB = function(entityB, center, axis)
{
    var width = this.transform.width;
    var height = this.transform.height;

    var projectionA = width * Math.abs(axis.dot(this.normals[0])) +
                      height * Math.abs(axis.dot(this.normals[1]));
    var projectionB = entityB.dims.x * Math.abs(axis.dot(entityB.normals[0])) +
                       entityB.dims.y * Math.abs(axis.dot(entityB.normals[1]));
    
    var distance = Math.abs(center.dot(axis));

    return projectionA + projectionB - distance;
};

RigidBody.prototype.detectCollisionSphereAABB = function(entity, center)
{
    var radius = this.radius;
    var dims = new Vector2(entity.width / 2, entity.height / 2);

    if ((Math.abs(center.x) - radius > dims.x) || (Math.abs(center.y) - radius > dims.y))
        return 0;

    var closestPoint = new Vector2();
    var distance;

    distance = center.x;
    if (distance >  dims.x) distance =  dims.x;
    if (distance < -dims.x) distance = -dims.x;
    closestPoint.x = distance;

    distance = center.y;
    if (distance >  dims.y) distance =  dims.y;
    if (distance < -dims.y) distance = -dims.y;
    closestPoint.y = distance;

    var tempPoint = closestPoint.copy();
    tempPoint.sub(center);
    distance = tempPoint.squareMagnitude();
    
    if (distance > radius * radius) 
        return 0;
    else
        return { closestPoint: closestPoint, penetration: radius - Math.sqrt(distance) };
};

RigidBody.prototype.detectPointCollisionAABB = function(point)
{
    var w = this.parent.width / 2;
    var h = this.parent.height / 2;

    var p = point.copy();
    this.parent.transform.transform(p);
    if (p.x < -w || p.x > w)
        return false;
    if (p.y < -h || p.y > h)
        return false;

    return true;
};

RigidBody.prototype.detectPointCollisionSphere = function(point)
{
    var dist = point.Sub(this.position).length();

    return (dist <= this.radius);
};

RigidBody.prototype.resolveCollisionAABB = function(entity, closestPoint, penetration)
{
    //TODO: This!!
};

RigidBody.prototype.resolveCollisionSphereAABB = function(entity, closestPoint, penetration)
{
    entity.transform.invTransform(closestPoint);

    var normal = (closestPoint.Sub(this.position)).normalize();

    this.position.x -= penetration * normal.x;
    this.position.y -= penetration * normal.y;

    var slowDown = normal.dot(this.velocity.normalize());

    this.velocity.x -= Math.abs(this.velocity.x) * normal.x / 4;
    this.velocity.y -= Math.abs(this.velocity.y) * normal.y;
    
    if (normal.y < 0 && !startedJump) 
    {
        //console.log('setting in air to false');
        inAir = false;
    }

    //Adding contact friction
    var x = Math.sin(Math.acos(Math.pow(normal.dot(new Vector2(1, 0)), 8))) * 4;
    var y = Math.sin(Math.acos(Math.pow(normal.dot(new Vector2(0, 1)), 8))) * 0.40;
  
    this.addForce(new Vector2(-this.velocity.x * x, 0).Mult(1/this.invMass));
    this.addForce(new Vector2(0, -this.velocity.y * y).Mult(1/this.invMass));

    //return radius - Math.sqrt(distance);
};
*/