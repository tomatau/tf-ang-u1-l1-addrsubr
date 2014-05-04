
;(function IIFE($, window){
    var calculator, view, $form;

    view = {
        $el: $('<p>', {
            class: 'result'
        }),
        $container: $('#result-container'),
        show: function(toShow){
            var message = "X " + toShow.type + " Y is " + toShow.result;
            this.$container.html(this.$el.html(message));
        },
        clear: function(){
            this.$container.html('');
        }
    };

    calculator = {
        removeErrs: function(){
            this.$form.find('.error').remove();
        },
        /**
        // should use data attribute?
         * looks for #x and #y inside form
         * @returns {{x: Number, y: Number}}
         */
        _getFormValues: function(){
            var x = Number(this.$form.find('#x').val()),
                y = Number(this.$form.find('#y').val());

            [x, y].forEach(function(val){
                if (isNaN(val)) { throw Error('You must supply valid numbers'); }
            });
            return { x: x, y: y }
        },
        // should use data attribute?
        _getCalulationType: function (target) { return target.id; },
        _makeCalculation: function(calculationType, data){
            switch(calculationType){
                case 'plus':
                    this.result = this._addValues(data);
                    break;
                case 'minus':
                    this.result = this._minusValues(data);
                    break;
                default: break;
            }
        },
        _addValues: function(data){
            return data.x + data.y;
        },
        _minusValues: function(data){
            return data.x - data.y;
        },
        _displayResult: function (calculationType) {
            view.show({
                type: calculationType,
                result: this.result
            });
        },
        run: function(e){
            var calculationType = this._getCalulationType(e.target),
                data = this._getFormValues();
            this._makeCalculation(calculationType, data);
            this._displayResult(calculationType);
        }
    };


    $(function(){
        $form = calculator.$form = $('#calc');

//        calculator.setup({
//            xSelector: 'x',
//            ySelector: 'y',
//            typeProperty: 'id'
//        });

        $form.on('submit', function(e){
            e.preventDefault();
        });

        $form.find('button').on(
            'click', function(e){
                e.preventDefault();
                if( e.target.nodeName == 'SPAN' ) {
                    try {
                        calculator.removeErrs();
                        view.clear.call(view);
                        calculator.run.call(calculator, e);
                    } catch (e) {
                        var $error = $('<span>',{
                            class: 'error',
                            text: e.message
                        });
                        $form.append($error);
                    }
                }
            }
        );
    });


}(jQuery, window));