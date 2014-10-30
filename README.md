Recommendations widget
======================

A custom implementation of Taboola's recommendation widget that circumvents Adblock.

Quickstart
----------

See https://rawgit.com/gamernetwork/recommendations-widget/master/demo/index.html for a demonstration of the widget in action, or follow the steps below.

**1: Include jQuery, Recommendations.js and Recommendations.css in your page:**
```
<!-- Required scripts and styles -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js"></script>
<script src="https://cdn.rawgit.com/gamernetwork/recommendations-widget/master/src/Recommendations.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/gamernetwork/recommendations-widget/master/src/Recommendations.css" media="screen" />
<!-- End of required scripts and styles --> 
```

**2: Define a container div, and invoke the Taboola class:**
```
<!-- Invocation code -->
<div id="recommendations"></div>
<script>
	new Recommendations({
		key: "1234567890",
		pubid: "mysite",
		target: document.getElementById("recommendations"),
		url: "http://www.eurogamer.net/articles/hello-world",
		id: "1021030103",
		count: 9,
		thumbnails: { width: 214, height: 110 },
		lang: 
	});
</script>
<!-- End of invocation code -->
```

**3: Customise Recommendations.css and define your own style**

There is a base stylesheet for the recommendations widget with a couple of basic responsive breakpoints defined, but I encourage you to customise it to suit your own needs.

Additional arguments
--------------------

There are several arguments you can pass to the widget to control how it behaves. Some are required.

- **key**: Your personal Taboola API key. Don't have one? Ask your Taboola account manager for one. (*Required*)
- **pubid**: Your publisher ID. Supplied by Taboola. (*Required*)
- **target**: The DOM element that recommendations will appear in. (*Required*)
- **url**: the fully qualified URL of the page the widget is embedded on. (*Required*)
- **id**: a unique identifier for the page you are using the widget on. (*Required*)
- **count**: how many items to return. Defaults to 6.
- **thumbnails**: object that specifies the width/height the thumbnail images should be. Defaults to 190x108.
- **lang**: a set of localisation strings if you are deploying this across multiple languages.

