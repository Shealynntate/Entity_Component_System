
class UserInputController extends EditorController
{
    constructor(id)
    {
        super(id);

        this.move_enabled;
        this.move_speed;
        this.jump_enabled;
        this.jump_height;
    }

    hookupFields()
    {
        this.move_enabled = super.hookupHTMLInput('user-input-move-enable-field');
        this.move_speed = super.hookupHTMLInput('user-input-move-speed-field');
        this.jump_enabled = super.hookupHTMLInput('user-input-jump-enable-field');
        this.jump_height = super.hookupHTMLInput('user-input-jump-height-field');
    }

    updateField(element)
    {
        if (ActiveEntity == null) return;

        var input = ActiveEntity.getComponent(CTYPE.USER_INPUT);

        if (element == this.move_enabled)
        {
            input.canMove = element.checked;
        }
        else if (element == this.jump_enabled)
        {
            input.canJump = element.checked;
        }
        else
        {
            var num = Number(element.value);
            if (!isNaN(num) && num > 0)
            {
                if (element == this.move_speed)
                    input.moveSpeed = num;
                else if (element == this.jump_height)
                    input.jumpHeight = num;
            }
        }

        this.setFields(input);
    }

    setFields(input)
    {
        super.setCheckBoxField(this.move_enabled, input.canMove);
        super.setCheckBoxField(this.jump_enabled, input.canJump);
        super.setInputField(this.move_speed, input.moveSpeed);
        super.setInputField(this.jump_height, input.jumpHeight);
    }

    clearFields()
    {
        super.clearCheckboxField(this.move_enabled);
        super.clearCheckboxField(this.jump_enabled);
        super.clearInputField(this.move_speed);
        super.clearInputField(this.jump_height);        
    }
}