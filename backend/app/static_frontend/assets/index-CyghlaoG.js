var bv=Object.defineProperty;var Av=(t,e,n)=>e in t?bv(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var it=(t,e,n)=>Av(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function l0(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var c0={exports:{}},Ql={},u0={exports:{}},je={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ya=Symbol.for("react.element"),Cv=Symbol.for("react.portal"),Rv=Symbol.for("react.fragment"),Pv=Symbol.for("react.strict_mode"),Nv=Symbol.for("react.profiler"),Dv=Symbol.for("react.provider"),Lv=Symbol.for("react.context"),Iv=Symbol.for("react.forward_ref"),Uv=Symbol.for("react.suspense"),Fv=Symbol.for("react.memo"),Ov=Symbol.for("react.lazy"),Bh=Symbol.iterator;function kv(t){return t===null||typeof t!="object"?null:(t=Bh&&t[Bh]||t["@@iterator"],typeof t=="function"?t:null)}var f0={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},d0=Object.assign,h0={};function Ys(t,e,n){this.props=t,this.context=e,this.refs=h0,this.updater=n||f0}Ys.prototype.isReactComponent={};Ys.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Ys.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function p0(){}p0.prototype=Ys.prototype;function md(t,e,n){this.props=t,this.context=e,this.refs=h0,this.updater=n||f0}var gd=md.prototype=new p0;gd.constructor=md;d0(gd,Ys.prototype);gd.isPureReactComponent=!0;var zh=Array.isArray,m0=Object.prototype.hasOwnProperty,_d={current:null},g0={key:!0,ref:!0,__self:!0,__source:!0};function _0(t,e,n){var i,r={},s=null,a=null;if(e!=null)for(i in e.ref!==void 0&&(a=e.ref),e.key!==void 0&&(s=""+e.key),e)m0.call(e,i)&&!g0.hasOwnProperty(i)&&(r[i]=e[i]);var o=arguments.length-2;if(o===1)r.children=n;else if(1<o){for(var l=Array(o),c=0;c<o;c++)l[c]=arguments[c+2];r.children=l}if(t&&t.defaultProps)for(i in o=t.defaultProps,o)r[i]===void 0&&(r[i]=o[i]);return{$$typeof:Ya,type:t,key:s,ref:a,props:r,_owner:_d.current}}function Bv(t,e){return{$$typeof:Ya,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function vd(t){return typeof t=="object"&&t!==null&&t.$$typeof===Ya}function zv(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var Vh=/\/+/g;function Mc(t,e){return typeof t=="object"&&t!==null&&t.key!=null?zv(""+t.key):e.toString(36)}function Zo(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var a=!1;if(t===null)a=!0;else switch(s){case"string":case"number":a=!0;break;case"object":switch(t.$$typeof){case Ya:case Cv:a=!0}}if(a)return a=t,r=r(a),t=i===""?"."+Mc(a,0):i,zh(r)?(n="",t!=null&&(n=t.replace(Vh,"$&/")+"/"),Zo(r,e,n,"",function(c){return c})):r!=null&&(vd(r)&&(r=Bv(r,n+(!r.key||a&&a.key===r.key?"":(""+r.key).replace(Vh,"$&/")+"/")+t)),e.push(r)),1;if(a=0,i=i===""?".":i+":",zh(t))for(var o=0;o<t.length;o++){s=t[o];var l=i+Mc(s,o);a+=Zo(s,e,n,l,r)}else if(l=kv(t),typeof l=="function")for(t=l.call(t),o=0;!(s=t.next()).done;)s=s.value,l=i+Mc(s,o++),a+=Zo(s,e,n,l,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return a}function ao(t,e,n){if(t==null)return t;var i=[],r=0;return Zo(t,i,"","",function(s){return e.call(n,s,r++)}),i}function Vv(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var un={current:null},Qo={transition:null},Hv={ReactCurrentDispatcher:un,ReactCurrentBatchConfig:Qo,ReactCurrentOwner:_d};function v0(){throw Error("act(...) is not supported in production builds of React.")}je.Children={map:ao,forEach:function(t,e,n){ao(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return ao(t,function(){e++}),e},toArray:function(t){return ao(t,function(e){return e})||[]},only:function(t){if(!vd(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};je.Component=Ys;je.Fragment=Rv;je.Profiler=Nv;je.PureComponent=md;je.StrictMode=Pv;je.Suspense=Uv;je.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Hv;je.act=v0;je.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=d0({},t.props),r=t.key,s=t.ref,a=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,a=_d.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var o=t.type.defaultProps;for(l in e)m0.call(e,l)&&!g0.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&o!==void 0?o[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){o=Array(l);for(var c=0;c<l;c++)o[c]=arguments[c+2];i.children=o}return{$$typeof:Ya,type:t.type,key:r,ref:s,props:i,_owner:a}};je.createContext=function(t){return t={$$typeof:Lv,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:Dv,_context:t},t.Consumer=t};je.createElement=_0;je.createFactory=function(t){var e=_0.bind(null,t);return e.type=t,e};je.createRef=function(){return{current:null}};je.forwardRef=function(t){return{$$typeof:Iv,render:t}};je.isValidElement=vd;je.lazy=function(t){return{$$typeof:Ov,_payload:{_status:-1,_result:t},_init:Vv}};je.memo=function(t,e){return{$$typeof:Fv,type:t,compare:e===void 0?null:e}};je.startTransition=function(t){var e=Qo.transition;Qo.transition={};try{t()}finally{Qo.transition=e}};je.unstable_act=v0;je.useCallback=function(t,e){return un.current.useCallback(t,e)};je.useContext=function(t){return un.current.useContext(t)};je.useDebugValue=function(){};je.useDeferredValue=function(t){return un.current.useDeferredValue(t)};je.useEffect=function(t,e){return un.current.useEffect(t,e)};je.useId=function(){return un.current.useId()};je.useImperativeHandle=function(t,e,n){return un.current.useImperativeHandle(t,e,n)};je.useInsertionEffect=function(t,e){return un.current.useInsertionEffect(t,e)};je.useLayoutEffect=function(t,e){return un.current.useLayoutEffect(t,e)};je.useMemo=function(t,e){return un.current.useMemo(t,e)};je.useReducer=function(t,e,n){return un.current.useReducer(t,e,n)};je.useRef=function(t){return un.current.useRef(t)};je.useState=function(t){return un.current.useState(t)};je.useSyncExternalStore=function(t,e,n){return un.current.useSyncExternalStore(t,e,n)};je.useTransition=function(){return un.current.useTransition()};je.version="18.3.1";u0.exports=je;var ve=u0.exports;const x0=l0(ve);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Gv=ve,Wv=Symbol.for("react.element"),Xv=Symbol.for("react.fragment"),jv=Object.prototype.hasOwnProperty,$v=Gv.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Yv={key:!0,ref:!0,__self:!0,__source:!0};function y0(t,e,n){var i,r={},s=null,a=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(a=e.ref);for(i in e)jv.call(e,i)&&!Yv.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:Wv,type:t,key:s,ref:a,props:r,_owner:$v.current}}Ql.Fragment=Xv;Ql.jsx=y0;Ql.jsxs=y0;c0.exports=Ql;var M=c0.exports,Cu={},S0={exports:{}},Pn={},M0={exports:{}},E0={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(L,j){var Q=L.length;L.push(j);e:for(;0<Q;){var ne=Q-1>>>1,le=L[ne];if(0<r(le,j))L[ne]=j,L[Q]=le,Q=ne;else break e}}function n(L){return L.length===0?null:L[0]}function i(L){if(L.length===0)return null;var j=L[0],Q=L.pop();if(Q!==j){L[0]=Q;e:for(var ne=0,le=L.length,Oe=le>>>1;ne<Oe;){var ke=2*(ne+1)-1,He=L[ke],Z=ke+1,se=L[Z];if(0>r(He,Q))Z<le&&0>r(se,He)?(L[ne]=se,L[Z]=Q,ne=Z):(L[ne]=He,L[ke]=Q,ne=ke);else if(Z<le&&0>r(se,Q))L[ne]=se,L[Z]=Q,ne=Z;else break e}}return j}function r(L,j){var Q=L.sortIndex-j.sortIndex;return Q!==0?Q:L.id-j.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var a=Date,o=a.now();t.unstable_now=function(){return a.now()-o}}var l=[],c=[],d=1,h=null,u=3,p=!1,m=!1,E=!1,g=typeof setTimeout=="function"?setTimeout:null,f=typeof clearTimeout=="function"?clearTimeout:null,_=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function S(L){for(var j=n(c);j!==null;){if(j.callback===null)i(c);else if(j.startTime<=L)i(c),j.sortIndex=j.expirationTime,e(l,j);else break;j=n(c)}}function y(L){if(E=!1,S(L),!m)if(n(l)!==null)m=!0,H(b);else{var j=n(c);j!==null&&I(y,j.startTime-L)}}function b(L,j){m=!1,E&&(E=!1,f(x),x=-1),p=!0;var Q=u;try{for(S(j),h=n(l);h!==null&&(!(h.expirationTime>j)||L&&!P());){var ne=h.callback;if(typeof ne=="function"){h.callback=null,u=h.priorityLevel;var le=ne(h.expirationTime<=j);j=t.unstable_now(),typeof le=="function"?h.callback=le:h===n(l)&&i(l),S(j)}else i(l);h=n(l)}if(h!==null)var Oe=!0;else{var ke=n(c);ke!==null&&I(y,ke.startTime-j),Oe=!1}return Oe}finally{h=null,u=Q,p=!1}}var w=!1,A=null,x=-1,C=5,N=-1;function P(){return!(t.unstable_now()-N<C)}function z(){if(A!==null){var L=t.unstable_now();N=L;var j=!0;try{j=A(!0,L)}finally{j?K():(w=!1,A=null)}}else w=!1}var K;if(typeof _=="function")K=function(){_(z)};else if(typeof MessageChannel<"u"){var ee=new MessageChannel,O=ee.port2;ee.port1.onmessage=z,K=function(){O.postMessage(null)}}else K=function(){g(z,0)};function H(L){A=L,w||(w=!0,K())}function I(L,j){x=g(function(){L(t.unstable_now())},j)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(L){L.callback=null},t.unstable_continueExecution=function(){m||p||(m=!0,H(b))},t.unstable_forceFrameRate=function(L){0>L||125<L?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):C=0<L?Math.floor(1e3/L):5},t.unstable_getCurrentPriorityLevel=function(){return u},t.unstable_getFirstCallbackNode=function(){return n(l)},t.unstable_next=function(L){switch(u){case 1:case 2:case 3:var j=3;break;default:j=u}var Q=u;u=j;try{return L()}finally{u=Q}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(L,j){switch(L){case 1:case 2:case 3:case 4:case 5:break;default:L=3}var Q=u;u=L;try{return j()}finally{u=Q}},t.unstable_scheduleCallback=function(L,j,Q){var ne=t.unstable_now();switch(typeof Q=="object"&&Q!==null?(Q=Q.delay,Q=typeof Q=="number"&&0<Q?ne+Q:ne):Q=ne,L){case 1:var le=-1;break;case 2:le=250;break;case 5:le=1073741823;break;case 4:le=1e4;break;default:le=5e3}return le=Q+le,L={id:d++,callback:j,priorityLevel:L,startTime:Q,expirationTime:le,sortIndex:-1},Q>ne?(L.sortIndex=Q,e(c,L),n(l)===null&&L===n(c)&&(E?(f(x),x=-1):E=!0,I(y,Q-ne))):(L.sortIndex=le,e(l,L),m||p||(m=!0,H(b))),L},t.unstable_shouldYield=P,t.unstable_wrapCallback=function(L){var j=u;return function(){var Q=u;u=j;try{return L.apply(this,arguments)}finally{u=Q}}}})(E0);M0.exports=E0;var qv=M0.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Kv=ve,Rn=qv;function re(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var T0=new Set,Ra={};function Wr(t,e){Is(t,e),Is(t+"Capture",e)}function Is(t,e){for(Ra[t]=e,t=0;t<e.length;t++)T0.add(e[t])}var Li=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Ru=Object.prototype.hasOwnProperty,Zv=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Hh={},Gh={};function Qv(t){return Ru.call(Gh,t)?!0:Ru.call(Hh,t)?!1:Zv.test(t)?Gh[t]=!0:(Hh[t]=!0,!1)}function Jv(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function ex(t,e,n,i){if(e===null||typeof e>"u"||Jv(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function fn(t,e,n,i,r,s,a){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=a}var qt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){qt[t]=new fn(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];qt[e]=new fn(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){qt[t]=new fn(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){qt[t]=new fn(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){qt[t]=new fn(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){qt[t]=new fn(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){qt[t]=new fn(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){qt[t]=new fn(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){qt[t]=new fn(t,5,!1,t.toLowerCase(),null,!1,!1)});var xd=/[\-:]([a-z])/g;function yd(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(xd,yd);qt[e]=new fn(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(xd,yd);qt[e]=new fn(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(xd,yd);qt[e]=new fn(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){qt[t]=new fn(t,1,!1,t.toLowerCase(),null,!1,!1)});qt.xlinkHref=new fn("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){qt[t]=new fn(t,1,!1,t.toLowerCase(),null,!0,!0)});function Sd(t,e,n,i){var r=qt.hasOwnProperty(e)?qt[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(ex(e,n,r,i)&&(n=null),i||r===null?Qv(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var ki=Kv.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,oo=Symbol.for("react.element"),us=Symbol.for("react.portal"),fs=Symbol.for("react.fragment"),Md=Symbol.for("react.strict_mode"),Pu=Symbol.for("react.profiler"),w0=Symbol.for("react.provider"),b0=Symbol.for("react.context"),Ed=Symbol.for("react.forward_ref"),Nu=Symbol.for("react.suspense"),Du=Symbol.for("react.suspense_list"),Td=Symbol.for("react.memo"),qi=Symbol.for("react.lazy"),A0=Symbol.for("react.offscreen"),Wh=Symbol.iterator;function Qs(t){return t===null||typeof t!="object"?null:(t=Wh&&t[Wh]||t["@@iterator"],typeof t=="function"?t:null)}var wt=Object.assign,Ec;function ha(t){if(Ec===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Ec=e&&e[1]||""}return`
`+Ec+t}var Tc=!1;function wc(t,e){if(!t||Tc)return"";Tc=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var i=c}Reflect.construct(t,[],e)}else{try{e.call()}catch(c){i=c}t.call(e.prototype)}else{try{throw Error()}catch(c){i=c}t()}}catch(c){if(c&&i&&typeof c.stack=="string"){for(var r=c.stack.split(`
`),s=i.stack.split(`
`),a=r.length-1,o=s.length-1;1<=a&&0<=o&&r[a]!==s[o];)o--;for(;1<=a&&0<=o;a--,o--)if(r[a]!==s[o]){if(a!==1||o!==1)do if(a--,o--,0>o||r[a]!==s[o]){var l=`
`+r[a].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=a&&0<=o);break}}}finally{Tc=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?ha(t):""}function tx(t){switch(t.tag){case 5:return ha(t.type);case 16:return ha("Lazy");case 13:return ha("Suspense");case 19:return ha("SuspenseList");case 0:case 2:case 15:return t=wc(t.type,!1),t;case 11:return t=wc(t.type.render,!1),t;case 1:return t=wc(t.type,!0),t;default:return""}}function Lu(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case fs:return"Fragment";case us:return"Portal";case Pu:return"Profiler";case Md:return"StrictMode";case Nu:return"Suspense";case Du:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case b0:return(t.displayName||"Context")+".Consumer";case w0:return(t._context.displayName||"Context")+".Provider";case Ed:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case Td:return e=t.displayName||null,e!==null?e:Lu(t.type)||"Memo";case qi:e=t._payload,t=t._init;try{return Lu(t(e))}catch{}}return null}function nx(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Lu(e);case 8:return e===Md?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function dr(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function C0(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function ix(t){var e=C0(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(a){i=""+a,s.call(this,a)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(a){i=""+a},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function lo(t){t._valueTracker||(t._valueTracker=ix(t))}function R0(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=C0(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function _l(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Iu(t,e){var n=e.checked;return wt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function Xh(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=dr(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function P0(t,e){e=e.checked,e!=null&&Sd(t,"checked",e,!1)}function Uu(t,e){P0(t,e);var n=dr(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?Fu(t,e.type,n):e.hasOwnProperty("defaultValue")&&Fu(t,e.type,dr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function jh(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function Fu(t,e,n){(e!=="number"||_l(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var pa=Array.isArray;function Es(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+dr(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function Ou(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(re(91));return wt({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function $h(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(re(92));if(pa(n)){if(1<n.length)throw Error(re(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:dr(n)}}function N0(t,e){var n=dr(e.value),i=dr(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function Yh(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function D0(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function ku(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?D0(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var co,L0=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(co=co||document.createElement("div"),co.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=co.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Pa(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var ya={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},rx=["Webkit","ms","Moz","O"];Object.keys(ya).forEach(function(t){rx.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),ya[e]=ya[t]})});function I0(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||ya.hasOwnProperty(t)&&ya[t]?(""+e).trim():e+"px"}function U0(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=I0(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var sx=wt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Bu(t,e){if(e){if(sx[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(re(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(re(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(re(61))}if(e.style!=null&&typeof e.style!="object")throw Error(re(62))}}function zu(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Vu=null;function wd(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Hu=null,Ts=null,ws=null;function qh(t){if(t=Za(t)){if(typeof Hu!="function")throw Error(re(280));var e=t.stateNode;e&&(e=ic(e),Hu(t.stateNode,t.type,e))}}function F0(t){Ts?ws?ws.push(t):ws=[t]:Ts=t}function O0(){if(Ts){var t=Ts,e=ws;if(ws=Ts=null,qh(t),e)for(t=0;t<e.length;t++)qh(e[t])}}function k0(t,e){return t(e)}function B0(){}var bc=!1;function z0(t,e,n){if(bc)return t(e,n);bc=!0;try{return k0(t,e,n)}finally{bc=!1,(Ts!==null||ws!==null)&&(B0(),O0())}}function Na(t,e){var n=t.stateNode;if(n===null)return null;var i=ic(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(re(231,e,typeof n));return n}var Gu=!1;if(Li)try{var Js={};Object.defineProperty(Js,"passive",{get:function(){Gu=!0}}),window.addEventListener("test",Js,Js),window.removeEventListener("test",Js,Js)}catch{Gu=!1}function ax(t,e,n,i,r,s,a,o,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(n,c)}catch(d){this.onError(d)}}var Sa=!1,vl=null,xl=!1,Wu=null,ox={onError:function(t){Sa=!0,vl=t}};function lx(t,e,n,i,r,s,a,o,l){Sa=!1,vl=null,ax.apply(ox,arguments)}function cx(t,e,n,i,r,s,a,o,l){if(lx.apply(this,arguments),Sa){if(Sa){var c=vl;Sa=!1,vl=null}else throw Error(re(198));xl||(xl=!0,Wu=c)}}function Xr(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function V0(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Kh(t){if(Xr(t)!==t)throw Error(re(188))}function ux(t){var e=t.alternate;if(!e){if(e=Xr(t),e===null)throw Error(re(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return Kh(r),t;if(s===i)return Kh(r),e;s=s.sibling}throw Error(re(188))}if(n.return!==i.return)n=r,i=s;else{for(var a=!1,o=r.child;o;){if(o===n){a=!0,n=r,i=s;break}if(o===i){a=!0,i=r,n=s;break}o=o.sibling}if(!a){for(o=s.child;o;){if(o===n){a=!0,n=s,i=r;break}if(o===i){a=!0,i=s,n=r;break}o=o.sibling}if(!a)throw Error(re(189))}}if(n.alternate!==i)throw Error(re(190))}if(n.tag!==3)throw Error(re(188));return n.stateNode.current===n?t:e}function H0(t){return t=ux(t),t!==null?G0(t):null}function G0(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=G0(t);if(e!==null)return e;t=t.sibling}return null}var W0=Rn.unstable_scheduleCallback,Zh=Rn.unstable_cancelCallback,fx=Rn.unstable_shouldYield,dx=Rn.unstable_requestPaint,Dt=Rn.unstable_now,hx=Rn.unstable_getCurrentPriorityLevel,bd=Rn.unstable_ImmediatePriority,X0=Rn.unstable_UserBlockingPriority,yl=Rn.unstable_NormalPriority,px=Rn.unstable_LowPriority,j0=Rn.unstable_IdlePriority,Jl=null,hi=null;function mx(t){if(hi&&typeof hi.onCommitFiberRoot=="function")try{hi.onCommitFiberRoot(Jl,t,void 0,(t.current.flags&128)===128)}catch{}}var Qn=Math.clz32?Math.clz32:vx,gx=Math.log,_x=Math.LN2;function vx(t){return t>>>=0,t===0?32:31-(gx(t)/_x|0)|0}var uo=64,fo=4194304;function ma(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function Sl(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,a=n&268435455;if(a!==0){var o=a&~r;o!==0?i=ma(o):(s&=a,s!==0&&(i=ma(s)))}else a=n&~r,a!==0?i=ma(a):s!==0&&(i=ma(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-Qn(e),r=1<<n,i|=t[n],e&=~r;return i}function xx(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function yx(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var a=31-Qn(s),o=1<<a,l=r[a];l===-1?(!(o&n)||o&i)&&(r[a]=xx(o,e)):l<=e&&(t.expiredLanes|=o),s&=~o}}function Xu(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function $0(){var t=uo;return uo<<=1,!(uo&4194240)&&(uo=64),t}function Ac(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function qa(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-Qn(e),t[e]=n}function Sx(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-Qn(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function Ad(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-Qn(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var st=0;function Y0(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var q0,Cd,K0,Z0,Q0,ju=!1,ho=[],rr=null,sr=null,ar=null,Da=new Map,La=new Map,Qi=[],Mx="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Qh(t,e){switch(t){case"focusin":case"focusout":rr=null;break;case"dragenter":case"dragleave":sr=null;break;case"mouseover":case"mouseout":ar=null;break;case"pointerover":case"pointerout":Da.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":La.delete(e.pointerId)}}function ea(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=Za(e),e!==null&&Cd(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function Ex(t,e,n,i,r){switch(e){case"focusin":return rr=ea(rr,t,e,n,i,r),!0;case"dragenter":return sr=ea(sr,t,e,n,i,r),!0;case"mouseover":return ar=ea(ar,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return Da.set(s,ea(Da.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,La.set(s,ea(La.get(s)||null,t,e,n,i,r)),!0}return!1}function J0(t){var e=Rr(t.target);if(e!==null){var n=Xr(e);if(n!==null){if(e=n.tag,e===13){if(e=V0(n),e!==null){t.blockedOn=e,Q0(t.priority,function(){K0(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Jo(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=$u(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);Vu=i,n.target.dispatchEvent(i),Vu=null}else return e=Za(n),e!==null&&Cd(e),t.blockedOn=n,!1;e.shift()}return!0}function Jh(t,e,n){Jo(t)&&n.delete(e)}function Tx(){ju=!1,rr!==null&&Jo(rr)&&(rr=null),sr!==null&&Jo(sr)&&(sr=null),ar!==null&&Jo(ar)&&(ar=null),Da.forEach(Jh),La.forEach(Jh)}function ta(t,e){t.blockedOn===e&&(t.blockedOn=null,ju||(ju=!0,Rn.unstable_scheduleCallback(Rn.unstable_NormalPriority,Tx)))}function Ia(t){function e(r){return ta(r,t)}if(0<ho.length){ta(ho[0],t);for(var n=1;n<ho.length;n++){var i=ho[n];i.blockedOn===t&&(i.blockedOn=null)}}for(rr!==null&&ta(rr,t),sr!==null&&ta(sr,t),ar!==null&&ta(ar,t),Da.forEach(e),La.forEach(e),n=0;n<Qi.length;n++)i=Qi[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<Qi.length&&(n=Qi[0],n.blockedOn===null);)J0(n),n.blockedOn===null&&Qi.shift()}var bs=ki.ReactCurrentBatchConfig,Ml=!0;function wx(t,e,n,i){var r=st,s=bs.transition;bs.transition=null;try{st=1,Rd(t,e,n,i)}finally{st=r,bs.transition=s}}function bx(t,e,n,i){var r=st,s=bs.transition;bs.transition=null;try{st=4,Rd(t,e,n,i)}finally{st=r,bs.transition=s}}function Rd(t,e,n,i){if(Ml){var r=$u(t,e,n,i);if(r===null)Oc(t,e,i,El,n),Qh(t,i);else if(Ex(r,t,e,n,i))i.stopPropagation();else if(Qh(t,i),e&4&&-1<Mx.indexOf(t)){for(;r!==null;){var s=Za(r);if(s!==null&&q0(s),s=$u(t,e,n,i),s===null&&Oc(t,e,i,El,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else Oc(t,e,i,null,n)}}var El=null;function $u(t,e,n,i){if(El=null,t=wd(i),t=Rr(t),t!==null)if(e=Xr(t),e===null)t=null;else if(n=e.tag,n===13){if(t=V0(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return El=t,null}function eg(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(hx()){case bd:return 1;case X0:return 4;case yl:case px:return 16;case j0:return 536870912;default:return 16}default:return 16}}var tr=null,Pd=null,el=null;function tg(){if(el)return el;var t,e=Pd,n=e.length,i,r="value"in tr?tr.value:tr.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var a=n-t;for(i=1;i<=a&&e[n-i]===r[s-i];i++);return el=r.slice(t,1<i?1-i:void 0)}function tl(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function po(){return!0}function ep(){return!1}function Nn(t){function e(n,i,r,s,a){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=a,this.currentTarget=null;for(var o in t)t.hasOwnProperty(o)&&(n=t[o],this[o]=n?n(s):s[o]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?po:ep,this.isPropagationStopped=ep,this}return wt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=po)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=po)},persist:function(){},isPersistent:po}),e}var qs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Nd=Nn(qs),Ka=wt({},qs,{view:0,detail:0}),Ax=Nn(Ka),Cc,Rc,na,ec=wt({},Ka,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Dd,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==na&&(na&&t.type==="mousemove"?(Cc=t.screenX-na.screenX,Rc=t.screenY-na.screenY):Rc=Cc=0,na=t),Cc)},movementY:function(t){return"movementY"in t?t.movementY:Rc}}),tp=Nn(ec),Cx=wt({},ec,{dataTransfer:0}),Rx=Nn(Cx),Px=wt({},Ka,{relatedTarget:0}),Pc=Nn(Px),Nx=wt({},qs,{animationName:0,elapsedTime:0,pseudoElement:0}),Dx=Nn(Nx),Lx=wt({},qs,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),Ix=Nn(Lx),Ux=wt({},qs,{data:0}),np=Nn(Ux),Fx={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Ox={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},kx={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Bx(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=kx[t])?!!e[t]:!1}function Dd(){return Bx}var zx=wt({},Ka,{key:function(t){if(t.key){var e=Fx[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=tl(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?Ox[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Dd,charCode:function(t){return t.type==="keypress"?tl(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?tl(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),Vx=Nn(zx),Hx=wt({},ec,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),ip=Nn(Hx),Gx=wt({},Ka,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Dd}),Wx=Nn(Gx),Xx=wt({},qs,{propertyName:0,elapsedTime:0,pseudoElement:0}),jx=Nn(Xx),$x=wt({},ec,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),Yx=Nn($x),qx=[9,13,27,32],Ld=Li&&"CompositionEvent"in window,Ma=null;Li&&"documentMode"in document&&(Ma=document.documentMode);var Kx=Li&&"TextEvent"in window&&!Ma,ng=Li&&(!Ld||Ma&&8<Ma&&11>=Ma),rp=" ",sp=!1;function ig(t,e){switch(t){case"keyup":return qx.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function rg(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var ds=!1;function Zx(t,e){switch(t){case"compositionend":return rg(e);case"keypress":return e.which!==32?null:(sp=!0,rp);case"textInput":return t=e.data,t===rp&&sp?null:t;default:return null}}function Qx(t,e){if(ds)return t==="compositionend"||!Ld&&ig(t,e)?(t=tg(),el=Pd=tr=null,ds=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return ng&&e.locale!=="ko"?null:e.data;default:return null}}var Jx={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ap(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!Jx[t.type]:e==="textarea"}function sg(t,e,n,i){F0(i),e=Tl(e,"onChange"),0<e.length&&(n=new Nd("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var Ea=null,Ua=null;function ey(t){gg(t,0)}function tc(t){var e=ms(t);if(R0(e))return t}function ty(t,e){if(t==="change")return e}var ag=!1;if(Li){var Nc;if(Li){var Dc="oninput"in document;if(!Dc){var op=document.createElement("div");op.setAttribute("oninput","return;"),Dc=typeof op.oninput=="function"}Nc=Dc}else Nc=!1;ag=Nc&&(!document.documentMode||9<document.documentMode)}function lp(){Ea&&(Ea.detachEvent("onpropertychange",og),Ua=Ea=null)}function og(t){if(t.propertyName==="value"&&tc(Ua)){var e=[];sg(e,Ua,t,wd(t)),z0(ey,e)}}function ny(t,e,n){t==="focusin"?(lp(),Ea=e,Ua=n,Ea.attachEvent("onpropertychange",og)):t==="focusout"&&lp()}function iy(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return tc(Ua)}function ry(t,e){if(t==="click")return tc(e)}function sy(t,e){if(t==="input"||t==="change")return tc(e)}function ay(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var ti=typeof Object.is=="function"?Object.is:ay;function Fa(t,e){if(ti(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!Ru.call(e,r)||!ti(t[r],e[r]))return!1}return!0}function cp(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function up(t,e){var n=cp(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=cp(n)}}function lg(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?lg(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function cg(){for(var t=window,e=_l();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=_l(t.document)}return e}function Id(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function oy(t){var e=cg(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&lg(n.ownerDocument.documentElement,n)){if(i!==null&&Id(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=up(n,s);var a=up(n,i);r&&a&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==a.node||t.focusOffset!==a.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(a.node,a.offset)):(e.setEnd(a.node,a.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var ly=Li&&"documentMode"in document&&11>=document.documentMode,hs=null,Yu=null,Ta=null,qu=!1;function fp(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;qu||hs==null||hs!==_l(i)||(i=hs,"selectionStart"in i&&Id(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),Ta&&Fa(Ta,i)||(Ta=i,i=Tl(Yu,"onSelect"),0<i.length&&(e=new Nd("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=hs)))}function mo(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var ps={animationend:mo("Animation","AnimationEnd"),animationiteration:mo("Animation","AnimationIteration"),animationstart:mo("Animation","AnimationStart"),transitionend:mo("Transition","TransitionEnd")},Lc={},ug={};Li&&(ug=document.createElement("div").style,"AnimationEvent"in window||(delete ps.animationend.animation,delete ps.animationiteration.animation,delete ps.animationstart.animation),"TransitionEvent"in window||delete ps.transitionend.transition);function nc(t){if(Lc[t])return Lc[t];if(!ps[t])return t;var e=ps[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in ug)return Lc[t]=e[n];return t}var fg=nc("animationend"),dg=nc("animationiteration"),hg=nc("animationstart"),pg=nc("transitionend"),mg=new Map,dp="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function gr(t,e){mg.set(t,e),Wr(e,[t])}for(var Ic=0;Ic<dp.length;Ic++){var Uc=dp[Ic],cy=Uc.toLowerCase(),uy=Uc[0].toUpperCase()+Uc.slice(1);gr(cy,"on"+uy)}gr(fg,"onAnimationEnd");gr(dg,"onAnimationIteration");gr(hg,"onAnimationStart");gr("dblclick","onDoubleClick");gr("focusin","onFocus");gr("focusout","onBlur");gr(pg,"onTransitionEnd");Is("onMouseEnter",["mouseout","mouseover"]);Is("onMouseLeave",["mouseout","mouseover"]);Is("onPointerEnter",["pointerout","pointerover"]);Is("onPointerLeave",["pointerout","pointerover"]);Wr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Wr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Wr("onBeforeInput",["compositionend","keypress","textInput","paste"]);Wr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Wr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Wr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ga="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),fy=new Set("cancel close invalid load scroll toggle".split(" ").concat(ga));function hp(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,cx(i,e,void 0,t),t.currentTarget=null}function gg(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var a=i.length-1;0<=a;a--){var o=i[a],l=o.instance,c=o.currentTarget;if(o=o.listener,l!==s&&r.isPropagationStopped())break e;hp(r,o,c),s=l}else for(a=0;a<i.length;a++){if(o=i[a],l=o.instance,c=o.currentTarget,o=o.listener,l!==s&&r.isPropagationStopped())break e;hp(r,o,c),s=l}}}if(xl)throw t=Wu,xl=!1,Wu=null,t}function _t(t,e){var n=e[ef];n===void 0&&(n=e[ef]=new Set);var i=t+"__bubble";n.has(i)||(_g(e,t,2,!1),n.add(i))}function Fc(t,e,n){var i=0;e&&(i|=4),_g(n,t,i,e)}var go="_reactListening"+Math.random().toString(36).slice(2);function Oa(t){if(!t[go]){t[go]=!0,T0.forEach(function(n){n!=="selectionchange"&&(fy.has(n)||Fc(n,!1,t),Fc(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[go]||(e[go]=!0,Fc("selectionchange",!1,e))}}function _g(t,e,n,i){switch(eg(e)){case 1:var r=wx;break;case 4:r=bx;break;default:r=Rd}n=r.bind(null,e,n,t),r=void 0,!Gu||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function Oc(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var a=i.tag;if(a===3||a===4){var o=i.stateNode.containerInfo;if(o===r||o.nodeType===8&&o.parentNode===r)break;if(a===4)for(a=i.return;a!==null;){var l=a.tag;if((l===3||l===4)&&(l=a.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;a=a.return}for(;o!==null;){if(a=Rr(o),a===null)return;if(l=a.tag,l===5||l===6){i=s=a;continue e}o=o.parentNode}}i=i.return}z0(function(){var c=s,d=wd(n),h=[];e:{var u=mg.get(t);if(u!==void 0){var p=Nd,m=t;switch(t){case"keypress":if(tl(n)===0)break e;case"keydown":case"keyup":p=Vx;break;case"focusin":m="focus",p=Pc;break;case"focusout":m="blur",p=Pc;break;case"beforeblur":case"afterblur":p=Pc;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=tp;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=Rx;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=Wx;break;case fg:case dg:case hg:p=Dx;break;case pg:p=jx;break;case"scroll":p=Ax;break;case"wheel":p=Yx;break;case"copy":case"cut":case"paste":p=Ix;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=ip}var E=(e&4)!==0,g=!E&&t==="scroll",f=E?u!==null?u+"Capture":null:u;E=[];for(var _=c,S;_!==null;){S=_;var y=S.stateNode;if(S.tag===5&&y!==null&&(S=y,f!==null&&(y=Na(_,f),y!=null&&E.push(ka(_,y,S)))),g)break;_=_.return}0<E.length&&(u=new p(u,m,null,n,d),h.push({event:u,listeners:E}))}}if(!(e&7)){e:{if(u=t==="mouseover"||t==="pointerover",p=t==="mouseout"||t==="pointerout",u&&n!==Vu&&(m=n.relatedTarget||n.fromElement)&&(Rr(m)||m[Ii]))break e;if((p||u)&&(u=d.window===d?d:(u=d.ownerDocument)?u.defaultView||u.parentWindow:window,p?(m=n.relatedTarget||n.toElement,p=c,m=m?Rr(m):null,m!==null&&(g=Xr(m),m!==g||m.tag!==5&&m.tag!==6)&&(m=null)):(p=null,m=c),p!==m)){if(E=tp,y="onMouseLeave",f="onMouseEnter",_="mouse",(t==="pointerout"||t==="pointerover")&&(E=ip,y="onPointerLeave",f="onPointerEnter",_="pointer"),g=p==null?u:ms(p),S=m==null?u:ms(m),u=new E(y,_+"leave",p,n,d),u.target=g,u.relatedTarget=S,y=null,Rr(d)===c&&(E=new E(f,_+"enter",m,n,d),E.target=S,E.relatedTarget=g,y=E),g=y,p&&m)t:{for(E=p,f=m,_=0,S=E;S;S=qr(S))_++;for(S=0,y=f;y;y=qr(y))S++;for(;0<_-S;)E=qr(E),_--;for(;0<S-_;)f=qr(f),S--;for(;_--;){if(E===f||f!==null&&E===f.alternate)break t;E=qr(E),f=qr(f)}E=null}else E=null;p!==null&&pp(h,u,p,E,!1),m!==null&&g!==null&&pp(h,g,m,E,!0)}}e:{if(u=c?ms(c):window,p=u.nodeName&&u.nodeName.toLowerCase(),p==="select"||p==="input"&&u.type==="file")var b=ty;else if(ap(u))if(ag)b=sy;else{b=iy;var w=ny}else(p=u.nodeName)&&p.toLowerCase()==="input"&&(u.type==="checkbox"||u.type==="radio")&&(b=ry);if(b&&(b=b(t,c))){sg(h,b,n,d);break e}w&&w(t,u,c),t==="focusout"&&(w=u._wrapperState)&&w.controlled&&u.type==="number"&&Fu(u,"number",u.value)}switch(w=c?ms(c):window,t){case"focusin":(ap(w)||w.contentEditable==="true")&&(hs=w,Yu=c,Ta=null);break;case"focusout":Ta=Yu=hs=null;break;case"mousedown":qu=!0;break;case"contextmenu":case"mouseup":case"dragend":qu=!1,fp(h,n,d);break;case"selectionchange":if(ly)break;case"keydown":case"keyup":fp(h,n,d)}var A;if(Ld)e:{switch(t){case"compositionstart":var x="onCompositionStart";break e;case"compositionend":x="onCompositionEnd";break e;case"compositionupdate":x="onCompositionUpdate";break e}x=void 0}else ds?ig(t,n)&&(x="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(x="onCompositionStart");x&&(ng&&n.locale!=="ko"&&(ds||x!=="onCompositionStart"?x==="onCompositionEnd"&&ds&&(A=tg()):(tr=d,Pd="value"in tr?tr.value:tr.textContent,ds=!0)),w=Tl(c,x),0<w.length&&(x=new np(x,t,null,n,d),h.push({event:x,listeners:w}),A?x.data=A:(A=rg(n),A!==null&&(x.data=A)))),(A=Kx?Zx(t,n):Qx(t,n))&&(c=Tl(c,"onBeforeInput"),0<c.length&&(d=new np("onBeforeInput","beforeinput",null,n,d),h.push({event:d,listeners:c}),d.data=A))}gg(h,e)})}function ka(t,e,n){return{instance:t,listener:e,currentTarget:n}}function Tl(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=Na(t,n),s!=null&&i.unshift(ka(t,s,r)),s=Na(t,e),s!=null&&i.push(ka(t,s,r))),t=t.return}return i}function qr(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function pp(t,e,n,i,r){for(var s=e._reactName,a=[];n!==null&&n!==i;){var o=n,l=o.alternate,c=o.stateNode;if(l!==null&&l===i)break;o.tag===5&&c!==null&&(o=c,r?(l=Na(n,s),l!=null&&a.unshift(ka(n,l,o))):r||(l=Na(n,s),l!=null&&a.push(ka(n,l,o)))),n=n.return}a.length!==0&&t.push({event:e,listeners:a})}var dy=/\r\n?/g,hy=/\u0000|\uFFFD/g;function mp(t){return(typeof t=="string"?t:""+t).replace(dy,`
`).replace(hy,"")}function _o(t,e,n){if(e=mp(e),mp(t)!==e&&n)throw Error(re(425))}function wl(){}var Ku=null,Zu=null;function Qu(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Ju=typeof setTimeout=="function"?setTimeout:void 0,py=typeof clearTimeout=="function"?clearTimeout:void 0,gp=typeof Promise=="function"?Promise:void 0,my=typeof queueMicrotask=="function"?queueMicrotask:typeof gp<"u"?function(t){return gp.resolve(null).then(t).catch(gy)}:Ju;function gy(t){setTimeout(function(){throw t})}function kc(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),Ia(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);Ia(e)}function or(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function _p(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var Ks=Math.random().toString(36).slice(2),ui="__reactFiber$"+Ks,Ba="__reactProps$"+Ks,Ii="__reactContainer$"+Ks,ef="__reactEvents$"+Ks,_y="__reactListeners$"+Ks,vy="__reactHandles$"+Ks;function Rr(t){var e=t[ui];if(e)return e;for(var n=t.parentNode;n;){if(e=n[Ii]||n[ui]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=_p(t);t!==null;){if(n=t[ui])return n;t=_p(t)}return e}t=n,n=t.parentNode}return null}function Za(t){return t=t[ui]||t[Ii],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function ms(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(re(33))}function ic(t){return t[Ba]||null}var tf=[],gs=-1;function _r(t){return{current:t}}function vt(t){0>gs||(t.current=tf[gs],tf[gs]=null,gs--)}function gt(t,e){gs++,tf[gs]=t.current,t.current=e}var hr={},rn=_r(hr),gn=_r(!1),Fr=hr;function Us(t,e){var n=t.type.contextTypes;if(!n)return hr;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function _n(t){return t=t.childContextTypes,t!=null}function bl(){vt(gn),vt(rn)}function vp(t,e,n){if(rn.current!==hr)throw Error(re(168));gt(rn,e),gt(gn,n)}function vg(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(re(108,nx(t)||"Unknown",r));return wt({},n,i)}function Al(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||hr,Fr=rn.current,gt(rn,t),gt(gn,gn.current),!0}function xp(t,e,n){var i=t.stateNode;if(!i)throw Error(re(169));n?(t=vg(t,e,Fr),i.__reactInternalMemoizedMergedChildContext=t,vt(gn),vt(rn),gt(rn,t)):vt(gn),gt(gn,n)}var bi=null,rc=!1,Bc=!1;function xg(t){bi===null?bi=[t]:bi.push(t)}function xy(t){rc=!0,xg(t)}function vr(){if(!Bc&&bi!==null){Bc=!0;var t=0,e=st;try{var n=bi;for(st=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}bi=null,rc=!1}catch(r){throw bi!==null&&(bi=bi.slice(t+1)),W0(bd,vr),r}finally{st=e,Bc=!1}}return null}var _s=[],vs=0,Cl=null,Rl=0,Un=[],Fn=0,Or=null,Ci=1,Ri="";function wr(t,e){_s[vs++]=Rl,_s[vs++]=Cl,Cl=t,Rl=e}function yg(t,e,n){Un[Fn++]=Ci,Un[Fn++]=Ri,Un[Fn++]=Or,Or=t;var i=Ci;t=Ri;var r=32-Qn(i)-1;i&=~(1<<r),n+=1;var s=32-Qn(e)+r;if(30<s){var a=r-r%5;s=(i&(1<<a)-1).toString(32),i>>=a,r-=a,Ci=1<<32-Qn(e)+r|n<<r|i,Ri=s+t}else Ci=1<<s|n<<r|i,Ri=t}function Ud(t){t.return!==null&&(wr(t,1),yg(t,1,0))}function Fd(t){for(;t===Cl;)Cl=_s[--vs],_s[vs]=null,Rl=_s[--vs],_s[vs]=null;for(;t===Or;)Or=Un[--Fn],Un[Fn]=null,Ri=Un[--Fn],Un[Fn]=null,Ci=Un[--Fn],Un[Fn]=null}var An=null,bn=null,yt=!1,qn=null;function Sg(t,e){var n=Bn(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function yp(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,An=t,bn=or(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,An=t,bn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Or!==null?{id:Ci,overflow:Ri}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=Bn(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,An=t,bn=null,!0):!1;default:return!1}}function nf(t){return(t.mode&1)!==0&&(t.flags&128)===0}function rf(t){if(yt){var e=bn;if(e){var n=e;if(!yp(t,e)){if(nf(t))throw Error(re(418));e=or(n.nextSibling);var i=An;e&&yp(t,e)?Sg(i,n):(t.flags=t.flags&-4097|2,yt=!1,An=t)}}else{if(nf(t))throw Error(re(418));t.flags=t.flags&-4097|2,yt=!1,An=t}}}function Sp(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;An=t}function vo(t){if(t!==An)return!1;if(!yt)return Sp(t),yt=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!Qu(t.type,t.memoizedProps)),e&&(e=bn)){if(nf(t))throw Mg(),Error(re(418));for(;e;)Sg(t,e),e=or(e.nextSibling)}if(Sp(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(re(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){bn=or(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}bn=null}}else bn=An?or(t.stateNode.nextSibling):null;return!0}function Mg(){for(var t=bn;t;)t=or(t.nextSibling)}function Fs(){bn=An=null,yt=!1}function Od(t){qn===null?qn=[t]:qn.push(t)}var yy=ki.ReactCurrentBatchConfig;function ia(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(re(309));var i=n.stateNode}if(!i)throw Error(re(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(a){var o=r.refs;a===null?delete o[s]:o[s]=a},e._stringRef=s,e)}if(typeof t!="string")throw Error(re(284));if(!n._owner)throw Error(re(290,t))}return t}function xo(t,e){throw t=Object.prototype.toString.call(e),Error(re(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function Mp(t){var e=t._init;return e(t._payload)}function Eg(t){function e(f,_){if(t){var S=f.deletions;S===null?(f.deletions=[_],f.flags|=16):S.push(_)}}function n(f,_){if(!t)return null;for(;_!==null;)e(f,_),_=_.sibling;return null}function i(f,_){for(f=new Map;_!==null;)_.key!==null?f.set(_.key,_):f.set(_.index,_),_=_.sibling;return f}function r(f,_){return f=fr(f,_),f.index=0,f.sibling=null,f}function s(f,_,S){return f.index=S,t?(S=f.alternate,S!==null?(S=S.index,S<_?(f.flags|=2,_):S):(f.flags|=2,_)):(f.flags|=1048576,_)}function a(f){return t&&f.alternate===null&&(f.flags|=2),f}function o(f,_,S,y){return _===null||_.tag!==6?(_=jc(S,f.mode,y),_.return=f,_):(_=r(_,S),_.return=f,_)}function l(f,_,S,y){var b=S.type;return b===fs?d(f,_,S.props.children,y,S.key):_!==null&&(_.elementType===b||typeof b=="object"&&b!==null&&b.$$typeof===qi&&Mp(b)===_.type)?(y=r(_,S.props),y.ref=ia(f,_,S),y.return=f,y):(y=ll(S.type,S.key,S.props,null,f.mode,y),y.ref=ia(f,_,S),y.return=f,y)}function c(f,_,S,y){return _===null||_.tag!==4||_.stateNode.containerInfo!==S.containerInfo||_.stateNode.implementation!==S.implementation?(_=$c(S,f.mode,y),_.return=f,_):(_=r(_,S.children||[]),_.return=f,_)}function d(f,_,S,y,b){return _===null||_.tag!==7?(_=Ur(S,f.mode,y,b),_.return=f,_):(_=r(_,S),_.return=f,_)}function h(f,_,S){if(typeof _=="string"&&_!==""||typeof _=="number")return _=jc(""+_,f.mode,S),_.return=f,_;if(typeof _=="object"&&_!==null){switch(_.$$typeof){case oo:return S=ll(_.type,_.key,_.props,null,f.mode,S),S.ref=ia(f,null,_),S.return=f,S;case us:return _=$c(_,f.mode,S),_.return=f,_;case qi:var y=_._init;return h(f,y(_._payload),S)}if(pa(_)||Qs(_))return _=Ur(_,f.mode,S,null),_.return=f,_;xo(f,_)}return null}function u(f,_,S,y){var b=_!==null?_.key:null;if(typeof S=="string"&&S!==""||typeof S=="number")return b!==null?null:o(f,_,""+S,y);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case oo:return S.key===b?l(f,_,S,y):null;case us:return S.key===b?c(f,_,S,y):null;case qi:return b=S._init,u(f,_,b(S._payload),y)}if(pa(S)||Qs(S))return b!==null?null:d(f,_,S,y,null);xo(f,S)}return null}function p(f,_,S,y,b){if(typeof y=="string"&&y!==""||typeof y=="number")return f=f.get(S)||null,o(_,f,""+y,b);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case oo:return f=f.get(y.key===null?S:y.key)||null,l(_,f,y,b);case us:return f=f.get(y.key===null?S:y.key)||null,c(_,f,y,b);case qi:var w=y._init;return p(f,_,S,w(y._payload),b)}if(pa(y)||Qs(y))return f=f.get(S)||null,d(_,f,y,b,null);xo(_,y)}return null}function m(f,_,S,y){for(var b=null,w=null,A=_,x=_=0,C=null;A!==null&&x<S.length;x++){A.index>x?(C=A,A=null):C=A.sibling;var N=u(f,A,S[x],y);if(N===null){A===null&&(A=C);break}t&&A&&N.alternate===null&&e(f,A),_=s(N,_,x),w===null?b=N:w.sibling=N,w=N,A=C}if(x===S.length)return n(f,A),yt&&wr(f,x),b;if(A===null){for(;x<S.length;x++)A=h(f,S[x],y),A!==null&&(_=s(A,_,x),w===null?b=A:w.sibling=A,w=A);return yt&&wr(f,x),b}for(A=i(f,A);x<S.length;x++)C=p(A,f,x,S[x],y),C!==null&&(t&&C.alternate!==null&&A.delete(C.key===null?x:C.key),_=s(C,_,x),w===null?b=C:w.sibling=C,w=C);return t&&A.forEach(function(P){return e(f,P)}),yt&&wr(f,x),b}function E(f,_,S,y){var b=Qs(S);if(typeof b!="function")throw Error(re(150));if(S=b.call(S),S==null)throw Error(re(151));for(var w=b=null,A=_,x=_=0,C=null,N=S.next();A!==null&&!N.done;x++,N=S.next()){A.index>x?(C=A,A=null):C=A.sibling;var P=u(f,A,N.value,y);if(P===null){A===null&&(A=C);break}t&&A&&P.alternate===null&&e(f,A),_=s(P,_,x),w===null?b=P:w.sibling=P,w=P,A=C}if(N.done)return n(f,A),yt&&wr(f,x),b;if(A===null){for(;!N.done;x++,N=S.next())N=h(f,N.value,y),N!==null&&(_=s(N,_,x),w===null?b=N:w.sibling=N,w=N);return yt&&wr(f,x),b}for(A=i(f,A);!N.done;x++,N=S.next())N=p(A,f,x,N.value,y),N!==null&&(t&&N.alternate!==null&&A.delete(N.key===null?x:N.key),_=s(N,_,x),w===null?b=N:w.sibling=N,w=N);return t&&A.forEach(function(z){return e(f,z)}),yt&&wr(f,x),b}function g(f,_,S,y){if(typeof S=="object"&&S!==null&&S.type===fs&&S.key===null&&(S=S.props.children),typeof S=="object"&&S!==null){switch(S.$$typeof){case oo:e:{for(var b=S.key,w=_;w!==null;){if(w.key===b){if(b=S.type,b===fs){if(w.tag===7){n(f,w.sibling),_=r(w,S.props.children),_.return=f,f=_;break e}}else if(w.elementType===b||typeof b=="object"&&b!==null&&b.$$typeof===qi&&Mp(b)===w.type){n(f,w.sibling),_=r(w,S.props),_.ref=ia(f,w,S),_.return=f,f=_;break e}n(f,w);break}else e(f,w);w=w.sibling}S.type===fs?(_=Ur(S.props.children,f.mode,y,S.key),_.return=f,f=_):(y=ll(S.type,S.key,S.props,null,f.mode,y),y.ref=ia(f,_,S),y.return=f,f=y)}return a(f);case us:e:{for(w=S.key;_!==null;){if(_.key===w)if(_.tag===4&&_.stateNode.containerInfo===S.containerInfo&&_.stateNode.implementation===S.implementation){n(f,_.sibling),_=r(_,S.children||[]),_.return=f,f=_;break e}else{n(f,_);break}else e(f,_);_=_.sibling}_=$c(S,f.mode,y),_.return=f,f=_}return a(f);case qi:return w=S._init,g(f,_,w(S._payload),y)}if(pa(S))return m(f,_,S,y);if(Qs(S))return E(f,_,S,y);xo(f,S)}return typeof S=="string"&&S!==""||typeof S=="number"?(S=""+S,_!==null&&_.tag===6?(n(f,_.sibling),_=r(_,S),_.return=f,f=_):(n(f,_),_=jc(S,f.mode,y),_.return=f,f=_),a(f)):n(f,_)}return g}var Os=Eg(!0),Tg=Eg(!1),Pl=_r(null),Nl=null,xs=null,kd=null;function Bd(){kd=xs=Nl=null}function zd(t){var e=Pl.current;vt(Pl),t._currentValue=e}function sf(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function As(t,e){Nl=t,kd=xs=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(mn=!0),t.firstContext=null)}function Vn(t){var e=t._currentValue;if(kd!==t)if(t={context:t,memoizedValue:e,next:null},xs===null){if(Nl===null)throw Error(re(308));xs=t,Nl.dependencies={lanes:0,firstContext:t}}else xs=xs.next=t;return e}var Pr=null;function Vd(t){Pr===null?Pr=[t]:Pr.push(t)}function wg(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,Vd(e)):(n.next=r.next,r.next=n),e.interleaved=n,Ui(t,i)}function Ui(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var Ki=!1;function Hd(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function bg(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function Ni(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function lr(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,Je&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Ui(t,n)}return r=i.interleaved,r===null?(e.next=e,Vd(i)):(e.next=r.next,r.next=e),i.interleaved=e,Ui(t,n)}function nl(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,Ad(t,n)}}function Ep(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var a={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=a:s=s.next=a,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function Dl(t,e,n,i){var r=t.updateQueue;Ki=!1;var s=r.firstBaseUpdate,a=r.lastBaseUpdate,o=r.shared.pending;if(o!==null){r.shared.pending=null;var l=o,c=l.next;l.next=null,a===null?s=c:a.next=c,a=l;var d=t.alternate;d!==null&&(d=d.updateQueue,o=d.lastBaseUpdate,o!==a&&(o===null?d.firstBaseUpdate=c:o.next=c,d.lastBaseUpdate=l))}if(s!==null){var h=r.baseState;a=0,d=c=l=null,o=s;do{var u=o.lane,p=o.eventTime;if((i&u)===u){d!==null&&(d=d.next={eventTime:p,lane:0,tag:o.tag,payload:o.payload,callback:o.callback,next:null});e:{var m=t,E=o;switch(u=e,p=n,E.tag){case 1:if(m=E.payload,typeof m=="function"){h=m.call(p,h,u);break e}h=m;break e;case 3:m.flags=m.flags&-65537|128;case 0:if(m=E.payload,u=typeof m=="function"?m.call(p,h,u):m,u==null)break e;h=wt({},h,u);break e;case 2:Ki=!0}}o.callback!==null&&o.lane!==0&&(t.flags|=64,u=r.effects,u===null?r.effects=[o]:u.push(o))}else p={eventTime:p,lane:u,tag:o.tag,payload:o.payload,callback:o.callback,next:null},d===null?(c=d=p,l=h):d=d.next=p,a|=u;if(o=o.next,o===null){if(o=r.shared.pending,o===null)break;u=o,o=u.next,u.next=null,r.lastBaseUpdate=u,r.shared.pending=null}}while(!0);if(d===null&&(l=h),r.baseState=l,r.firstBaseUpdate=c,r.lastBaseUpdate=d,e=r.shared.interleaved,e!==null){r=e;do a|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Br|=a,t.lanes=a,t.memoizedState=h}}function Tp(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(re(191,r));r.call(i)}}}var Qa={},pi=_r(Qa),za=_r(Qa),Va=_r(Qa);function Nr(t){if(t===Qa)throw Error(re(174));return t}function Gd(t,e){switch(gt(Va,e),gt(za,t),gt(pi,Qa),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:ku(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=ku(e,t)}vt(pi),gt(pi,e)}function ks(){vt(pi),vt(za),vt(Va)}function Ag(t){Nr(Va.current);var e=Nr(pi.current),n=ku(e,t.type);e!==n&&(gt(za,t),gt(pi,n))}function Wd(t){za.current===t&&(vt(pi),vt(za))}var Et=_r(0);function Ll(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var zc=[];function Xd(){for(var t=0;t<zc.length;t++)zc[t]._workInProgressVersionPrimary=null;zc.length=0}var il=ki.ReactCurrentDispatcher,Vc=ki.ReactCurrentBatchConfig,kr=0,Tt=null,Ot=null,Ht=null,Il=!1,wa=!1,Ha=0,Sy=0;function Zt(){throw Error(re(321))}function jd(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!ti(t[n],e[n]))return!1;return!0}function $d(t,e,n,i,r,s){if(kr=s,Tt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,il.current=t===null||t.memoizedState===null?wy:by,t=n(i,r),wa){s=0;do{if(wa=!1,Ha=0,25<=s)throw Error(re(301));s+=1,Ht=Ot=null,e.updateQueue=null,il.current=Ay,t=n(i,r)}while(wa)}if(il.current=Ul,e=Ot!==null&&Ot.next!==null,kr=0,Ht=Ot=Tt=null,Il=!1,e)throw Error(re(300));return t}function Yd(){var t=Ha!==0;return Ha=0,t}function li(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ht===null?Tt.memoizedState=Ht=t:Ht=Ht.next=t,Ht}function Hn(){if(Ot===null){var t=Tt.alternate;t=t!==null?t.memoizedState:null}else t=Ot.next;var e=Ht===null?Tt.memoizedState:Ht.next;if(e!==null)Ht=e,Ot=t;else{if(t===null)throw Error(re(310));Ot=t,t={memoizedState:Ot.memoizedState,baseState:Ot.baseState,baseQueue:Ot.baseQueue,queue:Ot.queue,next:null},Ht===null?Tt.memoizedState=Ht=t:Ht=Ht.next=t}return Ht}function Ga(t,e){return typeof e=="function"?e(t):e}function Hc(t){var e=Hn(),n=e.queue;if(n===null)throw Error(re(311));n.lastRenderedReducer=t;var i=Ot,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var a=r.next;r.next=s.next,s.next=a}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var o=a=null,l=null,c=s;do{var d=c.lane;if((kr&d)===d)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),i=c.hasEagerState?c.eagerState:t(i,c.action);else{var h={lane:d,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(o=l=h,a=i):l=l.next=h,Tt.lanes|=d,Br|=d}c=c.next}while(c!==null&&c!==s);l===null?a=i:l.next=o,ti(i,e.memoizedState)||(mn=!0),e.memoizedState=i,e.baseState=a,e.baseQueue=l,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,Tt.lanes|=s,Br|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function Gc(t){var e=Hn(),n=e.queue;if(n===null)throw Error(re(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var a=r=r.next;do s=t(s,a.action),a=a.next;while(a!==r);ti(s,e.memoizedState)||(mn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function Cg(){}function Rg(t,e){var n=Tt,i=Hn(),r=e(),s=!ti(i.memoizedState,r);if(s&&(i.memoizedState=r,mn=!0),i=i.queue,qd(Dg.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||Ht!==null&&Ht.memoizedState.tag&1){if(n.flags|=2048,Wa(9,Ng.bind(null,n,i,r,e),void 0,null),Gt===null)throw Error(re(349));kr&30||Pg(n,e,r)}return r}function Pg(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=Tt.updateQueue,e===null?(e={lastEffect:null,stores:null},Tt.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function Ng(t,e,n,i){e.value=n,e.getSnapshot=i,Lg(e)&&Ig(t)}function Dg(t,e,n){return n(function(){Lg(e)&&Ig(t)})}function Lg(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!ti(t,n)}catch{return!0}}function Ig(t){var e=Ui(t,1);e!==null&&Jn(e,t,1,-1)}function wp(t){var e=li();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ga,lastRenderedState:t},e.queue=t,t=t.dispatch=Ty.bind(null,Tt,t),[e.memoizedState,t]}function Wa(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=Tt.updateQueue,e===null?(e={lastEffect:null,stores:null},Tt.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function Ug(){return Hn().memoizedState}function rl(t,e,n,i){var r=li();Tt.flags|=t,r.memoizedState=Wa(1|e,n,void 0,i===void 0?null:i)}function sc(t,e,n,i){var r=Hn();i=i===void 0?null:i;var s=void 0;if(Ot!==null){var a=Ot.memoizedState;if(s=a.destroy,i!==null&&jd(i,a.deps)){r.memoizedState=Wa(e,n,s,i);return}}Tt.flags|=t,r.memoizedState=Wa(1|e,n,s,i)}function bp(t,e){return rl(8390656,8,t,e)}function qd(t,e){return sc(2048,8,t,e)}function Fg(t,e){return sc(4,2,t,e)}function Og(t,e){return sc(4,4,t,e)}function kg(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function Bg(t,e,n){return n=n!=null?n.concat([t]):null,sc(4,4,kg.bind(null,e,t),n)}function Kd(){}function zg(t,e){var n=Hn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&jd(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function Vg(t,e){var n=Hn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&jd(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function Hg(t,e,n){return kr&21?(ti(n,e)||(n=$0(),Tt.lanes|=n,Br|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,mn=!0),t.memoizedState=n)}function My(t,e){var n=st;st=n!==0&&4>n?n:4,t(!0);var i=Vc.transition;Vc.transition={};try{t(!1),e()}finally{st=n,Vc.transition=i}}function Gg(){return Hn().memoizedState}function Ey(t,e,n){var i=ur(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},Wg(t))Xg(e,n);else if(n=wg(t,e,n,i),n!==null){var r=ln();Jn(n,t,i,r),jg(n,e,i)}}function Ty(t,e,n){var i=ur(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(Wg(t))Xg(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var a=e.lastRenderedState,o=s(a,n);if(r.hasEagerState=!0,r.eagerState=o,ti(o,a)){var l=e.interleaved;l===null?(r.next=r,Vd(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}n=wg(t,e,r,i),n!==null&&(r=ln(),Jn(n,t,i,r),jg(n,e,i))}}function Wg(t){var e=t.alternate;return t===Tt||e!==null&&e===Tt}function Xg(t,e){wa=Il=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function jg(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,Ad(t,n)}}var Ul={readContext:Vn,useCallback:Zt,useContext:Zt,useEffect:Zt,useImperativeHandle:Zt,useInsertionEffect:Zt,useLayoutEffect:Zt,useMemo:Zt,useReducer:Zt,useRef:Zt,useState:Zt,useDebugValue:Zt,useDeferredValue:Zt,useTransition:Zt,useMutableSource:Zt,useSyncExternalStore:Zt,useId:Zt,unstable_isNewReconciler:!1},wy={readContext:Vn,useCallback:function(t,e){return li().memoizedState=[t,e===void 0?null:e],t},useContext:Vn,useEffect:bp,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,rl(4194308,4,kg.bind(null,e,t),n)},useLayoutEffect:function(t,e){return rl(4194308,4,t,e)},useInsertionEffect:function(t,e){return rl(4,2,t,e)},useMemo:function(t,e){var n=li();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=li();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=Ey.bind(null,Tt,t),[i.memoizedState,t]},useRef:function(t){var e=li();return t={current:t},e.memoizedState=t},useState:wp,useDebugValue:Kd,useDeferredValue:function(t){return li().memoizedState=t},useTransition:function(){var t=wp(!1),e=t[0];return t=My.bind(null,t[1]),li().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=Tt,r=li();if(yt){if(n===void 0)throw Error(re(407));n=n()}else{if(n=e(),Gt===null)throw Error(re(349));kr&30||Pg(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,bp(Dg.bind(null,i,s,t),[t]),i.flags|=2048,Wa(9,Ng.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=li(),e=Gt.identifierPrefix;if(yt){var n=Ri,i=Ci;n=(i&~(1<<32-Qn(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=Ha++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=Sy++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},by={readContext:Vn,useCallback:zg,useContext:Vn,useEffect:qd,useImperativeHandle:Bg,useInsertionEffect:Fg,useLayoutEffect:Og,useMemo:Vg,useReducer:Hc,useRef:Ug,useState:function(){return Hc(Ga)},useDebugValue:Kd,useDeferredValue:function(t){var e=Hn();return Hg(e,Ot.memoizedState,t)},useTransition:function(){var t=Hc(Ga)[0],e=Hn().memoizedState;return[t,e]},useMutableSource:Cg,useSyncExternalStore:Rg,useId:Gg,unstable_isNewReconciler:!1},Ay={readContext:Vn,useCallback:zg,useContext:Vn,useEffect:qd,useImperativeHandle:Bg,useInsertionEffect:Fg,useLayoutEffect:Og,useMemo:Vg,useReducer:Gc,useRef:Ug,useState:function(){return Gc(Ga)},useDebugValue:Kd,useDeferredValue:function(t){var e=Hn();return Ot===null?e.memoizedState=t:Hg(e,Ot.memoizedState,t)},useTransition:function(){var t=Gc(Ga)[0],e=Hn().memoizedState;return[t,e]},useMutableSource:Cg,useSyncExternalStore:Rg,useId:Gg,unstable_isNewReconciler:!1};function $n(t,e){if(t&&t.defaultProps){e=wt({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function af(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:wt({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var ac={isMounted:function(t){return(t=t._reactInternals)?Xr(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=ln(),r=ur(t),s=Ni(i,r);s.payload=e,n!=null&&(s.callback=n),e=lr(t,s,r),e!==null&&(Jn(e,t,r,i),nl(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=ln(),r=ur(t),s=Ni(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=lr(t,s,r),e!==null&&(Jn(e,t,r,i),nl(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=ln(),i=ur(t),r=Ni(n,i);r.tag=2,e!=null&&(r.callback=e),e=lr(t,r,i),e!==null&&(Jn(e,t,i,n),nl(e,t,i))}};function Ap(t,e,n,i,r,s,a){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,a):e.prototype&&e.prototype.isPureReactComponent?!Fa(n,i)||!Fa(r,s):!0}function $g(t,e,n){var i=!1,r=hr,s=e.contextType;return typeof s=="object"&&s!==null?s=Vn(s):(r=_n(e)?Fr:rn.current,i=e.contextTypes,s=(i=i!=null)?Us(t,r):hr),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=ac,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function Cp(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&ac.enqueueReplaceState(e,e.state,null)}function of(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},Hd(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Vn(s):(s=_n(e)?Fr:rn.current,r.context=Us(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(af(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&ac.enqueueReplaceState(r,r.state,null),Dl(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function Bs(t,e){try{var n="",i=e;do n+=tx(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function Wc(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function lf(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var Cy=typeof WeakMap=="function"?WeakMap:Map;function Yg(t,e,n){n=Ni(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){Ol||(Ol=!0,vf=i),lf(t,e)},n}function qg(t,e,n){n=Ni(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){lf(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){lf(t,e),typeof i!="function"&&(cr===null?cr=new Set([this]):cr.add(this));var a=e.stack;this.componentDidCatch(e.value,{componentStack:a!==null?a:""})}),n}function Rp(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new Cy;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=Hy.bind(null,t,e,n),e.then(t,t))}function Pp(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function Np(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=Ni(-1,1),e.tag=2,lr(n,e,1))),n.lanes|=1),t)}var Ry=ki.ReactCurrentOwner,mn=!1;function an(t,e,n,i){e.child=t===null?Tg(e,null,n,i):Os(e,t.child,n,i)}function Dp(t,e,n,i,r){n=n.render;var s=e.ref;return As(e,r),i=$d(t,e,n,i,s,r),n=Yd(),t!==null&&!mn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Fi(t,e,r)):(yt&&n&&Ud(e),e.flags|=1,an(t,e,i,r),e.child)}function Lp(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!rh(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,Kg(t,e,s,i,r)):(t=ll(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var a=s.memoizedProps;if(n=n.compare,n=n!==null?n:Fa,n(a,i)&&t.ref===e.ref)return Fi(t,e,r)}return e.flags|=1,t=fr(s,i),t.ref=e.ref,t.return=e,e.child=t}function Kg(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(Fa(s,i)&&t.ref===e.ref)if(mn=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(mn=!0);else return e.lanes=t.lanes,Fi(t,e,r)}return cf(t,e,n,i,r)}function Zg(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},gt(Ss,wn),wn|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,gt(Ss,wn),wn|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,gt(Ss,wn),wn|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,gt(Ss,wn),wn|=i;return an(t,e,r,n),e.child}function Qg(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function cf(t,e,n,i,r){var s=_n(n)?Fr:rn.current;return s=Us(e,s),As(e,r),n=$d(t,e,n,i,s,r),i=Yd(),t!==null&&!mn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Fi(t,e,r)):(yt&&i&&Ud(e),e.flags|=1,an(t,e,n,r),e.child)}function Ip(t,e,n,i,r){if(_n(n)){var s=!0;Al(e)}else s=!1;if(As(e,r),e.stateNode===null)sl(t,e),$g(e,n,i),of(e,n,i,r),i=!0;else if(t===null){var a=e.stateNode,o=e.memoizedProps;a.props=o;var l=a.context,c=n.contextType;typeof c=="object"&&c!==null?c=Vn(c):(c=_n(n)?Fr:rn.current,c=Us(e,c));var d=n.getDerivedStateFromProps,h=typeof d=="function"||typeof a.getSnapshotBeforeUpdate=="function";h||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==i||l!==c)&&Cp(e,a,i,c),Ki=!1;var u=e.memoizedState;a.state=u,Dl(e,i,a,r),l=e.memoizedState,o!==i||u!==l||gn.current||Ki?(typeof d=="function"&&(af(e,n,d,i),l=e.memoizedState),(o=Ki||Ap(e,n,o,i,u,l,c))?(h||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(e.flags|=4194308)):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),a.props=i,a.state=l,a.context=c,i=o):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{a=e.stateNode,bg(t,e),o=e.memoizedProps,c=e.type===e.elementType?o:$n(e.type,o),a.props=c,h=e.pendingProps,u=a.context,l=n.contextType,typeof l=="object"&&l!==null?l=Vn(l):(l=_n(n)?Fr:rn.current,l=Us(e,l));var p=n.getDerivedStateFromProps;(d=typeof p=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==h||u!==l)&&Cp(e,a,i,l),Ki=!1,u=e.memoizedState,a.state=u,Dl(e,i,a,r);var m=e.memoizedState;o!==h||u!==m||gn.current||Ki?(typeof p=="function"&&(af(e,n,p,i),m=e.memoizedState),(c=Ki||Ap(e,n,c,i,u,m,l)||!1)?(d||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(i,m,l),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(i,m,l)),typeof a.componentDidUpdate=="function"&&(e.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&u===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&u===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=m),a.props=i,a.state=m,a.context=l,i=c):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&u===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&u===t.memoizedState||(e.flags|=1024),i=!1)}return uf(t,e,n,i,s,r)}function uf(t,e,n,i,r,s){Qg(t,e);var a=(e.flags&128)!==0;if(!i&&!a)return r&&xp(e,n,!1),Fi(t,e,s);i=e.stateNode,Ry.current=e;var o=a&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&a?(e.child=Os(e,t.child,null,s),e.child=Os(e,null,o,s)):an(t,e,o,s),e.memoizedState=i.state,r&&xp(e,n,!0),e.child}function Jg(t){var e=t.stateNode;e.pendingContext?vp(t,e.pendingContext,e.pendingContext!==e.context):e.context&&vp(t,e.context,!1),Gd(t,e.containerInfo)}function Up(t,e,n,i,r){return Fs(),Od(r),e.flags|=256,an(t,e,n,i),e.child}var ff={dehydrated:null,treeContext:null,retryLane:0};function df(t){return{baseLanes:t,cachePool:null,transitions:null}}function e_(t,e,n){var i=e.pendingProps,r=Et.current,s=!1,a=(e.flags&128)!==0,o;if((o=a)||(o=t!==null&&t.memoizedState===null?!1:(r&2)!==0),o?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),gt(Et,r&1),t===null)return rf(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(a=i.children,t=i.fallback,s?(i=e.mode,s=e.child,a={mode:"hidden",children:a},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=a):s=cc(a,i,0,null),t=Ur(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=df(n),e.memoizedState=ff,t):Zd(e,a));if(r=t.memoizedState,r!==null&&(o=r.dehydrated,o!==null))return Py(t,e,a,i,o,r,n);if(s){s=i.fallback,a=e.mode,r=t.child,o=r.sibling;var l={mode:"hidden",children:i.children};return!(a&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=fr(r,l),i.subtreeFlags=r.subtreeFlags&14680064),o!==null?s=fr(o,s):(s=Ur(s,a,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,a=t.child.memoizedState,a=a===null?df(n):{baseLanes:a.baseLanes|n,cachePool:null,transitions:a.transitions},s.memoizedState=a,s.childLanes=t.childLanes&~n,e.memoizedState=ff,i}return s=t.child,t=s.sibling,i=fr(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function Zd(t,e){return e=cc({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function yo(t,e,n,i){return i!==null&&Od(i),Os(e,t.child,null,n),t=Zd(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function Py(t,e,n,i,r,s,a){if(n)return e.flags&256?(e.flags&=-257,i=Wc(Error(re(422))),yo(t,e,a,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=cc({mode:"visible",children:i.children},r,0,null),s=Ur(s,r,a,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&Os(e,t.child,null,a),e.child.memoizedState=df(a),e.memoizedState=ff,s);if(!(e.mode&1))return yo(t,e,a,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var o=i.dgst;return i=o,s=Error(re(419)),i=Wc(s,i,void 0),yo(t,e,a,i)}if(o=(a&t.childLanes)!==0,mn||o){if(i=Gt,i!==null){switch(a&-a){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|a)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Ui(t,r),Jn(i,t,r,-1))}return ih(),i=Wc(Error(re(421))),yo(t,e,a,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=Gy.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,bn=or(r.nextSibling),An=e,yt=!0,qn=null,t!==null&&(Un[Fn++]=Ci,Un[Fn++]=Ri,Un[Fn++]=Or,Ci=t.id,Ri=t.overflow,Or=e),e=Zd(e,i.children),e.flags|=4096,e)}function Fp(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),sf(t.return,e,n)}function Xc(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function t_(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(an(t,e,i.children,n),i=Et.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Fp(t,n,e);else if(t.tag===19)Fp(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(gt(Et,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&Ll(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),Xc(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&Ll(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}Xc(e,!0,n,null,s);break;case"together":Xc(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function sl(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Fi(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Br|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(re(153));if(e.child!==null){for(t=e.child,n=fr(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=fr(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function Ny(t,e,n){switch(e.tag){case 3:Jg(e),Fs();break;case 5:Ag(e);break;case 1:_n(e.type)&&Al(e);break;case 4:Gd(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;gt(Pl,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(gt(Et,Et.current&1),e.flags|=128,null):n&e.child.childLanes?e_(t,e,n):(gt(Et,Et.current&1),t=Fi(t,e,n),t!==null?t.sibling:null);gt(Et,Et.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return t_(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),gt(Et,Et.current),i)break;return null;case 22:case 23:return e.lanes=0,Zg(t,e,n)}return Fi(t,e,n)}var n_,hf,i_,r_;n_=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};hf=function(){};i_=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,Nr(pi.current);var s=null;switch(n){case"input":r=Iu(t,r),i=Iu(t,i),s=[];break;case"select":r=wt({},r,{value:void 0}),i=wt({},i,{value:void 0}),s=[];break;case"textarea":r=Ou(t,r),i=Ou(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=wl)}Bu(n,i);var a;n=null;for(c in r)if(!i.hasOwnProperty(c)&&r.hasOwnProperty(c)&&r[c]!=null)if(c==="style"){var o=r[c];for(a in o)o.hasOwnProperty(a)&&(n||(n={}),n[a]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(Ra.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in i){var l=i[c];if(o=r!=null?r[c]:void 0,i.hasOwnProperty(c)&&l!==o&&(l!=null||o!=null))if(c==="style")if(o){for(a in o)!o.hasOwnProperty(a)||l&&l.hasOwnProperty(a)||(n||(n={}),n[a]="");for(a in l)l.hasOwnProperty(a)&&o[a]!==l[a]&&(n||(n={}),n[a]=l[a])}else n||(s||(s=[]),s.push(c,n)),n=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,o=o?o.__html:void 0,l!=null&&o!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(Ra.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&_t("scroll",t),s||o===l||(s=[])):(s=s||[]).push(c,l))}n&&(s=s||[]).push("style",n);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};r_=function(t,e,n,i){n!==i&&(e.flags|=4)};function ra(t,e){if(!yt)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function Qt(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function Dy(t,e,n){var i=e.pendingProps;switch(Fd(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Qt(e),null;case 1:return _n(e.type)&&bl(),Qt(e),null;case 3:return i=e.stateNode,ks(),vt(gn),vt(rn),Xd(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(vo(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,qn!==null&&(Sf(qn),qn=null))),hf(t,e),Qt(e),null;case 5:Wd(e);var r=Nr(Va.current);if(n=e.type,t!==null&&e.stateNode!=null)i_(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(re(166));return Qt(e),null}if(t=Nr(pi.current),vo(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[ui]=e,i[Ba]=s,t=(e.mode&1)!==0,n){case"dialog":_t("cancel",i),_t("close",i);break;case"iframe":case"object":case"embed":_t("load",i);break;case"video":case"audio":for(r=0;r<ga.length;r++)_t(ga[r],i);break;case"source":_t("error",i);break;case"img":case"image":case"link":_t("error",i),_t("load",i);break;case"details":_t("toggle",i);break;case"input":Xh(i,s),_t("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},_t("invalid",i);break;case"textarea":$h(i,s),_t("invalid",i)}Bu(n,s),r=null;for(var a in s)if(s.hasOwnProperty(a)){var o=s[a];a==="children"?typeof o=="string"?i.textContent!==o&&(s.suppressHydrationWarning!==!0&&_o(i.textContent,o,t),r=["children",o]):typeof o=="number"&&i.textContent!==""+o&&(s.suppressHydrationWarning!==!0&&_o(i.textContent,o,t),r=["children",""+o]):Ra.hasOwnProperty(a)&&o!=null&&a==="onScroll"&&_t("scroll",i)}switch(n){case"input":lo(i),jh(i,s,!0);break;case"textarea":lo(i),Yh(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=wl)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{a=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=D0(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=a.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=a.createElement(n,{is:i.is}):(t=a.createElement(n),n==="select"&&(a=t,i.multiple?a.multiple=!0:i.size&&(a.size=i.size))):t=a.createElementNS(t,n),t[ui]=e,t[Ba]=i,n_(t,e,!1,!1),e.stateNode=t;e:{switch(a=zu(n,i),n){case"dialog":_t("cancel",t),_t("close",t),r=i;break;case"iframe":case"object":case"embed":_t("load",t),r=i;break;case"video":case"audio":for(r=0;r<ga.length;r++)_t(ga[r],t);r=i;break;case"source":_t("error",t),r=i;break;case"img":case"image":case"link":_t("error",t),_t("load",t),r=i;break;case"details":_t("toggle",t),r=i;break;case"input":Xh(t,i),r=Iu(t,i),_t("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=wt({},i,{value:void 0}),_t("invalid",t);break;case"textarea":$h(t,i),r=Ou(t,i),_t("invalid",t);break;default:r=i}Bu(n,r),o=r;for(s in o)if(o.hasOwnProperty(s)){var l=o[s];s==="style"?U0(t,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&L0(t,l)):s==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&Pa(t,l):typeof l=="number"&&Pa(t,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Ra.hasOwnProperty(s)?l!=null&&s==="onScroll"&&_t("scroll",t):l!=null&&Sd(t,s,l,a))}switch(n){case"input":lo(t),jh(t,i,!1);break;case"textarea":lo(t),Yh(t);break;case"option":i.value!=null&&t.setAttribute("value",""+dr(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?Es(t,!!i.multiple,s,!1):i.defaultValue!=null&&Es(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=wl)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Qt(e),null;case 6:if(t&&e.stateNode!=null)r_(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(re(166));if(n=Nr(Va.current),Nr(pi.current),vo(e)){if(i=e.stateNode,n=e.memoizedProps,i[ui]=e,(s=i.nodeValue!==n)&&(t=An,t!==null))switch(t.tag){case 3:_o(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&_o(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[ui]=e,e.stateNode=i}return Qt(e),null;case 13:if(vt(Et),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(yt&&bn!==null&&e.mode&1&&!(e.flags&128))Mg(),Fs(),e.flags|=98560,s=!1;else if(s=vo(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(re(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(re(317));s[ui]=e}else Fs(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Qt(e),s=!1}else qn!==null&&(Sf(qn),qn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||Et.current&1?kt===0&&(kt=3):ih())),e.updateQueue!==null&&(e.flags|=4),Qt(e),null);case 4:return ks(),hf(t,e),t===null&&Oa(e.stateNode.containerInfo),Qt(e),null;case 10:return zd(e.type._context),Qt(e),null;case 17:return _n(e.type)&&bl(),Qt(e),null;case 19:if(vt(Et),s=e.memoizedState,s===null)return Qt(e),null;if(i=(e.flags&128)!==0,a=s.rendering,a===null)if(i)ra(s,!1);else{if(kt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(a=Ll(t),a!==null){for(e.flags|=128,ra(s,!1),i=a.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,a=s.alternate,a===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=a.childLanes,s.lanes=a.lanes,s.child=a.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=a.memoizedProps,s.memoizedState=a.memoizedState,s.updateQueue=a.updateQueue,s.type=a.type,t=a.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return gt(Et,Et.current&1|2),e.child}t=t.sibling}s.tail!==null&&Dt()>zs&&(e.flags|=128,i=!0,ra(s,!1),e.lanes=4194304)}else{if(!i)if(t=Ll(a),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),ra(s,!0),s.tail===null&&s.tailMode==="hidden"&&!a.alternate&&!yt)return Qt(e),null}else 2*Dt()-s.renderingStartTime>zs&&n!==1073741824&&(e.flags|=128,i=!0,ra(s,!1),e.lanes=4194304);s.isBackwards?(a.sibling=e.child,e.child=a):(n=s.last,n!==null?n.sibling=a:e.child=a,s.last=a)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Dt(),e.sibling=null,n=Et.current,gt(Et,i?n&1|2:n&1),e):(Qt(e),null);case 22:case 23:return nh(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?wn&1073741824&&(Qt(e),e.subtreeFlags&6&&(e.flags|=8192)):Qt(e),null;case 24:return null;case 25:return null}throw Error(re(156,e.tag))}function Ly(t,e){switch(Fd(e),e.tag){case 1:return _n(e.type)&&bl(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return ks(),vt(gn),vt(rn),Xd(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Wd(e),null;case 13:if(vt(Et),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(re(340));Fs()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return vt(Et),null;case 4:return ks(),null;case 10:return zd(e.type._context),null;case 22:case 23:return nh(),null;case 24:return null;default:return null}}var So=!1,tn=!1,Iy=typeof WeakSet=="function"?WeakSet:Set,Me=null;function ys(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){At(t,e,i)}else n.current=null}function pf(t,e,n){try{n()}catch(i){At(t,e,i)}}var Op=!1;function Uy(t,e){if(Ku=Ml,t=cg(),Id(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var a=0,o=-1,l=-1,c=0,d=0,h=t,u=null;t:for(;;){for(var p;h!==n||r!==0&&h.nodeType!==3||(o=a+r),h!==s||i!==0&&h.nodeType!==3||(l=a+i),h.nodeType===3&&(a+=h.nodeValue.length),(p=h.firstChild)!==null;)u=h,h=p;for(;;){if(h===t)break t;if(u===n&&++c===r&&(o=a),u===s&&++d===i&&(l=a),(p=h.nextSibling)!==null)break;h=u,u=h.parentNode}h=p}n=o===-1||l===-1?null:{start:o,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(Zu={focusedElem:t,selectionRange:n},Ml=!1,Me=e;Me!==null;)if(e=Me,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,Me=t;else for(;Me!==null;){e=Me;try{var m=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(m!==null){var E=m.memoizedProps,g=m.memoizedState,f=e.stateNode,_=f.getSnapshotBeforeUpdate(e.elementType===e.type?E:$n(e.type,E),g);f.__reactInternalSnapshotBeforeUpdate=_}break;case 3:var S=e.stateNode.containerInfo;S.nodeType===1?S.textContent="":S.nodeType===9&&S.documentElement&&S.removeChild(S.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(re(163))}}catch(y){At(e,e.return,y)}if(t=e.sibling,t!==null){t.return=e.return,Me=t;break}Me=e.return}return m=Op,Op=!1,m}function ba(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&pf(e,n,s)}r=r.next}while(r!==i)}}function oc(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function mf(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function s_(t){var e=t.alternate;e!==null&&(t.alternate=null,s_(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[ui],delete e[Ba],delete e[ef],delete e[_y],delete e[vy])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function a_(t){return t.tag===5||t.tag===3||t.tag===4}function kp(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||a_(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function gf(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=wl));else if(i!==4&&(t=t.child,t!==null))for(gf(t,e,n),t=t.sibling;t!==null;)gf(t,e,n),t=t.sibling}function _f(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(_f(t,e,n),t=t.sibling;t!==null;)_f(t,e,n),t=t.sibling}var Xt=null,Yn=!1;function Hi(t,e,n){for(n=n.child;n!==null;)o_(t,e,n),n=n.sibling}function o_(t,e,n){if(hi&&typeof hi.onCommitFiberUnmount=="function")try{hi.onCommitFiberUnmount(Jl,n)}catch{}switch(n.tag){case 5:tn||ys(n,e);case 6:var i=Xt,r=Yn;Xt=null,Hi(t,e,n),Xt=i,Yn=r,Xt!==null&&(Yn?(t=Xt,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Xt.removeChild(n.stateNode));break;case 18:Xt!==null&&(Yn?(t=Xt,n=n.stateNode,t.nodeType===8?kc(t.parentNode,n):t.nodeType===1&&kc(t,n),Ia(t)):kc(Xt,n.stateNode));break;case 4:i=Xt,r=Yn,Xt=n.stateNode.containerInfo,Yn=!0,Hi(t,e,n),Xt=i,Yn=r;break;case 0:case 11:case 14:case 15:if(!tn&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,a=s.destroy;s=s.tag,a!==void 0&&(s&2||s&4)&&pf(n,e,a),r=r.next}while(r!==i)}Hi(t,e,n);break;case 1:if(!tn&&(ys(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(o){At(n,e,o)}Hi(t,e,n);break;case 21:Hi(t,e,n);break;case 22:n.mode&1?(tn=(i=tn)||n.memoizedState!==null,Hi(t,e,n),tn=i):Hi(t,e,n);break;default:Hi(t,e,n)}}function Bp(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new Iy),e.forEach(function(i){var r=Wy.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function Gn(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,a=e,o=a;e:for(;o!==null;){switch(o.tag){case 5:Xt=o.stateNode,Yn=!1;break e;case 3:Xt=o.stateNode.containerInfo,Yn=!0;break e;case 4:Xt=o.stateNode.containerInfo,Yn=!0;break e}o=o.return}if(Xt===null)throw Error(re(160));o_(s,a,r),Xt=null,Yn=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(c){At(r,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)l_(e,t),e=e.sibling}function l_(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Gn(e,t),si(t),i&4){try{ba(3,t,t.return),oc(3,t)}catch(E){At(t,t.return,E)}try{ba(5,t,t.return)}catch(E){At(t,t.return,E)}}break;case 1:Gn(e,t),si(t),i&512&&n!==null&&ys(n,n.return);break;case 5:if(Gn(e,t),si(t),i&512&&n!==null&&ys(n,n.return),t.flags&32){var r=t.stateNode;try{Pa(r,"")}catch(E){At(t,t.return,E)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,a=n!==null?n.memoizedProps:s,o=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{o==="input"&&s.type==="radio"&&s.name!=null&&P0(r,s),zu(o,a);var c=zu(o,s);for(a=0;a<l.length;a+=2){var d=l[a],h=l[a+1];d==="style"?U0(r,h):d==="dangerouslySetInnerHTML"?L0(r,h):d==="children"?Pa(r,h):Sd(r,d,h,c)}switch(o){case"input":Uu(r,s);break;case"textarea":N0(r,s);break;case"select":var u=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var p=s.value;p!=null?Es(r,!!s.multiple,p,!1):u!==!!s.multiple&&(s.defaultValue!=null?Es(r,!!s.multiple,s.defaultValue,!0):Es(r,!!s.multiple,s.multiple?[]:"",!1))}r[Ba]=s}catch(E){At(t,t.return,E)}}break;case 6:if(Gn(e,t),si(t),i&4){if(t.stateNode===null)throw Error(re(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(E){At(t,t.return,E)}}break;case 3:if(Gn(e,t),si(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{Ia(e.containerInfo)}catch(E){At(t,t.return,E)}break;case 4:Gn(e,t),si(t);break;case 13:Gn(e,t),si(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(eh=Dt())),i&4&&Bp(t);break;case 22:if(d=n!==null&&n.memoizedState!==null,t.mode&1?(tn=(c=tn)||d,Gn(e,t),tn=c):Gn(e,t),si(t),i&8192){if(c=t.memoizedState!==null,(t.stateNode.isHidden=c)&&!d&&t.mode&1)for(Me=t,d=t.child;d!==null;){for(h=Me=d;Me!==null;){switch(u=Me,p=u.child,u.tag){case 0:case 11:case 14:case 15:ba(4,u,u.return);break;case 1:ys(u,u.return);var m=u.stateNode;if(typeof m.componentWillUnmount=="function"){i=u,n=u.return;try{e=i,m.props=e.memoizedProps,m.state=e.memoizedState,m.componentWillUnmount()}catch(E){At(i,n,E)}}break;case 5:ys(u,u.return);break;case 22:if(u.memoizedState!==null){Vp(h);continue}}p!==null?(p.return=u,Me=p):Vp(h)}d=d.sibling}e:for(d=null,h=t;;){if(h.tag===5){if(d===null){d=h;try{r=h.stateNode,c?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(o=h.stateNode,l=h.memoizedProps.style,a=l!=null&&l.hasOwnProperty("display")?l.display:null,o.style.display=I0("display",a))}catch(E){At(t,t.return,E)}}}else if(h.tag===6){if(d===null)try{h.stateNode.nodeValue=c?"":h.memoizedProps}catch(E){At(t,t.return,E)}}else if((h.tag!==22&&h.tag!==23||h.memoizedState===null||h===t)&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===t)break e;for(;h.sibling===null;){if(h.return===null||h.return===t)break e;d===h&&(d=null),h=h.return}d===h&&(d=null),h.sibling.return=h.return,h=h.sibling}}break;case 19:Gn(e,t),si(t),i&4&&Bp(t);break;case 21:break;default:Gn(e,t),si(t)}}function si(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(a_(n)){var i=n;break e}n=n.return}throw Error(re(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(Pa(r,""),i.flags&=-33);var s=kp(t);_f(t,s,r);break;case 3:case 4:var a=i.stateNode.containerInfo,o=kp(t);gf(t,o,a);break;default:throw Error(re(161))}}catch(l){At(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function Fy(t,e,n){Me=t,c_(t)}function c_(t,e,n){for(var i=(t.mode&1)!==0;Me!==null;){var r=Me,s=r.child;if(r.tag===22&&i){var a=r.memoizedState!==null||So;if(!a){var o=r.alternate,l=o!==null&&o.memoizedState!==null||tn;o=So;var c=tn;if(So=a,(tn=l)&&!c)for(Me=r;Me!==null;)a=Me,l=a.child,a.tag===22&&a.memoizedState!==null?Hp(r):l!==null?(l.return=a,Me=l):Hp(r);for(;s!==null;)Me=s,c_(s),s=s.sibling;Me=r,So=o,tn=c}zp(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,Me=s):zp(t)}}function zp(t){for(;Me!==null;){var e=Me;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:tn||oc(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!tn)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:$n(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&Tp(e,s,i);break;case 3:var a=e.updateQueue;if(a!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}Tp(e,a,n)}break;case 5:var o=e.stateNode;if(n===null&&e.flags&4){n=o;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var d=c.memoizedState;if(d!==null){var h=d.dehydrated;h!==null&&Ia(h)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(re(163))}tn||e.flags&512&&mf(e)}catch(u){At(e,e.return,u)}}if(e===t){Me=null;break}if(n=e.sibling,n!==null){n.return=e.return,Me=n;break}Me=e.return}}function Vp(t){for(;Me!==null;){var e=Me;if(e===t){Me=null;break}var n=e.sibling;if(n!==null){n.return=e.return,Me=n;break}Me=e.return}}function Hp(t){for(;Me!==null;){var e=Me;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{oc(4,e)}catch(l){At(e,n,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){At(e,r,l)}}var s=e.return;try{mf(e)}catch(l){At(e,s,l)}break;case 5:var a=e.return;try{mf(e)}catch(l){At(e,a,l)}}}catch(l){At(e,e.return,l)}if(e===t){Me=null;break}var o=e.sibling;if(o!==null){o.return=e.return,Me=o;break}Me=e.return}}var Oy=Math.ceil,Fl=ki.ReactCurrentDispatcher,Qd=ki.ReactCurrentOwner,zn=ki.ReactCurrentBatchConfig,Je=0,Gt=null,Ut=null,Yt=0,wn=0,Ss=_r(0),kt=0,Xa=null,Br=0,lc=0,Jd=0,Aa=null,pn=null,eh=0,zs=1/0,Ti=null,Ol=!1,vf=null,cr=null,Mo=!1,nr=null,kl=0,Ca=0,xf=null,al=-1,ol=0;function ln(){return Je&6?Dt():al!==-1?al:al=Dt()}function ur(t){return t.mode&1?Je&2&&Yt!==0?Yt&-Yt:yy.transition!==null?(ol===0&&(ol=$0()),ol):(t=st,t!==0||(t=window.event,t=t===void 0?16:eg(t.type)),t):1}function Jn(t,e,n,i){if(50<Ca)throw Ca=0,xf=null,Error(re(185));qa(t,n,i),(!(Je&2)||t!==Gt)&&(t===Gt&&(!(Je&2)&&(lc|=n),kt===4&&Ji(t,Yt)),vn(t,i),n===1&&Je===0&&!(e.mode&1)&&(zs=Dt()+500,rc&&vr()))}function vn(t,e){var n=t.callbackNode;yx(t,e);var i=Sl(t,t===Gt?Yt:0);if(i===0)n!==null&&Zh(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&Zh(n),e===1)t.tag===0?xy(Gp.bind(null,t)):xg(Gp.bind(null,t)),my(function(){!(Je&6)&&vr()}),n=null;else{switch(Y0(i)){case 1:n=bd;break;case 4:n=X0;break;case 16:n=yl;break;case 536870912:n=j0;break;default:n=yl}n=__(n,u_.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function u_(t,e){if(al=-1,ol=0,Je&6)throw Error(re(327));var n=t.callbackNode;if(Cs()&&t.callbackNode!==n)return null;var i=Sl(t,t===Gt?Yt:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=Bl(t,i);else{e=i;var r=Je;Je|=2;var s=d_();(Gt!==t||Yt!==e)&&(Ti=null,zs=Dt()+500,Ir(t,e));do try{zy();break}catch(o){f_(t,o)}while(!0);Bd(),Fl.current=s,Je=r,Ut!==null?e=0:(Gt=null,Yt=0,e=kt)}if(e!==0){if(e===2&&(r=Xu(t),r!==0&&(i=r,e=yf(t,r))),e===1)throw n=Xa,Ir(t,0),Ji(t,i),vn(t,Dt()),n;if(e===6)Ji(t,i);else{if(r=t.current.alternate,!(i&30)&&!ky(r)&&(e=Bl(t,i),e===2&&(s=Xu(t),s!==0&&(i=s,e=yf(t,s))),e===1))throw n=Xa,Ir(t,0),Ji(t,i),vn(t,Dt()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(re(345));case 2:br(t,pn,Ti);break;case 3:if(Ji(t,i),(i&130023424)===i&&(e=eh+500-Dt(),10<e)){if(Sl(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){ln(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=Ju(br.bind(null,t,pn,Ti),e);break}br(t,pn,Ti);break;case 4:if(Ji(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var a=31-Qn(i);s=1<<a,a=e[a],a>r&&(r=a),i&=~s}if(i=r,i=Dt()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*Oy(i/1960))-i,10<i){t.timeoutHandle=Ju(br.bind(null,t,pn,Ti),i);break}br(t,pn,Ti);break;case 5:br(t,pn,Ti);break;default:throw Error(re(329))}}}return vn(t,Dt()),t.callbackNode===n?u_.bind(null,t):null}function yf(t,e){var n=Aa;return t.current.memoizedState.isDehydrated&&(Ir(t,e).flags|=256),t=Bl(t,e),t!==2&&(e=pn,pn=n,e!==null&&Sf(e)),t}function Sf(t){pn===null?pn=t:pn.push.apply(pn,t)}function ky(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!ti(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Ji(t,e){for(e&=~Jd,e&=~lc,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-Qn(e),i=1<<n;t[n]=-1,e&=~i}}function Gp(t){if(Je&6)throw Error(re(327));Cs();var e=Sl(t,0);if(!(e&1))return vn(t,Dt()),null;var n=Bl(t,e);if(t.tag!==0&&n===2){var i=Xu(t);i!==0&&(e=i,n=yf(t,i))}if(n===1)throw n=Xa,Ir(t,0),Ji(t,e),vn(t,Dt()),n;if(n===6)throw Error(re(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,br(t,pn,Ti),vn(t,Dt()),null}function th(t,e){var n=Je;Je|=1;try{return t(e)}finally{Je=n,Je===0&&(zs=Dt()+500,rc&&vr())}}function zr(t){nr!==null&&nr.tag===0&&!(Je&6)&&Cs();var e=Je;Je|=1;var n=zn.transition,i=st;try{if(zn.transition=null,st=1,t)return t()}finally{st=i,zn.transition=n,Je=e,!(Je&6)&&vr()}}function nh(){wn=Ss.current,vt(Ss)}function Ir(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,py(n)),Ut!==null)for(n=Ut.return;n!==null;){var i=n;switch(Fd(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&bl();break;case 3:ks(),vt(gn),vt(rn),Xd();break;case 5:Wd(i);break;case 4:ks();break;case 13:vt(Et);break;case 19:vt(Et);break;case 10:zd(i.type._context);break;case 22:case 23:nh()}n=n.return}if(Gt=t,Ut=t=fr(t.current,null),Yt=wn=e,kt=0,Xa=null,Jd=lc=Br=0,pn=Aa=null,Pr!==null){for(e=0;e<Pr.length;e++)if(n=Pr[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var a=s.next;s.next=r,i.next=a}n.pending=i}Pr=null}return t}function f_(t,e){do{var n=Ut;try{if(Bd(),il.current=Ul,Il){for(var i=Tt.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Il=!1}if(kr=0,Ht=Ot=Tt=null,wa=!1,Ha=0,Qd.current=null,n===null||n.return===null){kt=1,Xa=e,Ut=null;break}e:{var s=t,a=n.return,o=n,l=e;if(e=Yt,o.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,d=o,h=d.tag;if(!(d.mode&1)&&(h===0||h===11||h===15)){var u=d.alternate;u?(d.updateQueue=u.updateQueue,d.memoizedState=u.memoizedState,d.lanes=u.lanes):(d.updateQueue=null,d.memoizedState=null)}var p=Pp(a);if(p!==null){p.flags&=-257,Np(p,a,o,s,e),p.mode&1&&Rp(s,c,e),e=p,l=c;var m=e.updateQueue;if(m===null){var E=new Set;E.add(l),e.updateQueue=E}else m.add(l);break e}else{if(!(e&1)){Rp(s,c,e),ih();break e}l=Error(re(426))}}else if(yt&&o.mode&1){var g=Pp(a);if(g!==null){!(g.flags&65536)&&(g.flags|=256),Np(g,a,o,s,e),Od(Bs(l,o));break e}}s=l=Bs(l,o),kt!==4&&(kt=2),Aa===null?Aa=[s]:Aa.push(s),s=a;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var f=Yg(s,l,e);Ep(s,f);break e;case 1:o=l;var _=s.type,S=s.stateNode;if(!(s.flags&128)&&(typeof _.getDerivedStateFromError=="function"||S!==null&&typeof S.componentDidCatch=="function"&&(cr===null||!cr.has(S)))){s.flags|=65536,e&=-e,s.lanes|=e;var y=qg(s,o,e);Ep(s,y);break e}}s=s.return}while(s!==null)}p_(n)}catch(b){e=b,Ut===n&&n!==null&&(Ut=n=n.return);continue}break}while(!0)}function d_(){var t=Fl.current;return Fl.current=Ul,t===null?Ul:t}function ih(){(kt===0||kt===3||kt===2)&&(kt=4),Gt===null||!(Br&268435455)&&!(lc&268435455)||Ji(Gt,Yt)}function Bl(t,e){var n=Je;Je|=2;var i=d_();(Gt!==t||Yt!==e)&&(Ti=null,Ir(t,e));do try{By();break}catch(r){f_(t,r)}while(!0);if(Bd(),Je=n,Fl.current=i,Ut!==null)throw Error(re(261));return Gt=null,Yt=0,kt}function By(){for(;Ut!==null;)h_(Ut)}function zy(){for(;Ut!==null&&!fx();)h_(Ut)}function h_(t){var e=g_(t.alternate,t,wn);t.memoizedProps=t.pendingProps,e===null?p_(t):Ut=e,Qd.current=null}function p_(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=Ly(n,e),n!==null){n.flags&=32767,Ut=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{kt=6,Ut=null;return}}else if(n=Dy(n,e,wn),n!==null){Ut=n;return}if(e=e.sibling,e!==null){Ut=e;return}Ut=e=t}while(e!==null);kt===0&&(kt=5)}function br(t,e,n){var i=st,r=zn.transition;try{zn.transition=null,st=1,Vy(t,e,n,i)}finally{zn.transition=r,st=i}return null}function Vy(t,e,n,i){do Cs();while(nr!==null);if(Je&6)throw Error(re(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(re(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(Sx(t,s),t===Gt&&(Ut=Gt=null,Yt=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Mo||(Mo=!0,__(yl,function(){return Cs(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=zn.transition,zn.transition=null;var a=st;st=1;var o=Je;Je|=4,Qd.current=null,Uy(t,n),l_(n,t),oy(Zu),Ml=!!Ku,Zu=Ku=null,t.current=n,Fy(n),dx(),Je=o,st=a,zn.transition=s}else t.current=n;if(Mo&&(Mo=!1,nr=t,kl=r),s=t.pendingLanes,s===0&&(cr=null),mx(n.stateNode),vn(t,Dt()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(Ol)throw Ol=!1,t=vf,vf=null,t;return kl&1&&t.tag!==0&&Cs(),s=t.pendingLanes,s&1?t===xf?Ca++:(Ca=0,xf=t):Ca=0,vr(),null}function Cs(){if(nr!==null){var t=Y0(kl),e=zn.transition,n=st;try{if(zn.transition=null,st=16>t?16:t,nr===null)var i=!1;else{if(t=nr,nr=null,kl=0,Je&6)throw Error(re(331));var r=Je;for(Je|=4,Me=t.current;Me!==null;){var s=Me,a=s.child;if(Me.flags&16){var o=s.deletions;if(o!==null){for(var l=0;l<o.length;l++){var c=o[l];for(Me=c;Me!==null;){var d=Me;switch(d.tag){case 0:case 11:case 15:ba(8,d,s)}var h=d.child;if(h!==null)h.return=d,Me=h;else for(;Me!==null;){d=Me;var u=d.sibling,p=d.return;if(s_(d),d===c){Me=null;break}if(u!==null){u.return=p,Me=u;break}Me=p}}}var m=s.alternate;if(m!==null){var E=m.child;if(E!==null){m.child=null;do{var g=E.sibling;E.sibling=null,E=g}while(E!==null)}}Me=s}}if(s.subtreeFlags&2064&&a!==null)a.return=s,Me=a;else e:for(;Me!==null;){if(s=Me,s.flags&2048)switch(s.tag){case 0:case 11:case 15:ba(9,s,s.return)}var f=s.sibling;if(f!==null){f.return=s.return,Me=f;break e}Me=s.return}}var _=t.current;for(Me=_;Me!==null;){a=Me;var S=a.child;if(a.subtreeFlags&2064&&S!==null)S.return=a,Me=S;else e:for(a=_;Me!==null;){if(o=Me,o.flags&2048)try{switch(o.tag){case 0:case 11:case 15:oc(9,o)}}catch(b){At(o,o.return,b)}if(o===a){Me=null;break e}var y=o.sibling;if(y!==null){y.return=o.return,Me=y;break e}Me=o.return}}if(Je=r,vr(),hi&&typeof hi.onPostCommitFiberRoot=="function")try{hi.onPostCommitFiberRoot(Jl,t)}catch{}i=!0}return i}finally{st=n,zn.transition=e}}return!1}function Wp(t,e,n){e=Bs(n,e),e=Yg(t,e,1),t=lr(t,e,1),e=ln(),t!==null&&(qa(t,1,e),vn(t,e))}function At(t,e,n){if(t.tag===3)Wp(t,t,n);else for(;e!==null;){if(e.tag===3){Wp(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(cr===null||!cr.has(i))){t=Bs(n,t),t=qg(e,t,1),e=lr(e,t,1),t=ln(),e!==null&&(qa(e,1,t),vn(e,t));break}}e=e.return}}function Hy(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=ln(),t.pingedLanes|=t.suspendedLanes&n,Gt===t&&(Yt&n)===n&&(kt===4||kt===3&&(Yt&130023424)===Yt&&500>Dt()-eh?Ir(t,0):Jd|=n),vn(t,e)}function m_(t,e){e===0&&(t.mode&1?(e=fo,fo<<=1,!(fo&130023424)&&(fo=4194304)):e=1);var n=ln();t=Ui(t,e),t!==null&&(qa(t,e,n),vn(t,n))}function Gy(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),m_(t,n)}function Wy(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(re(314))}i!==null&&i.delete(e),m_(t,n)}var g_;g_=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||gn.current)mn=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return mn=!1,Ny(t,e,n);mn=!!(t.flags&131072)}else mn=!1,yt&&e.flags&1048576&&yg(e,Rl,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;sl(t,e),t=e.pendingProps;var r=Us(e,rn.current);As(e,n),r=$d(null,e,i,t,r,n);var s=Yd();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,_n(i)?(s=!0,Al(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,Hd(e),r.updater=ac,e.stateNode=r,r._reactInternals=e,of(e,i,t,n),e=uf(null,e,i,!0,s,n)):(e.tag=0,yt&&s&&Ud(e),an(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(sl(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=jy(i),t=$n(i,t),r){case 0:e=cf(null,e,i,t,n);break e;case 1:e=Ip(null,e,i,t,n);break e;case 11:e=Dp(null,e,i,t,n);break e;case 14:e=Lp(null,e,i,$n(i.type,t),n);break e}throw Error(re(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:$n(i,r),cf(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:$n(i,r),Ip(t,e,i,r,n);case 3:e:{if(Jg(e),t===null)throw Error(re(387));i=e.pendingProps,s=e.memoizedState,r=s.element,bg(t,e),Dl(e,i,null,n);var a=e.memoizedState;if(i=a.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=Bs(Error(re(423)),e),e=Up(t,e,i,n,r);break e}else if(i!==r){r=Bs(Error(re(424)),e),e=Up(t,e,i,n,r);break e}else for(bn=or(e.stateNode.containerInfo.firstChild),An=e,yt=!0,qn=null,n=Tg(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Fs(),i===r){e=Fi(t,e,n);break e}an(t,e,i,n)}e=e.child}return e;case 5:return Ag(e),t===null&&rf(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,a=r.children,Qu(i,r)?a=null:s!==null&&Qu(i,s)&&(e.flags|=32),Qg(t,e),an(t,e,a,n),e.child;case 6:return t===null&&rf(e),null;case 13:return e_(t,e,n);case 4:return Gd(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=Os(e,null,i,n):an(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:$n(i,r),Dp(t,e,i,r,n);case 7:return an(t,e,e.pendingProps,n),e.child;case 8:return an(t,e,e.pendingProps.children,n),e.child;case 12:return an(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,a=r.value,gt(Pl,i._currentValue),i._currentValue=a,s!==null)if(ti(s.value,a)){if(s.children===r.children&&!gn.current){e=Fi(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var o=s.dependencies;if(o!==null){a=s.child;for(var l=o.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=Ni(-1,n&-n),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var d=c.pending;d===null?l.next=l:(l.next=d.next,d.next=l),c.pending=l}}s.lanes|=n,l=s.alternate,l!==null&&(l.lanes|=n),sf(s.return,n,e),o.lanes|=n;break}l=l.next}}else if(s.tag===10)a=s.type===e.type?null:s.child;else if(s.tag===18){if(a=s.return,a===null)throw Error(re(341));a.lanes|=n,o=a.alternate,o!==null&&(o.lanes|=n),sf(a,n,e),a=s.sibling}else a=s.child;if(a!==null)a.return=s;else for(a=s;a!==null;){if(a===e){a=null;break}if(s=a.sibling,s!==null){s.return=a.return,a=s;break}a=a.return}s=a}an(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,As(e,n),r=Vn(r),i=i(r),e.flags|=1,an(t,e,i,n),e.child;case 14:return i=e.type,r=$n(i,e.pendingProps),r=$n(i.type,r),Lp(t,e,i,r,n);case 15:return Kg(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:$n(i,r),sl(t,e),e.tag=1,_n(i)?(t=!0,Al(e)):t=!1,As(e,n),$g(e,i,r),of(e,i,r,n),uf(null,e,i,!0,t,n);case 19:return t_(t,e,n);case 22:return Zg(t,e,n)}throw Error(re(156,e.tag))};function __(t,e){return W0(t,e)}function Xy(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Bn(t,e,n,i){return new Xy(t,e,n,i)}function rh(t){return t=t.prototype,!(!t||!t.isReactComponent)}function jy(t){if(typeof t=="function")return rh(t)?1:0;if(t!=null){if(t=t.$$typeof,t===Ed)return 11;if(t===Td)return 14}return 2}function fr(t,e){var n=t.alternate;return n===null?(n=Bn(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function ll(t,e,n,i,r,s){var a=2;if(i=t,typeof t=="function")rh(t)&&(a=1);else if(typeof t=="string")a=5;else e:switch(t){case fs:return Ur(n.children,r,s,e);case Md:a=8,r|=8;break;case Pu:return t=Bn(12,n,e,r|2),t.elementType=Pu,t.lanes=s,t;case Nu:return t=Bn(13,n,e,r),t.elementType=Nu,t.lanes=s,t;case Du:return t=Bn(19,n,e,r),t.elementType=Du,t.lanes=s,t;case A0:return cc(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case w0:a=10;break e;case b0:a=9;break e;case Ed:a=11;break e;case Td:a=14;break e;case qi:a=16,i=null;break e}throw Error(re(130,t==null?t:typeof t,""))}return e=Bn(a,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function Ur(t,e,n,i){return t=Bn(7,t,i,e),t.lanes=n,t}function cc(t,e,n,i){return t=Bn(22,t,i,e),t.elementType=A0,t.lanes=n,t.stateNode={isHidden:!1},t}function jc(t,e,n){return t=Bn(6,t,null,e),t.lanes=n,t}function $c(t,e,n){return e=Bn(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function $y(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Ac(0),this.expirationTimes=Ac(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ac(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function sh(t,e,n,i,r,s,a,o,l){return t=new $y(t,e,n,o,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Bn(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Hd(s),t}function Yy(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:us,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function v_(t){if(!t)return hr;t=t._reactInternals;e:{if(Xr(t)!==t||t.tag!==1)throw Error(re(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(_n(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(re(171))}if(t.tag===1){var n=t.type;if(_n(n))return vg(t,n,e)}return e}function x_(t,e,n,i,r,s,a,o,l){return t=sh(n,i,!0,t,r,s,a,o,l),t.context=v_(null),n=t.current,i=ln(),r=ur(n),s=Ni(i,r),s.callback=e??null,lr(n,s,r),t.current.lanes=r,qa(t,r,i),vn(t,i),t}function uc(t,e,n,i){var r=e.current,s=ln(),a=ur(r);return n=v_(n),e.context===null?e.context=n:e.pendingContext=n,e=Ni(s,a),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=lr(r,e,a),t!==null&&(Jn(t,r,a,s),nl(t,r,a)),a}function zl(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Xp(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function ah(t,e){Xp(t,e),(t=t.alternate)&&Xp(t,e)}function qy(){return null}var y_=typeof reportError=="function"?reportError:function(t){console.error(t)};function oh(t){this._internalRoot=t}fc.prototype.render=oh.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(re(409));uc(t,e,null,null)};fc.prototype.unmount=oh.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;zr(function(){uc(null,t,null,null)}),e[Ii]=null}};function fc(t){this._internalRoot=t}fc.prototype.unstable_scheduleHydration=function(t){if(t){var e=Z0();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Qi.length&&e!==0&&e<Qi[n].priority;n++);Qi.splice(n,0,t),n===0&&J0(t)}};function lh(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function dc(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function jp(){}function Ky(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var c=zl(a);s.call(c)}}var a=x_(e,i,t,0,null,!1,!1,"",jp);return t._reactRootContainer=a,t[Ii]=a.current,Oa(t.nodeType===8?t.parentNode:t),zr(),a}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var o=i;i=function(){var c=zl(l);o.call(c)}}var l=sh(t,0,!1,null,null,!1,!1,"",jp);return t._reactRootContainer=l,t[Ii]=l.current,Oa(t.nodeType===8?t.parentNode:t),zr(function(){uc(e,l,n,i)}),l}function hc(t,e,n,i,r){var s=n._reactRootContainer;if(s){var a=s;if(typeof r=="function"){var o=r;r=function(){var l=zl(a);o.call(l)}}uc(e,a,t,r)}else a=Ky(n,e,t,r,i);return zl(a)}q0=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=ma(e.pendingLanes);n!==0&&(Ad(e,n|1),vn(e,Dt()),!(Je&6)&&(zs=Dt()+500,vr()))}break;case 13:zr(function(){var i=Ui(t,1);if(i!==null){var r=ln();Jn(i,t,1,r)}}),ah(t,1)}};Cd=function(t){if(t.tag===13){var e=Ui(t,134217728);if(e!==null){var n=ln();Jn(e,t,134217728,n)}ah(t,134217728)}};K0=function(t){if(t.tag===13){var e=ur(t),n=Ui(t,e);if(n!==null){var i=ln();Jn(n,t,e,i)}ah(t,e)}};Z0=function(){return st};Q0=function(t,e){var n=st;try{return st=t,e()}finally{st=n}};Hu=function(t,e,n){switch(e){case"input":if(Uu(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=ic(i);if(!r)throw Error(re(90));R0(i),Uu(i,r)}}}break;case"textarea":N0(t,n);break;case"select":e=n.value,e!=null&&Es(t,!!n.multiple,e,!1)}};k0=th;B0=zr;var Zy={usingClientEntryPoint:!1,Events:[Za,ms,ic,F0,O0,th]},sa={findFiberByHostInstance:Rr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Qy={bundleType:sa.bundleType,version:sa.version,rendererPackageName:sa.rendererPackageName,rendererConfig:sa.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ki.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=H0(t),t===null?null:t.stateNode},findFiberByHostInstance:sa.findFiberByHostInstance||qy,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Eo=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Eo.isDisabled&&Eo.supportsFiber)try{Jl=Eo.inject(Qy),hi=Eo}catch{}}Pn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Zy;Pn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!lh(e))throw Error(re(200));return Yy(t,e,null,n)};Pn.createRoot=function(t,e){if(!lh(t))throw Error(re(299));var n=!1,i="",r=y_;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=sh(t,1,!1,null,null,n,!1,i,r),t[Ii]=e.current,Oa(t.nodeType===8?t.parentNode:t),new oh(e)};Pn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(re(188)):(t=Object.keys(t).join(","),Error(re(268,t)));return t=H0(e),t=t===null?null:t.stateNode,t};Pn.flushSync=function(t){return zr(t)};Pn.hydrate=function(t,e,n){if(!dc(e))throw Error(re(200));return hc(null,t,e,!0,n)};Pn.hydrateRoot=function(t,e,n){if(!lh(t))throw Error(re(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",a=y_;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(a=n.onRecoverableError)),e=x_(e,null,t,1,n??null,r,!1,s,a),t[Ii]=e.current,Oa(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new fc(e)};Pn.render=function(t,e,n){if(!dc(e))throw Error(re(200));return hc(null,t,e,!1,n)};Pn.unmountComponentAtNode=function(t){if(!dc(t))throw Error(re(40));return t._reactRootContainer?(zr(function(){hc(null,null,t,!1,function(){t._reactRootContainer=null,t[Ii]=null})}),!0):!1};Pn.unstable_batchedUpdates=th;Pn.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!dc(n))throw Error(re(200));if(t==null||t._reactInternals===void 0)throw Error(re(38));return hc(t,e,n,!1,i)};Pn.version="18.3.1-next-f1338f8080-20240426";function S_(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(S_)}catch(t){console.error(t)}}S_(),S0.exports=Pn;var Jy=S0.exports,$p=Jy;Cu.createRoot=$p.createRoot,Cu.hydrateRoot=$p.hydrateRoot;const eS={},Yp=t=>{let e;const n=new Set,i=(d,h)=>{const u=typeof d=="function"?d(e):d;if(!Object.is(u,e)){const p=e;e=h??(typeof u!="object"||u===null)?u:Object.assign({},e,u),n.forEach(m=>m(e,p))}},r=()=>e,l={setState:i,getState:r,getInitialState:()=>c,subscribe:d=>(n.add(d),()=>n.delete(d)),destroy:()=>{(eS?"production":void 0)!=="production"&&console.warn("[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."),n.clear()}},c=e=t(i,r,l);return l},tS=t=>t?Yp(t):Yp;var M_={exports:{}},E_={},T_={exports:{}},w_={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Vs=ve;function nS(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var iS=typeof Object.is=="function"?Object.is:nS,rS=Vs.useState,sS=Vs.useEffect,aS=Vs.useLayoutEffect,oS=Vs.useDebugValue;function lS(t,e){var n=e(),i=rS({inst:{value:n,getSnapshot:e}}),r=i[0].inst,s=i[1];return aS(function(){r.value=n,r.getSnapshot=e,Yc(r)&&s({inst:r})},[t,n,e]),sS(function(){return Yc(r)&&s({inst:r}),t(function(){Yc(r)&&s({inst:r})})},[t]),oS(n),n}function Yc(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!iS(t,n)}catch{return!0}}function cS(t,e){return e()}var uS=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?cS:lS;w_.useSyncExternalStore=Vs.useSyncExternalStore!==void 0?Vs.useSyncExternalStore:uS;T_.exports=w_;var fS=T_.exports;/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var pc=ve,dS=fS;function hS(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var pS=typeof Object.is=="function"?Object.is:hS,mS=dS.useSyncExternalStore,gS=pc.useRef,_S=pc.useEffect,vS=pc.useMemo,xS=pc.useDebugValue;E_.useSyncExternalStoreWithSelector=function(t,e,n,i,r){var s=gS(null);if(s.current===null){var a={hasValue:!1,value:null};s.current=a}else a=s.current;s=vS(function(){function l(p){if(!c){if(c=!0,d=p,p=i(p),r!==void 0&&a.hasValue){var m=a.value;if(r(m,p))return h=m}return h=p}if(m=h,pS(d,p))return m;var E=i(p);return r!==void 0&&r(m,E)?(d=p,m):(d=p,h=E)}var c=!1,d,h,u=n===void 0?null:n;return[function(){return l(e())},u===null?void 0:function(){return l(u())}]},[e,n,i,r]);var o=mS(t,s[0],s[1]);return _S(function(){a.hasValue=!0,a.value=o},[o]),xS(o),o};M_.exports=E_;var yS=M_.exports;const SS=l0(yS),b_={},{useDebugValue:MS}=x0,{useSyncExternalStoreWithSelector:ES}=SS;let qp=!1;const TS=t=>t;function wS(t,e=TS,n){(b_?"production":void 0)!=="production"&&n&&!qp&&(console.warn("[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"),qp=!0);const i=ES(t.subscribe,t.getState,t.getServerState||t.getInitialState,e,n);return MS(i),i}const Kp=t=>{(b_?"production":void 0)!=="production"&&typeof t!="function"&&console.warn("[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.");const e=typeof t=="function"?tS(t):t,n=(i,r)=>wS(e,i,r);return Object.assign(n,e),n},bS=t=>t?Kp(t):Kp,jr=bS(t=>({currentState:"idle",activeModel:"gemma-3-4b:latest",conversationId:null,messages:[],systemMetrics:null,isGenerating:!1,isListening:!1,isSpeaking:!1,isVoiceModeActive:!1,conversations:[],isLoadingConversations:!1,setJarvisState:e=>t({currentState:e}),setActiveModel:e=>t({activeModel:e}),setConversationId:e=>t({conversationId:e}),setSystemMetrics:e=>t({systemMetrics:e}),addMessage:e=>t(n=>({messages:[...n.messages,e]})),updateLastAssistantMessage:(e,n)=>t(i=>{const r=[...i.messages],s=r.length-1;return s>=0&&r[s].role==="assistant"&&(r[s]={...r[s],content:r[s].content+e,model:n||r[s].model}),{messages:r,activeModel:n?n.toLowerCase():i.activeModel}}),clearMessages:()=>t({messages:[]}),setIsGenerating:e=>t({isGenerating:e}),setIsListening:e=>t({isListening:e}),setIsSpeaking:e=>t({isSpeaking:e}),setIsVoiceModeActive:e=>t({isVoiceModeActive:e}),setConversations:e=>t({conversations:e}),setIsLoadingConversations:e=>t({isLoadingConversations:e}),removeConversationFromStore:e=>t(n=>({conversations:n.conversations.filter(i=>i.id!==e),...n.conversationId===e?{conversationId:null,messages:[]}:{}})),loadConversationSession:e=>{const n=(e.messages||[]).map(i=>{var a;const r=new Date(i.created_at),s=isNaN(r.getTime())?"":r.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"});return{id:i.id,role:i.role,content:i.content,model:(a=i.extra_metadata)==null?void 0:a.model,timestamp:s}});t({conversationId:e.id,messages:n})},resetActiveSession:()=>t({conversationId:null,messages:[]})}));function Hs(t){if(!t)return"GEMMA 3 4B";const e=t.toLowerCase();return e.includes("deepseek")?"DEEPSEEK R1 7B":e.includes("qwen")?"QWEN CODER 3B":e.includes("gemma")?"GEMMA 3 4B":t.replace(":latest","").replace(/-/g," ").toUpperCase()}function A_(t){if(!t)return"GENERAL";const e=t.toLowerCase();return e.includes("deepseek")?"REASONING":e.includes("qwen")?"CODING":(e.includes("gemma"),"GENERAL")}class C_{constructor(){it(this,"baseUrl");this.baseUrl=window.location.origin.startsWith("http")?window.location.origin:"http://127.0.0.1:8000"}async getSystemMetrics(){try{const e=await fetch(`${this.baseUrl}/api/v1/system/metrics`);if(!e.ok)throw new Error(`HTTP error ${e.status}`);return await e.json()}catch(e){return console.warn("[SystemService] Fetching system metrics failed:",e),{cpu_usage:0,ram_usage:0,gpu_usage:null,gpu_memory:null,temperature:null,uptime:"00:00:00"}}}async getModelStatus(){try{const e=await fetch(`${this.baseUrl}/api/v1/system/model`);if(!e.ok)throw new Error(`HTTP error ${e.status}`);return await e.json()}catch{return{provider:"ollama",model:"gemma-3-4b:latest",status:"offline"}}}}const AS=()=>{const{activeModel:t,systemMetrics:e}=jr(),[n,i]=ve.useState({provider:"ollama",model:t,status:"online"}),[r,s]=ve.useState("OFF"),a=ve.useRef(new C_);ve.useEffect(()=>{let c=!0;const d=async()=>{var p;const u=await a.current.getModelStatus();c&&i(u);try{const m=await fetch("/api/v1/desktop/monitor/status");if(m.ok){const E=await m.json();c&&s(((p=E==null?void 0:E.monitor_state)==null?void 0:p.status)||"OFF")}}catch{}};d();const h=setInterval(d,3e3);return()=>{c=!1,clearInterval(h)}},[]);const o=e!==null,l=n.status==="online";return M.jsxs("header",{className:"flex items-center justify-between px-5 py-2.5 bg-[#080e1a]/75 backdrop-blur-[14px] -webkit-backdrop-blur-[14px] border border-[#00f0ff]/20 rounded-xl shadow-2xl shrink-0 z-10 relative pointer-events-auto",children:[M.jsxs("div",{className:"flex flex-col",children:[M.jsx("h1",{className:"font-hud text-2xl font-extrabold tracking-[3px] text-[#00f0ff] drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]",children:"JARVIS"}),M.jsx("span",{className:"text-[10px] text-gray-400 tracking-[2px]",children:"AI ASSISTANT SYSTEM"})]}),M.jsxs("div",{className:"flex items-center gap-3",children:[M.jsxs("div",{className:"flex items-center gap-2 bg-black/40 border border-[#00f0ff]/20 px-3.5 py-1.5 rounded-full text-xs",children:[M.jsx("span",{className:"text-[11px] text-gray-400 tracking-wider",children:"SYSTEM"}),o?M.jsxs("span",{className:"text-[#00ffaa] font-semibold flex items-center gap-1.5",children:[M.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-[#00ffaa] shadow-[0_0_8px_#00ffaa]"})," ONLINE"]}):M.jsxs("span",{className:"text-[#ff5555] font-semibold flex items-center gap-1.5",children:[M.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-[#ff5555] shadow-[0_0_8px_#ff5555]"})," OFFLINE"]})]}),M.jsxs("div",{className:"flex items-center gap-2 bg-black/40 border border-[#00f0ff]/20 px-3.5 py-1.5 rounded-full text-xs",children:[M.jsx("span",{className:"text-[11px] text-gray-400 tracking-wider",children:"OLLAMA"}),l?M.jsxs("span",{className:"text-[#00ffaa] font-semibold flex items-center gap-1.5",children:[M.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-[#00ffaa] shadow-[0_0_8px_#00ffaa]"})," READY"]}):M.jsxs("span",{className:"text-[#ff7700] font-semibold flex items-center gap-1.5",children:[M.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-[#ff7700] shadow-[0_0_8px_#ff7700]"})," UNREACHABLE"]})]}),M.jsxs("div",{className:"flex items-center gap-2 bg-black/40 border border-[#00f0ff]/20 px-3.5 py-1.5 rounded-full text-xs",children:[M.jsx("span",{className:"text-[11px] text-gray-400 tracking-wider",children:"LIVE DESKTOP"}),r==="ACTIVE"?M.jsxs("span",{className:"text-[#00ffaa] font-semibold flex items-center gap-1.5",children:[M.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-[#00ffaa] shadow-[0_0_8px_#00ffaa]"})," ACTIVE"]}):r==="PAUSED"?M.jsxs("span",{className:"text-[#ffaa00] font-semibold flex items-center gap-1.5",children:[M.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-[#ffaa00] shadow-[0_0_8px_#ffaa00]"})," PAUSED"]}):M.jsxs("span",{className:"text-gray-400 font-semibold flex items-center gap-1.5",children:[M.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-gray-500"})," OFF"]})]})]}),M.jsxs("div",{className:"flex items-center gap-3",children:[M.jsxs("div",{className:"flex items-center gap-2 bg-black/40 border border-[#00f0ff]/20 px-3.5 py-1.5 rounded-full text-xs",children:[M.jsx("span",{className:"text-[11px] text-gray-400 tracking-wider",children:"ACTIVE MODEL"}),M.jsx("span",{className:"font-hud text-[#ff7700] font-bold tracking-wider uppercase",children:Hs(t)})]}),M.jsx("div",{className:"w-8 h-8 rounded-full border border-[#00f0ff]/30 flex items-center justify-center",children:M.jsx("div",{className:"w-3.5 h-3.5 border border-dashed border-[#00f0ff] rounded-full animate-spin"})})]})]})};/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const CS=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),R_=(...t)=>t.filter((e,n,i)=>!!e&&i.indexOf(e)===n).join(" ");/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var RS={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const PS=ve.forwardRef(({color:t="currentColor",size:e=24,strokeWidth:n=2,absoluteStrokeWidth:i,className:r="",children:s,iconNode:a,...o},l)=>ve.createElement("svg",{ref:l,...RS,width:e,height:e,stroke:t,strokeWidth:i?Number(n)*24/Number(e):n,className:R_("lucide",r),...o},[...a.map(([c,d])=>ve.createElement(c,d)),...Array.isArray(s)?s:[s]]));/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tt=(t,e)=>{const n=ve.forwardRef(({className:i,...r},s)=>ve.createElement(PS,{ref:s,iconNode:e,className:R_(`lucide-${CS(t)}`,i),...r}));return n.displayName=`${t}`,n};/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const NS=tt("Brain",[["path",{d:"M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",key:"l5xja"}],["path",{d:"M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z",key:"ep3f8r"}],["path",{d:"M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4",key:"1p4c4q"}],["path",{d:"M17.599 6.5a3 3 0 0 0 .399-1.375",key:"tmeiqw"}],["path",{d:"M6.003 5.125A3 3 0 0 0 6.401 6.5",key:"105sqy"}],["path",{d:"M3.477 10.896a4 4 0 0 1 .585-.396",key:"ql3yin"}],["path",{d:"M19.938 10.5a4 4 0 0 1 .585.396",key:"1qfode"}],["path",{d:"M6 18a4 4 0 0 1-1.967-.516",key:"2e4loj"}],["path",{d:"M19.967 17.484A4 4 0 0 1 18 18",key:"159ez6"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vl=tt("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const DS=tt("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const LS=tt("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P_=tt("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const IS=tt("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const US=tt("Cpu",[["rect",{width:"16",height:"16",x:"4",y:"4",rx:"2",key:"14l7u7"}],["rect",{width:"6",height:"6",x:"9",y:"9",rx:"1",key:"5aljv4"}],["path",{d:"M15 2v2",key:"13l42r"}],["path",{d:"M15 20v2",key:"15mkzm"}],["path",{d:"M2 15h2",key:"1gxd5l"}],["path",{d:"M2 9h2",key:"1bbxkp"}],["path",{d:"M20 15h2",key:"19e6y8"}],["path",{d:"M20 9h2",key:"19tzq7"}],["path",{d:"M9 2v2",key:"165o2o"}],["path",{d:"M9 20v2",key:"i2bqo8"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const FS=tt("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const OS=tt("EyeOff",[["path",{d:"M9.88 9.88a3 3 0 1 0 4.24 4.24",key:"1jxqfv"}],["path",{d:"M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68",key:"9wicm4"}],["path",{d:"M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61",key:"1jreej"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kS=tt("Eye",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const BS=tt("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zp=tt("Hand",[["path",{d:"M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2",key:"1fvzgz"}],["path",{d:"M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2",key:"1kc0my"}],["path",{d:"M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8",key:"10h0bg"}],["path",{d:"M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15",key:"1s1gnw"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qp=tt("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hl=tt("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zS=tt("MessageSquare",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N_=tt("Mic",[["path",{d:"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z",key:"131961"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2",key:"1vc78b"}],["line",{x1:"12",x2:"12",y1:"19",y2:"22",key:"x3vr5v"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ch=tt("Navigation",[["polygon",{points:"3 11 22 2 13 21 11 13 3 11",key:"1ltx0t"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const VS=tt("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D_=tt("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const HS=tt("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jp=tt("Route",[["circle",{cx:"6",cy:"19",r:"3",key:"1kj8tv"}],["path",{d:"M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15",key:"1d8sl"}],["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const GS=tt("Send",[["path",{d:"m22 2-7 20-4-9-9-4Z",key:"1q3vgg"}],["path",{d:"M22 2 11 13",key:"nzbqef"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const WS=tt("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const XS=tt("Shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L_=tt("Square",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const em=tt("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jS=tt("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tm=tt("Volume2",[["polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5",key:"16drj5"}],["path",{d:"M15.54 8.46a5 5 0 0 1 0 7.07",key:"ltjumu"}],["path",{d:"M19.07 4.93a10 10 0 0 1 0 14.14",key:"1kegas"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $S=tt("Wrench",[["path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",key:"cbrjhi"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mf=tt("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const YS=tt("ZoomIn",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"11",x2:"11",y1:"8",y2:"14",key:"1vmskp"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qS=tt("ZoomOut",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]]),KS=()=>{const t=ve.useRef(null);return ve.useEffect(()=>{const e=t.current;if(!e)return;const n=e.getContext("2d");if(!n)return;let i=0,r;const s=Array.from({length:70},()=>{const o=Math.random()*Math.PI*2,l=Math.random()*Math.PI,c=40+Math.random()*8;return{x:c*Math.sin(l)*Math.cos(o),y:c*Math.sin(l)*Math.sin(o)*.7,z:c*Math.cos(l)}}),a=()=>{i+=.015;const{width:o,height:l}=e,c=o/2,d=l/2;n.clearRect(0,0,o,l),n.fillStyle="#ff7700",n.strokeStyle="rgba(0, 240, 255, 0.25)";const h=s.map(u=>{const p=u.x*Math.cos(i)-u.z*Math.sin(i),E=180/(180+(u.x*Math.sin(i)+u.z*Math.cos(i)));return{x:c+p*E,y:d+u.y*E,scale:E}});for(let u=0;u<h.length;u++)for(let p=u+1;p<h.length;p++){const m=h[u].x-h[p].x,E=h[u].y-h[p].y;Math.sqrt(m*m+E*E)<32&&(n.lineWidth=.5,n.beginPath(),n.moveTo(h[u].x,h[u].y),n.lineTo(h[p].x,h[p].y),n.stroke())}h.forEach(u=>{n.beginPath(),n.arc(u.x,u.y,1.8*u.scale,0,Math.PI*2),n.fill()}),r=requestAnimationFrame(a)};return a(),()=>{cancelAnimationFrame(r)}},[]),M.jsx("canvas",{ref:t,width:220,height:120,className:"w-full h-[120px]"})};class ZS{constructor(e="/api/v1"){it(this,"baseUrl");this.baseUrl=e}async getConversations(e=50,n=0){try{const i=await fetch(`${this.baseUrl}/conversations?limit=${e}&offset=${n}`);if(!i.ok)return console.warn(`[ConversationService] Failed to fetch conversations: ${i.statusText}`),[];const r=await i.json();return Array.isArray(r)?r:[]}catch(i){return console.warn("[ConversationService] Network error fetching conversations:",i),[]}}async getConversationDetail(e){try{const n=await fetch(`${this.baseUrl}/conversations/${e}`);return n.ok?await n.json():(console.warn(`[ConversationService] Failed to fetch session ${e}: ${n.statusText}`),null)}catch(n){return console.warn(`[ConversationService] Network error fetching session ${e}:`,n),null}}async deleteConversation(e){try{return(await fetch(`${this.baseUrl}/conversations/${e}`,{method:"DELETE"})).ok}catch(n){return console.warn(`[ConversationService] Network error deleting session ${e}:`,n),!1}}}class I_{constructor(e="/api/v1"){it(this,"baseUrl");this.baseUrl=e}async createMemory(e){try{const n=await fetch(`${this.baseUrl}/memory`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});return n.ok?await n.json():null}catch(n){return console.warn("[MemoryService] Network error creating memory:",n),null}}async listMemories(e,n=!0,i=50,r=0){try{const s=new URLSearchParams;e&&s.append("memory_type",e),n!==void 0&&s.append("is_active",String(n)),s.append("limit",String(i)),s.append("offset",String(r));const a=await fetch(`${this.baseUrl}/memory?${s.toString()}`);return a.ok?await a.json():{total:0,items:[]}}catch(s){return console.warn("[MemoryService] Network error listing memories:",s),{total:0,items:[]}}}async getMemory(e){try{const n=await fetch(`${this.baseUrl}/memory/${e}`);return n.ok?await n.json():null}catch(n){return console.warn(`[MemoryService] Network error getting memory ${e}:`,n),null}}async updateMemory(e,n){try{const i=await fetch(`${this.baseUrl}/memory/${e}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});return i.ok?await i.json():null}catch(i){return console.warn(`[MemoryService] Network error updating memory ${e}:`,i),null}}async deleteMemory(e){try{return(await fetch(`${this.baseUrl}/memory/${e}`,{method:"DELETE"})).ok}catch(n){return console.warn(`[MemoryService] Network error deleting memory ${e}:`,n),!1}}}const QS=()=>{const[t,e]=ve.useState("chat"),{activeModel:n,systemMetrics:i,conversationId:r,conversations:s,isLoadingConversations:a,setConversations:o,setIsLoadingConversations:l,removeConversationFromStore:c,loadConversationSession:d,resetActiveSession:h}=jr(),u=ve.useRef(new ZS),p=ve.useRef(new I_),[m,E]=ve.useState([]),[g,f]=ve.useState(!1),_=[{id:"chat",label:"CHAT",icon:zS},{id:"voice",label:"VOICE",icon:N_},{id:"system",label:"SYSTEM",icon:US},{id:"memory",label:"MEMORY",icon:FS},{id:"tools",label:"TOOLS",icon:$S},{id:"settings",label:"SETTINGS",icon:WS}],S=async()=>{l(!0);const H=await u.current.getConversations(50,0);o(H),l(!1)},y=async()=>{f(!0);const H=await p.current.listMemories(void 0,!0,50,0);E(H.items||[]),f(!1)};ve.useEffect(()=>{t==="chat"?S():t==="memory"&&y()},[t,r]);const b=async H=>{if(H===r)return;const I=await u.current.getConversationDetail(H);I&&d(I)},w=async(H,I)=>{H.stopPropagation(),await u.current.deleteConversation(I)&&c(I)},A=async(H,I)=>{H.stopPropagation(),await p.current.deleteMemory(I)&&E(j=>j.filter(Q=>Q.id!==I))},x=i!==null,C=i?i.cpu_usage:0,N=i?i.ram_usage:0,P=(i==null?void 0:i.gpu_usage)??null,z=(i==null?void 0:i.temperature)??null,K=(i==null?void 0:i.uptime)??"--:--:--",ee=Hs(n),O=A_(n);return M.jsxs("aside",{className:"w-[240px] flex flex-col gap-3 shrink-0 z-10 relative pointer-events-auto h-full min-h-0 overflow-hidden",children:[M.jsx("nav",{className:"flex flex-col gap-1 bg-[#080e1a]/75 backdrop-blur-[14px] -webkit-backdrop-blur-[14px] border border-[#00f0ff]/20 rounded-xl p-2.5 shadow-xl shrink-0",children:_.map(H=>{const I=H.icon,L=t===H.id;return M.jsxs("button",{onClick:()=>e(H.id),className:`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 ${L?"bg-[#00f0ff]/15 border border-[#00f0ff]/60 text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.35)]":"text-gray-400 hover:bg-[#00f0ff]/5 hover:text-gray-200"}`,children:[M.jsx(I,{className:"w-4 h-4"}),M.jsx("span",{children:H.label})]},H.id)})}),t==="chat"?M.jsxs("div",{className:"flex-1 bg-[#080e1a]/75 backdrop-blur-[14px] -webkit-backdrop-blur-[14px] border border-[#00f0ff]/20 rounded-xl p-3 flex flex-col gap-2 min-h-0 overflow-hidden shadow-xl",children:[M.jsxs("div",{className:"flex items-center justify-between border-b border-[#00f0ff]/10 pb-2 shrink-0",children:[M.jsx("h3",{className:"font-hud text-xs tracking-widest text-gray-400",children:"HISTORY"}),M.jsxs("button",{onClick:h,className:"flex items-center gap-1 bg-[#00f0ff]/10 border border-[#00f0ff]/40 hover:bg-[#00f0ff]/20 text-[#00f0ff] text-[10px] font-semibold px-2 py-1 rounded-md transition-all shadow-[0_0_10px_rgba(0,240,255,0.2)]",children:[M.jsx(VS,{className:"w-3 h-3"}),M.jsx("span",{children:"NEW CHAT"})]})]}),M.jsx("div",{className:"flex-1 overflow-y-auto pr-1 space-y-1.5 min-h-0",children:a?M.jsxs("div",{className:"h-full flex items-center justify-center text-gray-500 text-xs gap-2",children:[M.jsx(Qp,{className:"w-4 h-4 animate-spin text-[#00f0ff]"}),M.jsx("span",{children:"Loading sessions..."})]}):s.length===0?M.jsxs("div",{className:"h-full flex flex-col items-center justify-center text-gray-500 text-[11px] text-center p-3",children:[M.jsx(P_,{className:"w-5 h-5 text-gray-600 mb-1"}),M.jsx("span",{children:"No past sessions found."})]}):s.map(H=>{const I=H.id===r,L=new Date(H.updated_at).toLocaleDateString([],{month:"short",day:"numeric"}),j=new Date(H.updated_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return M.jsxs("div",{onClick:()=>b(H.id),className:`group relative flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-all duration-200 ${I?"bg-[#00f0ff]/15 border-[#00f0ff]/60 text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.3)]":"bg-black/30 border-[#00f0ff]/10 text-gray-300 hover:border-[#00f0ff]/30 hover:bg-[#00f0ff]/5"}`,children:[M.jsxs("div",{className:"flex flex-col min-w-0 pr-2",children:[M.jsxs("span",{className:"font-hud font-bold tracking-wider truncate text-[11px]",children:["Session ",H.id.substring(0,8)]}),M.jsxs("span",{className:"text-[9px] text-gray-400 font-mono",children:[L," · ",j]})]}),M.jsx("button",{onClick:Q=>w(Q,H.id),title:"Delete conversation",className:"opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all shrink-0",children:M.jsx(em,{className:"w-3.5 h-3.5"})})]},H.id)})})]}):t==="memory"?M.jsxs("div",{className:"flex-1 bg-[#080e1a]/75 backdrop-blur-[14px] -webkit-backdrop-blur-[14px] border border-[#00f0ff]/20 rounded-xl p-3 flex flex-col gap-2 min-h-0 overflow-hidden shadow-xl",children:[M.jsxs("div",{className:"flex items-center justify-between border-b border-[#00f0ff]/10 pb-2 shrink-0",children:[M.jsx("h3",{className:"font-hud text-xs tracking-widest text-gray-400",children:"MEMORY STORE"}),M.jsx("button",{onClick:y,title:"Refresh memories",className:"p-1 bg-[#00f0ff]/10 border border-[#00f0ff]/30 hover:bg-[#00f0ff]/20 text-[#00f0ff] rounded-md transition-all",children:M.jsx(D_,{className:"w-3 h-3"})})]}),M.jsx("div",{className:"flex-1 overflow-y-auto pr-1 space-y-1.5 min-h-0",children:g?M.jsxs("div",{className:"h-full flex items-center justify-center text-gray-500 text-xs gap-2",children:[M.jsx(Qp,{className:"w-4 h-4 animate-spin text-[#00f0ff]"}),M.jsx("span",{children:"Loading memories..."})]}):m.length===0?M.jsxs("div",{className:"h-full flex flex-col items-center justify-center text-gray-500 text-[11px] text-center p-3",children:[M.jsx(NS,{className:"w-5 h-5 text-gray-600 mb-1"}),M.jsxs("span",{children:["No active memories stored. Use ",M.jsx("code",{className:"text-[#00f0ff]",children:"/remember <fact>"})," to save one!"]})]}):m.map(H=>M.jsxs("div",{className:"group relative flex flex-col gap-1 p-2 rounded-lg border bg-black/40 border-[#00f0ff]/15 text-xs hover:border-[#00f0ff]/40 transition-all duration-200",children:[M.jsxs("div",{className:"flex items-center justify-between gap-1",children:[M.jsx("span",{className:"font-mono text-[9px] font-bold text-[#ff7700] uppercase bg-[#ff7700]/10 px-1.5 py-0.5 rounded border border-[#ff7700]/30",children:H.memory_type}),M.jsxs("div",{className:"flex items-center gap-1",children:[M.jsxs("span",{className:"text-[9px] font-mono text-gray-400",children:[(H.confidence*100).toFixed(0),"%"]}),M.jsx("button",{onClick:I=>A(I,H.id),title:"Forget memory",className:"opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-red-400 rounded transition-all",children:M.jsx(em,{className:"w-3 h-3"})})]})]}),M.jsx("p",{className:"text-[11px] text-gray-200 font-sans leading-tight break-words",children:H.content})]},H.id))})]}):M.jsxs("div",{className:"flex-1 bg-[#080e1a]/75 backdrop-blur-[14px] -webkit-backdrop-blur-[14px] border border-[#00f0ff]/20 rounded-xl p-3 flex flex-col gap-2 min-h-0 overflow-hidden shadow-xl",children:[M.jsxs("div",{className:"flex items-center justify-between border-b border-[#00f0ff]/10 pb-2 shrink-0",children:[M.jsx("h3",{className:"font-hud text-xs tracking-widest text-gray-400",children:"ACTIVE MODEL"}),M.jsx("span",{className:"text-[9px] font-mono text-[#ff7700] tracking-wider",children:O})]}),M.jsx("div",{className:"font-hud text-xs font-bold text-[#ff7700] tracking-wider uppercase mt-1 shrink-0",children:ee}),M.jsx("div",{className:"flex-1 flex items-center justify-center min-h-0",children:M.jsx(KS,{})})]}),M.jsxs("div",{className:"bg-[#080e1a]/75 backdrop-blur-[14px] -webkit-backdrop-blur-[14px] border border-[#00f0ff]/20 rounded-xl p-3 flex flex-col gap-2 shadow-xl shrink-0",children:[M.jsxs("div",{className:"flex items-center justify-between border-b border-[#00f0ff]/10 pb-1.5",children:[M.jsx("h3",{className:"font-hud text-[11px] tracking-widest text-gray-400",children:"SYSTEM OVERVIEW"}),x?M.jsx("span",{className:"text-[9px] text-[#00ffaa] font-semibold",title:"Real-time backend metrics stream",children:"● LIVE"}):M.jsx("span",{className:"text-[9px] text-[#ff5555] font-semibold",title:"Backend offline",children:"OFFLINE"})]}),M.jsxs("div",{className:"flex flex-col gap-1.5 text-xs",children:[M.jsxs("div",{className:"flex items-center justify-between gap-2",children:[M.jsx("span",{className:"text-gray-400 text-[10px] w-8",children:"CPU"}),M.jsx("div",{className:"flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden",children:M.jsx("div",{className:"h-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] transition-all duration-500",style:{width:`${Math.min(Math.max(C,0),100)}%`}})}),M.jsx("span",{className:"font-mono text-[10px] text-gray-200 w-8 text-right",children:x?`${C}%`:"--"})]}),M.jsxs("div",{className:"flex items-center justify-between gap-2",children:[M.jsx("span",{className:"text-gray-400 text-[10px] w-8",children:"RAM"}),M.jsx("div",{className:"flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden",children:M.jsx("div",{className:"h-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] transition-all duration-500",style:{width:`${Math.min(Math.max(N,0),100)}%`}})}),M.jsx("span",{className:"font-mono text-[10px] text-gray-200 w-8 text-right",children:x?`${N}%`:"--"})]}),M.jsxs("div",{className:"flex items-center justify-between gap-2",children:[M.jsx("span",{className:"text-gray-400 text-[10px] w-8",children:"GPU"}),P!==null?M.jsxs(M.Fragment,{children:[M.jsx("div",{className:"flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden",children:M.jsx("div",{className:"h-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] transition-all duration-500",style:{width:`${Math.min(Math.max(P,0),100)}%`}})}),M.jsxs("span",{className:"font-mono text-[10px] text-gray-200 w-8 text-right",children:[P,"%"]})]}):M.jsx("span",{className:"font-mono text-[10px] text-gray-500 flex-1 text-right",children:"N/A"})]}),M.jsxs("div",{className:"flex items-center justify-between gap-2",children:[M.jsx("span",{className:"text-gray-400 text-[10px] w-8",children:"TEMP"}),M.jsx("span",{className:"font-mono text-[10px] text-[#00f0ff]",children:z!==null?`${z}°C`:"N/A"})]}),M.jsxs("div",{className:"flex items-center justify-between gap-2",children:[M.jsx("span",{className:"text-gray-400 text-[10px] w-8",children:"UPTIME"}),M.jsx("span",{className:"font-mono text-[10px] text-[#00f0ff]",children:K})]})]})]})]})},JS=({operationId:t,toolName:e,path:n,diff:i,message:r})=>{const[s,a]=ve.useState(!0),[o,l]=ve.useState("pending"),[c,d]=ve.useState(null),h=async()=>{l("applying"),d(null);try{const p=await fetch(`http://127.0.0.1:8000/api/v1/file-operations/${t}/approve`,{method:"POST"}),m=await p.json();p.ok&&m.success?(l("applied"),d(m.message||"File modification applied successfully.")):(l("error"),d(m.detail||m.message||"Failed to apply file modification."))}catch(p){l("error"),d((p==null?void 0:p.message)||"Network error while applying file modification.")}},u=async()=>{l("cancelling"),d(null);try{const p=await fetch(`http://127.0.0.1:8000/api/v1/file-operations/${t}/cancel`,{method:"POST"}),m=await p.json();p.ok&&m.success?(l("cancelled"),d("Operation cancelled. No changes were made to your file.")):(l("error"),d(m.detail||m.message||"Failed to cancel operation."))}catch(p){l("error"),d((p==null?void 0:p.message)||"Network error while cancelling operation.")}};return M.jsxs("div",{className:"my-3 border border-[#ffaa00]/40 bg-[#121927]/95 rounded-xl p-3.5 shadow-[0_0_15px_rgba(255,170,0,0.15)] text-xs font-sans",children:[M.jsxs("div",{className:"flex items-center justify-between border-b border-[#ffaa00]/20 pb-2 mb-2.5",children:[M.jsxs("div",{className:"flex items-center gap-2",children:[M.jsx(BS,{className:"w-4 h-4 text-[#ffaa00]"}),M.jsx("span",{className:"font-hud font-bold text-[#ffaa00] tracking-wider uppercase",children:"FILE CHANGE PROPOSAL"})]}),M.jsx("span",{className:"font-mono text-[10px] text-gray-400 bg-black/40 px-2 py-0.5 rounded border border-gray-700",children:e})]}),M.jsxs("div",{className:"mb-2.5",children:[M.jsxs("div",{className:"text-gray-300 font-mono text-[11px] bg-black/50 p-2 rounded border border-gray-800 flex items-center justify-between",children:[M.jsx("span",{className:"truncate text-[#00f0ff]",children:n}),M.jsx("span",{className:"text-[10px] uppercase font-bold text-[#ffaa00] ml-2 shrink-0",children:o})]}),r&&M.jsx("p",{className:"text-gray-300 text-[11px] mt-1.5 leading-relaxed",children:r})]}),i&&M.jsxs("div",{className:"mb-3",children:[M.jsxs("button",{onClick:()=>a(!s),className:"flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-white transition-colors mb-1.5",children:[s?M.jsx(OS,{className:"w-3.5 h-3.5"}):M.jsx(kS,{className:"w-3.5 h-3.5"}),M.jsx("span",{children:s?"Hide Diff Preview":"Show Unified Diff"})]}),s&&M.jsx("pre",{className:"font-mono text-[11px] p-2.5 bg-black/80 text-gray-200 rounded border border-gray-800 overflow-x-auto max-h-48 whitespace-pre leading-relaxed select-text",children:i.split(`
`).map((p,m)=>{let E="text-gray-300";return p.startsWith("+")?E="text-[#00ffaa] bg-[#00ffaa]/10":p.startsWith("-")?E="text-[#ff5555] bg-[#ff5555]/10":p.startsWith("@")&&(E="text-[#00f0ff]"),M.jsx("div",{className:E,children:p},m)})})]}),c&&M.jsxs("div",{className:`p-2 rounded mb-2.5 text-[11px] border flex items-center gap-2 ${o==="applied"?"bg-[#00ffaa]/10 border-[#00ffaa]/30 text-[#00ffaa]":o==="cancelled"?"bg-gray-800/80 border-gray-700 text-gray-300":"bg-[#ff5555]/10 border-[#ff5555]/30 text-[#ff5555]"}`,children:[o==="applied"?M.jsx(Vl,{className:"w-3.5 h-3.5 shrink-0"}):o==="error"?M.jsx(jS,{className:"w-3.5 h-3.5 shrink-0"}):M.jsx(Mf,{className:"w-3.5 h-3.5 shrink-0"}),M.jsx("span",{children:c})]}),o==="pending"&&M.jsxs("div",{className:"flex items-center gap-2 pt-1 border-t border-gray-800",children:[M.jsxs("button",{onClick:h,className:"flex-1 bg-[#00ffaa]/20 hover:bg-[#00ffaa] text-[#00ffaa] hover:text-black font-semibold text-xs py-1.5 px-3 rounded border border-[#00ffaa]/40 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(0,255,170,0.2)]",children:[M.jsx(Vl,{className:"w-3.5 h-3.5"}),M.jsx("span",{children:"APPLY CHANGE"})]}),M.jsxs("button",{onClick:u,className:"flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-semibold text-xs py-1.5 px-3 rounded border border-gray-700 transition-all flex items-center justify-center gap-1.5",children:[M.jsx(Mf,{className:"w-3.5 h-3.5"}),M.jsx("span",{children:"CANCEL"})]})]})]})},eM=({origin:t={lat:11.0168,lng:76.9558,name:"Current Location"},destination:e,waypoints:n=[],distanceKm:i,durationMinutes:r})=>{const[s,a]=ve.useState(13);return M.jsxs("div",{className:"my-3 border border-[#00f0ff]/30 bg-[#060b14]/95 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.15)] font-sans",children:[M.jsxs("div",{className:"flex items-center justify-between px-3.5 py-2 bg-[#0c1629] border-b border-[#00f0ff]/20 text-xs",children:[M.jsxs("div",{className:"flex items-center gap-2",children:[M.jsx(ch,{className:"w-4 h-4 text-[#00f0ff]"}),M.jsx("span",{className:"font-hud font-bold text-[#00f0ff] tracking-wider uppercase",children:"JARVIS HUD MAP"})]}),i&&r&&M.jsxs("div",{className:"flex items-center gap-2 text-[11px] font-mono",children:[M.jsxs("span",{className:"text-[#00ffaa] font-bold",children:[i," km"]}),M.jsx("span",{className:"text-gray-500",children:"•"}),M.jsxs("span",{className:"text-[#ffaa00] font-bold",children:[r," min"]})]})]}),M.jsxs("div",{className:"relative w-full h-56 bg-[#040811] overflow-hidden flex items-center justify-center border-b border-gray-800",children:[M.jsx("div",{className:"absolute inset-0 bg-[linear-gradient(to_right,#00f0ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff08_1px,transparent_1px)] bg-[size:20px_20px]"}),M.jsx("div",{className:"absolute w-44 h-44 rounded-full border border-[#00f0ff]/10 animate-pulse pointer-events-none"}),M.jsxs("div",{className:"absolute flex flex-col items-center z-10",children:[M.jsxs("div",{className:"relative flex items-center justify-center",children:[M.jsx("span",{className:"absolute w-6 h-6 rounded-full bg-[#00f0ff]/30 animate-ping"}),M.jsx("span",{className:"w-3.5 h-3.5 rounded-full bg-[#00f0ff] shadow-[0_0_12px_#00f0ff] border-2 border-white"})]}),M.jsx("span",{className:"mt-1 font-mono text-[9px] text-[#00f0ff] bg-black/80 px-1.5 py-0.5 rounded border border-[#00f0ff]/40",children:t.name||"YOU"})]}),e&&M.jsxs("div",{className:"absolute translate-x-20 -translate-y-12 flex flex-col items-center z-10",children:[M.jsx(Hl,{className:"w-5 h-5 text-[#ff5555] shadow-[0_0_10px_#ff5555] animate-bounce"}),M.jsx("span",{className:"font-mono text-[9px] text-[#ff5555] bg-black/80 px-1.5 py-0.5 rounded border border-[#ff5555]/40 truncate max-w-[120px]",children:e.name||"DESTINATION"})]}),e&&M.jsx("svg",{className:"absolute inset-0 w-full h-full pointer-events-none",xmlns:"http://www.w3.org/2000/svg",children:M.jsx("path",{d:"M 50% 50% Q 65% 30% 70% 30%",fill:"none",stroke:"#00ffaa",strokeWidth:"3",strokeDasharray:"6 4",className:"animate-[dash_2s_linear_infinite]"})}),M.jsxs("div",{className:"absolute bottom-2.5 right-2.5 flex flex-col gap-1 z-20",children:[M.jsx("button",{onClick:()=>a(o=>Math.min(o+1,18)),className:"p-1.5 bg-black/70 hover:bg-[#00f0ff] text-gray-300 hover:text-black rounded border border-gray-700 transition-colors",title:"Zoom In",children:M.jsx(YS,{className:"w-3.5 h-3.5"})}),M.jsx("button",{onClick:()=>a(o=>Math.max(o-1,1)),className:"p-1.5 bg-black/70 hover:bg-[#00f0ff] text-gray-300 hover:text-black rounded border border-gray-700 transition-colors",title:"Zoom Out",children:M.jsx(qS,{className:"w-3.5 h-3.5"})}),M.jsx("button",{onClick:()=>a(13),className:"p-1.5 bg-black/70 hover:bg-[#00f0ff] text-gray-300 hover:text-black rounded border border-gray-700 transition-colors",title:"Recenter",children:M.jsx(HS,{className:"w-3.5 h-3.5"})})]}),M.jsxs("span",{className:"absolute bottom-2.5 left-2.5 font-mono text-[9px] text-gray-400 bg-black/60 px-2 py-0.5 rounded border border-gray-800",children:["ZOOM: ",s,"x | OPENSTREETMAP"]})]})]})},tM=({originName:t="Current Location",destinationName:e,distanceKm:n,durationMinutes:i,mode:r="driving",steps:s=[],onOpenMap:a})=>M.jsxs("div",{className:"my-3 border border-[#00f0ff]/40 bg-[#081222]/95 rounded-xl p-3.5 shadow-[0_0_15px_rgba(0,240,255,0.15)] text-xs font-sans",children:[M.jsxs("div",{className:"flex items-center justify-between border-b border-[#00f0ff]/20 pb-2 mb-2.5",children:[M.jsxs("div",{className:"flex items-center gap-2",children:[M.jsx(Jp,{className:"w-4 h-4 text-[#00f0ff]"}),M.jsx("span",{className:"font-hud font-bold text-[#00f0ff] tracking-wider uppercase",children:"ROUTE GUIDANCE"})]}),M.jsx("span",{className:"font-mono text-[10px] text-gray-400 bg-black/40 px-2 py-0.5 rounded border border-gray-800 uppercase",children:r})]}),M.jsxs("div",{className:"space-y-2 mb-3",children:[M.jsxs("div",{className:"flex items-center gap-2 text-gray-300 font-mono text-[11px] bg-black/50 p-2 rounded border border-gray-800",children:[M.jsx(Hl,{className:"w-3.5 h-3.5 text-[#00ffaa] shrink-0"}),M.jsx("span",{className:"truncate",children:t}),M.jsx("span",{className:"text-gray-500 mx-1",children:"➔"}),M.jsx(Hl,{className:"w-3.5 h-3.5 text-[#ff5555] shrink-0"}),M.jsx("span",{className:"truncate font-bold text-white",children:e})]}),M.jsxs("div",{className:"grid grid-cols-2 gap-2 text-[11px] font-mono",children:[M.jsxs("div",{className:"flex items-center gap-1.5 bg-black/40 p-2 rounded border border-gray-800",children:[M.jsx(ch,{className:"w-3.5 h-3.5 text-[#00f0ff]"}),M.jsx("span",{className:"text-gray-400",children:"Distance:"}),M.jsxs("span",{className:"text-white font-bold",children:[n," km"]})]}),M.jsxs("div",{className:"flex items-center gap-1.5 bg-black/40 p-2 rounded border border-gray-800",children:[M.jsx(P_,{className:"w-3.5 h-3.5 text-[#ffaa00]"}),M.jsx("span",{className:"text-gray-400",children:"ETA:"}),M.jsxs("span",{className:"text-white font-bold",children:[i," min"]})]})]})]}),s.length>0&&M.jsxs("div",{className:"mb-3",children:[M.jsx("span",{className:"text-[10px] uppercase font-hud tracking-wider text-gray-400 block mb-1",children:"KEY STEPS:"}),M.jsx("div",{className:"space-y-1 bg-black/60 p-2 rounded border border-gray-800 max-h-28 overflow-y-auto font-mono text-[10px]",children:s.map((o,l)=>M.jsxs("div",{className:"flex items-start gap-1.5 text-gray-300",children:[M.jsxs("span",{className:"text-[#00f0ff] font-bold",children:[l+1,"."]}),M.jsx("span",{className:"flex-1",children:o.instruction}),M.jsxs("span",{className:"text-gray-500 shrink-0",children:[o.distance_km," km"]})]},l))})]}),a&&M.jsxs("button",{onClick:a,className:"w-full bg-[#00f0ff]/20 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-black font-semibold text-xs py-1.5 px-3 rounded border border-[#00f0ff]/40 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(0,240,255,0.2)]",children:[M.jsx(Jp,{className:"w-3.5 h-3.5"}),M.jsx("span",{children:"VIEW INTERACTIVE MAP"})]})]});class nM{constructor(){it(this,"currentLocation",null);it(this,"permissionState","LOCATION_PERMISSION_UNKNOWN");it(this,"watchId",null);it(this,"trackingListeners",new Set)}getPermissionState(){return this.permissionState}getCurrentLocation(){return this.currentLocation}async requestCurrentLocation(){if(!("geolocation"in navigator))throw this.permissionState="LOCATION_UNAVAILABLE",new Error("Geolocation is not supported by your browser or device.");return new Promise((e,n)=>{navigator.geolocation.getCurrentPosition(i=>{this.permissionState="LOCATION_PERMISSION_GRANTED";const r={latitude:i.coords.latitude,longitude:i.coords.longitude,accuracy:i.coords.accuracy??null,altitude:i.coords.altitude??null,heading:i.coords.heading??null,speed:i.coords.speed??null,timestamp:i.timestamp};this.currentLocation=r,e(r)},i=>{i.code===i.PERMISSION_DENIED?this.permissionState="LOCATION_PERMISSION_DENIED":this.permissionState="LOCATION_UNAVAILABLE",n(new Error(this.getErrorMessage(i)))},{enableHighAccuracy:!0,timeout:1e4,maximumAge:0})})}startLocationTracking(e){if(!("geolocation"in navigator)){this.permissionState="LOCATION_UNAVAILABLE";return}this.trackingListeners.add(e),this.watchId===null&&(this.permissionState="LOCATION_TRACKING_ACTIVE",this.watchId=navigator.geolocation.watchPosition(n=>{const i={latitude:n.coords.latitude,longitude:n.coords.longitude,accuracy:n.coords.accuracy??null,altitude:n.coords.altitude??null,heading:n.coords.heading??null,speed:n.coords.speed??null,timestamp:n.timestamp};this.currentLocation=i,this.trackingListeners.forEach(r=>r(i))},n=>{n.code===n.PERMISSION_DENIED&&(this.permissionState="LOCATION_PERMISSION_DENIED",this.stopLocationTracking())},{enableHighAccuracy:!0,timeout:1e4,maximumAge:5e3}))}stopLocationTracking(){this.watchId!==null&&(navigator.geolocation.clearWatch(this.watchId),this.watchId=null),this.trackingListeners.clear(),this.permissionState="LOCATION_TRACKING_STOPPED"}clearLocation(){this.stopLocationTracking(),this.currentLocation=null,this.permissionState="LOCATION_PERMISSION_UNKNOWN"}getErrorMessage(e){switch(e.code){case e.PERMISSION_DENIED:return"Location permission was denied. Enable location access in your browser settings and try again.";case e.POSITION_UNAVAILABLE:return"Your device could not determine your current location.";case e.TIMEOUT:return"Location request timed out. Please try again.";default:return"An unknown location error occurred."}}}const Rs=new nM,iM=({purpose:t="Directions / Map / Current Location",onGranted:e,onCancelled:n})=>{const[i,r]=ve.useState(!1),[s,a]=ve.useState(null),[o,l]=ve.useState("LOCATION_PERMISSION_UNKNOWN");ve.useEffect(()=>{l(Rs.getPermissionState())},[]);const c=async()=>{console.log("[LOCATION DEBUG] Permission/Refresh button clicked"),r(!0),a(null);try{console.log("[LOCATION DEBUG] Browser geolocation request started");const h=await Rs.requestCurrentLocation();l(Rs.getPermissionState()),console.log(`[LOCATION DEBUG] Position received
latitude=${h.latitude}
longitude=${h.longitude}
accuracy=${h.accuracy}`),e(h)}catch(h){console.warn("[LOCATION DEBUG] Location request error:",h.message),a(h.message||"Failed to access location.")}finally{r(!1)}},d=o==="LOCATION_PERMISSION_GRANTED"||o==="LOCATION_TRACKING_ACTIVE";return M.jsxs("div",{className:"my-3 border border-[#00f0ff]/40 bg-[#0c1629]/95 rounded-xl p-3.5 shadow-[0_0_15px_rgba(0,240,255,0.15)] text-xs font-sans",children:[M.jsxs("div",{className:"flex items-center gap-2 border-b border-[#00f0ff]/20 pb-2 mb-2.5",children:[M.jsx(Hl,{className:"w-4 h-4 text-[#00f0ff]"}),M.jsx("span",{className:"font-hud font-bold text-[#00f0ff] tracking-wider uppercase",children:d?"LOCATION ACTIVE":"LOCATION ACCESS REQUIRED"})]}),M.jsx("p",{className:"text-gray-200 text-[11px] mb-2 leading-relaxed",children:d?"JARVIS has location access. Click refresh to update your current GPS coordinates.":"JARVIS needs your current device location to answer this request."}),M.jsxs("div",{className:"flex items-center gap-1.5 text-[10px] text-gray-400 bg-black/40 p-2 rounded mb-3 border border-gray-800",children:[M.jsx(XS,{className:"w-3.5 h-3.5 text-[#00ffaa] shrink-0"}),M.jsxs("span",{children:["Purpose: ",M.jsx("strong",{className:"text-gray-200",children:t})]})]}),s&&M.jsx("div",{className:"p-2 mb-2.5 bg-[#ff5555]/10 border border-[#ff5555]/30 text-[#ff5555] rounded text-[11px]",children:s}),M.jsxs("div",{className:"flex items-center gap-2 pt-1 border-t border-gray-800",children:[M.jsxs("button",{onClick:c,disabled:i,className:"flex-1 bg-[#00f0ff]/20 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-black font-semibold text-xs py-1.5 px-3 rounded border border-[#00f0ff]/40 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(0,240,255,0.2)] disabled:opacity-50 cursor-pointer",children:[d?M.jsx(D_,{className:`w-3.5 h-3.5 ${i?"animate-spin":""}`}):M.jsx(Vl,{className:"w-3.5 h-3.5"}),M.jsx("span",{children:i?"ACQUIRING GPS...":d?"REFRESH LOCATION":"ALLOW LOCATION"})]}),n&&M.jsxs("button",{onClick:n,disabled:i,className:"flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-semibold text-xs py-1.5 px-3 rounded border border-gray-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer",children:[M.jsx(Mf,{className:"w-3.5 h-3.5"}),M.jsx("span",{children:"CANCEL"})]})]})]})},rM=({initialArea:t="Current Position",onStop:e})=>{const[n,i]=ve.useState(!0),[r,s]=ve.useState(Rs.getCurrentLocation());ve.useEffect(()=>(Rs.startLocationTracking(o=>{s(o)}),()=>{}),[]);const a=()=>{Rs.stopLocationTracking(),i(!1),e&&e()};return M.jsxs("div",{className:"my-3 border border-[#00ffaa]/40 bg-[#0a1a1b]/95 rounded-xl p-3.5 shadow-[0_0_15px_rgba(0,255,170,0.15)] text-xs font-sans",children:[M.jsxs("div",{className:"flex items-center justify-between border-b border-[#00ffaa]/20 pb-2 mb-2.5",children:[M.jsxs("div",{className:"flex items-center gap-2",children:[M.jsx(ch,{className:`w-4 h-4 text-[#00ffaa] ${n?"animate-pulse":""}`}),M.jsx("span",{className:"font-hud font-bold text-[#00ffaa] tracking-wider uppercase",children:"LOCATION TRACKING"})]}),M.jsx("span",{className:`font-mono text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${n?"bg-[#00ffaa]/20 border-[#00ffaa]/50 text-[#00ffaa]":"bg-gray-800 border-gray-700 text-gray-400"}`,children:n?"ACTIVE":"STOPPED"})]}),M.jsxs("div",{className:"space-y-1.5 text-[11px] mb-3 font-mono",children:[M.jsxs("div",{className:"flex items-center justify-between bg-black/40 p-1.5 rounded border border-gray-800",children:[M.jsx("span",{className:"text-gray-400",children:"Current Area:"}),M.jsx("span",{className:"text-[#00f0ff] font-bold",children:t})]}),M.jsxs("div",{className:"flex items-center justify-between bg-black/40 p-1.5 rounded border border-gray-800",children:[M.jsx("span",{className:"text-gray-400",children:"Accuracy:"}),M.jsx("span",{className:"text-gray-200",children:r!=null&&r.accuracy?`${Math.round(r.accuracy)} m`:"Standard GPS"})]})]}),n&&M.jsxs("button",{onClick:a,className:"w-full bg-[#ff5555]/20 hover:bg-[#ff5555] text-[#ff5555] hover:text-black font-semibold text-xs py-1.5 px-3 rounded border border-[#ff5555]/40 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(255,85,85,0.2)]",children:[M.jsx(L_,{className:"w-3.5 h-3.5 fill-current"}),M.jsx("span",{children:"STOP TRACKING"})]})]})};class sM{constructor(){it(this,"baseUrl");it(this,"abortController",null);this.baseUrl=window.location.origin.startsWith("http")?window.location.origin:"http://127.0.0.1:8000"}async streamChat(e,n,i){var l;const{onStart:r,onChunk:s,onDone:a,onError:o}=i;this.abortController=new AbortController;try{const c=await fetch(`${this.baseUrl}/api/v1/chat/stream`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:e,conversation_id:n}),signal:this.abortController.signal});if(!c.ok){let p=`HTTP Error ${c.status}`;try{const m=await c.json();m.error&&(p=m.error)}catch{}throw new Error(p)}r==null||r();const d=(l=c.body)==null?void 0:l.getReader();if(!d)throw new Error("Response body stream unreadable.");const h=new TextDecoder("utf-8");let u="";for(;;){const{done:p,value:m}=await d.read();if(p)break;u+=h.decode(m,{stream:!0});const E=u.split(`
`);u=E.pop()||"";for(const g of E){const f=g.trim();if(!f||!f.startsWith("data: "))continue;const _=f.slice(6).trim();if(_)try{const S=JSON.parse(_);if(S.done){a(S);return}S.chunk&&s(S.chunk,S.model,S.conversation_id)}catch(S){console.warn("[SSEStreamClient] JSON parse error:",S)}}}if(u.trim().startsWith("data: ")){const p=u.trim().slice(6).trim();if(p)try{const m=JSON.parse(p);m.done?a(m):m.chunk&&s(m.chunk,m.model,m.conversation_id)}catch{}}}catch(c){c.name==="AbortError"?a({done:!0}):o(c.message||"Failed to stream response from backend.")}finally{this.abortController=null}}cancel(){this.abortController&&this.abortController.abort()}}class aM{constructor(){it(this,"memoryService");this.memoryService=new I_}async processInputAsync(e,n,i,r,s){const a=e.trim(),o=a.toLowerCase();if(o==="/clear"||o==="clear conversation"||o==="clear chat")return r(),{isCommand:!0,type:"clear",responseContent:"Conversation timeline cleared. System ready."};if(o==="/stop"||o==="stop")return s(),{isCommand:!0,type:"stop",responseContent:"Active stream cancelled. Returning to IDLE."};if(o.startsWith("/remember ")){const l=a.substring(10).trim();if(!l)return{isCommand:!0,type:"remember",responseContent:"⚠️ Usage: `/remember <fact to remember>`"};const c=await this.memoryService.createMemory({content:l,memory_type:"preference",confidence:1,importance:.9,source:"user_explicit"});return c?{isCommand:!0,type:"remember",responseContent:`🧠 **MEMORY PERSISTED**

- **Fact**: "${c.content}"
- **Type**: \`${c.memory_type.toUpperCase()}\`
- **Confidence**: \`100%\`
- **Source**: \`user_explicit\``}:{isCommand:!0,type:"remember",responseContent:"⚠️ Failed to save memory record. Please check backend connection."}}if(o==="/memory"||o==="/memory list"){const l=await this.memoryService.listMemories(void 0,!0,20,0);if(l.items.length===0)return{isCommand:!0,type:"memory",responseContent:`🧠 **JARVIS MEMORY SYSTEM**

No stored user memories found.`};const c=l.items.map((d,h)=>`${h+1}. **[${d.memory_type.toUpperCase()}]** "${d.content}" *(Confidence: ${(d.confidence*100).toFixed(0)}%)*`);return{isCommand:!0,type:"memory",responseContent:`🧠 **STORED USER MEMORIES (${l.total} Total)**

${c.join(`
`)}`}}if(o.startsWith("/memory forget ")){const l=o.substring(15).trim(),d=(await this.memoryService.listMemories(void 0,!0,50,0)).items.filter(h=>h.content.toLowerCase().includes(l));if(d.length===0)return{isCommand:!0,type:"memory",responseContent:`⚠️ No active memories matched query "${l}".`};for(const h of d)await this.memoryService.deleteMemory(h.id);return{isCommand:!0,type:"memory",responseContent:`🧠 **MEMORY FORGOTTEN**

Deleted ${d.length} matching memory record(s) for "${l}".`}}if(o==="/memory clear")return{isCommand:!0,type:"memory",responseContent:"⚠️ **MEMORY CLEAR CONFIRMATION REQUIRED**\n\nUse `/memory forget <query>` to delete specific memories."};if(o==="/help"||o==="help"||o==="show commands")return{isCommand:!0,type:"help",responseContent:"**JARVIS ALLOWLISTED COMMAND SYSTEM**\n\n- `/help` — Display available commands\n- `/remember <fact>` — Explicitly persist a long-term memory\n- `/memory` or `/memory list` — Display stored active memories\n- `/memory forget <query>` — Delete matching stored memory\n- `/status` — Display system health & status\n- `/model` — Display active model information\n- `/metrics` — Display CPU, RAM, GPU & Temperature\n- `/clear` — Clear conversation timeline\n- `/stop` — Cancel active LLM generation stream"};if(o==="/model"||o==="what model are you using?"||o==="model status"||o==="show model"){const l=Hs(n),c=A_(n);return{isCommand:!0,type:"model",responseContent:`**ACTIVE LLM MODEL DETAILS**

- **Model**: \`${l}\`
- **Category**: \`${c}\`
- **Provider**: Local Ollama Engine
- **Routing**: Dynamic Intent-based Router`}}if(o==="/metrics"||o==="show cpu"||o==="show metrics"||o==="system metrics"){const l=i?`${i.cpu_usage}%`:"N/A",c=i?`${i.ram_usage}%`:"N/A",d=(i==null?void 0:i.gpu_usage)!==null&&(i==null?void 0:i.gpu_usage)!==void 0?`${i.gpu_usage}%`:"N/A",h=(i==null?void 0:i.temperature)!==null&&(i==null?void 0:i.temperature)!==void 0?`${i.temperature}°C`:"N/A",u=(i==null?void 0:i.uptime)??"--:--:--";return{isCommand:!0,type:"metrics",responseContent:`**REAL-TIME HARDWARE METRICS**

- **CPU Usage**: \`${l}\`
- **RAM Usage**: \`${c}\`
- **GPU Usage**: \`${d}\`
- **Temperature**: \`${h}\`
- **System Uptime**: \`${u}\``}}if(o==="/status"||o==="show system status"||o==="system status"){const l=i!==null,c=Hs(n);return{isCommand:!0,type:"status",responseContent:`**JARVIS SYSTEM STATUS**

- **Backend**: \`${l?"ONLINE (HTTP 200)":"OFFLINE"}\`
- **Active Model**: \`${c}\`
- **Memory Engine**: \`ONLINE\`
- **Voice Sync**: \`ONLINE\`
- **System Health**: \`OPERATIONAL\``}}return{isCommand:!1}}}function U_(){const t=ve.useRef(new sM),e=ve.useRef(new aM),{conversationId:n,activeModel:i,systemMetrics:r,setJarvisState:s,setActiveModel:a,setConversationId:o,addMessage:l,updateLastAssistantMessage:c,clearMessages:d,setIsGenerating:h,isGenerating:u}=jr(),p=()=>{t.current.cancel(),h(!1),s("idle")};return{sendMessage:async E=>{if(!E.trim()||u)return;const g=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),f=E.toLowerCase().includes("latitude:")&&E.toLowerCase().includes("longitude:");if(!f){const _=await e.current.processInputAsync(E,i,r,()=>d(),()=>p());if(_.isCommand){if(_.type==="clear"||_.type==="stop")return;if(_.responseContent){l({id:`user-${Date.now()}`,role:"user",content:E,timestamp:g}),l({id:`assistant-${Date.now()}`,role:"assistant",content:_.responseContent,timestamp:g,model:i});return}}}f||l({id:`user-${Date.now()}`,role:"user",content:E,timestamp:g}),l({id:`assistant-${Date.now()}`,role:"assistant",content:"",timestamp:g}),s("thinking"),h(!0),await t.current.streamChat(E,n,{onStart:()=>{},onChunk:(_,S,y)=>{y&&o(y),S&&a(S),c(_,S)},onDone:_=>{_.model&&a(_.model),_.conversation_id&&o(_.conversation_id),h(!1),s("idle")},onError:_=>{c(`

⚠️ JARVIS Connection Error: ${_}`),h(!1),s("idle")}})},stopStream:p,isGenerating:u}}const oM=({content:t})=>{const{sendMessage:e}=U_();if(!t)return null;if(t.includes("[LOCATION ACCESS REQUIRED]")||t.includes("Location access is required")){const n=t.replace("[LOCATION ACCESS REQUIRED]","").trim();return M.jsxs("div",{className:"space-y-2",children:[n&&M.jsx(To,{content:n}),M.jsx(iM,{onGranted:i=>{console.log(`[LOCATION DEBUG] Sending coordinates
lat=${i.latitude}
lng=${i.longitude}
accuracy=${i.accuracy}`),e(`latitude: ${i.latitude}, longitude: ${i.longitude}, accuracy: ${i.accuracy||0}`)}})]})}if(t.includes("[LOCATION TRACKING ACTIVE]"))return M.jsx(rM,{initialArea:"Current Area"});if(t.includes("[TOOL CONFIRMATION REQUIRED]")){const n=t.split(/(\[TOOL CONFIRMATION REQUIRED\][\s\S]*?\[\/TOOL CONFIRMATION REQUIRED\])/g);return M.jsx("div",{className:"space-y-2 max-w-full min-w-0",children:n.map((i,r)=>{if(i.startsWith("[TOOL CONFIRMATION REQUIRED]")&&i.endsWith("[/TOOL CONFIRMATION REQUIRED]")){const s=i.match(/Operation ID:\s*([a-f0-9-]+)/i),a=i.match(/Tool:\s*([a-zA-Z0-9_]+)/i),o=i.match(/Path:\s*([^\n]+)/i),l=i.match(/Message:\s*([^\n]+)/i),c=i.match(/Proposed Unified Diff:\s*\n([\s\S]*?)\[\/TOOL CONFIRMATION REQUIRED\]/i),d=s?s[1].trim():"",h=a?a[1].trim():"edit_file",u=o?o[1].trim():"",p=l?l[1].trim():void 0,m=c?c[1].trim():"";if(d)return M.jsx(JS,{operationId:d,toolName:h,path:u,diff:m,message:p},r)}return M.jsx(To,{content:i},r)})})}if(t.includes("Tool: calculate_route")||t.includes("Distance Km:")){const n=t.match(/Distance Km:\s*([0-9\.]+)/i),i=t.match(/Duration Minutes:\s*([0-9\.]+)/i),r=t.match(/Destination Name:\s*([^\n]+)/i),s=n?parseFloat(n[1]):12.4,a=i?parseFloat(i[1]):18,o=r?r[1].trim():"Destination";return M.jsxs("div",{className:"space-y-2 max-w-full min-w-0",children:[M.jsx(To,{content:t}),M.jsx(tM,{destinationName:o,distanceKm:s,durationMinutes:a}),M.jsx(eM,{destination:{lat:11.03,lng:77.04,name:o},distanceKm:s,durationMinutes:a})]})}return M.jsx(To,{content:t})},To=({content:t})=>{if(!t)return null;if(t.includes("```")){const e=t.split(/(```[\s\S]*?```)/g);return M.jsx("div",{className:"space-y-2 max-w-full min-w-0",children:e.map((n,i)=>{if(n.startsWith("```")&&n.endsWith("```")){const r=n.slice(3,-3).trim().split(`
`),s=r[0].match(/^[a-zA-Z0-9_-]+$/)?r[0]:"",a=s?r.slice(1).join(`
`):r.join(`
`);return M.jsx(lM,{language:s,codeText:a},i)}return M.jsx(nm,{text:n},i)})})}return M.jsx(nm,{text:t})},lM=({language:t,codeText:e})=>{const[n,i]=ve.useState(!1),r=()=>{navigator.clipboard.writeText(e),i(!0),setTimeout(()=>i(!1),2e3)};return M.jsxs("div",{className:"my-2 rounded-lg bg-[#070d18] border border-[#00f0ff]/25 overflow-hidden max-w-full min-w-0",children:[M.jsxs("div",{className:"flex items-center justify-between px-3 py-1.5 bg-[#0e182d] border-b border-[#00f0ff]/15 text-[10px] font-mono text-gray-400",children:[M.jsx("span",{className:"uppercase text-[#00f0ff] font-hud tracking-wider",children:t||"CODE"}),M.jsxs("button",{onClick:r,className:"flex items-center gap-1 hover:text-[#00f0ff] transition-colors",title:"Copy Code",children:[n?M.jsx(Vl,{className:"w-3 h-3 text-[#00ffaa]"}):M.jsx(IS,{className:"w-3 h-3"}),M.jsx("span",{children:n?"Copied!":"Copy"})]})]}),M.jsx("div",{className:"p-3 overflow-x-auto max-w-full text-xs font-mono leading-relaxed text-gray-200 selection:bg-[#00f0ff]/30",children:M.jsx("pre",{className:"m-0 whitespace-pre",children:e})})]})},nm=({text:t})=>{if(!t.trim())return null;if(t.includes("|")){const e=t.split(`
`);let n=!1;const i=[];let r=[];return e.forEach((s,a)=>{const o=s.trim();if(o.startsWith("|")&&o.endsWith("|")){if(n||(n=!0),o.includes("---"))return;const l=o.split("|").slice(1,-1).map(c=>c.trim());r.push(l)}else n&&r.length>0&&(i.push(im(r,`table-${a}`)),r=[],n=!1),o&&i.push(M.jsx("p",{className:"my-1 whitespace-pre-wrap leading-relaxed max-w-full break-words [overflow-wrap:anywhere]",children:o},`p-${a}`))}),n&&r.length>0&&i.push(im(r,"table-last")),M.jsx("div",{className:"space-y-1.5 max-w-full min-w-0",children:i})}return M.jsx("div",{className:"whitespace-pre-wrap leading-relaxed max-w-full min-w-0 break-words [overflow-wrap:anywhere]",children:t})};function im(t,e){if(t.length===0)return null;const n=t[0],i=t.slice(1);return M.jsx("div",{className:"overflow-x-auto max-w-full my-2.5 rounded border border-[#00f0ff]/20",children:M.jsxs("table",{className:"w-full text-[#00f0ff] border-collapse min-w-max text-xs",children:[M.jsx("thead",{children:M.jsx("tr",{className:"bg-[#00f0ff]/10 text-[#00f0ff] font-hud border-b border-[#00f0ff]/30",children:n.map((r,s)=>M.jsx("th",{className:"p-2 text-left font-semibold",children:r},s))})}),M.jsx("tbody",{children:i.map((r,s)=>M.jsx("tr",{className:s%2===0?"bg-white/[0.02]":"bg-transparent",children:r.map((a,o)=>M.jsx("td",{className:"p-2 border-b border-white/5 text-gray-200",children:a},o))},s))})]})},e)}const wi=class wi{constructor(){it(this,"mediaRecorder",null);it(this,"audioStream",null);it(this,"audioChunks",[]);it(this,"currentAudioElement",null);it(this,"currentObjectUrl",null);it(this,"audioContext",null);it(this,"analyserNode",null);it(this,"vadInterval",null);it(this,"isAudioUnlocked",!1);it(this,"isVoiceModeActive",!1);it(this,"isListening",!1);it(this,"isSpeaking",!1);it(this,"isProcessing",!1);it(this,"silenceStartTimestamp",null);it(this,"hasSpokenInCurrentTurn",!1);it(this,"turnStartTimestamp",0);it(this,"turnTimings",{speechEnd:0,sttDone:0,agentDone:0,ttsStart:0,audioPlaybackStarted:0,interruptDetected:0,ttsStopped:0})}isSupported(){return!!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)}isVoiceMode(){return this.isVoiceModeActive}getSupportedMimeType(){const e=["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/mp4","audio/wav"];for(const n of e)if(MediaRecorder.isTypeSupported(n))return n;return""}async unlockBrowserAudio(){try{const e=this.audioContext?this.audioContext.state:"uninitialized";if(console.log(`[TTS DEBUG] audio_context_state_before=${e}`),!this.audioContext){const r=window.AudioContext||window.webkitAudioContext;this.audioContext=new r}this.audioContext.state==="suspended"&&(console.log("[TTS DEBUG] audio_context_resume=initiating"),await this.audioContext.resume());const n=this.audioContext.state;console.log(`[TTS DEBUG] audio_context_state_after=${n}`);const i=new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");return i.volume=.01,await i.play().catch(()=>{}),this.isAudioUnlocked=!0,console.log("[TTS DEBUG] audio_context_unlocked=true status=ACTIVE"),!0}catch(e){return console.warn("[TTS DEBUG] Audio unlock warning:",e),!1}}async startVoiceMode(e,n){this.isVoiceModeActive||(this.isVoiceModeActive=!0,this.stopSpeech(),await this.unlockBrowserAudio(),console.log("[VoiceV3] Continuous Voice Mode activated."),await this.startTurnListening(e,n))}stopVoiceMode(){console.log("[VoiceV3] Continuous Voice Mode deactivated."),this.isVoiceModeActive=!1,this.stopSpeech(),this.stopVAD(),this.stopMediaRecorder(),this.audioStream&&(this.audioStream.getTracks().forEach(e=>e.stop()),this.audioStream=null)}async speakDiagnosticTestText(e="Hello. This is JARVIS audio test.",n){console.log(`[TTS DEBUG] tts_request_started=true text="${e}" endpoint=/api/v1/voice/speak`),await this.unlockBrowserAudio();try{const i=await fetch("/api/v1/voice/speak",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:e})});console.log(`[TTS DEBUG] http_status=${i.status}`);const r=i.headers.get("Content-Type")||"audio/mpeg";if(console.log(`[TTS DEBUG] content_type=${r}`),!i.ok){console.warn(`[TTS DEBUG] playback_failed reason=http_status_${i.status}`),n!=null&&n.onTTSStatus&&n.onTTSStatus(`HTTP ${i.status} error`);return}const s=await i.blob();if(console.log(`[TTS DEBUG] audio_bytes=${s.size} blob_created=true type=${s.type}`),s.size===0){console.warn("[TTS DEBUG] playback_failed reason=empty_audio_bytes"),n!=null&&n.onTTSStatus&&n.onTTSStatus("Empty audio bytes received");return}await this.playAudioBlob(s,n)}catch(i){console.error("[TTS DEBUG] playback_failed reason=",i),n!=null&&n.onTTSStatus&&n.onTTSStatus("Playback error")}}async startTurnListening(e,n){if(!(!this.isVoiceModeActive||this.isListening)){this.audioChunks=[],this.hasSpokenInCurrentTurn=!1,this.silenceStartTimestamp=null,this.turnStartTimestamp=Date.now();try{(!this.audioStream||!this.audioStream.active)&&(this.audioStream=await navigator.mediaDevices.getUserMedia({audio:!0}));const i=this.getSupportedMimeType(),r=i?{mimeType:i}:void 0;this.mediaRecorder=new MediaRecorder(this.audioStream,r),this.mediaRecorder.ondataavailable=s=>{s.data.size>0&&this.audioChunks.push(s.data)},this.mediaRecorder.onstart=()=>{this.isListening=!0,console.log(`[VOICE CAPTURE] speech_started=true mime_type='${i||"default"}'`),!this.isSpeaking&&!this.isProcessing&&e.onStateChange("listening"),this.startVAD(e,n)},this.mediaRecorder.onstop=async()=>{this.isListening=!1,this.stopVAD();const s=i||"audio/webm",a=new Blob(this.audioChunks,{type:s}),o=Date.now()-this.turnStartTimestamp;if(console.log(`[VOICE CAPTURE] speech_ended=true blob_created=true mime_type='${s}' size_bytes=${a.size} duration_ms=${o}`),a.size<100||!this.hasSpokenInCurrentTurn){console.log("[VOICE CAPTURE] Recording below minimum valid threshold (< 100 bytes or no speech). Restarting listener turn."),this.isVoiceModeActive&&setTimeout(()=>this.startTurnListening(e,n),200);return}this.isProcessing=!0,e.onStateChange("thinking"),this.turnTimings.speechEnd=Date.now(),await this.processAudioTurn(a,e,n)},this.mediaRecorder.start(100)}catch(i){this.isListening=!1,this.isVoiceModeActive=!1,console.error("[VoiceV3] Microphone access error:",i),e.onStateChange("error"),e.onError&&e.onError(i.message||"Microphone access denied.")}}}startVAD(e,n){if(this.audioStream)try{if(!this.audioContext){const a=window.AudioContext||window.webkitAudioContext;this.audioContext=new a}this.audioContext.state==="suspended"&&this.audioContext.resume();const i=this.audioContext.createMediaStreamSource(this.audioStream);this.analyserNode=this.audioContext.createAnalyser(),this.analyserNode.fftSize=256,i.connect(this.analyserNode);const r=this.analyserNode.frequencyBinCount,s=new Uint8Array(r);this.stopVAD(),this.vadInterval=window.setInterval(()=>{if(!this.analyserNode||!this.isListening)return;this.analyserNode.getByteFrequencyData(s);let a=0;for(let c=0;c<r;c++)a+=s[c];const o=a/r,l=this.isSpeaking?wi.BARGE_IN_THRESHOLD:wi.SILENCE_THRESHOLD;o>l?(this.isSpeaking&&(this.turnTimings.interruptDetected=Date.now(),console.log("[INTERRUPT] detected type=STOP_SPEAKING (Barge-in VAD)"),this.stopSpeech(),this.turnTimings.ttsStopped=Date.now(),e.onStateChange("interrupted")),this.hasSpokenInCurrentTurn||(this.hasSpokenInCurrentTurn=!0,console.log("[VOICE CAPTURE] User speech detected by VAD.")),this.silenceStartTimestamp=null):this.hasSpokenInCurrentTurn&&(this.silenceStartTimestamp===null?this.silenceStartTimestamp=Date.now():Date.now()-this.silenceStartTimestamp>wi.SILENCE_DURATION_MS&&(console.log(`[VOICE CAPTURE] Natural silence detected (${wi.SILENCE_DURATION_MS}ms). Finalizing turn.`),this.silenceStartTimestamp=null,this.stopMediaRecorder()))},50)}catch(i){console.warn("[VoiceV3] VAD setup warning:",i)}}stopVAD(){this.vadInterval!==null&&(clearInterval(this.vadInterval),this.vadInterval=null)}stopMediaRecorder(){if(this.mediaRecorder&&this.mediaRecorder.state!=="inactive")try{this.mediaRecorder.stop()}catch(e){console.warn("[VoiceV3] Error stopping MediaRecorder:",e)}}async processAudioTurn(e,n,i){var r,s;try{const a=new FormData;a.append("file",e,"speech.webm"),i&&a.append("conversation_id",i),console.log(`[VOICE CAPTURE] Uploading turn audio (${e.size} bytes)...`);const o=await fetch("/api/v1/voice/transcribe",{method:"POST",body:a});if(console.log(`[VOICE CAPTURE] Server response status=${o.status}`),this.turnTimings.sttDone=Date.now(),o.ok){const l=await o.json();if((l==null?void 0:l.success)===!1){const g=(l==null?void 0:l.message)||"Speech recognition unavailable.";console.warn(`[VoiceV3] STT Infrastructure Error: ${l==null?void 0:l.error_type} - ${g}`),this.isProcessing=!1,n.onStateChange("error"),n.onError&&n.onError(`Speech Error (${l==null?void 0:l.error_type}): ${g}`),n.onTTSStatus&&n.onTTSStatus(`STT Error: ${l==null?void 0:l.error_type}`),this.isVoiceModeActive&&setTimeout(()=>this.startTurnListening(n,i),1500);return}if(l!=null&&l.ignored){console.log("[VoiceV3] Turn ignored by AttentionEngine."),this.isProcessing=!1,this.isVoiceModeActive&&setTimeout(()=>this.startTurnListening(n,i),200);return}const c=((r=l==null?void 0:l.transcription)==null?void 0:r.text)||"",d=(l==null?void 0:l.agent_response)||{},h=d.message||"",u=d.conversation_id||i,p=d.model||"jarvis-voice",m=(l==null?void 0:l.tts_audio_b64)||"",E=((s=l==null?void 0:l.agent_response)==null?void 0:s.stop_tts)||!1;this.turnTimings.agentDone=Date.now(),E&&(console.log("[INTERRUPT] current_goal_cancelled stop_tts=true"),this.stopSpeech()),c&&(console.log(`[VoiceV3] STT Transcript: "${c}"`),n.onTranscript&&n.onTranscript(c)),h&&(console.log("[TTS DEBUG] response_text_received=true"),n.onAgentResponse&&n.onAgentResponse(c,h,u,p)),m&&(this.isVoiceModeActive||this.isProcessing)&&!E?(this.turnTimings.ttsStart=Date.now(),console.log(`[TTS DEBUG] audio_bytes=${m.length}`),await this.playAudioBase64(m,n,u)):(this.isProcessing=!1,this.isVoiceModeActive&&setTimeout(()=>this.startTurnListening(n,u),200))}else console.warn("[TTS DEBUG] Transcribe endpoint HTTP error:",o.status),this.isProcessing=!1,n.onStateChange("error"),n.onError&&n.onError(`HTTP ${o.status} error from transcription server.`),this.isVoiceModeActive&&setTimeout(()=>this.startTurnListening(n,i),1e3)}catch(a){console.error("[TTS DEBUG] Turn processing error:",a),this.isProcessing=!1,n.onStateChange("error"),n.onError&&n.onError(a.message||"Error processing audio turn."),this.isVoiceModeActive&&setTimeout(()=>this.startTurnListening(n,i),1e3)}}playAudioBlob(e,n,i){return new Promise(r=>{this.stopSpeech();try{this.currentObjectUrl=URL.createObjectURL(e);const s=new Audio(this.currentObjectUrl);this.currentAudioElement=s,s.muted=!1,s.volume=1,s.onplaying=()=>{this.isSpeaking=!0,n&&n.onStateChange("speaking"),this.turnTimings.audioPlaybackStarted=Date.now();const l=this.turnTimings.audioPlaybackStarted-this.turnTimings.speechEnd,c=this.turnTimings.agentDone-this.turnTimings.sttDone,d=this.turnTimings.audioPlaybackStarted-this.turnTimings.ttsStart;console.log(`[TTS DEBUG] playback_started=true total_latency_ms=${l}ms (agent_latency=${c}ms, tts_latency=${d}ms)`)};const a=()=>{this.isSpeaking=!1,this.isProcessing=!1,this.currentObjectUrl&&(URL.revokeObjectURL(this.currentObjectUrl),this.currentObjectUrl=null),this.currentAudioElement=null,this.isVoiceModeActive?(console.log("[TTS DEBUG] playback_ended=true. Resuming LISTENING for next turn."),setTimeout(()=>this.startTurnListening(n,i),200)):n&&n.onStateChange("idle"),r()};s.onended=()=>{a()},s.onerror=l=>{console.warn("[TTS DEBUG] Playback error:",l),n!=null&&n.onTTSStatus&&n.onTTSStatus("TTS playback failed"),a()};const o=s.play();o!==void 0&&o.catch(l=>{console.warn("[TTS DEBUG] Play error:",l),n!=null&&n.onTTSStatus&&n.onTTSStatus("SPEAKER ACCESS REQUIRED"),a()})}catch(s){console.warn("[TTS DEBUG] Playback exception:",s),this.isSpeaking=!1,this.isProcessing=!1,this.isVoiceModeActive&&n&&setTimeout(()=>this.startTurnListening(n,i),200),r()}})}playAudioBase64(e,n,i){try{const r=window.atob(e),s=new Uint8Array(r.length);for(let o=0;o<r.length;o++)s[o]=r.charCodeAt(o);const a=new Blob([s.buffer],{type:"audio/mpeg"});return this.playAudioBlob(a,n,i)}catch(r){return console.warn("[TTS DEBUG] Base64 decode error:",r),this.isSpeaking=!1,this.isProcessing=!1,this.isVoiceModeActive&&setTimeout(()=>this.startTurnListening(n,i),200),Promise.resolve()}}stopSpeech(){if(this.currentAudioElement){try{this.currentAudioElement.pause(),this.currentAudioElement.currentTime=0}catch{}this.currentAudioElement=null}if(this.currentObjectUrl){try{URL.revokeObjectURL(this.currentObjectUrl)}catch{}this.currentObjectUrl=null}this.isSpeaking=!1,console.log("[TTS DEBUG] playback_stopped=true")}getIsSpeaking(){return this.isSpeaking}};it(wi,"SILENCE_THRESHOLD",12),it(wi,"BARGE_IN_THRESHOLD",28),it(wi,"SILENCE_DURATION_MS",750);let Ef=wi;const cM=()=>{const[t,e]=ve.useState(""),[n,i]=ve.useState(null),[r,s]=ve.useState(!1),[a,o]=ve.useState(!1),[l,c]=ve.useState(null),d=ve.useRef(null),h=ve.useRef(new Ef),{currentState:u,conversationId:p,isGenerating:m,isListening:E,isSpeaking:g,isVoiceModeActive:f,setJarvisState:_,setIsListening:S,setIsSpeaking:y,setIsVoiceModeActive:b,addMessage:w,setConversationId:A,setActiveModel:x}=jr(),{sendMessage:C,stopStream:N}=U_(),P=()=>{if(!t.trim()||m)return;const I=t.trim();e(""),d.current&&(d.current.style.height="auto"),C(I)},z=I=>{I.key==="Enter"&&!I.shiftKey?(I.preventDefault(),P()):I.key==="Escape"&&(m||f)&&(I.preventDefault(),K())},K=()=>{N(),h.current.stopSpeech(),f&&(h.current.stopVoiceMode(),b(!1)),S(!1),y(!1),_("idle"),i(null),s(!1)},ee=async()=>{s(!0),i("Testing speaker playback..."),await h.current.speakDiagnosticTestText("Hello. This is JARVIS audio test.",{onStateChange:I=>{_(I),y(I==="speaking"),I==="idle"&&s(!1)},onTTSStatus:I=>i(I)}),s(!1)},O=async()=>{try{const L=await fetch(a?"/api/v1/gesture/disable":"/api/v1/gesture/enable",{method:"POST"});if(L.ok){const j=await L.json();o(j.enabled),c(j.message||(j.enabled?"Gesture control ACTIVE":"Gesture control OFF")),setTimeout(()=>c(null),3e3)}}catch(I){console.error("[GESTURE] Toggle failed:",I)}},H=async()=>{const I=h.current;if(!I.isSupported()){alert("Microphone access is not supported in this browser environment.");return}f?(I.stopVoiceMode(),b(!1),S(!1),y(!1),_("idle"),i(null)):(b(!0),i(null),I.stopSpeech(),await I.startVoiceMode({onStateChange:L=>{_(L),S(L==="listening"),y(L==="speaking")},onTranscript:L=>{const j={id:`v_user_${Date.now()}`,role:"user",content:L,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})};w(j)},onAgentResponse:(L,j,Q,ne)=>{Q&&A(Q),ne&&x(ne);const le={id:`v_asst_${Date.now()}`,role:"assistant",content:j,model:ne||"jarvis-voice",timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})};w(le)},onError:L=>{console.warn("[VoiceMode] Error:",L),_("error")},onTTSStatus:L=>{console.warn("[VoiceMode] TTS Notice:",L),i(L)}},p))};return ve.useEffect(()=>{d.current&&(d.current.style.height="auto",d.current.style.height=`${Math.min(d.current.scrollHeight,56)}px`)},[t]),M.jsxs("div",{className:"w-full shrink-0 flex flex-col gap-1.5 pt-2 mt-2 border-t border-[#00f0ff]/15",children:[(f||a||l)&&M.jsxs("div",{className:"w-full px-3 py-1 bg-[#0c1424]/90 border border-[#00f0ff]/40 rounded-lg flex items-center justify-between font-hud text-[10px] tracking-wider text-[#00f0ff] animate-pulse shadow-[0_0_12px_rgba(0,240,255,0.25)]",children:[M.jsxs("div",{className:"flex items-center gap-3",children:[f&&M.jsxs("div",{className:"flex items-center gap-1.5",children:[M.jsx("span",{className:"w-2 h-2 rounded-full bg-[#00f0ff] animate-ping"}),M.jsxs("span",{children:["VOICE MODE ● ",u.toUpperCase()]})]}),a&&M.jsxs("div",{className:"flex items-center gap-1.5 text-[#00ffaa]",children:[M.jsx(Zp,{className:"w-3 h-3 text-[#00ffaa]"}),M.jsx("span",{children:"GESTURE CONTROL ● ACTIVE"})]})]}),l?M.jsx("span",{className:"text-[#00ffaa] font-bold",children:l}):n?M.jsxs("div",{className:"flex items-center gap-1 text-[#ffaa00] font-bold",children:[M.jsx(LS,{className:"w-3 h-3"}),M.jsx("span",{children:n})]}):M.jsx("span",{className:"text-gray-400 text-[9px]",children:"Hands-Free Control (VAD / MediaPipe Active)"})]}),M.jsxs("div",{className:"w-full flex items-center gap-2",children:[M.jsx("button",{onClick:H,className:`px-3 py-1.5 rounded-full flex items-center gap-1.5 border shrink-0 transition-all duration-300 font-hud text-xs tracking-wider ${f?"bg-[#00f0ff]/25 border-[#00ffff] text-[#00ffff] shadow-[0_0_20px_rgba(0,240,255,0.8)] scale-105 animate-pulse":"bg-[#00f0ff]/10 border-[#00f0ff]/40 text-[#00f0ff] hover:bg-[#00f0ff]/20 hover:border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.2)]"}`,title:f?"Exit Continuous Voice Mode":"Enter Continuous Voice Mode (Hands-Free)",children:f?M.jsxs(M.Fragment,{children:[M.jsx(tm,{className:"w-4 h-4 text-[#00ffff] animate-bounce"}),M.jsx("span",{children:"VOICE MODE ACTIVE"})]}):M.jsxs(M.Fragment,{children:[M.jsx(N_,{className:"w-4 h-4"}),M.jsx("span",{children:"VOICE MODE"})]})}),M.jsxs("button",{onClick:O,className:`px-2.5 py-1.5 rounded-full flex items-center gap-1 border shrink-0 transition-all font-hud text-[10px] tracking-wider ${a?"bg-[#00ffaa]/25 border-[#00ffaa] text-[#00ffaa] shadow-[0_0_15px_rgba(0,255,170,0.6)] animate-pulse":"bg-[#00f0ff]/5 border-[#00f0ff]/30 text-[#00f0ff] hover:bg-[#00f0ff]/15"}`,title:"Toggle Hand Gesture Control (MediaPipe)",children:[M.jsx(Zp,{className:"w-3 h-3"}),M.jsxs("span",{children:["GESTURE CONTROL ",a?"● ACTIVE":"● OFF"]})]}),M.jsxs("button",{onClick:ee,disabled:r||f,className:"px-2.5 py-1.5 rounded-full flex items-center gap-1 border border-[#00f0ff]/30 bg-[#00f0ff]/5 text-[#00f0ff] hover:bg-[#00f0ff]/20 font-hud text-[10px] tracking-wider shrink-0 transition-all disabled:opacity-40",title:"Direct Speaker Output Test (POST /api/v1/voice/speak)",children:[M.jsx(tm,{className:"w-3 h-3"}),M.jsx("span",{children:r?"SPEAKING...":"SPEAK TEST"})]}),M.jsxs("div",{className:"flex-1 bg-[#0c1424]/95 border border-[#00f0ff]/25 rounded-full px-3.5 py-1 flex items-center gap-2 shadow-lg focus-within:border-[#00f0ff] focus-within:shadow-[0_0_12px_rgba(0,240,255,0.35)] transition-all min-w-0",children:[M.jsx("textarea",{ref:d,value:t,onChange:I=>e(I.target.value),onKeyDown:z,placeholder:f?"Voice Mode listening... or type a message":"Type a message or start Voice Mode...",rows:1,className:"flex-1 bg-transparent border-none outline-none text-gray-100 text-xs resize-none max-h-14 leading-snug placeholder-gray-500 py-1"}),M.jsx("button",{onClick:P,disabled:!t.trim()||m,className:"w-7 h-7 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff]/30 text-[#00f0ff] flex items-center justify-center hover:bg-[#00f0ff] hover:text-black disabled:opacity-30 disabled:cursor-not-allowed shrink-0 transition-all",title:"Send Message",children:M.jsx(GS,{className:"w-3.5 h-3.5"})})]}),M.jsxs("button",{onClick:K,disabled:!m&&!E&&!g&&!f&&!r,className:"w-9 h-9 rounded-full bg-[#ff7700]/15 border border-[#ff7700]/40 text-[#ff7700] flex flex-col items-center justify-center gap-0.5 font-hud text-[8px] tracking-wider hover:bg-[#ff7700]/25 disabled:opacity-30 disabled:cursor-not-allowed shrink-0 transition-all shadow-[0_0_12px_rgba(255,119,0,0.3)]",title:"Stop Speech / Voice Mode (Interrupt)",children:[M.jsx(L_,{className:"w-2.5 h-2.5 fill-current"}),M.jsx("span",{children:"STOP"})]})]})]})},uM=()=>{const{messages:t,isGenerating:e}=jr(),n=ve.useRef(null),[i,r]=ve.useState(!1),s=()=>{const o=n.current;if(!o)return;const l=o.scrollHeight-o.scrollTop-o.clientHeight<60;r(!l)},a=()=>{const o=n.current;o&&(o.scrollTop=o.scrollHeight,r(!1))};return ve.useEffect(()=>{!i&&n.current&&(n.current.scrollTop=n.current.scrollHeight)},[t,e,i]),M.jsxs("aside",{className:"w-[440px] shrink-0 h-full flex flex-col min-h-0 min-w-0 overflow-hidden bg-[#080e1a]/75 backdrop-blur-[14px] -webkit-backdrop-blur-[14px] border border-[#00f0ff]/20 rounded-xl p-4 relative shadow-2xl z-10 pointer-events-auto",children:[M.jsxs("div",{className:"flex items-center justify-between border-b border-[#00f0ff]/10 pb-2.5 shrink-0",children:[M.jsx("h3",{className:"font-hud text-xs tracking-widest text-gray-400",children:"CONVERSATION"}),M.jsxs("span",{className:"text-[#00ffaa] text-xs font-semibold flex items-center gap-1.5",children:[M.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-[#00ffaa] shadow-[0_0_8px_#00ffaa]"})," LIVE"]})]}),M.jsx("div",{ref:n,onScroll:s,className:"flex-1 min-h-0 overflow-y-auto pr-1.5 mt-2.5 space-y-3",children:t.length===0?M.jsxs("div",{className:"h-full flex flex-col items-center justify-center text-center p-6 text-gray-500",children:[M.jsx("span",{className:"font-hud text-xs tracking-wider mb-2",children:"SYSTEM READY"}),M.jsx("p",{className:"text-xs",children:"Ask JARVIS anything to start the real-time conversation."})]}):t.map((o,l)=>{const c=o.role==="user",d=l===t.length-1,h=!c&&o.model&&!o.model.startsWith("jarvis-");return M.jsxs("div",{className:`p-3 rounded-xl border text-sm transition-all duration-200 w-full max-w-full break-words [overflow-wrap:anywhere] ${c?"bg-[#0e1c36]/85 border-[#38bdf8]/40 shadow-md":"bg-[#091120]/90 border-[#00f0ff]/30 shadow-md"}`,children:[M.jsxs("div",{className:"flex items-center justify-between text-[11px] mb-1.5",children:[M.jsxs("div",{className:"flex items-center gap-2",children:[M.jsx("span",{className:`font-hud font-bold tracking-wider ${c?"text-[#00f0ff]":"text-[#60a5fa]"}`,children:c?"YOU":"JARVIS"}),h&&M.jsx("span",{className:"text-[9px] font-mono text-[#ff7700] bg-[#ff7700]/15 border border-[#ff7700]/40 px-1.5 py-0.5 rounded",children:Hs(o.model)})]}),M.jsx("span",{className:"text-gray-400 text-[10px]",children:o.timestamp})]}),M.jsxs("div",{className:"text-gray-100 font-sans leading-relaxed",children:[M.jsx(oM,{content:o.content}),!c&&d&&e&&M.jsx("span",{className:"inline-block w-2 h-4 bg-[#00f0ff] ml-1 animate-pulse align-middle"})]})]},o.id)})}),i&&e&&M.jsxs("button",{onClick:a,className:"absolute bottom-16 right-6 bg-[#00f0ff]/20 border border-[#00f0ff] text-[#00f0ff] text-[11px] px-3 py-1.5 rounded-full flex items-center gap-1 shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:bg-[#00f0ff] hover:text-black transition-all",children:[M.jsx("span",{children:"NEW RESPONSE"}),M.jsx(DS,{className:"w-3.5 h-3.5"})]}),M.jsx(cM,{})]})};/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const uh="185",Ps={ROTATE:0,DOLLY:1,PAN:2},Ms={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},fM=0,rm=1,dM=2,cl=1,hM=2,_a=3,pr=0,xn=1,Ai=2,mi=0,Ns=1,Gl=2,sm=3,am=4,pM=5,Ar=100,mM=101,gM=102,_M=103,vM=104,xM=200,yM=201,SM=202,MM=203,Tf=204,wf=205,EM=206,TM=207,wM=208,bM=209,AM=210,CM=211,RM=212,PM=213,NM=214,bf=0,Af=1,Cf=2,Gs=3,Rf=4,Pf=5,Nf=6,Df=7,F_=0,DM=1,LM=2,gi=0,O_=1,k_=2,B_=3,fh=4,z_=5,V_=6,H_=7,G_=300,Vr=301,Ws=302,qc=303,Kc=304,mc=306,Lf=1e3,Pi=1001,If=1002,jt=1003,IM=1004,wo=1005,nn=1006,Zc=1007,Dr=1008,kn=1009,W_=1010,X_=1011,ja=1012,dh=1013,_i=1014,fi=1015,Cn=1016,hh=1017,ph=1018,$a=1020,j_=35902,$_=35899,Y_=1021,q_=1022,Zn=1023,Oi=1026,Lr=1027,K_=1028,mh=1029,Hr=1030,gh=1031,_h=1033,ul=33776,fl=33777,dl=33778,hl=33779,Uf=35840,Ff=35841,Of=35842,kf=35843,Bf=36196,zf=37492,Vf=37496,Hf=37488,Gf=37489,Wl=37490,Wf=37491,Xf=37808,jf=37809,$f=37810,Yf=37811,qf=37812,Kf=37813,Zf=37814,Qf=37815,Jf=37816,ed=37817,td=37818,nd=37819,id=37820,rd=37821,sd=36492,ad=36494,od=36495,ld=36283,cd=36284,Xl=36285,ud=36286,UM=3200,om=0,FM=1,er="",In="srgb",jl="srgb-linear",$l="linear",rt="srgb",Kr=7680,lm=519,OM=512,kM=513,BM=514,vh=515,zM=516,VM=517,xh=518,HM=519,cm=35044,um="300 es",di=2e3,Yl=2001;function GM(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function ql(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function WM(){const t=ql("canvas");return t.style.display="block",t}const fm={};function dm(...t){const e="THREE."+t.shift();console.log(e,...t)}function Z_(t){const e=t[0];if(typeof e=="string"&&e.startsWith("TSL:")){const n=t[1];n&&n.isStackTrace?t[0]+=" "+n.getLocation():t[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return t}function Le(...t){t=Z_(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.warn(n.getError(e)):console.warn(e,...t)}}function Qe(...t){t=Z_(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.error(n.getError(e)):console.error(e,...t)}}function Ds(...t){const e=t.join(" ");e in fm||(fm[e]=!0,Le(...t))}function XM(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}const jM={[bf]:Af,[Cf]:Nf,[Rf]:Df,[Gs]:Pf,[Af]:bf,[Nf]:Cf,[Df]:Rf,[Pf]:Gs};class xr{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const n=this._listeners;if(n===void 0)return;const i=n[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const Jt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],pl=Math.PI/180,fd=180/Math.PI;function Ja(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Jt[t&255]+Jt[t>>8&255]+Jt[t>>16&255]+Jt[t>>24&255]+"-"+Jt[e&255]+Jt[e>>8&255]+"-"+Jt[e>>16&15|64]+Jt[e>>24&255]+"-"+Jt[n&63|128]+Jt[n>>8&255]+"-"+Jt[n>>16&255]+Jt[n>>24&255]+Jt[i&255]+Jt[i>>8&255]+Jt[i>>16&255]+Jt[i>>24&255]).toLowerCase()}function Xe(t,e,n){return Math.max(e,Math.min(n,t))}function $M(t,e){return(t%e+e)%e}function Qc(t,e,n){return(1-n)*t+n*e}function aa(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function dn(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const YM={DEG2RAD:pl},wh=class wh{constructor(e=0,n=0){this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Xe(this.x,e.x,n.x),this.y=Xe(this.y,e.y,n.y),this}clampScalar(e,n){return this.x=Xe(this.x,e,n),this.y=Xe(this.y,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Xe(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Xe(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};wh.prototype.isVector2=!0;let Ne=wh;class mr{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,a,o){let l=i[r+0],c=i[r+1],d=i[r+2],h=i[r+3],u=s[a+0],p=s[a+1],m=s[a+2],E=s[a+3];if(h!==E||l!==u||c!==p||d!==m){let g=l*u+c*p+d*m+h*E;g<0&&(u=-u,p=-p,m=-m,E=-E,g=-g);let f=1-o;if(g<.9995){const _=Math.acos(g),S=Math.sin(_);f=Math.sin(f*_)/S,o=Math.sin(o*_)/S,l=l*f+u*o,c=c*f+p*o,d=d*f+m*o,h=h*f+E*o}else{l=l*f+u*o,c=c*f+p*o,d=d*f+m*o,h=h*f+E*o;const _=1/Math.sqrt(l*l+c*c+d*d+h*h);l*=_,c*=_,d*=_,h*=_}}e[n]=l,e[n+1]=c,e[n+2]=d,e[n+3]=h}static multiplyQuaternionsFlat(e,n,i,r,s,a){const o=i[r],l=i[r+1],c=i[r+2],d=i[r+3],h=s[a],u=s[a+1],p=s[a+2],m=s[a+3];return e[n]=o*m+d*h+l*p-c*u,e[n+1]=l*m+d*u+c*h-o*p,e[n+2]=c*m+d*p+o*u-l*h,e[n+3]=d*m-o*h-l*u-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),d=o(r/2),h=o(s/2),u=l(i/2),p=l(r/2),m=l(s/2);switch(a){case"XYZ":this._x=u*d*h+c*p*m,this._y=c*p*h-u*d*m,this._z=c*d*m+u*p*h,this._w=c*d*h-u*p*m;break;case"YXZ":this._x=u*d*h+c*p*m,this._y=c*p*h-u*d*m,this._z=c*d*m-u*p*h,this._w=c*d*h+u*p*m;break;case"ZXY":this._x=u*d*h-c*p*m,this._y=c*p*h+u*d*m,this._z=c*d*m+u*p*h,this._w=c*d*h-u*p*m;break;case"ZYX":this._x=u*d*h-c*p*m,this._y=c*p*h+u*d*m,this._z=c*d*m-u*p*h,this._w=c*d*h+u*p*m;break;case"YZX":this._x=u*d*h+c*p*m,this._y=c*p*h+u*d*m,this._z=c*d*m-u*p*h,this._w=c*d*h-u*p*m;break;case"XZY":this._x=u*d*h-c*p*m,this._y=c*p*h-u*d*m,this._z=c*d*m+u*p*h,this._w=c*d*h+u*p*m;break;default:Le("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],a=n[1],o=n[5],l=n[9],c=n[2],d=n[6],h=n[10],u=i+o+h;if(u>0){const p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(d-l)*p,this._y=(s-c)*p,this._z=(a-r)*p}else if(i>o&&i>h){const p=2*Math.sqrt(1+i-o-h);this._w=(d-l)/p,this._x=.25*p,this._y=(r+a)/p,this._z=(s+c)/p}else if(o>h){const p=2*Math.sqrt(1+o-i-h);this._w=(s-c)/p,this._x=(r+a)/p,this._y=.25*p,this._z=(l+d)/p}else{const p=2*Math.sqrt(1+h-i-o);this._w=(a-r)/p,this._x=(s+c)/p,this._y=(l+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Xe(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,a=e._w,o=n._x,l=n._y,c=n._z,d=n._w;return this._x=i*d+a*o+r*c-s*l,this._y=r*d+a*l+s*o-i*c,this._z=s*d+a*c+i*l-r*o,this._w=a*d-i*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,n){let i=e._x,r=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,r=-r,s=-s,a=-a,o=-o);let l=1-n;if(o<.9995){const c=Math.acos(o),d=Math.sin(c);l=Math.sin(l*c)/d,n=Math.sin(n*c)/d,this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+a*n,this._onChangeCallback()}else this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+a*n,this.normalize();return this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const bh=class bh{constructor(e=0,n=0,i=0){this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(hm.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(hm.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*i),d=2*(o*n-s*r),h=2*(s*i-a*n);return this.x=n+l*c+a*h-o*d,this.y=i+l*d+o*c-s*h,this.z=r+l*h+s*d-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Xe(this.x,e.x,n.x),this.y=Xe(this.y,e.y,n.y),this.z=Xe(this.z,e.z,n.z),this}clampScalar(e,n){return this.x=Xe(this.x,e,n),this.y=Xe(this.y,e,n),this.z=Xe(this.z,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Xe(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,a=n.x,o=n.y,l=n.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Jc.copy(this).projectOnVector(e),this.sub(Jc)}reflect(e){return this.sub(Jc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Xe(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};bh.prototype.isVector3=!0;let V=bh;const Jc=new V,hm=new mr,Ah=class Ah{constructor(e,n,i,r,s,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,c)}set(e,n,i,r,s,a,o,l,c){const d=this.elements;return d[0]=e,d[1]=r,d[2]=o,d[3]=n,d[4]=s,d[5]=l,d[6]=i,d[7]=a,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],d=i[4],h=i[7],u=i[2],p=i[5],m=i[8],E=r[0],g=r[3],f=r[6],_=r[1],S=r[4],y=r[7],b=r[2],w=r[5],A=r[8];return s[0]=a*E+o*_+l*b,s[3]=a*g+o*S+l*w,s[6]=a*f+o*y+l*A,s[1]=c*E+d*_+h*b,s[4]=c*g+d*S+h*w,s[7]=c*f+d*y+h*A,s[2]=u*E+p*_+m*b,s[5]=u*g+p*S+m*w,s[8]=u*f+p*y+m*A,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8];return n*a*d-n*o*c-i*s*d+i*o*l+r*s*c-r*a*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],h=d*a-o*c,u=o*l-d*s,p=c*s-a*l,m=n*h+i*u+r*p;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const E=1/m;return e[0]=h*E,e[1]=(r*c-d*i)*E,e[2]=(o*i-r*a)*E,e[3]=u*E,e[4]=(d*n-r*l)*E,e[5]=(r*s-o*n)*E,e[6]=p*E,e[7]=(i*l-c*n)*E,e[8]=(a*n-i*s)*E,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+n,0,0,1),this}scale(e,n){return Ds("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(eu.makeScale(e,n)),this}rotate(e){return Ds("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(eu.makeRotation(-e)),this}translate(e,n){return Ds("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(eu.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Ah.prototype.isMatrix3=!0;let Fe=Ah;const eu=new Fe,pm=new Fe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),mm=new Fe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function qM(){const t={enabled:!0,workingColorSpace:jl,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===rt&&(r.r=Di(r.r),r.g=Di(r.g),r.b=Di(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===rt&&(r.r=Ls(r.r),r.g=Ls(r.g),r.b=Ls(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===er?$l:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Ds("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),t.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Ds("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),t.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return t.define({[jl]:{primaries:e,whitePoint:i,transfer:$l,toXYZ:pm,fromXYZ:mm,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:In},outputColorSpaceConfig:{drawingBufferColorSpace:In}},[In]:{primaries:e,whitePoint:i,transfer:rt,toXYZ:pm,fromXYZ:mm,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:In}}}),t}const qe=qM();function Di(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function Ls(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let Zr;class KM{static getDataURL(e,n="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Zr===void 0&&(Zr=ql("canvas")),Zr.width=e.width,Zr.height=e.height;const r=Zr.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=Zr}return i.toDataURL(n)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=ql("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=Di(s[a]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Di(n[i]/255)*255):n[i]=Di(n[i]);return{data:n,width:e.width,height:e.height}}else return Le("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let ZM=0;class yh{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ZM++}),this.uuid=Ja(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?e.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame<"u"&&n instanceof VideoFrame?e.set(n.displayWidth,n.displayHeight,0):n!==null?e.set(n.width,n.height,n.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(tu(r[a].image)):s.push(tu(r[a]))}else s=tu(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function tu(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?KM.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(Le("Texture: Unable to serialize Texture."),{})}let QM=0;const nu=new V;class cn extends xr{constructor(e=cn.DEFAULT_IMAGE,n=cn.DEFAULT_MAPPING,i=Pi,r=Pi,s=nn,a=Dr,o=Zn,l=kn,c=cn.DEFAULT_ANISOTROPY,d=er){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:QM++}),this.uuid=Ja(),this.name="",this.source=new yh(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ne(0,0),this.repeat=new Ne(1,1),this.center=new Ne(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Fe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(nu).x}get height(){return this.source.getSize(nu).y}get depth(){return this.source.getSize(nu).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const n in e){const i=e[n];if(i===void 0){Le(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){Le(`Texture.setValues(): property '${n}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==G_)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Lf:e.x=e.x-Math.floor(e.x);break;case Pi:e.x=e.x<0?0:1;break;case If:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Lf:e.y=e.y-Math.floor(e.y);break;case Pi:e.y=e.y<0?0:1;break;case If:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}cn.DEFAULT_IMAGE=null;cn.DEFAULT_MAPPING=G_;cn.DEFAULT_ANISOTROPY=1;const Ch=class Ch{constructor(e=0,n=0,i=0,r=1){this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*n+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*n+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*n+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*n+a[7]*i+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,c=l[0],d=l[4],h=l[8],u=l[1],p=l[5],m=l[9],E=l[2],g=l[6],f=l[10];if(Math.abs(d-u)<.01&&Math.abs(h-E)<.01&&Math.abs(m-g)<.01){if(Math.abs(d+u)<.1&&Math.abs(h+E)<.1&&Math.abs(m+g)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const S=(c+1)/2,y=(p+1)/2,b=(f+1)/2,w=(d+u)/4,A=(h+E)/4,x=(m+g)/4;return S>y&&S>b?S<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(S),r=w/i,s=A/i):y>b?y<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(y),i=w/r,s=x/r):b<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(b),i=A/s,r=x/s),this.set(i,r,s,n),this}let _=Math.sqrt((g-m)*(g-m)+(h-E)*(h-E)+(u-d)*(u-d));return Math.abs(_)<.001&&(_=1),this.x=(g-m)/_,this.y=(h-E)/_,this.z=(u-d)/_,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Xe(this.x,e.x,n.x),this.y=Xe(this.y,e.y,n.y),this.z=Xe(this.z,e.z,n.z),this.w=Xe(this.w,e.w,n.w),this}clampScalar(e,n){return this.x=Xe(this.x,e,n),this.y=Xe(this.y,e,n),this.z=Xe(this.z,e,n),this.w=Xe(this.w,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Xe(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Ch.prototype.isVector4=!0;let Ct=Ch;class JM extends xr{constructor(e=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:nn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=i.depth,this.scissor=new Ct(0,0,e,n),this.scissorTest=!1,this.viewport=new Ct(0,0,e,n),this.textures=[];const r={width:e,height:n,depth:i.depth},s=new cn(r),a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const n={minFilter:nn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(n.mapping=e.mapping),e.wrapS!==void 0&&(n.wrapS=e.wrapS),e.wrapT!==void 0&&(n.wrapT=e.wrapT),e.wrapR!==void 0&&(n.wrapR=e.wrapR),e.magFilter!==void 0&&(n.magFilter=e.magFilter),e.minFilter!==void 0&&(n.minFilter=e.minFilter),e.format!==void 0&&(n.format=e.format),e.type!==void 0&&(n.type=e.type),e.anisotropy!==void 0&&(n.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(n.colorSpace=e.colorSpace),e.flipY!==void 0&&(n.flipY=e.flipY),e.generateMipmaps!==void 0&&(n.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(n.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++){this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;const r=Object.assign({},e.textures[n].image);this.textures[n].source=new yh(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class yn extends JM{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class Q_ extends cn{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=jt,this.minFilter=jt,this.wrapR=Pi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class eE extends cn{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=jt,this.minFilter=jt,this.wrapR=Pi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Zl=class Zl{constructor(e,n,i,r,s,a,o,l,c,d,h,u,p,m,E,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,c,d,h,u,p,m,E,g)}set(e,n,i,r,s,a,o,l,c,d,h,u,p,m,E,g){const f=this.elements;return f[0]=e,f[4]=n,f[8]=i,f[12]=r,f[1]=s,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=d,f[10]=h,f[14]=u,f[3]=p,f[7]=m,f[11]=E,f[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Zl().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return this.determinantAffine()===0?(e.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const n=this.elements,i=e.elements,r=1/Qr.setFromMatrixColumn(e,0).length(),s=1/Qr.setFromMatrixColumn(e,1).length(),a=1/Qr.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*a,n[9]=i[9]*a,n[10]=i[10]*a,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),d=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const u=a*d,p=a*h,m=o*d,E=o*h;n[0]=l*d,n[4]=-l*h,n[8]=c,n[1]=p+m*c,n[5]=u-E*c,n[9]=-o*l,n[2]=E-u*c,n[6]=m+p*c,n[10]=a*l}else if(e.order==="YXZ"){const u=l*d,p=l*h,m=c*d,E=c*h;n[0]=u+E*o,n[4]=m*o-p,n[8]=a*c,n[1]=a*h,n[5]=a*d,n[9]=-o,n[2]=p*o-m,n[6]=E+u*o,n[10]=a*l}else if(e.order==="ZXY"){const u=l*d,p=l*h,m=c*d,E=c*h;n[0]=u-E*o,n[4]=-a*h,n[8]=m+p*o,n[1]=p+m*o,n[5]=a*d,n[9]=E-u*o,n[2]=-a*c,n[6]=o,n[10]=a*l}else if(e.order==="ZYX"){const u=a*d,p=a*h,m=o*d,E=o*h;n[0]=l*d,n[4]=m*c-p,n[8]=u*c+E,n[1]=l*h,n[5]=E*c+u,n[9]=p*c-m,n[2]=-c,n[6]=o*l,n[10]=a*l}else if(e.order==="YZX"){const u=a*l,p=a*c,m=o*l,E=o*c;n[0]=l*d,n[4]=E-u*h,n[8]=m*h+p,n[1]=h,n[5]=a*d,n[9]=-o*d,n[2]=-c*d,n[6]=p*h+m,n[10]=u-E*h}else if(e.order==="XZY"){const u=a*l,p=a*c,m=o*l,E=o*c;n[0]=l*d,n[4]=-h,n[8]=c*d,n[1]=u*h+E,n[5]=a*d,n[9]=p*h-m,n[2]=m*h-p,n[6]=o*d,n[10]=E*h+u}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(tE,e,nE)}lookAt(e,n,i){const r=this.elements;return En.subVectors(e,n),En.lengthSq()===0&&(En.z=1),En.normalize(),Gi.crossVectors(i,En),Gi.lengthSq()===0&&(Math.abs(i.z)===1?En.x+=1e-4:En.z+=1e-4,En.normalize(),Gi.crossVectors(i,En)),Gi.normalize(),bo.crossVectors(En,Gi),r[0]=Gi.x,r[4]=bo.x,r[8]=En.x,r[1]=Gi.y,r[5]=bo.y,r[9]=En.y,r[2]=Gi.z,r[6]=bo.z,r[10]=En.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],d=i[1],h=i[5],u=i[9],p=i[13],m=i[2],E=i[6],g=i[10],f=i[14],_=i[3],S=i[7],y=i[11],b=i[15],w=r[0],A=r[4],x=r[8],C=r[12],N=r[1],P=r[5],z=r[9],K=r[13],ee=r[2],O=r[6],H=r[10],I=r[14],L=r[3],j=r[7],Q=r[11],ne=r[15];return s[0]=a*w+o*N+l*ee+c*L,s[4]=a*A+o*P+l*O+c*j,s[8]=a*x+o*z+l*H+c*Q,s[12]=a*C+o*K+l*I+c*ne,s[1]=d*w+h*N+u*ee+p*L,s[5]=d*A+h*P+u*O+p*j,s[9]=d*x+h*z+u*H+p*Q,s[13]=d*C+h*K+u*I+p*ne,s[2]=m*w+E*N+g*ee+f*L,s[6]=m*A+E*P+g*O+f*j,s[10]=m*x+E*z+g*H+f*Q,s[14]=m*C+E*K+g*I+f*ne,s[3]=_*w+S*N+y*ee+b*L,s[7]=_*A+S*P+y*O+b*j,s[11]=_*x+S*z+y*H+b*Q,s[15]=_*C+S*K+y*I+b*ne,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],d=e[2],h=e[6],u=e[10],p=e[14],m=e[3],E=e[7],g=e[11],f=e[15],_=l*p-c*u,S=o*p-c*h,y=o*u-l*h,b=a*p-c*d,w=a*u-l*d,A=a*h-o*d;return n*(E*_-g*S+f*y)-i*(m*_-g*b+f*w)+r*(m*S-E*b+f*A)-s*(m*y-E*w+g*A)}determinantAffine(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[1],a=e[5],o=e[9],l=e[2],c=e[6],d=e[10];return n*(a*d-o*c)-i*(s*d-o*l)+r*(s*c-a*l)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],h=e[9],u=e[10],p=e[11],m=e[12],E=e[13],g=e[14],f=e[15],_=n*o-i*a,S=n*l-r*a,y=n*c-s*a,b=i*l-r*o,w=i*c-s*o,A=r*c-s*l,x=d*E-h*m,C=d*g-u*m,N=d*f-p*m,P=h*g-u*E,z=h*f-p*E,K=u*f-p*g,ee=_*K-S*z+y*P+b*N-w*C+A*x;if(ee===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const O=1/ee;return e[0]=(o*K-l*z+c*P)*O,e[1]=(r*z-i*K-s*P)*O,e[2]=(E*A-g*w+f*b)*O,e[3]=(u*w-h*A-p*b)*O,e[4]=(l*N-a*K-c*C)*O,e[5]=(n*K-r*N+s*C)*O,e[6]=(g*y-m*A-f*S)*O,e[7]=(d*A-u*y+p*S)*O,e[8]=(a*z-o*N+c*x)*O,e[9]=(i*N-n*z-s*x)*O,e[10]=(m*w-E*y+f*_)*O,e[11]=(h*y-d*w-p*_)*O,e[12]=(o*C-a*P-l*x)*O,e[13]=(n*P-i*C+r*x)*O,e[14]=(E*S-m*b-g*_)*O,e[15]=(d*b-h*S+u*_)*O,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,d=s*o;return this.set(c*a+i,c*o-r*l,c*l+r*o,0,c*o+r*l,d*o+i,d*l-r*a,0,c*l-r*o,d*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,a=n._y,o=n._z,l=n._w,c=s+s,d=a+a,h=o+o,u=s*c,p=s*d,m=s*h,E=a*d,g=a*h,f=o*h,_=l*c,S=l*d,y=l*h,b=i.x,w=i.y,A=i.z;return r[0]=(1-(E+f))*b,r[1]=(p+y)*b,r[2]=(m-S)*b,r[3]=0,r[4]=(p-y)*w,r[5]=(1-(u+f))*w,r[6]=(g+_)*w,r[7]=0,r[8]=(m+S)*A,r[9]=(g-_)*A,r[10]=(1-(u+E))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];const s=this.determinantAffine();if(s===0)return i.set(1,1,1),n.identity(),this;let a=Qr.set(r[0],r[1],r[2]).length();const o=Qr.set(r[4],r[5],r[6]).length(),l=Qr.set(r[8],r[9],r[10]).length();s<0&&(a=-a),Wn.copy(this);const c=1/a,d=1/o,h=1/l;return Wn.elements[0]*=c,Wn.elements[1]*=c,Wn.elements[2]*=c,Wn.elements[4]*=d,Wn.elements[5]*=d,Wn.elements[6]*=d,Wn.elements[8]*=h,Wn.elements[9]*=h,Wn.elements[10]*=h,n.setFromRotationMatrix(Wn),i.x=a,i.y=o,i.z=l,this}makePerspective(e,n,i,r,s,a,o=di,l=!1){const c=this.elements,d=2*s/(n-e),h=2*s/(i-r),u=(n+e)/(n-e),p=(i+r)/(i-r);let m,E;if(l)m=s/(a-s),E=a*s/(a-s);else if(o===di)m=-(a+s)/(a-s),E=-2*a*s/(a-s);else if(o===Yl)m=-a/(a-s),E=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=E,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,n,i,r,s,a,o=di,l=!1){const c=this.elements,d=2/(n-e),h=2/(i-r),u=-(n+e)/(n-e),p=-(i+r)/(i-r);let m,E;if(l)m=1/(a-s),E=a/(a-s);else if(o===di)m=-2/(a-s),E=-(a+s)/(a-s);else if(o===Yl)m=-1/(a-s),E=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=h,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=m,c[14]=E,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}};Zl.prototype.isMatrix4=!0;let Lt=Zl;const Qr=new V,Wn=new Lt,tE=new V(0,0,0),nE=new V(1,1,1),Gi=new V,bo=new V,En=new V,gm=new Lt,_m=new mr;class Gr{constructor(e=0,n=0,i=0,r=Gr.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],d=r[9],h=r[2],u=r[6],p=r[10];switch(n){case"XYZ":this._y=Math.asin(Xe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Xe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(Xe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Xe(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(u,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Xe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Xe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-d,p),this._y=0);break;default:Le("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return gm.makeRotationFromQuaternion(e),this.setFromRotationMatrix(gm,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return _m.setFromEuler(this),this.setFromQuaternion(_m,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Gr.DEFAULT_ORDER="XYZ";class J_{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let iE=0;const vm=new V,Jr=new mr,xi=new Lt,Ao=new V,oa=new V,rE=new V,sE=new mr,xm=new V(1,0,0),ym=new V(0,1,0),Sm=new V(0,0,1),Mm={type:"added"},aE={type:"removed"},es={type:"childadded",child:null},iu={type:"childremoved",child:null};class Sn extends xr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:iE++}),this.uuid=Ja(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Sn.DEFAULT_UP.clone();const e=new V,n=new Gr,i=new mr,r=new V(1,1,1);function s(){i.setFromEuler(n,!1)}function a(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Lt},normalMatrix:{value:new Fe}}),this.matrix=new Lt,this.matrixWorld=new Lt,this.matrixAutoUpdate=Sn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Sn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new J_,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return Jr.setFromAxisAngle(e,n),this.quaternion.multiply(Jr),this}rotateOnWorldAxis(e,n){return Jr.setFromAxisAngle(e,n),this.quaternion.premultiply(Jr),this}rotateX(e){return this.rotateOnAxis(xm,e)}rotateY(e){return this.rotateOnAxis(ym,e)}rotateZ(e){return this.rotateOnAxis(Sm,e)}translateOnAxis(e,n){return vm.copy(e).applyQuaternion(this.quaternion),this.position.add(vm.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(xm,e)}translateY(e){return this.translateOnAxis(ym,e)}translateZ(e){return this.translateOnAxis(Sm,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(xi.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?Ao.copy(e):Ao.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),oa.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xi.lookAt(oa,Ao,this.up):xi.lookAt(Ao,oa,this.up),this.quaternion.setFromRotationMatrix(xi),r&&(xi.extractRotation(r.matrixWorld),Jr.setFromRotationMatrix(xi),this.quaternion.premultiply(Jr.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(Qe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Mm),es.child=e,this.dispatchEvent(es),es.child=null):Qe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(aE),iu.child=e,this.dispatchEvent(iu),iu.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),xi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),xi.multiply(e.parent.matrixWorld)),e.applyMatrix4(xi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Mm),es.child=e,this.dispatchEvent(es),es.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,n);if(a!==void 0)return a}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(oa,e,rE),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(oa,sE,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const n=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=n-s[0]*n-s[4]*i-s[8]*r,s[13]+=i-s[1]*n-s[5]*i-s[9]*r,s[14]+=r-s[2]*n-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n,i=!1){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),n===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(n){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),d=a(e.images),h=a(e.shapes),u=a(e.skeletons),p=a(e.animations),m=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),d.length>0&&(i.images=d),h.length>0&&(i.shapes=h),u.length>0&&(i.skeletons=u),p.length>0&&(i.animations=p),m.length>0&&(i.nodes=m)}return i.object=r,i;function a(o){const l=[];for(const c in o){const d=o[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Sn.DEFAULT_UP=new V(0,1,0);Sn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Sn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class va extends Sn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const oE={type:"move"};class ru{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new va,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new va,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new va,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const E of e.hand.values()){const g=n.getJointPose(E,i),f=this._getHandJoint(c,E);g!==null&&(f.matrix.fromArray(g.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=g.radius),f.visible=g!==null}const d=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],u=d.position.distanceTo(h.position),p=.02,m=.005;c.inputState.pinching&&u>p+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=p-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(oE)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new va;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const ev={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Wi={h:0,s:0,l:0},Co={h:0,s:0,l:0};function su(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class ze{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=In){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,qe.colorSpaceToWorking(this,n),this}setRGB(e,n,i,r=qe.workingColorSpace){return this.r=e,this.g=n,this.b=i,qe.colorSpaceToWorking(this,r),this}setHSL(e,n,i,r=qe.workingColorSpace){if(e=$M(e,1),n=Xe(n,0,1),i=Xe(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,a=2*i-s;this.r=su(a,s,e+1/3),this.g=su(a,s,e),this.b=su(a,s,e-1/3)}return qe.colorSpaceToWorking(this,r),this}setStyle(e,n=In){function i(s){s!==void 0&&parseFloat(s)<1&&Le("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:Le("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(a===6)return this.setHex(parseInt(s,16),n);Le("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=In){const i=ev[e.toLowerCase()];return i!==void 0?this.setHex(i,n):Le("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Di(e.r),this.g=Di(e.g),this.b=Di(e.b),this}copyLinearToSRGB(e){return this.r=Ls(e.r),this.g=Ls(e.g),this.b=Ls(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=In){return qe.workingToColorSpace(en.copy(this),e),Math.round(Xe(en.r*255,0,255))*65536+Math.round(Xe(en.g*255,0,255))*256+Math.round(Xe(en.b*255,0,255))}getHexString(e=In){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=qe.workingColorSpace){qe.workingToColorSpace(en.copy(this),n);const i=en.r,r=en.g,s=en.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,c;const d=(o+a)/2;if(o===a)l=0,c=0;else{const h=a-o;switch(c=d<=.5?h/(a+o):h/(2-a-o),a){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,n=qe.workingColorSpace){return qe.workingToColorSpace(en.copy(this),n),e.r=en.r,e.g=en.g,e.b=en.b,e}getStyle(e=In){qe.workingToColorSpace(en.copy(this),e);const n=en.r,i=en.g,r=en.b;return e!==In?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(Wi),this.setHSL(Wi.h+e,Wi.s+n,Wi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(Wi),e.getHSL(Co);const i=Qc(Wi.h,Co.h,n),r=Qc(Wi.s,Co.s,n),s=Qc(Wi.l,Co.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const en=new ze;ze.NAMES=ev;class lE extends Sn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Gr,this.environmentIntensity=1,this.environmentRotation=new Gr,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}const Xn=new V,yi=new V,au=new V,Si=new V,ts=new V,ns=new V,Em=new V,ou=new V,lu=new V,cu=new V,uu=new Ct,fu=new Ct,du=new Ct;class Kn{constructor(e=new V,n=new V,i=new V){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),Xn.subVectors(e,n),r.cross(Xn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){Xn.subVectors(r,n),yi.subVectors(i,n),au.subVectors(e,n);const a=Xn.dot(Xn),o=Xn.dot(yi),l=Xn.dot(au),c=yi.dot(yi),d=yi.dot(au),h=a*c-o*o;if(h===0)return s.set(0,0,0),null;const u=1/h,p=(c*l-o*d)*u,m=(a*d-o*l)*u;return s.set(1-p-m,m,p)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,Si)===null?!1:Si.x>=0&&Si.y>=0&&Si.x+Si.y<=1}static getInterpolation(e,n,i,r,s,a,o,l){return this.getBarycoord(e,n,i,r,Si)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Si.x),l.addScaledVector(a,Si.y),l.addScaledVector(o,Si.z),l)}static getInterpolatedAttribute(e,n,i,r,s,a){return uu.setScalar(0),fu.setScalar(0),du.setScalar(0),uu.fromBufferAttribute(e,n),fu.fromBufferAttribute(e,i),du.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(uu,s.x),a.addScaledVector(fu,s.y),a.addScaledVector(du,s.z),a}static isFrontFacing(e,n,i,r){return Xn.subVectors(i,n),yi.subVectors(e,n),Xn.cross(yi).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Xn.subVectors(this.c,this.b),yi.subVectors(this.a,this.b),Xn.cross(yi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Kn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return Kn.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return Kn.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return Kn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Kn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let a,o;ts.subVectors(r,i),ns.subVectors(s,i),ou.subVectors(e,i);const l=ts.dot(ou),c=ns.dot(ou);if(l<=0&&c<=0)return n.copy(i);lu.subVectors(e,r);const d=ts.dot(lu),h=ns.dot(lu);if(d>=0&&h<=d)return n.copy(r);const u=l*h-d*c;if(u<=0&&l>=0&&d<=0)return a=l/(l-d),n.copy(i).addScaledVector(ts,a);cu.subVectors(e,s);const p=ts.dot(cu),m=ns.dot(cu);if(m>=0&&p<=m)return n.copy(s);const E=p*c-l*m;if(E<=0&&c>=0&&m<=0)return o=c/(c-m),n.copy(i).addScaledVector(ns,o);const g=d*m-p*h;if(g<=0&&h-d>=0&&p-m>=0)return Em.subVectors(s,r),o=(h-d)/(h-d+(p-m)),n.copy(r).addScaledVector(Em,o);const f=1/(g+E+u);return a=E*f,o=u*f,n.copy(i).addScaledVector(ts,a).addScaledVector(ns,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class eo{constructor(e=new V(1/0,1/0,1/0),n=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(jn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(jn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=jn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,jn):jn.fromBufferAttribute(s,a),jn.applyMatrix4(e.matrixWorld),this.expandByPoint(jn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ro.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ro.copy(i.boundingBox)),Ro.applyMatrix4(e.matrixWorld),this.union(Ro)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,jn),jn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(la),Po.subVectors(this.max,la),is.subVectors(e.a,la),rs.subVectors(e.b,la),ss.subVectors(e.c,la),Xi.subVectors(rs,is),ji.subVectors(ss,rs),Sr.subVectors(is,ss);let n=[0,-Xi.z,Xi.y,0,-ji.z,ji.y,0,-Sr.z,Sr.y,Xi.z,0,-Xi.x,ji.z,0,-ji.x,Sr.z,0,-Sr.x,-Xi.y,Xi.x,0,-ji.y,ji.x,0,-Sr.y,Sr.x,0];return!hu(n,is,rs,ss,Po)||(n=[1,0,0,0,1,0,0,0,1],!hu(n,is,rs,ss,Po))?!1:(No.crossVectors(Xi,ji),n=[No.x,No.y,No.z],hu(n,is,rs,ss,Po))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,jn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(jn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Mi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Mi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Mi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Mi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Mi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Mi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Mi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Mi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Mi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Mi=[new V,new V,new V,new V,new V,new V,new V,new V],jn=new V,Ro=new eo,is=new V,rs=new V,ss=new V,Xi=new V,ji=new V,Sr=new V,la=new V,Po=new V,No=new V,Mr=new V;function hu(t,e,n,i,r){for(let s=0,a=t.length-3;s<=a;s+=3){Mr.fromArray(t,s);const o=r.x*Math.abs(Mr.x)+r.y*Math.abs(Mr.y)+r.z*Math.abs(Mr.z),l=e.dot(Mr),c=n.dot(Mr),d=i.dot(Mr);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}const It=new V,Do=new Ne;let cE=0;class mt extends xr{constructor(e,n,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:cE++}),this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=cm,this.updateRanges=[],this.gpuType=fi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)Do.fromBufferAttribute(this,n),Do.applyMatrix3(e),this.setXY(n,Do.x,Do.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)It.fromBufferAttribute(this,n),It.applyMatrix3(e),this.setXYZ(n,It.x,It.y,It.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)It.fromBufferAttribute(this,n),It.applyMatrix4(e),this.setXYZ(n,It.x,It.y,It.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)It.fromBufferAttribute(this,n),It.applyNormalMatrix(e),this.setXYZ(n,It.x,It.y,It.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)It.fromBufferAttribute(this,n),It.transformDirection(e),this.setXYZ(n,It.x,It.y,It.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=aa(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=dn(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=aa(n,this.array)),n}setX(e,n){return this.normalized&&(n=dn(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=aa(n,this.array)),n}setY(e,n){return this.normalized&&(n=dn(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=aa(n,this.array)),n}setZ(e,n){return this.normalized&&(n=dn(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=aa(n,this.array)),n}setW(e,n){return this.normalized&&(n=dn(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=dn(n,this.array),i=dn(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=dn(n,this.array),i=dn(i,this.array),r=dn(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=dn(n,this.array),i=dn(i,this.array),r=dn(r,this.array),s=dn(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==cm&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class tv extends mt{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class nv extends mt{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class ei extends mt{constructor(e,n,i){super(new Float32Array(e),n,i)}}const uE=new eo,ca=new V,pu=new V;class gc{constructor(e=new V,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):uE.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ca.subVectors(e,this.center);const n=ca.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(ca,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(pu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ca.copy(e.center).add(pu)),this.expandByPoint(ca.copy(e.center).sub(pu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let fE=0;const Ln=new Lt,mu=new Sn,as=new V,Tn=new eo,ua=new eo,Vt=new V;class on extends xr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:fE++}),this.uuid=Ja(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(GM(e)?nv:tv)(e,1):this.index=e,this}setIndirect(e,n=0){return this.indirect=e,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Fe().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Ln.makeRotationFromQuaternion(e),this.applyMatrix4(Ln),this}rotateX(e){return Ln.makeRotationX(e),this.applyMatrix4(Ln),this}rotateY(e){return Ln.makeRotationY(e),this.applyMatrix4(Ln),this}rotateZ(e){return Ln.makeRotationZ(e),this.applyMatrix4(Ln),this}translate(e,n,i){return Ln.makeTranslation(e,n,i),this.applyMatrix4(Ln),this}scale(e,n,i){return Ln.makeScale(e,n,i),this.applyMatrix4(Ln),this}lookAt(e){return mu.lookAt(e),mu.updateMatrix(),this.applyMatrix4(mu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(as).negate(),this.translate(as.x,as.y,as.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ei(i,3))}else{const i=Math.min(e.length,n.count);for(let r=0;r<i;r++){const s=e[r];n.setXYZ(r,s.x,s.y,s.z||0)}e.length>n.count&&Le("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new eo);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Qe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];Tn.setFromBufferAttribute(s),this.morphTargetsRelative?(Vt.addVectors(this.boundingBox.min,Tn.min),this.boundingBox.expandByPoint(Vt),Vt.addVectors(this.boundingBox.max,Tn.max),this.boundingBox.expandByPoint(Vt)):(this.boundingBox.expandByPoint(Tn.min),this.boundingBox.expandByPoint(Tn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Qe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new gc);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Qe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(e){const i=this.boundingSphere.center;if(Tn.setFromBufferAttribute(e),n)for(let s=0,a=n.length;s<a;s++){const o=n[s];ua.setFromBufferAttribute(o),this.morphTargetsRelative?(Vt.addVectors(Tn.min,ua.min),Tn.expandByPoint(Vt),Vt.addVectors(Tn.max,ua.max),Tn.expandByPoint(Vt)):(Tn.expandByPoint(ua.min),Tn.expandByPoint(ua.max))}Tn.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)Vt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Vt));if(n)for(let s=0,a=n.length;s<a;s++){const o=n[s],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)Vt.fromBufferAttribute(o,c),l&&(as.fromBufferAttribute(e,c),Vt.add(as)),r=Math.max(r,i.distanceToSquared(Vt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&Qe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){Qe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new mt(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let x=0;x<i.count;x++)o[x]=new V,l[x]=new V;const c=new V,d=new V,h=new V,u=new Ne,p=new Ne,m=new Ne,E=new V,g=new V;function f(x,C,N){c.fromBufferAttribute(i,x),d.fromBufferAttribute(i,C),h.fromBufferAttribute(i,N),u.fromBufferAttribute(s,x),p.fromBufferAttribute(s,C),m.fromBufferAttribute(s,N),d.sub(c),h.sub(c),p.sub(u),m.sub(u);const P=1/(p.x*m.y-m.x*p.y);isFinite(P)&&(E.copy(d).multiplyScalar(m.y).addScaledVector(h,-p.y).multiplyScalar(P),g.copy(h).multiplyScalar(p.x).addScaledVector(d,-m.x).multiplyScalar(P),o[x].add(E),o[C].add(E),o[N].add(E),l[x].add(g),l[C].add(g),l[N].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let x=0,C=_.length;x<C;++x){const N=_[x],P=N.start,z=N.count;for(let K=P,ee=P+z;K<ee;K+=3)f(e.getX(K+0),e.getX(K+1),e.getX(K+2))}const S=new V,y=new V,b=new V,w=new V;function A(x){b.fromBufferAttribute(r,x),w.copy(b);const C=o[x];S.copy(C),S.sub(b.multiplyScalar(b.dot(C))).normalize(),y.crossVectors(w,C);const P=y.dot(l[x])<0?-1:1;a.setXYZW(x,S.x,S.y,S.z,P)}for(let x=0,C=_.length;x<C;++x){const N=_[x],P=N.start,z=N.count;for(let K=P,ee=P+z;K<ee;K+=3)A(e.getX(K+0)),A(e.getX(K+1)),A(e.getX(K+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==n.count)i=new mt(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let u=0,p=i.count;u<p;u++)i.setXYZ(u,0,0,0);const r=new V,s=new V,a=new V,o=new V,l=new V,c=new V,d=new V,h=new V;if(e)for(let u=0,p=e.count;u<p;u+=3){const m=e.getX(u+0),E=e.getX(u+1),g=e.getX(u+2);r.fromBufferAttribute(n,m),s.fromBufferAttribute(n,E),a.fromBufferAttribute(n,g),d.subVectors(a,s),h.subVectors(r,s),d.cross(h),o.fromBufferAttribute(i,m),l.fromBufferAttribute(i,E),c.fromBufferAttribute(i,g),o.add(d),l.add(d),c.add(d),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(E,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let u=0,p=n.count;u<p;u+=3)r.fromBufferAttribute(n,u+0),s.fromBufferAttribute(n,u+1),a.fromBufferAttribute(n,u+2),d.subVectors(a,s),h.subVectors(r,s),d.cross(h),i.setXYZ(u+0,d.x,d.y,d.z),i.setXYZ(u+1,d.x,d.y,d.z),i.setXYZ(u+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Vt.fromBufferAttribute(e,n),Vt.normalize(),e.setXYZ(n,Vt.x,Vt.y,Vt.z)}toNonIndexed(){function e(o,l){const c=o.array,d=o.itemSize,h=o.normalized,u=new c.constructor(l.length*d);let p=0,m=0;for(let E=0,g=l.length;E<g;E++){o.isInterleavedBufferAttribute?p=l[E]*o.data.stride+o.offset:p=l[E]*d;for(let f=0;f<d;f++)u[m++]=c[p++]}return new mt(u,d,h)}if(this.index===null)return Le("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new on,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,i);n.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let d=0,h=c.length;d<h;d++){const u=c[d],p=e(u,i);l.push(p)}n.morphAttributes[o]=l}n.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let h=0,u=c.length;h<u;h++){const p=c[h];d.push(p.toJSON(e.data))}d.length>0&&(r[l]=d,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const c in r){const d=r[c];this.setAttribute(c,d.clone(n))}const s=e.morphAttributes;for(const c in s){const d=[],h=s[c];for(let u=0,p=h.length;u<p;u++)d.push(h[u].clone(n));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,d=a.length;c<d;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let dE=0;class to extends xr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:dE++}),this.uuid=Ja(),this.name="",this.type="Material",this.blending=Ns,this.side=pr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Tf,this.blendDst=wf,this.blendEquation=Ar,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ze(0,0,0),this.blendAlpha=0,this.depthFunc=Gs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=lm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Kr,this.stencilZFail=Kr,this.stencilZPass=Kr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){Le(`Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){Le(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector2&&i&&i.isVector2||r&&r.isEuler&&i&&i.isEuler||r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ns&&(i.blending=this.blending),this.side!==pr&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Tf&&(i.blendSrc=this.blendSrc),this.blendDst!==wf&&(i.blendDst=this.blendDst),this.blendEquation!==Ar&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Gs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==lm&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Kr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Kr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Kr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(n){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}fromJSON(e,n){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new ze().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=n[e.map]||null),e.matcap!==void 0&&(this.matcap=n[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=n[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=n[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=n[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Ne().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=n[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=n[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=n[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=n[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=n[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=n[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=n[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=n[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=n[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=n[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=n[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=n[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=n[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=n[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Ne().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=n[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=n[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=n[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=n[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=n[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=n[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=n[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Ei=new V,gu=new V,Lo=new V,$i=new V,_u=new V,Io=new V,vu=new V;class Sh{constructor(e=new V,n=new V(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ei)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=Ei.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Ei.copy(this.origin).addScaledVector(this.direction,n),Ei.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){gu.copy(e).add(n).multiplyScalar(.5),Lo.copy(n).sub(e).normalize(),$i.copy(this.origin).sub(gu);const s=e.distanceTo(n)*.5,a=-this.direction.dot(Lo),o=$i.dot(this.direction),l=-$i.dot(Lo),c=$i.lengthSq(),d=Math.abs(1-a*a);let h,u,p,m;if(d>0)if(h=a*l-o,u=a*o-l,m=s*d,h>=0)if(u>=-m)if(u<=m){const E=1/d;h*=E,u*=E,p=h*(h+a*u+2*o)+u*(a*h+u+2*l)+c}else u=s,h=Math.max(0,-(a*u+o)),p=-h*h+u*(u+2*l)+c;else u=-s,h=Math.max(0,-(a*u+o)),p=-h*h+u*(u+2*l)+c;else u<=-m?(h=Math.max(0,-(-a*s+o)),u=h>0?-s:Math.min(Math.max(-s,-l),s),p=-h*h+u*(u+2*l)+c):u<=m?(h=0,u=Math.min(Math.max(-s,-l),s),p=u*(u+2*l)+c):(h=Math.max(0,-(a*s+o)),u=h>0?s:Math.min(Math.max(-s,-l),s),p=-h*h+u*(u+2*l)+c);else u=a>0?-s:s,h=Math.max(0,-(a*u+o)),p=-h*h+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(gu).addScaledVector(Lo,u),p}intersectSphere(e,n){Ei.subVectors(e.center,this.origin);const i=Ei.dot(this.direction),r=Ei.dot(Ei)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,n):this.at(o,n)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,a,o,l;const c=1/this.direction.x,d=1/this.direction.y,h=1/this.direction.z,u=this.origin;return c>=0?(i=(e.min.x-u.x)*c,r=(e.max.x-u.x)*c):(i=(e.max.x-u.x)*c,r=(e.min.x-u.x)*c),d>=0?(s=(e.min.y-u.y)*d,a=(e.max.y-u.y)*d):(s=(e.max.y-u.y)*d,a=(e.min.y-u.y)*d),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),h>=0?(o=(e.min.z-u.z)*h,l=(e.max.z-u.z)*h):(o=(e.max.z-u.z)*h,l=(e.min.z-u.z)*h),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,Ei)!==null}intersectTriangle(e,n,i,r,s){_u.subVectors(n,e),Io.subVectors(i,e),vu.crossVectors(_u,Io);let a=this.direction.dot(vu),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;$i.subVectors(this.origin,e);const l=o*this.direction.dot(Io.crossVectors($i,Io));if(l<0)return null;const c=o*this.direction.dot(_u.cross($i));if(c<0||l+c>a)return null;const d=-o*$i.dot(vu);return d<0?null:this.at(d/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Mh extends to{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Gr,this.combine=F_,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Tm=new Lt,Er=new Sh,Uo=new gc,wm=new V,Fo=new V,Oo=new V,ko=new V,xu=new V,Bo=new V,bm=new V,zo=new V;class vi extends Sn{constructor(e=new on,n=new Mh){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Bo.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const d=o[l],h=s[l];d!==0&&(xu.fromBufferAttribute(h,e),a?Bo.addScaledVector(xu,d):Bo.addScaledVector(xu.sub(n),d))}n.add(Bo)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Uo.copy(i.boundingSphere),Uo.applyMatrix4(s),Er.copy(e.ray).recast(e.near),!(Uo.containsPoint(Er.origin)===!1&&(Er.intersectSphere(Uo,wm)===null||Er.origin.distanceToSquared(wm)>(e.far-e.near)**2))&&(Tm.copy(s).invert(),Er.copy(e.ray).applyMatrix4(Tm),!(i.boundingBox!==null&&Er.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,Er)))}_computeIntersections(e,n,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,d=s.attributes.uv1,h=s.attributes.normal,u=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,E=u.length;m<E;m++){const g=u[m],f=a[g.materialIndex],_=Math.max(g.start,p.start),S=Math.min(o.count,Math.min(g.start+g.count,p.start+p.count));for(let y=_,b=S;y<b;y+=3){const w=o.getX(y),A=o.getX(y+1),x=o.getX(y+2);r=Vo(this,f,e,i,c,d,h,w,A,x),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=g.materialIndex,n.push(r))}}else{const m=Math.max(0,p.start),E=Math.min(o.count,p.start+p.count);for(let g=m,f=E;g<f;g+=3){const _=o.getX(g),S=o.getX(g+1),y=o.getX(g+2);r=Vo(this,a,e,i,c,d,h,_,S,y),r&&(r.faceIndex=Math.floor(g/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,E=u.length;m<E;m++){const g=u[m],f=a[g.materialIndex],_=Math.max(g.start,p.start),S=Math.min(l.count,Math.min(g.start+g.count,p.start+p.count));for(let y=_,b=S;y<b;y+=3){const w=y,A=y+1,x=y+2;r=Vo(this,f,e,i,c,d,h,w,A,x),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=g.materialIndex,n.push(r))}}else{const m=Math.max(0,p.start),E=Math.min(l.count,p.start+p.count);for(let g=m,f=E;g<f;g+=3){const _=g,S=g+1,y=g+2;r=Vo(this,a,e,i,c,d,h,_,S,y),r&&(r.faceIndex=Math.floor(g/3),n.push(r))}}}}function hE(t,e,n,i,r,s,a,o){let l;if(e.side===xn?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,e.side===pr,o),l===null)return null;zo.copy(o),zo.applyMatrix4(t.matrixWorld);const c=n.ray.origin.distanceTo(zo);return c<n.near||c>n.far?null:{distance:c,point:zo.clone(),object:t}}function Vo(t,e,n,i,r,s,a,o,l,c){t.getVertexPosition(o,Fo),t.getVertexPosition(l,Oo),t.getVertexPosition(c,ko);const d=hE(t,e,n,i,Fo,Oo,ko,bm);if(d){const h=new V;Kn.getBarycoord(bm,Fo,Oo,ko,h),r&&(d.uv=Kn.getInterpolatedAttribute(r,o,l,c,h,new Ne)),s&&(d.uv1=Kn.getInterpolatedAttribute(s,o,l,c,h,new Ne)),a&&(d.normal=Kn.getInterpolatedAttribute(a,o,l,c,h,new V),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new V,materialIndex:0};Kn.getNormal(Fo,Oo,ko,u.normal),d.face=u,d.barycoord=h}return d}class pE extends cn{constructor(e=null,n=1,i=1,r,s,a,o,l,c=jt,d=jt,h,u){super(null,a,o,l,c,d,r,s,h,u),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const yu=new V,mE=new V,gE=new Fe;class Zi{constructor(e=new V(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=yu.subVectors(i,n).cross(mE.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n,i=!0){const r=e.delta(yu),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return i===!0&&(a<0||a>1)?null:n.copy(e.start).addScaledVector(r,a)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||gE.getNormalMatrix(e),r=this.coplanarPoint(yu).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Tr=new gc,_E=new Ne(.5,.5),Ho=new V;class iv{constructor(e=new Zi,n=new Zi,i=new Zi,r=new Zi,s=new Zi,a=new Zi){this.planes=[e,n,i,r,s,a]}set(e,n,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(n),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=di,i=!1){const r=this.planes,s=e.elements,a=s[0],o=s[1],l=s[2],c=s[3],d=s[4],h=s[5],u=s[6],p=s[7],m=s[8],E=s[9],g=s[10],f=s[11],_=s[12],S=s[13],y=s[14],b=s[15];if(r[0].setComponents(c-a,p-d,f-m,b-_).normalize(),r[1].setComponents(c+a,p+d,f+m,b+_).normalize(),r[2].setComponents(c+o,p+h,f+E,b+S).normalize(),r[3].setComponents(c-o,p-h,f-E,b-S).normalize(),i)r[4].setComponents(l,u,g,y).normalize(),r[5].setComponents(c-l,p-u,f-g,b-y).normalize();else if(r[4].setComponents(c-l,p-u,f-g,b-y).normalize(),n===di)r[5].setComponents(c+l,p+u,f+g,b+y).normalize();else if(n===Yl)r[5].setComponents(l,u,g,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Tr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),Tr.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Tr)}intersectsSprite(e){Tr.center.set(0,0,0);const n=_E.distanceTo(e.center);return Tr.radius=.7071067811865476+n,Tr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Tr)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(Ho.x=r.normal.x>0?e.max.x:e.min.x,Ho.y=r.normal.y>0?e.max.y:e.min.y,Ho.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ho)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class vE extends to{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ze(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Am=new Lt,dd=new Sh,Go=new gc,Wo=new V;class Xo extends Sn{constructor(e=new on,n=new vE){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Go.copy(i.boundingSphere),Go.applyMatrix4(r),Go.radius+=s,e.ray.intersectsSphere(Go)===!1)return;Am.copy(r).invert(),dd.copy(e.ray).applyMatrix4(Am);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,h=i.attributes.position;if(c!==null){const u=Math.max(0,a.start),p=Math.min(c.count,a.start+a.count);for(let m=u,E=p;m<E;m++){const g=c.getX(m);Wo.fromBufferAttribute(h,g),Cm(Wo,g,l,r,e,n,this)}}else{const u=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let m=u,E=p;m<E;m++)Wo.fromBufferAttribute(h,m),Cm(Wo,m,l,r,e,n,this)}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Cm(t,e,n,i,r,s,a){const o=dd.distanceSqToPoint(t);if(o<n){const l=new V;dd.closestPointToPoint(t,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class rv extends cn{constructor(e=[],n=Vr,i,r,s,a,o,l,c,d){super(e,n,i,r,s,a,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Xs extends cn{constructor(e,n,i=_i,r,s,a,o=jt,l=jt,c,d=Oi,h=1){if(d!==Oi&&d!==Lr)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:n,depth:h};super(u,r,s,a,o,l,d,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new yh(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}class xE extends Xs{constructor(e,n=_i,i=Vr,r,s,a=jt,o=jt,l,c=Oi){const d={width:e,height:e,depth:1},h=[d,d,d,d,d,d];super(e,e,n,i,r,s,a,o,l,c),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class sv extends cn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class no extends on{constructor(e=1,n=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],d=[],h=[];let u=0,p=0;m("z","y","x",-1,-1,i,n,e,a,s,0),m("z","y","x",1,-1,i,n,-e,a,s,1),m("x","z","y",1,1,e,i,n,r,a,2),m("x","z","y",1,-1,e,i,-n,r,a,3),m("x","y","z",1,-1,e,n,i,r,s,4),m("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new ei(c,3)),this.setAttribute("normal",new ei(d,3)),this.setAttribute("uv",new ei(h,2));function m(E,g,f,_,S,y,b,w,A,x,C){const N=y/A,P=b/x,z=y/2,K=b/2,ee=w/2,O=A+1,H=x+1;let I=0,L=0;const j=new V;for(let Q=0;Q<H;Q++){const ne=Q*P-K;for(let le=0;le<O;le++){const Oe=le*N-z;j[E]=Oe*_,j[g]=ne*S,j[f]=ee,c.push(j.x,j.y,j.z),j[E]=0,j[g]=0,j[f]=w>0?1:-1,d.push(j.x,j.y,j.z),h.push(le/A),h.push(1-Q/x),I+=1}}for(let Q=0;Q<x;Q++)for(let ne=0;ne<A;ne++){const le=u+ne+O*Q,Oe=u+ne+O*(Q+1),ke=u+(ne+1)+O*(Q+1),He=u+(ne+1)+O*Q;l.push(le,Oe,He),l.push(Oe,ke,He),L+=6}o.addGroup(p,L,C),p+=L,u+=I}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new no(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class _c extends on{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,a=n/2,o=Math.floor(i),l=Math.floor(r),c=o+1,d=l+1,h=e/o,u=n/l,p=[],m=[],E=[],g=[];for(let f=0;f<d;f++){const _=f*u-a;for(let S=0;S<c;S++){const y=S*h-s;m.push(y,-_,0),E.push(0,0,1),g.push(S/o),g.push(1-f/l)}}for(let f=0;f<l;f++)for(let _=0;_<o;_++){const S=_+c*f,y=_+c*(f+1),b=_+1+c*(f+1),w=_+1+c*f;p.push(S,y,w),p.push(y,b,w)}this.setIndex(p),this.setAttribute("position",new ei(m,3)),this.setAttribute("normal",new ei(E,3)),this.setAttribute("uv",new ei(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _c(e.width,e.height,e.widthSegments,e.heightSegments)}}function js(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];if(Rm(r))r.isRenderTargetTexture?(Le("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone();else if(Array.isArray(r))if(Rm(r[0])){const s=[];for(let a=0,o=r.length;a<o;a++)s[a]=r[a].clone();e[n][i]=s}else e[n][i]=r.slice();else e[n][i]=r}}return e}function sn(t){const e={};for(let n=0;n<t.length;n++){const i=js(t[n]);for(const r in i)e[r]=i[r]}return e}function Rm(t){return t&&(t.isColor||t.isMatrix3||t.isMatrix4||t.isVector2||t.isVector3||t.isVector4||t.isTexture||t.isQuaternion)}function yE(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function av(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:qe.workingColorSpace}const Kl={clone:js,merge:sn};var SE=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ME=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class $t extends to{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=SE,this.fragmentShader=ME,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=js(e.uniforms),this.uniformsGroups=yE(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?n.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?n.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?n.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?n.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?n.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?n.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?n.uniforms[r]={type:"m4",value:a.toArray()}:n.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}fromJSON(e,n){if(super.fromJSON(e,n),e.uniforms!==void 0)for(const i in e.uniforms){const r=e.uniforms[i];switch(this.uniforms[i]={},r.type){case"t":this.uniforms[i].value=n[r.value]||null;break;case"c":this.uniforms[i].value=new ze().setHex(r.value);break;case"v2":this.uniforms[i].value=new Ne().fromArray(r.value);break;case"v3":this.uniforms[i].value=new V().fromArray(r.value);break;case"v4":this.uniforms[i].value=new Ct().fromArray(r.value);break;case"m3":this.uniforms[i].value=new Fe().fromArray(r.value);break;case"m4":this.uniforms[i].value=new Lt().fromArray(r.value);break;default:this.uniforms[i].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class EE extends $t{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class TE extends to{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=UM,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class wE extends to{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const jo=new V,$o=new mr,ai=new V;class ov extends Sn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Lt,this.projectionMatrix=new Lt,this.projectionMatrixInverse=new Lt,this.coordinateSystem=di,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(jo,$o,ai),ai.x===1&&ai.y===1&&ai.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(jo,$o,ai.set(1,1,1)).invert()}updateWorldMatrix(e,n,i=!1){super.updateWorldMatrix(e,n,i),this.matrixWorld.decompose(jo,$o,ai),ai.x===1&&ai.y===1&&ai.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(jo,$o,ai.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Yi=new V,Pm=new Ne,Nm=new Ne;class On extends ov{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=fd*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(pl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return fd*2*Math.atan(Math.tan(pl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){Yi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Yi.x,Yi.y).multiplyScalar(-e/Yi.z),Yi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Yi.x,Yi.y).multiplyScalar(-e/Yi.z)}getViewSize(e,n){return this.getViewBounds(e,Pm,Nm),n.subVectors(Nm,Pm)}setViewOffset(e,n,i,r,s,a){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(pl*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,n-=a.offsetY*i/c,r*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}class Eh extends ov{constructor(e=-1,n=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const os=-90,ls=1;class bE extends Sn{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new On(os,ls,e,n);r.layers=this.layers,this.add(r);const s=new On(os,ls,e,n);s.layers=this.layers,this.add(s);const a=new On(os,ls,e,n);a.layers=this.layers,this.add(a);const o=new On(os,ls,e,n);o.layers=this.layers,this.add(o);const l=new On(os,ls,e,n);l.layers=this.layers,this.add(l);const c=new On(os,ls,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,a,o,l]=n;for(const c of n)this.remove(c);if(e===di)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Yl)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,d]=this.children,h=e.getRenderTarget(),u=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;const E=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,s),e.setRenderTarget(i,1,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,a),e.setRenderTarget(i,2,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,o),e.setRenderTarget(i,3,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,l),e.setRenderTarget(i,4,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,c),i.texture.generateMipmaps=E,e.setRenderTarget(i,5,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,d),e.setRenderTarget(h,u,p),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class AE extends On{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class CE{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=RE.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function RE(){this._document.hidden===!1&&this.reset()}class PE{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,Le("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const n=performance.now();e=(n-this.oldTime)/1e3,this.oldTime=n,this.elapsedTime+=e}return e}}class Dm{constructor(e=1,n=0,i=0){this.radius=e,this.phi=n,this.theta=i}set(e,n,i){return this.radius=e,this.phi=n,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Xe(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,n,i){return this.radius=Math.sqrt(e*e+n*n+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Xe(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Rh=class Rh{constructor(e,n,i,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,n,i,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,n=0){for(let i=0;i<4;i++)this.elements[i]=e[i+n];return this}set(e,n,i,r){const s=this.elements;return s[0]=e,s[2]=n,s[1]=i,s[3]=r,this}};Rh.prototype.isMatrix2=!0;let Lm=Rh;class NE extends xr{constructor(e,n=null){super(),this.object=e,this.domElement=n,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Le("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Im(t,e,n,i){const r=DE(i);switch(n){case Y_:return t*e;case K_:return t*e/r.components*r.byteLength;case mh:return t*e/r.components*r.byteLength;case Hr:return t*e*2/r.components*r.byteLength;case gh:return t*e*2/r.components*r.byteLength;case q_:return t*e*3/r.components*r.byteLength;case Zn:return t*e*4/r.components*r.byteLength;case _h:return t*e*4/r.components*r.byteLength;case ul:case fl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case dl:case hl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Ff:case kf:return Math.max(t,16)*Math.max(e,8)/4;case Uf:case Of:return Math.max(t,8)*Math.max(e,8)/2;case Bf:case zf:case Hf:case Gf:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Vf:case Wl:case Wf:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Xf:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case jf:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case $f:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case Yf:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case qf:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case Kf:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Zf:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case Qf:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Jf:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case ed:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case td:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case nd:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case id:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case rd:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case sd:case ad:case od:return Math.ceil(t/4)*Math.ceil(e/4)*16;case ld:case cd:return Math.ceil(t/4)*Math.ceil(e/4)*8;case Xl:case ud:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function DE(t){switch(t){case kn:case W_:return{byteLength:1,components:1};case ja:case X_:case Cn:return{byteLength:2,components:1};case hh:case ph:return{byteLength:2,components:4};case _i:case dh:case fi:return{byteLength:4,components:1};case j_:case $_:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${t}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:uh}}));typeof window<"u"&&(window.__THREE__?Le("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=uh);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function lv(){let t=null,e=!1,n=null,i=null;function r(s,a){n(s,a),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&t!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t!==null&&t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function LE(t){const e=new WeakMap;function n(o,l){const c=o.array,d=o.usage,h=c.byteLength,u=t.createBuffer();t.bindBuffer(l,u),t.bufferData(l,c,d),o.onUploadCallback();let p;if(c instanceof Float32Array)p=t.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=t.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=t.HALF_FLOAT:p=t.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=t.SHORT;else if(c instanceof Uint32Array)p=t.UNSIGNED_INT;else if(c instanceof Int32Array)p=t.INT;else if(c instanceof Int8Array)p=t.BYTE;else if(c instanceof Uint8Array)p=t.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function i(o,l,c){const d=l.array,h=l.updateRanges;if(t.bindBuffer(c,o),h.length===0)t.bufferSubData(c,0,d);else{h.sort((p,m)=>p.start-m.start);let u=0;for(let p=1;p<h.length;p++){const m=h[u],E=h[p];E.start<=m.start+m.count+1?m.count=Math.max(m.count,E.start+E.count-m.start):(++u,h[u]=E)}h.length=u+1;for(let p=0,m=h.length;p<m;p++){const E=h[p];t.bufferSubData(c,E.start*d.BYTES_PER_ELEMENT,d,E.start,E.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(t.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,n(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}var IE=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,UE=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,FE=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,OE=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,kE=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,BE=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,zE=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,VE=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,HE=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,GE=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,WE=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,XE=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,jE=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,$E=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,YE=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,qE=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,KE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ZE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,QE=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,JE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,e1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,t1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,n1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,i1=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,r1=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,s1=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,a1=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,o1=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,l1=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,c1=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,u1="gl_FragColor = linearToOutputTexel( gl_FragColor );",f1=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,d1=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,h1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,p1=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,m1=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,g1=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,_1=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,v1=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,x1=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,y1=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,S1=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,M1=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,E1=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,T1=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,w1=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,b1=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,A1=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,C1=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,R1=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,P1=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,N1=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,D1=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,L1=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,I1=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,U1=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,F1=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,O1=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,k1=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,B1=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,z1=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,V1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,H1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,G1=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,W1=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,X1=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,j1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,$1=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Y1=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,q1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,K1=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Z1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Q1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,J1=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,eT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,tT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,nT=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,iT=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,rT=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,sT=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,aT=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,oT=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,lT=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,cT=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,uT=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,fT=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dT=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,hT=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,pT=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,mT=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,gT=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,_T=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,vT=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,xT=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,yT=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ST=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,MT=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ET=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,TT=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,wT=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,bT=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,AT=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,CT=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,RT=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,PT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,NT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,DT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,LT=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const IT=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,UT=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,FT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,OT=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,BT=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zT=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,VT=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,HT=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,GT=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,WT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,XT=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jT=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,$T=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,YT=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,qT=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,KT=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ZT=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,QT=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,JT=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ew=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,tw=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,nw=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,iw=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rw=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,sw=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,aw=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ow=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lw=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,cw=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,uw=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fw=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,dw=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,hw=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ge={alphahash_fragment:IE,alphahash_pars_fragment:UE,alphamap_fragment:FE,alphamap_pars_fragment:OE,alphatest_fragment:kE,alphatest_pars_fragment:BE,aomap_fragment:zE,aomap_pars_fragment:VE,batching_pars_vertex:HE,batching_vertex:GE,begin_vertex:WE,beginnormal_vertex:XE,bsdfs:jE,iridescence_fragment:$E,bumpmap_pars_fragment:YE,clipping_planes_fragment:qE,clipping_planes_pars_fragment:KE,clipping_planes_pars_vertex:ZE,clipping_planes_vertex:QE,color_fragment:JE,color_pars_fragment:e1,color_pars_vertex:t1,color_vertex:n1,common:i1,cube_uv_reflection_fragment:r1,defaultnormal_vertex:s1,displacementmap_pars_vertex:a1,displacementmap_vertex:o1,emissivemap_fragment:l1,emissivemap_pars_fragment:c1,colorspace_fragment:u1,colorspace_pars_fragment:f1,envmap_fragment:d1,envmap_common_pars_fragment:h1,envmap_pars_fragment:p1,envmap_pars_vertex:m1,envmap_physical_pars_fragment:b1,envmap_vertex:g1,fog_vertex:_1,fog_pars_vertex:v1,fog_fragment:x1,fog_pars_fragment:y1,gradientmap_pars_fragment:S1,lightmap_pars_fragment:M1,lights_lambert_fragment:E1,lights_lambert_pars_fragment:T1,lights_pars_begin:w1,lights_toon_fragment:A1,lights_toon_pars_fragment:C1,lights_phong_fragment:R1,lights_phong_pars_fragment:P1,lights_physical_fragment:N1,lights_physical_pars_fragment:D1,lights_fragment_begin:L1,lights_fragment_maps:I1,lights_fragment_end:U1,lightprobes_pars_fragment:F1,logdepthbuf_fragment:O1,logdepthbuf_pars_fragment:k1,logdepthbuf_pars_vertex:B1,logdepthbuf_vertex:z1,map_fragment:V1,map_pars_fragment:H1,map_particle_fragment:G1,map_particle_pars_fragment:W1,metalnessmap_fragment:X1,metalnessmap_pars_fragment:j1,morphinstance_vertex:$1,morphcolor_vertex:Y1,morphnormal_vertex:q1,morphtarget_pars_vertex:K1,morphtarget_vertex:Z1,normal_fragment_begin:Q1,normal_fragment_maps:J1,normal_pars_fragment:eT,normal_pars_vertex:tT,normal_vertex:nT,normalmap_pars_fragment:iT,clearcoat_normal_fragment_begin:rT,clearcoat_normal_fragment_maps:sT,clearcoat_pars_fragment:aT,iridescence_pars_fragment:oT,opaque_fragment:lT,packing:cT,premultiplied_alpha_fragment:uT,project_vertex:fT,dithering_fragment:dT,dithering_pars_fragment:hT,roughnessmap_fragment:pT,roughnessmap_pars_fragment:mT,shadowmap_pars_fragment:gT,shadowmap_pars_vertex:_T,shadowmap_vertex:vT,shadowmask_pars_fragment:xT,skinbase_vertex:yT,skinning_pars_vertex:ST,skinning_vertex:MT,skinnormal_vertex:ET,specularmap_fragment:TT,specularmap_pars_fragment:wT,tonemapping_fragment:bT,tonemapping_pars_fragment:AT,transmission_fragment:CT,transmission_pars_fragment:RT,uv_pars_fragment:PT,uv_pars_vertex:NT,uv_vertex:DT,worldpos_vertex:LT,background_vert:IT,background_frag:UT,backgroundCube_vert:FT,backgroundCube_frag:OT,cube_vert:kT,cube_frag:BT,depth_vert:zT,depth_frag:VT,distance_vert:HT,distance_frag:GT,equirect_vert:WT,equirect_frag:XT,linedashed_vert:jT,linedashed_frag:$T,meshbasic_vert:YT,meshbasic_frag:qT,meshlambert_vert:KT,meshlambert_frag:ZT,meshmatcap_vert:QT,meshmatcap_frag:JT,meshnormal_vert:ew,meshnormal_frag:tw,meshphong_vert:nw,meshphong_frag:iw,meshphysical_vert:rw,meshphysical_frag:sw,meshtoon_vert:aw,meshtoon_frag:ow,points_vert:lw,points_frag:cw,shadow_vert:uw,shadow_frag:fw,sprite_vert:dw,sprite_frag:hw},me={common:{diffuse:{value:new ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Fe}},envmap:{envMap:{value:null},envMapRotation:{value:new Fe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Fe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Fe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Fe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Fe},normalScale:{value:new Ne(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Fe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Fe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Fe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Fe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new V},probesMax:{value:new V},probesResolution:{value:new V}},points:{diffuse:{value:new ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0},uvTransform:{value:new Fe}},sprite:{diffuse:{value:new ze(16777215)},opacity:{value:1},center:{value:new Ne(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}}},ci={basic:{uniforms:sn([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.fog]),vertexShader:Ge.meshbasic_vert,fragmentShader:Ge.meshbasic_frag},lambert:{uniforms:sn([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new ze(0)},envMapIntensity:{value:1}}]),vertexShader:Ge.meshlambert_vert,fragmentShader:Ge.meshlambert_frag},phong:{uniforms:sn([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new ze(0)},specular:{value:new ze(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphong_vert,fragmentShader:Ge.meshphong_frag},standard:{uniforms:sn([me.common,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.roughnessmap,me.metalnessmap,me.fog,me.lights,{emissive:{value:new ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag},toon:{uniforms:sn([me.common,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.gradientmap,me.fog,me.lights,{emissive:{value:new ze(0)}}]),vertexShader:Ge.meshtoon_vert,fragmentShader:Ge.meshtoon_frag},matcap:{uniforms:sn([me.common,me.bumpmap,me.normalmap,me.displacementmap,me.fog,{matcap:{value:null}}]),vertexShader:Ge.meshmatcap_vert,fragmentShader:Ge.meshmatcap_frag},points:{uniforms:sn([me.points,me.fog]),vertexShader:Ge.points_vert,fragmentShader:Ge.points_frag},dashed:{uniforms:sn([me.common,me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ge.linedashed_vert,fragmentShader:Ge.linedashed_frag},depth:{uniforms:sn([me.common,me.displacementmap]),vertexShader:Ge.depth_vert,fragmentShader:Ge.depth_frag},normal:{uniforms:sn([me.common,me.bumpmap,me.normalmap,me.displacementmap,{opacity:{value:1}}]),vertexShader:Ge.meshnormal_vert,fragmentShader:Ge.meshnormal_frag},sprite:{uniforms:sn([me.sprite,me.fog]),vertexShader:Ge.sprite_vert,fragmentShader:Ge.sprite_frag},background:{uniforms:{uvTransform:{value:new Fe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ge.background_vert,fragmentShader:Ge.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Fe}},vertexShader:Ge.backgroundCube_vert,fragmentShader:Ge.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ge.cube_vert,fragmentShader:Ge.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ge.equirect_vert,fragmentShader:Ge.equirect_frag},distance:{uniforms:sn([me.common,me.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ge.distance_vert,fragmentShader:Ge.distance_frag},shadow:{uniforms:sn([me.lights,me.fog,{color:{value:new ze(0)},opacity:{value:1}}]),vertexShader:Ge.shadow_vert,fragmentShader:Ge.shadow_frag}};ci.physical={uniforms:sn([ci.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Fe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Fe},clearcoatNormalScale:{value:new Ne(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Fe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Fe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Fe},sheen:{value:0},sheenColor:{value:new ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Fe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Fe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Fe},transmissionSamplerSize:{value:new Ne},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Fe},attenuationDistance:{value:0},attenuationColor:{value:new ze(0)},specularColor:{value:new ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Fe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Fe},anisotropyVector:{value:new Ne},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Fe}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag};const Yo={r:0,b:0,g:0},pw=new Lt,cv=new Fe;cv.set(-1,0,0,0,1,0,0,0,1);function mw(t,e,n,i,r,s){const a=new ze(0);let o=r===!0?0:1,l,c,d=null,h=0,u=null;function p(_){let S=_.isScene===!0?_.background:null;if(S&&S.isTexture){const y=_.backgroundBlurriness>0;S=e.get(S,y)}return S}function m(_){let S=!1;const y=p(_);y===null?g(a,o):y&&y.isColor&&(g(y,1),S=!0);const b=t.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,s):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,s),(t.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function E(_,S){const y=p(S);y&&(y.isCubeTexture||y.mapping===mc)?(c===void 0&&(c=new vi(new no(1,1,1),new $t({name:"BackgroundCubeMaterial",uniforms:js(ci.backgroundCube.uniforms),vertexShader:ci.backgroundCube.vertexShader,fragmentShader:ci.backgroundCube.fragmentShader,side:xn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,w,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(pw.makeRotationFromEuler(S.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(cv),c.material.toneMapped=qe.getTransfer(y.colorSpace)!==rt,(d!==y||h!==y.version||u!==t.toneMapping)&&(c.material.needsUpdate=!0,d=y,h=y.version,u=t.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new vi(new _c(2,2),new $t({name:"BackgroundMaterial",uniforms:js(ci.background.uniforms),vertexShader:ci.background.vertexShader,fragmentShader:ci.background.fragmentShader,side:pr,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=qe.getTransfer(y.colorSpace)!==rt,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(d!==y||h!==y.version||u!==t.toneMapping)&&(l.material.needsUpdate=!0,d=y,h=y.version,u=t.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}function g(_,S){_.getRGB(Yo,av(t)),n.buffers.color.setClear(Yo.r,Yo.g,Yo.b,S,s)}function f(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(_,S=1){a.set(_),o=S,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(_){o=_,g(a,o)},render:m,addToRenderList:E,dispose:f}}function gw(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=u(null);let s=r,a=!1;function o(P,z,K,ee,O){let H=!1;const I=h(P,ee,K,z);s!==I&&(s=I,c(s.object)),H=p(P,ee,K,O),H&&m(P,ee,K,O),O!==null&&e.update(O,t.ELEMENT_ARRAY_BUFFER),(H||a)&&(a=!1,y(P,z,K,ee),O!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(O).buffer))}function l(){return t.createVertexArray()}function c(P){return t.bindVertexArray(P)}function d(P){return t.deleteVertexArray(P)}function h(P,z,K,ee){const O=ee.wireframe===!0;let H=i[z.id];H===void 0&&(H={},i[z.id]=H);const I=P.isInstancedMesh===!0?P.id:0;let L=H[I];L===void 0&&(L={},H[I]=L);let j=L[K.id];j===void 0&&(j={},L[K.id]=j);let Q=j[O];return Q===void 0&&(Q=u(l()),j[O]=Q),Q}function u(P){const z=[],K=[],ee=[];for(let O=0;O<n;O++)z[O]=0,K[O]=0,ee[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:z,enabledAttributes:K,attributeDivisors:ee,object:P,attributes:{},index:null}}function p(P,z,K,ee){const O=s.attributes,H=z.attributes;let I=0;const L=K.getAttributes();for(const j in L)if(L[j].location>=0){const ne=O[j];let le=H[j];if(le===void 0&&(j==="instanceMatrix"&&P.instanceMatrix&&(le=P.instanceMatrix),j==="instanceColor"&&P.instanceColor&&(le=P.instanceColor)),ne===void 0||ne.attribute!==le||le&&ne.data!==le.data)return!0;I++}return s.attributesNum!==I||s.index!==ee}function m(P,z,K,ee){const O={},H=z.attributes;let I=0;const L=K.getAttributes();for(const j in L)if(L[j].location>=0){let ne=H[j];ne===void 0&&(j==="instanceMatrix"&&P.instanceMatrix&&(ne=P.instanceMatrix),j==="instanceColor"&&P.instanceColor&&(ne=P.instanceColor));const le={};le.attribute=ne,ne&&ne.data&&(le.data=ne.data),O[j]=le,I++}s.attributes=O,s.attributesNum=I,s.index=ee}function E(){const P=s.newAttributes;for(let z=0,K=P.length;z<K;z++)P[z]=0}function g(P){f(P,0)}function f(P,z){const K=s.newAttributes,ee=s.enabledAttributes,O=s.attributeDivisors;K[P]=1,ee[P]===0&&(t.enableVertexAttribArray(P),ee[P]=1),O[P]!==z&&(t.vertexAttribDivisor(P,z),O[P]=z)}function _(){const P=s.newAttributes,z=s.enabledAttributes;for(let K=0,ee=z.length;K<ee;K++)z[K]!==P[K]&&(t.disableVertexAttribArray(K),z[K]=0)}function S(P,z,K,ee,O,H,I){I===!0?t.vertexAttribIPointer(P,z,K,O,H):t.vertexAttribPointer(P,z,K,ee,O,H)}function y(P,z,K,ee){E();const O=ee.attributes,H=K.getAttributes(),I=z.defaultAttributeValues;for(const L in H){const j=H[L];if(j.location>=0){let Q=O[L];if(Q===void 0&&(L==="instanceMatrix"&&P.instanceMatrix&&(Q=P.instanceMatrix),L==="instanceColor"&&P.instanceColor&&(Q=P.instanceColor)),Q!==void 0){const ne=Q.normalized,le=Q.itemSize,Oe=e.get(Q);if(Oe===void 0)continue;const ke=Oe.buffer,He=Oe.type,Z=Oe.bytesPerElement,se=He===t.INT||He===t.UNSIGNED_INT||Q.gpuType===dh;if(Q.isInterleavedBufferAttribute){const ie=Q.data,De=ie.stride,Ue=Q.offset;if(ie.isInstancedInterleavedBuffer){for(let Pe=0;Pe<j.locationSize;Pe++)f(j.location+Pe,ie.meshPerAttribute);P.isInstancedMesh!==!0&&ee._maxInstanceCount===void 0&&(ee._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let Pe=0;Pe<j.locationSize;Pe++)g(j.location+Pe);t.bindBuffer(t.ARRAY_BUFFER,ke);for(let Pe=0;Pe<j.locationSize;Pe++)S(j.location+Pe,le/j.locationSize,He,ne,De*Z,(Ue+le/j.locationSize*Pe)*Z,se)}else{if(Q.isInstancedBufferAttribute){for(let ie=0;ie<j.locationSize;ie++)f(j.location+ie,Q.meshPerAttribute);P.isInstancedMesh!==!0&&ee._maxInstanceCount===void 0&&(ee._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let ie=0;ie<j.locationSize;ie++)g(j.location+ie);t.bindBuffer(t.ARRAY_BUFFER,ke);for(let ie=0;ie<j.locationSize;ie++)S(j.location+ie,le/j.locationSize,He,ne,le*Z,le/j.locationSize*ie*Z,se)}}else if(I!==void 0){const ne=I[L];if(ne!==void 0)switch(ne.length){case 2:t.vertexAttrib2fv(j.location,ne);break;case 3:t.vertexAttrib3fv(j.location,ne);break;case 4:t.vertexAttrib4fv(j.location,ne);break;default:t.vertexAttrib1fv(j.location,ne)}}}}_()}function b(){C();for(const P in i){const z=i[P];for(const K in z){const ee=z[K];for(const O in ee){const H=ee[O];for(const I in H)d(H[I].object),delete H[I];delete ee[O]}}delete i[P]}}function w(P){if(i[P.id]===void 0)return;const z=i[P.id];for(const K in z){const ee=z[K];for(const O in ee){const H=ee[O];for(const I in H)d(H[I].object),delete H[I];delete ee[O]}}delete i[P.id]}function A(P){for(const z in i){const K=i[z];for(const ee in K){const O=K[ee];if(O[P.id]===void 0)continue;const H=O[P.id];for(const I in H)d(H[I].object),delete H[I];delete O[P.id]}}}function x(P){for(const z in i){const K=i[z],ee=P.isInstancedMesh===!0?P.id:0,O=K[ee];if(O!==void 0){for(const H in O){const I=O[H];for(const L in I)d(I[L].object),delete I[L];delete O[H]}delete K[ee],Object.keys(K).length===0&&delete i[z]}}}function C(){N(),a=!0,s!==r&&(s=r,c(s.object))}function N(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:C,resetDefaultState:N,dispose:b,releaseStatesOfGeometry:w,releaseStatesOfObject:x,releaseStatesOfProgram:A,initAttributes:E,enableAttribute:g,disableUnusedAttributes:_}}function _w(t,e,n){let i;function r(l){i=l}function s(l,c){t.drawArrays(i,l,c),n.update(c,i,1)}function a(l,c,d){d!==0&&(t.drawArraysInstanced(i,l,c,d),n.update(c,i,d))}function o(l,c,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,d);let u=0;for(let p=0;p<d;p++)u+=c[p];n.update(u,i,1)}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o}function vw(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(A){return!(A!==Zn&&i.convert(A)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const x=A===Cn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==kn&&i.convert(A)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==fi&&!x)}function l(A){if(A==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp";const d=l(c);d!==c&&(Le("WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const h=n.logarithmicDepthBuffer===!0,u=n.reversedDepthBuffer===!0&&e.has("EXT_clip_control");n.reversedDepthBuffer===!0&&u===!1&&Le("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const p=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),m=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),E=t.getParameter(t.MAX_TEXTURE_SIZE),g=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),f=t.getParameter(t.MAX_VERTEX_ATTRIBS),_=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),S=t.getParameter(t.MAX_VARYING_VECTORS),y=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),b=t.getParameter(t.MAX_SAMPLES),w=t.getParameter(t.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:u,maxTextures:p,maxVertexTextures:m,maxTextureSize:E,maxCubemapSize:g,maxAttributes:f,maxVertexUniforms:_,maxVaryings:S,maxFragmentUniforms:y,maxSamples:b,samples:w}}function xw(t){const e=this;let n=null,i=0,r=!1,s=!1;const a=new Zi,o=new Fe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,u){const p=h.length!==0||u||i!==0||r;return r=u,i=h.length,p},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,u){n=d(h,u,0)},this.setState=function(h,u,p){const m=h.clippingPlanes,E=h.clipIntersection,g=h.clipShadows,f=t.get(h);if(!r||m===null||m.length===0||s&&!g)s?d(null):c();else{const _=s?0:i,S=_*4;let y=f.clippingState||null;l.value=y,y=d(m,u,S,p);for(let b=0;b!==S;++b)y[b]=n[b];f.clippingState=y,this.numIntersection=E?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(h,u,p,m){const E=h!==null?h.length:0;let g=null;if(E!==0){if(g=l.value,m!==!0||g===null){const f=p+E*4,_=u.matrixWorldInverse;o.getNormalMatrix(_),(g===null||g.length<f)&&(g=new Float32Array(f));for(let S=0,y=p;S!==E;++S,y+=4)a.copy(h[S]).applyMatrix4(_,o),a.normal.toArray(g,y),g[y+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=E,e.numIntersection=0,g}}const ir=4,Um=[.125,.215,.35,.446,.526,.582],Cr=20,yw=256,fa=new Eh,Fm=new ze;let Su=null,Mu=0,Eu=0,Tu=!1;const Sw=new V;class Om{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,n=0,i=.1,r=100,s={}){const{size:a=256,position:o=Sw}=s;Su=this._renderer.getRenderTarget(),Mu=this._renderer.getActiveCubeFace(),Eu=this._renderer.getActiveMipmapLevel(),Tu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,o),n>0&&this._blur(l,0,0,n),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=zm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Bm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Su,Mu,Eu),this._renderer.xr.enabled=Tu,e.scissorTest=!1,cs(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===Vr||e.mapping===Ws?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Su=this._renderer.getRenderTarget(),Mu=this._renderer.getActiveCubeFace(),Eu=this._renderer.getActiveMipmapLevel(),Tu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:nn,minFilter:nn,generateMipmaps:!1,type:Cn,format:Zn,colorSpace:jl,depthBuffer:!1},r=km(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=km(e,n,i);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Mw(s)),this._blurMaterial=Tw(s,e,n),this._ggxMaterial=Ew(s,e,n)}return r}_compileMaterial(e){const n=new vi(new on,e);this._renderer.compile(n,fa)}_sceneToCubeUV(e,n,i,r,s){const l=new On(90,1,n,i),c=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,p=h.toneMapping;h.getClearColor(Fm),h.toneMapping=gi,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(r),h.clearDepth(),h.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new vi(new no,new Mh({name:"PMREM.Background",side:xn,depthWrite:!1,depthTest:!1})));const E=this._backgroundBox,g=E.material;let f=!1;const _=e.background;_?_.isColor&&(g.color.copy(_),e.background=null,f=!0):(g.color.copy(Fm),f=!0);for(let S=0;S<6;S++){const y=S%3;y===0?(l.up.set(0,c[S],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+d[S],s.y,s.z)):y===1?(l.up.set(0,0,c[S]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+d[S],s.z)):(l.up.set(0,c[S],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+d[S]));const b=this._cubeSize;cs(r,y*b,S>2?b:0,b,b),h.setRenderTarget(r),f&&h.render(E,l),h.render(e,l)}h.toneMapping=p,h.autoClear=u,e.background=_}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===Vr||e.mapping===Ws;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=zm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Bm());const s=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;const o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;cs(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(a,fa)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);n.autoClear=i}_applyGGXFilter(e,n,i){const r=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const l=a.uniforms,c=i/(this._lodMeshes.length-1),d=n/(this._lodMeshes.length-1),h=Math.sqrt(c*c-d*d),u=0+c*1.25,p=h*u,{_lodMax:m}=this,E=this._sizeLods[i],g=3*E*(i>m-ir?i-m+ir:0),f=4*(this._cubeSize-E);l.envMap.value=e.texture,l.roughness.value=p,l.mipInt.value=m-n,cs(s,g,f,3*E,2*E),r.setRenderTarget(s),r.render(o,fa),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=m-i,cs(e,g,f,3*E,2*E),r.setRenderTarget(e),r.render(o,fa)}_blur(e,n,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,n,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Qe("blur direction must be either latitudinal or longitudinal!");const d=3,h=this._lodMeshes[r];h.material=c;const u=c.uniforms,p=this._sizeLods[i]-1,m=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Cr-1),E=s/m,g=isFinite(s)?1+Math.floor(d*E):Cr;g>Cr&&Le(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Cr}`);const f=[];let _=0;for(let A=0;A<Cr;++A){const x=A/E,C=Math.exp(-x*x/2);f.push(C),A===0?_+=C:A<g&&(_+=2*C)}for(let A=0;A<f.length;A++)f[A]=f[A]/_;u.envMap.value=e.texture,u.samples.value=g,u.weights.value=f,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:S}=this;u.dTheta.value=m,u.mipInt.value=S-i;const y=this._sizeLods[r],b=3*y*(r>S-ir?r-S+ir:0),w=4*(this._cubeSize-y);cs(n,b,w,3*y,2*y),l.setRenderTarget(n),l.render(h,fa)}}function Mw(t){const e=[],n=[],i=[];let r=t;const s=t-ir+1+Um.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);e.push(o);let l=1/o;a>t-ir?l=Um[a-t+ir-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),d=-c,h=1+c,u=[d,d,h,d,h,h,d,d,h,h,d,h],p=6,m=6,E=3,g=2,f=1,_=new Float32Array(E*m*p),S=new Float32Array(g*m*p),y=new Float32Array(f*m*p);for(let w=0;w<p;w++){const A=w%3*2/3-1,x=w>2?0:-1,C=[A,x,0,A+2/3,x,0,A+2/3,x+1,0,A,x,0,A+2/3,x+1,0,A,x+1,0];_.set(C,E*m*w),S.set(u,g*m*w);const N=[w,w,w,w,w,w];y.set(N,f*m*w)}const b=new on;b.setAttribute("position",new mt(_,E)),b.setAttribute("uv",new mt(S,g)),b.setAttribute("faceIndex",new mt(y,f)),i.push(new vi(b,null)),r>ir&&r--}return{lodMeshes:i,sizeLods:e,sigmas:n}}function km(t,e,n){const i=new yn(t,e,n);return i.texture.mapping=mc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function cs(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function Ew(t,e,n){return new $t({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:yw,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:vc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:mi,depthTest:!1,depthWrite:!1})}function Tw(t,e,n){const i=new Float32Array(Cr),r=new V(0,1,0);return new $t({name:"SphericalGaussianBlur",defines:{n:Cr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:vc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:mi,depthTest:!1,depthWrite:!1})}function Bm(){return new $t({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:vc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:mi,depthTest:!1,depthWrite:!1})}function zm(){return new $t({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:vc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:mi,depthTest:!1,depthWrite:!1})}function vc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class uv extends yn{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new rv(r),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new no(5,5,5),s=new $t({name:"CubemapFromEquirect",uniforms:js(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:xn,blending:mi});s.uniforms.tEquirect.value=n;const a=new vi(r,s),o=n.minFilter;return n.minFilter===Dr&&(n.minFilter=nn),new bE(1,10,this).update(e,a),n.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,n=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(n,i,r);e.setRenderTarget(s)}}function ww(t){let e=new WeakMap,n=new WeakMap,i=null;function r(u,p=!1){return u==null?null:p?a(u):s(u)}function s(u){if(u&&u.isTexture){const p=u.mapping;if(p===qc||p===Kc)if(e.has(u)){const m=e.get(u).texture;return o(m,u.mapping)}else{const m=u.image;if(m&&m.height>0){const E=new uv(m.height);return E.fromEquirectangularTexture(t,u),e.set(u,E),u.addEventListener("dispose",c),o(E.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){const p=u.mapping,m=p===qc||p===Kc,E=p===Vr||p===Ws;if(m||E){let g=n.get(u);const f=g!==void 0?g.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==f)return i===null&&(i=new Om(t)),g=m?i.fromEquirectangular(u,g):i.fromCubemap(u,g),g.texture.pmremVersion=u.pmremVersion,n.set(u,g),g.texture;if(g!==void 0)return g.texture;{const _=u.image;return m&&_&&_.height>0||E&&_&&l(_)?(i===null&&(i=new Om(t)),g=m?i.fromEquirectangular(u):i.fromCubemap(u),g.texture.pmremVersion=u.pmremVersion,n.set(u,g),u.addEventListener("dispose",d),g.texture):null}}}return u}function o(u,p){return p===qc?u.mapping=Vr:p===Kc&&(u.mapping=Ws),u}function l(u){let p=0;const m=6;for(let E=0;E<m;E++)u[E]!==void 0&&p++;return p===m}function c(u){const p=u.target;p.removeEventListener("dispose",c);const m=e.get(p);m!==void 0&&(e.delete(p),m.dispose())}function d(u){const p=u.target;p.removeEventListener("dispose",d);const m=n.get(p);m!==void 0&&(n.delete(p),m.dispose())}function h(){e=new WeakMap,n=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:h}}function bw(t){const e={};function n(i){if(e[i]!==void 0)return e[i];const r=t.getExtension(i);return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&Ds("WebGLRenderer: "+i+" extension not supported."),r}}}function Aw(t,e,n,i){const r={},s=new WeakMap;function a(h){const u=h.target;u.index!==null&&e.remove(u.index);for(const m in u.attributes)e.remove(u.attributes[m]);u.removeEventListener("dispose",a),delete r[u.id];const p=s.get(u);p&&(e.remove(p),s.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,n.memory.geometries--}function o(h,u){return r[u.id]===!0||(u.addEventListener("dispose",a),r[u.id]=!0,n.memory.geometries++),u}function l(h){const u=h.attributes;for(const p in u)e.update(u[p],t.ARRAY_BUFFER)}function c(h){const u=[],p=h.index,m=h.attributes.position;let E=0;if(m===void 0)return;if(p!==null){const _=p.array;E=p.version;for(let S=0,y=_.length;S<y;S+=3){const b=_[S+0],w=_[S+1],A=_[S+2];u.push(b,w,w,A,A,b)}}else{const _=m.array;E=m.version;for(let S=0,y=_.length/3-1;S<y;S+=3){const b=S+0,w=S+1,A=S+2;u.push(b,w,w,A,A,b)}}const g=new(m.count>=65535?nv:tv)(u,1);g.version=E;const f=s.get(h);f&&e.remove(f),s.set(h,g)}function d(h){const u=s.get(h);if(u){const p=h.index;p!==null&&u.version<p.version&&c(h)}else c(h);return s.get(h)}return{get:o,update:l,getWireframeAttribute:d}}function Cw(t,e,n){let i;function r(h){i=h}let s,a;function o(h){s=h.type,a=h.bytesPerElement}function l(h,u){t.drawElements(i,u,s,h*a),n.update(u,i,1)}function c(h,u,p){p!==0&&(t.drawElementsInstanced(i,u,s,h*a,p),n.update(u,i,p))}function d(h,u,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,s,h,0,p);let E=0;for(let g=0;g<p;g++)E+=u[g];n.update(E,i,1)}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d}function Rw(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(n.calls++,a){case t.TRIANGLES:n.triangles+=o*(s/3);break;case t.LINES:n.lines+=o*(s/2);break;case t.LINE_STRIP:n.lines+=o*(s-1);break;case t.LINE_LOOP:n.lines+=o*s;break;case t.POINTS:n.points+=o*s;break;default:Qe("WebGLInfo: Unknown draw mode:",a);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function Pw(t,e,n){const i=new WeakMap,r=new Ct;function s(a,o,l){const c=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=d!==void 0?d.length:0;let u=i.get(o);if(u===void 0||u.count!==h){let N=function(){x.dispose(),i.delete(o),o.removeEventListener("dispose",N)};var p=N;u!==void 0&&u.texture.dispose();const m=o.morphAttributes.position!==void 0,E=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],_=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let y=0;m===!0&&(y=1),E===!0&&(y=2),g===!0&&(y=3);let b=o.attributes.position.count*y,w=1;b>e.maxTextureSize&&(w=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const A=new Float32Array(b*w*4*h),x=new Q_(A,b,w,h);x.type=fi,x.needsUpdate=!0;const C=y*4;for(let P=0;P<h;P++){const z=f[P],K=_[P],ee=S[P],O=b*w*4*P;for(let H=0;H<z.count;H++){const I=H*C;m===!0&&(r.fromBufferAttribute(z,H),A[O+I+0]=r.x,A[O+I+1]=r.y,A[O+I+2]=r.z,A[O+I+3]=0),E===!0&&(r.fromBufferAttribute(K,H),A[O+I+4]=r.x,A[O+I+5]=r.y,A[O+I+6]=r.z,A[O+I+7]=0),g===!0&&(r.fromBufferAttribute(ee,H),A[O+I+8]=r.x,A[O+I+9]=r.y,A[O+I+10]=r.z,A[O+I+11]=ee.itemSize===4?r.w:1)}}u={count:h,texture:x,size:new Ne(b,w)},i.set(o,u),o.addEventListener("dispose",N)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",a.morphTexture,n);else{let m=0;for(let g=0;g<c.length;g++)m+=c[g];const E=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(t,"morphTargetBaseInfluence",E),l.getUniforms().setValue(t,"morphTargetInfluences",c)}l.getUniforms().setValue(t,"morphTargetsTexture",u.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",u.size)}return{update:s}}function Nw(t,e,n,i,r){let s=new WeakMap;function a(c){const d=r.render.frame,h=c.geometry,u=e.get(c,h);if(s.get(u)!==d&&(e.update(u),s.set(u,d)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==d&&(n.update(c.instanceMatrix,t.ARRAY_BUFFER),c.instanceColor!==null&&n.update(c.instanceColor,t.ARRAY_BUFFER),s.set(c,d))),c.isSkinnedMesh){const p=c.skeleton;s.get(p)!==d&&(p.update(),s.set(p,d))}return u}function o(){s=new WeakMap}function l(c){const d=c.target;d.removeEventListener("dispose",l),i.releaseStatesOfObject(d),n.remove(d.instanceMatrix),d.instanceColor!==null&&n.remove(d.instanceColor)}return{update:a,dispose:o}}const Dw={[O_]:"LINEAR_TONE_MAPPING",[k_]:"REINHARD_TONE_MAPPING",[B_]:"CINEON_TONE_MAPPING",[fh]:"ACES_FILMIC_TONE_MAPPING",[V_]:"AGX_TONE_MAPPING",[H_]:"NEUTRAL_TONE_MAPPING",[z_]:"CUSTOM_TONE_MAPPING"};function Lw(t,e,n,i,r,s){const a=new yn(e,n,{type:t,depthBuffer:r,stencilBuffer:s,samples:i?4:0,depthTexture:r?new Xs(e,n):void 0}),o=new yn(e,n,{type:Cn,depthBuffer:!1,stencilBuffer:!1}),l=new on;l.setAttribute("position",new ei([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new ei([0,2,0,0,2,0],2));const c=new EE({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new vi(l,c),h=new Eh(-1,1,1,-1,0,1);let u=null,p=null,m=!1,E,g=null,f=[],_=!1;this.setSize=function(S,y){a.setSize(S,y),o.setSize(S,y);for(let b=0;b<f.length;b++){const w=f[b];w.setSize&&w.setSize(S,y)}},this.setEffects=function(S){f=S,_=f.length>0&&f[0].isRenderPass===!0;const y=a.width,b=a.height;for(let w=0;w<f.length;w++){const A=f[w];A.setSize&&A.setSize(y,b)}},this.begin=function(S,y){if(m||S.toneMapping===gi&&f.length===0)return!1;if(g=y,y!==null){const b=y.width,w=y.height;(a.width!==b||a.height!==w)&&this.setSize(b,w)}return _===!1&&S.setRenderTarget(a),E=S.toneMapping,S.toneMapping=gi,!0},this.hasRenderPass=function(){return _},this.end=function(S,y){S.toneMapping=E,m=!0;let b=a,w=o;for(let A=0;A<f.length;A++){const x=f[A];if(x.enabled!==!1&&(x.render(S,w,b,y),x.needsSwap!==!1)){const C=b;b=w,w=C}}if(u!==S.outputColorSpace||p!==S.toneMapping){u=S.outputColorSpace,p=S.toneMapping,c.defines={},qe.getTransfer(u)===rt&&(c.defines.SRGB_TRANSFER="");const A=Dw[p];A&&(c.defines[A]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=b.texture,S.setRenderTarget(g),S.render(d,h),g=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose()}}const fv=new cn,hd=new Xs(1,1),dv=new Q_,hv=new eE,pv=new rv,Vm=[],Hm=[],Gm=new Float32Array(16),Wm=new Float32Array(9),Xm=new Float32Array(4);function Zs(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=Vm[r];if(s===void 0&&(s=new Float32Array(r),Vm[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=n,t[a].toArray(s,o)}return s}function Bt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function zt(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function xc(t,e){let n=Hm[e];n===void 0&&(n=new Int32Array(e),Hm[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function Iw(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function Uw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Bt(n,e))return;t.uniform2fv(this.addr,e),zt(n,e)}}function Fw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Bt(n,e))return;t.uniform3fv(this.addr,e),zt(n,e)}}function Ow(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Bt(n,e))return;t.uniform4fv(this.addr,e),zt(n,e)}}function kw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Bt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),zt(n,e)}else{if(Bt(n,i))return;Xm.set(i),t.uniformMatrix2fv(this.addr,!1,Xm),zt(n,i)}}function Bw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Bt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),zt(n,e)}else{if(Bt(n,i))return;Wm.set(i),t.uniformMatrix3fv(this.addr,!1,Wm),zt(n,i)}}function zw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Bt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),zt(n,e)}else{if(Bt(n,i))return;Gm.set(i),t.uniformMatrix4fv(this.addr,!1,Gm),zt(n,i)}}function Vw(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function Hw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Bt(n,e))return;t.uniform2iv(this.addr,e),zt(n,e)}}function Gw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Bt(n,e))return;t.uniform3iv(this.addr,e),zt(n,e)}}function Ww(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Bt(n,e))return;t.uniform4iv(this.addr,e),zt(n,e)}}function Xw(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function jw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Bt(n,e))return;t.uniform2uiv(this.addr,e),zt(n,e)}}function $w(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Bt(n,e))return;t.uniform3uiv(this.addr,e),zt(n,e)}}function Yw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Bt(n,e))return;t.uniform4uiv(this.addr,e),zt(n,e)}}function qw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(hd.compareFunction=n.isReversedDepthBuffer()?xh:vh,s=hd):s=fv,n.setTexture2D(e||s,r)}function Kw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||hv,r)}function Zw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||pv,r)}function Qw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||dv,r)}function Jw(t){switch(t){case 5126:return Iw;case 35664:return Uw;case 35665:return Fw;case 35666:return Ow;case 35674:return kw;case 35675:return Bw;case 35676:return zw;case 5124:case 35670:return Vw;case 35667:case 35671:return Hw;case 35668:case 35672:return Gw;case 35669:case 35673:return Ww;case 5125:return Xw;case 36294:return jw;case 36295:return $w;case 36296:return Yw;case 35678:case 36198:case 36298:case 36306:case 35682:return qw;case 35679:case 36299:case 36307:return Kw;case 35680:case 36300:case 36308:case 36293:return Zw;case 36289:case 36303:case 36311:case 36292:return Qw}}function eb(t,e){t.uniform1fv(this.addr,e)}function tb(t,e){const n=Zs(e,this.size,2);t.uniform2fv(this.addr,n)}function nb(t,e){const n=Zs(e,this.size,3);t.uniform3fv(this.addr,n)}function ib(t,e){const n=Zs(e,this.size,4);t.uniform4fv(this.addr,n)}function rb(t,e){const n=Zs(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function sb(t,e){const n=Zs(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function ab(t,e){const n=Zs(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function ob(t,e){t.uniform1iv(this.addr,e)}function lb(t,e){t.uniform2iv(this.addr,e)}function cb(t,e){t.uniform3iv(this.addr,e)}function ub(t,e){t.uniform4iv(this.addr,e)}function fb(t,e){t.uniform1uiv(this.addr,e)}function db(t,e){t.uniform2uiv(this.addr,e)}function hb(t,e){t.uniform3uiv(this.addr,e)}function pb(t,e){t.uniform4uiv(this.addr,e)}function mb(t,e,n){const i=this.cache,r=e.length,s=xc(n,r);Bt(i,s)||(t.uniform1iv(this.addr,s),zt(i,s));let a;this.type===t.SAMPLER_2D_SHADOW?a=hd:a=fv;for(let o=0;o!==r;++o)n.setTexture2D(e[o]||a,s[o])}function gb(t,e,n){const i=this.cache,r=e.length,s=xc(n,r);Bt(i,s)||(t.uniform1iv(this.addr,s),zt(i,s));for(let a=0;a!==r;++a)n.setTexture3D(e[a]||hv,s[a])}function _b(t,e,n){const i=this.cache,r=e.length,s=xc(n,r);Bt(i,s)||(t.uniform1iv(this.addr,s),zt(i,s));for(let a=0;a!==r;++a)n.setTextureCube(e[a]||pv,s[a])}function vb(t,e,n){const i=this.cache,r=e.length,s=xc(n,r);Bt(i,s)||(t.uniform1iv(this.addr,s),zt(i,s));for(let a=0;a!==r;++a)n.setTexture2DArray(e[a]||dv,s[a])}function xb(t){switch(t){case 5126:return eb;case 35664:return tb;case 35665:return nb;case 35666:return ib;case 35674:return rb;case 35675:return sb;case 35676:return ab;case 5124:case 35670:return ob;case 35667:case 35671:return lb;case 35668:case 35672:return cb;case 35669:case 35673:return ub;case 5125:return fb;case 36294:return db;case 36295:return hb;case 36296:return pb;case 35678:case 36198:case 36298:case 36306:case 35682:return mb;case 35679:case 36299:case 36307:return gb;case 35680:case 36300:case 36308:case 36293:return _b;case 36289:case 36303:case 36311:case 36292:return vb}}class yb{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=Jw(n.type)}}class Sb{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=xb(n.type)}}class Mb{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,n[o.id],i)}}}const wu=/(\w+)(\])?(\[|\.)?/g;function jm(t,e){t.seq.push(e),t.map[e.id]=e}function Eb(t,e,n){const i=t.name,r=i.length;for(wu.lastIndex=0;;){const s=wu.exec(i),a=wu.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){jm(n,c===void 0?new yb(o,t,e):new Sb(o,t,e));break}else{let h=n.map[o];h===void 0&&(h=new Mb(o),jm(n,h)),n=h}}}class ml{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(n,a),l=e.getUniformLocation(n,o.name);Eb(o,l,this)}const r=[],s=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(a):s.push(a);r.length>0&&(this.seq=r.concat(s))}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,a=n.length;s!==a;++s){const o=n[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in n&&i.push(a)}return i}}function $m(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const Tb=37297;let wb=0;function bb(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}const Ym=new Fe;function Ab(t){qe._getMatrix(Ym,qe.workingColorSpace,t);const e=`mat3( ${Ym.elements.map(n=>n.toFixed(4))} )`;switch(qe.getTransfer(t)){case $l:return[e,"LinearTransferOETF"];case rt:return[e,"sRGBTransferOETF"];default:return Le("WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function qm(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),s=(t.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return n.toUpperCase()+`

`+s+`

`+bb(t.getShaderSource(e),o)}else return s}function Cb(t,e){const n=Ab(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}const Rb={[O_]:"Linear",[k_]:"Reinhard",[B_]:"Cineon",[fh]:"ACESFilmic",[V_]:"AgX",[H_]:"Neutral",[z_]:"Custom"};function Pb(t,e){const n=Rb[e];return n===void 0?(Le("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+t+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const qo=new V;function Nb(){qe.getLuminanceCoefficients(qo);const t=qo.x.toFixed(4),e=qo.y.toFixed(4),n=qo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Db(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(xa).join(`
`)}function Lb(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function Ib(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),a=s.name;let o=1;s.type===t.FLOAT_MAT2&&(o=2),s.type===t.FLOAT_MAT3&&(o=3),s.type===t.FLOAT_MAT4&&(o=4),n[a]={type:s.type,location:t.getAttribLocation(e,a),locationSize:o}}return n}function xa(t){return t!==""}function Km(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Zm(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Ub=/^[ \t]*#include +<([\w\d./]+)>/gm;function pd(t){return t.replace(Ub,Ob)}const Fb=new Map;function Ob(t,e){let n=Ge[e];if(n===void 0){const i=Fb.get(e);if(i!==void 0)n=Ge[i],Le('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return pd(n)}const kb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Qm(t){return t.replace(kb,Bb)}function Bb(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Jm(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const zb={[cl]:"SHADOWMAP_TYPE_PCF",[_a]:"SHADOWMAP_TYPE_VSM"};function Vb(t){return zb[t.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Hb={[Vr]:"ENVMAP_TYPE_CUBE",[Ws]:"ENVMAP_TYPE_CUBE",[mc]:"ENVMAP_TYPE_CUBE_UV"};function Gb(t){return t.envMap===!1?"ENVMAP_TYPE_CUBE":Hb[t.envMapMode]||"ENVMAP_TYPE_CUBE"}const Wb={[Ws]:"ENVMAP_MODE_REFRACTION"};function Xb(t){return t.envMap===!1?"ENVMAP_MODE_REFLECTION":Wb[t.envMapMode]||"ENVMAP_MODE_REFLECTION"}const jb={[F_]:"ENVMAP_BLENDING_MULTIPLY",[DM]:"ENVMAP_BLENDING_MIX",[LM]:"ENVMAP_BLENDING_ADD"};function $b(t){return t.envMap===!1?"ENVMAP_BLENDING_NONE":jb[t.combine]||"ENVMAP_BLENDING_NONE"}function Yb(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function qb(t,e,n,i){const r=t.getContext(),s=n.defines;let a=n.vertexShader,o=n.fragmentShader;const l=Vb(n),c=Gb(n),d=Xb(n),h=$b(n),u=Yb(n),p=Db(n),m=Lb(s),E=r.createProgram();let g,f,_=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(g=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m].filter(xa).join(`
`),g.length>0&&(g+=`
`),f=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m].filter(xa).join(`
`),f.length>0&&(f+=`
`)):(g=[Jm(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+d:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(xa).join(`
`),f=[Jm(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,m,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+d:"",n.envMap?"#define "+h:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==gi?"#define TONE_MAPPING":"",n.toneMapping!==gi?Ge.tonemapping_pars_fragment:"",n.toneMapping!==gi?Pb("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Ge.colorspace_pars_fragment,Cb("linearToOutputTexel",n.outputColorSpace),Nb(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(xa).join(`
`)),a=pd(a),a=Km(a,n),a=Zm(a,n),o=pd(o),o=Km(o,n),o=Zm(o,n),a=Qm(a),o=Qm(o),n.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,g=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,f=["#define varying in",n.glslVersion===um?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===um?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const S=_+g+a,y=_+f+o,b=$m(r,r.VERTEX_SHADER,S),w=$m(r,r.FRAGMENT_SHADER,y);r.attachShader(E,b),r.attachShader(E,w),n.index0AttributeName!==void 0?r.bindAttribLocation(E,0,n.index0AttributeName):n.hasPositionAttribute===!0&&r.bindAttribLocation(E,0,"position"),r.linkProgram(E);function A(P){if(t.debug.checkShaderErrors){const z=r.getProgramInfoLog(E)||"",K=r.getShaderInfoLog(b)||"",ee=r.getShaderInfoLog(w)||"",O=z.trim(),H=K.trim(),I=ee.trim();let L=!0,j=!0;if(r.getProgramParameter(E,r.LINK_STATUS)===!1)if(L=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,E,b,w);else{const Q=qm(r,b,"vertex"),ne=qm(r,w,"fragment");Qe("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(E,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+O+`
`+Q+`
`+ne)}else O!==""?Le("WebGLProgram: Program Info Log:",O):(H===""||I==="")&&(j=!1);j&&(P.diagnostics={runnable:L,programLog:O,vertexShader:{log:H,prefix:g},fragmentShader:{log:I,prefix:f}})}r.deleteShader(b),r.deleteShader(w),x=new ml(r,E),C=Ib(r,E)}let x;this.getUniforms=function(){return x===void 0&&A(this),x};let C;this.getAttributes=function(){return C===void 0&&A(this),C};let N=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return N===!1&&(N=r.getProgramParameter(E,Tb)),N},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(E),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=wb++,this.cacheKey=e,this.usedTimes=1,this.program=E,this.vertexShader=b,this.fragmentShader=w,this}let Kb=0;class Zb{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,n,i){const r=this._getShaderCacheForMaterial(e);return r.has(n)===!1&&(r.add(n),n.usedTimes++),r.has(i)===!1&&(r.add(i),i.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new Qb(e),n.set(e,i)),i}}class Qb{constructor(e){this.id=Kb++,this.code=e,this.usedTimes=0}}function Jb(t){return t===Hr||t===Wl||t===Xl}function eA(t,e,n,i,r,s){const a=new J_,o=new Zb,l=new Set,c=[],d=new Map,h=i.logarithmicDepthBuffer;let u=i.precision;const p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(x){return l.add(x),x===0?"uv":`uv${x}`}function E(x,C,N,P,z,K){const ee=P.fog,O=z.geometry,H=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?P.environment:null,I=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,L=e.get(x.envMap||H,I),j=L&&L.mapping===mc?L.image.height:null,Q=p[x.type];x.precision!==null&&(u=i.getMaxPrecision(x.precision),u!==x.precision&&Le("WebGLProgram.getParameters:",x.precision,"not supported, using",u,"instead."));const ne=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,le=ne!==void 0?ne.length:0;let Oe=0;O.morphAttributes.position!==void 0&&(Oe=1),O.morphAttributes.normal!==void 0&&(Oe=2),O.morphAttributes.color!==void 0&&(Oe=3);let ke,He,Z,se;if(Q){const Ee=ci[Q];ke=Ee.vertexShader,He=Ee.fragmentShader}else{ke=x.vertexShader,He=x.fragmentShader;const Ee=o.getVertexShaderStage(x),ot=o.getFragmentShaderStage(x);o.update(x,Ee,ot),Z=Ee.id,se=ot.id}const ie=t.getRenderTarget(),De=t.state.buffers.depth.getReversed(),Ue=z.isInstancedMesh===!0,Pe=z.isBatchedMesh===!0,at=!!x.map,Be=!!x.matcap,et=!!L,Ke=!!x.aoMap,$e=!!x.lightMap,St=!!x.bumpMap&&x.wireframe===!1,ht=!!x.normalMap,Rt=!!x.displacementMap,xt=!!x.emissiveMap,ut=!!x.metalnessMap,Mt=!!x.roughnessMap,U=x.anisotropy>0,Wt=x.clearcoat>0,Ye=x.dispersion>0,R=x.iridescence>0,v=x.sheen>0,k=x.transmission>0,X=U&&!!x.anisotropyMap,q=Wt&&!!x.clearcoatMap,ae=Wt&&!!x.clearcoatNormalMap,de=Wt&&!!x.clearcoatRoughnessMap,B=R&&!!x.iridescenceMap,Y=R&&!!x.iridescenceThicknessMap,oe=v&&!!x.sheenColorMap,xe=v&&!!x.sheenRoughnessMap,ce=!!x.specularMap,ue=!!x.specularColorMap,be=!!x.specularIntensityMap,Re=k&&!!x.transmissionMap,Ie=k&&!!x.thicknessMap,D=!!x.gradientMap,fe=!!x.alphaMap,J=x.alphaTest>0,he=!!x.alphaHash,pe=!!x.extensions;let te=gi;x.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(te=t.toneMapping);const Te={shaderID:Q,shaderType:x.type,shaderName:x.name,vertexShader:ke,fragmentShader:He,defines:x.defines,customVertexShaderID:Z,customFragmentShaderID:se,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:u,batching:Pe,batchingColor:Pe&&z._colorsTexture!==null,instancing:Ue,instancingColor:Ue&&z.instanceColor!==null,instancingMorph:Ue&&z.morphTexture!==null,outputColorSpace:ie===null?t.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:qe.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:at,matcap:Be,envMap:et,envMapMode:et&&L.mapping,envMapCubeUVHeight:j,aoMap:Ke,lightMap:$e,bumpMap:St,normalMap:ht,displacementMap:Rt,emissiveMap:xt,normalMapObjectSpace:ht&&x.normalMapType===FM,normalMapTangentSpace:ht&&x.normalMapType===om,packedNormalMap:ht&&x.normalMapType===om&&Jb(x.normalMap.format),metalnessMap:ut,roughnessMap:Mt,anisotropy:U,anisotropyMap:X,clearcoat:Wt,clearcoatMap:q,clearcoatNormalMap:ae,clearcoatRoughnessMap:de,dispersion:Ye,iridescence:R,iridescenceMap:B,iridescenceThicknessMap:Y,sheen:v,sheenColorMap:oe,sheenRoughnessMap:xe,specularMap:ce,specularColorMap:ue,specularIntensityMap:be,transmission:k,transmissionMap:Re,thicknessMap:Ie,gradientMap:D,opaque:x.transparent===!1&&x.blending===Ns&&x.alphaToCoverage===!1,alphaMap:fe,alphaTest:J,alphaHash:he,combine:x.combine,mapUv:at&&m(x.map.channel),aoMapUv:Ke&&m(x.aoMap.channel),lightMapUv:$e&&m(x.lightMap.channel),bumpMapUv:St&&m(x.bumpMap.channel),normalMapUv:ht&&m(x.normalMap.channel),displacementMapUv:Rt&&m(x.displacementMap.channel),emissiveMapUv:xt&&m(x.emissiveMap.channel),metalnessMapUv:ut&&m(x.metalnessMap.channel),roughnessMapUv:Mt&&m(x.roughnessMap.channel),anisotropyMapUv:X&&m(x.anisotropyMap.channel),clearcoatMapUv:q&&m(x.clearcoatMap.channel),clearcoatNormalMapUv:ae&&m(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:de&&m(x.clearcoatRoughnessMap.channel),iridescenceMapUv:B&&m(x.iridescenceMap.channel),iridescenceThicknessMapUv:Y&&m(x.iridescenceThicknessMap.channel),sheenColorMapUv:oe&&m(x.sheenColorMap.channel),sheenRoughnessMapUv:xe&&m(x.sheenRoughnessMap.channel),specularMapUv:ce&&m(x.specularMap.channel),specularColorMapUv:ue&&m(x.specularColorMap.channel),specularIntensityMapUv:be&&m(x.specularIntensityMap.channel),transmissionMapUv:Re&&m(x.transmissionMap.channel),thicknessMapUv:Ie&&m(x.thicknessMap.channel),alphaMapUv:fe&&m(x.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(ht||U),vertexNormals:!!O.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!O.attributes.uv&&(at||fe),fog:!!ee,useFog:x.fog===!0,fogExp2:!!ee&&ee.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||O.attributes.normal===void 0&&ht===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:De,skinning:z.isSkinnedMesh===!0,hasPositionAttribute:O.attributes.position!==void 0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:le,morphTextureStride:Oe,numDirLights:C.directional.length,numPointLights:C.point.length,numSpotLights:C.spot.length,numSpotLightMaps:C.spotLightMap.length,numRectAreaLights:C.rectArea.length,numHemiLights:C.hemi.length,numDirLightShadows:C.directionalShadowMap.length,numPointLightShadows:C.pointShadowMap.length,numSpotLightShadows:C.spotShadowMap.length,numSpotLightShadowsWithMaps:C.numSpotLightShadowsWithMaps,numLightProbes:C.numLightProbes,numLightProbeGrids:K.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:x.dithering,shadowMapEnabled:t.shadowMap.enabled&&N.length>0,shadowMapType:t.shadowMap.type,toneMapping:te,decodeVideoTexture:at&&x.map.isVideoTexture===!0&&qe.getTransfer(x.map.colorSpace)===rt,decodeVideoTextureEmissive:xt&&x.emissiveMap.isVideoTexture===!0&&qe.getTransfer(x.emissiveMap.colorSpace)===rt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Ai,flipSided:x.side===xn,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:pe&&x.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(pe&&x.extensions.multiDraw===!0||Pe)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Te.vertexUv1s=l.has(1),Te.vertexUv2s=l.has(2),Te.vertexUv3s=l.has(3),l.clear(),Te}function g(x){const C=[];if(x.shaderID?C.push(x.shaderID):(C.push(x.customVertexShaderID),C.push(x.customFragmentShaderID)),x.defines!==void 0)for(const N in x.defines)C.push(N),C.push(x.defines[N]);return x.isRawShaderMaterial===!1&&(f(C,x),_(C,x),C.push(t.outputColorSpace)),C.push(x.customProgramCacheKey),C.join()}function f(x,C){x.push(C.precision),x.push(C.outputColorSpace),x.push(C.envMapMode),x.push(C.envMapCubeUVHeight),x.push(C.mapUv),x.push(C.alphaMapUv),x.push(C.lightMapUv),x.push(C.aoMapUv),x.push(C.bumpMapUv),x.push(C.normalMapUv),x.push(C.displacementMapUv),x.push(C.emissiveMapUv),x.push(C.metalnessMapUv),x.push(C.roughnessMapUv),x.push(C.anisotropyMapUv),x.push(C.clearcoatMapUv),x.push(C.clearcoatNormalMapUv),x.push(C.clearcoatRoughnessMapUv),x.push(C.iridescenceMapUv),x.push(C.iridescenceThicknessMapUv),x.push(C.sheenColorMapUv),x.push(C.sheenRoughnessMapUv),x.push(C.specularMapUv),x.push(C.specularColorMapUv),x.push(C.specularIntensityMapUv),x.push(C.transmissionMapUv),x.push(C.thicknessMapUv),x.push(C.combine),x.push(C.fogExp2),x.push(C.sizeAttenuation),x.push(C.morphTargetsCount),x.push(C.morphAttributeCount),x.push(C.numDirLights),x.push(C.numPointLights),x.push(C.numSpotLights),x.push(C.numSpotLightMaps),x.push(C.numHemiLights),x.push(C.numRectAreaLights),x.push(C.numDirLightShadows),x.push(C.numPointLightShadows),x.push(C.numSpotLightShadows),x.push(C.numSpotLightShadowsWithMaps),x.push(C.numLightProbes),x.push(C.shadowMapType),x.push(C.toneMapping),x.push(C.numClippingPlanes),x.push(C.numClipIntersection),x.push(C.depthPacking)}function _(x,C){a.disableAll(),C.instancing&&a.enable(0),C.instancingColor&&a.enable(1),C.instancingMorph&&a.enable(2),C.matcap&&a.enable(3),C.envMap&&a.enable(4),C.normalMapObjectSpace&&a.enable(5),C.normalMapTangentSpace&&a.enable(6),C.clearcoat&&a.enable(7),C.iridescence&&a.enable(8),C.alphaTest&&a.enable(9),C.vertexColors&&a.enable(10),C.vertexAlphas&&a.enable(11),C.vertexUv1s&&a.enable(12),C.vertexUv2s&&a.enable(13),C.vertexUv3s&&a.enable(14),C.vertexTangents&&a.enable(15),C.anisotropy&&a.enable(16),C.alphaHash&&a.enable(17),C.batching&&a.enable(18),C.dispersion&&a.enable(19),C.batchingColor&&a.enable(20),C.gradientMap&&a.enable(21),C.packedNormalMap&&a.enable(22),C.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),C.fog&&a.enable(0),C.useFog&&a.enable(1),C.flatShading&&a.enable(2),C.logarithmicDepthBuffer&&a.enable(3),C.reversedDepthBuffer&&a.enable(4),C.skinning&&a.enable(5),C.morphTargets&&a.enable(6),C.morphNormals&&a.enable(7),C.morphColors&&a.enable(8),C.premultipliedAlpha&&a.enable(9),C.shadowMapEnabled&&a.enable(10),C.doubleSided&&a.enable(11),C.flipSided&&a.enable(12),C.useDepthPacking&&a.enable(13),C.dithering&&a.enable(14),C.transmission&&a.enable(15),C.sheen&&a.enable(16),C.opaque&&a.enable(17),C.pointsUvs&&a.enable(18),C.decodeVideoTexture&&a.enable(19),C.decodeVideoTextureEmissive&&a.enable(20),C.alphaToCoverage&&a.enable(21),C.numLightProbeGrids>0&&a.enable(22),C.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function S(x){const C=p[x.type];let N;if(C){const P=ci[C];N=Kl.clone(P.uniforms)}else N=x.uniforms;return N}function y(x,C){let N=d.get(C);return N!==void 0?++N.usedTimes:(N=new qb(t,C,x,r),c.push(N),d.set(C,N)),N}function b(x){if(--x.usedTimes===0){const C=c.indexOf(x);c[C]=c[c.length-1],c.pop(),d.delete(x.cacheKey),x.destroy()}}function w(x){o.remove(x)}function A(){o.dispose()}return{getParameters:E,getProgramCacheKey:g,getUniforms:S,acquireProgram:y,releaseProgram:b,releaseShaderCache:w,programs:c,dispose:A}}function tA(){let t=new WeakMap;function e(a){return t.has(a)}function n(a){let o=t.get(a);return o===void 0&&(o={},t.set(a,o)),o}function i(a){t.delete(a)}function r(a,o,l){t.get(a)[o]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function nA(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.materialVariant!==e.materialVariant?t.materialVariant-e.materialVariant:t.z!==e.z?t.z-e.z:t.id-e.id}function e0(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function t0(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function a(u){let p=0;return u.isInstancedMesh&&(p+=2),u.isSkinnedMesh&&(p+=1),p}function o(u,p,m,E,g,f){let _=t[e];return _===void 0?(_={id:u.id,object:u,geometry:p,material:m,materialVariant:a(u),groupOrder:E,renderOrder:u.renderOrder,z:g,group:f},t[e]=_):(_.id=u.id,_.object=u,_.geometry=p,_.material=m,_.materialVariant=a(u),_.groupOrder=E,_.renderOrder=u.renderOrder,_.z=g,_.group=f),e++,_}function l(u,p,m,E,g,f){const _=o(u,p,m,E,g,f);m.transmission>0?i.push(_):m.transparent===!0?r.push(_):n.push(_)}function c(u,p,m,E,g,f){const _=o(u,p,m,E,g,f);m.transmission>0?i.unshift(_):m.transparent===!0?r.unshift(_):n.unshift(_)}function d(u,p,m){n.length>1&&n.sort(u||nA),i.length>1&&i.sort(p||e0),r.length>1&&r.sort(p||e0),m&&(n.reverse(),i.reverse(),r.reverse())}function h(){for(let u=e,p=t.length;u<p;u++){const m=t[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:l,unshift:c,finish:h,sort:d}}function iA(){let t=new WeakMap;function e(i,r){const s=t.get(i);let a;return s===void 0?(a=new t0,t.set(i,[a])):r>=s.length?(a=new t0,s.push(a)):a=s[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}function rA(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new V,color:new ze};break;case"SpotLight":n={position:new V,direction:new V,color:new ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new V,color:new ze,distance:0,decay:0};break;case"HemisphereLight":n={direction:new V,skyColor:new ze,groundColor:new ze};break;case"RectAreaLight":n={color:new ze,position:new V,halfWidth:new V,halfHeight:new V};break}return t[e.id]=n,n}}}function sA(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let aA=0;function oA(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function lA(t){const e=new rA,n=sA(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new V);const r=new V,s=new Lt,a=new Lt;function o(c){let d=0,h=0,u=0;for(let C=0;C<9;C++)i.probe[C].set(0,0,0);let p=0,m=0,E=0,g=0,f=0,_=0,S=0,y=0,b=0,w=0,A=0;c.sort(oA);for(let C=0,N=c.length;C<N;C++){const P=c[C],z=P.color,K=P.intensity,ee=P.distance;let O=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===Hr?O=P.shadow.map.texture:O=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)d+=z.r*K,h+=z.g*K,u+=z.b*K;else if(P.isLightProbe){for(let H=0;H<9;H++)i.probe[H].addScaledVector(P.sh.coefficients[H],K);A++}else if(P.isDirectionalLight){const H=e.get(P);if(H.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const I=P.shadow,L=n.get(P);L.shadowIntensity=I.intensity,L.shadowBias=I.bias,L.shadowNormalBias=I.normalBias,L.shadowRadius=I.radius,L.shadowMapSize=I.mapSize,i.directionalShadow[p]=L,i.directionalShadowMap[p]=O,i.directionalShadowMatrix[p]=P.shadow.matrix,_++}i.directional[p]=H,p++}else if(P.isSpotLight){const H=e.get(P);H.position.setFromMatrixPosition(P.matrixWorld),H.color.copy(z).multiplyScalar(K),H.distance=ee,H.coneCos=Math.cos(P.angle),H.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),H.decay=P.decay,i.spot[E]=H;const I=P.shadow;if(P.map&&(i.spotLightMap[b]=P.map,b++,I.updateMatrices(P),P.castShadow&&w++),i.spotLightMatrix[E]=I.matrix,P.castShadow){const L=n.get(P);L.shadowIntensity=I.intensity,L.shadowBias=I.bias,L.shadowNormalBias=I.normalBias,L.shadowRadius=I.radius,L.shadowMapSize=I.mapSize,i.spotShadow[E]=L,i.spotShadowMap[E]=O,y++}E++}else if(P.isRectAreaLight){const H=e.get(P);H.color.copy(z).multiplyScalar(K),H.halfWidth.set(P.width*.5,0,0),H.halfHeight.set(0,P.height*.5,0),i.rectArea[g]=H,g++}else if(P.isPointLight){const H=e.get(P);if(H.color.copy(P.color).multiplyScalar(P.intensity),H.distance=P.distance,H.decay=P.decay,P.castShadow){const I=P.shadow,L=n.get(P);L.shadowIntensity=I.intensity,L.shadowBias=I.bias,L.shadowNormalBias=I.normalBias,L.shadowRadius=I.radius,L.shadowMapSize=I.mapSize,L.shadowCameraNear=I.camera.near,L.shadowCameraFar=I.camera.far,i.pointShadow[m]=L,i.pointShadowMap[m]=O,i.pointShadowMatrix[m]=P.shadow.matrix,S++}i.point[m]=H,m++}else if(P.isHemisphereLight){const H=e.get(P);H.skyColor.copy(P.color).multiplyScalar(K),H.groundColor.copy(P.groundColor).multiplyScalar(K),i.hemi[f]=H,f++}}g>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=me.LTC_FLOAT_1,i.rectAreaLTC2=me.LTC_FLOAT_2):(i.rectAreaLTC1=me.LTC_HALF_1,i.rectAreaLTC2=me.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=h,i.ambient[2]=u;const x=i.hash;(x.directionalLength!==p||x.pointLength!==m||x.spotLength!==E||x.rectAreaLength!==g||x.hemiLength!==f||x.numDirectionalShadows!==_||x.numPointShadows!==S||x.numSpotShadows!==y||x.numSpotMaps!==b||x.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=E,i.rectArea.length=g,i.point.length=m,i.hemi.length=f,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=S,i.pointShadowMap.length=S,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=S,i.spotLightMatrix.length=y+b-w,i.spotLightMap.length=b,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=A,x.directionalLength=p,x.pointLength=m,x.spotLength=E,x.rectAreaLength=g,x.hemiLength=f,x.numDirectionalShadows=_,x.numPointShadows=S,x.numSpotShadows=y,x.numSpotMaps=b,x.numLightProbes=A,i.version=aA++)}function l(c,d){let h=0,u=0,p=0,m=0,E=0;const g=d.matrixWorldInverse;for(let f=0,_=c.length;f<_;f++){const S=c[f];if(S.isDirectionalLight){const y=i.directional[h];y.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(g),h++}else if(S.isSpotLight){const y=i.spot[p];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(g),y.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(g),p++}else if(S.isRectAreaLight){const y=i.rectArea[m];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(g),a.identity(),s.copy(S.matrixWorld),s.premultiply(g),a.extractRotation(s),y.halfWidth.set(S.width*.5,0,0),y.halfHeight.set(0,S.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),m++}else if(S.isPointLight){const y=i.point[u];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(g),u++}else if(S.isHemisphereLight){const y=i.hemi[E];y.direction.setFromMatrixPosition(S.matrixWorld),y.direction.transformDirection(g),E++}}}return{setup:o,setupView:l,state:i}}function n0(t){const e=new lA(t),n=[],i=[],r=[];function s(u){h.camera=u,n.length=0,i.length=0,r.length=0}function a(u){n.push(u)}function o(u){i.push(u)}function l(u){r.push(u)}function c(){e.setup(n)}function d(u){e.setupView(n,u)}const h={lightsArray:n,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:h,setupLights:c,setupLightsView:d,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function cA(t){let e=new WeakMap;function n(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new n0(t),e.set(r,[o])):s>=a.length?(o=new n0(t),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:n,dispose:i}}const uA=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,fA=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,dA=[new V(1,0,0),new V(-1,0,0),new V(0,1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1)],hA=[new V(0,-1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1),new V(0,-1,0),new V(0,-1,0)],i0=new Lt,da=new V,bu=new V;function pA(t,e,n){let i=new iv;const r=new Ne,s=new Ne,a=new Ct,o=new TE,l=new wE,c={},d=n.maxTextureSize,h={[pr]:xn,[xn]:pr,[Ai]:Ai},u=new $t({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ne},radius:{value:4}},vertexShader:uA,fragmentShader:fA}),p=u.clone();p.defines.HORIZONTAL_PASS=1;const m=new on;m.setAttribute("position",new mt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const E=new vi(m,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=cl;let f=this.type;this.render=function(w,A,x){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||w.length===0)return;this.type===hM&&(Le("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=cl);const C=t.getRenderTarget(),N=t.getActiveCubeFace(),P=t.getActiveMipmapLevel(),z=t.state;z.setBlending(mi),z.buffers.depth.getReversed()===!0?z.buffers.color.setClear(0,0,0,0):z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const K=f!==this.type;K&&A.traverse(function(ee){ee.material&&(Array.isArray(ee.material)?ee.material.forEach(O=>O.needsUpdate=!0):ee.material.needsUpdate=!0)});for(let ee=0,O=w.length;ee<O;ee++){const H=w[ee],I=H.shadow;if(I===void 0){Le("WebGLShadowMap:",H,"has no shadow.");continue}if(I.autoUpdate===!1&&I.needsUpdate===!1)continue;r.copy(I.mapSize);const L=I.getFrameExtents();r.multiply(L),s.copy(I.mapSize),(r.x>d||r.y>d)&&(r.x>d&&(s.x=Math.floor(d/L.x),r.x=s.x*L.x,I.mapSize.x=s.x),r.y>d&&(s.y=Math.floor(d/L.y),r.y=s.y*L.y,I.mapSize.y=s.y));const j=t.state.buffers.depth.getReversed();if(I.camera._reversedDepth=j,I.map===null||K===!0){if(I.map!==null&&(I.map.depthTexture!==null&&(I.map.depthTexture.dispose(),I.map.depthTexture=null),I.map.dispose()),this.type===_a){if(H.isPointLight){Le("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}I.map=new yn(r.x,r.y,{format:Hr,type:Cn,minFilter:nn,magFilter:nn,generateMipmaps:!1}),I.map.texture.name=H.name+".shadowMap",I.map.depthTexture=new Xs(r.x,r.y,fi),I.map.depthTexture.name=H.name+".shadowMapDepth",I.map.depthTexture.format=Oi,I.map.depthTexture.compareFunction=null,I.map.depthTexture.minFilter=jt,I.map.depthTexture.magFilter=jt}else H.isPointLight?(I.map=new uv(r.x),I.map.depthTexture=new xE(r.x,_i)):(I.map=new yn(r.x,r.y),I.map.depthTexture=new Xs(r.x,r.y,_i)),I.map.depthTexture.name=H.name+".shadowMap",I.map.depthTexture.format=Oi,this.type===cl?(I.map.depthTexture.compareFunction=j?xh:vh,I.map.depthTexture.minFilter=nn,I.map.depthTexture.magFilter=nn):(I.map.depthTexture.compareFunction=null,I.map.depthTexture.minFilter=jt,I.map.depthTexture.magFilter=jt);I.camera.updateProjectionMatrix()}const Q=I.map.isWebGLCubeRenderTarget?6:1;for(let ne=0;ne<Q;ne++){if(I.map.isWebGLCubeRenderTarget)t.setRenderTarget(I.map,ne),t.clear();else{ne===0&&(t.setRenderTarget(I.map),t.clear());const le=I.getViewport(ne);a.set(s.x*le.x,s.y*le.y,s.x*le.z,s.y*le.w),z.viewport(a)}if(H.isPointLight){const le=I.camera,Oe=I.matrix,ke=H.distance||le.far;ke!==le.far&&(le.far=ke,le.updateProjectionMatrix()),da.setFromMatrixPosition(H.matrixWorld),le.position.copy(da),bu.copy(le.position),bu.add(dA[ne]),le.up.copy(hA[ne]),le.lookAt(bu),le.updateMatrixWorld(),Oe.makeTranslation(-da.x,-da.y,-da.z),i0.multiplyMatrices(le.projectionMatrix,le.matrixWorldInverse),I._frustum.setFromProjectionMatrix(i0,le.coordinateSystem,le.reversedDepth)}else I.updateMatrices(H);i=I.getFrustum(),y(A,x,I.camera,H,this.type)}I.isPointLightShadow!==!0&&this.type===_a&&_(I,x),I.needsUpdate=!1}f=this.type,g.needsUpdate=!1,t.setRenderTarget(C,N,P)};function _(w,A){const x=e.update(E);u.defines.VSM_SAMPLES!==w.blurSamples&&(u.defines.VSM_SAMPLES=w.blurSamples,p.defines.VSM_SAMPLES=w.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new yn(r.x,r.y,{format:Hr,type:Cn})),u.uniforms.shadow_pass.value=w.map.depthTexture,u.uniforms.resolution.value=w.mapSize,u.uniforms.radius.value=w.radius,t.setRenderTarget(w.mapPass),t.clear(),t.renderBufferDirect(A,null,x,u,E,null),p.uniforms.shadow_pass.value=w.mapPass.texture,p.uniforms.resolution.value=w.mapSize,p.uniforms.radius.value=w.radius,t.setRenderTarget(w.map),t.clear(),t.renderBufferDirect(A,null,x,p,E,null)}function S(w,A,x,C){let N=null;const P=x.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(P!==void 0)N=P;else if(N=x.isPointLight===!0?l:o,t.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const z=N.uuid,K=A.uuid;let ee=c[z];ee===void 0&&(ee={},c[z]=ee);let O=ee[K];O===void 0&&(O=N.clone(),ee[K]=O,A.addEventListener("dispose",b)),N=O}if(N.visible=A.visible,N.wireframe=A.wireframe,C===_a?N.side=A.shadowSide!==null?A.shadowSide:A.side:N.side=A.shadowSide!==null?A.shadowSide:h[A.side],N.alphaMap=A.alphaMap,N.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,N.map=A.map,N.clipShadows=A.clipShadows,N.clippingPlanes=A.clippingPlanes,N.clipIntersection=A.clipIntersection,N.displacementMap=A.displacementMap,N.displacementScale=A.displacementScale,N.displacementBias=A.displacementBias,N.wireframeLinewidth=A.wireframeLinewidth,N.linewidth=A.linewidth,x.isPointLight===!0&&N.isMeshDistanceMaterial===!0){const z=t.properties.get(N);z.light=x}return N}function y(w,A,x,C,N){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&N===_a)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,w.matrixWorld);const K=e.update(w),ee=w.material;if(Array.isArray(ee)){const O=K.groups;for(let H=0,I=O.length;H<I;H++){const L=O[H],j=ee[L.materialIndex];if(j&&j.visible){const Q=S(w,j,C,N);w.onBeforeShadow(t,w,A,x,K,Q,L),t.renderBufferDirect(x,null,K,Q,w,L),w.onAfterShadow(t,w,A,x,K,Q,L)}}}else if(ee.visible){const O=S(w,ee,C,N);w.onBeforeShadow(t,w,A,x,K,O,null),t.renderBufferDirect(x,null,K,O,w,null),w.onAfterShadow(t,w,A,x,K,O,null)}}const z=w.children;for(let K=0,ee=z.length;K<ee;K++)y(z[K],A,x,C,N)}function b(w){w.target.removeEventListener("dispose",b);for(const x in c){const C=c[x],N=w.target.uuid;N in C&&(C[N].dispose(),delete C[N])}}}function mA(t,e){function n(){let D=!1;const fe=new Ct;let J=null;const he=new Ct(0,0,0,0);return{setMask:function(pe){J!==pe&&!D&&(t.colorMask(pe,pe,pe,pe),J=pe)},setLocked:function(pe){D=pe},setClear:function(pe,te,Te,Ee,ot){ot===!0&&(pe*=Ee,te*=Ee,Te*=Ee),fe.set(pe,te,Te,Ee),he.equals(fe)===!1&&(t.clearColor(pe,te,Te,Ee),he.copy(fe))},reset:function(){D=!1,J=null,he.set(-1,0,0,0)}}}function i(){let D=!1,fe=!1,J=null,he=null,pe=null;return{setReversed:function(te){if(fe!==te){const Te=e.get("EXT_clip_control");te?Te.clipControlEXT(Te.LOWER_LEFT_EXT,Te.ZERO_TO_ONE_EXT):Te.clipControlEXT(Te.LOWER_LEFT_EXT,Te.NEGATIVE_ONE_TO_ONE_EXT),fe=te;const Ee=pe;pe=null,this.setClear(Ee)}},getReversed:function(){return fe},setTest:function(te){te?ie(t.DEPTH_TEST):De(t.DEPTH_TEST)},setMask:function(te){J!==te&&!D&&(t.depthMask(te),J=te)},setFunc:function(te){if(fe&&(te=jM[te]),he!==te){switch(te){case bf:t.depthFunc(t.NEVER);break;case Af:t.depthFunc(t.ALWAYS);break;case Cf:t.depthFunc(t.LESS);break;case Gs:t.depthFunc(t.LEQUAL);break;case Rf:t.depthFunc(t.EQUAL);break;case Pf:t.depthFunc(t.GEQUAL);break;case Nf:t.depthFunc(t.GREATER);break;case Df:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}he=te}},setLocked:function(te){D=te},setClear:function(te){pe!==te&&(pe=te,fe&&(te=1-te),t.clearDepth(te))},reset:function(){D=!1,J=null,he=null,pe=null,fe=!1}}}function r(){let D=!1,fe=null,J=null,he=null,pe=null,te=null,Te=null,Ee=null,ot=null;return{setTest:function(nt){D||(nt?ie(t.STENCIL_TEST):De(t.STENCIL_TEST))},setMask:function(nt){fe!==nt&&!D&&(t.stencilMask(nt),fe=nt)},setFunc:function(nt,ni,ii){(J!==nt||he!==ni||pe!==ii)&&(t.stencilFunc(nt,ni,ii),J=nt,he=ni,pe=ii)},setOp:function(nt,ni,ii){(te!==nt||Te!==ni||Ee!==ii)&&(t.stencilOp(nt,ni,ii),te=nt,Te=ni,Ee=ii)},setLocked:function(nt){D=nt},setClear:function(nt){ot!==nt&&(t.clearStencil(nt),ot=nt)},reset:function(){D=!1,fe=null,J=null,he=null,pe=null,te=null,Te=null,Ee=null,ot=null}}}const s=new n,a=new i,o=new r,l=new WeakMap,c=new WeakMap;let d={},h={},u={},p=new WeakMap,m=[],E=null,g=!1,f=null,_=null,S=null,y=null,b=null,w=null,A=null,x=new ze(0,0,0),C=0,N=!1,P=null,z=null,K=null,ee=null,O=null;const H=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let I=!1,L=0;const j=t.getParameter(t.VERSION);j.indexOf("WebGL")!==-1?(L=parseFloat(/^WebGL (\d)/.exec(j)[1]),I=L>=1):j.indexOf("OpenGL ES")!==-1&&(L=parseFloat(/^OpenGL ES (\d)/.exec(j)[1]),I=L>=2);let Q=null,ne={};const le=t.getParameter(t.SCISSOR_BOX),Oe=t.getParameter(t.VIEWPORT),ke=new Ct().fromArray(le),He=new Ct().fromArray(Oe);function Z(D,fe,J,he){const pe=new Uint8Array(4),te=t.createTexture();t.bindTexture(D,te),t.texParameteri(D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(D,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Te=0;Te<J;Te++)D===t.TEXTURE_3D||D===t.TEXTURE_2D_ARRAY?t.texImage3D(fe,0,t.RGBA,1,1,he,0,t.RGBA,t.UNSIGNED_BYTE,pe):t.texImage2D(fe+Te,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,pe);return te}const se={};se[t.TEXTURE_2D]=Z(t.TEXTURE_2D,t.TEXTURE_2D,1),se[t.TEXTURE_CUBE_MAP]=Z(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),se[t.TEXTURE_2D_ARRAY]=Z(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),se[t.TEXTURE_3D]=Z(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ie(t.DEPTH_TEST),a.setFunc(Gs),St(!1),ht(rm),ie(t.CULL_FACE),Ke(mi);function ie(D){d[D]!==!0&&(t.enable(D),d[D]=!0)}function De(D){d[D]!==!1&&(t.disable(D),d[D]=!1)}function Ue(D,fe){return u[D]!==fe?(t.bindFramebuffer(D,fe),u[D]=fe,D===t.DRAW_FRAMEBUFFER&&(u[t.FRAMEBUFFER]=fe),D===t.FRAMEBUFFER&&(u[t.DRAW_FRAMEBUFFER]=fe),!0):!1}function Pe(D,fe){let J=m,he=!1;if(D){J=p.get(fe),J===void 0&&(J=[],p.set(fe,J));const pe=D.textures;if(J.length!==pe.length||J[0]!==t.COLOR_ATTACHMENT0){for(let te=0,Te=pe.length;te<Te;te++)J[te]=t.COLOR_ATTACHMENT0+te;J.length=pe.length,he=!0}}else J[0]!==t.BACK&&(J[0]=t.BACK,he=!0);he&&t.drawBuffers(J)}function at(D){return E!==D?(t.useProgram(D),E=D,!0):!1}const Be={[Ar]:t.FUNC_ADD,[mM]:t.FUNC_SUBTRACT,[gM]:t.FUNC_REVERSE_SUBTRACT};Be[_M]=t.MIN,Be[vM]=t.MAX;const et={[xM]:t.ZERO,[yM]:t.ONE,[SM]:t.SRC_COLOR,[Tf]:t.SRC_ALPHA,[AM]:t.SRC_ALPHA_SATURATE,[wM]:t.DST_COLOR,[EM]:t.DST_ALPHA,[MM]:t.ONE_MINUS_SRC_COLOR,[wf]:t.ONE_MINUS_SRC_ALPHA,[bM]:t.ONE_MINUS_DST_COLOR,[TM]:t.ONE_MINUS_DST_ALPHA,[CM]:t.CONSTANT_COLOR,[RM]:t.ONE_MINUS_CONSTANT_COLOR,[PM]:t.CONSTANT_ALPHA,[NM]:t.ONE_MINUS_CONSTANT_ALPHA};function Ke(D,fe,J,he,pe,te,Te,Ee,ot,nt){if(D===mi){g===!0&&(De(t.BLEND),g=!1);return}if(g===!1&&(ie(t.BLEND),g=!0),D!==pM){if(D!==f||nt!==N){if((_!==Ar||b!==Ar)&&(t.blendEquation(t.FUNC_ADD),_=Ar,b=Ar),nt)switch(D){case Ns:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Gl:t.blendFunc(t.ONE,t.ONE);break;case sm:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case am:t.blendFuncSeparate(t.DST_COLOR,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE);break;default:Qe("WebGLState: Invalid blending: ",D);break}else switch(D){case Ns:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Gl:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE,t.ONE,t.ONE);break;case sm:Qe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case am:Qe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Qe("WebGLState: Invalid blending: ",D);break}S=null,y=null,w=null,A=null,x.set(0,0,0),C=0,f=D,N=nt}return}pe=pe||fe,te=te||J,Te=Te||he,(fe!==_||pe!==b)&&(t.blendEquationSeparate(Be[fe],Be[pe]),_=fe,b=pe),(J!==S||he!==y||te!==w||Te!==A)&&(t.blendFuncSeparate(et[J],et[he],et[te],et[Te]),S=J,y=he,w=te,A=Te),(Ee.equals(x)===!1||ot!==C)&&(t.blendColor(Ee.r,Ee.g,Ee.b,ot),x.copy(Ee),C=ot),f=D,N=!1}function $e(D,fe){D.side===Ai?De(t.CULL_FACE):ie(t.CULL_FACE);let J=D.side===xn;fe&&(J=!J),St(J),D.blending===Ns&&D.transparent===!1?Ke(mi):Ke(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),s.setMask(D.colorWrite);const he=D.stencilWrite;o.setTest(he),he&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),xt(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?ie(t.SAMPLE_ALPHA_TO_COVERAGE):De(t.SAMPLE_ALPHA_TO_COVERAGE)}function St(D){P!==D&&(D?t.frontFace(t.CW):t.frontFace(t.CCW),P=D)}function ht(D){D!==fM?(ie(t.CULL_FACE),D!==z&&(D===rm?t.cullFace(t.BACK):D===dM?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):De(t.CULL_FACE),z=D}function Rt(D){D!==K&&(I&&t.lineWidth(D),K=D)}function xt(D,fe,J){D?(ie(t.POLYGON_OFFSET_FILL),(ee!==fe||O!==J)&&(ee=fe,O=J,a.getReversed()&&(fe=-fe),t.polygonOffset(fe,J))):De(t.POLYGON_OFFSET_FILL)}function ut(D){D?ie(t.SCISSOR_TEST):De(t.SCISSOR_TEST)}function Mt(D){D===void 0&&(D=t.TEXTURE0+H-1),Q!==D&&(t.activeTexture(D),Q=D)}function U(D,fe,J){J===void 0&&(Q===null?J=t.TEXTURE0+H-1:J=Q);let he=ne[J];he===void 0&&(he={type:void 0,texture:void 0},ne[J]=he),(he.type!==D||he.texture!==fe)&&(Q!==J&&(t.activeTexture(J),Q=J),t.bindTexture(D,fe||se[D]),he.type=D,he.texture=fe)}function Wt(){const D=ne[Q];D!==void 0&&D.type!==void 0&&(t.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function Ye(){try{t.compressedTexImage2D(...arguments)}catch(D){Qe("WebGLState:",D)}}function R(){try{t.compressedTexImage3D(...arguments)}catch(D){Qe("WebGLState:",D)}}function v(){try{t.texSubImage2D(...arguments)}catch(D){Qe("WebGLState:",D)}}function k(){try{t.texSubImage3D(...arguments)}catch(D){Qe("WebGLState:",D)}}function X(){try{t.compressedTexSubImage2D(...arguments)}catch(D){Qe("WebGLState:",D)}}function q(){try{t.compressedTexSubImage3D(...arguments)}catch(D){Qe("WebGLState:",D)}}function ae(){try{t.texStorage2D(...arguments)}catch(D){Qe("WebGLState:",D)}}function de(){try{t.texStorage3D(...arguments)}catch(D){Qe("WebGLState:",D)}}function B(){try{t.texImage2D(...arguments)}catch(D){Qe("WebGLState:",D)}}function Y(){try{t.texImage3D(...arguments)}catch(D){Qe("WebGLState:",D)}}function oe(D){return h[D]!==void 0?h[D]:t.getParameter(D)}function xe(D,fe){h[D]!==fe&&(t.pixelStorei(D,fe),h[D]=fe)}function ce(D){ke.equals(D)===!1&&(t.scissor(D.x,D.y,D.z,D.w),ke.copy(D))}function ue(D){He.equals(D)===!1&&(t.viewport(D.x,D.y,D.z,D.w),He.copy(D))}function be(D,fe){let J=c.get(fe);J===void 0&&(J=new WeakMap,c.set(fe,J));let he=J.get(D);he===void 0&&(he=t.getUniformBlockIndex(fe,D.name),J.set(D,he))}function Re(D,fe){const he=c.get(fe).get(D);l.get(fe)!==he&&(t.uniformBlockBinding(fe,he,D.__bindingPointIndex),l.set(fe,he))}function Ie(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),a.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),t.pixelStorei(t.PACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.BROWSER_DEFAULT_WEBGL),t.pixelStorei(t.PACK_ROW_LENGTH,0),t.pixelStorei(t.PACK_SKIP_PIXELS,0),t.pixelStorei(t.PACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_ROW_LENGTH,0),t.pixelStorei(t.UNPACK_IMAGE_HEIGHT,0),t.pixelStorei(t.UNPACK_SKIP_PIXELS,0),t.pixelStorei(t.UNPACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_SKIP_IMAGES,0),d={},h={},Q=null,ne={},u={},p=new WeakMap,m=[],E=null,g=!1,f=null,_=null,S=null,y=null,b=null,w=null,A=null,x=new ze(0,0,0),C=0,N=!1,P=null,z=null,K=null,ee=null,O=null,ke.set(0,0,t.canvas.width,t.canvas.height),He.set(0,0,t.canvas.width,t.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:ie,disable:De,bindFramebuffer:Ue,drawBuffers:Pe,useProgram:at,setBlending:Ke,setMaterial:$e,setFlipSided:St,setCullFace:ht,setLineWidth:Rt,setPolygonOffset:xt,setScissorTest:ut,activeTexture:Mt,bindTexture:U,unbindTexture:Wt,compressedTexImage2D:Ye,compressedTexImage3D:R,texImage2D:B,texImage3D:Y,pixelStorei:xe,getParameter:oe,updateUBOMapping:be,uniformBlockBinding:Re,texStorage2D:ae,texStorage3D:de,texSubImage2D:v,texSubImage3D:k,compressedTexSubImage2D:X,compressedTexSubImage3D:q,scissor:ce,viewport:ue,reset:Ie}}function gA(t,e,n,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ne,d=new WeakMap,h=new Set;let u;const p=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function E(R,v){return m?new OffscreenCanvas(R,v):ql("canvas")}function g(R,v,k){let X=1;const q=Ye(R);if((q.width>k||q.height>k)&&(X=k/Math.max(q.width,q.height)),X<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const ae=Math.floor(X*q.width),de=Math.floor(X*q.height);u===void 0&&(u=E(ae,de));const B=v?E(ae,de):u;return B.width=ae,B.height=de,B.getContext("2d").drawImage(R,0,0,ae,de),Le("WebGLRenderer: Texture has been resized from ("+q.width+"x"+q.height+") to ("+ae+"x"+de+")."),B}else return"data"in R&&Le("WebGLRenderer: Image in DataTexture is too big ("+q.width+"x"+q.height+")."),R;return R}function f(R){return R.generateMipmaps}function _(R){t.generateMipmap(R)}function S(R){return R.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?t.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function y(R,v,k,X,q,ae=!1){if(R!==null){if(t[R]!==void 0)return t[R];Le("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let de;X&&(de=e.get("EXT_texture_norm16"),de||Le("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let B=v;if(v===t.RED&&(k===t.FLOAT&&(B=t.R32F),k===t.HALF_FLOAT&&(B=t.R16F),k===t.UNSIGNED_BYTE&&(B=t.R8),k===t.UNSIGNED_SHORT&&de&&(B=de.R16_EXT),k===t.SHORT&&de&&(B=de.R16_SNORM_EXT)),v===t.RED_INTEGER&&(k===t.UNSIGNED_BYTE&&(B=t.R8UI),k===t.UNSIGNED_SHORT&&(B=t.R16UI),k===t.UNSIGNED_INT&&(B=t.R32UI),k===t.BYTE&&(B=t.R8I),k===t.SHORT&&(B=t.R16I),k===t.INT&&(B=t.R32I)),v===t.RG&&(k===t.FLOAT&&(B=t.RG32F),k===t.HALF_FLOAT&&(B=t.RG16F),k===t.UNSIGNED_BYTE&&(B=t.RG8),k===t.UNSIGNED_SHORT&&de&&(B=de.RG16_EXT),k===t.SHORT&&de&&(B=de.RG16_SNORM_EXT)),v===t.RG_INTEGER&&(k===t.UNSIGNED_BYTE&&(B=t.RG8UI),k===t.UNSIGNED_SHORT&&(B=t.RG16UI),k===t.UNSIGNED_INT&&(B=t.RG32UI),k===t.BYTE&&(B=t.RG8I),k===t.SHORT&&(B=t.RG16I),k===t.INT&&(B=t.RG32I)),v===t.RGB_INTEGER&&(k===t.UNSIGNED_BYTE&&(B=t.RGB8UI),k===t.UNSIGNED_SHORT&&(B=t.RGB16UI),k===t.UNSIGNED_INT&&(B=t.RGB32UI),k===t.BYTE&&(B=t.RGB8I),k===t.SHORT&&(B=t.RGB16I),k===t.INT&&(B=t.RGB32I)),v===t.RGBA_INTEGER&&(k===t.UNSIGNED_BYTE&&(B=t.RGBA8UI),k===t.UNSIGNED_SHORT&&(B=t.RGBA16UI),k===t.UNSIGNED_INT&&(B=t.RGBA32UI),k===t.BYTE&&(B=t.RGBA8I),k===t.SHORT&&(B=t.RGBA16I),k===t.INT&&(B=t.RGBA32I)),v===t.RGB&&(k===t.UNSIGNED_SHORT&&de&&(B=de.RGB16_EXT),k===t.SHORT&&de&&(B=de.RGB16_SNORM_EXT),k===t.UNSIGNED_INT_5_9_9_9_REV&&(B=t.RGB9_E5),k===t.UNSIGNED_INT_10F_11F_11F_REV&&(B=t.R11F_G11F_B10F)),v===t.RGBA){const Y=ae?$l:qe.getTransfer(q);k===t.FLOAT&&(B=t.RGBA32F),k===t.HALF_FLOAT&&(B=t.RGBA16F),k===t.UNSIGNED_BYTE&&(B=Y===rt?t.SRGB8_ALPHA8:t.RGBA8),k===t.UNSIGNED_SHORT&&de&&(B=de.RGBA16_EXT),k===t.SHORT&&de&&(B=de.RGBA16_SNORM_EXT),k===t.UNSIGNED_SHORT_4_4_4_4&&(B=t.RGBA4),k===t.UNSIGNED_SHORT_5_5_5_1&&(B=t.RGB5_A1)}return(B===t.R16F||B===t.R32F||B===t.RG16F||B===t.RG32F||B===t.RGBA16F||B===t.RGBA32F)&&e.get("EXT_color_buffer_float"),B}function b(R,v){let k;return R?v===null||v===_i||v===$a?k=t.DEPTH24_STENCIL8:v===fi?k=t.DEPTH32F_STENCIL8:v===ja&&(k=t.DEPTH24_STENCIL8,Le("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===_i||v===$a?k=t.DEPTH_COMPONENT24:v===fi?k=t.DEPTH_COMPONENT32F:v===ja&&(k=t.DEPTH_COMPONENT16),k}function w(R,v){return f(R)===!0||R.isFramebufferTexture&&R.minFilter!==jt&&R.minFilter!==nn?Math.log2(Math.max(v.width,v.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?v.mipmaps.length:1}function A(R){const v=R.target;v.removeEventListener("dispose",A),C(v),v.isVideoTexture&&d.delete(v),v.isHTMLTexture&&h.delete(v)}function x(R){const v=R.target;v.removeEventListener("dispose",x),P(v)}function C(R){const v=i.get(R);if(v.__webglInit===void 0)return;const k=R.source,X=p.get(k);if(X){const q=X[v.__cacheKey];q.usedTimes--,q.usedTimes===0&&N(R),Object.keys(X).length===0&&p.delete(k)}i.remove(R)}function N(R){const v=i.get(R);t.deleteTexture(v.__webglTexture);const k=R.source,X=p.get(k);delete X[v.__cacheKey],a.memory.textures--}function P(R){const v=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(v.__webglFramebuffer[X]))for(let q=0;q<v.__webglFramebuffer[X].length;q++)t.deleteFramebuffer(v.__webglFramebuffer[X][q]);else t.deleteFramebuffer(v.__webglFramebuffer[X]);v.__webglDepthbuffer&&t.deleteRenderbuffer(v.__webglDepthbuffer[X])}else{if(Array.isArray(v.__webglFramebuffer))for(let X=0;X<v.__webglFramebuffer.length;X++)t.deleteFramebuffer(v.__webglFramebuffer[X]);else t.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&t.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&t.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let X=0;X<v.__webglColorRenderbuffer.length;X++)v.__webglColorRenderbuffer[X]&&t.deleteRenderbuffer(v.__webglColorRenderbuffer[X]);v.__webglDepthRenderbuffer&&t.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const k=R.textures;for(let X=0,q=k.length;X<q;X++){const ae=i.get(k[X]);ae.__webglTexture&&(t.deleteTexture(ae.__webglTexture),a.memory.textures--),i.remove(k[X])}i.remove(R)}let z=0;function K(){z=0}function ee(){return z}function O(R){z=R}function H(){const R=z;return R>=r.maxTextures&&Le("WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+r.maxTextures),z+=1,R}function I(R){const v=[];return v.push(R.wrapS),v.push(R.wrapT),v.push(R.wrapR||0),v.push(R.magFilter),v.push(R.minFilter),v.push(R.anisotropy),v.push(R.internalFormat),v.push(R.format),v.push(R.type),v.push(R.generateMipmaps),v.push(R.premultiplyAlpha),v.push(R.flipY),v.push(R.unpackAlignment),v.push(R.colorSpace),v.join()}function L(R,v){const k=i.get(R);if(R.isVideoTexture&&U(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&k.__version!==R.version){const X=R.image;if(X===null)Le("WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)Le("WebGLRenderer: Texture marked for update but image is incomplete");else{De(k,R,v);return}}else R.isExternalTexture&&(k.__webglTexture=R.sourceTexture?R.sourceTexture:null);n.bindTexture(t.TEXTURE_2D,k.__webglTexture,t.TEXTURE0+v)}function j(R,v){const k=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&k.__version!==R.version){De(k,R,v);return}else R.isExternalTexture&&(k.__webglTexture=R.sourceTexture?R.sourceTexture:null);n.bindTexture(t.TEXTURE_2D_ARRAY,k.__webglTexture,t.TEXTURE0+v)}function Q(R,v){const k=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&k.__version!==R.version){De(k,R,v);return}n.bindTexture(t.TEXTURE_3D,k.__webglTexture,t.TEXTURE0+v)}function ne(R,v){const k=i.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&k.__version!==R.version){Ue(k,R,v);return}n.bindTexture(t.TEXTURE_CUBE_MAP,k.__webglTexture,t.TEXTURE0+v)}const le={[Lf]:t.REPEAT,[Pi]:t.CLAMP_TO_EDGE,[If]:t.MIRRORED_REPEAT},Oe={[jt]:t.NEAREST,[IM]:t.NEAREST_MIPMAP_NEAREST,[wo]:t.NEAREST_MIPMAP_LINEAR,[nn]:t.LINEAR,[Zc]:t.LINEAR_MIPMAP_NEAREST,[Dr]:t.LINEAR_MIPMAP_LINEAR},ke={[OM]:t.NEVER,[HM]:t.ALWAYS,[kM]:t.LESS,[vh]:t.LEQUAL,[BM]:t.EQUAL,[xh]:t.GEQUAL,[zM]:t.GREATER,[VM]:t.NOTEQUAL};function He(R,v){if(v.type===fi&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===nn||v.magFilter===Zc||v.magFilter===wo||v.magFilter===Dr||v.minFilter===nn||v.minFilter===Zc||v.minFilter===wo||v.minFilter===Dr)&&Le("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(R,t.TEXTURE_WRAP_S,le[v.wrapS]),t.texParameteri(R,t.TEXTURE_WRAP_T,le[v.wrapT]),(R===t.TEXTURE_3D||R===t.TEXTURE_2D_ARRAY)&&t.texParameteri(R,t.TEXTURE_WRAP_R,le[v.wrapR]),t.texParameteri(R,t.TEXTURE_MAG_FILTER,Oe[v.magFilter]),t.texParameteri(R,t.TEXTURE_MIN_FILTER,Oe[v.minFilter]),v.compareFunction&&(t.texParameteri(R,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(R,t.TEXTURE_COMPARE_FUNC,ke[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===jt||v.minFilter!==wo&&v.minFilter!==Dr||v.type===fi&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||i.get(v).__currentAnisotropy){const k=e.get("EXT_texture_filter_anisotropic");t.texParameterf(R,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,r.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy}}}function Z(R,v){let k=!1;R.__webglInit===void 0&&(R.__webglInit=!0,v.addEventListener("dispose",A));const X=v.source;let q=p.get(X);q===void 0&&(q={},p.set(X,q));const ae=I(v);if(ae!==R.__cacheKey){q[ae]===void 0&&(q[ae]={texture:t.createTexture(),usedTimes:0},a.memory.textures++,k=!0),q[ae].usedTimes++;const de=q[R.__cacheKey];de!==void 0&&(q[R.__cacheKey].usedTimes--,de.usedTimes===0&&N(v)),R.__cacheKey=ae,R.__webglTexture=q[ae].texture}return k}function se(R,v,k){return Math.floor(Math.floor(R/k)/v)}function ie(R,v,k,X){const ae=R.updateRanges;if(ae.length===0)n.texSubImage2D(t.TEXTURE_2D,0,0,0,v.width,v.height,k,X,v.data);else{ae.sort((xe,ce)=>xe.start-ce.start);let de=0;for(let xe=1;xe<ae.length;xe++){const ce=ae[de],ue=ae[xe],be=ce.start+ce.count,Re=se(ue.start,v.width,4),Ie=se(ce.start,v.width,4);ue.start<=be+1&&Re===Ie&&se(ue.start+ue.count-1,v.width,4)===Re?ce.count=Math.max(ce.count,ue.start+ue.count-ce.start):(++de,ae[de]=ue)}ae.length=de+1;const B=n.getParameter(t.UNPACK_ROW_LENGTH),Y=n.getParameter(t.UNPACK_SKIP_PIXELS),oe=n.getParameter(t.UNPACK_SKIP_ROWS);n.pixelStorei(t.UNPACK_ROW_LENGTH,v.width);for(let xe=0,ce=ae.length;xe<ce;xe++){const ue=ae[xe],be=Math.floor(ue.start/4),Re=Math.ceil(ue.count/4),Ie=be%v.width,D=Math.floor(be/v.width),fe=Re,J=1;n.pixelStorei(t.UNPACK_SKIP_PIXELS,Ie),n.pixelStorei(t.UNPACK_SKIP_ROWS,D),n.texSubImage2D(t.TEXTURE_2D,0,Ie,D,fe,J,k,X,v.data)}R.clearUpdateRanges(),n.pixelStorei(t.UNPACK_ROW_LENGTH,B),n.pixelStorei(t.UNPACK_SKIP_PIXELS,Y),n.pixelStorei(t.UNPACK_SKIP_ROWS,oe)}}function De(R,v,k){let X=t.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(X=t.TEXTURE_2D_ARRAY),v.isData3DTexture&&(X=t.TEXTURE_3D);const q=Z(R,v),ae=v.source;n.bindTexture(X,R.__webglTexture,t.TEXTURE0+k);const de=i.get(ae);if(ae.version!==de.__version||q===!0){if(n.activeTexture(t.TEXTURE0+k),(typeof ImageBitmap<"u"&&v.image instanceof ImageBitmap)===!1){const J=qe.getPrimaries(qe.workingColorSpace),he=v.colorSpace===er?null:qe.getPrimaries(v.colorSpace),pe=v.colorSpace===er||J===he?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,pe)}n.pixelStorei(t.UNPACK_ALIGNMENT,v.unpackAlignment);let Y=g(v.image,!1,r.maxTextureSize);Y=Wt(v,Y);const oe=s.convert(v.format,v.colorSpace),xe=s.convert(v.type);let ce=y(v.internalFormat,oe,xe,v.normalized,v.colorSpace,v.isVideoTexture);He(X,v);let ue;const be=v.mipmaps,Re=v.isVideoTexture!==!0,Ie=de.__version===void 0||q===!0,D=ae.dataReady,fe=w(v,Y);if(v.isDepthTexture)ce=b(v.format===Lr,v.type),Ie&&(Re?n.texStorage2D(t.TEXTURE_2D,1,ce,Y.width,Y.height):n.texImage2D(t.TEXTURE_2D,0,ce,Y.width,Y.height,0,oe,xe,null));else if(v.isDataTexture)if(be.length>0){Re&&Ie&&n.texStorage2D(t.TEXTURE_2D,fe,ce,be[0].width,be[0].height);for(let J=0,he=be.length;J<he;J++)ue=be[J],Re?D&&n.texSubImage2D(t.TEXTURE_2D,J,0,0,ue.width,ue.height,oe,xe,ue.data):n.texImage2D(t.TEXTURE_2D,J,ce,ue.width,ue.height,0,oe,xe,ue.data);v.generateMipmaps=!1}else Re?(Ie&&n.texStorage2D(t.TEXTURE_2D,fe,ce,Y.width,Y.height),D&&ie(v,Y,oe,xe)):n.texImage2D(t.TEXTURE_2D,0,ce,Y.width,Y.height,0,oe,xe,Y.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Re&&Ie&&n.texStorage3D(t.TEXTURE_2D_ARRAY,fe,ce,be[0].width,be[0].height,Y.depth);for(let J=0,he=be.length;J<he;J++)if(ue=be[J],v.format!==Zn)if(oe!==null)if(Re){if(D)if(v.layerUpdates.size>0){const pe=Im(ue.width,ue.height,v.format,v.type);for(const te of v.layerUpdates){const Te=ue.data.subarray(te*pe/ue.data.BYTES_PER_ELEMENT,(te+1)*pe/ue.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,J,0,0,te,ue.width,ue.height,1,oe,Te)}v.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,J,0,0,0,ue.width,ue.height,Y.depth,oe,ue.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,J,ce,ue.width,ue.height,Y.depth,0,ue.data,0,0);else Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Re?D&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,J,0,0,0,ue.width,ue.height,Y.depth,oe,xe,ue.data):n.texImage3D(t.TEXTURE_2D_ARRAY,J,ce,ue.width,ue.height,Y.depth,0,oe,xe,ue.data)}else{Re&&Ie&&n.texStorage2D(t.TEXTURE_2D,fe,ce,be[0].width,be[0].height);for(let J=0,he=be.length;J<he;J++)ue=be[J],v.format!==Zn?oe!==null?Re?D&&n.compressedTexSubImage2D(t.TEXTURE_2D,J,0,0,ue.width,ue.height,oe,ue.data):n.compressedTexImage2D(t.TEXTURE_2D,J,ce,ue.width,ue.height,0,ue.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Re?D&&n.texSubImage2D(t.TEXTURE_2D,J,0,0,ue.width,ue.height,oe,xe,ue.data):n.texImage2D(t.TEXTURE_2D,J,ce,ue.width,ue.height,0,oe,xe,ue.data)}else if(v.isDataArrayTexture)if(Re){if(Ie&&n.texStorage3D(t.TEXTURE_2D_ARRAY,fe,ce,Y.width,Y.height,Y.depth),D)if(v.layerUpdates.size>0){const J=Im(Y.width,Y.height,v.format,v.type);for(const he of v.layerUpdates){const pe=Y.data.subarray(he*J/Y.data.BYTES_PER_ELEMENT,(he+1)*J/Y.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,he,Y.width,Y.height,1,oe,xe,pe)}v.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,Y.width,Y.height,Y.depth,oe,xe,Y.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,ce,Y.width,Y.height,Y.depth,0,oe,xe,Y.data);else if(v.isData3DTexture)Re?(Ie&&n.texStorage3D(t.TEXTURE_3D,fe,ce,Y.width,Y.height,Y.depth),D&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,Y.width,Y.height,Y.depth,oe,xe,Y.data)):n.texImage3D(t.TEXTURE_3D,0,ce,Y.width,Y.height,Y.depth,0,oe,xe,Y.data);else if(v.isFramebufferTexture){if(Ie)if(Re)n.texStorage2D(t.TEXTURE_2D,fe,ce,Y.width,Y.height);else{let J=Y.width,he=Y.height;for(let pe=0;pe<fe;pe++)n.texImage2D(t.TEXTURE_2D,pe,ce,J,he,0,oe,xe,null),J>>=1,he>>=1}}else if(v.isHTMLTexture){if("texElementImage2D"in t){const J=t.canvas;if(J.hasAttribute("layoutsubtree")||J.setAttribute("layoutsubtree","true"),Y.parentNode!==J){J.appendChild(Y),h.add(v),J.onpaint=he=>{const pe=he.changedElements;for(const te of h)pe.includes(te.image)&&(te.needsUpdate=!0)},J.requestPaint();return}if(t.texElementImage2D.length===3)t.texElementImage2D(t.TEXTURE_2D,t.RGBA8,Y);else{const pe=t.RGBA,te=t.RGBA,Te=t.UNSIGNED_BYTE;t.texElementImage2D(t.TEXTURE_2D,0,pe,te,Te,Y)}t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)}}else if(be.length>0){if(Re&&Ie){const J=Ye(be[0]);n.texStorage2D(t.TEXTURE_2D,fe,ce,J.width,J.height)}for(let J=0,he=be.length;J<he;J++)ue=be[J],Re?D&&n.texSubImage2D(t.TEXTURE_2D,J,0,0,oe,xe,ue):n.texImage2D(t.TEXTURE_2D,J,ce,oe,xe,ue);v.generateMipmaps=!1}else if(Re){if(Ie){const J=Ye(Y);n.texStorage2D(t.TEXTURE_2D,fe,ce,J.width,J.height)}D&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,oe,xe,Y)}else n.texImage2D(t.TEXTURE_2D,0,ce,oe,xe,Y);f(v)&&_(X),de.__version=ae.version,v.onUpdate&&v.onUpdate(v)}R.__version=v.version}function Ue(R,v,k){if(v.image.length!==6)return;const X=Z(R,v),q=v.source;n.bindTexture(t.TEXTURE_CUBE_MAP,R.__webglTexture,t.TEXTURE0+k);const ae=i.get(q);if(q.version!==ae.__version||X===!0){n.activeTexture(t.TEXTURE0+k);const de=qe.getPrimaries(qe.workingColorSpace),B=v.colorSpace===er?null:qe.getPrimaries(v.colorSpace),Y=v.colorSpace===er||de===B?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(t.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Y);const oe=v.isCompressedTexture||v.image[0].isCompressedTexture,xe=v.image[0]&&v.image[0].isDataTexture,ce=[];for(let te=0;te<6;te++)!oe&&!xe?ce[te]=g(v.image[te],!0,r.maxCubemapSize):ce[te]=xe?v.image[te].image:v.image[te],ce[te]=Wt(v,ce[te]);const ue=ce[0],be=s.convert(v.format,v.colorSpace),Re=s.convert(v.type),Ie=y(v.internalFormat,be,Re,v.normalized,v.colorSpace),D=v.isVideoTexture!==!0,fe=ae.__version===void 0||X===!0,J=q.dataReady;let he=w(v,ue);He(t.TEXTURE_CUBE_MAP,v);let pe;if(oe){D&&fe&&n.texStorage2D(t.TEXTURE_CUBE_MAP,he,Ie,ue.width,ue.height);for(let te=0;te<6;te++){pe=ce[te].mipmaps;for(let Te=0;Te<pe.length;Te++){const Ee=pe[Te];v.format!==Zn?be!==null?D?J&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,Te,0,0,Ee.width,Ee.height,be,Ee.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,Te,Ie,Ee.width,Ee.height,0,Ee.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?J&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,Te,0,0,Ee.width,Ee.height,be,Re,Ee.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,Te,Ie,Ee.width,Ee.height,0,be,Re,Ee.data)}}}else{if(pe=v.mipmaps,D&&fe){pe.length>0&&he++;const te=Ye(ce[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,he,Ie,te.width,te.height)}for(let te=0;te<6;te++)if(xe){D?J&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,ce[te].width,ce[te].height,be,Re,ce[te].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,Ie,ce[te].width,ce[te].height,0,be,Re,ce[te].data);for(let Te=0;Te<pe.length;Te++){const ot=pe[Te].image[te].image;D?J&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,Te+1,0,0,ot.width,ot.height,be,Re,ot.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,Te+1,Ie,ot.width,ot.height,0,be,Re,ot.data)}}else{D?J&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,be,Re,ce[te]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,Ie,be,Re,ce[te]);for(let Te=0;Te<pe.length;Te++){const Ee=pe[Te];D?J&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,Te+1,0,0,be,Re,Ee.image[te]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,Te+1,Ie,be,Re,Ee.image[te])}}}f(v)&&_(t.TEXTURE_CUBE_MAP),ae.__version=q.version,v.onUpdate&&v.onUpdate(v)}R.__version=v.version}function Pe(R,v,k,X,q,ae){const de=s.convert(k.format,k.colorSpace),B=s.convert(k.type),Y=y(k.internalFormat,de,B,k.normalized,k.colorSpace),oe=i.get(v),xe=i.get(k);if(xe.__renderTarget=v,!oe.__hasExternalTextures){const ce=Math.max(1,v.width>>ae),ue=Math.max(1,v.height>>ae);q===t.TEXTURE_3D||q===t.TEXTURE_2D_ARRAY?n.texImage3D(q,ae,Y,ce,ue,v.depth,0,de,B,null):n.texImage2D(q,ae,Y,ce,ue,0,de,B,null)}n.bindFramebuffer(t.FRAMEBUFFER,R),Mt(v)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,X,q,xe.__webglTexture,0,ut(v)):(q===t.TEXTURE_2D||q>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&q<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,X,q,xe.__webglTexture,ae),n.bindFramebuffer(t.FRAMEBUFFER,null)}function at(R,v,k){if(t.bindRenderbuffer(t.RENDERBUFFER,R),v.depthBuffer){const X=v.depthTexture,q=X&&X.isDepthTexture?X.type:null,ae=b(v.stencilBuffer,q),de=v.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;Mt(v)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,ut(v),ae,v.width,v.height):k?t.renderbufferStorageMultisample(t.RENDERBUFFER,ut(v),ae,v.width,v.height):t.renderbufferStorage(t.RENDERBUFFER,ae,v.width,v.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,de,t.RENDERBUFFER,R)}else{const X=v.textures;for(let q=0;q<X.length;q++){const ae=X[q],de=s.convert(ae.format,ae.colorSpace),B=s.convert(ae.type),Y=y(ae.internalFormat,de,B,ae.normalized,ae.colorSpace);Mt(v)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,ut(v),Y,v.width,v.height):k?t.renderbufferStorageMultisample(t.RENDERBUFFER,ut(v),Y,v.width,v.height):t.renderbufferStorage(t.RENDERBUFFER,Y,v.width,v.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function Be(R,v,k){const X=v.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(t.FRAMEBUFFER,R),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const q=i.get(v.depthTexture);if(q.__renderTarget=v,(!q.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),X){if(q.__webglInit===void 0&&(q.__webglInit=!0,v.depthTexture.addEventListener("dispose",A)),q.__webglTexture===void 0){q.__webglTexture=t.createTexture(),n.bindTexture(t.TEXTURE_CUBE_MAP,q.__webglTexture),He(t.TEXTURE_CUBE_MAP,v.depthTexture);const oe=s.convert(v.depthTexture.format),xe=s.convert(v.depthTexture.type);let ce;v.depthTexture.format===Oi?ce=t.DEPTH_COMPONENT24:v.depthTexture.format===Lr&&(ce=t.DEPTH24_STENCIL8);for(let ue=0;ue<6;ue++)t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,ce,v.width,v.height,0,oe,xe,null)}}else L(v.depthTexture,0);const ae=q.__webglTexture,de=ut(v),B=X?t.TEXTURE_CUBE_MAP_POSITIVE_X+k:t.TEXTURE_2D,Y=v.depthTexture.format===Lr?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;if(v.depthTexture.format===Oi)Mt(v)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Y,B,ae,0,de):t.framebufferTexture2D(t.FRAMEBUFFER,Y,B,ae,0);else if(v.depthTexture.format===Lr)Mt(v)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Y,B,ae,0,de):t.framebufferTexture2D(t.FRAMEBUFFER,Y,B,ae,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function et(R){const v=i.get(R),k=R.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==R.depthTexture){const X=R.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),X){const q=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,X.removeEventListener("dispose",q)};X.addEventListener("dispose",q),v.__depthDisposeCallback=q}v.__boundDepthTexture=X}if(R.depthTexture&&!v.__autoAllocateDepthBuffer)if(k)for(let X=0;X<6;X++)Be(v.__webglFramebuffer[X],R,X);else{const X=R.texture.mipmaps;X&&X.length>0?Be(v.__webglFramebuffer[0],R,0):Be(v.__webglFramebuffer,R,0)}else if(k){v.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(n.bindFramebuffer(t.FRAMEBUFFER,v.__webglFramebuffer[X]),v.__webglDepthbuffer[X]===void 0)v.__webglDepthbuffer[X]=t.createRenderbuffer(),at(v.__webglDepthbuffer[X],R,!1);else{const q=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ae=v.__webglDepthbuffer[X];t.bindRenderbuffer(t.RENDERBUFFER,ae),t.framebufferRenderbuffer(t.FRAMEBUFFER,q,t.RENDERBUFFER,ae)}}else{const X=R.texture.mipmaps;if(X&&X.length>0?n.bindFramebuffer(t.FRAMEBUFFER,v.__webglFramebuffer[0]):n.bindFramebuffer(t.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=t.createRenderbuffer(),at(v.__webglDepthbuffer,R,!1);else{const q=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ae=v.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,ae),t.framebufferRenderbuffer(t.FRAMEBUFFER,q,t.RENDERBUFFER,ae)}}n.bindFramebuffer(t.FRAMEBUFFER,null)}function Ke(R,v,k){const X=i.get(R);v!==void 0&&Pe(X.__webglFramebuffer,R,R.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),k!==void 0&&et(R)}function $e(R){const v=R.texture,k=i.get(R),X=i.get(v);R.addEventListener("dispose",x);const q=R.textures,ae=R.isWebGLCubeRenderTarget===!0,de=q.length>1;if(de||(X.__webglTexture===void 0&&(X.__webglTexture=t.createTexture()),X.__version=v.version,a.memory.textures++),ae){k.__webglFramebuffer=[];for(let B=0;B<6;B++)if(v.mipmaps&&v.mipmaps.length>0){k.__webglFramebuffer[B]=[];for(let Y=0;Y<v.mipmaps.length;Y++)k.__webglFramebuffer[B][Y]=t.createFramebuffer()}else k.__webglFramebuffer[B]=t.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){k.__webglFramebuffer=[];for(let B=0;B<v.mipmaps.length;B++)k.__webglFramebuffer[B]=t.createFramebuffer()}else k.__webglFramebuffer=t.createFramebuffer();if(de)for(let B=0,Y=q.length;B<Y;B++){const oe=i.get(q[B]);oe.__webglTexture===void 0&&(oe.__webglTexture=t.createTexture(),a.memory.textures++)}if(R.samples>0&&Mt(R)===!1){k.__webglMultisampledFramebuffer=t.createFramebuffer(),k.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let B=0;B<q.length;B++){const Y=q[B];k.__webglColorRenderbuffer[B]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,k.__webglColorRenderbuffer[B]);const oe=s.convert(Y.format,Y.colorSpace),xe=s.convert(Y.type),ce=y(Y.internalFormat,oe,xe,Y.normalized,Y.colorSpace,R.isXRRenderTarget===!0),ue=ut(R);t.renderbufferStorageMultisample(t.RENDERBUFFER,ue,ce,R.width,R.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+B,t.RENDERBUFFER,k.__webglColorRenderbuffer[B])}t.bindRenderbuffer(t.RENDERBUFFER,null),R.depthBuffer&&(k.__webglDepthRenderbuffer=t.createRenderbuffer(),at(k.__webglDepthRenderbuffer,R,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(ae){n.bindTexture(t.TEXTURE_CUBE_MAP,X.__webglTexture),He(t.TEXTURE_CUBE_MAP,v);for(let B=0;B<6;B++)if(v.mipmaps&&v.mipmaps.length>0)for(let Y=0;Y<v.mipmaps.length;Y++)Pe(k.__webglFramebuffer[B][Y],R,v,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+B,Y);else Pe(k.__webglFramebuffer[B],R,v,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+B,0);f(v)&&_(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(de){for(let B=0,Y=q.length;B<Y;B++){const oe=q[B],xe=i.get(oe);let ce=t.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ce=R.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(ce,xe.__webglTexture),He(ce,oe),Pe(k.__webglFramebuffer,R,oe,t.COLOR_ATTACHMENT0+B,ce,0),f(oe)&&_(ce)}n.unbindTexture()}else{let B=t.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(B=R.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(B,X.__webglTexture),He(B,v),v.mipmaps&&v.mipmaps.length>0)for(let Y=0;Y<v.mipmaps.length;Y++)Pe(k.__webglFramebuffer[Y],R,v,t.COLOR_ATTACHMENT0,B,Y);else Pe(k.__webglFramebuffer,R,v,t.COLOR_ATTACHMENT0,B,0);f(v)&&_(B),n.unbindTexture()}R.depthBuffer&&et(R)}function St(R){const v=R.textures;for(let k=0,X=v.length;k<X;k++){const q=v[k];if(f(q)){const ae=S(R),de=i.get(q).__webglTexture;n.bindTexture(ae,de),_(ae),n.unbindTexture()}}}const ht=[],Rt=[];function xt(R){if(R.samples>0){if(Mt(R)===!1){const v=R.textures,k=R.width,X=R.height;let q=t.COLOR_BUFFER_BIT;const ae=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,de=i.get(R),B=v.length>1;if(B)for(let oe=0;oe<v.length;oe++)n.bindFramebuffer(t.FRAMEBUFFER,de.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+oe,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,de.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+oe,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,de.__webglMultisampledFramebuffer);const Y=R.texture.mipmaps;Y&&Y.length>0?n.bindFramebuffer(t.DRAW_FRAMEBUFFER,de.__webglFramebuffer[0]):n.bindFramebuffer(t.DRAW_FRAMEBUFFER,de.__webglFramebuffer);for(let oe=0;oe<v.length;oe++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(q|=t.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(q|=t.STENCIL_BUFFER_BIT)),B){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,de.__webglColorRenderbuffer[oe]);const xe=i.get(v[oe]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,xe,0)}t.blitFramebuffer(0,0,k,X,0,0,k,X,q,t.NEAREST),l===!0&&(ht.length=0,Rt.length=0,ht.push(t.COLOR_ATTACHMENT0+oe),R.depthBuffer&&R.resolveDepthBuffer===!1&&(ht.push(ae),Rt.push(ae),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,Rt)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,ht))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),B)for(let oe=0;oe<v.length;oe++){n.bindFramebuffer(t.FRAMEBUFFER,de.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+oe,t.RENDERBUFFER,de.__webglColorRenderbuffer[oe]);const xe=i.get(v[oe]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,de.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+oe,t.TEXTURE_2D,xe,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,de.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const v=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[v])}}}function ut(R){return Math.min(r.maxSamples,R.samples)}function Mt(R){const v=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function U(R){const v=a.render.frame;d.get(R)!==v&&(d.set(R,v),R.update())}function Wt(R,v){const k=R.colorSpace,X=R.format,q=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||k!==jl&&k!==er&&(qe.getTransfer(k)===rt?(X!==Zn||q!==kn)&&Le("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Qe("WebGLTextures: Unsupported texture color space:",k)),v}function Ye(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=H,this.resetTextureUnits=K,this.getTextureUnits=ee,this.setTextureUnits=O,this.setTexture2D=L,this.setTexture2DArray=j,this.setTexture3D=Q,this.setTextureCube=ne,this.rebindTextures=Ke,this.setupRenderTarget=$e,this.updateRenderTargetMipmap=St,this.updateMultisampleRenderTarget=xt,this.setupDepthRenderbuffer=et,this.setupFrameBufferTexture=Pe,this.useMultisampledRTT=Mt,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function _A(t,e){function n(i,r=er){let s;const a=qe.getTransfer(r);if(i===kn)return t.UNSIGNED_BYTE;if(i===hh)return t.UNSIGNED_SHORT_4_4_4_4;if(i===ph)return t.UNSIGNED_SHORT_5_5_5_1;if(i===j_)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===$_)return t.UNSIGNED_INT_10F_11F_11F_REV;if(i===W_)return t.BYTE;if(i===X_)return t.SHORT;if(i===ja)return t.UNSIGNED_SHORT;if(i===dh)return t.INT;if(i===_i)return t.UNSIGNED_INT;if(i===fi)return t.FLOAT;if(i===Cn)return t.HALF_FLOAT;if(i===Y_)return t.ALPHA;if(i===q_)return t.RGB;if(i===Zn)return t.RGBA;if(i===Oi)return t.DEPTH_COMPONENT;if(i===Lr)return t.DEPTH_STENCIL;if(i===K_)return t.RED;if(i===mh)return t.RED_INTEGER;if(i===Hr)return t.RG;if(i===gh)return t.RG_INTEGER;if(i===_h)return t.RGBA_INTEGER;if(i===ul||i===fl||i===dl||i===hl)if(a===rt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===ul)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===fl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===dl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===hl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===ul)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===fl)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===dl)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===hl)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Uf||i===Ff||i===Of||i===kf)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Uf)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ff)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Of)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===kf)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Bf||i===zf||i===Vf||i===Hf||i===Gf||i===Wl||i===Wf)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Bf||i===zf)return a===rt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Vf)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===Hf)return s.COMPRESSED_R11_EAC;if(i===Gf)return s.COMPRESSED_SIGNED_R11_EAC;if(i===Wl)return s.COMPRESSED_RG11_EAC;if(i===Wf)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Xf||i===jf||i===$f||i===Yf||i===qf||i===Kf||i===Zf||i===Qf||i===Jf||i===ed||i===td||i===nd||i===id||i===rd)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Xf)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===jf)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===$f)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Yf)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===qf)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Kf)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Zf)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Qf)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Jf)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===ed)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===td)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===nd)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===id)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===rd)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===sd||i===ad||i===od)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===sd)return a===rt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ad)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===od)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===ld||i===cd||i===Xl||i===ud)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===ld)return s.COMPRESSED_RED_RGTC1_EXT;if(i===cd)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Xl)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ud)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===$a?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}const vA=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,xA=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class yA{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n){if(this.texture===null){const i=new sv(e.texture);(e.depthNear!==n.depthNear||e.depthFar!==n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new $t({vertexShader:vA,fragmentShader:xA,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new vi(new _c(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class SA extends xr{constructor(e,n){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,d=null,h=null,u=null,p=null,m=null;const E=typeof XRWebGLBinding<"u",g=new yA,f={},_=n.getContextAttributes();let S=null,y=null;const b=[],w=[],A=new Ne;let x=null;const C=new On;C.viewport=new Ct;const N=new On;N.viewport=new Ct;const P=[C,N],z=new AE;let K=null,ee=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let se=b[Z];return se===void 0&&(se=new ru,b[Z]=se),se.getTargetRaySpace()},this.getControllerGrip=function(Z){let se=b[Z];return se===void 0&&(se=new ru,b[Z]=se),se.getGripSpace()},this.getHand=function(Z){let se=b[Z];return se===void 0&&(se=new ru,b[Z]=se),se.getHandSpace()};function O(Z){const se=w.indexOf(Z.inputSource);if(se===-1)return;const ie=b[se];ie!==void 0&&(ie.update(Z.inputSource,Z.frame,c||a),ie.dispatchEvent({type:Z.type,data:Z.inputSource}))}function H(){r.removeEventListener("select",O),r.removeEventListener("selectstart",O),r.removeEventListener("selectend",O),r.removeEventListener("squeeze",O),r.removeEventListener("squeezestart",O),r.removeEventListener("squeezeend",O),r.removeEventListener("end",H),r.removeEventListener("inputsourceschange",I);for(let Z=0;Z<b.length;Z++){const se=w[Z];se!==null&&(w[Z]=null,b[Z].disconnect(se))}K=null,ee=null,g.reset();for(const Z in f)delete f[Z];e.setRenderTarget(S),p=null,u=null,h=null,r=null,y=null,He.stop(),i.isPresenting=!1,e.setPixelRatio(x),e.setSize(A.width,A.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){s=Z,i.isPresenting===!0&&Le("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,i.isPresenting===!0&&Le("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return h===null&&E&&(h=new XRWebGLBinding(r,n)),h},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(Z){if(r=Z,r!==null){if(S=e.getRenderTarget(),r.addEventListener("select",O),r.addEventListener("selectstart",O),r.addEventListener("selectend",O),r.addEventListener("squeeze",O),r.addEventListener("squeezestart",O),r.addEventListener("squeezeend",O),r.addEventListener("end",H),r.addEventListener("inputsourceschange",I),_.xrCompatible!==!0&&await n.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(A),E&&"createProjectionLayer"in XRWebGLBinding.prototype){let ie=null,De=null,Ue=null;_.depth&&(Ue=_.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,ie=_.stencil?Lr:Oi,De=_.stencil?$a:_i);const Pe={colorFormat:n.RGBA8,depthFormat:Ue,scaleFactor:s};h=this.getBinding(),u=h.createProjectionLayer(Pe),r.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),y=new yn(u.textureWidth,u.textureHeight,{format:Zn,type:kn,depthTexture:new Xs(u.textureWidth,u.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,ie),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const ie={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,n,ie),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),y=new yn(p.framebufferWidth,p.framebufferHeight,{format:Zn,type:kn,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),He.setContext(r),He.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function I(Z){for(let se=0;se<Z.removed.length;se++){const ie=Z.removed[se],De=w.indexOf(ie);De>=0&&(w[De]=null,b[De].disconnect(ie))}for(let se=0;se<Z.added.length;se++){const ie=Z.added[se];let De=w.indexOf(ie);if(De===-1){for(let Pe=0;Pe<b.length;Pe++)if(Pe>=w.length){w.push(ie),De=Pe;break}else if(w[Pe]===null){w[Pe]=ie,De=Pe;break}if(De===-1)break}const Ue=b[De];Ue&&Ue.connect(ie)}}const L=new V,j=new V;function Q(Z,se,ie){L.setFromMatrixPosition(se.matrixWorld),j.setFromMatrixPosition(ie.matrixWorld);const De=L.distanceTo(j),Ue=se.projectionMatrix.elements,Pe=ie.projectionMatrix.elements,at=Ue[14]/(Ue[10]-1),Be=Ue[14]/(Ue[10]+1),et=(Ue[9]+1)/Ue[5],Ke=(Ue[9]-1)/Ue[5],$e=(Ue[8]-1)/Ue[0],St=(Pe[8]+1)/Pe[0],ht=at*$e,Rt=at*St,xt=De/(-$e+St),ut=xt*-$e;if(se.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(ut),Z.translateZ(xt),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),Ue[10]===-1)Z.projectionMatrix.copy(se.projectionMatrix),Z.projectionMatrixInverse.copy(se.projectionMatrixInverse);else{const Mt=at+xt,U=Be+xt,Wt=ht-ut,Ye=Rt+(De-ut),R=et*Be/U*Mt,v=Ke*Be/U*Mt;Z.projectionMatrix.makePerspective(Wt,Ye,R,v,Mt,U),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function ne(Z,se){se===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(se.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(r===null)return;let se=Z.near,ie=Z.far;g.texture!==null&&(g.depthNear>0&&(se=g.depthNear),g.depthFar>0&&(ie=g.depthFar)),z.near=N.near=C.near=se,z.far=N.far=C.far=ie,(K!==z.near||ee!==z.far)&&(r.updateRenderState({depthNear:z.near,depthFar:z.far}),K=z.near,ee=z.far),z.layers.mask=Z.layers.mask|6,C.layers.mask=z.layers.mask&-5,N.layers.mask=z.layers.mask&-3;const De=Z.parent,Ue=z.cameras;ne(z,De);for(let Pe=0;Pe<Ue.length;Pe++)ne(Ue[Pe],De);Ue.length===2?Q(z,C,N):z.projectionMatrix.copy(C.projectionMatrix),le(Z,z,De)};function le(Z,se,ie){ie===null?Z.matrix.copy(se.matrixWorld):(Z.matrix.copy(ie.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(se.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(se.projectionMatrix),Z.projectionMatrixInverse.copy(se.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=fd*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return z},this.getFoveation=function(){if(!(u===null&&p===null))return l},this.setFoveation=function(Z){l=Z,u!==null&&(u.fixedFoveation=Z),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Z)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(z)},this.getCameraTexture=function(Z){return f[Z]};let Oe=null;function ke(Z,se){if(d=se.getViewerPose(c||a),m=se,d!==null){const ie=d.views;p!==null&&(e.setRenderTargetFramebuffer(y,p.framebuffer),e.setRenderTarget(y));let De=!1;ie.length!==z.cameras.length&&(z.cameras.length=0,De=!0);for(let Be=0;Be<ie.length;Be++){const et=ie[Be];let Ke=null;if(p!==null)Ke=p.getViewport(et);else{const St=h.getViewSubImage(u,et);Ke=St.viewport,Be===0&&(e.setRenderTargetTextures(y,St.colorTexture,St.depthStencilTexture),e.setRenderTarget(y))}let $e=P[Be];$e===void 0&&($e=new On,$e.layers.enable(Be),$e.viewport=new Ct,P[Be]=$e),$e.matrix.fromArray(et.transform.matrix),$e.matrix.decompose($e.position,$e.quaternion,$e.scale),$e.projectionMatrix.fromArray(et.projectionMatrix),$e.projectionMatrixInverse.copy($e.projectionMatrix).invert(),$e.viewport.set(Ke.x,Ke.y,Ke.width,Ke.height),Be===0&&(z.matrix.copy($e.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale)),De===!0&&z.cameras.push($e)}const Ue=r.enabledFeatures;if(Ue&&Ue.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&E){h=i.getBinding();const Be=h.getDepthInformation(ie[0]);Be&&Be.isValid&&Be.texture&&g.init(Be,r.renderState)}if(Ue&&Ue.includes("camera-access")&&E){e.state.unbindTexture(),h=i.getBinding();for(let Be=0;Be<ie.length;Be++){const et=ie[Be].camera;if(et){let Ke=f[et];Ke||(Ke=new sv,f[et]=Ke);const $e=h.getCameraImage(et);Ke.sourceTexture=$e}}}}for(let ie=0;ie<b.length;ie++){const De=w[ie],Ue=b[ie];De!==null&&Ue!==void 0&&Ue.update(De,se,c||a)}Oe&&Oe(Z,se),se.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:se}),m=null}const He=new lv;He.setAnimationLoop(ke),this.setAnimationLoop=function(Z){Oe=Z},this.dispose=function(){}}}const MA=new Lt,mv=new Fe;mv.set(-1,0,0,0,1,0,0,0,1);function EA(t,e){function n(g,f){g.matrixAutoUpdate===!0&&g.updateMatrix(),f.value.copy(g.matrix)}function i(g,f){f.color.getRGB(g.fogColor.value,av(t)),f.isFog?(g.fogNear.value=f.near,g.fogFar.value=f.far):f.isFogExp2&&(g.fogDensity.value=f.density)}function r(g,f,_,S,y){f.isNodeMaterial?f.uniformsNeedUpdate=!1:f.isMeshBasicMaterial?s(g,f):f.isMeshLambertMaterial?(s(g,f),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)):f.isMeshToonMaterial?(s(g,f),h(g,f)):f.isMeshPhongMaterial?(s(g,f),d(g,f),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)):f.isMeshStandardMaterial?(s(g,f),u(g,f),f.isMeshPhysicalMaterial&&p(g,f,y)):f.isMeshMatcapMaterial?(s(g,f),m(g,f)):f.isMeshDepthMaterial?s(g,f):f.isMeshDistanceMaterial?(s(g,f),E(g,f)):f.isMeshNormalMaterial?s(g,f):f.isLineBasicMaterial?(a(g,f),f.isLineDashedMaterial&&o(g,f)):f.isPointsMaterial?l(g,f,_,S):f.isSpriteMaterial?c(g,f):f.isShadowMaterial?(g.color.value.copy(f.color),g.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(g,f){g.opacity.value=f.opacity,f.color&&g.diffuse.value.copy(f.color),f.emissive&&g.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(g.map.value=f.map,n(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,n(f.alphaMap,g.alphaMapTransform)),f.bumpMap&&(g.bumpMap.value=f.bumpMap,n(f.bumpMap,g.bumpMapTransform),g.bumpScale.value=f.bumpScale,f.side===xn&&(g.bumpScale.value*=-1)),f.normalMap&&(g.normalMap.value=f.normalMap,n(f.normalMap,g.normalMapTransform),g.normalScale.value.copy(f.normalScale),f.side===xn&&g.normalScale.value.negate()),f.displacementMap&&(g.displacementMap.value=f.displacementMap,n(f.displacementMap,g.displacementMapTransform),g.displacementScale.value=f.displacementScale,g.displacementBias.value=f.displacementBias),f.emissiveMap&&(g.emissiveMap.value=f.emissiveMap,n(f.emissiveMap,g.emissiveMapTransform)),f.specularMap&&(g.specularMap.value=f.specularMap,n(f.specularMap,g.specularMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest);const _=e.get(f),S=_.envMap,y=_.envMapRotation;S&&(g.envMap.value=S,g.envMapRotation.value.setFromMatrix4(MA.makeRotationFromEuler(y)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(mv),g.reflectivity.value=f.reflectivity,g.ior.value=f.ior,g.refractionRatio.value=f.refractionRatio),f.lightMap&&(g.lightMap.value=f.lightMap,g.lightMapIntensity.value=f.lightMapIntensity,n(f.lightMap,g.lightMapTransform)),f.aoMap&&(g.aoMap.value=f.aoMap,g.aoMapIntensity.value=f.aoMapIntensity,n(f.aoMap,g.aoMapTransform))}function a(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,f.map&&(g.map.value=f.map,n(f.map,g.mapTransform))}function o(g,f){g.dashSize.value=f.dashSize,g.totalSize.value=f.dashSize+f.gapSize,g.scale.value=f.scale}function l(g,f,_,S){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.size.value=f.size*_,g.scale.value=S*.5,f.map&&(g.map.value=f.map,n(f.map,g.uvTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,n(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function c(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.rotation.value=f.rotation,f.map&&(g.map.value=f.map,n(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,n(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function d(g,f){g.specular.value.copy(f.specular),g.shininess.value=Math.max(f.shininess,1e-4)}function h(g,f){f.gradientMap&&(g.gradientMap.value=f.gradientMap)}function u(g,f){g.metalness.value=f.metalness,f.metalnessMap&&(g.metalnessMap.value=f.metalnessMap,n(f.metalnessMap,g.metalnessMapTransform)),g.roughness.value=f.roughness,f.roughnessMap&&(g.roughnessMap.value=f.roughnessMap,n(f.roughnessMap,g.roughnessMapTransform)),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)}function p(g,f,_){g.ior.value=f.ior,f.sheen>0&&(g.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),g.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(g.sheenColorMap.value=f.sheenColorMap,n(f.sheenColorMap,g.sheenColorMapTransform)),f.sheenRoughnessMap&&(g.sheenRoughnessMap.value=f.sheenRoughnessMap,n(f.sheenRoughnessMap,g.sheenRoughnessMapTransform))),f.clearcoat>0&&(g.clearcoat.value=f.clearcoat,g.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(g.clearcoatMap.value=f.clearcoatMap,n(f.clearcoatMap,g.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,n(f.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(g.clearcoatNormalMap.value=f.clearcoatNormalMap,n(f.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===xn&&g.clearcoatNormalScale.value.negate())),f.dispersion>0&&(g.dispersion.value=f.dispersion),f.iridescence>0&&(g.iridescence.value=f.iridescence,g.iridescenceIOR.value=f.iridescenceIOR,g.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(g.iridescenceMap.value=f.iridescenceMap,n(f.iridescenceMap,g.iridescenceMapTransform)),f.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=f.iridescenceThicknessMap,n(f.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),f.transmission>0&&(g.transmission.value=f.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),f.transmissionMap&&(g.transmissionMap.value=f.transmissionMap,n(f.transmissionMap,g.transmissionMapTransform)),g.thickness.value=f.thickness,f.thicknessMap&&(g.thicknessMap.value=f.thicknessMap,n(f.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=f.attenuationDistance,g.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(g.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(g.anisotropyMap.value=f.anisotropyMap,n(f.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=f.specularIntensity,g.specularColor.value.copy(f.specularColor),f.specularColorMap&&(g.specularColorMap.value=f.specularColorMap,n(f.specularColorMap,g.specularColorMapTransform)),f.specularIntensityMap&&(g.specularIntensityMap.value=f.specularIntensityMap,n(f.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,f){f.matcap&&(g.matcap.value=f.matcap)}function E(g,f){const _=e.get(f).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function TA(t,e,n,i){let r={},s={},a=[];const o=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,b){const w=b.program;i.uniformBlockBinding(y,w)}function c(y,b){let w=r[y.id];w===void 0&&(g(y),w=d(y),r[y.id]=w,y.addEventListener("dispose",_));const A=b.program;i.updateUBOMapping(y,A);const x=e.render.frame;s[y.id]!==x&&(u(y),s[y.id]=x)}function d(y){const b=h();y.__bindingPointIndex=b;const w=t.createBuffer(),A=y.__size,x=y.usage;return t.bindBuffer(t.UNIFORM_BUFFER,w),t.bufferData(t.UNIFORM_BUFFER,A,x),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,b,w),w}function h(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return Qe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){const b=r[y.id],w=y.uniforms,A=y.__cache;t.bindBuffer(t.UNIFORM_BUFFER,b);for(let x=0,C=w.length;x<C;x++){const N=w[x];if(Array.isArray(N))for(let P=0,z=N.length;P<z;P++)p(N[P],x,P,A);else p(N,x,0,A)}t.bindBuffer(t.UNIFORM_BUFFER,null)}function p(y,b,w,A){if(E(y,b,w,A)===!0){const x=y.__offset,C=y.value;if(Array.isArray(C)){let N=0;for(let P=0;P<C.length;P++){const z=C[P],K=f(z);m(z,y.__data,N),typeof z!="number"&&typeof z!="boolean"&&!z.isMatrix3&&!ArrayBuffer.isView(z)&&(N+=K.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(C,y.__data,0);t.bufferSubData(t.UNIFORM_BUFFER,x,y.__data)}}function m(y,b,w){typeof y=="number"||typeof y=="boolean"?b[0]=y:y.isMatrix3?(b[0]=y.elements[0],b[1]=y.elements[1],b[2]=y.elements[2],b[3]=0,b[4]=y.elements[3],b[5]=y.elements[4],b[6]=y.elements[5],b[7]=0,b[8]=y.elements[6],b[9]=y.elements[7],b[10]=y.elements[8],b[11]=0):ArrayBuffer.isView(y)?b.set(new y.constructor(y.buffer,y.byteOffset,b.length)):y.toArray(b,w)}function E(y,b,w,A){const x=y.value,C=b+"_"+w;if(A[C]===void 0)return typeof x=="number"||typeof x=="boolean"?A[C]=x:ArrayBuffer.isView(x)?A[C]=x.slice():A[C]=x.clone(),!0;{const N=A[C];if(typeof x=="number"||typeof x=="boolean"){if(N!==x)return A[C]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(N.equals(x)===!1)return N.copy(x),!0}}return!1}function g(y){const b=y.uniforms;let w=0;const A=16;for(let C=0,N=b.length;C<N;C++){const P=Array.isArray(b[C])?b[C]:[b[C]];for(let z=0,K=P.length;z<K;z++){const ee=P[z],O=Array.isArray(ee.value)?ee.value:[ee.value];for(let H=0,I=O.length;H<I;H++){const L=O[H],j=f(L),Q=w%A,ne=Q%j.boundary,le=Q+ne;w+=ne,le!==0&&A-le<j.storage&&(w+=A-le),ee.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),ee.__offset=w,w+=j.storage}}}const x=w%A;return x>0&&(w+=A-x),y.__size=w,y.__cache={},this}function f(y){const b={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(b.boundary=4,b.storage=4):y.isVector2?(b.boundary=8,b.storage=8):y.isVector3||y.isColor?(b.boundary=16,b.storage=12):y.isVector4?(b.boundary=16,b.storage=16):y.isMatrix3?(b.boundary=48,b.storage=48):y.isMatrix4?(b.boundary=64,b.storage=64):y.isTexture?Le("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(b.boundary=16,b.storage=y.byteLength):Le("WebGLRenderer: Unsupported uniform value type.",y),b}function _(y){const b=y.target;b.removeEventListener("dispose",_);const w=a.indexOf(b.__bindingPointIndex);a.splice(w,1),t.deleteBuffer(r[b.id]),delete r[b.id],delete s[b.id]}function S(){for(const y in r)t.deleteBuffer(r[y]);a=[],r={},s={}}return{bind:l,update:c,dispose:S}}const wA=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let oi=null;function bA(){return oi===null&&(oi=new pE(wA,16,16,Hr,Cn),oi.name="DFG_LUT",oi.minFilter=nn,oi.magFilter=nn,oi.wrapS=Pi,oi.wrapT=Pi,oi.generateMipmaps=!1,oi.needsUpdate=!0),oi}class AA{constructor(e={}){const{canvas:n=WM(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:u=!1,outputBufferType:p=kn}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=a;const E=p,g=new Set([_h,gh,mh]),f=new Set([kn,_i,ja,$a,hh,ph]),_=new Uint32Array(4),S=new Int32Array(4),y=new V;let b=null,w=null;const A=[],x=[];let C=null;this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=gi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const N=this;let P=!1,z=null,K=null,ee=null,O=null;this._outputColorSpace=In;let H=0,I=0,L=null,j=-1,Q=null;const ne=new Ct,le=new Ct;let Oe=null;const ke=new ze(0);let He=0,Z=n.width,se=n.height,ie=1,De=null,Ue=null;const Pe=new Ct(0,0,Z,se),at=new Ct(0,0,Z,se);let Be=!1;const et=new iv;let Ke=!1,$e=!1;const St=new Lt,ht=new V,Rt=new Ct,xt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ut=!1;function Mt(){return L===null?ie:1}let U=i;function Wt(T,F){return n.getContext(T,F)}try{const T={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:h};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${uh}`),n.addEventListener("webglcontextlost",ot,!1),n.addEventListener("webglcontextrestored",nt,!1),n.addEventListener("webglcontextcreationerror",ni,!1),U===null){const F="webgl2";if(U=Wt(F,T),U===null)throw Wt(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(T){throw Qe("WebGLRenderer: "+T.message),T}let Ye,R,v,k,X,q,ae,de,B,Y,oe,xe,ce,ue,be,Re,Ie,D,fe,J,he,pe,te;function Te(){Ye=new bw(U),Ye.init(),he=new _A(U,Ye),R=new vw(U,Ye,e,he),v=new mA(U,Ye),R.reversedDepthBuffer&&u&&v.buffers.depth.setReversed(!0),K=U.createFramebuffer(),ee=U.createFramebuffer(),O=U.createFramebuffer(),k=new Rw(U),X=new tA,q=new gA(U,Ye,v,X,R,he,k),ae=new ww(N),de=new LE(U),pe=new gw(U,de),B=new Aw(U,de,k,pe),Y=new Nw(U,B,de,pe,k),D=new Pw(U,R,q),be=new xw(X),oe=new eA(N,ae,Ye,R,pe,be),xe=new EA(N,X),ce=new iA,ue=new cA(Ye),Ie=new mw(N,ae,v,Y,m,l),Re=new pA(N,Y,R),te=new TA(U,k,R,v),fe=new _w(U,Ye,k),J=new Cw(U,Ye,k),k.programs=oe.programs,N.capabilities=R,N.extensions=Ye,N.properties=X,N.renderLists=ce,N.shadowMap=Re,N.state=v,N.info=k}Te(),E!==kn&&(C=new Lw(E,n.width,n.height,o,r,s));const Ee=new SA(N,U);this.xr=Ee,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const T=Ye.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Ye.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return ie},this.setPixelRatio=function(T){T!==void 0&&(ie=T,this.setSize(Z,se,!1))},this.getSize=function(T){return T.set(Z,se)},this.setSize=function(T,F,$=!0){if(Ee.isPresenting){Le("WebGLRenderer: Can't change size while VR device is presenting.");return}Z=T,se=F,n.width=Math.floor(T*ie),n.height=Math.floor(F*ie),$===!0&&(n.style.width=T+"px",n.style.height=F+"px"),C!==null&&C.setSize(n.width,n.height),this.setViewport(0,0,T,F)},this.getDrawingBufferSize=function(T){return T.set(Z*ie,se*ie).floor()},this.setDrawingBufferSize=function(T,F,$){Z=T,se=F,ie=$,n.width=Math.floor(T*$),n.height=Math.floor(F*$),this.setViewport(0,0,T,F)},this.setEffects=function(T){if(E===kn){Qe("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(T){for(let F=0;F<T.length;F++)if(T[F].isOutputPass===!0){Le("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}C.setEffects(T||[])},this.getCurrentViewport=function(T){return T.copy(ne)},this.getViewport=function(T){return T.copy(Pe)},this.setViewport=function(T,F,$,G){T.isVector4?Pe.set(T.x,T.y,T.z,T.w):Pe.set(T,F,$,G),v.viewport(ne.copy(Pe).multiplyScalar(ie).round())},this.getScissor=function(T){return T.copy(at)},this.setScissor=function(T,F,$,G){T.isVector4?at.set(T.x,T.y,T.z,T.w):at.set(T,F,$,G),v.scissor(le.copy(at).multiplyScalar(ie).round())},this.getScissorTest=function(){return Be},this.setScissorTest=function(T){v.setScissorTest(Be=T)},this.setOpaqueSort=function(T){De=T},this.setTransparentSort=function(T){Ue=T},this.getClearColor=function(T){return T.copy(Ie.getClearColor())},this.setClearColor=function(){Ie.setClearColor(...arguments)},this.getClearAlpha=function(){return Ie.getClearAlpha()},this.setClearAlpha=function(){Ie.setClearAlpha(...arguments)},this.clear=function(T=!0,F=!0,$=!0){let G=0;if(T){let W=!1;if(L!==null){const _e=L.texture.format;W=g.has(_e)}if(W){const _e=L.texture.type,Se=f.has(_e),ge=Ie.getClearColor(),we=Ie.getClearAlpha(),Ae=ge.r,Ve=ge.g,We=ge.b;Se?(_[0]=Ae,_[1]=Ve,_[2]=We,_[3]=we,U.clearBufferuiv(U.COLOR,0,_)):(S[0]=Ae,S[1]=Ve,S[2]=We,S[3]=we,U.clearBufferiv(U.COLOR,0,S))}else G|=U.COLOR_BUFFER_BIT}F&&(G|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),$&&(G|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&U.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(T){T.setRenderer(this),z=T},this.dispose=function(){n.removeEventListener("webglcontextlost",ot,!1),n.removeEventListener("webglcontextrestored",nt,!1),n.removeEventListener("webglcontextcreationerror",ni,!1),Ie.dispose(),ce.dispose(),ue.dispose(),X.dispose(),ae.dispose(),Y.dispose(),pe.dispose(),te.dispose(),oe.dispose(),Ee.dispose(),Ee.removeEventListener("sessionstart",Nh),Ee.removeEventListener("sessionend",Dh),yr.stop()};function ot(T){T.preventDefault(),dm("WebGLRenderer: Context Lost."),P=!0}function nt(){dm("WebGLRenderer: Context Restored."),P=!1;const T=k.autoReset,F=Re.enabled,$=Re.autoUpdate,G=Re.needsUpdate,W=Re.type;Te(),k.autoReset=T,Re.enabled=F,Re.autoUpdate=$,Re.needsUpdate=G,Re.type=W}function ni(T){Qe("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function ii(T){const F=T.target;F.removeEventListener("dispose",ii),xv(F)}function xv(T){yv(T),X.remove(T)}function yv(T){const F=X.get(T).programs;F!==void 0&&(F.forEach(function($){oe.releaseProgram($)}),T.isShaderMaterial&&oe.releaseShaderCache(T))}this.renderBufferDirect=function(T,F,$,G,W,_e){F===null&&(F=xt);const Se=W.isMesh&&W.matrixWorld.determinantAffine()<0,ge=Ev(T,F,$,G,W);v.setMaterial(G,Se);let we=$.index,Ae=1;if(G.wireframe===!0){if(we=B.getWireframeAttribute($),we===void 0)return;Ae=2}const Ve=$.drawRange,We=$.attributes.position;let Ce=Ve.start*Ae,lt=(Ve.start+Ve.count)*Ae;_e!==null&&(Ce=Math.max(Ce,_e.start*Ae),lt=Math.min(lt,(_e.start+_e.count)*Ae)),we!==null?(Ce=Math.max(Ce,0),lt=Math.min(lt,we.count)):We!=null&&(Ce=Math.max(Ce,0),lt=Math.min(lt,We.count));const Pt=lt-Ce;if(Pt<0||Pt===1/0)return;pe.setup(W,G,ge,$,we);let bt,ft=fe;if(we!==null&&(bt=de.get(we),ft=J,ft.setIndex(bt)),W.isMesh)G.wireframe===!0?(v.setLineWidth(G.wireframeLinewidth*Mt()),ft.setMode(U.LINES)):ft.setMode(U.TRIANGLES);else if(W.isLine){let Kt=G.linewidth;Kt===void 0&&(Kt=1),v.setLineWidth(Kt*Mt()),W.isLineSegments?ft.setMode(U.LINES):W.isLineLoop?ft.setMode(U.LINE_LOOP):ft.setMode(U.LINE_STRIP)}else W.isPoints?ft.setMode(U.POINTS):W.isSprite&&ft.setMode(U.TRIANGLES);if(W.isBatchedMesh)if(Ye.get("WEBGL_multi_draw"))ft.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const Kt=W._multiDrawStarts,ye=W._multiDrawCounts,Mn=W._multiDrawCount,Ze=we?de.get(we).bytesPerElement:1,Dn=X.get(G).currentProgram.getUniforms();for(let ri=0;ri<Mn;ri++)Dn.setValue(U,"_gl_DrawID",ri),ft.render(Kt[ri]/Ze,ye[ri])}else if(W.isInstancedMesh)ft.renderInstances(Ce,Pt,W.count);else if($.isInstancedBufferGeometry){const Kt=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,ye=Math.min($.instanceCount,Kt);ft.renderInstances(Ce,Pt,ye)}else ft.render(Ce,Pt)};function Ph(T,F,$){T.transparent===!0&&T.side===Ai&&T.forceSinglePass===!1?(T.side=xn,T.needsUpdate=!0,so(T,F,$),T.side=pr,T.needsUpdate=!0,so(T,F,$),T.side=Ai):so(T,F,$)}this.compile=function(T,F,$=null){$===null&&($=T),w=ue.get($),w.init(F),x.push(w),$.traverseVisible(function(W){W.isLight&&W.layers.test(F.layers)&&(w.pushLight(W),W.castShadow&&w.pushShadow(W))}),T!==$&&T.traverseVisible(function(W){W.isLight&&W.layers.test(F.layers)&&(w.pushLight(W),W.castShadow&&w.pushShadow(W))}),w.setupLights();const G=new Set;return T.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const _e=W.material;if(_e)if(Array.isArray(_e))for(let Se=0;Se<_e.length;Se++){const ge=_e[Se];Ph(ge,$,W),G.add(ge)}else Ph(_e,$,W),G.add(_e)}),w=x.pop(),G},this.compileAsync=function(T,F,$=null){const G=this.compile(T,F,$);return new Promise(W=>{function _e(){if(G.forEach(function(Se){X.get(Se).currentProgram.isReady()&&G.delete(Se)}),G.size===0){W(T);return}setTimeout(_e,10)}Ye.get("KHR_parallel_shader_compile")!==null?_e():setTimeout(_e,10)})};let yc=null;function Sv(T){yc&&yc(T)}function Nh(){yr.stop()}function Dh(){yr.start()}const yr=new lv;yr.setAnimationLoop(Sv),typeof self<"u"&&yr.setContext(self),this.setAnimationLoop=function(T){yc=T,Ee.setAnimationLoop(T),T===null?yr.stop():yr.start()},Ee.addEventListener("sessionstart",Nh),Ee.addEventListener("sessionend",Dh),this.render=function(T,F){if(F!==void 0&&F.isCamera!==!0){Qe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;z!==null&&z.renderStart(T,F);const $=Ee.enabled===!0&&Ee.isPresenting===!0,G=C!==null&&(L===null||$)&&C.begin(N,L);if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Ee.enabled===!0&&Ee.isPresenting===!0&&(C===null||C.isCompositing()===!1)&&(Ee.cameraAutoUpdate===!0&&Ee.updateCamera(F),F=Ee.getCamera()),T.isScene===!0&&T.onBeforeRender(N,T,F,L),w=ue.get(T,x.length),w.init(F),w.state.textureUnits=q.getTextureUnits(),x.push(w),St.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),et.setFromProjectionMatrix(St,di,F.reversedDepth),$e=this.localClippingEnabled,Ke=be.init(this.clippingPlanes,$e),b=ce.get(T,A.length),b.init(),A.push(b),Ee.enabled===!0&&Ee.isPresenting===!0){const Se=N.xr.getDepthSensingMesh();Se!==null&&Sc(Se,F,-1/0,N.sortObjects)}Sc(T,F,0,N.sortObjects),b.finish(),N.sortObjects===!0&&b.sort(De,Ue,F.reversedDepth),ut=Ee.enabled===!1||Ee.isPresenting===!1||Ee.hasDepthSensing()===!1,ut&&Ie.addToRenderList(b,T),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ke===!0&&be.beginShadows();const W=w.state.shadowsArray;if(Re.render(W,T,F),Ke===!0&&be.endShadows(),(G&&C.hasRenderPass())===!1){const Se=b.opaque,ge=b.transmissive;if(w.setupLights(),F.isArrayCamera){const we=F.cameras;if(ge.length>0)for(let Ae=0,Ve=we.length;Ae<Ve;Ae++){const We=we[Ae];Ih(Se,ge,T,We)}ut&&Ie.render(T);for(let Ae=0,Ve=we.length;Ae<Ve;Ae++){const We=we[Ae];Lh(b,T,We,We.viewport)}}else ge.length>0&&Ih(Se,ge,T,F),ut&&Ie.render(T),Lh(b,T,F)}L!==null&&I===0&&(q.updateMultisampleRenderTarget(L),q.updateRenderTargetMipmap(L)),G&&C.end(N),T.isScene===!0&&T.onAfterRender(N,T,F),pe.resetDefaultState(),j=-1,Q=null,x.pop(),x.length>0?(w=x[x.length-1],q.setTextureUnits(w.state.textureUnits),Ke===!0&&be.setGlobalState(N.clippingPlanes,w.state.camera)):w=null,A.pop(),A.length>0?b=A[A.length-1]:b=null,z!==null&&z.renderEnd()};function Sc(T,F,$,G){if(T.visible===!1)return;if(T.layers.test(F.layers)){if(T.isGroup)$=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(F);else if(T.isLightProbeGrid)w.pushLightProbeGrid(T);else if(T.isLight)w.pushLight(T),T.castShadow&&w.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||et.intersectsSprite(T)){G&&Rt.setFromMatrixPosition(T.matrixWorld).applyMatrix4(St);const Se=Y.update(T),ge=T.material;ge.visible&&b.push(T,Se,ge,$,Rt.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||et.intersectsObject(T))){const Se=Y.update(T),ge=T.material;if(G&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Rt.copy(T.boundingSphere.center)):(Se.boundingSphere===null&&Se.computeBoundingSphere(),Rt.copy(Se.boundingSphere.center)),Rt.applyMatrix4(T.matrixWorld).applyMatrix4(St)),Array.isArray(ge)){const we=Se.groups;for(let Ae=0,Ve=we.length;Ae<Ve;Ae++){const We=we[Ae],Ce=ge[We.materialIndex];Ce&&Ce.visible&&b.push(T,Se,Ce,$,Rt.z,We)}}else ge.visible&&b.push(T,Se,ge,$,Rt.z,null)}}const _e=T.children;for(let Se=0,ge=_e.length;Se<ge;Se++)Sc(_e[Se],F,$,G)}function Lh(T,F,$,G){const{opaque:W,transmissive:_e,transparent:Se}=T;w.setupLightsView($),Ke===!0&&be.setGlobalState(N.clippingPlanes,$),G&&v.viewport(ne.copy(G)),W.length>0&&ro(W,F,$),_e.length>0&&ro(_e,F,$),Se.length>0&&ro(Se,F,$),v.buffers.depth.setTest(!0),v.buffers.depth.setMask(!0),v.buffers.color.setMask(!0),v.setPolygonOffset(!1)}function Ih(T,F,$,G){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[G.id]===void 0){const Ce=Ye.has("EXT_color_buffer_half_float")||Ye.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[G.id]=new yn(1,1,{generateMipmaps:!0,type:Ce?Cn:kn,minFilter:Dr,samples:Math.max(4,R.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:qe.workingColorSpace})}const _e=w.state.transmissionRenderTarget[G.id],Se=G.viewport||ne;_e.setSize(Se.z*N.transmissionResolutionScale,Se.w*N.transmissionResolutionScale);const ge=N.getRenderTarget(),we=N.getActiveCubeFace(),Ae=N.getActiveMipmapLevel();N.setRenderTarget(_e),N.getClearColor(ke),He=N.getClearAlpha(),He<1&&N.setClearColor(16777215,.5),N.clear(),ut&&Ie.render($);const Ve=N.toneMapping;N.toneMapping=gi;const We=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),w.setupLightsView(G),Ke===!0&&be.setGlobalState(N.clippingPlanes,G),ro(T,$,G),q.updateMultisampleRenderTarget(_e),q.updateRenderTargetMipmap(_e),Ye.has("WEBGL_multisampled_render_to_texture")===!1){let Ce=!1;for(let lt=0,Pt=F.length;lt<Pt;lt++){const bt=F[lt],{object:ft,geometry:Kt,material:ye,group:Mn}=bt;if(ye.side===Ai&&ft.layers.test(G.layers)){const Ze=ye.side;ye.side=xn,ye.needsUpdate=!0,Uh(ft,$,G,Kt,ye,Mn),ye.side=Ze,ye.needsUpdate=!0,Ce=!0}}Ce===!0&&(q.updateMultisampleRenderTarget(_e),q.updateRenderTargetMipmap(_e))}N.setRenderTarget(ge,we,Ae),N.setClearColor(ke,He),We!==void 0&&(G.viewport=We),N.toneMapping=Ve}function ro(T,F,$){const G=F.isScene===!0?F.overrideMaterial:null;for(let W=0,_e=T.length;W<_e;W++){const Se=T[W],{object:ge,geometry:we,group:Ae}=Se;let Ve=Se.material;Ve.allowOverride===!0&&G!==null&&(Ve=G),ge.layers.test($.layers)&&Uh(ge,F,$,we,Ve,Ae)}}function Uh(T,F,$,G,W,_e){T.onBeforeRender(N,F,$,G,W,_e),T.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),W.onBeforeRender(N,F,$,G,T,_e),W.transparent===!0&&W.side===Ai&&W.forceSinglePass===!1?(W.side=xn,W.needsUpdate=!0,N.renderBufferDirect($,F,G,W,T,_e),W.side=pr,W.needsUpdate=!0,N.renderBufferDirect($,F,G,W,T,_e),W.side=Ai):N.renderBufferDirect($,F,G,W,T,_e),T.onAfterRender(N,F,$,G,W,_e)}function so(T,F,$){F.isScene!==!0&&(F=xt);const G=X.get(T),W=w.state.lights,_e=w.state.shadowsArray,Se=W.state.version,ge=oe.getParameters(T,W.state,_e,F,$,w.state.lightProbeGridArray),we=oe.getProgramCacheKey(ge);let Ae=G.programs;G.environment=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?F.environment:null,G.fog=F.fog;const Ve=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap;G.envMap=ae.get(T.envMap||G.environment,Ve),G.envMapRotation=G.environment!==null&&T.envMap===null?F.environmentRotation:T.envMapRotation,Ae===void 0&&(T.addEventListener("dispose",ii),Ae=new Map,G.programs=Ae);let We=Ae.get(we);if(We!==void 0){if(G.currentProgram===We&&G.lightsStateVersion===Se)return Oh(T,ge),We}else ge.uniforms=oe.getUniforms(T),z!==null&&T.isNodeMaterial&&z.build(T,$,ge),T.onBeforeCompile(ge,N),We=oe.acquireProgram(ge,we),Ae.set(we,We),G.uniforms=ge.uniforms;const Ce=G.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ce.clippingPlanes=be.uniform),Oh(T,ge),G.needsLights=wv(T),G.lightsStateVersion=Se,G.needsLights&&(Ce.ambientLightColor.value=W.state.ambient,Ce.lightProbe.value=W.state.probe,Ce.directionalLights.value=W.state.directional,Ce.directionalLightShadows.value=W.state.directionalShadow,Ce.spotLights.value=W.state.spot,Ce.spotLightShadows.value=W.state.spotShadow,Ce.rectAreaLights.value=W.state.rectArea,Ce.ltc_1.value=W.state.rectAreaLTC1,Ce.ltc_2.value=W.state.rectAreaLTC2,Ce.pointLights.value=W.state.point,Ce.pointLightShadows.value=W.state.pointShadow,Ce.hemisphereLights.value=W.state.hemi,Ce.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Ce.spotLightMatrix.value=W.state.spotLightMatrix,Ce.spotLightMap.value=W.state.spotLightMap,Ce.pointShadowMatrix.value=W.state.pointShadowMatrix),G.lightProbeGrid=w.state.lightProbeGridArray.length>0,G.currentProgram=We,G.uniformsList=null,We}function Fh(T){if(T.uniformsList===null){const F=T.currentProgram.getUniforms();T.uniformsList=ml.seqWithValue(F.seq,T.uniforms)}return T.uniformsList}function Oh(T,F){const $=X.get(T);$.outputColorSpace=F.outputColorSpace,$.batching=F.batching,$.batchingColor=F.batchingColor,$.instancing=F.instancing,$.instancingColor=F.instancingColor,$.instancingMorph=F.instancingMorph,$.skinning=F.skinning,$.morphTargets=F.morphTargets,$.morphNormals=F.morphNormals,$.morphColors=F.morphColors,$.morphTargetsCount=F.morphTargetsCount,$.numClippingPlanes=F.numClippingPlanes,$.numIntersection=F.numClipIntersection,$.vertexAlphas=F.vertexAlphas,$.vertexTangents=F.vertexTangents,$.toneMapping=F.toneMapping}function Mv(T,F){if(T.length===0)return null;if(T.length===1)return T[0].texture!==null?T[0]:null;y.setFromMatrixPosition(F.matrixWorld);for(let $=0,G=T.length;$<G;$++){const W=T[$];if(W.texture!==null&&W.boundingBox.containsPoint(y))return W}return null}function Ev(T,F,$,G,W){F.isScene!==!0&&(F=xt),q.resetTextureUnits();const _e=F.fog,Se=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?F.environment:null,ge=L===null?N.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:qe.workingColorSpace,we=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,Ae=ae.get(G.envMap||Se,we),Ve=G.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,We=!!$.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Ce=!!$.morphAttributes.position,lt=!!$.morphAttributes.normal,Pt=!!$.morphAttributes.color;let bt=gi;G.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(bt=N.toneMapping);const ft=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,Kt=ft!==void 0?ft.length:0,ye=X.get(G),Mn=w.state.lights;if(Ke===!0&&($e===!0||T!==Q)){const pt=T===Q&&G.id===j;be.setState(G,T,pt)}let Ze=!1;G.version===ye.__version?(ye.needsLights&&ye.lightsStateVersion!==Mn.state.version||ye.outputColorSpace!==ge||W.isBatchedMesh&&ye.batching===!1||!W.isBatchedMesh&&ye.batching===!0||W.isBatchedMesh&&ye.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&ye.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&ye.instancing===!1||!W.isInstancedMesh&&ye.instancing===!0||W.isSkinnedMesh&&ye.skinning===!1||!W.isSkinnedMesh&&ye.skinning===!0||W.isInstancedMesh&&ye.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&ye.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&ye.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&ye.instancingMorph===!1&&W.morphTexture!==null||ye.envMap!==Ae||G.fog===!0&&ye.fog!==_e||ye.numClippingPlanes!==void 0&&(ye.numClippingPlanes!==be.numPlanes||ye.numIntersection!==be.numIntersection)||ye.vertexAlphas!==Ve||ye.vertexTangents!==We||ye.morphTargets!==Ce||ye.morphNormals!==lt||ye.morphColors!==Pt||ye.toneMapping!==bt||ye.morphTargetsCount!==Kt||!!ye.lightProbeGrid!=w.state.lightProbeGridArray.length>0)&&(Ze=!0):(Ze=!0,ye.__version=G.version);let Dn=ye.currentProgram;Ze===!0&&(Dn=so(G,F,W),z&&G.isNodeMaterial&&z.onUpdateProgram(G,Dn,ye));let ri=!1,Bi=!1,$r=!1;const dt=Dn.getUniforms(),Nt=ye.uniforms;if(v.useProgram(Dn.program)&&(ri=!0,Bi=!0,$r=!0),G.id!==j&&(j=G.id,Bi=!0),ye.needsLights){const pt=Mv(w.state.lightProbeGridArray,W);ye.lightProbeGrid!==pt&&(ye.lightProbeGrid=pt,Bi=!0)}if(ri||Q!==T){v.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),dt.setValue(U,"projectionMatrix",T.projectionMatrix),dt.setValue(U,"viewMatrix",T.matrixWorldInverse);const Vi=dt.map.cameraPosition;Vi!==void 0&&Vi.setValue(U,ht.setFromMatrixPosition(T.matrixWorld)),R.logarithmicDepthBuffer&&dt.setValue(U,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&dt.setValue(U,"isOrthographic",T.isOrthographicCamera===!0),Q!==T&&(Q=T,Bi=!0,$r=!0)}if(ye.needsLights&&(Mn.state.directionalShadowMap.length>0&&dt.setValue(U,"directionalShadowMap",Mn.state.directionalShadowMap,q),Mn.state.spotShadowMap.length>0&&dt.setValue(U,"spotShadowMap",Mn.state.spotShadowMap,q),Mn.state.pointShadowMap.length>0&&dt.setValue(U,"pointShadowMap",Mn.state.pointShadowMap,q)),W.isSkinnedMesh){dt.setOptional(U,W,"bindMatrix"),dt.setOptional(U,W,"bindMatrixInverse");const pt=W.skeleton;pt&&(pt.boneTexture===null&&pt.computeBoneTexture(),dt.setValue(U,"boneTexture",pt.boneTexture,q))}W.isBatchedMesh&&(dt.setOptional(U,W,"batchingTexture"),dt.setValue(U,"batchingTexture",W._matricesTexture,q),dt.setOptional(U,W,"batchingIdTexture"),dt.setValue(U,"batchingIdTexture",W._indirectTexture,q),dt.setOptional(U,W,"batchingColorTexture"),W._colorsTexture!==null&&dt.setValue(U,"batchingColorTexture",W._colorsTexture,q));const zi=$.morphAttributes;if((zi.position!==void 0||zi.normal!==void 0||zi.color!==void 0)&&D.update(W,$,Dn),(Bi||ye.receiveShadow!==W.receiveShadow)&&(ye.receiveShadow=W.receiveShadow,dt.setValue(U,"receiveShadow",W.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&F.environment!==null&&(Nt.envMapIntensity.value=F.environmentIntensity),Nt.dfgLUT!==void 0&&(Nt.dfgLUT.value=bA()),Bi){if(dt.setValue(U,"toneMappingExposure",N.toneMappingExposure),ye.needsLights&&Tv(Nt,$r),_e&&G.fog===!0&&xe.refreshFogUniforms(Nt,_e),xe.refreshMaterialUniforms(Nt,G,ie,se,w.state.transmissionRenderTarget[T.id]),ye.needsLights&&ye.lightProbeGrid){const pt=ye.lightProbeGrid;Nt.probesSH.value=pt.texture,Nt.probesMin.value.copy(pt.boundingBox.min),Nt.probesMax.value.copy(pt.boundingBox.max),Nt.probesResolution.value.copy(pt.resolution)}ml.upload(U,Fh(ye),Nt,q)}if(G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(ml.upload(U,Fh(ye),Nt,q),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&dt.setValue(U,"center",W.center),dt.setValue(U,"modelViewMatrix",W.modelViewMatrix),dt.setValue(U,"normalMatrix",W.normalMatrix),dt.setValue(U,"modelMatrix",W.matrixWorld),G.uniformsGroups!==void 0){const pt=G.uniformsGroups;for(let Vi=0,Yr=pt.length;Vi<Yr;Vi++){const kh=pt[Vi];te.update(kh,Dn),te.bind(kh,Dn)}}return Dn}function Tv(T,F){T.ambientLightColor.needsUpdate=F,T.lightProbe.needsUpdate=F,T.directionalLights.needsUpdate=F,T.directionalLightShadows.needsUpdate=F,T.pointLights.needsUpdate=F,T.pointLightShadows.needsUpdate=F,T.spotLights.needsUpdate=F,T.spotLightShadows.needsUpdate=F,T.rectAreaLights.needsUpdate=F,T.hemisphereLights.needsUpdate=F}function wv(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return H},this.getActiveMipmapLevel=function(){return I},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(T,F,$){const G=X.get(T);G.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),X.get(T.texture).__webglTexture=F,X.get(T.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:$,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,F){const $=X.get(T);$.__webglFramebuffer=F,$.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(T,F=0,$=0){L=T,H=F,I=$;let G=null,W=!1,_e=!1;if(T){const ge=X.get(T);if(ge.__useDefaultFramebuffer!==void 0){v.bindFramebuffer(U.FRAMEBUFFER,ge.__webglFramebuffer),ne.copy(T.viewport),le.copy(T.scissor),Oe=T.scissorTest,v.viewport(ne),v.scissor(le),v.setScissorTest(Oe),j=-1;return}else if(ge.__webglFramebuffer===void 0)q.setupRenderTarget(T);else if(ge.__hasExternalTextures)q.rebindTextures(T,X.get(T.texture).__webglTexture,X.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Ve=T.depthTexture;if(ge.__boundDepthTexture!==Ve){if(Ve!==null&&X.has(Ve)&&(T.width!==Ve.image.width||T.height!==Ve.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");q.setupDepthRenderbuffer(T)}}const we=T.texture;(we.isData3DTexture||we.isDataArrayTexture||we.isCompressedArrayTexture)&&(_e=!0);const Ae=X.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Ae[F])?G=Ae[F][$]:G=Ae[F],W=!0):T.samples>0&&q.useMultisampledRTT(T)===!1?G=X.get(T).__webglMultisampledFramebuffer:Array.isArray(Ae)?G=Ae[$]:G=Ae,ne.copy(T.viewport),le.copy(T.scissor),Oe=T.scissorTest}else ne.copy(Pe).multiplyScalar(ie).floor(),le.copy(at).multiplyScalar(ie).floor(),Oe=Be;if($!==0&&(G=K),v.bindFramebuffer(U.FRAMEBUFFER,G)&&v.drawBuffers(T,G),v.viewport(ne),v.scissor(le),v.setScissorTest(Oe),W){const ge=X.get(T.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+F,ge.__webglTexture,$)}else if(_e){const ge=F;for(let we=0;we<T.textures.length;we++){const Ae=X.get(T.textures[we]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+we,Ae.__webglTexture,$,ge)}}else if(T!==null&&$!==0){const ge=X.get(T.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,ge.__webglTexture,$)}j=-1},this.readRenderTargetPixels=function(T,F,$,G,W,_e,Se,ge=0){if(!(T&&T.isWebGLRenderTarget)){Qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=X.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Se!==void 0&&(we=we[Se]),we){v.bindFramebuffer(U.FRAMEBUFFER,we);try{const Ae=T.textures[ge],Ve=Ae.format,We=Ae.type;if(T.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+ge),!R.textureFormatReadable(Ve)){Qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!R.textureTypeReadable(We)){Qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=T.width-G&&$>=0&&$<=T.height-W&&U.readPixels(F,$,G,W,he.convert(Ve),he.convert(We),_e)}finally{const Ae=L!==null?X.get(L).__webglFramebuffer:null;v.bindFramebuffer(U.FRAMEBUFFER,Ae)}}},this.readRenderTargetPixelsAsync=async function(T,F,$,G,W,_e,Se,ge=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let we=X.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Se!==void 0&&(we=we[Se]),we)if(F>=0&&F<=T.width-G&&$>=0&&$<=T.height-W){v.bindFramebuffer(U.FRAMEBUFFER,we);const Ae=T.textures[ge],Ve=Ae.format,We=Ae.type;if(T.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+ge),!R.textureFormatReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!R.textureTypeReadable(We))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ce=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Ce),U.bufferData(U.PIXEL_PACK_BUFFER,_e.byteLength,U.STREAM_READ),U.readPixels(F,$,G,W,he.convert(Ve),he.convert(We),0);const lt=L!==null?X.get(L).__webglFramebuffer:null;v.bindFramebuffer(U.FRAMEBUFFER,lt);const Pt=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await XM(U,Pt,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Ce),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,_e),U.deleteBuffer(Ce),U.deleteSync(Pt),_e}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,F=null,$=0){const G=Math.pow(2,-$),W=Math.floor(T.image.width*G),_e=Math.floor(T.image.height*G),Se=F!==null?F.x:0,ge=F!==null?F.y:0;q.setTexture2D(T,0),U.copyTexSubImage2D(U.TEXTURE_2D,$,0,0,Se,ge,W,_e),v.unbindTexture()},this.copyTextureToTexture=function(T,F,$=null,G=null,W=0,_e=0){let Se,ge,we,Ae,Ve,We,Ce,lt,Pt;const bt=T.isCompressedTexture?T.mipmaps[_e]:T.image;if($!==null)Se=$.max.x-$.min.x,ge=$.max.y-$.min.y,we=$.isBox3?$.max.z-$.min.z:1,Ae=$.min.x,Ve=$.min.y,We=$.isBox3?$.min.z:0;else{const Nt=Math.pow(2,-W);Se=Math.floor(bt.width*Nt),ge=Math.floor(bt.height*Nt),T.isDataArrayTexture?we=bt.depth:T.isData3DTexture?we=Math.floor(bt.depth*Nt):we=1,Ae=0,Ve=0,We=0}G!==null?(Ce=G.x,lt=G.y,Pt=G.z):(Ce=0,lt=0,Pt=0);const ft=he.convert(F.format),Kt=he.convert(F.type);let ye;F.isData3DTexture?(q.setTexture3D(F,0),ye=U.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(q.setTexture2DArray(F,0),ye=U.TEXTURE_2D_ARRAY):(q.setTexture2D(F,0),ye=U.TEXTURE_2D),v.activeTexture(U.TEXTURE0),v.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,F.flipY),v.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),v.pixelStorei(U.UNPACK_ALIGNMENT,F.unpackAlignment);const Mn=v.getParameter(U.UNPACK_ROW_LENGTH),Ze=v.getParameter(U.UNPACK_IMAGE_HEIGHT),Dn=v.getParameter(U.UNPACK_SKIP_PIXELS),ri=v.getParameter(U.UNPACK_SKIP_ROWS),Bi=v.getParameter(U.UNPACK_SKIP_IMAGES);v.pixelStorei(U.UNPACK_ROW_LENGTH,bt.width),v.pixelStorei(U.UNPACK_IMAGE_HEIGHT,bt.height),v.pixelStorei(U.UNPACK_SKIP_PIXELS,Ae),v.pixelStorei(U.UNPACK_SKIP_ROWS,Ve),v.pixelStorei(U.UNPACK_SKIP_IMAGES,We);const $r=T.isDataArrayTexture||T.isData3DTexture,dt=F.isDataArrayTexture||F.isData3DTexture;if(T.isDepthTexture){const Nt=X.get(T),zi=X.get(F),pt=X.get(Nt.__renderTarget),Vi=X.get(zi.__renderTarget);v.bindFramebuffer(U.READ_FRAMEBUFFER,pt.__webglFramebuffer),v.bindFramebuffer(U.DRAW_FRAMEBUFFER,Vi.__webglFramebuffer);for(let Yr=0;Yr<we;Yr++)$r&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,X.get(T).__webglTexture,W,We+Yr),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,X.get(F).__webglTexture,_e,Pt+Yr)),U.blitFramebuffer(Ae,Ve,Se,ge,Ce,lt,Se,ge,U.DEPTH_BUFFER_BIT,U.NEAREST);v.bindFramebuffer(U.READ_FRAMEBUFFER,null),v.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(W!==0||T.isRenderTargetTexture||X.has(T)){const Nt=X.get(T),zi=X.get(F);v.bindFramebuffer(U.READ_FRAMEBUFFER,ee),v.bindFramebuffer(U.DRAW_FRAMEBUFFER,O);for(let pt=0;pt<we;pt++)$r?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Nt.__webglTexture,W,We+pt):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Nt.__webglTexture,W),dt?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,zi.__webglTexture,_e,Pt+pt):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,zi.__webglTexture,_e),W!==0?U.blitFramebuffer(Ae,Ve,Se,ge,Ce,lt,Se,ge,U.COLOR_BUFFER_BIT,U.NEAREST):dt?U.copyTexSubImage3D(ye,_e,Ce,lt,Pt+pt,Ae,Ve,Se,ge):U.copyTexSubImage2D(ye,_e,Ce,lt,Ae,Ve,Se,ge);v.bindFramebuffer(U.READ_FRAMEBUFFER,null),v.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else dt?T.isDataTexture||T.isData3DTexture?U.texSubImage3D(ye,_e,Ce,lt,Pt,Se,ge,we,ft,Kt,bt.data):F.isCompressedArrayTexture?U.compressedTexSubImage3D(ye,_e,Ce,lt,Pt,Se,ge,we,ft,bt.data):U.texSubImage3D(ye,_e,Ce,lt,Pt,Se,ge,we,ft,Kt,bt):T.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,_e,Ce,lt,Se,ge,ft,Kt,bt.data):T.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,_e,Ce,lt,bt.width,bt.height,ft,bt.data):U.texSubImage2D(U.TEXTURE_2D,_e,Ce,lt,Se,ge,ft,Kt,bt);v.pixelStorei(U.UNPACK_ROW_LENGTH,Mn),v.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Ze),v.pixelStorei(U.UNPACK_SKIP_PIXELS,Dn),v.pixelStorei(U.UNPACK_SKIP_ROWS,ri),v.pixelStorei(U.UNPACK_SKIP_IMAGES,Bi),_e===0&&F.generateMipmaps&&U.generateMipmap(ye),v.unbindTexture()},this.initRenderTarget=function(T){X.get(T).__webglFramebuffer===void 0&&q.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?q.setTextureCube(T,0):T.isData3DTexture?q.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?q.setTexture2DArray(T,0):q.setTexture2D(T,0),v.unbindTexture()},this.resetState=function(){H=0,I=0,L=null,v.reset(),pe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return di}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=qe._getDrawingBufferColorSpace(e),n.unpackColorSpace=qe._getUnpackColorSpace()}}const gl={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class io{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const CA=new Eh(-1,1,1,-1,0,1);class RA extends on{constructor(){super(),this.setAttribute("position",new ei([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ei([0,2,0,0,2,0],2))}}const PA=new RA;class gv{constructor(e){this._mesh=new vi(PA,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,CA)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class NA extends io{constructor(e,n="tDiffuse"){super(),this.textureID=n,this.uniforms=null,this.material=null,e instanceof $t?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Kl.clone(e.uniforms),this.material=new $t({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new gv(this.material)}render(e,n,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class r0 extends io{constructor(e,n){super(),this.scene=e,this.camera=n,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,n,i){const r=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),s.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),s.buffers.stencil.setClear(o),s.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(r.EQUAL,1,4294967295),s.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),s.buffers.stencil.setLocked(!0)}}class DA extends io{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class LA{constructor(e,n){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),n===void 0){const i=e.getSize(new Ne);this._width=i.width,this._height=i.height,n=new yn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Cn}),n.texture.name="EffectComposer.rt1"}else this._width=n.width,this._height=n.height;this.renderTarget1=n,this.renderTarget2=n.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new NA(gl),this.copyPass.material.blending=mi,this.timer=new CE}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,n){this.passes.splice(n,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const n=this.passes.indexOf(e);n!==-1&&this.passes.splice(n,1)}isLastEnabledPass(e){for(let n=e+1;n<this.passes.length;n++)if(this.passes[n].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const n=this.renderer.getRenderTarget();let i=!1;for(let r=0,s=this.passes.length;r<s;r++){const a=this.passes[r];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),a.needsSwap){if(i){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}r0!==void 0&&(a instanceof r0?i=!0:a instanceof DA&&(i=!1))}}this.renderer.setRenderTarget(n)}reset(e){if(e===void 0){const n=this.renderer.getSize(new Ne);this._pixelRatio=this.renderer.getPixelRatio(),this._width=n.width,this._height=n.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,n){this._width=e,this._height=n;const i=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(i,r),this.renderTarget2.setSize(i,r);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(i,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class IA extends io{constructor(e,n,i=null,r=null,s=null){super(),this.scene=e,this.camera=n,this.overrideMaterial=i,this.clearColor=r,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new ze}render(e,n,i){const r=e.autoClear;e.autoClear=!1;let s,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}}const UA={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ze(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class $s extends io{constructor(e,n=1,i,r){super(),this.strength=n,this.radius=i,this.threshold=r,this.resolution=e!==void 0?new Ne(e.x,e.y):new Ne(256,256),this.clearColor=new ze(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new yn(s,a,{type:Cn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const h=new yn(s,a,{type:Cn});h.texture.name="UnrealBloomPass.h"+d,h.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(h);const u=new yn(s,a,{type:Cn});u.texture.name="UnrealBloomPass.v"+d,u.texture.generateMipmaps=!1,this.renderTargetsVertical.push(u),s=Math.round(s/2),a=Math.round(a/2)}const o=UA;this.highPassUniforms=Kl.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new $t({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];s=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new Ne(1/s,1/a),s=Math.round(s/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=n,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new V(1,1,1),new V(1,1,1),new V(1,1,1),new V(1,1,1),new V(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Kl.clone(gl.uniforms),this.blendMaterial=new $t({uniforms:this.copyUniforms,vertexShader:gl.vertexShader,fragmentShader:gl.fragmentShader,premultipliedAlpha:!0,blending:Gl,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new ze,this._oldClearAlpha=1,this._basic=new Mh,this._fsQuad=new gv(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,n){let i=Math.round(e/2),r=Math.round(n/2);this.renderTargetBright.setSize(i,r);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(i,r),this.renderTargetsVertical[s].setSize(i,r),this.separableBlurMaterials[s].uniforms.invSize.value=new Ne(1/i,1/r),i=Math.round(i/2),r=Math.round(r/2)}render(e,n,i,r,s){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=$s.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=$s.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){const n=[],i=e/3;for(let r=0;r<e;r++)n.push(.39894*Math.exp(-.5*r*r/(i*i))/i);return new $t({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Ne(.5,.5)},direction:{value:new Ne(.5,.5)},gaussianCoefficients:{value:n}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new $t({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}$s.BlurDirectionX=new Ne(1,0);$s.BlurDirectionY=new Ne(0,1);const s0={type:"change"},Th={type:"start"},_v={type:"end"},Ko=new Sh,a0=new Zi,FA=Math.cos(70*YM.DEG2RAD),Ft=new V,hn=2*Math.PI,ct={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Au=1e-6;class OA extends NE{constructor(e,n=null){super(e,n),this.state=ct.NONE,this.target=new V,this.cursor=new V,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ps.ROTATE,MIDDLE:Ps.DOLLY,RIGHT:Ps.PAN},this.touches={ONE:Ms.ROTATE,TWO:Ms.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new V,this._lastQuaternion=new mr,this._lastTargetPosition=new V,this._quat=new mr().setFromUnitVectors(e.up,new V(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Dm,this._sphericalDelta=new Dm,this._scale=1,this._panOffset=new V,this._rotateStart=new Ne,this._rotateEnd=new Ne,this._rotateDelta=new Ne,this._panStart=new Ne,this._panEnd=new Ne,this._panDelta=new Ne,this._dollyStart=new Ne,this._dollyEnd=new Ne,this._dollyDelta=new Ne,this._dollyDirection=new V,this._mouse=new Ne,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=BA.bind(this),this._onPointerDown=kA.bind(this),this._onPointerUp=zA.bind(this),this._onContextMenu=$A.bind(this),this._onMouseWheel=GA.bind(this),this._onKeyDown=WA.bind(this),this._onTouchStart=XA.bind(this),this._onTouchMove=jA.bind(this),this._onMouseDown=VA.bind(this),this._onMouseMove=HA.bind(this),this._interceptControlDown=YA.bind(this),this._interceptControlUp=qA.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=""}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(s0),this.update(),this.state=ct.NONE}pan(e,n){this._pan(e,n),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const n=this.object.position;Ft.copy(n).sub(this.target),Ft.applyQuaternion(this._quat),this._spherical.setFromVector3(Ft),this.autoRotate&&this.state===ct.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(i)&&isFinite(r)&&(i<-Math.PI?i+=hn:i>Math.PI&&(i-=hn),r<-Math.PI?r+=hn:r>Math.PI&&(r-=hn),i<=r?this._spherical.theta=Math.max(i,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+r)/2?Math.max(i,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=a!=this._spherical.radius}if(Ft.setFromSpherical(this._spherical),Ft.applyQuaternion(this._quatInverse),n.copy(this.target).add(Ft),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=Ft.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),s=!!l}else if(this.object.isOrthographicCamera){const o=new V(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=l!==this.object.zoom;const c=new V(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=Ft.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Ko.origin.copy(this.object.position),Ko.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ko.direction))<FA?this.object.lookAt(this.target):(a0.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ko.intersectPlane(a0,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>Au||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Au||this._lastTargetPosition.distanceToSquared(this.target)>Au?(this.dispatchEvent(s0),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?hn/60*this.autoRotateSpeed*e:hn/60/60*this.autoRotateSpeed}_getZoomScale(e){const n=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*n)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,n){Ft.setFromMatrixColumn(n,0),Ft.multiplyScalar(-e),this._panOffset.add(Ft)}_panUp(e,n){this.screenSpacePanning===!0?Ft.setFromMatrixColumn(n,1):(Ft.setFromMatrixColumn(n,0),Ft.crossVectors(this.object.up,Ft)),Ft.multiplyScalar(e),this._panOffset.add(Ft)}_pan(e,n){const i=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;Ft.copy(r).sub(this.target);let s=Ft.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/i.clientHeight,this.object.matrix),this._panUp(2*n*s/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(n*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,n){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),r=e-i.left,s=n-i.top,a=i.width,o=i.height;this._mouse.x=r/a*2-1,this._mouse.y=-(s/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(hn*this._rotateDelta.x/n.clientHeight),this._rotateUp(hn*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let n=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(hn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),n=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-hn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),n=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(hn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),n=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-hn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),n=!0;break}n&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateStart.set(i,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._panStart.set(i,r)}}_handleTouchStartDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,r=e.pageY-n.y,s=Math.sqrt(i*i+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),s=.5*(e.pageY+i.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(hn*this._rotateDelta.x/n.clientHeight),this._rotateUp(hn*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._panEnd.set(i,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,r=e.pageY-n.y,s=Math.sqrt(i*i+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+n.x)*.5,o=(e.pageY+n.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId){this._pointers.splice(n,1);return}}_isTrackingPointer(e){for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId)return!0;return!1}_trackPointer(e){let n=this._pointerPositions[e.pointerId];n===void 0&&(n=new Ne,this._pointerPositions[e.pointerId]=n),n.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const n=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[n]}_customWheelEvent(e){const n=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(n){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function kA(t){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(t.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(t)&&(this._addPointer(t),t.pointerType==="touch"?this._onTouchStart(t):this._onMouseDown(t),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function BA(t){this.enabled!==!1&&(t.pointerType==="touch"?this._onTouchMove(t):this._onMouseMove(t))}function zA(t){switch(this._removePointer(t),this._pointers.length){case 0:this.domElement.releasePointerCapture(t.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(_v),this.state=ct.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],n=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:n.x,pageY:n.y});break}}function VA(t){let e;switch(t.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Ps.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=ct.DOLLY;break;case Ps.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=ct.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=ct.ROTATE}break;case Ps.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=ct.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=ct.PAN}break;default:this.state=ct.NONE}this.state!==ct.NONE&&this.dispatchEvent(Th)}function HA(t){switch(this.state){case ct.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(t);break;case ct.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(t);break;case ct.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(t);break}}function GA(t){this.enabled===!1||this.enableZoom===!1||this.state!==ct.NONE||(t.preventDefault(),this.dispatchEvent(Th),this._handleMouseWheel(this._customWheelEvent(t)),this.dispatchEvent(_v))}function WA(t){this.enabled!==!1&&this._handleKeyDown(t)}function XA(t){switch(this._trackPointer(t),this._pointers.length){case 1:switch(this.touches.ONE){case Ms.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(t),this.state=ct.TOUCH_ROTATE;break;case Ms.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(t),this.state=ct.TOUCH_PAN;break;default:this.state=ct.NONE}break;case 2:switch(this.touches.TWO){case Ms.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(t),this.state=ct.TOUCH_DOLLY_PAN;break;case Ms.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(t),this.state=ct.TOUCH_DOLLY_ROTATE;break;default:this.state=ct.NONE}break;default:this.state=ct.NONE}this.state!==ct.NONE&&this.dispatchEvent(Th)}function jA(t){switch(this._trackPointer(t),this.state){case ct.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(t),this.update();break;case ct.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(t),this.update();break;case ct.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(t),this.update();break;case ct.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(t),this.update();break;default:this.state=ct.NONE}}function $A(t){this.enabled!==!1&&t.preventDefault()}function YA(t){t.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function qA(t){t.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const o0={idle:{color:new ze("#3B82F6"),radiusScale:1,noiseAmp:.04,swirlSpeed:.15,bloomStrength:.55},listening:{color:new ze("#1E3A8A"),radiusScale:.92,noiseAmp:.03,swirlSpeed:.35,bloomStrength:.6},thinking:{color:new ze("#F97316"),radiusScale:1.04,noiseAmp:.1,swirlSpeed:1.2,bloomStrength:.7},acting:{color:new ze("#00F0FF"),radiusScale:1.08,noiseAmp:.12,swirlSpeed:1.5,bloomStrength:.8},speaking:{color:new ze("#4ADE80"),radiusScale:1,noiseAmp:.06,swirlSpeed:.25,bloomStrength:.6},interrupted:{color:new ze("#FF6B6B"),radiusScale:.95,noiseAmp:.14,swirlSpeed:2,bloomStrength:.75},error:{color:new ze("#EF4444"),radiusScale:1,noiseAmp:.15,swirlSpeed:.1,bloomStrength:.9}},KA=`
  uniform float uTime;
  uniform vec3  uColor;
  uniform float uRadiusScale;
  uniform float uNoiseAmp;
  uniform float uSwirlSpeed;
  uniform float uAudioAmp;
  uniform float uState;
  uniform float uBass;
  uniform float uMid;
  uniform float uTreble;
  uniform float uImpulse;
  uniform float uBaseRadius;

  attribute float aPhase;
  attribute float aSize;
  attribute float aBand;

  varying vec3  vColor;
  varying float vAlpha;

  /* ---- Simplex 3-D noise ---- */
  vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec4 mod289(vec4 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g, l.zxy);
    vec3 i2 = max(g, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0,i1.z,i2.z,1.0))
             + i.y + vec4(0.0,i1.y,i2.y,1.0))
             + i.x + vec4(0.0,i1.x,i2.x,1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0*floor(p*ns.z*ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0*x_);
    vec4 x = x_*ns.x + ns.yyyy;
    vec4 y = y_*ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.xxyy;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
    m = m*m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main() {
    vec3 dir = normalize(position);
    float baseR = length(position);

    // 1. Noise displacement clamped relative to base radius
    float noiseVal = snoise(dir * 2.5 + vec3(uTime * 0.5));
    float maxDisplacement = uBaseRadius * uNoiseAmp;
    float radOffset = noiseVal * maxDisplacement;

    // 2. Idle breathing & state-dependent waves
    radOffset += sin(uTime * 1.3 + aPhase) * uBaseRadius * 0.02;

    if (uState > 0.5 && uState < 1.5) {
      radOffset += sin(uTime * 10.0 + aPhase * 3.0) * uBaseRadius * 0.015;
    }

    if (uState > 2.5) {
      float bandBoost = mix(uBass, uTreble, aBand);
      float wave = sin(baseR * 5.0 - uTime * 7.0 + aPhase)
                 * (uAudioAmp * 0.15 + bandBoost * 0.1) * uBaseRadius;
      radOffset += wave;
    }

    // Click impulse shockwave
    radOffset += sin(baseR * 8.0 - uTime * 12.0) * uImpulse * uBaseRadius * 0.2;

    // 3. Final radius composition
    float finalR = baseR * uRadiusScale + radOffset;
    vec3 finalPos = dir * finalR;

    // Global floating bobbing
    finalPos.y += sin(uTime * 1.0) * 0.08;

    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Point size — depth-scaled, conservatively clamped
    float depthSize = aSize * (90.0 / -mvPosition.z);
    gl_PointSize = clamp(depthSize, 0.8, 6.0);

    vColor = uColor + vec3(noiseVal * 0.04);
    vAlpha = 0.6 + sin(uTime * 2.0 + aPhase) * 0.12;

    if (uState > 1.5 && uState < 2.5) {
      vAlpha *= 0.65 + sin(uTime * 10.0 + aPhase * 6.0) * 0.35;
    }
  }
`,ZA=`
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    float intensity = smoothstep(0.5, 0.0, dist);
    intensity = pow(intensity, 2.0);

    vec3 finalColor = mix(vColor, vec3(1.0), pow(intensity, 4.0) * 0.35);
    gl_FragColor = vec4(finalColor, intensity * vAlpha * 0.5);
  }
`,vv=ve.forwardRef(({state:t="idle",audioAmplitude:e=0,audioStream:n=null,className:i="",onClick:r},s)=>{const a=ve.useRef(null),o=ve.useRef(null),l=ve.useRef(t),c=ve.useRef(e),d=ve.useRef(null),h=ve.useRef(null),u=ve.useRef(null),p=w=>o0[w]||o0.idle,m=ve.useRef(p(t).color.clone()),E=ve.useRef(p(t).radiusScale),g=ve.useRef(p(t).noiseAmp),f=ve.useRef(p(t).swirlSpeed),_=ve.useRef(p(t).bloomStrength),S=ve.useRef(0);ve.useEffect(()=>{l.current=t},[t]),ve.useEffect(()=>{c.current=e},[e]);const y=w=>{try{if(!d.current){const N=window.AudioContext||window.webkitAudioContext;d.current=new N}const A=d.current;A.state==="suspended"&&A.resume();const x=A.createMediaStreamSource(w),C=A.createAnalyser();C.fftSize=128,C.smoothingTimeConstant=.8,x.connect(C),h.current=C,u.current=new Uint8Array(C.frequencyBinCount)}catch(A){console.warn("[JarvisOrb] Audio error:",A)}};ve.useEffect(()=>{n&&y(n)},[n]);const b=()=>{S.current=1};return ve.useImperativeHandle(s,()=>({setState:w=>{l.current=w},connectAudioStream:w=>{y(w)},triggerImpulse:()=>{b()}})),ve.useEffect(()=>{const w=a.current;if(!w)return;let A=window.innerWidth,x=window.innerHeight;const C=new lE,N=new On(40,A/x,.1,200);N.position.set(0,0,6.8);const P=new AA({antialias:!0,alpha:!0,powerPreference:"high-performance"});P.setSize(A,x),P.setPixelRatio(Math.min(window.devicePixelRatio,2)),P.setClearColor(0,0),P.toneMapping=fh,P.toneMappingExposure=.9,w.appendChild(P.domElement);const z=new LA(P),K=new IA(C,N);K.clearColor=new ze(0),K.clearAlpha=0,z.addPass(K);const ee=new $s(new Ne(A,x),.55,.4,.25);z.addPass(ee);const O=new OA(N,P.domElement);O.enableDamping=!0,O.dampingFactor=.08,O.enableZoom=!0,O.minDistance=3.5,O.maxDistance=18,O.enablePan=!0,O.panSpeed=.4,O.rotateSpeed=.5,O.enableRotate=!0,O.autoRotate=!1,O.target.set(0,0,0),O.update();const H=1.5,I=4e3,L=new Float32Array(I*3),j=new Float32Array(I),Q=new Float32Array(I),ne=new Float32Array(I),le=Math.PI*(3-Math.sqrt(5));for(let B=0;B<I;B++){const Y=1-B/(I-1)*2,oe=Math.sqrt(1-Y*Y),xe=le*B;L[B*3]=Math.cos(xe)*oe*H,L[B*3+1]=Y*H,L[B*3+2]=Math.sin(xe)*oe*H,j[B]=Math.random()*Math.PI*2,Q[B]=1+Math.random()*1.2,ne[B]=(Y+1)*.5}const Oe=new on;Oe.setAttribute("position",new mt(L,3)),Oe.setAttribute("aPhase",new mt(j,1)),Oe.setAttribute("aSize",new mt(Q,1)),Oe.setAttribute("aBand",new mt(ne,1));const ke={uTime:{value:0},uColor:{value:m.current},uRadiusScale:{value:1},uNoiseAmp:{value:.04},uSwirlSpeed:{value:.15},uAudioAmp:{value:0},uState:{value:0},uBass:{value:0},uMid:{value:0},uTreble:{value:0},uImpulse:{value:0},uBaseRadius:{value:H}},He=new $t({vertexShader:KA,fragmentShader:ZA,uniforms:ke,transparent:!0,depthWrite:!1,depthTest:!0,blending:Gl}),Z=new va;Z.add(new Xo(Oe,He));const se=600,ie=new Float32Array(se*3),De=new Float32Array(se),Ue=new Float32Array(se),Pe=new Float32Array(se);for(let B=0;B<se;B++){const Y=Math.random(),oe=Math.random(),xe=Y*2*Math.PI,ce=Math.acos(2*oe-1),ue=Math.cbrt(Math.random())*H*.45;ie[B*3]=ue*Math.sin(ce)*Math.cos(xe),ie[B*3+1]=ue*Math.sin(ce)*Math.sin(xe),ie[B*3+2]=ue*Math.cos(ce),De[B]=Math.random()*Math.PI*2,Ue[B]=1+Math.random()*1.5,Pe[B]=Math.random()}const at=new on;at.setAttribute("position",new mt(ie,3)),at.setAttribute("aPhase",new mt(De,1)),at.setAttribute("aSize",new mt(Ue,1)),at.setAttribute("aBand",new mt(Pe,1)),Z.add(new Xo(at,He));const Be=180,et=new Float32Array(Be*3),Ke=new Float32Array(Be),$e=new Float32Array(Be),St=new Float32Array(Be);for(let B=0;B<Be;B++){const Y=B/Be*Math.PI*2;et[B*3]=Math.cos(Y)*H*1.35,et[B*3+1]=0,et[B*3+2]=Math.sin(Y)*H*1.35,Ke[B]=Y,$e[B]=.8,St[B]=.5}const ht=new on;ht.setAttribute("position",new mt(et,3)),ht.setAttribute("aPhase",new mt(Ke,1)),ht.setAttribute("aSize",new mt($e,1)),ht.setAttribute("aBand",new mt(St,1));const Rt=new Xo(ht,He);Z.add(Rt);const xt=150,ut=new Float32Array(xt*3),Mt=new Float32Array(xt),U=new Float32Array(xt),Wt=new Float32Array(xt);for(let B=0;B<xt;B++){const Y=B/xt*Math.PI*2;ut[B*3]=Math.cos(Y)*H*1.5,ut[B*3+1]=Math.sin(Y)*H*1.5,ut[B*3+2]=0,Mt[B]=Y,U[B]=.9,Wt[B]=.8}const Ye=new on;Ye.setAttribute("position",new mt(ut,3)),Ye.setAttribute("aPhase",new mt(Mt,1)),Ye.setAttribute("aSize",new mt(U,1)),Ye.setAttribute("aBand",new mt(Wt,1));const R=new Xo(Ye,He);R.rotation.x=Math.PI/3.5,R.rotation.y=Math.PI/6,Z.add(R),C.add(Z);const v=()=>{b(),r&&r()};P.domElement.addEventListener("click",v);const k=new PE,X={idle:0,listening:1,thinking:2,acting:2,speaking:3,interrupted:1,error:0},q=()=>{if(document.visibilityState==="hidden")return;o.current=requestAnimationFrame(q);const B=Math.min(k.getDelta(),.033),Y=k.getElapsedTime(),oe=l.current,xe=p(oe),ce=B*5;m.current.lerp(xe.color,ce),E.current+=(xe.radiusScale-E.current)*ce,g.current+=(xe.noiseAmp-g.current)*ce,f.current+=(xe.swirlSpeed-f.current)*ce,_.current+=(xe.bloomStrength-_.current)*ce,S.current=Math.max(0,S.current-B*2.5),ee.strength=_.current,Z.rotation.y+=f.current*B,Rt.rotation.y=Y*.3,R.rotation.z=-Y*.45,ke.uTime.value=Y,ke.uColor.value.copy(m.current),ke.uRadiusScale.value=E.current,ke.uNoiseAmp.value=g.current,ke.uSwirlSpeed.value=0,ke.uState.value=X[oe]??0,ke.uImpulse.value=S.current;let ue=c.current,be=0,Re=0,Ie=0;if(h.current&&u.current){h.current.getByteFrequencyData(u.current);const D=u.current,fe=D.length;let J=0,he=0,pe=0,te=0;const Te=Math.floor(fe*.25),Ee=Math.floor(fe*.65);for(let ot=0;ot<fe;ot++){const nt=D[ot]/255;J+=nt,ot<Te?he+=nt:ot<Ee?pe+=nt:te+=nt}ue=J/fe,be=he/Math.max(1,Te),Re=pe/Math.max(1,Ee-Te),Ie=te/Math.max(1,fe-Ee)}else if(oe==="speaking"||oe==="listening"){const D=Y*5;ue=Math.max(0,Math.sin(D)*.3+Math.cos(D*1.7)*.25),be=Math.abs(Math.sin(D*.8))*.35,Re=Math.abs(Math.cos(D*1.4))*.3,Ie=Math.abs(Math.sin(D*2.2))*.2}ke.uAudioAmp.value=ue,ke.uBass.value=be,ke.uMid.value=Re,ke.uTreble.value=Ie,O.update(),z.render()};q();const ae=()=>{A=window.innerWidth,x=window.innerHeight,N.aspect=A/x,N.updateProjectionMatrix(),P.setSize(A,x),z.setSize(A,x),ee.resolution.set(A,x)};window.addEventListener("resize",ae);const de=()=>{document.visibilityState==="hidden"?o.current!==null&&(cancelAnimationFrame(o.current),o.current=null):o.current===null&&(k.start(),q())};return document.addEventListener("visibilitychange",de),()=>{o.current!==null&&cancelAnimationFrame(o.current),window.removeEventListener("resize",ae),document.removeEventListener("visibilitychange",de),P.domElement.removeEventListener("click",v),O.dispose(),P.domElement&&w.contains(P.domElement)&&w.removeChild(P.domElement),Oe.dispose(),at.dispose(),ht.dispose(),Ye.dispose(),He.dispose(),P.dispose(),z.dispose()}},[]),M.jsx("div",{ref:a,role:"img","aria-label":`JARVIS Ambient Full-Screen 3D Orb Background — ${t.toUpperCase()}`,className:`fixed inset-0 w-screen h-screen z-0 pointer-events-auto overflow-hidden ${i}`,style:{touchAction:"none"}})});vv.displayName="JarvisOrb";const QA=({active:t})=>{const e=ve.useRef(null),n=ve.useRef(t);return ve.useEffect(()=>{n.current=t},[t]),ve.useEffect(()=>{const i=e.current;if(!i)return;const r=i.getContext("2d");if(!r)return;let s=0,a;const o=()=>{s+=.05;const{width:l,height:c}=i,d=c/2,h=n.current;r.clearRect(0,0,l,c),r.strokeStyle=h?"#00ffaa":"rgba(0, 240, 255, 0.4)",r.lineWidth=1.5,r.beginPath();const u=48,p=l/u;for(let m=0;m<u;m++){const E=m*p,g=h?Math.sin(s+m*.3)*14+Math.random()*8:Math.sin(s+m*.2)*4+2;r.moveTo(E,d-g/2),r.lineTo(E,d+g/2)}r.stroke(),a=requestAnimationFrame(o)};return o(),()=>{cancelAnimationFrame(a)}},[]),M.jsx("div",{className:"w-full max-w-[480px] h-[40px] flex items-center justify-center my-1.5",children:M.jsx("canvas",{ref:e,width:480,height:40,className:"w-full h-full"})})},JA=()=>{const{currentState:t,setJarvisState:e,isGenerating:n}=jr(),i=[{id:"idle",num:"1",label:"IDLE"},{id:"listening",num:"2",label:"LISTENING"},{id:"thinking",num:"3",label:"THINKING"},{id:"speaking",num:"4",label:"SPEAKING"}];return M.jsx("div",{className:"grid grid-cols-4 gap-2.5 w-full max-w-[480px] shrink-0 mb-1 z-10 relative pointer-events-auto",children:i.map(r=>{const s=t===r.id;return M.jsxs("div",{onClick:()=>{n||e(r.id)},className:`relative bg-[#080e1a]/75 backdrop-blur-[14px] -webkit-backdrop-blur-[14px] border border-[#00f0ff]/20 rounded-lg p-2 flex flex-col items-center gap-1 cursor-pointer transition-all duration-300 ${s?r.id==="thinking"?"border-[#ff7700] bg-[#ff7700]/20 shadow-[0_0_12px_rgba(255,119,0,0.4)]":r.id==="speaking"?"border-[#00ffaa] bg-[#00ffaa]/20 shadow-[0_0_12px_rgba(0,255,170,0.4)]":"border-[#00f0ff] bg-[#00f0ff]/20 shadow-[0_0_12px_rgba(0,240,255,0.4)]":"hover:border-[#00f0ff]/50"}`,children:[M.jsx("span",{className:"absolute top-1 left-1.5 text-[9px] text-gray-500 font-mono",children:r.num}),M.jsx("div",{className:`w-5 h-5 rounded-full mt-0.5 ${r.id==="idle"?"bg-cyan-400 shadow-[0_0_8px_#00f0ff]":r.id==="listening"?"bg-blue-400 shadow-[0_0_8px_#00aaff]":r.id==="thinking"?"bg-orange-500 shadow-[0_0_8px_#ff7700]":"bg-emerald-400 shadow-[0_0_8px_#00ffaa]"}`}),M.jsx("span",{className:`text-[10px] font-hud tracking-wider ${s?r.id==="thinking"?"text-[#ff7700]":r.id==="speaking"?"text-[#00ffaa]":"text-[#00f0ff]":"text-gray-400"}`,children:r.label})]},r.id)})})},eC=()=>{const{currentState:t,activeModel:e,setSystemMetrics:n}=jr(),i=ve.useRef(new C_);return ve.useEffect(()=>{let r=!0;const s=async()=>{const o=await i.current.getSystemMetrics();r&&n(o)};s();const a=setInterval(s,2e3);return()=>{r=!1,clearInterval(a)}},[n]),M.jsxs("div",{className:"relative w-screen h-screen bg-[#050811] text-gray-100 font-sans select-none overflow-hidden",children:[M.jsx(vv,{state:t}),M.jsxs("div",{className:"relative z-10 w-full h-full flex flex-col p-3 gap-3 pointer-events-none overflow-hidden",children:[M.jsx(AS,{}),M.jsxs("main",{className:"flex-1 grid grid-cols-[240px_minmax(0,1fr)_440px] gap-3 min-h-0 min-w-0 overflow-hidden",children:[M.jsx(QS,{}),M.jsxs("section",{className:"relative flex flex-col items-center justify-between min-h-0 min-w-0 overflow-hidden py-2 pointer-events-none",children:[M.jsx("div",{className:"bg-[#080e1a]/70 backdrop-blur-[14px] -webkit-backdrop-blur-[14px] border border-[#00f0ff]/20 px-4 py-1 rounded-full pointer-events-auto shadow-lg",children:M.jsx("span",{className:"font-hud text-xs tracking-[4px] text-[#00f0ff]/70 uppercase",children:"I AM ALL YOU NEED"})}),M.jsx("div",{className:"flex-1 w-full min-h-0 pointer-events-none"}),M.jsxs("div",{className:"flex flex-col items-center gap-1.5 w-full pointer-events-none",children:[M.jsxs("div",{className:"flex flex-col items-center gap-0.5 bg-[#080e1a]/75 backdrop-blur-[14px] -webkit-backdrop-blur-[14px] border border-[#00f0ff]/20 px-6 py-2 rounded-xl pointer-events-auto shadow-xl",children:[M.jsx("div",{className:`font-hud text-base font-bold tracking-[3px] uppercase transition-colors duration-300 ${t==="thinking"?"text-[#ff7700] drop-shadow-[0_0_10px_rgba(255,119,0,0.6)]":t==="speaking"?"text-[#00ffaa] drop-shadow-[0_0_10px_rgba(0,255,170,0.7)]":"text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]"}`,children:t}),t==="thinking"&&M.jsxs("div",{className:"flex gap-1.5 my-0.5",children:[M.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-[#ff7700] animate-ping"}),M.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-[#ff7700] animate-ping delay-150"}),M.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-[#ff7700] animate-ping delay-300"})]}),M.jsx("span",{className:"text-xs text-gray-400 font-sans",children:Hs(e)})]}),M.jsx("div",{className:"pointer-events-auto",children:M.jsx(QA,{active:t==="speaking"||t==="listening"})}),M.jsx("div",{className:"bg-[#080e1a]/75 backdrop-blur-[14px] border border-[#00f0ff]/20 px-4 py-1 rounded-full text-[10px] tracking-widest text-gray-300 pointer-events-auto shadow-md",children:"VOICE SYNCED · SYSTEM ONLINE"}),M.jsx(JA,{})]})]}),M.jsx(uM,{})]})]})]})};Cu.createRoot(document.getElementById("root")).render(M.jsx(x0.StrictMode,{children:M.jsx(eC,{})}));
