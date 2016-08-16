								
		
			   var LineChart={
				keynames:[],//数据信息数组
				can:undefined,     //说明ID未定义
				ctx:undefined,      //绘制2D未定义
				width:undefined,     //宽度未定义
				lineColor:undefined,    //线颜色未定义
				dotColor:undefined,     //点颜色未定义
				isBg:false,             //是isBg就取false
				isMultiData:false,      //绘制折线的条数
			
				//传送数据函数
				setData:function(canId,data,padding,lineColor,dotColor,isBg,isMultiData,options){
				  this.lineColor = lineColor;
				  this.dotColor = dotColor;
				  this.can = document.getElementById(canId);
				  this.ctx = this.can.getContext("2d");
				  this.isBg = isBg;
				  this.isMultiData = isMultiData;
				  //绘制XY（第一个为数据，第二个为内边距，第三个为获取的ID，第五个为传入的值（XY的粗细，颜色，外面的字体））
				  this.drawXY(data,0,padding,this.can,options);
						
				},
				//所绘制的条数，多于一条isMultiData为true
			   isMultiData:function(data){
				  if(data.values.length>1){
					this.isMultiData = true;
				   }
				},//是否是多条数据线
				//绘制XY轴
				drawXY:function(data,key,padding,can,options){
					//给XY轴的粗细和颜色，字体设置一个默认值
					var defaultValue={
						 font:'宋体',
						 strokeStyle:'red',
						 lineWidth:4
						
						};
				//把默认值和真实值结合到一起，没有传值，就使用默认值，传了值就使用传进去的值		
				defaultValue=yc.mergeObject( defaultValue,options );
				
				this.ctx.lineWidth=defaultValue.lineWidth;    //线宽使用新的默认宽
				
				this.ctx.strokeStyle=defaultValue.strokeStyle;   //线的颜色使用新的默认色
				
				this.ctx.font = defaultValue.font+' 15px sans-serif';
				
				this.ctx.beginPath();     //开始绘制
				this.ctx.moveTo(padding,0)      //从设置的内边距值的那点（padding，0）开始绘制
				this.ctx.lineTo(padding,can.height-padding);       //Y轴的点到（内边距，画布的高度-内边距）
				this.ctx.lineTo(can.width,can.height-padding);     //X轴的点到（画布的宽度，画布的高度-内边距）
				this.ctx.stroke();           //绘制结束
				var perwidth = this.getPixel(data,key,can.width,padding);//x 轴每一个数据占据的宽度
				var maxY =  this.getMax(data,0,this.isMultiData);//获得Y轴上的最大值
				var yPixel = this.getYPixel(maxY,can.height,padding).pixel;
				var ycount = this.getYPixel(maxY,can.height,padding).ycount;
				//循环底部的文字
				for( var i=0,ptindex;i< data.values[key]["value"+key].length;i++ ){
					ptindex = i+1;
					var x_x = this.getCoordX(padding,perwidth,ptindex);
					var x_y = can.height-padding+20;
					this.ctx.fillText(data.values[key]["value"+key][i].x,x_x,x_y,perwidth);
				}
				this.ctx.textAlign = "right"//y轴文字靠右写
				this.ctx.textBaseline = "middle";//文字的中心线的调整
				for(var i=0;i< ycount/10;i++){    //循环出右边的文字
				   this.ctx.fillText(i*10,padding-10,(ycount/10-i)*10*yPixel,perwidth);    //右边的文本根据背景线和内边距的改变而改变。
				}
				if(this.isBg){
				   var x =  padding;
				   this.ctx.lineWidth="1";        //背景线的宽度
				   this.ctx.strokeStyle=defaultValue.strokeStyle;      //背景线的颜色
				   //根据点的总数，计算出有多少条背景线
				   for( var i=0;i< ycount/10;i++ ){       
					var y = (ycount/10-i)*10*yPixel;
					this.ctx.moveTo(x,y);     //表示绘制从（内边距、y的长度开始绘制
					this.ctx.lineTo(can.width,y);
					this.ctx.stroke();
				  }
				 }//选择绘制背景线
				this.ctx.closePath();
				this.drawData(data,0,padding,perwidth,yPixel,this.isMultiData);
				},//绘制XY坐标 线 以及点
				
				drawData:function(data,key,padding,perwidth,yPixel,isMultiData,lineColor){
				//判断是否存在折线
				if(!isMultiData){
					var keystr = "value"+key;
					this.ctx.beginPath();        //开始绘制
					this.ctx.lineWidth="2";      //线宽为2
					if(arguments[6]){     //线的颜色为它本身的颜色
						this.ctx.strokeStyle=lineColor;
					   }else{
					   this.ctx.strokeStyle=this.lineColor;
						 }
					 //连接点点之间的线
					var startX = this.getCoordX(padding,perwidth,0);
					var startY = this.getCoordY(padding,yPixel,data.values[key][keystr][0].y);
					this.ctx.beginPath();
					this.ctx.lineWidth="2";
					for( var i=0;i< data.values[key][keystr].length;i++ ){
					  var x = this.getCoordX(padding,perwidth,i+1);
					  var y = this.getCoordY(padding,yPixel,data.values[key][keystr][i].y);
					  this.ctx.lineTo(x,y);
					}
					this.ctx.stroke();
					this.ctx.closePath();
					/*下面绘制数据线上的点*/
					this.ctx.beginPath();
					this.ctx.fillStyle="rgb("+parseInt(Math.random()*256)+","+parseInt(Math.random()*256)+","+parseInt(Math.random()*256)+")";      //填充点的颜色为随机的
					for( var i=0;i< data.values[key][keystr].length;i++ ){
					   var x = this.getCoordX(padding,perwidth,i+1);
					   var y = this.getCoordY(padding,yPixel,data.values[key][keystr][i].y);
					   this.ctx.moveTo(x,y);
					   this.ctx.arc(x,y,3,0,Math.PI*2,true);//绘制数据线上的点
					   this.ctx.fill();
					}
					this.ctx.closePath();
					}else{//如果是多条数据线
					   for( var i=0;i< data.values.length;i++ ){
						 var color="rgb("+parseInt(Math.random()*256)+","+parseInt(Math.random()*256)+","+parseInt(Math.random()*256)+")";     //当有多条线时，可以随机生成颜色
						LineChart.drawData(data,i,padding,perwidth,yPixel,false,color);
						LineChart.drawKey(color,this.keynames[i],padding,i);
						 }
					  }
					},//绘制数据线和数据点
					getPixel:function(data,key,width,padding){
					  var count = data.values[key]["value"+key].length;     //根据数据的多少来决定点的数量
					  return (width-20-padding)/(count+(count-1)*1.5);  
					},//宽度
					getCoordX:function(padding,perwidth,ptindex){//下标从1开始 不是从0开始
						return 2.5*perwidth*ptindex+padding+10-2*perwidth;
					},//横坐标X 随ptindex 获得
					getCoordY:function(padding,yPixel,value){
						var y = yPixel*value;           //定义y的值和单位
						return this.can.height-padding-y;
					},//纵坐标X 随ptindex 获得(注意 纵坐标的算法是倒着的因为原点在最上面)
					getYPixel:function(maxY,height,padding){
						var ycount = (parseInt(maxY/10)+1)*10+10;//y轴最大值
						return {pixel:(height-padding)/ycount,ycount:ycount};
					},//y轴的单位长度
					
					//如果是多数据的情况，可以自己调整背景色和右边的数值	
					getMax:function(data,key,isMultiData){
						if(!isMultiData){
							var maxY = data.values[key]["value"+key][0].y;
						    var length = data.values[key]["value"+key].length;
   						    var keystr = "value"+key;
						    for( var i=1;i< length;i++ ){
							if(maxY< data.values[key][keystr][i].y) maxY=data.values[key][keystr][i].y;
						  }
						  return maxY;//返回最大值 如果不是多数据
						  }else{
							var maxarr=[];
							var count = data.values.length;//多条数据的数据长度
							for(var i=0;i< count;i++){
							maxarr.push(LineChart.getMax(data,i,false));
							}
							var maxvalue = maxarr[0];
							for(var i=1;i< maxarr.length;i++){
							maxvalue = (maxvalue< maxarr[i])?maxarr[i]:maxvalue; 
							}
							return maxvalue;
						}//如果是多数据
					   },
						
					setKey:function(keynames){//keynames 是数组
						for(var i=0;i< keynames.length;i++){
							this.keynames.push(keynames[i]);//存入数组中
						}
					 },
				//绘制底下说明数据线，把点和线连接起来	
				drawKey:function(color,keyname,padding,lineindex){
						var x = padding+10;
						var y = this.can.height - padding+20+13*(lineindex+1);
						this.ctx.beginPath();
						this.ctx.strokeStyle = color;
						this.ctx.font="10px";
						this.ctx.moveTo(x,y);
						this.ctx.lineTo(x+50,y);
						this.ctx.fillText(":"+keyname,x+80,y,30);
						this.ctx.stroke();
						this.ctx.closePath();
				}	
		   }
		   
		   
		   //绘制圆
		   
		 //canvasId指Id值、   data-arr:每一部分所占的比例   color-arr:每一部分所对应的颜色    text-arr:定义每一部分的意义
  function drawCircle(canvasId, data_arr, color_arr, text_arr)
      {
       var c = document.getElementById(canvasId);     //获取ID
       var ctx = c.getContext("2d");               //绘制2d图形
       var radius = c.height / 2 - 20; //半径
       var ox = radius + 20, oy = radius + 20; //圆心
       var width = 30, height = 10; //图例宽和高
       var posX = ox * 2 + 20, posY = 30;   //
       var textX = posX + width + 5, textY = posY + 10;
       var startAngle = 0; //起始弧度
       var endAngle = 0;   //结束弧度
       for (var i = 0; i < data_arr.length; i++)
       {
          //绘制饼图
          endAngle = endAngle + data_arr[i] * Math.PI * 2; //结束弧度
          ctx.fillStyle = color_arr[i];
          ctx.beginPath();
          ctx.moveTo(ox, oy); //移动到到圆心
          ctx.arc(ox, oy, radius, startAngle, endAngle, false);
          ctx.closePath();
          ctx.fill();
          startAngle = endAngle; //设置起始弧度
          //绘制比例图及文字
           ctx.fillStyle = color_arr[i];
           ctx.fillRect(posX, posY + 20 * i, width, height);
           ctx.moveTo(posX, posY + 20 * i);
           ctx.font = 'bold 12px 微软雅黑';    //斜体 30像素 微软雅黑字体
           ctx.fillStyle = color_arr[i]; //"#000000";
           var percent = text_arr[i] + "：" + 100 * data_arr[i] + "%";
           ctx.fillText(percent, textX, textY + 20 * i);     //文本填充
       }
     }
 
	
		
			   