// JavaScript Document
//库：    放一些内置函数的扩展  （String,  Array,  Object ）
//       放一些自定义的函数，这些函数为了不与别的库冲突，定义到一个命名空间（对象）中

(function(){
   //给window添加了一个属性  [命名空间]
   if( !window.yc){
      //window.yc={};
	  window['yc']={};
   }
  // 第一种写法：   这种写法是指在windows下面加了一个yc属性，并且定义了一个yc原型，在yc的原型下定义了一个$函数。
  /* window.yc.prototype={
      
	  $:function(){}
	  
   }*/
   
  
  //第二种写法：   这种写法是直接在yc下面定义了一个$函数。
  //window.yc.$=$;
  
  
  //第三种写法：  这种写法是直接在yc下面定义了一个$函数。
  
  //////////////////获取页面元素 //////////
  
  //需要实现的功能：   <div id="a">    <div id="b"> 
                //  $("a")   var array=$("a","b");     =>   1个参数则返回一个对象     array  => 1   array  =>  2
				//如果参数是一个字符串，则返回一个对象
				//如果参数是多个字符串，则返回一个数组
				
  function $( ){
     var elements=new Array();      //创建一个新的数组
	 //查找作为元素提供的所有元素
	 for(var i=0;i<arguments.length;i++){
		var element=arguments[i];
		//如果这个元素是一个string,则表明这是一个id
		if(typeof element=='string'){      //判断数组的类型
		   element=document.getElementById(element);         //在document下创建一个id（element）
		} 
		if(  arguments.length==1 ){       //判断数组长度是否为1，为1说明数组只有一个（id）元素
		    return element;	            //则返回这个id        
		}
		elements.push( element );        //把id名加到新的数组里面去
      }
	  return elements;            //返回新的数组
  }
   window['yc']['$']=$;
 
  //判断当前浏览器是否兼容这个库： 浏览器能力检测。
  function isCompatible( other ){
     if( other===false || !Array.prototype.push || !Object.hasOwnProperty  || !document.createElement  || !document.getElementsByTagName ){     //判断这些事件是否存在
	       return false;
	  }
	  return true;
  };
  window['yc']['isCompatible']=isCompatible;     //在window里面添加属性
  
  
  function mergeObject( defaultvalue, realvalue){
	    if( realvalue && typeof realvalue=='object'){
	       for(var key in realvalue){      //name   pages    key通过键取出值
		      defaultvalue[key]=realvalue[key] || defaulevalue[key];   //realvalue['name'] => 'java深入钱出'   realvalue['pages']=>500
			  /*if( realvalue[key]){
			    defaultvalue[key]=realvalue[key];
			  }else{
			     defaultvalue[key]=defaultvalue[key];
			   }*/
		   }
		}
		return defaultvalue;
	}
	window['yc']['mergeObject']=mergeObject;
  
 
 
 /////////////////////////////////事件操作 //////////  ///////////////////// 
  //增加事件：  node：节点    type：事件类型 （'click'）    listener:监听器函数
  function addEvent(node,type,listener){
     if( !isCompatible() ){return false;}     //判断是否兼容
	 if( !(node=$(node) )){return false;}     //判断是否能取到node,若是没有，则返回false
	 //W3C加事件的方法
	 if( node.addEventListener  ){        //在火狐、谷歌等浏览器里面的监听事件
         node.addEventListener(type,listener,false);     //普通的添加监听事件  节点.addEventListener()
		 return true;
	 }else if( node.attachEvent ){      //attachEvent是IE浏览器里面支持的属性
         //MSIE的事件
		 node['e'+type+listener]=listener;      //node['e'+type+listener]为属性命一个名，防止属性名相同，所以取的较长（复杂）。
		 node[type+listener]=function(){
		    node['e'+type+listener]( window.event );     //加window.event事件是为了找到浏览器的窗口大小和鼠标所在位置，必须有。
			//listener(window.event);
		}
		node.attachEvent('on'+type,node[type+listener]);     //在IE浏览器里面，点击事件必须前面加"on"，后面是类型type，若是点击事件，它的type='click';
		return true;
	 }
  };
  window['yc']['addEvent']=addEvent;
  
  
    //页面加载事件
  function addLoadEvent( func){
      //将现有的window.onlad事件处理函数的值存入变量oldOnLoad
	  var oldOnLoad=window.onload;
	  //如果在这个处理函数上还没有绑定任何函数，就像平时那样把新函数添加给它。
	  if( typeof window.onload!='function'){
	      window.onload=func;
	  }else{
	      //如果在这个处理函数上已经绑定了一些函数，则将新函数追加到现有指令的尾部。
		  window.onload=function(){
		      oldOnLoad();     //如果以前这个页面有函数，则调用以前的函数
		      func();         //再调用当前函数
		  }
	  }
  }
  window['yc']['addLoadEvent']=addLoadEvent;
  
  
  //移除事件
  function removeEvent(node,type,listener){
      if( !(node=$(node)) ){return false;}
	  if( node.removeEventListener){    //ff,谷歌浏览器的删除属性
	      node.removeEventListener( type,listener,false);     //false应跟调用它的函数那里保持一致，那边是false,则用false，那边用true,则使用true
		  return true;
	  }else if( node.detachEvent ){    //detachEvent是IE的删除函数
	      node.detachEvent('on'+type,node[type+listener]);
		  node[type+listener]=null;      //必须用空替换掉，不然可能出错，这是IE浏览器规定的
		  return true;
	  }
	  return false;
  };
  window['yc']['removeEvent']=removeEvent;
 /////////////注意点：  添加事件时用的函数必须与删除时用的函数要是同一个函数     
 /*    var show=function(){
	      alert("hello");
	   }
       yc.addEvent("show","click",show);        //添加事件时用了一个函数
	   yc.removeEvent("show","click",show);     //删除时用了另一个函数
	   //以上对
	   yc.addEvent("show","click",function(){alert("hello");});
	   yc.removeEvent("show","click",function(){alert("hello");});
	   //以上错误，无法移除，因为匿名函数是两个函数。
*/
 
 
 
 
 //className: 要找的类名    tag:要查找的标签     parent:如果有的话，表示tag所属的容器
 function getElementsByClassName( className,tag,parent ){
    parent=parent||document;       //查看是否能找到parent,若是没有parent,那么就是document.xxx
	if( !(parent=$(parent)) ){      //查找是否存在parent,不存在则返回false，否则返回true
	    return false;
	}
	//查看所有匹配的标签
	var allTags=(tag=="*"&&parent.all)?parent.all:parent.getElementsByTagName(tag);
	var matchingElements=new Array();
	//创建一个正则表达式，来判断className是否正确     ^a   |   a
	//这个正则表达式代表的意思是：以类名开始或结束，或者以空格开始或结束来跟类名进行匹配
	var regx=new RegExp( "(^|\\s)"+className+"(\\s|$)" );    //两边都使用了分组，与className进行匹配
	var element;
	//检查每一个元素
	for(var i=0;i<allTags.length;i++ ){      //循环出所有的节点
       element=allTags[i];
	   if( regx.test(element.className) ){
	      matchingElements.push( element );
	   }
	}
	return matchingElements;
 };
 window['yc']['getElementsByClassName']=getElementsByClassName;
 
 
 //开关操作       toggle：开关，触发器，栓扣
 function toggleDisplay(node,value){          //传节点和开始设置的display值进来
     if( !(node=$(node))){ return false;}       //判断是否存在此节点
	 if( node.style.display!='none'){         //如果开始是显示的
	    node.style.display='none';            //那么就把它隐藏
	 }else{                                
        node.style.display=value||'';        //否则就取它本身值或者取空。
	 }
	 return true;
 };
 window['yc']['toggleDisplay']=toggleDisplay;
 
 
 //////////////DOM中的节点操作补充///////////////
////   a.appendChild(b)   在a的子节点的最后加入 b
////   a.insertBefore(b);    在a的前面加入一个b  （当前结点加一个节点）
    
	//新增的第一个函数：  给  referenceNode的后面加入一个node
	function insertAfter(node,referenceNode){
	    if( !(node=$(node))){return false;}
		if( !(referenceNode=$(referenceNode))){return false;}
		var parent=referenceNode.parentNode;
		if( parent.lastChild==referenceNode){
		    parent.appendChild(node);
		}else{
	        parent.insertBefore(node,referenceNode.nextSibling);
		}
	};
	window['yc']['insertAfter']=insertAfter;
	
  //标准（删除节点）:node.removeChild(childNode) => 一次只能删除一个子节点
  
  
  
  //新增的第二个函数：一次删除所有的子节点
  function removeChildren(parent){
     if( !(parent=$(parent))){return false;}
	 while( parent.firstChild){
	    parent.removeChild( parent.firstChild );
	 }
	 //返回父元素，以实现方法连缀。
	 return parent;
  };
 window['yc']['removeChildren']=removeChildren;
 
//在一个父节点的第一个子节点前面添加一个新节点 
 function prependChild( parent,newChild ){
     if(!(parent=$(parent))){ return false;}
	 if(!(newChild=$(newChild))){return false;}
	 if( parent.firstChild){     //查看parent节点下是否有子节点
	    //如果有一个子节点，就在这个子节点前添加
		parent.insertBefore( newChild,parent.firstChild);
	 }else{
	    //如果没有子节点则直接添加
		parent.appendChild(newChild);
	 }
	 return parent;
 };
 window['yc']['prependChild']=prependChild;
 
 
 
 //替换模板文字   str:模板文字中包包含   {属性名}，
//       o：是对象，格式{属性名：值}
//以o对象中对应的属性名的值来替换str模板。

  /* function supplant(str,o){
	       //   /g  整个字符串全部匹配
		   //   //  正则表达式的标志
		   //   {()}: ()分组，将匹配的值存起来。
      return str.replace(/{([a-z]*)}/g,
	      function (a,b){
			 //alert(a+"\t"+b);    //a:{border}  b:{border}
		     var r=o[b];     //o["border"]=> 2
			               //o["{border}"]
			//return typeof r==='string'?: r :a;
			 return r;
		  }
	  );
   };*/
 //另一种方法：
   var supplant=function(template,data){
      for(var i in data){     //循环data里面的属性，底下进行匹配。
		  //i: first, last, border
	     template=template.replace( "{"+i+"}", data[i] );
		 //template.replace("{border}",data["border"]);
	  }
	  return template;
   };
window['yc']['supplant']=supplant;

  
  //过滤：
   function parseJson( str,filter ){
       var result=eval( "("+str+")" );
	   if( filter!=null && typeof(filter)=='function' ){
	      for(var i in result){
		     result[i]=filter( i, result[i] );
		  }
	   }      //如果去掉这一截判断语句，它的功能就是直接把对象里面的值转成数组输出
	   return result;
   }
   window['yc']['parseJson']=parseJson;
   
   
   ////////////////////////////////////////////////////////////////////////
   /////////////////////    样式表操作第一弹：设置样式规则   ->增强了行内样式，缺点：css加  //////////////////////
   //////////////////////////////////////////////////////////////////////////////
   //camelize:驼峰命名法
   //将word-word 转换为 wordWord       font-size:转换为  fontSize
   
   function camelize( s ){    //s代表测试那边传入的值，可能是font-size  正则返回的值会是一个数组
       return s.replace(/-(\w)/g,function(strMatch, p1){      //-s  p1-> s
		   //如果不知道strMatch代表什么，可以在这里alert下，例：
		     //alert( strMatch );
	         return p1.toUpperCase();      //toUpperCase:代表小写转换为大写
	   });
   }
   window['yc']['camelize']=camelize;
   
   //将wordWord转换为word-word
   function uncamelize(s,sep){
       sep=sep||'-';     //sep:表示链接符-     下面的正则表达式表示：匹配小写和大写在一起的地方，分成了两个组
	   return s.replace(/([a-z])([A-Z])/g,function(match,p1,p2){
	             return p1+sep+p2.toLowerCase();      //toLowerCase:表示大写转换为小写
				 //以上表示小写-大写
	   });
   }
   window['yc']['uncamelize']=uncamelize;
   
   
   
   //通过id修改单个元素的样式  {"backgroundColor":"red"}
   //以下这种添加样式的方式是行内样式
   function setStyleById( element,styles ){    //element是指元素名，  styles指样式
       //取得对象的引用
	   if( !(element=$(element))){return false;}
	   //遍历styles对象的属性，并应用每一个属性。
	   for( property in styles){
	       if( !styles.hasOwnProperty(property) ){
		       continue;
		   }
		   if( element.style.setProperty ){
		       //    setProperty( "background-clor" );
			   //DOM2样式规范   setProperty(propertyName,value,priority);
			   //     uncamelize(property,'-')表示与传进去的值进行匹配，有-的就运行if里面的代码
			   //    setProperty();表示W3c
			   element.style.setProperty( uncamelize(property,'-'),styles[property],null);   //第一个值代表属性名 例：background-color，第二个值代表属性值 例： red， 第三个值null代表索引值
		   }else{
		        //备用方法  element.style["backgroundColor"]="red";
				//IE浏览器
				element.style[camelize(property)]=style[property];
		   }
	   }
	   return true;
   }
   window['yc']['setStyle']=setStyleById;
   window['yc']['setStyleById']=setStyleById;
   
   
   //通过标签名修改单个样式：调用举例：yc.setStylesByTagName('a',{'color':'red'});
   //tagname:标签名    styles：样式对象      parent：父标签的ID号
   function setStylesByTagName( tagname,styles,parent){
       parent=$(parent)||document;
	   var elements=parent.getElementsByTagName( tagname );   //查找出所有的标签名
	   for( var e=0;e<elements.length;e++){
	        setStyleById( elements[e],styles);
	   }
   }
   window['yc']['setStylesByTagName']=setStylesByTagName;
   
   
   //通过类名修改多个元素的样式      
   //parent：父元素的id       tag:标签名      className:标签上的类名       style:样式对象
   function setStylesByClassName( parent,tag,className, styles){
       if( !(parent=$(parent))){return false;}
	   var elements=getElementsByClassName( className,tag,parent);
	   for( var e=0;e<elements.length;e++){
	       setStyleById( elements[e],styles);
	   }
	   return true;
   }
   window['yc']['setStylesByClassName']=setStylesByClassName;
   
   
   //////////////////////////////////////////////////////////////////////////////////////////
   ///////////////////////////样式表操作第二弹：基于className切换样式 /////////////////////////////
   //////////////////////////////////////////////////////////////////////////////////////////
   //取得元素中类名的元素    
   //element：要查找的类名的元素
   function getClassNames( element ){
       if( !(element=$(element))){return false;}
	   //用一个空格替换多个空格，在基于空格分割类名
	   return element.className.replace(/\s+/,' ').split(' ');
   }
   window['yc']['getClassNames']=getClassNames;
   
   //检查元素中是否存在某个类
   //   element：要查找类名的元素       className：要查找的类名
   
   function hasClassName( element,className ){
        if( !(element=$(element))){
	        return false;
		}
		var classes=getClassNames(element);      //得到所有的类名
		for( var i=0;i<classes.length;i++){
	        if(classes[i]===className){
			    return true;
			}
		}
		return false;
   }
   window['yc']['hasClassName']=hasClassName;
   
   
   //为元素添加类
   //element:要添加类名的元素
   //className：要添加的类名
   function addClassName( element,className){
        if( !(element=$(element))){return false;}
		//将类名添加到当前className的末尾，如果没有类名，则不包含空格
		var space=element.className?' ':'';
		//a b        b
		element.className+=space+className;
		return true;
   }
   window['yc']['addClassName']=addClassName;
   
   
   //从元素中删除类
   function removeClassName( element,className){
       if(!(element=$(element))){return false;}
	   //先获取所有的类
	   var classes=getClassNames(element);
	   //循环遍历数组删除匹配的项
	   //因为从数组中删除项会使数组变短，所以要反向删除
	   var length=classes.length;
	   var a=0;
	   for( var i=length-1;i>=0;i--){
	       if(classes[i]===className){
		       delete(classes[i]);
		   } 
	  }
	  element.className=classes.join(' ');
	  //判断删除是否成功。。。
	  return (length==a?false:true);
   }
   window['yc']['removeClassName']=removeClassName;
   
   
   ////////////////////////////////////////////////////////////////////////////////////////////////
   ///////////////////////////////第三部分：更大范围的改变，切换样式表
   ////////////////////////////////////////////////////////////////////////////////////////////////
//通过url取得包含所有样式表的数组   
   
   function getStyleSheets(url,media){
       var sheets=[];
	   for( var i=0;i<document.styleSheets.length;i++){
	      	if(   !document.styleSheets[i].href  ){
				continue;	
			}
		   if( url&&document.styleSheets[i].href.indexOf(url)==-1){
			       continue;
			}
			if( media ){
			    //规范化media字符串
				media=media.replace(/,\s*/,',');
				var sheetMedia;
				if( document.styleSheets[i].media.mediaText){
				    //DOM方法
					sheetMedia=document.styleSheets[i].media.mediaText.replace(/,\s*/,',');
					//safari会添加额外的逗号和空格
					sheetMedia=sheetMedia.replace(/,\s*$/,'');
				}else{
			        //ie方法
					sheetMedia=document.styleSheets[i].media.replace(/,\s*/,',');
				}//如果media不匹配，则跳过
				if(media!=sheetMedia){
			         continue;
				}
			}
			sheets.push( document.styleSheets[i] );
	   }
	   return sheets;
  }
  window['yc']['getStyleSheets']=getStyleSheets; 
   
   
   
   //添加新样式表
   
   function addStyleSheet( url,media ){
       media=media|| 'screen';        //短路的操作，后面是个字符串一定为true,前面的media可能没有传值，为false
	   var link=document.createElement('LINK');      //创建节点后面最好用大写，来区分开来
	   link.setAttribute('href',url);            //创建节点的属性还有一种写法：  link.href='url';
	   link.setAttribute('rel','stylesheet');
	   link.setAttribute('media',media);
	   link.setAttribute('type','text/css');
	   document.getElementsByTagName('head')[0].appendChild( link );
   }
   window['yc']['addStyleSheet']=addStyleSheet;
   
   //移出样式表
   function removeStyleSheet( url,media ){
       var styles=getStyleSheets( url,media );
	   for( var i=0;i<styles.length;i++){
	       //    styles[i]：表示样式表  ->   .ownerNode:表示这个样式表所属的节点<link>
		   var node=styles[i].ownerNode || styles[i].owningElement;
		   //禁用样式表
		   styles[i].disabled=true;
		   //移除节点
		   node.parentNode.removeChild( node );
	   }
   }
  window['yc']['removeStyleSheet']=removeStyleSheet; 
   
  //////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////第四部分：样式规则//////////////////////////////////////////////////////////// 
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //添加一条css规则，   yc.addCSSRule(  .test,{font-size:40%;color:red}),
  //如果存在多个样式表，可使用  url和media:   yc.addCSSRule('.test',{'text-decoration':'underline','style.css'} );
  
  function addCSSRule( selector,style,index,url,media ){
       var declaration='';
	   //根据styles参数（样式对象）构建声明字符串
	   for(property in styles){
	      if( !style.hasOwnProperty(property)){
		       continue;
		   }
		   declaration+=property+":"+style[property]+";";    //font-size:40%;color:red;
	   }
	   //根据url和media获取样式表
	   var styleSheets=getStyleSheets(url,media);
	   var newIndex;
	   //循环所有满足条件的样式表，添加样式规则
	   for(var i=0;i<styleSheets.length;i++){
	      //添加规则
		  if( styleSheets[i].insertRule ){
		     //计算规则添加的索引位置     cssRule  ->  W3C
			 newIndex=(index>=0?index:styleSheets[i].cssRules.length);
			 //DOM2样式规则添加的方法   insertRule( rule,index);
			 styleSheets[i].insertRule( selector+'('+declaration+')',newIndex);
		  }else if( styleSheets[i].addRule ){
	         //计算规则添加的索引位置
			 newIndex=(index>=0?index:-1);    //ie中认为规则列表最后一项用-1代表
			 //ie样式规则添加的方法    addRule( selector,style[,index]);
			 styleSheets[i].addRule( selector,declaration,newIndex);
		  }
	   }
  }
 window['yc']['addCSSRule']=addCSSRule;
 
  
  
  //编辑器样式规则：  yc.editCSSRule('.test',{'color':'red'});
  function editCSSRule( selector,styles,url,media ){
     //取出所有的样式表
	 var styleSheets=getStyleSheets(url,media);
	 //循环每一个样式表中的每条规则
	 for(var i=0;i<styleSheets.length;i++){
         //取得规则列表  DOM2样式规范方法是styleSheets[i].cssRules   ie方法是styleSheets[i].rules
		 var rules=styleSheets[i].cssRules||styleSheets[i].rules;
		 if( !rules ){
	         continue;
		 }
		 //ie默认选择器名使用大写故转换为大写形式，如果使用的是区分大小写的id，则可能会导致冲突
		 selector=selector.toUpperCase();
		 for( var j=0;j<rules.length;j++ ){
	         //检查规则中的选择器名是否匹配
			 if( rules[j].selectorText.toUpperCase()==selector){   //找到要修改的选择器
			     for( property in styles ){
				     if(!styles.hasOwnProperty(property)){
					     continue;
					 }
					 //将这条规则设置为新样式
					 rules[j].style[camelize(property)]=styles[property];   //rules[j].style['fontSize']='red'
				 }
			}
		 }
	 }
  }
  window['yc']['editCSSRule']=editCSSRule;
  
  
   
  //取得一个元素的计算样式
 function getStyle( element,property ){
     if(!(element=$(element))||!property){
        return false;
	 }
	 //检测元素style属性中的值
	 var value=element.style[ camelize(property) ];
	 if( !value ){
	    //取得计算值
		if( document.defaultView && document.defaultView.getComputedStyle ){
	        //DOM方法
			var css=document.defaultView.getComputedStyle(element,null);   //取出了element这个元素所有的计算样式
			value=css?css.getPropertyValue( property ):null;
		}else if( element.currentStyle ){
		    //IE方法
			value=element.currentStyle[ camelize(property) ];
		}
	 }
	 //返回空字符串而不是auto,这样就不必检查auto值了
	 return value=='auto'?'':value;
  }
  window['yc']['getStyle']=getStyle;
  window['yc']['getStyleById']=getStyle;       //这里写两个的原因，是为了好调用，随便用其中的一个名字就可以调用了
 
 
 //动画：定时移动元素
 //元素id     x最终位置        y最终位置         间隔时间
 
 function moveElement( elementId,final_x,final_y,interval ){
	 //浏览器检测及元素是否存在检测
       if( !isCompatible() ) return false;
	   if( !$(elementId) ) return false;
	   //取出元素
	   var element=$( elementId );
	   if( element.movement ){
	       clearTimeout( element.movement );
	   }
	   
	   //取出当前元素的位置,   x->left    y->top
	   var xpos=parseInt(element.style.left);     //element.style.left取出的值为10px,使用parseInt转换为10
	   var ypos=parseInt(element.style.top);
	   
	   //计算移动后的位置是否越界，并设置新位置
	   if( xpos==final_x && xpos==final_y ){
	       return true;
	   }
	   var dist=0;
	   if( xpos<final_x ){
		   dist=(final_x-xpos)/10;
	       xpos=xpos+dist;
	   }
	   if( xpos>final_x ){
	      dist=(xpos-final_x)/10;
	      xpos=xpos-dist;
	   }
	   if( ypos<final_y ){
	      dist=(final_y-ypos)/10;
	      ypos=ypox+dist;
	   }
	   if( ypos>final_y ){
	      dist=(ypos-final_y)/10;
	      ypos=ypos-dist;
	   }
	   //以上四句，可以实现上下左右移动
	   element.style.left=xpos+"px";
	   element.style.top=ypos+"px";

	   //定时器重复执行当前的移动操作   setTimeout( 函数声明，间隔时间);
	   //函数调用有这种例子：setTimeout("add()",20);  但是现在调用的括号里面得传参进去，所以不能写死了，故使用字符串拼接
	   var repeat="yc.moveElement('"+elementId+"',"+final_x+","+final_y+","+interval+")";
	   element.movement=setTimeout(repeat,interval);
	   
  }
 window['yc']['moveElement']=moveElement;
 
 
 
 
 
 ///////////////////////////////////////////////////////////////////////////////////////////////////
 //////////////////////////////  ajax封装  /////////////////////////////////////////////////////////
 //////////////////////////////////////////////////////////////////////////////////////////////////
 //对参数字符串编码    针对get请求    person.action?name=%xxx&xxx&age=20       name    张三   age=20
 
 function addUrlParam( url,name,value ){
     url+=(url.indexOf("?")==-1?"?":"&");
	 url+=encodeURIComponent( name )+"="+encodeURIComponent( value );
	 return url;
 }
 
 
 //序列化表单        name=zy&password=a
 function serialize(form){
      var parts=new Array();
	  var field=null;
	  //  form.elements   表单中所有的元素
	  for(var i=0,len=form.elements.length;i<len;i++){
	      field=form.elements[i];
		  switch(field.type){
		     case "select-one":
			 case "select-multiple":
			       for(var j=0,optLen=field.options.length;j<optLen;j++){
				         var option=field.options[j];
						 if(option.selected){
					        var optValue="";
							if(option.hasAttribute){
							    optValue=(option.hasAttribute("value")?option.value:option.text);
							}else{
							   optValue=(option.attributes["value"].specified?option.value:option.text);
							}
							parts.push(encodeURIComponent(field.name)+"="+encodeURIComponent(optValue));
						 }
				   }
				   break;
				   
				   case undefined:       //fieldset
				   case "file":          //file  input
				   case "submit":         //submit  button
				   case "reset":          //reset   button
				   case "button":         //custom button
				         break;
						 
				   case "radio":           //radio button
				   case "checkbox":        //checkbox
				         if(!field.checked){
						     break;
						 }
					/* falls through */
					
					default:
					     parts.push(encodeURIComponent(field.name)+"="+encodeURIComponent(field.value));
		 }
	  }
	  return parts.join("&");
  }
  window['yc']['serialize']=serialize;
  
  
  
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////  XML操作  ////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  //通用的获取   xmlHttpRequest对象的函数
  function getRequestionObject( url,options ){
      //初始化请求对象
	  var req=false;
	  if(window.XMLHttpRequest){
	      var req=new window.XMLHttpRequest();     //ie7+,  ff,   chrome  ......
	  }else if(window.ActiveXObject){
	     var req=new window.ActiveXObject('Microsoft.XMLHTTP');    //ie7以下浏览器
	  }
	  if(!req) return false;      //如果无法创建  request对象，则返回
	  
	  //定义默认选项
	  options= options || {};
	  options.method =options.method || 'POST';
	  options.send= options.send || null;         //req.open("POST",url,true);    req.send(null);
	  
	  //定义请求的不同状态时回调的函数
	  req.onreadystatechange=function(){
	      switch( req.readyState ){
		     case 1:
			     //请求初始化时，
				 if(options.loadListener.apply(req,arguments)){
				     options.loadListener.apply(req,arguments);   //apply /call  ->  this作用域
				 }
				 break;
			case 2:
			//加载完成
			   if(options.loadedListener){
			       options.loadedListener.apply(req,arguments);
			   }
			   break;
		   case 3:
			//加载完成
			   if(options.loadedListener){
			       options.loadedListener.apply(req,arguments);
			   }
			   break;
		   case 4:
		      //完成交互时的回调操作
			  try{
			     if(req.status && req.status==200 ){
				    var contentType=req.getResponseHeader("Content-Type");
					//截取出：   前面的部分，这一些表示的是内容类型
					var mimeType=contentType.match(/\s*([^;]+)\s*(;|$)/i)[1];
					switch(mimeType){
				        case 'text/javascript':
						case 'application/javascript':
						   //表示回送的数据是一个javascript代码
						   if(options.jsResponseListener ){
						      options.jsResponseListener.call(req,req.responseText);
						  }
						  break;
						 case 'text/plain':
						 case 'application/json':
						   //结果是json数据，先parseJSON,转成json格式，再调用处理函数处理
						   if(options.jsResponseListener){
						       try{
							      var json=parseJSON( req.resonseText);
							   }catch(e){
							      var json=false;
							   }
							   options.jsResponseListener.call(req,json);
						  }
						  break;
					 case 'text/xml':
					 case 'application/xml':
					 case 'application/xhtml+xml':
					 //响应的结果是一个xml字符串
					     if(options.xmlResponseListener){
				          options.xmlResponseListener.call(req,req.responseXML);
					     }
					     break;
				     case 'text/html':
					 //响应的结果是html
					      if(options.htmlResponseListener){
							  options.htmlResponseListener.call(req,req.responseText);
							  }
							  break;
					}
					//完成后的监听器
					if(options.completeListener){
					    options.completeListener.apply(req,arguments);
					}
				}else{
				    //响应码不为  200，
					if(options.errorListener){
					    options.errorListener.apply(req,arguments);
					}
				}
			  }catch(e){
			       //内部处理有错误时。
				   alert( e );
			  }
			  break;
		  }
	  };
	  //打开请求
	  req.open(options.method,url,true);
	  //在这里，可以加入自己的请求头信息（可以随便加）
	  //req.setRequestHeader('X-yc-Ajax-Request','AjaxRequest');
	  return req;
  }
 window['yc']['getRequestionObject']=getRequestionObject;
 
 
 //将 xml Dom对象 序列化转为 xml 字符串，
	function parseXmlDomObjectToText( xmlDom ){
	    if(xml.DOM.xml){
		    return xmlDOM.xml;      //xml文件内容
		}else{
		    var serializer = new XMLSerializer();
			return serializer.serializeToString(xmlDOM,"text/xml");
		}
	}
	window['yc']['parseXmlDomObjectToText']=parseXmlDomObjectToText;
 
 
 /*发送 ajax请求  XMLHttpRequest
      options对象的结构：{'method':'GET/POST',
		                'send':发送的参数,
						'loadListener':初始化回调   readyState=1
						'loadedListener':加载完成回调
						'ineractiveListener':交互时回调
						
						以下是 readyState=4的处理
						'jsResponseListener':结果是一个javascript代码时的回调处理函数
						'jsonResponseListener':结果是json时的回调处理
						'xmlResponseListener':结果是一个xml时的回调处理
						'htmlResponseListener':结果是一个html时的回调函数
						'completeListener':处理完成后的回调
						
						status==500
						'errorListener':响应码不为200时。
					   }
   */
   
   function ajaxRequest(url,options){
       var req=getRequestObject(url,options);
	   req.setRequestHeader("Content-Typ","application/x-www-form-urlencoded");
	   return req.send(options.send);   //send( null ) | send("name=zy");
   }
   window['yc']['ajaxRequest']=ajaxRequest;
   
   
  /* parseJSON(string,filter)
          String:要转换的字符串
		  filter:用于过滤和转换结果的可选参数。
		  
		  案例：
		      //如果键名中有date,则将值转为 data 对象
			  
			  myData = parseJSON(string,function(key,value){
			       return key.indexOf('date') >= 0 ? new Date(value) :value;
			  });
   */
   
   function parseJSON(s,filter){
	    var j;
		//递归函数：
		function walk(k,v){
		    var i;
			if(v && typeof v=== 'object'){
			     for(i in v){
				     if(v.hasOwnProperty(i)){
					     v[i]=walk(i,v[i]);
					 }
				 }
			}
			return filter(k,v);    //回调过滤函数，完成过滤操作
			
			//转换分成三个阶段，第一个阶段：通过正则表达式检测json文本，查找非json字符。其中特别是（）、new、因为它会引起语句的调用，还有=，它会导致赋值。为了安全，我们这里拒绝所有的不希望出现的字符。
		/*	
			首先这个串分成两部分，看中间的或符号（|）
			"（\\.|[^\\\n\r]）*?"和[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]
			先分解"(\\.|[^\\\n\r])*?"
			它匹配一个双引号的字符串，两边引号就不说了，括号内一个"|"又分成两段， "\\."匹配一个转义字符
			比如js字符串里的\n,\r,\',\"等。 [^\\\n\r]匹配一个非\,回车换行的字符 其实它就是js里字符串的规则---不包含回车换行，回车换行用 \n\r表示，\后面跟一个字符表示转义
			其次看[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]
			它匹配一个单个字符，这个字符可以是 ,，：，{，}，[,] , 数字，除"\n"之外的任何单个字符
			，-，+，E，a，e，f，l，n，r-u之间的字符，回车，换行，制表符，就这些结合起来，它其实把一个json拆分成若干段，字符串单独成一段，其它的都是单个字符成段（回车，换行，：，{，}等）
			*/
			
			if(/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.test(s)){
			     //第二阶段，将json字符串转为js结构
				 
				 try{
				    j=eval( '('+s+')');
				}catch(e){
				    throw new SyntaxError("eval parseJSON");
				}
			}else{
			     throw new SyntaxError("parseJSON");
			}
			
			//第三阶段：递归遍历了新生成的结构，将每个名/值对传递给一个过滤函数。
			if(typeof filter==='function'){
			    j=walk('',j);
			}
			return j;
		}
	};
	window['yc']['parseJSON']=parseJSON;
	
	
	//在xml dom 中不能使用getElementById方法，所以这里自己实现一个相似功能的函数
	function getElementByIdXML(rootnode,id){    //getElementByIdXML  == getElementById
	//先获取所有的元素
	       var nodeTags = rootnode.getElementsByTagName('*');
	       for(var i=0;i<nodeTags.length;i++){
			  if( nodeTags[i].hasAttribute('id')){
			       //取出属性名为id
				   if(nodeTags[i].getAttribute('id')==id){
				        return nodeTags[i];
				   }
			   }
	       }
	}
	window['yc']['getElementByIdXML']=getElementByIdXML;
	
	
	//将 xml的字符串  反序列化转为 xml Dom节点对象，以便于使用   getElementsByTagName()等函数来操作
	function parseTextToXmlDomObject(str){
	    if('\v'=='v'){
		   //Internet Explorer
		   var xmlNames=["Msxml12.DOMDocument.6.0","Msxml12.DOMDocument.4.0","Msxml12.DOMDocument.3.0","Msxml12.DOMDocument","Microsoft.XMLDOM","Microsoft.XmlDom"];
		   for(var i=0;i<xmlNames.length;i++){
		       try{
			       var xmlDoc=new ActiveXObject(xmlNames[i]);
				   break;
			   }catch(e){
			       
			   }
		   }
		   xmlDoc.async=false;
		   xmlDoc.loadXML(str);
		}else{
		   try{
		      //Firefox,  Mozilla, Opera, Webkit.
			  var parser=new DOMParser();
			  var xmlDoc=parser.parseFromString(str,"text/xml");
		   }catch(x){
		       alert(x.message);
			   return;
		   }
		}
		return xmlDoc;
	}
	window['yc']['parseTextToXmlDomObject']=parseTextToXmlDomObject;
	
	
	
	
   
})();


   
/*//递归遍历了新生成的结构，而且将每个名/值对传递给一个过滤函数，以进行可能的替换
    if( typeof filter==='function' ){
       j=walk('',j);
	}
	return j;
 }*/


