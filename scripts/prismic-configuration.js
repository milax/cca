
'use strict';

var Configuration = {

  // -- API endpoint
  apiEndpoint: 'https://cca15.prismic.io/api',

  // -- Links resolution rules
  linkResolver: function(ctx, doc) {
    return 'site.html?name=' + doc.slug;
  },

  // -- To customize: what to do when an error happens on the prismic.io side
  onPrismicError: function(err, xhr) {
    if(xhr && xhr.status === 401) {
      window.location = '/signin.html';
    } else {
      window.location = '/error.html'+(err ? '#'+err.message : '');
    }
  }

};