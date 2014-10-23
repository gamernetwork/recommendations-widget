Taboola widget
==============

A custom implementation of Taboola's recommendation widget that circumvents Adblock.

Usage
-----

1. Include jQuery, Taboola.js and Taboola.css in your page:
```
<!-- Required scripts and styles -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.6/jquery-ui.min.js"></script>

<script src="../src/Taboola.js"></script>
<link rel="stylesheet" type="text/css" href="../src/Taboola.css" media="screen" />
<!-- End of required scripts and styles --> 
```

2. Define a container div, and invoke the Taboola class:
```
<!-- Invocation code -->
<div id="taboola"></div>
<script>
	new Taboola({
		key: "1234567890",
		pubid: "mysite",
		target: "#taboola",
		url: "http://www.eurogamer.net/articles/hello-world",
		count: 9,
		thumbnails: { width: 214, height: 110 },
		lang: 
	});
</script>
<!-- End of invocation code -->
```

Parameters
----------

There are several arguments you can pass to the widget to control how it behaves:

- key: Your personal Taboola API key. Don't have one? Ask your Taboola account manager for one. (Required)
- pubid: Your publisher ID. Supplied by Taboola. (Required)
- target: a CSS selector for the container element. (Required)
- url: the fully qualified URL of the page the widget is embedded on. (Required)
- count: how many items to return. Defaults to 6.
- thumbnails: what width/height the thumbnail images should be. Defaults to 190x108.
- lang: a set of localisation strings if you are deploying this across multiple languages.