//扩展全局的  object.prototype=xxx
//  object、array   ->   js中的原生对象
Object.prototype.toJSONString=function(){
  //需求： 给Object类的prototype添加一个功能  toJSONString(), 将属性的值以json格式输出
  //{"name":"zy","age":"20","sex":"男"}
  //for(var i in person ) person[i]取出值
  var jsonarr=[];
  for(var i in this){
	  if( this.hasOwnProperty( i ) ){
	       jsonarr.push(  "\""+i+"\""+":\""+this[i]+"\"" );  //  \"表示转义"" 
	   }
   }
   
   var r=jsonarr.join( " ,\n" );
   r="{"+r+"}";
   return r;      //返回json字符串
 }
  

//  [1,2,3]     
//  ["a","zs"]
//  [{"name":"zs","age":30},{"name":"zz","age":32}]
Array.prototype.toJSONString=function(){
    var json=[];
	for(var i=0;i<this.length;i++){
       json[i]=(this[i]!=null)? this[i].toJSONString() : "null";
	}
   return "["+json.join(",")+"]"     
}

String.prototype.toJSONString=function(){
    return '"'+ this.replace(/(\\|\")/g,"\\$1").replace(/\n|\r|\t/g,function(){
    var a=arguments[0];
	return (a=='\n')?'\\n':(a=='\r')?'\\r':(a=='\t')?'\\t':""})+'"';
}

Boolean.prototype.toJSONString=function(){
	if(!true){
	   return false;
	}
    return this;
}
Function.prototype.toJSONString=function(){return this}
Number.prototype.toJSONString=function(){
	var a;
	if( !typeof(a)=='number'){
	   
	}
	return this;
}
RegExp.prototype.toJSONString=function(){
	
	return this;
}



