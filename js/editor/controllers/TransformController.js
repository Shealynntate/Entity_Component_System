
class TransformController extends EditorController
{
    constructor(id)
    {
        super(id);

        this.position_x;
        this.position_y;
        this.scale_x;
        this.scale_y;
        this.rotation;
    }

    hookupFields()
    {
        this.position_x = super.hookupHTMLInput('transform-position-field-x');
        this.position_y = super.hookupHTMLInput('transform-position-field-y');
        this.scale_x = super.hookupHTMLInput('transform-scale-field-x');
        this.scale_y = super.hookupHTMLInput('transform-scale-field-y');
        this.rotation = super.hookupHTMLInput('transform-rotation-field');
    }

    updateField(element)
    {
        if (ActiveEntity == null) return;

        var transform = ActiveEntity.getComponent(CTYPE.TRANSFORM);
        var num = Number(element.value);

        if (!isNaN(num))
        {
            switch (element)
            {
                case this.position_x:
                    transform.position.x = num;
                    break;
                case this.position_y:
                    transform.position.y = num;
                    break;
                case this.scale_x:
                    transform.scale.x = num;
                    break;
                case this.scale_y:
                    transform.scale.y = num;
                    break;
                case this.rotation:                
                    transform.rotationInDegrees = num;
                    break;
            }
        }

        this.setFields(transform);
        
        updateAABB(ActiveEntity);
    }

    setFields(transform)
    {
        var position = transform.position; 
        var scale = transform.scale;
        var rotation = transform.rotationInDegrees;

        super.setInputField(this.position_x, position.x);
        super.setInputField(this.position_y, position.y);
        super.setInputField(this.scale_x, scale.x);
        super.setInputField(this.scale_y, scale.y);
        super.setInputField(this.rotation, rotation);
    }

    clearFields()
    {
        super.clearInputField(this.position_x);
        super.clearInputField(this.position_y);
        super.clearInputField(this.scale_x);
        super.clearInputField(this.scale_y);
        super.clearInputField(this.rotation);
    }
}