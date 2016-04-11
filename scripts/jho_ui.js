/*
 * jho_ui.js
 *
 * contains javascript for the ui behavior
 */
 /**
 *	Contact for specific
 */






 function initContactForm(){
 	$(".jho_greyarea").click(function(e){
 		if(e.target.tagName.toLowerCase() === "center"){
 			$(".jho_greyarea").toggleClass("hidden");

 		}
	});


	$(".jho_submit-button").click(function(e){
		e.preventDefault();

		var err = "";
 		var validName = /^([A-Z][a-z]{1,20}[ ]?)*$/g.test($("#cform_name").val());
 		var validEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test($("#cform_email").val());


 		if(!(validName && validEmail)){
 			$(".jho_statusmessage").text("Name and email invalid");
 			return;
 		}else if(!validName){
 			$(".jho_statusmessage").text("Name invalid");
 			return;
 		}else if(!validEmail){
 			$(".jho_statusmessage").text("Email invalid");
 			return;
 		}

 		if($("#cfom_message").text().length > 25){
 			$(".jho_statusmessage").text("Message too short");
 			return;
 		}


 		$(".jho_contact").submit();
		$(".jho_statusmessage").text("Your request has been sent!");
		$(".jho_submit-button").prop("disabled", true);
		$(".jho_contact").bind('ajax:complete', function() {
			$(".jho_statusmessage").text("Your request was successfull!");
   		});
	});
 }

 /**
 *	Navigation
 */
 function updateNavbar(li){
 	if(li){
		if( li.hasClass("menu__item--current") ) // alreddy selected
			return;
		$(".menu__item--current").removeClass("menu__item--current");
		li.addClass("menu__item--current");
	}
 }
function initNavigation(){
	$('a[href^="#"]').click(function(e){
		e.preventDefault();

		switch($(e.target).text().toLowerCase()){
			case "welcome":
				$('html, body').animate({
    				scrollTop: 0,
				}, 500);
				updateNavbar($(".menu__link:eq(0)").parent());
			break;
			case "about":
				$('html, body').animate({
    				scrollTop: $(".jho_table-hub").offset().top - 100,
				}, 500);
				updateNavbar($(".menu__link:eq(1)").parent());
			break;
			case "contact":
				$(".jho_greyarea").toggleClass("hidden");
				updateNavbar($(".menu__link:eq(3)").parent());
			break;
		}
	});
}
/**
*	From: http://lcdsantos.github.io/jquery-drawsvg/
*/
(function($) {
  'use strict';

  var pluginName = 'drawsvg',
      defaults = {
        duration: 1000,
        stagger: 200,
        easing: 'swing',
        reverse: false,
        callback: $.noop
      },
      DrawSvg = (function() {
        var fn = function fn(elm, options) {
          var _this = this,
              opts = $.extend(defaults, options);

          _this.$elm = $(elm);

          if ( !_this.$elm.is('svg') )
            return;

          _this.options = opts;
          _this.$paths = _this.$elm.find('path');

          _this.totalDuration = opts.duration + (opts.stagger * _this.$paths.length);
          _this.duration = opts.duration / _this.totalDuration;

          _this.$paths.each(function(index, elm) {
            var pathLength = elm.getTotalLength();

            elm.pathLen = pathLength;
            elm.delay = (opts.stagger * index) / _this.totalDuration;
            elm.style.strokeDasharray = [pathLength, pathLength].join(' ');
            elm.style.strokeDashoffset = pathLength;
          });

          _this.$elm.attr('class', function(index, classNames) {
            return [classNames, pluginName + '-initialized'].join(' ');
          });
        };

        fn.prototype.getVal = function(p, easing) {
          return 1 - $.easing[easing](p, p, 0, 1, 1);
        };

        fn.prototype.progress = function progress(prog) {
          var _this = this,
              opts = _this.options,
              length = _this.$paths.length,
              duration = _this.duration,
              stagger = opts.stagger;

          _this.$paths.each(function(index, elm) {
            var elmStyle = elm.style;

            if ( prog === 1 ) {
              elmStyle.strokeDashoffset = 0;
            } else if ( prog === 0 ) {
              elmStyle.strokeDashoffset = elm.pathLen + 'px';
            } else if ( prog >= elm.delay && prog <= duration + elm.delay ) {
              var p = ((prog - elm.delay) / duration);
              elmStyle.strokeDashoffset = ((_this.getVal(p, opts.easing) * elm.pathLen) * (opts.reverse ? -1 : 1)) + 'px';
            }
          });
        };

        fn.prototype.animate = function animate() {
          var _this = this;

          _this.$elm.attr('class', function(index, classNames) {
            return [classNames, pluginName + '-animating'].join(' ');
          });

          $({ len: 0 }).animate({
            len: 1
          }, {
            easing: 'linear',
            duration: _this.totalDuration,
            step: function(now, fx) {
              _this.progress.call(_this, now / fx.end);
            },
            complete: function() {
              _this.options.callback.call(this);

              _this.$elm.attr('class', function(index, classNames) {
                return classNames.replace(pluginName + '-animating', '');
              });
            }
          });
        };
        return fn;
      })();
  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function(method, args) {
    return this.each(function() {
      var data = $.data(this, pluginName);

      ( data && ''+method === method && data[method] ) ?
        data[method](args) :
        $.data(this, pluginName, new DrawSvg(this, method));
    });
  };
}(jQuery));

