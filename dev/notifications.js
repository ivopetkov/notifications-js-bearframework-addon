/*
 * Notifications JS package for Bear Framework
 * https://github.com/ivopetkov/notifications-js-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

/* global clientPackages */

var ivoPetkov = ivoPetkov || {};
ivoPetkov.bearFrameworkAddons = ivoPetkov.bearFrameworkAddons || {};
ivoPetkov.bearFrameworkAddons.notifications = ivoPetkov.bearFrameworkAddons.notifications || (function () {

    var elements = [];

    idCounter = 0;
    var generateID = function () {
        idCounter++;
        return 'ntf' + idCounter;
    };

    var show = (text, options) => {
        if (options === undefined) {
            options = {};
        }
        var autoHide = options.autoHide !== undefined ? options.autoHide : false;
        var autoHideTimout = options.autoHideTimout !== undefined ? options.autoHideTimout : 3000;
        var element = document.createElement('div');
        var id = generateID();
        element.setAttribute('data-notification', '');
        element.innerText = text;
        element.addEventListener('click', () => {
            hide(id);
        });
        document.body.appendChild(element);
        elements.push([id, element]);
        updatePositions(element);
        return new Promise((resolve) => {
            setTimeout(() => {
                element.setAttribute('data-notification-state', 'visible');
                resolve();
                if (autoHide) {
                    setTimeout(() => {
                        hide(id);
                    }, autoHideTimout);
                }
            }, 16);
        });
    };

    var updatePositions = (justAddedElement) => {
        var maxWidth = Math.min(window.innerWidth, Math.floor(document.body.getBoundingClientRect().width));
        var bottom = 0;
        var visibleElementsCount = 0;
        for (var elementData of elements) {
            var element = elementData[1];
            if (isVisible(elementData[0]) || element === justAddedElement) {
                var rect = element.getBoundingClientRect();
                element.style.left = ((maxWidth - rect.width) / 2) + 'px';
                element.style.bottom = 'calc(var(--tooltip-offset-bottom,0) + var(--tooltip-spacing,0)*' + visibleElementsCount + ' + ' + bottom + 'px)';
                bottom += rect.height;
                visibleElementsCount++;
            }
        }
    };

    var isVisible = (id) => {
        for (var elementData of elements) {
            if (elementData[0] === id) {
                var element = elementData[1];
                return element.getAttribute('data-notification-state') === 'visible';
            }
        }
        return false;
    };

    var hide = (id) => {
        if (!isVisible(id)) {
            return;
        }
        for (var elementData of elements) {
            if (elementData[0] === id) {
                var element = elementData[1];
                element.setAttribute('data-notification-state', 'hidden');
                updatePositions();
                setTimeout(() => {
                    element.parentNode.removeChild(element);
                }, 5000);
                return;
            }
        }
    };

    var hideAll = () => {
        for (var elementData of elements) {
            hide(elementData[0]);
        }
    };

    var initialized = false;
    var initialize = function () {
        if (!initialized && document.body !== null) {
            initialized = true;
            window.addEventListener('resize', updatePositions);
        }
    };

    document.addEventListener('readystatechange', () => { // interactive or complete
        initialize();
    });
    initialize();

    return {
        'show': show,
        'hide': hide,
        'hideAll': hideAll,
    };
}());