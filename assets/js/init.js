
// jQuery functions
	
	// formerize
		jQuery.fn.n33_formerize=function(){var _fakes=new Array(),_form = jQuery(this);_form.find('input[type=text],textarea').each(function() { var e = jQuery(this); if (e.val() == '' || e.val() == e.attr('placeholder')) { e.addClass('formerize-placeholder'); e.val(e.attr('placeholder')); } }).blur(function() { var e = jQuery(this); if (e.attr('name').match(/_fakeformerizefield$/)) return; if (e.val() == '') { e.addClass('formerize-placeholder'); e.val(e.attr('placeholder')); } }).focus(function() { var e = jQuery(this); if (e.attr('name').match(/_fakeformerizefield$/)) return; if (e.val() == e.attr('placeholder')) { e.removeClass('formerize-placeholder'); e.val(''); } }); _form.find('input[type=password]').each(function() { var e = jQuery(this); var x = jQuery(jQuery('<div>').append(e.clone()).remove().html().replace(/type="password"/i, 'type="text"').replace(/type=password/i, 'type=text')); if (e.attr('id') != '') x.attr('id', e.attr('id') + '_fakeformerizefield'); if (e.attr('name') != '') x.attr('name', e.attr('name') + '_fakeformerizefield'); x.addClass('formerize-placeholder').val(x.attr('placeholder')).insertAfter(e); if (e.val() == '') e.hide(); else x.hide(); e.blur(function(event) { event.preventDefault(); var e = jQuery(this); var x = e.parent().find('input[name=' + e.attr('name') + '_fakeformerizefield]'); if (e.val() == '') { e.hide(); x.show(); } }); x.focus(function(event) { event.preventDefault(); var x = jQuery(this); var e = x.parent().find('input[name=' + x.attr('name').replace('_fakeformerizefield', '') + ']'); x.hide(); e.show().focus(); }); x.keypress(function(event) { event.preventDefault(); x.val(''); }); });  _form.submit(function() { jQuery(this).find('input[type=text],input[type=password],textarea').each(function(event) { var e = jQuery(this); if (e.attr('name').match(/_fakeformerizefield$/)) e.attr('name', ''); if (e.val() == e.attr('placeholder')) { e.removeClass('formerize-placeholder'); e.val(''); } }); }).bind("reset", function(event) { event.preventDefault(); jQuery(this).find('select').val(jQuery('option:first').val()); jQuery(this).find('input,textarea').each(function() { var e = jQuery(this); var x; e.removeClass('formerize-placeholder'); switch (this.type) { case 'submit': case 'reset': break; case 'password': e.val(e.attr('defaultValue')); x = e.parent().find('input[name=' + e.attr('name') + '_fakeformerizefield]'); if (e.val() == '') { e.hide(); x.show(); } else { e.show(); x.hide(); } break; case 'checkbox': case 'radio': e.attr('checked', e.attr('defaultValue')); break; case 'text': case 'textarea': e.val(e.attr('defaultValue')); if (e.val() == '') { e.addClass('formerize-placeholder'); e.val(e.attr('placeholder')); } break; default: e.val(e.attr('defaultValue')); break; } }); window.setTimeout(function() { for (x in _fakes) _fakes[x].trigger('formerize_sync'); }, 10); }); return _form; };
	
	// scrolly
		jQuery.fn.n33_scrolly = function() {			
			var bh = jQuery('body,html'), t = jQuery(this);

			t.click(function(e) {
				var h = jQuery(this).attr('href'), target;

				if (h.charAt(0) == '#' && h.length > 1 && (target = jQuery(h)).length > 0)
				{
					var pos = Math.max(target.offset().top, 0);
					e.preventDefault();
					bh
						.stop(true, true)
						.animate({ scrollTop: pos }, 'slow', 'swing');
				}
			});
			
			return t;
		};

	// scrollzer
		jQuery.n33_scrollzer = function(ids, userSettings) {

			var top = jQuery(window), doc = jQuery(document);
			
			top.load(function() {

				// Settings
					var settings = jQuery.extend({
						activeClassName:	'active',
						suffix:				'-link',
						pad:				50,
						firstHack:			false,
						lastHack:			false
					}, userSettings);

				// Variables
					var k, x, o, l, pos;
					var lastId, elements = [], links = jQuery();

				// Build elements array
					for (k in ids)
					{
						o = jQuery('#' + ids[k]);
						l = jQuery('#' + ids[k] + settings.suffix);
					
						if (o.length < 1
						||	l.length < 1)
							continue;
						
						x = {};
						x.link = l;
						x.object = o;
						elements[ids[k]] = x;
						links = links.add(l);
					}

				// Resize event (calculates start/end values for each element)
					var resizeTimerId, resizeFunc = function() {
						var x;
						
						for (k in elements)
						{
							x = elements[k];
							x.start = Math.ceil(x.object.offset().top) - settings.pad;
							x.end = x.start + Math.ceil(x.object.innerHeight());
						}
						
						top.trigger('scroll');
					};
					
					top.resize(function() {
						window.clearTimeout(resizeTimerId);
						resizeTimerId = window.setTimeout(resizeFunc, 250);
					});

				// Scroll event (checks to see which element is on the screen and activates its link element)
					var scrollTimerId, scrollFunc = function() {
						links.removeClass('scrollzer-locked');
					};
				
					top.scroll(function(e) {
						var i = 0, h, found = false;
						pos = top.scrollTop();

						window.clearTimeout(scrollTimerId);
						scrollTimerId = window.setTimeout(scrollFunc, 250);
						
						// Step through elements
							for (k in elements)
							{
								if (k != lastId
								&&	pos >= elements[k].start
								&&	pos <= elements[k].end)
								{
									lastId = k;
									found = true;
								}
								
								i++;
							}
							
						// If we're using lastHack ...
							if (settings.lastHack
							&&	pos + top.height() >= doc.height())
							{
								lastId = k;
								found = true;
							}
							
						// If we found one ...
							if (found
							&&	!links.hasClass('scrollzer-locked'))
							{
								links.removeClass(settings.activeClassName);
								elements[lastId].link.addClass(settings.activeClassName);
							}
					});
					
				// Initial trigger
					top.trigger('resize');

			});

		};

