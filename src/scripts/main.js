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

  $(function(){
    var scroll = new CCA.Scroll();
    scroll.init();
  });

})(jQuery);