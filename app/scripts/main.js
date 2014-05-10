
;(function IIFE($, window){
    'use strict';
    var Calculator, view;

    view = {
        $el: $('<p>', {
            class: 'result'
        }),
        $container: $('#result-container'),
        showMessage: function(toShow){
            var message = "X " + toShow.type + " Y is " + toShow.result;
            this.show(message);
        },
        show: function(message){
            this.$container.html(this.$el.html(message));
        },
        clear: function(){
            this.$container.html('');
        }
    };

    /**
     *
     * @type {{
     * removeErrs: removeErrs,
     * _getFormValues: _getFormValues,
     * _getCalulationType: _getCalulationType,
     * _makeCalculation: _makeCalculation,
     * _addValues: _addValues,
     * _minusValues: _minusValues,
     * _displayResult: _displayResult,
     * run: run
     * }}
     */
    Calculator = function(options){
        this.$form = options.$form;
        this.xSelector = options.xSelector;
        this.ySelector = options.ySelector;
        this.typeProperty = options.typeProperty;
    }

    Calculator.prototype = {
        removeErrs: function(){
            this.$form.find('.error').remove();
        },
        /**
        // should use data attribute?
         * looks for #x and #y inside form
         * @returns {{x: Number, y: Number}}
         */
        _getFormValues: function(){
            var x = Number(this.$form.find(this.xSelector).val()),
                y = Number(this.$form.find(this.ySelector).val());

            [x, y].forEach(function(val){
                if (isNaN(val)) { throw Error('You must supply valid numbers'); }
            });
            return { x: x, y: y }
        },
        // should use data attribute?
        _getCalulationType: function (target) {
            return target[this.typeProperty];
        },
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
            view.showMessage({
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
        var $form = $('#calc'),
            calc = new Calculator({
                $form: $form,
                xSelector: '#x',
                ySelector: '#y',
                typeProperty: 'id'
            });

        $form.on('submit', function(e){
            e.preventDefault();
        });

        $form.find('button').on( 'click', function(e){
            e.preventDefault();
            // the icons for + and - are inside spans that take up
            // THE WHOLE BUTTON
            if( e.target.nodeName == 'SPAN' ) {
                try {
                    calc.removeErrs();
                    view.clear(view);
                    calc.run(e);
                } catch (e) {
                    var $error = $('<span>',{
                        class: 'error',
                        text: e.message
                    });
                    $form.append($error);
                }
            }
        });
    });


}(jQuery, window));