// Ready stuff
	jQuery(function() {

		var $window = $(window),
			_IEVersion = (navigator.userAgent.match(/MSIE ([0-9]+)\./) ? parseInt(RegExp.$1) : 99);

		// Initialize forms
			// Add input "placeholder" support to IE <= 9
				if (_IEVersion < 10)
					$('form').n33_formerize();
					
			// Submit
				jQuery('form .button.submit').click(function(e) {
					e.preventDefault();
					jQuery(this).closest('form').submit();
				});
			
		//
			
			$('#btn-menu').click(function() {
				$('#btn-menu').toggleClass('active');
				$('#nav-mobile').slideToggle();
			});
			
			function photoResize(){
				var cw = $('.fotito').width();
				$('.fotito-container').css({'width':cw+'px'});
				$('.fotito').css({'height':cw+'px'});
			}
			
		// Initialize events
		
			// Load
				$window.load(function() {
				
					//	fancybox
					$(".popup").fancybox({
						maxWidth: 756,
						maxHeight: 500,
						fitToView: false,
						width: '70%',
						height: '70%',
						padding: '0',
						autoSize: false,
						closeClick: false,
						openEffect: 'none',
						closeEffect: 'none',
						helpers: {
							title: {
								type: 'outside'
							}
						}
					}); // fancybox
					
					photoResize();

				});
			
			// Resize
				$( window ).resize(function() {
					photoResize();
				});
			
			// Document ready
				$(document).ready(function() {
					
					// Age
					var birthday	= new Date($('#birthday').html());
					var today		= new Date();
					var age			= Math.floor((today-birthday) / (365.25 * 24 * 60 * 60 * 1000));
					$('#age').html(age + ' years old');
					
					
					// Radial progress bar
					$('.cart').appear(function() {
						var easy_pie_chart = {};
						$('.circular-item').removeClass("hidden");
						$('.circular-pie').each(function() {
							//var text_span = $(this).children('span');
							$(this).easyPieChart($.extend(true, {}, easy_pie_chart, {
								size : 150,
								animate : 2000,
								lineWidth : 6,
								lineCap : 'square',
								barColor : $(this).data('color'),
								lineWidth : 20,
								trackColor : '#fff',
								scaleColor : false,
								onStep : function(value) {
									//text_span.text(parseInt(value, 10) + '%');
								}
							}));
						});
					
						$('.barchart').horizBarChart({
							selector: '.bar',
							speed: 2000
						});
					});
					
				});

		// Initialize scrolly links
			jQuery('.scrolly').n33_scrolly();

		// Initialize nav
			var $nav_a = jQuery('#nav a');
			var $m_nav_a = jQuery('#nav-mobile a');
			
			// Scrollyfy links
				$nav_a
					.n33_scrolly()
					.click(function(e) {

						var t = jQuery(this),
							href = t.attr('href');
						
						if (href[0] != '#')
							return;
						
						e.preventDefault();
						
						// Clear active and lock scrollzer until scrolling has stopped
							$nav_a
								.removeClass('active')
								.addClass('scrollzer-locked');
					
						// Set this link to active
							t.addClass('active');
					
					});
					
				$m_nav_a
					.n33_scrolly()
					.click(function(e) {

						var t = jQuery(this),
							href = t.attr('href');
						
						if (href[0] != '#')
							return;
						
						e.preventDefault();
						
						// Clear active and lock scrollzer until scrolling has stopped
							$m_nav_a
								.removeClass('active')
								.addClass('scrollzer-locked');
					
						// Set this link to active
							t.addClass('active');
					
					});

			// Initialize scrollzer
				var ids = [];
				
				$nav_a.each(function() {
					
					var href = jQuery(this).attr('href');
					
					if (href[0] != '#')
						return;
				
					ids.push(href.substring(1));
				
				});
				
				$m_nav_a.each(function() {
					
					var href = jQuery(this).attr('href');
					
					if (href[0] != '#')
						return;
				
					ids.push(href.substring(1));
				
				});
				
				jQuery.n33_scrollzer(ids, { pad: 200, lastHack: true });

	});
