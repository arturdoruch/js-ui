/*
 * (c) Artur Doruch <arturdoruch@interia.pl>
 */

import $ from 'jquery';
import objectUtils from '@arturdoruch/util/lib/object-utils';
import screenUtils from '@arturdoruch/util/lib/screen-utils';

let loaded = {},
    listeners = [],
    listenersLength = 0,
    screenHeight = 0,
    interval;

// todo Test dispatcher.

/**
 * @param {HTMLElement|jQuery} element  HTML element or elements.
 * @param {function} loadListener       The listener called when page is scrolled down and loadPosition
 *                                      point is reached.
 * @param {function|int} unloadListener The listener called when page is scrolled up and unloadPosition
 *                                      point is reached.
 *                                      If integer given, then will be considered as loadPosition.
 * @param {int} [loadPosition=12]       Percentage value between 0 - 100. Determines position on the screen,
 *                                      when loadListener should be called, while page is scrolled down.
 * @param {int} [unloadPosition=10]     Percentage value between 0 - 100. Determines position on the screen,
 *                                      when unloadListener should be called, while page is scrolled up.
 */
function addListener(element, loadListener, unloadListener, loadPosition = 12, unloadPosition = 10) {
    listeners.push(new ScrollListener(element, loadListener, unloadListener, loadPosition, unloadPosition));
    listenersLength = listeners.length;
}

/**
 * @param {HTMLElement|jQuery} element  HTML element or elements.
 * @param {function} [loadListener]     If specified removes only given listener, otherwise
 *                                      removes all listeners attached to element.
 * @param {string} [elementState]       Sets element state: "load" or "unload".
 */
function removeListener(element, loadListener, elementState) {
    element = $(element);

    listeners = listeners.filter(function (listener) {
        if (listener.element[0] === element[0] && (!loadListener || loadListener === listener.unloadListener)) {
            if (listener[elementState + 'Listener']) {
                listener[elementState + 'Listener'](element, elementState);
            }
            return false;
        }
        return true;
    });

    listenersLength = listeners.length;
}

function dispatchAll() {
    let i = 0;

    for (; i < listenersLength; i++) {
        dispatch(listeners[i], i);
    }
}

/**
 * @param {ScrollListener} listener
 * @param {int}            listenerIndex
 */
function dispatch(listener, listenerIndex) {
    let index,
        i = 0,
        $elements = listener.$elements,
        element;

    for (; i < $elements.length; i++) {
        index = i + listenerIndex.toString();
        element = $elements[i];

        if (!loaded[index] || loaded[index] === false) {
            // Load content
            if (window.pageYOffset > $(element).offset().top - (screenHeight * listener.loadPosition)) {
                //setTimeout( function() {
                listener.loadListener(element, 'load');
                //}, 30);
                loaded[index] = true;
            }
        } else if (listener.unloadListener) {
            // Unload content
            if (window.pageYOffset < $(element).offset().top - (screenHeight * listener.unloadPosition)) {
                //setTimeout( function() {
                listener.unloadListener(element, 'unload');
                //}, 30);
                loaded[index] = false;
            }
        }
    }
}

/**
 * @param {HTMLElement|jQuery} element
 * @param {function}     loadListener
 * @param {function|int} unloadListener
 * @param {int}          [loadPosition=12]
 * @param {int}          [unloadPosition=10]
 */
function ScrollListener(element, loadListener, unloadListener, loadPosition, unloadPosition) {
    this.$elements = $(element);
    this.loadListener = loadListener;
    this.unloadListener = unloadListener;

    if (objectUtils.is('number', unloadListener)) {
        this.unloadListener = null;
        loadPosition = unloadListener;
    }

    this.loadPosition = (100 - loadPosition) / 100;
    this.unloadPosition = (100 - unloadPosition) / 100;

    if (!objectUtils.is('function', this.loadListener)) {
        throw new Error('The "loadListener" must be a function, ' + typeof this.loadListener + ' given.');
    }

    if (this.unloadListener && !objectUtils.is('function', this.unloadListener)) {
        throw new Error('The "unloadListener" must be a function, ' + typeof this.unloadListener + ' given.');
    }
}

function setViewPortHeight() {
    screenHeight = screenUtils.getHeight()
}

setViewPortHeight();

$(window).scroll(function() {
    clearTimeout(interval);
    interval = setTimeout(function() {
        dispatchAll();
    }, 20);
});

$(window).resize(function() {
    setViewPortHeight();
});

export default {
    addListener,
    removeListener
};
