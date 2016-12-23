window.ES = window.ES || {};

ES.Global = (function(context) {
    var _initGlobalEvents,
        _arrayMethods,
        _initDatabase,
        storage = sessionStorage;
    context.database = {};
    _arrayMethods = function() {
        Array.prototype.mergeArray = function(arr) {
            var concatArr = this.concat(arr),
                temp = {};
            concatArr = concatArr.filter(function(value) {
                return (temp.hasOwnProperty(value) ? false : (temp[value] = true));
            });
            return concatArr;
        }
        Array.prototype.difference = function(arr) {
            return (this.filter(function(value) {
                return ((arr.indexOf(value) === -1) ? true : false);
            }));
        }
    }
    _initGlobalEvents = function() {
        $('body').off('click.showCalendar', '.calendar .glyphicon-calendar').on('click.showCalendar', '.calendar .glyphicon-calendar', function() {
            $(this).closest('.calendar').find('input').trigger('focus');
        });
    }
    _initDatabase = function() {
        var storageData;
        try {
            storageData = storage.getItem('eventScheduler');
            storageData = JSON.parse(storageData);
            if (storageData) {
                context.database = storageData;
            }
        } catch (err) {
            context.database = {};
        }
    }
    context.updateStorage = function() {
        var data = JSON.stringify(context.database);
        try {
            storage.setItem('eventScheduler', data);
        } catch (err) {

        }
    }
    context.initDatePicker = function() {
        $('#main-content .calendar input').datetimepicker({
            format: 'MM/DD/YYYY',
            ignoreReadonly: true,
            minDate: new Date(),
            useCurrent: true,
            daysOfWeekDisabled: [0, 6]
        });
    }
    context.getTemplate = function(path) {
        var result;
        $.ajax({
            url: path,
            async: false,
            success: function(response) {
                result = response;
            },
            error: function() {
                result = null;
            }
        });
        return (Handlebars.compile(result));
    }
    context.enable = function() {
        _arrayMethods();
        _initDatabase();
        _initGlobalEvents();
    }
    return context;
})({});

ES.Global.enable();
