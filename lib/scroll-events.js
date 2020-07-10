/*
 * (c) Artur Doruch <arturdoruch@interia.pl>
 */

import $ from 'jquery';

export default {
    /**
     * Adds an event (to the HTML element) of scrolling page to the top.
     *
     * @param {jQuery|HTMLElement|string} trigger The element triggering scrolling page to the top.
     *                                            jQuery or HTMLElement object or CSS selector.
     * @param {{}} [options]
     * @param {Number} [options.triggerShowPosition] Position (counting from the viewport top) in pixels,
     *                                               when trigger element should be appear.
     * @param {Number} [options.scrollingSpeed]
     */
    pageToTop(trigger, options) {
        options = Object.assign({
            triggerShowPosition: 700,
            scrollingSpeed: 500
        }, options);

        const $trigger = $(trigger).hide();

        window.addEventListener('scroll', function () {
            if (window.pageYOffset > options.triggerShowPosition) {
                $trigger.fadeIn();
            } else {
                $trigger.fadeOut();
            }
        });

        $trigger.on('click', function (e) {
            e.preventDefault();
            $('body, html').animate({scrollTop: 0}, options.scrollingSpeed);
        });
    }
}
