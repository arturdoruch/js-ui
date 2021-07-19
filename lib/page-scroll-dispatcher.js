/*
 * (c) Artur Doruch <arturdoruch@interia.pl>
 */

import $ from 'jquery';
import typeChecker from '@arturdoruch/util/lib/type-checker.js';
import screenUtils from '@arturdoruch/util/lib/screen-utils.js';

let loaded = {},
    listeners = [],
    listenersLength = 0,
    screenHeight = 0,
    interval;

// todo Test dispatcher.

/**
 * Adds listeners called while page is scrolling and specified HTML element starts or stops
 * to be visible on the screen.
 *
 * @param {HTMLElement|jQuery|string} element The HTML element determining position of loading and unloading listeners.
 * @param {function} loadListener    The listener called when page is scrolled down and loadPosition
 *                                   point is reached.
 * @param {function} unloadListener  The listener called when page is scrolled up and unloadPosition
 *                                   point is reached.
 * @param {int} [loadPosition]       Percentage value between 0 - 100. Determines position on the screen,
 *                                   when loadListener should be called, while page is scrolled down.
 * @param {int} [unloadPosition]     Percentage value between 0 - 100. Determines position on the screen,
 *                                   when unloadListener should be called, while page is scrolled up.
 */
function addElementListener(element, loadListener, unloadListener, loadPosition = 12, unloadPosition = 10) {
    listeners.push(new ElementListener(element, loadListener, unloadListener, loadPosition, unloadPosition));
    listenersLength = listeners.length;
}

/**
 * @param {HTMLElement|jQuery} element  HTML element or elements.
 * @param {function} [loadListener]     If specified removes only given listener, otherwise
 *                                      removes all listeners attached to element.
 * @param {string} [elementState]       Sets element state: "load" or "unload".
 */
function removeElementListener(element, loadListener, elementState) {
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
 * @param {ElementListener} listener
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
 * @param {HTMLElement|jQuery|string} element
 * @param {function} loadListener
 * @param {function} unloadListener
 * @param {int} loadPosition
 * @param {int} unloadPosition
 */
function ElementListener(element, loadListener, unloadListener, loadPosition, unloadPosition) {
    this.$elements = $(element);
    this.loadListener = loadListener;
    this.unloadListener = unloadListener;
    this.loadPosition = (100 - loadPosition) / 100;
    this.unloadPosition = (100 - unloadPosition) / 100;

    if (!typeChecker.isFunction(this.loadListener)) {
        throw new TypeError(`The "loadListener" must be a function, but "${typeof this.loadListener}" given.`);
    }

    if (this.unloadListener && !typeChecker.isFunction(this.unloadListener)) {
        throw new TypeError(`The "unloadListener" must be a function, but "${typeof this.unloadListener}" given.`);
    }
}

window.onscroll = function() {
    clearTimeout(interval);
    interval = setTimeout(function() {
        dispatchAll();
    }, 20);
};

window.onresize = function() {
    setViewPortHeight();
};

function setViewPortHeight() {
    screenHeight = screenUtils.getHeight()
}

setViewPortHeight();

export default {
    addElementListener: addElementListener,
    removeElementListener: removeElementListener
};
