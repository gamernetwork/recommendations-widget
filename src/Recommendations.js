// Prototype-free version.
// Requires jQuery for the JSONP callback.

var Recommendations = function(args) {

	self = {};	
	self.key = args.key;
	self.pubid = args.pubid;
	self.url = args.url;
	self.id = args.id;
	self.target = args.target;
	self.count = args.count || 6;
	self.lang = args.lang || { title: "From the Web <a href='http://www.taboola.com/popup' style='float: right'>Sponsored links by Taboola</a>", via: "From" };
	self.thumbnails = args.thumbnails || { width: 300, height: 300 };
	self.type = args.type || "desktop";
	self.session = "init";
	self.notified = false;
	self.response = false;
	
	self.generateID = function()
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

	self.id = self.generateID();

	self.run = function(self)
	{
		if(!self.key)
		{
			console.log("[Recommendations] Failed: No API key specified");
		}
		
		if(!self.target)
		{
			console.log("[Recommendations] Failed: No target specified");
		}
		
		if(!self.id)
		{
			console.log("[Recommendations] Failed: No unique page ID specified");
		}
		
		if(!self.url)
		{
			console.log("[Recommendations] Failed: Missing URL");
		}
		
		if(!self.pubid)
		{
			console.log("[Recommendations] Failed: No publisher ID specified");
		}
		
		// Build request
		if(self.url && self.target && self.id && self.pubid)
		{			
			jQuery.getJSON(
				"//api.taboola.com/1.1/json/" + self.pubid + "/recommendations.get?app.type=" + self.type + "&app.apikey=" + self.key +"&rec.count=" + self.count + "&rec.type=mix&rec.visible=false&user.id=" + self.id + "&user.session=" + self.session + "&user.referrer=" +  encodeURIComponent(document.referrer) + "&user.agent=" + encodeURIComponent(navigator.userAgent) + "&source.type=text&source.placement=article&source.id=" + self.id + "&source.url=" + encodeURIComponent(self.url) + "&rec.thumbnail.width=" + self.thumbnails.width + "&rec.thumbnail.height=" + self.thumbnails.height + "&rec.callback=?",
				self.callback
			);
		}
	}
	
	self.viewportCheck = function()
	{
		if(self.withinViewport(self.target) && self.notified == false)
		{
			// Make a "visibility notification" after item is in the
			// viewport for 2 seconds			
			self.timer = setTimeout(self.runCallback, 2000);
			self.notified = true;
		}		
	}

	self.runCallback = function()
	{		
		jQuery.getJSON(
			"//api.taboola.com/1.1/json/" + self.pubid + "/recommendations.notify-visible?app.type=" + self.type + "&app.apikey=" + self.key + "&response.id=" + self.response + "&response.session=" + self.session + "&rec.callback=?",
			self.visibleCallback
		);
	}
	
	self.callback = function(json)
	{
		self.session = json.session;
		self.response = json.id;
		
		if(json.list.length > 0)
		{
			// DOM insertion buffer
			var buffer = "";
			
			for(i = 0; i < json.list.length; i++)
			{
				// Data for this entry
				var data = json.list[i];
				
				// Template transform
				var item = self.template;
				item = item.replace(/#{url}/g, data.url);
				item = item.replace(/#{name}/g, data.name);
				item = item.replace(/#{branding}/g, data.branding > "" ? data.branding : window.location.hostname);
				item = item.replace(/#{image}/g, data.thumbnail[0].url);
				item = item.replace(/#{via}/g, self.lang.via);
				
				// Add item to buffer
				buffer += item;
			}
							
			// Insert block into target
			self.target.innerHTML = ' \
				<p class="title">' + self.lang.title + '</p> \
				<ul>' + buffer + '</ul> \
			';
			
			window.addEventListener("scroll", self.viewportCheck);
			self.viewportCheck();
			
		}
	}
	
	self.visibleCallback = function() {}

	self.template = ' \
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

	self.withinViewport = function(el)
	{
		var rect = el.getBoundingClientRect();
		
		return (
		    rect.top >= 0 &&
		    rect.left >= 0 &&
		    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}
	
	self.run(self);	
};
