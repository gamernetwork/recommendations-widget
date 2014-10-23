// Prototype-free version.
// Requires jQuery for the JSONP callback.

var Taboola = function(args) {

	self = {};	
	self.key = args.key;
	self.pubid = args.pubid;
	self.url = args.url;			
	self.target = $(args.target);
	self.count = args.count || 6;
	self.lang = args.lang || { title: "Promoted stories", via: "From" };
	self.thumbnails = args.thumbnails || { width: 190, height: 108 };

	self.endpoint = "//api.taboola.com/1.1/json/" + self.pubid + "/recommendations.get?app.type=mobile&app.apikey=" + self.key +"&rec.count=" + self.count + "&rec.type=mix&user.session=init&source.type=text&source.id=214321562187&source.url=" + encodeURIComponent(self.url) + "&rec.thumbnail.width=" + self.thumbnails.width + "&rec.thumbnail.height=" + self.thumbnails.height + "&rec.callback=?";

	self.run = function(self)
	{
		// Build request
		if(self.url && self.target)
		{
			jQuery.getJSON(
				self.endpoint,
				self.callback
			);
		}
	}
	
	self.callback = function(json)
	{
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
				item = item.replace(/#{branding}/g, data.branding);
				item = item.replace(/#{image}/g, data.thumbnail[0].url);
				item = item.replace(/#{via}/g, self.lang.via);
				
				// Add item to buffer
				buffer += item;
			}
							
			// Insert block into target
			self.target.html(' \
				<p class="title">' + self.lang.title + '</p> \
				<ul>' + buffer + '</ul>'
			);
		}
	}

	self.template = ' \
			<li> \
				<div> \
					<a href="#" onclick="window.location=\'#{url}\';return false;" rel="nofollow" class="cover" style="background-image: url(#{image});"></a> \
					<p> \
						#{via} \
						<a href="#" onclick="window.location=\'#{url}\';return false;" rel="nofollow"> \
							#{branding} \
						</a> \
					</p> \
					<h5> \
						<a href="#" onclick="window.location=\'#{url}\';return false;" rel="nofollow"> \
							#{name} \
						</a> \
					</h5> \
				</div> \
			</li> \
	';
	
	self.run(self);	
};