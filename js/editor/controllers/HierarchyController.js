class HierarchyController extends EditorController
{
    constructor(id)
    {
        super(id);

        this.entity_map = [];
        this.element_map = [];
    }

    hookupFields()
    {
        var self = this;
        var entities = Manager.entities;

        for (var i = 0; i < entities.length; ++i)
        {
            var entity = entities[i];
            this.addElement(entity);
        }
    }

    addElement(entity, self = this)
    {
        var input = document.createElement('input');
        input.type = 'text';
        input.value = entity.name;
        input.addEventListener('change', function () { self.updateField(this); });
        
        var li = document.createElement('li');
        li.id = self.entity_map.length;
        li.addEventListener('click', function() { self.entityClick(this); });
        li.draggable = 'true';
        li.addEventListener('dragstart', function() { self.dragStart(event); });
        li.addEventListener('drop', function() { self.dropEvent(event); });
        li.addEventListener('dragover', function() { event.preventDefault(); });
        li.addEventListener('dragenter', function() { event.preventDefault(); });
        li.appendChild(input);

        self.element.appendChild(li);
        
        self.entity_map.push(entity);
        self.element_map.push(li);
    }

    dragStart(event)
    {
        event.dataTransfer.setData("text", event.target.id);
    }

    dropEvent(event)
    {
        event.preventDefault();
        var data = event.dataTransfer.getData("text");
        var parent = event.target.parentNode;
        parent.insertBefore(document.getElementById(data), event.target);
    }

    removeElement(entity)
    {
        var index = this.entity_map.indexOf(entity);
        var li = this.element_map[index];
        this.element.removeChild(li);
    }

    updateField(element)
    {
        event.preventDefault();
        
        var li = element.parentNode;
        var i = this.element_map.indexOf(li);
        var entity = this.entity_map[i];

        var len = Math.min(40, element.value.length);
        var name = element.value.substring(0, len);

        entity.name = name;
        element.value = name;
    }

    setFields(entity)
    {
        var i = this.entity_map.indexOf(entity);
        
        this.updateCSS(this.element_map[i]); 
    }

    entityClick(element)
    {
        var i = this.element_map.indexOf(element);
        var entity = this.entity_map[i];

        this.updateCSS(element);

        ActiveEntity = entity;
        Editor.setFields(entity);
    }

    updateCSS(li)
    {
        this.element_map.forEach(element =>
        {
            // User can only edit name text after selecting the entity.
            if (element == li)
            {
                $(element).addClass('active');
                element.children[0].style.pointerEvents = 'auto';
            }
            else
            {
                $(element).removeClass('active');
                element.children[0].style.pointerEvents = 'none';
            }
        });
    }

    clearFields()
    {
        this.updateCSS(null);
    }
}