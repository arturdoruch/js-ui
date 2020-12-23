/*
 * (c) Artur Doruch <arturdoruch@interia.pl>
 */

import $ from 'jquery';
import stringUtils from '@arturdoruch/util/lib/string-utils';

export default {
    /**
     * Adds sliding content event to the HTML elements.
     * The trigger element must have defined "data-*" attribute with value as "id" attribute of the element to slide.
     *
     * Example of HTML code:
     *   <button class="trigger-button" data-slide-content="content-1">Slide</button>
     *   <div id="content-1">
     *       <pre>Long
     *            formatted
     *            text
     *       </pre>
     *   </div>
     *
     * @param {string} [triggerDataAttribute="slide-content"] The trigger HTML element "data" attribute.
     */
    slide(triggerDataAttribute = 'slide-content') {
        let dataSetKey = stringUtils.camelize(triggerDataAttribute);
        let triggers = document.querySelectorAll('*[data-' + triggerDataAttribute + ']'),
            prevContentElement;

        for (let trigger of triggers) {
            const contentElement = document.querySelector('#' + trigger.dataset[dataSetKey]);

            if (!contentElement) {
                continue;
            }
            // Hide parent content element by double clicking.
            contentElement.ondblclick = function (e) {
                $(this).slideUp();
                e.stopPropagation();
            };

            trigger.onclick = function() {
                const contentElement = document.querySelector('#' + trigger.dataset[dataSetKey]);

                if (!contentElement) {
                    return
                }

                $(contentElement).slideToggle();

                if (prevContentElement && prevContentElement !== contentElement && !prevContentElement.querySelector('#' + contentElement.id)) {
                    $(prevContentElement).slideUp();
                }

                prevContentElement = contentElement;
            };
        }
    },

    /**
     * Adds event (to the HTML element) opening text content (e.g. HTML or JSON) of the HTML element
     * in a new browser tab.
     * The trigger element must have defined "data-*" attribute with value as "id" attribute
     * of the element with text content to open.
     *
     * Code example:
     *   <button data-open-in-browser="html-content-1">Open</button>
     *   <div id="html-content-1">
     *       &lt;ul&gt;
     *           &lt;li&gt;Item1&lt;&#47;li&gt;
     *           &lt;li&gt;Item2&lt;&#47;li&gt;
     *       &lt;&#47;ul&gt;
     *   </div>
     *
     * @param {string} [triggerDataAttribute="open-in-browser"] The trigger HTML element "data" attribute.
     */
    openInBrowser(triggerDataAttribute = 'open-in-browser') {
        let dataSetKey = stringUtils.camelize(triggerDataAttribute);
        let triggers = document.querySelectorAll('*[data-' + triggerDataAttribute + ']');

        for (const trigger of triggers) {
            trigger.onclick = function () {
                let element = document.querySelector('#' + this.dataset[dataSetKey]);

                if (!element) {
                    return;
                }

                const div = document.createElement('div');
                div.innerHTML = element.innerHTML;

                window.open().document.body.innerHTML = div.textContent;
            };
        }
    }
}
