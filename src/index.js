"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a, _b;
var initialState = function () { return ({ progress: 0.08, isRendered: false, status: ['idle'] }); };
var animationId;
var state = initialState();
var removeFirst = function (statuses) { return statuses.slice(1); };
var css = function (element, style) {
    for (var property in style) {
        element.style[property] = style[property];
    }
};
function clamp(n, min, max) {
    if (n < min)
        return min;
    if (n > max)
        return max;
    return n;
}
var toPercentage = function (n) { return (-1 + n) * 100; };
// Render the progress bar with the new state
var render = function () {
    var _a;
    if (!state.isRendered) {
        var progress = document.createElement('div');
        progress.innerHTML = '<div class="bar" role="bar"></div>';
        (_a = document.querySelector('body')) === null || _a === void 0 ? void 0 : _a.appendChild(progress);
        var bar = document.querySelector('.bar');
        var style = { background: 'black', width: '100%', height: '5px', position: 'fixed', top: '0', left: '0', transform: 'translate3d(-100%,0,0)', transition: 'all 200ms' };
        css(bar, style);
        state = __assign(__assign({}, state), { isRendered: true, status: ['running'] });
    }
};
var set = function () {
    var bar = document.querySelector('.bar');
    var style = { background: 'black', width: '100%', height: '5px', position: 'fixed', top: '0', left: '0', transform: 'translate3d(' + toPercentage(state.progress) + '%,0,0)', transition: 'all 200ms ease-in' };
    var stoppedStyled = { background: 'black', width: '100%', height: '5px', position: 'fixed', top: '0', left: '0', transform: 'translate3d(' + toPercentage(1) + '%,0,0)', transition: 'all 200ms ease-in' };
    if (getStatus(state) === 'stopped') {
        css(bar, stoppedStyled);
        return setTimeout(function () {
            var container = bar.parentElement;
            if (container) {
                removeElement(container);
            }
        }, 600);
    }
    if (bar) {
        return css(bar, style);
    }
};
var increment = function (state) {
    return clamp(state.progress + Math.random() * 0.04, 0, 0.994);
};
var isRendered = function () { return !!document.querySelector('.bar'); };
var nextStatus = function (state) { return state.status.length > 1 ? removeFirst(state.status) : state.status; };
// Update the state
var next = function (state) { return (__assign(__assign({}, state), { isRendered: isRendered(), progress: increment(state), status: nextStatus(state) })); };
var reset = function () { return initialState(); };
var removeElement = function (element) { return element.remove(); };
var enqueueStatus = function (state, status) {
    return (__assign(__assign({}, state), { status: state.status.concat(status) }));
};
var getStatus = function (s) { return s.status[0]; };
var run = function (t1) { return function (t2) {
    if (t2 - t1 > 800) {
        if (getStatus(state) === 'stopped') {
            state = reset();
            window.cancelAnimationFrame(animationId);
        }
        else {
            state = next(state);
            set();
            animationId = window.requestAnimationFrame(run(t2));
        }
    }
    else {
        animationId = window.requestAnimationFrame(run(t1));
    }
}; };
(_a = document.getElementById('start')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
    render();
    animationId = window.requestAnimationFrame(run(0));
});
(_b = document.getElementById('stop')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
    state = enqueueStatus(state, 'stopped');
});
