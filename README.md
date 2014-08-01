FRAG
====

Frag is the short form of editable html elements, an HTML IDE within HTML page

How Does Frag System Work
====

First of all, all elements scanned and turned into customizable frags.
Frags can be removable from dom, copiable and users can create frags and append them to dom.
Users can customize almost everything and save and get code.

How to Use It?
====

First of all, you need to add these line to your html page
```html
<script type="text/javascript" src="frag/js/jquery.js"></script>
<script type="text/javascript" src="frag/js/frag.js"></script>
```
And you need to call 
```js
FragBase.init()
```
function right after the page loaded in the console.

Milestones
====

 - [x] Added FragBase
 - [x] Display Frags
 - [ ] Edit Frags
 - [x] Visual Improvements