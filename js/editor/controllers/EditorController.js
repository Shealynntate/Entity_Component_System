class EditorController
{
    constructor(id)
    {    
        this.element = document.getElementById(id);
    }

    hide()
    {
        $(this.element).addClass('hidden');
    }

    show()
    {
        $(this.element).removeClass('hidden');
    }

    hookupFields()
    {
        
    }

    hookupHTMLInput(id)
    {
        var self = this;

        var element = document.getElementById(id).children[0];
        element.addEventListener('change', function() { self.updateField(this); });

        return element;
    }

    hookupHTMLButton(id)
    {
        var self = this;

        var element = document.getElementById(id).children[0];
        element.addEventListener('click', function() { self.updateField(this); });

        return element;
    }

    updateField(element)
    {
        
    }

    // Called when an entity is selected by user in Edit Mode.
    setFields(component)
    {
        // TODO: Account for camera offset
        var offset = new Vector2();
    }

    setInputField(field, value)
    {
        field.readOnly = false;
        field.value = (value).toFixed(2);
    }

    setImageField(field, src)
    {
        field.src = src;
    }

    setCheckBoxField(field, value)
    {
        field.disabled = false;
        field.checked = value;
    }

    clearFields()
    {
       
    }

    clearInputField(field)
    {
        field.value = null;
        field.readOnly = true;
    }

    clearImageField(field)
    {
        field.src = '';
    }

    clearCheckboxField(field)
    {
        field.checked = false;
        field.disabled = true;
    }
}

// TODO: Move this to better spot
// TODO: Different implementation for rigidbody colliders - can rotate
function updateAABB(entity)
{
    if (!entity.hasComponent(CTYPE.AABB_COLLIDER)) 
        return;

    var transform = entity.getComponent(CTYPE.TRANSFORM);
    var collider = entity.getComponent(CTYPE.BOX_COLLIDER);

    var scale = collider.scale;
    var offset = collider.offset;
    var rotation = transform.rotation;

    var w = scale.x * transform.scale.x / 2.0;
    var h = scale.y * transform.scale.y / 2.0;
    
    function rotate(p)
    {
        var rotX = p.x * rotation.x - p.y * rotation.y;
        var rotY = p.x * rotation.y + p.y * rotation.x;
        
        return new Vector2(rotX, rotY);
    }

    var ll = rotate(new Vector2(-w + offset.x, -h + offset.y));
    var ul = rotate(new Vector2(-w + offset.x, h + offset.y));
    var ur = rotate(new Vector2(w + offset.x, h + offset.y));
    var lr = rotate(new Vector2(w + offset.x, -h + offset.y));

    var minX = Math.min(ll.x, ul.x, ur.x, lr.x);
    var maxX = Math.max(ll.x, ul.x, ur.x, lr.x);
    var minY = Math.min(ll.y, ul.y, ur.y, lr.y);
    var maxY = Math.max(ll.y, ul.y, ur.y, lr.y);
    
    var aabb = entity.getComponent(CTYPE.AABB_COLLIDER);
    
    aabb.scale.x = maxX - minX;
    aabb.scale.y = maxY - minY;
    aabb.offset.x = offset.x;
    aabb.offset.y = offset.y;
}