//  From Modernizr, found here: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/touchevents.js
function is_touch_device() {
  return 'ontouchstart' in window
      || navigator.maxTouchPoints	// works on IE10/11 and Surface
      || (window.DocumentTouch && document instanceof DocumentTouch);
};

/**
*	Animation for table svg
*/
function animateTable(){
    var $table = $(".svg_table").drawsvg({
    	callback: function(){
    		// Make button visible - make invisible on click -
    	}
    });
	$(window).on('scroll', function() {
			var begin = -$table.offset().top + $(window).scrollTop() + $(".jho_table-hub").height();
			if(begin > 0){
				$(window).off('scroll');
				$table.drawsvg('animate');
				initNavbar(); // the "off" function turns off the navbar scroll listener aswell
			}
	});
}
/**
*	For the navbar
*/
var nullPos = $(".jho_header-menu").offset().top + 14; // margin 15px - border 1px
function initNavbar(){
	// remembers the initial position
	$(window).scroll(function(){
		if(nullPos < $(window).scrollTop()){
			if(!$(".jho_header-menu").hasClass("bound")){
				$(".jho_header-menu").toggleClass("bound");
			}
		}else if(nullPos > $(window).scrollTop()){
			if($(".jho_header-menu").hasClass("bound")){
				$(".jho_header-menu").toggleClass("bound");
			}
		}
	});
}

