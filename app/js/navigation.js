ES.Home = (function(context) {
	var $el = {},
		_initDOMCaching,
		_initDOMEvents,
		_changeTab;

	_initDomCaching = function () {
		$el.navTabs = $('nav .tab-list');
		$el.resultView = $('#main-content');
	}
	_initDOMEvents = function () {
		$el.navTabs.off('click.changeTab').on('click.changeTab', 'li', function() {
			_changeTab($(this));
		});
	}
	_changeTab = function($this) {
		var identifier = $this.data('identifier');
		$el.navTabs.find('li').removeClass('active');
		$this.addClass('active');
		$el.resultView.find('section').addClass('hidden');
		$el.resultView.find('#' + identifier).removeClass('hidden');
		ES.List.enable();
		ES.Create.enable();
	}
	context.enable = function() {
		_initDomCaching();
		_initDOMEvents();
	}

	return context;
})({});

ES.Home.enable();