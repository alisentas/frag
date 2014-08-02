/**
 * Frag.js - 02.08.2014
 * by Ali �enta�
 */

var id, container, styles, attrs, scanner, attr, addedStyles, editedStyles, standardStyles, style, gstyle, gattr, key, bodyContent;
var allStyles = "";
$("style").each(function(){
	allStyles += $(this).text();
});
var FragBase = {
        // FragBase is the main container of all frag functions, it's the core of frag system
        // It will hold the variables like our frags and methods like add, copy, delete, etc.
        frags: {
                // All frags have unique id, if an html variable has an id, frags id is it, if not, we will generate one.
                // Generated id's will be random numbers between 1 and 1000000
        },
        frag: function(id, container, styles, attrs){
                // id = unique identification string for a frag
                // styles = contains objects with css styling options like {"width": 500, "background-color": "#ff0000"}, etc
                // container = mother element
                // attrs = html attributes like {"class": "hey", "type": "text", "placeholder": "Enter here"}
				//***** May be I should rebuild display, editfrag function to more OOP style like this.display = function() etc
                this.id = id;
                this.elem = $("#" + this.id);
                this.container = container;
                this.styles = styles;
                this.attrs = attrs;
        },
        countFrags: function(){
                //found this on StackOverflow: 
                //http://stackoverflow.com/questions/5223/length-of-javascript-object-ie-associative-array#answer-6700
                var size = 0, key;
                for (key in FragBase.frags) {
                        if (FragBase.frags.hasOwnProperty(key)) size++;
                }
                return size;
        },
        addFrag: function(frag){
                //insert new frag to fragbase.frags
				//This function works, no need to rebuild
                FragBase.frags[frag.id] = frag;
        },
        fragjQuery: function(jQelem){
                //This function creates frags from given jquery element
                if(typeof jQelem.attr("id") !== "undefined"){
                        //if selected element has an id, it stays with that
                        //else, we'll generate random number for that id
                        id = jQelem.attr("id")
                }else{
                        id = Math.floor(Math.random() * 1000000 + 1);
                        while(FragBase.frags[id.toString()] !== undefined){
                                //if an element has the same id number (very rare probabilty but we have to be sure)
                                //it will try another one
                                id = Math.floor(Math.random() * 1000000 + 1); // id overriding
                        }
                        jQelem.attr("id", id);
                        jQelem = $("#" + id); //with new id, we have to select our element again
                }
                container = FragBase.frags[jQelem.parent().attr("id")]; //container of this element, holder
                //we should generate style and attribute objects
                styles = FragBase.generateStyles(jQelem);
                attrs = FragBase.generateAttributes(jQelem);

                //Editable frag's html can be editable, because of the contenteditable option
                if(jQelem.attr("id") !== "fragcon") jQelem.addClass("editable-frag");
                //Finally, we have all we need to create a frag, lets do this
                FragBase.addFrag(new FragBase.frag(id, container, styles, attrs));
        },
        scanPage: function(){
                //Basically, scans page for all html elements and turns them into frags
                //but first, we need to convert our main div to a frag
                FragBase.fragjQuery($("#fragcon"));
                scanner = "#fragcon > *";
                //we will scan every element on the page by using wildcard (*) and child selector
                //I use child selector because I want container elements to be selected first
                while($(scanner).length > 0){
                        $(scanner).each(function(){
                                //Turn all jquery elements to frags
                                FragBase.fragjQuery($(this));
                        });
                        //add another selector for more deeper levels
                        scanner += " > *";
                }
                $(".editable-frag").on("dblclick",function(e){
                        //Display frags when double clicked
                        e.stopPropagation();
                        FragBase.displayFrag(FragBase.frags[$(this).attr("id")]);
                });
                $(".editable-frag").each(function(){
                        //contenteditable means user can change text content of that element
                        $(this).attr("contenteditable", "true");
                });
                $("#fragAttrToggle").on("click", function(){
                        $("#fragAttr").toggle();
                });
                $("#fragStyleToggle").on("click", function(){
                        $("#fragStyle").toggle();
                });
                $("#fragAttrToggle").tooltip();
				$("#saveFrag").on("click", function(){
					attrs = {};
					styles = {};
					$(".frag-attribute").each(function(){
						attrs[$(this).children("td").first().text()] = $(this).children(".frag-attr-content").text();
					});
					$(".frag-style").each(function(){
						styles[$(this).children("td").first().text()] = $(this).children(".frag-style-content").text();
					});
					FragBase.editFrag("#" + attrs["id"], attrs, styles);
				});
        },
        displayFrag: function(frag){
                //remove table body content
                $("#fragAttr").html("");
                $("#fragStyle").html("");
                //display attributes
                for(attr in frag.attrs){
                        //Display attrbutes if they are not undefined
                        if(frag.attrs[attr] !== undefined
                        && frag.attrs[attr] !== "")
                        {
                                $("#fragAttr").append('<tr class="success frag-attribute"><td contenteditable="true">' + attr + '</td><td contenteditable="true" class="frag-attr-content">' + frag.attrs[attr] + '</td></tr>');
                        }else{
                                $("#fragattrs > div > table > tbody").append('<tr class="frag-attribute"><td contenteditable="true" class="frag-attr-content">' + attr + '</td><td contenteditable="true">' + frag.attrs[attr] + '</td></tr>');
                        }
                }

                addedStyles = []; // added styles is whose in elements style attribute
                editedStyles = []; // styles that hasn't got default value
                standardStyles = []; // styles which has default value
                for(style in frag.styles){
                        if(frag.elem.attr("style") !== undefined){
                                if(frag.elem.attr("style").indexOf(style) > -1){
                                        addedStyles.push(style);
                                }else{
                                        if(frag.styles[style] !== undefined
                                        && frag.styles[style] !== ""
                                        && frag.styles[style] !== "none"
                                        && frag.styles[style] !== "0px"
                                        && frag.styles[style] !== "rgb(0, 0, 0)"
                                        && frag.styles[style] !== "auto"
                                        && frag.styles[style] !== "visible"
                                        && frag.styles[style] !== "normal"){
                                                editedStyles.push(style);
                                        }else{
                                                standardStyles.push(style);
                                        }
                                }
                        }else if(frag.styles[style] !== undefined
                        && frag.styles[style] !== ""
                        && frag.styles[style] !== "none"
                        && frag.styles[style] !== "0px"
                        && frag.styles[style] !== "rgb(0, 0, 0)"
                        && frag.styles[style] !== "auto"
                        && frag.styles[style] !== "visible"
                        && frag.styles[style] !== "normal"){
                                editedStyles.push(style);
                        }else{
                                standardStyles.push(style);
                        }
                }
                //Display all style values,
                //first added, then edited, finally default
                for(style in addedStyles){
                        $("#fragStyle").append('<tr class="info frag-style"><td contenteditable="true">' + addedStyles[style] + '</td><td contenteditable="true" class="frag-style-content">' + frag.styles[addedStyles[style]] + '</td></tr>');
                }
                for(style in editedStyles){
                        $("#fragStyle").append('<tr class="success frag-style"><td contenteditable="true">' + editedStyles[style] + '</td><td contenteditable="true" class="frag-style-content">' + frag.styles[editedStyles[style]] + '</td></tr>');
                }
                for(style in standardStyles){
                        $("#fragStyle").append('<tr class="frag-style"><td contenteditable="true">' + standardStyles[style] + '</td><td contenteditable="true" class="frag-style-content">' + frag.styles[standardStyles[style]] + '</td></tr>');
                }
                $("#editFrag").modal();
        },
        editFrag: function(frag, attrs, styles){
			frag.attrs = attrs;
			frag.styles = styles;
			frag.id = attrs["id"];
			for(key in frag.attrs){
				if(frag.attrs.hasOwnProperty(key)){
					$("#" + frag.id).attr(key, frag.attrs[key])
				}
			}
        },
		init: function(){
			// launches the frag system
			// does critical changes on pages html
			$("head").append('<link type="text/css" rel="stylesheet" href="frag/css/bootstrap.min.css">'); //upload bootstrap
			$("head").append('<script type="text/javascript" src="frag/js/bootstrap.min.js"></script>'); //upload bootstrap js
			$("head").append('<script type="text/javascript" src="frag/js/cssrulereference.js"></script>');
			$("head").append('<script type="text/javascript" src="frag/js/htmlattributereference.js">');//html attribute reference, needed in generateAttributes method
			//copy all body content to frgcon, it will be the thing with contains our frags
			bodyContent = $("body").html();
			$("body").html("");
			$("body").append('<div style="background-color: black; color: white;font-family: helvetica; font-size: 14px;\ font-weight: bold; padding: 3px; width: 100%; text-align: center;">\
			Your\'e running { Frag v1.0.0 } - Have fun.\
			</div>');
			$("body").append('<div class="modal fade" id="editFrag">\
				<div class="modal-dialog">\
					<div class="modal-content">\
						<div class="modal-header">\
							<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\
							<h4 class="modal-title">Edit Element</h4>\
						</div>\
						<div class="modal-body">\
							<p>You can edit this frag here.</p>\
							<div class="alert alert-info">\
								<b>Quick tip: </b>Don\'t change the editable-frag class, or you may not edit your element again\
							</div>\
						</div>\
						<table class="table table-hover">\
							<thead>\
								<tr id="fragAttrToggle" data-toggle="tooltip" data-placement="top" title="Click to toggle">\
									<th colspan="2"><h3>Element Attributes</h3></th>\
								</tr>\
								<tr>\
									<th>Attribute Name</th>\
									<th>Attribute Content</th>\
								</tr>\
							</thead>\
							<tbody id="fragAttr">\
								\
							</tbody>\
							<thead>\
								<tr id="fragStyleToggle">\
									<th colspan="2"><h3>Style Rules</h3></th>\
								</tr>\
								<tr>\
									<th>Style Rule</th>\
									<th>Style Content</th>\
								</tr>\
							</thead>\
							<tbody id="fragStyle">\
							\
							</tbody>\
						</table>\
						<div class="modal-footer">\
							<button id="saveFrag" type="button" class="btn btn-success">Save changes</button>\
							<button type="button" class="btn btn-default">Copy Frag</button>\
							<button type="button" class="btn btn-danger">Delete Frag</button>\
						</div>\
					</div>\
				</div>\
			</div>');
			$("body").append('<div id="fragcon"></div>');
			$("#fragcon").html(bodyContent);
			FragBase.scanPage();
		},
        // ----HELPER FUNCT�ONS ------
        generateStyles: function(jQelem){
                // This function is for fragjQuery method to generate all css styling for an element
				//****This function doesnt work, since it generate all styles, I need user edited ones maybe I should start here
                gstyle = {}; //gstyle is for generated style
                for(key in cssStyles){
                        //loop through all styles in an element
                        if(jQelem.css(cssStyles[key]) !== ""){
                                gstyle[cssStyles[key]] = jQelem.css(cssStyles[key]);//add that rules to gstyle
                        }
                }
                return gstyle;//return generated style element for frag constructor
        },
        generateAttributes: function(jQelem){
				//This function works, no need to rebuild
                gattr = {};
                for(key in htmlAttrs){
                        //loop through all attributes in an element
                        if(jQelem.attr(htmlAttrs[key]) !== undefined){
                                gattr[htmlAttrs[key]] = jQelem.attr(htmlAttrs[key]);//add that rules to gattr
                        }
                }
                return gattr;//return generated attribute variables
        }
}