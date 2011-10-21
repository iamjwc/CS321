    
    var day_names = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri'];
    
    
    function create_schedule()
    {
      var table = document.createElement( 'table' );
      var thead = document.createElement( 'thead' );
      var tbody = document.createElement( 'tbody' )
      var tr    = document.createElement( 'tr' );
      var th    = document.createElement( 'th' );
      var td    = document.createElement( 'td' );
      var colo  = document.createElement( 'col' );
      var cole  = document.createElement( 'col' );
      var colt  = document.createElement( 'col' );
           
      table.id = 'schedule';
      colo.className = 'odd';
      cole.className = 'even';
      colt.className = 'times';
      
      th.innerHTML = '';
      tr.appendChild( th.cloneNode( true ) );
      table.appendChild( colt.cloneNode(true) );
      for( var i = 0, n = day_names.length; i < n; ++i )
      {
        table.appendChild( ((i%2)==1) ? colo.cloneNode(true) : cole.cloneNode(true) );
        th.innerHTML = day_names[i];
        tr.appendChild( th.cloneNode( true ) );
      }      
      thead.appendChild( tr.cloneNode( true ) );
      table.appendChild( thead );
      
      var ampm = 'am';
      var minus = 0;
      for( var i = 8; i < 22; ++i )
      {
        if( i == 12 )
          ampm = 'pm';
        if( i == 13 )
          minus = 12;
        
        tr.innerHTML = '';
        th.innerHTML = (i - minus) + ampm;
        th.className = 'hour'
        tr.appendChild( th.cloneNode( true ) );
        for( var j = 0, n = day_names.length; j < n; ++j )
        {
          td.innerHTML = '';
          td.id = day_names[j] + '_' + (i-minus) + ampm;
          tr.appendChild( td.cloneNode( true ) );
        }
        tbody.appendChild( tr.cloneNode( true ) );
      }
      
      table.appendChild( tbody );
      
      return( table );
    }
  
  
    function addEvent(obj, evType, fn)
    { 
      if (obj.addEventListener)
      { 
        obj.addEventListener(evType, fn, false);
        return true; 
      }
      else if(obj.attachEvent) 
        return obj.attachEvent("on"+evType, fn);
        
      return false; 
    }

    function show_schedule()
    {
      Element.hide('build_study_plan');
      Element.show('build_schedule');
      
      $('schedule_tab').className   = 'current';
      $('study_plan_tab').className = '';
    }
    
    function show_study_plan()
    {
      Element.hide('build_schedule');
      Element.show('build_study_plan');
      
      $('schedule_tab').className   = '';
      $('study_plan_tab').className = 'current';
    }
    
    function highlight_schedule()
    {
      $('schedule_container').className = 'schedule_highlight';
    }
    
    function unhighlight_schedule()
    {
      $('schedule_container').className = '';
    }
    
    
    var timer = null;
    function show_class_added_notification( name, days, time )
    {
      var notification = $('class_added_notification');
      var strong = document.createElement('strong');
      var em     = document.createElement('em');
      strong.innerHTML = name;
      em.innerHTML     = days + ' @ ' + time;


      notification.innerHTML = '';
      notification.appendChild( document.createTextNode('You have successfully added ') );
      notification.appendChild( strong );
      notification.appendChild( document.createTextNode(' to your schedule on ') );
      notification.appendChild( em );
      notification.appendChild( document.createTextNode('.') );
      
      new Effect.Appear( notification );
      
      window.clearInterval( timer );
      timer = window.setInterval( hide_class_added_notification, 5000 );
    }
    
    function hide_class_added_notification()
    {
      new Effect.Fade( $('class_added_notification') );
    }
        
    function find_position(obj)
    {
      var curleft = curtop = 0;
      if( obj.offsetParent )
      {
        curleft = obj.offsetLeft;
        curtop = obj.offsetTop;
        while( obj = obj.offsetParent )
        {
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
        }
      }
      return [curleft,curtop];
    }
    
    function get_days_from_abbr( abbr )
    {
      var days = [];
      for( var i = 0, n = abbr.length; i < n; ++i )
      {
        switch( abbr[i] )
        {
          case 'M':
            days.push( day_names[0] );
            break;
          case 'T':
            days.push( day_names[1] );
            break;
          case 'W':
            days.push( day_names[2] );
            break;
          case 'R':
            days.push( day_names[3] );
            break;
          case 'F':
            days.push( day_names[4] );
            break;
        }
      }
      return( days );
    }
    //CS321_TR_11am_30_5
    function add_class_to_schedule( e )
    {
      var class_info = e.id.split('_');
      
      var days = get_days_from_abbr( class_info[1] );
    
      var schedule = $( 'schedule' );
      
      var class_box = document.createElement( 'div' );
      class_box.innerHTML = class_info[0];
      
      class_box.style.width  = cell_size[0] + 'px';
      class_box.style.height = Math.ceil( cell_size[1] * ( parseInt(class_info[4]) / 4 ) ) + 'px';
      class_box.style.position = 'absolute';
      
      class_box.style.fontSize = '10px';
      class_box.style.border = '1px solid #393';
      class_box.style.borderWidth = '1px 0';
      class_box.style.backgroundColor = '#9c9';
      
      var scpos = find_position( $('schedule_container') );
      
      days.each( function( d )
      {
        var pos = find_position( $( d + '_' + class_info[2] ) );
        if( class_info[3] == '30' )
          pos[1] += cell_size[1] * .5;
       
        
        class_box.style.left = pos[0] + 'px';
        class_box.style.top  = pos[1]-1 + 'px';
      
        $('schedule_container').appendChild( class_box.cloneNode( true ) );
      });
      
      var class_time = 
        class_info[2].substring(0, class_info[2].length-2) + 
        ':' + class_info[3] + 
        class_info[2].substring(class_info[2].length-2, class_info[2].length);
        
      
      Element.hide( e );
      show_class_added_notification( class_info[0], class_info[1], class_time );
    }
    
    function get_cell_size()
    {
      var top_left    = find_position( $('Mon_8am') );
      var bottom_left = find_position( $('Mon_9am') );
      var top_right   = find_position( $('Tues_8am') );
      
      var cell_height = bottom_left[1] - top_left[1];
      var cell_width  = top_right[0] - top_left[0];
      
      return( [ cell_width-1, cell_height-1 ] );
    }
    
    var cell_size;
    function init()
    {
      show_schedule();
      
      $('schedule_container').appendChild( create_schedule() );
      
      $('class_added_notification').style.display = 'none';
      
      Droppables.add('schedule', 
        {
          onDrop: add_class_to_schedule,
          accept: 'sections',
          hoverclass: 'schedule_active'
        }
      );
      Droppables.add('study_plan',
        {
          onDrop: function(){alert('nice aim');},
          accept: 'classes'
        }
      );
      
      cell_size = get_cell_size();
    }
      
    var schedule_drag_and_drop_properties   = { revert: true, onStart: highlight_schedule, onEnd: unhighlight_schedule }; 
    var study_plan_drag_and_drop_properties = { revert: true };      
    
    window.addEvent( window, 'load', init );

