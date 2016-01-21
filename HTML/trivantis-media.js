/**************************************************
Trivantis (http://www.trivantis.com)
**************************************************/

var ocmOrig = document.oncontextmenu
var ocmNone = new Function( "return false" )

// Media Object
function ObjMedia(n,m,a,l,x,y,w,h,v,z,c,d,cl) {
  this.name = n
  this.mediaString = ' SRC="'+m+'"'
  this.x = x
  this.y = y
  this.w = w
  this.h = h
  this.c = c
  this.isPlaying = false
  this.bVis = v
  this.v = v
  this.z = z
  this.hasOnUp = false
  this.hasOnRUp = false
  this.obj = this.name+"Object"
  this.parmArray = new Array
  this.numParms = 0
  if( l ) this.loopString = ' LOOP="TRUE"'
  else this.loopString = ' LOOP="FALSE"'
  this.embed=''
  this.BuildMediaString( a );
  this.alreadyActioned = false;
  eval(this.obj+"=this")
  if ( d != 'undefined' && d!=null )
    this.divTag = d;
  else  
    this.divTag = "div";
    
  this.mediaType = '';
    
  this.childArray = new Array  
  this.addClasses = cl;
}

function ObjMediaBuildMediaString( bPlay ){
  var autoStr=''
  var contStr=''
  var scaleStr=''
  var width=this.w
  var height=this.h
  var addIEheight=20
  this.isPlaying = bPlay
  if( this.isPlaying ) autoStr = ' AUTOSTART="TRUE"'
  else autoStr = ' AUTOSTART="FALSE"'
  if( !this.bVis ) autoStr += ' hidden="TRUE"'
  if( this.mediaString.indexOf(".rm") >= 0 ||
      this.mediaString.indexOf(".ram") >= 0 ) {
      this.mediaType = 'real'
    if( this.name.indexOf("video") >= 0 ) {
     contStr += ' controls="ImageWindow'
     if( this.c ) contStr+=',ControlPanel'
     contStr += '"'
    } else if ( this.c ) contStr=' controls="ControlPanel"'
    
  }
  else if( this.mediaString.indexOf(".avi") >= 0 || this.mediaString.indexOf(".wmv") >= 0 || this.mediaString.indexOf(".asf") >= 0 ) {
    this.mediaType = 'media'
    if( !is.ns ) {
      if( this.c ) {
        contStr += ' ShowControls="TRUE"'
        height += addIEheight
      }
      else contStr += ' ShowControls="FALSE"'
    }
  }
  else if (this.mediaString.indexOf(".mov") >= 0 || this.mediaString.indexOf(".mp4") >= 0 ) {
    this.mediaType = 'quick'
    if( this.c == 0) height += addIEheight
    scaleStr=' scale="tofit"'
  }
  else if ( this.mediaString.indexOf(".mp") >= 0 ) {
    if( this.c )
      contStr += ' ShowControls="TRUE"'
    else
      contStr += ' ShowControls="FALSE"'
  }
  else if( this.mediaString.indexOf(".wma") >= 0 )  this.mediaType = 'media';
  else if( this.c ) {
    this.mediaType = 'quick'
    if( is.ns ) {
	  var plugin = "audio/x-mpeg\""
      var mimeType = eval( "navigator.mimeTypes[\"" + plugin + "]")
      if( mimeType && (!mimeType.enabledPlugin || mimeType.enabledPlugin.name.indexOf( "QuickTime" ) < 0) ) {
	    width = 145
	    height = 60
	  }
    }
    else if( is.ieMac ) height -= 10
	else if( !is.ns ) {
	  height += addIEheight
	}
  }
  this.embed = '<EMBED' +this.mediaString+contStr
  this.embed += ' WIDTH=' + width + ' HEIGHT=' + height 
  this.embed += ' NAME=' + this.name
  this.embed += autoStr+scaleStr+this.loopString+'>\n'
}

function ObjMediaActionGoTo( destURL, destFrame ) {
  this.objLyr.actionGoTo( destURL, destFrame );
}

function ObjMediaAddParm( newParm ) {
  this.parmArray[this.numParms++] = newParm;
}

