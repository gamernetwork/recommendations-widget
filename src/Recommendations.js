// Prototype-free version.
// Requires jQuery for the JSONP callback.

var Recommendations = function(args) {

	var context = this;
	
	context.key = args.key;
	context.pubid = args.pubid;
	context.url = args.url;
	context.id = args.id;
	context.target = args.target;
	context.count = args.count || 6;
	context.lang = args.lang || { title: "From the Web <a href='http://www.taboola.com/popup' style='float: right'>Sponsored links by Taboola</a>", via: "From" };
	context.thumbnails = args.thumbnails || { width: 300, height: 300 };
	context.type = args.type || "desktop";
	context.page = args.page || "text";
	context.notified = false;
	context.response = false;
	context.timeout = 0;

	context.getSessionID = function()
	{
		if(localStorage.getItem("recommendations-session-id"))
		{
			return localStorage.getItem("recommendations-session-id");
		}
		else
		{
			return "init";
		}
	}
	
	context.generateUserID = function()
	{
		if(localStorage.getItem("recommendations-id"))
		{
			return localStorage.getItem("recommendations-id");
		}
		else
		{
			id = Math.random().toString(36).substring(2);
			localStorage.setItem("recommendations-id", id);
			
			return id;
		}
	}

	context.session = context.getSessionID();
	context.uid = context.generateUserID();

	context.run = function()
	{
		if(!context.key)
		{
			console.log("[Recommendations] Failed: No API key specified");
		}
		
		if(!context.target)
		{
			console.log("[Recommendations] Failed: No target specified");
		}
		
		if(!context.id)
		{
			console.log("[Recommendations] Failed: No unique page ID specified");
		}
		
		if(!context.url)
		{
			console.log("[Recommendations] Failed: Missing URL");
		}
		
		if(!context.pubid)
		{
			console.log("[Recommendations] Failed: No publisher ID specified");
		}
		
		// Build request
		if(context.url && context.target && context.id && context.pubid)
		{			
			jQuery.getJSON(
				"//api.taboola.com/1.1/json/" + context.pubid + "/recommendations.get?app.type=" + context.type + "&app.apikey=" + context.key +"&rec.count=" + context.count + "&rec.type=mix&rec.visible=false&user.id=" + context.uid + "&user.session=" + context.session + "&user.referrer=" +  encodeURIComponent(document.referrer) + "&user.agent=" + encodeURIComponent(navigator.userAgent) + "&source.type=" + context.page + "&source.placement=article&source.id=" + context.id + "&source.url=" + encodeURIComponent(context.url) + "&rec.thumbnail.width=" + context.thumbnails.width + "&rec.thumbnail.height=" + context.thumbnails.height + "&rec.callback=?",
				context.callback
			);
		}
	}
	
	context.viewportCheck = function()
	{
		if(context.withinViewport(context.target))
		{
			// Make a "visibility notification"
			window.clearTimeout(context.timeout);
			context.runCallback();
			context.notified = true;
		}
		else
		{
			context.timeout = window.setTimeout(context.viewportCheck, 500);
		}
	}

	context.runCallback = function()
	{		
		jQuery.getJSON(
			"//api.taboola.com/1.1/json/" + context.pubid + "/recommendations.notify-visible?app.type=" + context.type + "&app.apikey=" + context.key + "&response.id=" + context.response + "&response.session=" + context.session + "&rec.callback=?",
			context.visibleCallback
		);
	}
	
	context.callback = function(json)
	{
		// Store session id
		localStorage.setItem("recommendations-session-id", json.session);
		
		context.session = json.session;
		context.response = json.id;
		
		if(json.list.length > 0)
		{
			// DOM insertion buffer
			var buffer = "";
			
			for(i = 0; i < json.list.length; i++)
			{
				// Data for this entry
				var data = json.list[i];
				
				// Template transform
				var item = context.template;
				item = item.replace(/#{url}/g, data.url);
				item = item.replace(/#{name}/g, data.name);
				item = item.replace(/#{branding}/g, data.branding > "" ? data.branding : window.location.hostname);
				item = item.replace(/#{image}/g, data.thumbnail[0].url);
				item = item.replace(/#{via}/g, context.lang.via);
				
				// Add item to buffer
				buffer += item;
			}
							
			// Insert block into target
			context.target.innerHTML = ' \
				<p class="title">' + context.lang.title + '</p> \
				<ul>' + buffer + '</ul> \
			';
			
			context.viewportCheck();
		}
	}
	
	context.visibleCallback = function() {}

	context.template = ' \
			<li> \
				<div> \
					<a href="#" onclick="window.open(\'#{url}\', \'_blank\');" rel="nofollow" class="cover" style="background-image: url(#{image});"></a> \
					<h5> \
						<a href="#" onclick="window.open(\'#{url}\', \'_blank\');" rel="nofollow"> \
							#{name} \
						</a> \
					</h5> \
					<p> \
						#{via} \
						<a href="#" onclick="window.open(\'#{url}\', \'_blank\');" rel="nofollow"> \
							#{branding} \
						</a> \
					</p> \
				</div> \
			</li> \
	';

	context.withinViewport = function(el)
	{
		var r, html;
		if ( !el || 1 !== el.nodeType ) { return false; }
		html = document.documentElement;
		r = el.getBoundingClientRect();
		
		return ( !!r 
		  && r.bottom >= 0 
		  && r.right >= 0 
		  && r.top <= html.clientHeight 
		  && r.left <= html.clientWidth 
		);
	}
	
	context.run();	
};
