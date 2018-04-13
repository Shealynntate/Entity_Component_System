
class SpriteController extends EditorController
{
    constructor(id)
    {
        super(id);

        this.image;
        this.tile_x;
        this.tile_y;
        this.offset_x;
        this.offset_y;
    }

    hookupFields()
    {
        this.image = super.hookupHTMLButton('sprite-image-field');
        this.tile_x = super.hookupHTMLInput('sprite-tile-field-x');
        this.tile_y = super.hookupHTMLInput('sprite-tile-field-y');
        this.offset_x = super.hookupHTMLInput('sprite-offset-field-x');
        this.offset_y = super.hookupHTMLInput('sprite-offset-field-y');
    }

    updateField(element)
    {
        if (ActiveEntity == null) return;

        var sprite = ActiveEntity.getComponent(CTYPE.SPRITE);

        if (element == this.image)
        {
            // TODO: Selectable image src's
            var texture = sprite.texture;
        }
        else
        {
            var num = Number(element.value);

            if (!isNaN(num))
            {
                switch (element)
                {
                    case this.tile_x:
                        if (num > 0)
                            sprite.tile.x = num;
                        break;
                    case this.tile_y:
                        if (num > 0)
                            sprite.tile.y = num;
                        break;
                    case this.offset_x:
                        sprite.offset.x = num;
                        break;
                    case this.offset_y:
                        sprite.offset.y = num;
                        break;
                }
            }
        }

        this.setFields(sprite);
    }

    setFields(sprite)
    {
        var texture = sprite.texture;
        var tile = sprite.tile;
        var offset = sprite.offset;

        super.setImageField(this.image, texture.src);
        super.setInputField(this.tile_x, tile.x);
        super.setInputField(this.tile_y, tile.y);
        super.setInputField(this.offset_x, offset.x);
        super.setInputField(this.offset_y, offset.y);
    }

    clearFields()
    {
        super.clearImageField(this.image);
        super.clearInputField(this.tile_x);
        super.clearInputField(this.tile_y);
        super.clearInputField(this.offset_x);
        super.clearInputField(this.offset_y);
    }
}