function ObjMediaActionGoToNewWindow( destURL, name, props ) {
  this.objLyr.actionGoToNewWindow( destURL, name, props );
}

function ObjMediaActionPlay( ) {
  if( this.mediaType == 'real')
    eval("document."+this.name+".DoPlayPause()");
  else if( this.mediaType == 'quick')
    eval("document."+this.name+".Play()");
  else if( this.mediaType == 'media' ) {
    if( is.ie ) 
      eval("document."+this.name+".play()");
    else if( is.ns )
      eval("document."+this.name+".controls.play()");
  }
  else {  
    this.BuildMediaString( true );
    this.objLyr.write( this.embed );
  }
  this.isPlaying == true; 
}

function ObjMediaActionStop( ) {
  this.BuildMediaString( false );
  this.objLyr.write( this.embed );
}

function ObjMediaActionPause( ) {
  if( this.mediaType == '')  {
	if( this.mediaString.indexOf(".rm") >= 0 ||
      this.mediaString.indexOf(".ram") >= 0 ) {
      this.mediaType = 'real'
	}
	else if( this.mediaString.indexOf(".avi") >= 0 || 
		  this.mediaString.indexOf(".wmv") >= 0 || 
		  this.mediaString.indexOf(".asf") >= 0 ||
		  this.mediaString.indexOf(".wma") >= 0 )  
	  this.mediaType = 'media';
	  
	else if (this.mediaString.indexOf(".mov") >= 0 || 
	       this.mediaString.indexOf(".mp4") >= 0 ||
		   this.mediaString.indexOf(".aif") >= 0 || 
		   this.mediaString.indexOf(".mid") >= 0 ||
		   this.mediaString.indexOf(".au") >= 0) 
	  this.mediaType = 'quick'
  }
  if( this.mediaType == 'real')
    eval("document."+this.name+".DoPause()");
  else if( this.mediaType == 'quick')
    eval("document."+this.name+".Stop()");
  else if( this.mediaType == 'media' ) {
    if( is.ie ) 
      eval("document."+this.name+".pause()");
    else if( is.ns )
      eval("document."+this.name+".controls.pause()");
  }
  else {  
    this.BuildMediaString( false );
    this.objLyr.write( this.embed );
  }
  this.isPlaying == false;
}


function ObjMediaActionShow( ) {
  if( !this.isVisible() )
    this.onShow();
}

function ObjMediaActionHide( ) {
  if( this.isVisible() )
    this.onHide();
}

function ObjMediaActionLaunch( ) {
  this.objLyr.actionLaunch();
}

function ObjMediaActionExit( ) {
  this.objLyr.actionExit();
}

function ObjMediaActionChangeContents( newMedia ) {
  if (newMedia != null)
    this.mediaString = ' SRC="' +newMedia +'"'
  this.BuildMediaString( false );
  if( is.ns5 ) this.objLyr.ele.innerHTML=this.embed
  else this.objLyr.write( this.embed );
}

function ObjMediaActionTogglePlay( ) {
  if( this.isPlaying == false ) {
    this.actionPlay()
  }
  else {
    this.BuildMediaString( false )
    this.objLyr.write( this.embed )
  }
}

function ObjMediaActionToggleShow( ) {
  if( ( is.ie && this.bVis ) || ( !is.ie && this.objLyr.isVisible() ) ) this.actionHide();
  else this.actionShow();
}

function ObjMediaSizeTo( w, h ) { 
    this.w = w
    this.h = h
    this.actionChangeContents( null )
}

