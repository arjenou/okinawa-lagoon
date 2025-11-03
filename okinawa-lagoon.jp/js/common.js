
// Language switching functionality - Initialize on page load
$(function () {
  // Set default language to Japanese and activate it immediately
  var savedLang = $.cookie('lang');
  if (!savedLang) {
    savedLang = 'JP';
    $.cookie('lang', 'JP', { path: '/' });
  }
  
  // Show the selected language immediately
  showLanguage(savedLang);
  
  // Responsive image handling
  var wid = $(window).width();
  if (wid < 550) {
    $(".imgChange").each(function () {
      $(this).attr(
        "src",
        $(this)
          .attr("src")
          .replace("_pc", "_sp")
      );
    });
  }
});

// Function to show the selected language and hide others
function showLanguage(lang) {
  // Hide all languages
  $('.JP, .jp, .EN, .en, .KS, .ks, .CN, .cn').hide();
  
  // Show selected language (works with both uppercase and lowercase)
  var langUpper = lang.toUpperCase();
  var langLower = lang.toLowerCase();
  
  $('.' + langUpper + ', .' + langLower).show();
}

jQuery(window).on('load', function() {
  jQuery('#loader-bg').hide();
  
  // Video autoplay handling for WeChat and mobile browsers
  var video = document.getElementById('heroVideo');
  var playButton = document.getElementById('videoPlayButton');
  
  if (video && playButton) {
    // Try to play the video
    var playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise.then(function() {
        // Autoplay started successfully
        playButton.style.display = 'none';
      }).catch(function(error) {
        // Autoplay was prevented, show play button
        console.log('Autoplay prevented:', error);
        playButton.style.display = 'flex';
      });
    } else {
      // Browser doesn't support Promise, show button as fallback
      playButton.style.display = 'flex';
    }
    
    // Play button click handler
    playButton.addEventListener('click', function() {
      video.play();
      playButton.style.display = 'none';
    });
    
    // Hide button when video starts playing
    video.addEventListener('playing', function() {
      playButton.style.display = 'none';
    });
    
    // WeChat specific: try to play on any user interaction
    var wechatAutoPlay = function() {
      video.play();
      document.removeEventListener('touchstart', wechatAutoPlay);
      document.removeEventListener('WeixinJSBridgeReady', wechatAutoPlay);
    };
    
    // Detect WeChat browser
    var isWeChat = /MicroMessenger/i.test(navigator.userAgent);
    if (isWeChat) {
      document.addEventListener('WeixinJSBridgeReady', wechatAutoPlay, false);
      document.addEventListener('touchstart', wechatAutoPlay, false);
    }
  }
});

	$(document).ready(function(){
    $("#topBtn").hide();
    $(window).on("scroll", function() {
        if ($(this).scrollTop() > 300) {
            $("#topBtn").fadeIn("fast");
        } else {
            $("#topBtn").fadeOut("fast");
        }
        scrollHeight = $(document).height(); //ドキュメントの高さ 
        scrollPosition = $(window).height() + $(window).scrollTop(); //現在地 
        footHeight = $("footer").innerHeight(); //footerの高さ（＝止めたい位置）
        if ( scrollHeight - scrollPosition  <= footHeight ) { //ドキュメントの高さと現在地の差がfooterの高さ以下になったら
            $("#topBtn").css({
                "position":"absolute", //pisitionをabsolute（親：wrapperからの絶対値）に変更
                "bottom": footHeight + 20 //下からfooterの高さ + 20px上げた位置に配置
            });
        } else { //それ以外の場合は
            $("#topBtn").css({
                "position":"fixed", //固定表示
                "bottom": "20px" //下から20px上げた位置に
            });
        }
    });
    $('#topBtn').click(function () {
        $('body,html').animate({
        scrollTop: 0
        }, 400);
        return false;
    });
});

