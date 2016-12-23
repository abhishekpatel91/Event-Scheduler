ES.List = (function(context) {
    var $el = {},
        _initDOMCaching,
        _initDOMEvents,
        _getData,
        _deleteEvent,
        _getEvent,
        _editEvent,
        _taskStatus,
        _renderGrid;
    _initDOMCaching = function() {
        $el.list = $('#list');
        $el.navTabs = $('nav .tab-list');
        $el.eventListing = $el.list.find('.event-listing');
        $el.gridView = $el.eventListing.find('.grid-view');
        $el.selectDate = $el.list.find('#selectDate');
    }
    _initDOMEvents = function() {
        $el.selectDate.off('dp.change').on('dp.change', function(event) {
            var data = _getData($(this));
            _renderGrid($(this), data);
        });
        $el.gridView.off('click.delete', 'article .delete').on('click.delete', 'article .delete', function(event) {
            _deleteEvent($(this));
        });
        $el.gridView.off('click.edit', 'article .edit').on('click.edit', 'article .edit', function(event) {
            _editEvent($(this));
        });
        $el.gridView.off('click.taskStatus').on('click.taskStatus', '.task-list input[type="radio"]', function() {
            _taskStatus($(this));
        });
    }
    _getData = function($this) {
        var date = $this.val(),
            db = ES.Global.database;
        if (db && db[date]) {
            return db[date];
        } else {
            return null;
        }
    }
    _getEvent = function(identifier, $this) {
        var db = _getData($this),
            length = db ? db.length : 0;
        if (db && length) {
            for (var idx = 0; idx < length; idx++) {
                if (identifier === db[idx].type + db[idx].reminderTime) {
                    break;
                } else {
                    continue;
                }
            }
            if (idx !== length) {
                return db[idx]
            } else {
                return null;
            }
        }
    }
    _renderGrid = function($this, data) {
        var date = $this.val(),
            template = ES.Global.getTemplate('/templates/eventGrid.html');
        $el.eventListing.find('h2').html('Events on ' + date);
        if (data && data.length) {
            data = data.sort(function(firstOperand,secondOperand) {
                return (firstOperand.reminderTime - secondOperand.reminderTime);
            });
            $el.gridView.html(template({ data: data }))
        } else {
            $el.gridView.html($('<div>', {
                class: 'no-result col-xs-12 col-md-12',
                text: 'No Events are scheduled for this date!'
            }))
        }
    }
    _deleteEvent = function($this) {
        var $target = $this.closest('article'),
            identifier = $target.data('identifier'),
            db = _getData($el.selectDate),
            reqObj;
        reqObj = _getEvent(identifier, $el.selectDate);
        if (reqObj) {
            db.splice(db.indexOf(reqObj), 1);
            $el.selectDate.trigger('dp.change');
            ES.Global.updateStorage();
        }
    }
    _editEvent = function($this) {
        var $target = $this.closest('article'),
            identifier = $target.data('identifier'),
            reqObj;
        reqObj = _getEvent(identifier, $el.selectDate);
        if (reqObj) {
            _deleteEvent($this);
            ES.Create.gotoState(reqObj);
        }
    }
    _taskStatus = function($this) {
        var $target = $this.closest('li'),
            value = $this.val();
        $target.attr('class', value);
    }
    context.gotoState = function() {
        $el.navTabs.find('li[data-identifier="list"]').trigger('click');
    }
    context.enable = function() {
        _initDOMCaching();
        _initDOMEvents();
        $el.selectDate.trigger('dp.change');
    }
    return context;
})({});

ES.List.enable();