{ //Setup prototypes
var p=ObjMedia.prototype
p.BuildMediaString = ObjMediaBuildMediaString
p.addParm = ObjMediaAddParm
p.build = ObjMediaBuild
p.init = ObjMediaInit
p.activate = ObjMediaActivate
p.capture = 0
p.up = ObjMediaUp
p.down = ObjMediaDown
p.over = ObjMediaOver
p.out = ObjMediaOut
p.onOver = new Function()
p.onOut = new Function()
p.onSelect = new Function()
p.onDown = new Function()
p.onUp = new Function()
p.onRUp = new Function()
p.actionGoTo = ObjMediaActionGoTo
p.actionGoToNewWindow = ObjMediaActionGoToNewWindow
p.actionPlay = ObjMediaActionPlay
p.actionStop = ObjMediaActionStop
p.actionShow = ObjMediaActionShow
p.actionHide = ObjMediaActionHide
p.actionLaunch = ObjMediaActionLaunch
p.actionExit = ObjMediaActionExit
p.actionChangeContents = ObjMediaActionChangeContents
p.actionTogglePlay = ObjMediaActionTogglePlay
p.actionToggleShow = ObjMediaActionToggleShow
p.writeLayer = ObjMediaWriteLayer
p.onShow = ObjMediaOnShow
p.onHide = ObjMediaOnHide
p.isVisible = ObjMediaIsVisible
p.sizeTo    = ObjMediaSizeTo
p.onSelChg = new Function()
p.actionPause = ObjMediaActionPause
}

function ObjMediaBuild() {
  this.css = buildCSS(this.name,this.x,this.y,null,null,this.v,this.z,this.clip)
  this.div = '<' + this.divTag + ' id="'+this.name+'"'
  if( this.addClasses ) this.div += ' class="'+this.addClasses+'"'
  this.div += '><a name="'+this.name+'anc"'
  if( this.w ) this.div += ' href="javascript:' +this.name+ '.onUp()"'
  this.div += '></a></' + this.divTag + '>\n';
}

function ObjMediaInit() {
  this.objLyr = new ObjLayer(this.name)
}

function ObjMediaActivate() {
  if( this.objLyr && this.objLyr.styObj && !this.alreadyActioned )
  if( this.v ) this.actionShow()
  if( this.capture & 4 ) {
    this.objLyr.ele.onmousedown = new Function("event", this.obj+".down(event); return false;")
    this.objLyr.ele.onmouseup = new Function("event", this.obj+".up(event); return false;")
  }
  if( this.capture & 1 ) this.objLyr.ele.onmouseover = new Function(this.obj+".over(); return false;")
  if( this.capture & 2 ) this.objLyr.ele.onmouseout = new Function(this.obj+".out(); return false;")
  if( this.embed && (!is.ie || !this.v ) ) {
    if( is.ns5 ) this.objLyr.ele.innerHTML = this.embed
    else this.objLyr.write( this.embed );
  }
}

function ObjMediaDown(e) {
  if( is.ie ) e = event
  if( is.ie && !is.ieMac && e.button!=1 && e.button!=2 ) return
  if( is.ieMac && e.button != 0 ) return
  if( is.ns && e.button!=0 && e.button!=2 ) return
  this.onSelect()
  this.onDown()
}

function ObjMediaUp(e) {
  if( is.ie ) e = event
  if( is.ie && !is.ieMac && e.button!=1 && e.button!=2 ) return
  if( is.ieMac && e.button!=0 ) return
  if( is.ns && e.button!=0 && e.button!=2 ) return
  if( e.button==2 )
  {
    if( this.hasOnRUp )
    {
      document.oncontextmenu = ocmNone
      this.onRUp()
      setTimeout( "document.oncontextmenu = ocmOrig", 100)
    }
  }
  else if( !is.ns5 )
    this.onUp()
}

function ObjMediaOver() {
  this.onOver()
}

function ObjMediaOut() {
  this.onOut()
}

function ObjMediaWriteLayer( newContents ) {
  if (this.objLyr) this.objLyr.write( newContents )
}

function ObjMediaOnShow() {
  this.alreadyActioned = true;
  if( is.ie ) {
    this.bVis = 1
    this.BuildMediaString( this.isPlaying )
    this.objLyr.write( this.embed );
  }
  this.objLyr.actionShow();
}

function ObjMediaOnHide() {
  this.alreadyActioned = true;
  if( is.ie ) {
    this.bVis = 0
    this.BuildMediaString( this.isPlaying )
    this.objLyr.write( this.embed );
  }
  this.objLyr.actionHide();
}

function ObjMediaIsVisible() {
  if( this.objLyr.isVisible() )
    return true;
  else
    return false;
}