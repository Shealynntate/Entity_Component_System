
class ColliderController extends EditorController
{
    constructor(id)
    {
        super(id);

        this.is_trigger;
        this.scale_x;
        this.scale_y;
        this.offset_x;
        this.offset_y;
    }

    hookupFields()
    {
        this.is_trigger = super.hookupHTMLInput('collider-trigger-field');
        this.scale_x = super.hookupHTMLInput('collider-scale-field-x');
        this.scale_y = super.hookupHTMLInput('collider-scale-field-y');
        this.offset_x = super.hookupHTMLInput('collider-offset-field-x');
        this.offset_y = super.hookupHTMLInput('collider-offset-field-y');
    }

    updateField(element)
    {
        if (ActiveEntity == null) return;

        var collider = ActiveEntity.getComponent(CTYPE.BOX_COLLIDER);

        if (element == this.is_trigger)
        {
           collider.isTrigger = element.checked;
        }
        else
        {
            var num = Number(element.value);

            if (!isNaN(num))
            {
                switch (element)
                {
                    case this.scale_x:
                        collider.scale.x = num;
                        break;
                    case this.scale_y:
                        collider.scale.y = num;
                        break;
                    case this.offset_x:
                        collider.offset.x = num;
                        break;
                    case this.offset_y:
                        collider.offset.y = num;
                        break;
                }
            }
        }

        updateAABB(ActiveEntity);
        this.setFields(collider);
    }

    setFields(collider)
    {
        var scale = collider.scale;
        var offset = collider.offset;

        super.setCheckBoxField(this.is_trigger, collider.isTrigger);
        super.setInputField(this.scale_x, scale.x);
        super.setInputField(this.scale_y, scale.y);
        super.setInputField(this.offset_x, offset.x);
        super.setInputField(this.offset_y, offset.y);
    }

    clearFields()
    {
        super.clearCheckboxField(this.is_trigger);
        super.clearInputField(this.scale_x);
        super.clearInputField(this.scale_y);
        super.clearInputField(this.offset_x);
        super.clearInputField(this.offset_y);
    }
}