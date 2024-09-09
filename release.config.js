module.exports =  {
	"plugins": [
	  // additional config...
	  "@semantic-release/release-notes-generator",
	  ["@semantic-release/github", {
		 "assets": [
			  { "path": "dist/VtubeScript.js", "label": "VtubeScript.js"}
		 ]
	  }],
	]
 }
