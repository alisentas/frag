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
					FragBase.frags[frag.id] = frag;
				},
				fragjQuery: function(jQelem){
					//This function creates frags from given jquery element
					if(typeof jQelem.attr("id") !== "undefined"){
						//if selected element has an id, it stays with that
						//else, we'll generate random number for that id
						var id = jQelem.attr("id")
					}else{
						var id = Math.floor(Math.random() * 1000000 + 1);
						while(FragBase.frags[id.toString()] !== undefined){
							//if an element has the same id number (very rare probabilty but we have to be sure)
							//it will try another one
							id = Math.floor(Math.random() * 1000000 + 1); // id overriding
						}
						jQelem.attr("id", id);
						jQelem = $("#" + id); //with new id, we have to select our element again
					}
					var container = FragBase.frags[jQelem.parent().attr("id")]; //container of this element, holder
					//we should generate style and attribute objects
					var styles = FragBase.generateStyles(jQelem);
					var attrs = FragBase.generateAttributes(jQelem);
					
					//Editable frag's html can be editable, because of the contenteditable option
					if(jQelem.attr("id") !== "fragcon") jQelem.addClass("editable-frag");
					//Finally, we have all we need to create a frag, lets do this
					FragBase.addFrag(new FragBase.frag(id, container, styles, attrs));
				},
				scanPage: function(){
					//Basically, scans page for all html elements and turns them into frags
					//but first, we need to convert our main div to a frag
					FragBase.fragjQuery($("#fragcon"));
					var scanner = "#fragcon > *";
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
					$(".editable-frag").on("dblclick",function(){
						//Display frags when double clicked
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
				},
				displayFrag: function(frag){
					//remove table body content
					$("#fragAttr").html("");
					$("#fragStyle").html("");
					//display attributes
					for(var attr in frag.attrs){
						//Display attrbutes if they are not undefined
						if(frag.attrs[attr] !== undefined
						&& frag.attrs[attr] !== "")
						{
							$("#fragAttr").append('<tr class="success"><td contenteditable="true">' + attr + '</td><td contenteditable="true">' + frag.attrs[attr] + '</td></tr>');
						}else{
							$("#fragattrs > div > table > tbody").append('<tr><td contenteditable="true">' + attr + '</td><td contenteditable="true">' + frag.attrs[attr] + '</td></tr>');
						}
					}
					
					var addedStyles = []; // added styles is whose in elements style attribute
					var editedStyles = []; // styles that hasn't got default value
					var standardStyles = []; // styles which has default value
					for(var style in frag.styles){
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
					for(var prop in addedStyles){
						$("#fragStyle").append('<tr class="info"><td contenteditable="true">' + addedStyles[prop] + '</td><td contenteditable="true">' + frag.styles[addedStyles[prop]] + '</td></tr>');
					}
					for(var prop in editedStyles){
						$("#fragStyle").append('<tr class="success"><td contenteditable="true">' + editedStyles[prop] + '</td><td contenteditable="true">' + frag.styles[editedStyles[prop]] + '</td></tr>');
					}
					for(var prop in standardStyles){
						$("#fragStyle").append('<tr><td contenteditable="true">' + standardStyles[prop] + '</td><td contenteditable="true">' + frag.styles[standardStyles[prop]] + '</td></tr>');
					}
					$("#editFrag").modal();
				},
				editFrag: function(){
					
				},
				
				// ----HELPER FUNCTÝONS ------
				generateStyles: function(jQelem){
					// This function is for fragjQuery method to generate all css styling for an element
					var gstyle = {}; //gstyle is for generated style
					for(var key in cssStyles){
						//loop through all styles in an element
						if(jQelem.css(cssStyles[key]) !== ""){
							gstyle[cssStyles[key]] = jQelem.css(cssStyles[key]);//add that rules to gstyle
						}
					}
					return gstyle;//return generated style element for frag constructor
				},
				generateAttributes: function(jQelem){
					var gattr = {};
					for(var key in htmlAttrs){
						//loop through all attributes in an element
						if(jQelem.attr(htmlAttrs[key]) !== undefined){
							gattr[htmlAttrs[key]] = jQelem.attr(htmlAttrs[key]);//add that rules to gattr
						}
					}
					return gattr;//return generated attribute variables
				}
			}