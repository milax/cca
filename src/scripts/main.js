'use strict';

var CCA = {} || CCA;

(function($){
  
  CCA.Scroll = function() {

    var $go_links = $('.go-top');

    var attachEvents = function() {
      $go_links.click(go);
    };

    var go = function() {
      var $self = $(this);

      var $parent_site_section,
        $parent_site,
        $next_box;

      if($self.hasClass('go-top')) {
        scrollToBox(0);
      }
      else if($self.hasClass('go-next')) {
        $parent_site_section = $self.closest('.site--section');
        $parent_site         = $parent_site_section.closest('.site');
        $next_box            = $parent_site_section.next('.site--section');

        $next_box = $next_box.length ? $next_box : $parent_site.next('.site');

        if($next_box.length) {
          scrollToBox($next_box);
        }
        else {
          scrollToPageBottom();
        }
      }

      function scrollToPageBottom() {
        $('html, body').animate({
          scrollTop: $('body').prop('scrollHeight')
        }, 500);
      }

      function scrollToBox($box) {
        $('html, body').animate({
          scrollTop: $box ? $box.offset().top : 0
        }, 500);
      }

      return false;
    };

    var init = function() {
      attachEvents();
    };

    return {
      init: init
    };

  };

  CCA.RenderPage = function() {

    var getSiteInfo = function(site) {
      var s = {};

      s.url       = site.slug;
      s.title     = site.fragments['article.title'].value[0].text;

      if(site.fragments['article.cuff']) {
        s.cuff = site.fragments['article.cuff'].value[0].text;
      }

      if(site.fragments['article.illustration']) {
        s.image = {
          url: site.fragments['article.illustration'].value.main.url
        };
      }

      if(site.fragments['article.content']) {
        s.content = site.fragments['article.content'].value;
      }

      return s;
    };

    var init = function() {

      var hash = window.location.hash.substring(1);

      Helpers.withPrismic(function(ctx) {

        ctx.api.form('everything').ref(ctx.ref).submit(function(err, sites) {
          
          var received_sites = sites.results;
          var sites_to_render = [];
          var i, len;

          if (err) {
            Configuration.onPrismicError(err);
            return;
          }

          if(hash) {
            for(i = 0, len = received_sites.length; i < len; ++i) {
              if(received_sites[i].slug === hash) {
                sites_to_render.push(getSiteInfo(received_sites[i]));
                break;
              }
            }
          }

          if(!hash || !sites_to_render.length) {
            for(i = 0, len = received_sites.length; i < len; ++i) {
              sites_to_render.push(getSiteInfo(received_sites[i]));
            }
          }


          // Feed the template
          $('#sites').render({
              sites: sites_to_render,
              hash: hash
            },
            function() {
              $('[data-forcereload=true]').click(function(){
                window.location = $(this).attr('href');
                window.location.reload();
              });
            }
          );

        });

      });
    };

    return {
      init: init
    };

  };

  $(function(){
    var scroll = new CCA.Scroll();
    scroll.init();

    var render = new CCA.RenderPage();
    render.init();

  });

})(jQuery);