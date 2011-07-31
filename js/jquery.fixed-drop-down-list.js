/**
* Fixed-length Drop-down List
*
* Author: Ryan Bales, 2011
**/
(function($) {

	/**
	* function wireStyle
	*		reassigns style to an object, given a style object
	* return boolean
	**/
	var wireStyle = function(element,style)
	{
		if( typeof(element) !== 'undefined' )
		{
			// wrap with jQuery, if it's a raw DOM element
			if( typeof(element.css) !== 'function' )
			{
				element = $(element);
			}
			for( i in style )
			{
				element.css(i,style[i]);
			}
			return true;
		}
		return null;
	};

	// Class constructor
	var FixedDropDownList = function(options)
	{
		// Encapsulate all member elements
		// typecheck container element for presence, type
		if( typeof(options.container) === 'object' )
		{
			this.container = options.container;
			var label = $(this.container).find('label');
			if( typeof(label) !== 'undefined' )
			{
				label.hide();
				this.input_name = label.attr('for');
				this.label = label;
			}
			this.list = $(this.container).find('ul');
			// Encapsulate style
			this.style = options.style;
			// Register call-backs
			if( typeof(options.onSelectOption) !== 'undefined' )
			{
				this._onSelectOption = options.onSelectOption;
			}
		}
		this.onInit(options);
	};

	FixedDropDownList.prototype = {
		onSelectOption : function(selected_option) {
			// duck type selected option to ensure that jQuery wrapped
			if( typeof(selected_option.text) !== 'function' )
			{
				selected_option = $(selected_option);
			}
			// Change selection in UI and hidden input
			this.select.text(selected_option.text());
			this.input.val(selected_option.text());
			this.hideOptions();
			if( typeof(this._onSelectOption) !== 'undefined' )
			{
				this._onSelectOption(selected_option);
			}
		},
		showOptions : function(select,e) {
			wireStyle(this.list,{
				'left' : '0 !important'
			});
		},
		hideOptions : function() {
			wireStyle(this.list,{
				'left' : '-99999px'
			});
		},
		onInit : function(options) {
			// take this as named 'module', since closures will be used for event binding
			(function(module) {
				/* initialize the UI */

				// initialize the container
				wireStyle(module.container,{ position : 'relative' });
				// initialize the select
				module.select = $('<div/>')
									.addClass('fixedDropDownList')
									.text(module.label.text())
									.appendTo(module.container);
				// bind css
				wireStyle(module.select,module.style);
				// bind click event for select
				module.select.click(function(e) {
					module.showOptions(this,e);
				});

				//initialize the options list
				module.list
						.addClass('fixedDropDownOptionList');
				if( typeof(options.list_style) !== 'undefined' )
				{
					wireStyle(module.list,options.list_style);
				}
				// bind click event for options
				module.list.find('li')
					.css('cursor','pointer')
					.live('click',function() {
						module.onSelectOption(this);
					});
				$(document).click(function(e) {
					if( $(e.target).parents().index(module.list) === -1 && !$(e.target).hasClass('fixedDropDownList') ) {
						if( module.list.css('left') !== '0 !important' ) {
							module.hideOptions();
						}
					}
				});
				module.input = $('<input/>')
									.attr('type','hidden')
									.attr('name',module.label.attr('for'))
									.appendTo(module.container);
			})(this);
		}
	};

	$.fn.fixedDropDownList = function(options)
	{
		// Wire-up options and defaults
		var defaults = {
			style : {
				'text-align' : 'center',
				'width' : '220px',
				'overflow' : 'hidden',
				'cursor' : 'pointer',
				'height' : '20px'
			}
		};
		var options = $.extend({},defaults,options);
		// inject this to support possible, future flexibility
		options.list_style = {
			'margin' : '0',
			'list-style' : 'none',
			'padding' : '5px',
			'position' : 'absolute',
			'top' : options.style.height,
			'left' : '-99999px',
			'border' : '1px solid black',
			'background-color' : '#CCC'
		};

		// Instantiate and bind each container in the set
		this.each(function() {
			var drop_down_list = new FixedDropDownList($.extend({},options,{ container : this }));
		});

		return this;
	};

})(jQuery);
