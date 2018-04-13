
class PanelInterface
{
    constructor()
    {
        this.tabs = document.getElementById('header-tab-list').children;
        this.panels = 
        [
            document.getElementById('inspector-window'),
            document.getElementById('hierarchy-window'),
            document.getElementById('settings-window'),
        ];

        //Global Settings
        this.ppmElement = this.hookupField('pixels-per-meter-field');
        this.deathLineElement = this.hookupField('death-line-field');

        this.setFields();
    }

    hookupField(id)
    {
        var self = this;

        var element = document.getElementById(id).children[0];
        element.addEventListener('change', function() { self.updateField(this); });

        return element;
    }

    updateField(element)
    {
        switch (element)
        {
            case this.ppmElement:
                var num = Number(element.value);
                if (!isNaN(num) && num > 0)
                    globalScale.pixelsPerMeter = num;
                break;
            case this.deathLineElement:
                var num = Number(element.value);
                if (!isNaN(num))
                    DeathLine = num;
        }

        this.setFields();
    }

    setFields()
    {
        this.ppmElement.value = globalScale.pixelsPerMeter;
        this.deathLineElement.value = DeathLine;
    }

    setActivePanel(target)
    {
        var self = this;

        for (var i = 0; i < this.tabs.length; ++i)
        {
            var tab = this.tabs[i];
    
            if (tab == target)
            {
                $(tab).addClass('active');
                $(self.panels[i]).removeClass('hidden');
            }
            else
            {
                $(tab).removeClass('active');
                $(self.panels[i]).addClass('hidden');
            }
        }
    }
}