/**
*	Hamburger menu
*/
function initBurger(){
	$(".jho_hamburger-menu").click(function(){
		$(".jho_closing-menu").toggleClass("open");
		$(".jho_hidden-menu").toggleClass("show");
	});
}
/**
*	For the interactive lightbulb
*/
function initBulb(){
	var card_text = [
		{ 	// Base
			head: "Educational foundation",
			body: "Knowing calculus and university physics might not be the most important skills in software development, but helps in understanding how things work and therefore how to solve certain problems. A solid foundation of which the rest of the skills are based upon."
		},
		{	// Screen-cog
			head: "Foundational engineering knowledge",
			body: "I have foundational knowledge about how computers work, which helps understand problems and therefore speeds up development. In particular, i have knowledge about scripting and commands on the linux platform."
		},
		{	// { }, languages
			head: "Computer languages",
			body: "I dont have lots of experience working with one platform or language, however i have a great understanding about how the different languages work and how to utilize their traits. Most of my experience is with C like languages like Java, C# and C++. "
		},
		{	// Web dev
			head: "Web development",
			body: "I have knowledge about developing for and in the web. This includes both patterns and frameworks, but also network programming aswell as knowledge about networking protocols and technologies. The frameworks include spring, nodejs, angularjs and .net.",
		},
		{	// Mobile
			head: "Mobile integration",
			body: "Many of us cant think of a world without their cellphone. It is therefore important to have the knowhow to make mobile applications. I have expereience with the android platform and know how to create platform independent web applications.",
		},
		{   //sysdev
			head: "Systems development",
			body: "I have hands on experience working with distributed and larger scale systems. I can recognize patterns and know methologies around constructing and maintaining larger scale systems. Knowing agile and lean development speeds up the process, but nothing beats hard work.",
		},
		{ 	// people
			head: "Commucation skills",
			body: "Most of my work as a student is individually, however i work very well with other people. I can bring creative ideas to the table, and at the same time acknowledge different beliefs and work with those. I am not afraid to admit that i am wrong, and i think that self reflection is very important when working with other people.",
		},
		{	// addition
			head: "Additional knowledge",
			body: "Some things are too specific to list here, and some personal traits just cannot be explained with words. Even if you have an open source project or just want to ask some questions, i am probably interested. Don't be afraid to ask!",
		},
		{	// cloud
			head: "Storage and cloud",
			body: "Modern applications are created faster, cheaper and more optimized than before. Altough i am well versed in SQL, i am also familiar with NoSQL technologies such as MongoDB, Redis and RethinkDB. I also know a thing or two about different cloud platforms and technologies, which are important to consider in today's marked.",
		}
	];
	if(is_touch_device()){
		// changes text to tap on touch screens
		$(".jho_idea-hub center p").text("Tap to take a closer look");
	}

	function setCardText(head, body){
		$(".jho_hovercard h3").text(head);
		$(".jho_hovercard p").text(body);
	}
	function updateCardPosition(passedEvent){
		var card = $(".jho_hovercard");
		var elem = $( passedEvent.target );
		// Checks if screen is smaller than 2x card or if we have a touch device
		if($( document ).width() >  $(".jho_hovercard").width()*2 || !is_touch_device()){
			// Continous update
			$( elem ).on( "mousemove", function( e ) {
	  			var ypos = (e.pageY - $(window).scrollTop());
	  			if(ypos > ($(window).height()/2)){
	  				ypos -= card.height()+5;
	  			}else{
	  				ypos += +5;
	  			}
	  			card.css("top",ypos);
				card.css("left",e.pageX+5);
			});
		}else{ // on small screens and touch devices
			var ypos = (passedEvent.pageY - $(window).scrollTop());
	  		if(ypos > ($(window).height()/2)){
				card.css("top", 43);
	  		}else{
				card.css("top", $(window).height()-card.height());
	  		}
			card.css("left", ($(window).width()-card.width())/2);
		}
	}
	// this.prototype.showCard = function(){}..
	function showCard(){
		// Displays the card - assumes we only have 1 (add clauses ? )
		$(".jho_hovercard").css("display", "block");
	}
	// Removes the event listener that we attach on larger screens and hides the card
	function hideCard(elem){
		if(elem != undefined){ // incase screen was resized (aka we call it anyway)
			$( elem ).off("mousemove");
		}
		$(".jho_hovercard").css("display", "none");
	}

	for(var i = 0; i < 9; ++i){

    $((".jho_bulb-group" + i)).on({
          mouseenter: function (e) {
            var index = $(e.target).attr("class").slice(-1);
      			$((".jho_bulb-group" + index)).css("opacity", 0.5);

      			setCardText(card_text[index].head, card_text[index].body); // Needs to be done before position (uses actual size)
      			updateCardPosition(e);
      			showCard();
        },mouseleave:function (e) {
            var target_group = $((".jho_bulb-group" + $(e.target).attr("class").slice(-1)));
    			  target_group.css("opacity", 1);
    			  // hide the card
    			  hideCard(target_group);
        }
    },false);
	}
}

// Initialization on dom load
$(document).ready(function(){
	'use strict'

	initBurger();
	initNavbar();
	initNavigation();
	animateTable();
	initBulb();
	initContactForm();
});
