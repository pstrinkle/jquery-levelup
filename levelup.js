/**
 * jquery-levelup - jQuery Plugin to draw animated increment and decrement to a number styled from video games.
 * URL: ...
 * Author: Patrick Trinkle <https://github.com/pstrinkle>
 * Version: 0.1.0
 * License: Apache 2
 */
(function ($) {
    /**
     * Set up an animated incrementer/decrementer.
     * 
     * @param configOrCommand - Config object or command name
     *     Example: { ... };
     *     you may set any public property (see above);
     *     you may use .levelup('increment', incrementWith) to increment the value
     *     you may use .levelup('decrement', decrementWith) to decrement the value
     *
     * @param commandArgument - Some commands (like 'increment') may require an argument
     */
    $.fn.levelup = function(configOrCommand, commandArgument) {
        var dataName = 'levelup';
        var trans = {'-webkit-transition' : 'all 0.25s',
                     '-moz-transition' : 'all 0.25s',
                     '-o-transition' : 'all 0.25s',
                     'transition' : 'all 0.25s'};

        /* 
         * Should it always be bold? or is that incorrect, I can't recall yet.
         * I should have it check if the thing beneath it is bold?
         */
        function getStyle(top, left) {
            return "font-weight: bold; position: absolute; top: " + top + "px; left: " + left + "px; z-index : 999;"
        }

        function animateDecrement($tw, update) {
            var p = $tw.position();
            var h = $tw.height();
            var w = $tw.width();            
            var nl = p.left + w; // start it all the way to the left, then figure out its width
            var nt = p.top; // they have the same height, so just position it at the same place.
            var $x = $('<span>', {text: "-" + update, style: getStyle(nt, nl) });
            // width is 0 until it's rendered.
            $tw.parent().append($x);
            var realWidth = $x.width();
            var newerLeft = nl - realWidth;
            $x.css('left', newerLeft + 'px');

            // lower if after 1/10th of a second, this is better.
            setTimeout(function(){
                $x.css(trans);
                var e = nt + (h);
                $x.css('top', e + 'px');
                setTimeout(function() {
                    $x.remove();
                    $tw.text($tw.data(dataName)); // so it goes down correctly
                }, 250);
            }, 100);
        }

        function animateIncrement($tw, update) {
            var p = $tw.position();
            var h = $tw.height();
            var w = $tw.width();
            var nl = p.left + w; // start it all the way to the left, then figure out its width
            var nt = p.top - h; // they have the same height, so just position it above by the height.
            var $x = $('<span>', {text: "+" + update, style: getStyle(nt, nl) });
            // width is 0 until it's rendered.
            $tw.parent().append($x);
            var realWidth = $x.width();
            var newerLeft = nl - realWidth;
            $x.css('left', newerLeft + 'px');

            // lower if after ~1/4th of a second.
            setTimeout(function(){
                $x.css(trans);
                var e = nt + (h);
                $x.css('top', e + 'px');
                setTimeout(function() {
                    $x.remove();
                    $tw.text($tw.data(dataName));
                }, 250);
            }, 100);
        }

        /* It is possible that the text will be updated out of sequence
         * because of the timeouts, that you might not end up with the
         * right value, so the right value is basically always in data.
         */
        if (typeof configOrCommand == 'string') {
            if (configOrCommand === 'increment') {
                /* you want to update this here in case they call it a lot. */
                return this.each(function() {
                    var curr = parseInt($(this).data(dataName));
                    var next = curr + commandArgument;

                    $(this).data(dataName, next);
                    animateIncrement($(this), commandArgument);
                });
            } else if (configOrCommand === 'decrement') {
                return this.each(function() {
                    var curr = parseInt($(this).data(dataName));
                    var next = curr - commandArgument;

                    $(this).data(dataName, next);
                    animateDecrement($(this), commandArgument);
                });
            }
        }

        /* handle init here, I later plan to use other options, such as formatting. */
        return this.each(function() {
            var el = $(this), instance = el.data(dataName),
                config = $.isPlainObject(configOrCommand) ? configOrCommand : {};

            if (instance) {
                /* they've set up some data values for us already to use. */
            } else {
                var initialConfig = $.extend({}, el.data());
                config = $.extend(initialConfig, config);
          
                /* should have defaults. */
                if (config.start == undefined) {
                    el.data(dataName, 0);
                    el.text('0');
                } else {
                    el.data(dataName, config.start);
                    el.text(config.start);
                }
            }
        });
    };
}(jQuery));
