
class RespawnController extends EditorController
{
    constructor(id)
    {
        super(id);

        this.on_death;
        this.position_x;
        this.position_y;
        this.rotation;
    }

    hookupFields()
    {
        this.on_death = super.hookupHTMLInput('respawn-ondeath-field');
        this.position_x = super.hookupHTMLInput('respawn-position-field-x');
        this.position_y = super.hookupHTMLInput('respawn-position-field-y');
        this.rotation = super.hookupHTMLInput('respawn-rotation-field');
    }

    updateField(element)
    {
        if (ActiveEntity == null) return;

        var respawn = ActiveEntity.getComponent(CTYPE.RESPAWN);

        if (element == this.on_death)
        {
            respawn.respawOnDeath = element.checked;
        }
        else
        {
            var num = Number(element.value);

            if (!isNaN(num))
            {
                switch (element)
                {
                    case this.position_x:
                        respawn.position.x = num;
                        break;
                    case this.position_y:
                        respawn.position.y = num;
                        break;
                    case this.rotation:
                        respawn.rotationInDegrees = num;
                        break;
                }
            }
        }

        this.setFields(respawn);
    }

    setFields(respawn)
    {
        var position = respawn.position;
        var rotation = respawn.rotationInDegrees;

        super.setCheckBoxField(this.on_death, respawn.respawnOnDeath);
        super.setInputField(this.position_x, position.x);
        super.setInputField(this.position_y, position.y);
        super.setInputField(this.rotation, rotation);
    }

    clearFields()
    {
        super.clearCheckboxField(this.on_death);
        super.clearInputField(this.position_x);
        super.clearInputField(this.position_y);
        super.clearInputField(this.rotation);
    }
}