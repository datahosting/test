/*
* jQuery Menu
*/
(function ($) {
	"use strict";
		$.fn.menu = function (options) {
				var defaults = {
						menuTarget: jQuery(this), // Target the current HTML markup you wish to replace
						menuContainer: 'header', // Choose where menu will be placed within the HTML
						menuClose: "X", // single character you want to represent the close menu button
						menuCloseSize: "18px", // set font size of close button
						menuOpen: "<span /><span /><span />", // text/markup you want when menu is closed
						menuRevealPosition: "right", // left right or center positions
						menuRevealPositionDistance: "0", // Tweak the position of the menu
						menuRevealColour: "", // override CSS colours for the reveal background
						menuScreenWidth: "960", // set the screen width you want menu to kick in at
						menuNavPush: "", // set a height here in px, em or % if you want to budge your layout now the navigation is missing.
						menuShowChildren: true, // true to show children in the menu, false to hide them
						menuExpandableChildren: true, // true to allow expand/collapse children
						menuExpand: "<p class='dow'></p>", // single character you want to represent the expand for ULs
						menuContract: "-", // single character you want to represent the contract for ULs
						menuRemoveAttrs: false, // true to remove classes and IDs, false to keep them
						onePage: false, // set to true for one page sites
						menuDisplay: "block", // override display method for table cell based layouts e.g. table-cell
						removeElements: "" // set to hide page elements
				};
				options = $.extend(defaults, options);

				// get browser width
				var currentWidth = window.innerWidth || document.documentElement.clientWidth;

				return this.each(function () {
						var menu = options.menuTarget;
						var menuContainer = options.menuContainer;
						var menuClose = options.menuClose;
						var menuCloseSize = options.menuCloseSize;
						var menuOpen = options.menuOpen;
						var menuRevealPosition = options.menuRevealPosition;
						var menuRevealPositionDistance = options.menuRevealPositionDistance;
						var menuRevealColour = options.menuRevealColour;
						var menuScreenWidth = options.menuScreenWidth;
						var menuNavPush = options.menuNavPush;
						
						var menuShowChildren = options.menuShowChildren;
						var menuExpandableChildren = options.menuExpandableChildren;
						var menuExpand = options.menuExpand;
						var menuContract = options.menuContract;
						var menuRemoveAttrs = options.menuRemoveAttrs;
						var onePage = options.onePage;
						var menuDisplay = options.menuDisplay;
						var removeElements = options.removeElements;

						//detect known mobile/tablet usage
						var isMobile = false;
						if ( (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/Android/i)) || (navigator.userAgent.match(/Blackberry/i)) || (navigator.userAgent.match(/Windows Phone/i)) ) {
								isMobile = true;
						}

						if ( (navigator.userAgent.match(/MSIE 8/i)) || (navigator.userAgent.match(/MSIE 7/i)) ) {
							// add scrollbar for IE7 & 8 to stop breaking resize function on small content sites
								jQuery('html').css("overflow-y" , "scroll");
						}

						var menuRevealPos = "";
						var menuCentered = function() {
				
						};

						var menuOn = false;
						var menuExist = false;


						if (menuRevealPosition === "right") {
								menuRevealPos = "right:" + menuRevealPositionDistance + ";left:auto;";
						}
						if (menuRevealPosition === "left") {
								menuRevealPos = "left:" + menuRevealPositionDistance + ";right:auto;";
						}
						// run center function
						menuCentered();

						// set all styles for mean-reveal
						var $navreveal = "";
						// re-instate original nav (and call this on window.width functions)
						var menuOriginal = function() {
							jQuery('.menu-mobile').remove();
							jQuery(menuContainer).removeClass("menu-container");
							jQuery(menu).css('display', menuDisplay);
							menuOn = false;
							menuExist = false;
							jQuery(removeElements).removeClass('menu-remove');
						};

						// navigation reveal
						var showmenu = function() {
								var menuStyles = "background:"+menuRevealColour+";color:"+menuRevealColour+";"+menuRevealPos;
								if (currentWidth <= menuScreenWidth) {
								jQuery(removeElements).addClass('menu-remove');
									menuExist = true;
									// add class to body so we don't need to worry about media queries here, all CSS is wrapped in '.menu-container'
									jQuery(menuContainer).addClass("menu-container");
									jQuery('.menu-container').prepend('<div class="menu-mobile"><nav class="menu-nav"></nav></div>');

									//push menu navigation into .menu-nav
									var menuContents = jQuery(menu).html();
									jQuery('.menu-nav').html(menuContents);

									// remove all classes from EVERYTHING inside menu nav
									if(menuRemoveAttrs) {
										jQuery('nav.menu-nav ul, nav.menu-nav ul *').each(function() {
											// First check if this has menu-remove class
											if (jQuery(this).is('.menu-remove')) {
												jQuery(this).attr('class', 'menu-remove');
											} else {
												jQuery(this).removeAttr("class");
											}
											jQuery(this).removeAttr("id");
										});
									}

									// push in a holder div (this can be used if removal of nav is causing layout issues)
									//jQuery(menu).before('<div class="menu-push" />');
									//jQuery('.menu-push').css("margin-top",menuNavPush);

									// hide current navigation and reveal mean nav link
									jQuery(menu).hide();						

									//hide menu-nav ul
									jQuery('.menu-nav ul li ul').hide();

									// hide sub nav
									if(menuShowChildren) {
											// allow expandable sub nav(s)
											if(menuExpandableChildren){
												jQuery('.menu-nav ul ul').each(function() {
														if(jQuery(this).children().length){
																jQuery(this,'li:first').parent().append('<a class="menu-expand" href="#" style="font-size: '+ menuCloseSize +'">'+ menuExpand +'</a>');
														}
												});
												jQuery('.menu-expand').on("click",function(e){
														e.preventDefault();
															if (jQuery(this).hasClass("menu-clicked")) {
																	jQuery(this).html(menuExpand);
																jQuery(this).prev('ul').slideUp(300, function(){});
														} else {
																jQuery(this).html(menuContract);
																jQuery(this).prev('ul').slideDown(300, function(){});
														}
														jQuery(this).toggleClass("menu-clicked");
												});
											} else {
													jQuery('.menu-nav ul ul').show();
											}
									} else {
											jQuery('.menu-nav ul ul').hide();
									}

									// add last class to tidy up borders
									jQuery('.menu-nav ul li').last().addClass('menu-last');
									
									jQuery($navreveal).click(function(e){
										e.preventDefault();
								if( menuOn === false ) {
												$navreveal.css("text-align", "center");
												$navreveal.css("text-indent", "0");
												$navreveal.css("font-size", menuCloseSize);
												jQuery('.menu-nav ul:first').slideDown();
												menuOn = true;
										} else {
											jQuery('.menu-nav ul:first').slideUp();
											menuOn = false;
										}
											$navreveal.toggleClass("menuclose");
											menuInner();
											jQuery(removeElements).addClass('menu-remove');
									});

									// for one page websites, reset all variables...
									if ( onePage ) {
										jQuery('.menu-nav ul > li > a:first-child').on( "click" , function () {
											jQuery('.menu-nav ul:first').slideUp();
											menuOn = false;
											jQuery($navreveal).toggleClass("menuclose").html(menuOpen);
										});
									}
							} else {
								menuOriginal();
							}
						};

						if (!isMobile) {
								// reset menu on resize above menuScreenWidth
								jQuery(window).resize(function () {
										currentWidth = window.innerWidth || document.documentElement.clientWidth;
										if (currentWidth > menuScreenWidth) {
												menuOriginal();
										} else {
											menuOriginal();
										}
										if (currentWidth <= menuScreenWidth) {
												showmenu();
												menuCentered();
										} else {
											menuOriginal();
										}
								});
						}

					jQuery(window).resize(function () {
								// get browser width
								currentWidth = window.innerWidth || document.documentElement.clientWidth;

								if (!isMobile) {
										menuOriginal();
										if (currentWidth <= menuScreenWidth) {
												showmenu();
												menuCentered();
										}
								} else {
										menuCentered();
										if (currentWidth <= menuScreenWidth) {
												if (menuExist === false) {
														showmenu();
												}
										} else {
												menuOriginal();
										}
								}
						});

					// run main menuMenu function on load
					showmenu();
				});
		};
		// menu mobile
		$('.menu-button').click(function(event) {
			$('.menu-mobile').toggleClass('menu-mobile-block');
		});
})(jQuery);
