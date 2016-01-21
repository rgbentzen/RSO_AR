function PageTrackingObj(exp, titleName){
   this.VarTrivPageTracking = new Variable( 'VarTrivPageTracking', null, 0, 0, null, exp, titleName, true );
   this.numPages = 0;
   this.publishTimeStamp = 0;
   this.title = null;
}

PageTrackingObj.prototype.InitPageTracking = function ( )
{
	var THIS = this;
	var pageTrackData = this.VarTrivPageTracking.getValue();
	var bDoInit = true;
	
	if( pageTrackData != '~~~null~~~')
	{
		var topLevelSplit = pageTrackData.split('#');
		var arrIds = topLevelSplit[0].split(',');
		var arrStatus = topLevelSplit[1].split('');
		var bits = 4;
		for( var i=0; i<arrIds.length; i++ )
		{
			var id = parseInt( '0x' + arrIds[i] );
			var mask = 1<<(i%bits);
			var status = ( parseInt('0x'+arrStatus[Math.floor(i/bits)] ) & mask ) == 0 ? 1 : 2;
			var node = this.FindNode( this.title, id );
			if( node )
				node.v = status;
		}
	}	
}

PageTrackingObj.prototype.FindNode = function( node, id )
{
	if( node.id == id )
		return node;
	
	var match = null;
	if( typeof( node.c ) != 'undefined' ){
		for( var i=0; i<node.c.length; i++ ){
			match = this.FindNode( node.c[i], id );
			if( match != null )
				break;
		}
	}
	
	return match;
}

PageTrackingObj.prototype.InternalGetRangeStatus = function( node )
{
	if( node == null )
		return -1;
		
	if( typeof(node.c) == 'undefined' )
	{
		return node.v;
	}
	else
	{
		// we need to calculate
		if( node.v == 0 )
		{
			var bAllComplete = true;
			var bInprogress = false;
			for( var i=0; i<node.c.length; i++ )
			{
				var cnode = node.c[i];
				var status = this.InternalGetRangeStatus( cnode );
				if( status == 1 || status == 2 )
					bInprogress = true;
				if( status == 0 || status == 1)
					bAllComplete = false;
			}
			
			if( !node.t && bAllComplete )
				return 2;
			else if( bInprogress )
				return 1;
			else
				return 0;
		}
		else
			return node.v
			
	}
}

//returns a incomplete or inprogress or complete
PageTrackingObj.prototype.GetRangeStatus = function( id )
{
	var status = -1;
	
	status = this.InternalGetRangeStatus( this.FindNode( this.title, id ) );
		
	if( status == 0)
		return 'notstarted';	
	else if( status == 1 )
		return 'inprogress';
		
	return 'complete';
}


PageTrackingObj.prototype.InternalSetRangeStatus=function( node, status )
{
	if( node == null )
		return;
	node.v = status;
	if( status == 0 && typeof(node.c)!='undefined')
	{
		for( var i=0; i<node.c.length; i++ )
			this.InternalSetRangeStatus( node.c[i], status ); 
	}
}

PageTrackingObj.prototype.SetRangeStatus = function( id, status /*0 or 1 or 2*/)
{
	this.InternalSetRangeStatus( this.FindNode(this.title, id), status );
	
	this.SavePageTracking();
}

PageTrackingObj.prototype.IterateTree = function( func )
{
	var stack = [];
	stack.push( this.title );
	var i = 0;
	while( stack.length > 0 )
	{
		var node = stack.shift();
		
		if( typeof(node.c) != 'undefined' )
			stack = node.c.concat(stack);
			
		//do the thing
		func( node, i, stack );
		i++;
	}	
}

PageTrackingObj.prototype.SavePageTracking = function()
{
	var hexVal = 0;
	var hexString = '';
	
	var arrayIds = [];
	var arrayStatus= [];
	
	this.IterateTree( function(node, i, stack){
		if( node.v != 0 )
		{
			arrayIds.push(node.id);
			arrayStatus.push(node.v);
		}
	});
	
	for( var i=0; i<arrayIds.length; i++ )
	{
		if( i!=0 ) hexString += ',';
		hexString += arrayIds[i].toString(16);
	}
	
	hexString += '#';
	
	var bits = 4;
	var num = 0;
	for( var i=0; i<arrayStatus.length; i++ )
	{
		var bit = arrayStatus[i] == 2 ? 1 : 0
		num |= bit << (i%bits);
		if( ((i+1)%bits==0) || ((i+1)==arrayStatus.length) )
		{
			hexString += num.toString(16);
			num = 0;
		}
	}
	
	this.VarTrivPageTracking.set(hexString);
}

var trivPageTracking = new PageTrackingObj(365,'rso_ar');
trivPageTracking.numPages = 0;

trivPageTracking.publishTimeStamp = 2016121121926;

trivPageTracking.title={id:1,v:0,c:[{id:298,v:0,c:[{id:287,v:0,c:[{id:38,v:0},{id:50,v:0},{id:1882,v:0},{id:65,v:0},{id:69,v:0},{id:3020,v:0},{id:5742,v:0},{id:5845,v:0},{id:5857,v:0},{id:5858,v:0}]},{id:2552,v:0,t:1,c:[{id:2566,v:0},{id:2567,v:0},{id:2744,v:0}]},{id:11205,v:0,t:1,c:[{id:14566,v:0},{id:14554,v:0},{id:14546,v:0},{id:14538,v:0},{id:14526,v:0},{id:14514,v:0},{id:14502,v:0},{id:14494,v:0},{id:14482,v:0},{id:14474,v:0}]},{id:585,v:0,c:[{id:5795,v:0,c:[{id:730,v:0},{id:842,v:0},{id:1002,v:0}]},{id:5797,v:0,c:[{id:3040,v:0},{id:3051,v:0},{id:3080,v:0},{id:3104,v:0},{id:3124,v:0}]},{id:5799,v:0,c:[{id:5834,v:0},{id:5824,v:0},{id:5805,v:0},{id:5801,v:0}]},{id:12886,v:0,c:[{id:12887,v:0}]},{id:5927,v:0,c:[{id:12893,v:0},{id:12894,v:0},{id:12895,v:0},{id:12896,v:0},{id:12897,v:0},{id:5941,v:0}]}]},{id:415,v:0,c:[{id:423,v:0}]},{id:2959,v:0,c:[{id:2943,v:0}]},{id:13962,v:0,c:[{id:13963,v:0}]},{id:14180,v:0,c:[{id:11358,v:0}]}]}]};
