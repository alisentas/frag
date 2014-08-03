FRAG
====

Frag is the short form of editable html elements, an HTML IDE within HTML page

How Does Frag System Work?
====

First of all, all elements scanned and turned into customizable frags.
Frags can be removed from dom, copied and users can create frags and append them to dom.
Users can customize almost everything and save and get code.

Users can select frags by double clicking any html element.
A bootstrap modal will be shown where users can change that elements specs.

How to Use It?
====

You should only include these two lines to your html page
```html
<script type="text/javascript" src="frag/js/jquery.js"></script>
<script type="text/javascript" src="frag/js/frag.js"></script>
```
function right after the page loaded in the console.

If you have jQuery in your page, just add this line to your head tag
```html
<script type="text/javascript" src="frag/js/frag.js"></script>
```

Frag system will be auto initialized after page loads. If you see a black ribbon in the top, it means you managed to run the frag system correctly.

What Frameworks do Frag Use?
====

Frag uses jquery for selecting elements and bootstrap for modals

Milestones
====

 - [x] Added FragBase
 - [x] Display Frags
 - [x] Edit Frags
 - [ ] Copy Frags
 - [x] Visual Improvements
 - [ ] Frag Option Menu
 