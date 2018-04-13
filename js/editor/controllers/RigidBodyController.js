
class RigidBodyController extends EditorController
{
    constructor(id)
    {
        super(id);

        this.mass;
        this.use_gravity;
        this.gravity_scalar;
    }

    hookupFields()
    {
        this.mass = super.hookupHTMLInput('rigidbody-mass-field');
        this.use_gravity = super.hookupHTMLInput('rigidbody-use-gravity-field');
        this.gravity_scalar = super.hookupHTMLInput('rigidbody-gravity-scalar-field');
    }

    updateField(element)
    {
        if (ActiveEntity == null) return;

        var rigidbody = ActiveEntity.getComponent(CTYPE.RIGIDBODY);

        if (element == this.use_gravity)
        {
            rigidbody.applyGravity = element.checked;
        }
        else
        {
            var num = Number(element.value);
            
            if (!isNaN(number))
            {
                if (element == this.mass)
                {
                    if (num > 0)
                        rigidbody.invMass = (1.0 / num);
                }
                else if (element == this.gravity_scalar)
                {
                    rigidbody.gravityScalar = num;
                }
            }
        }

        this.setFields(rigidbody);
    }

    setFields(rigidbody)
    {
        super.setInputField(this.mass, (1.0 / rigidbody.invMass));
        super.setInputField(this.gravity_scalar, rigidbody.gravityScalar);
        super.setCheckBoxField(this.use_gravity, rigidbody.applyGravity);
    }

    clearFields()
    {
        super.clearInputField(this.mass);
        super.clearCheckboxField(this.use_gravity);
        super.clearInputField(this.gravity_scalar);
    }
}