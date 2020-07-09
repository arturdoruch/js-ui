# User interface

A set of functions adding user interface events to the HTML elements.

## Install

```
yarn add @arturdoruch/ui
```

## Contents

#### Content events

```js
import contentEvents from '@arturdoruch/ui/lib/content-events';
```

Functions

 * slide() - Adds sliding content event.
 * openInBrowser() - Adds event opening text content (e.g. HTML or JSON) of the HTML element in a new browser tab.

#### Scroll events
 
```js
import scrollEvents from '@arturdoruch/ui/lib/scroll-events';
```

Functions

 * pageToTop() - Adds event of scrolling page to the top.

#### Page scroll dispatcher

Scrolling page event dispatcher.
 
```js
import pageScrollDispatcher from '@arturdoruch/ui/lib/page-scroll-dispatcher';
```
