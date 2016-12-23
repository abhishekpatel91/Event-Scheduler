ES.Create = (function(context) {
    var $el = {},
        _initDOMCaching,
        _initDOMEvents,
        _initTimeSlot,
        _onEventChange,
        _createData,
        _bookedTimeSlot,
        _updateDataBase,
        _addTask,
        _removeTask,
        _handleDateChange,
        taskTemplate = ES.Global.getTemplate('/templates/task.html'),
        timeSlots = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'],
        _getAvailableTimeSlots;
    _initDOMCaching = function() {
        $el.create = $('#create');
        $el.createEventForm = $el.create.find('form');
        $el.navTabs = $('nav .tab-list');
        $el.eventType = $el.create.find('#eventType');
        $el.resultView = $el.create.find('.result-view');
    }
    _initDOMEvents = function() {
        $el.eventType.off('change.eventType').on('change.eventType', function() {
            _onEventChange($(this));
        });
        $el.resultView.off('change.time').on('change.time', '.js-time #from', function() {
            _changeTimeSlot($(this));
        });
        $el.resultView.off('click.addTask').on('click.addTask', '.add-task', function() {
            _addTask();
        });
        $el.resultView.off('click.removeTask').on('click.removeTask', '.remove-task', function() {
            _removeTask();
        });
        $el.createEventForm.off('submit.createEvent').on('submit.createEvent', function(event) {
            event.preventDefault();
            var eventData = _createData($(this));
            eventData.bookedTimeSlot = _bookedTimeSlot(eventData.from, eventData.to);
            _updateDataBase(eventData);
            ES.List.gotoState();
        });
        $el.resultView.off('dp.change').on('dp.change', '.calendar input', function() {
            var availableTimeSlots = _getAvailableTimeSlots($(this));
            _handleDateChange(availableTimeSlots);
        });
    }
    _getAvailableTimeSlots = function($this) {
        var db = ES.Global.database,
            date = $this.val(),
            len = db[date] ? db[date].length : 0,
            slots = [];
        if (len) {
            for (var idx = 0; idx < len; idx++) {
                if (db[date][idx].bookedTimeSlot) {
                    slots = slots.mergeArray(db[date][idx].bookedTimeSlot);
                }
            }
            return (timeSlots.difference(slots));
        } else {
            return timeSlots;
        }
    }
    _initTimeSlot = function($elm, timeArray) {
        var arrLength = timeArray.length;
        $elm.empty();
        for (var idx = 0; idx < arrLength; idx++) {
            $elm.append($('<option>', { value: timeArray[idx], text: timeArray[idx] }));
        }
    }
    _handleDateChange = function(arr) {
        var tempArr = _makeCopy(arr);
        tempArr.splice((tempArr.length - 1), 1);
        _initTimeSlot($el.resultView.find('.js-time #from'), tempArr);
        $el.resultView.find('.js-time #from').trigger('change');
    }
    _changeTimeSlot = function($this) {
        var fromTime = $this.val(),
            tempArr = _getAvailableTimeSlots($el.resultView.find('.calendar input')),
            reqArr = [],
            index1 = tempArr.indexOf(fromTime),
            index2 = timeSlots.indexOf(fromTime),
            len = (tempArr.length - index1 > 9) ? 9 : (tempArr.length - index1);
        for (var idx = 1; idx < len; idx++) {
            if (tempArr[index1 + idx] === timeSlots[index2 + idx]) {
                reqArr.push(tempArr[index1 + idx]);
            } else {
                break;
            }
        }
        if (!reqArr.length && $this.closest('form').find('#to').length) {
            $this.closest('form').find('button[type="submit"]').addClass('disabled');
        } else {
            $this.closest('form').find('button[type="submit"]').removeClass('disabled');
        }
        _initTimeSlot($el.resultView.find('.js-time #to'), reqArr);
    }
    _onEventChange = function($this, data) {
        var value = $this.val(),
            basePath = '/templates/',
            template;
        template = ES.Global.getTemplate(basePath + value + '.html');
        $el.resultView.html(template({ data: data }));
        ES.Global.initDatePicker();
        $el.resultView.find('.calendar input').trigger('dp.change');
    }
    _createData = function($form) {
        var eventObj,
            reminderTime,
            date = $form.find('#date').val(),
            from = $form.find('#from').val(),
            dateObj,
            tasks = [],
            $taskElm,
            loopLength;
        dateObj = new Date(date + ' ' + from);
        reminderTime = dateObj.getTime();
        if ($form.find('.task-container').length) {
            $taskElm = $form.find('.task-container .task input');
            loopLength = $taskElm.length;
            for (var idx = 0; idx < loopLength; idx++) {
                if ($taskElm.eq(idx).val()) {
                    tasks.push({ title: $taskElm.eq(idx).val(), id: (idx + 1) });
                }
            }
        } else {
            tasks = null;
        }
        eventObj = {
            type: $form.find('#eventType').val(),
            title: $form.find('#title').val(),
            location: $form.find('#location').val(),
            invitees: $form.find('#invitees').val(),
            date: date,
            from: from,
            to: $form.find('#to').val(),
            description: $form.find('#desc').val(),
            reminderTime: reminderTime,
            tasks: tasks
        }
        return eventObj;
    }
    _bookedTimeSlot = function(from, to) {
        var tempArr = _makeCopy(timeSlots);
        if (from && to) {
            return (tempArr.slice(tempArr.indexOf(from), tempArr.indexOf(to)));
        }
    }
    _updateDataBase = function(eventData) {
        var db = ES.Global.database;
        if (!db.hasOwnProperty(eventData.date)) {
            db[eventData.date] = [];
        }
        db[eventData.date].push(eventData);
        ES.Global.updateStorage();
    }
    _makeCopy = function(obj) {
        return (JSON.parse(JSON.stringify(obj)))
    }
    _addTask = function() {
        var data,
            index = $el.resultView.find('.task-container .task').length;
        data = {
            id: 'task' + index,
            title: 'Task ' + (index + 1)
        };
        $el.resultView.find('.task-container').append(taskTemplate(data));
    }
    _removeTask = function() {
        $el.resultView.find('.task-container .task').last().remove();
    }
    context.gotoState = function(obj) {
        $el.eventType.val(obj.type);
        $el.navTabs.find('li[data-identifier="create"]').trigger('click');
        _onEventChange($el.eventType, obj);
    }
    context.enable = function() {
        _initDOMCaching();
        _initDOMEvents();
        $el.eventType.trigger('change');
    }

    return context;
})({});

ES.Create.enable();
