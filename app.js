var cheerio = require('cheerio');
var request = require('request');
var u = require('util');

var $;

function processUrl(url, cb){
		request( {
			url: url
		},
			function (error, response, body) {
          if ( !error ) {
            if (response.statusCode == 200){
              cb( body, url );
            }
            else {
              // handle non 200 HTTP code
            }
          }
          else {
            // other error - connection timeout, etc?
          }
			} //function
		);//request
}

function processPage(content, url){
	$ = cheerio.load( content );

	if ( $( 'a' ).length ) {
		// yay, we got  links. JK, do something useful here, e.g.
	}

  db.count(function( count ){ // fictional database object for interacting with our crawling queue 
    if ( count){
      process.nextTick(function(){
        dequeue(); // process next page
	    });
	  }
    else {
      // process.exit(0); // most likely
    };
  });

}

function dequeue(){ 
  db.pop( function(found){ // pop the next url
    if (process.argv[2] != 'once') { // 
      process.nextTick(function(){ // it is better to use async.parallelLimit - just get the async module and stop pretending you can write good code ;-)
        dequeue();
      });
    }
    processUrl(found, processPage);
  });// pop
} // dequeue

db.connected(dequeue);

//=======================================================================
//// OOOOORRRRR, use something like this:

var urls = ["http://google.com", "http://bing.com"];
var tasks = [].map.call( urls, function _mapUrls(url) {
  return function _mapSingleUrl( next ) {
    processUrl(url, function _processPage(content){
      $ = cheerio.load( content );
      // do something useful with $
      
      next(); // call next() so that async knows that you are done, and it can run another function
    });
    
  }// function
});// map call
    
    async.parallelLimit(tasks, 3);