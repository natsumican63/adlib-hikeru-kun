(function() {
  var notes = ['B','c','c#','d','d#','e','f','f#','g','g#','a','a#','b','C'];
  var keys = ['c','c#','d','d#','e','f','f#','g','g#','a','a#','b','c','c#','d','d#','e','f','f#','g','g#','a','a#','b']; 
  var keybind = ['S','D','R','F','T','G','H','U','J','I','K','O','L','º'];
  var disables = [0,2,3,5,9,10,12];
  var key = keys.indexOf('c'); //default
  var bpm = 120;

  (function() {
    document.getElementById('play').addEventListener('click', bgm);
    $(function(){ 
      $('input[type="radio"]').change(function(){
        $('.key').removeClass("disable"); 
        var checked = $('input[type="radio"]:checked').attr("id");
        key = keys.indexOf(checked);
        $keys=$('.key');
        var ary =[];
        $.each(disables, function(i,disable){
          ary.push(keys[disable+key-1]);
        });

        $.each($keys,function(i,k){
          var str = $(k).attr("data-note").toLowerCase();
          if(ary.indexOf(str) >= 0){
             $(k).addClass("disable"); 
          }
        });
      }); 
    });

    function bgm() {
      var ch1 = [keys[key+10]+'3',keys[key+2]+'4',keys[key+3]+'4',keys[key+7]+'4'];
      var ch2 = [keys[key+8]+'3',keys[key]+'4',keys[key+3]+'4',keys[key+7]+'4'];
      var ch3 = [keys[key+8]+'3',keys[key]+'4',keys[key+2]+'4',keys[key+5]+'4'];
      var ch4 = [keys[key+11]+'3',keys[key+3]+'4',keys[key+7]+'4',keys[key+10]+'4'];
      var chordAry = [ch1,ch1,ch2,ch2,ch3,ch4,ch1,ch1];

      var chord = beeplay({bpm: bpm}).play(null, 1);

      $.each(chordAry,function(i,ch){
        chord
        .play(ch, 1/2, 'p')
        .play(null, 1/2)
        .play(ch, 1/2, 'p')
        .play(null, 1/2)
        .play(null, 1/2)
        .play(ch, 1, 'p')
        .play(ch, 1/2, 'p')
      });

      var baseAry = [
        [keys[key],keys[key+7]],
        [keys[key],keys[key+7]],
        [keys[key+6],keys[key]],
        [keys[key+6],keys[key]],
        [keys[key+3],keys[key+9]],
        [keys[key+8],keys[key+3]],
        [keys[key],keys[key+7]],
        [keys[key],keys[key+7]]    
      ];

      var base = beeplay({bpm: bpm}).play(null, 1);
      var baseOct = '2';
      $.each(baseAry,function(i,b){
        base
        .play(b[0]+baseOct, 1, 'ff')
        .play(null, 1/2)
        .play(b[1]+baseOct, 1/2, 'f')
        .play(b[1]+baseOct, 1, 'f')
        .play(null, 1)
      }); 
    }
  })();

  (function() {
    'use strict';

    var isSP, ctx, xml, data, frequencyRatioTempered, keyboards;
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    ctx = new AudioContext();

    xml = new XMLHttpRequest();
    xml.responseType = 'arraybuffer';
    xml.open('GET', 'assets/piano.wav', true);
    xml.onload = function() {
      ctx.decodeAudioData( 
        xml.response,
        function(_data) {
          data = _data;
        },
        function(e) {
          alert(e.err);
        }
      );
    };
    xml.send();

    isSP = typeof window.ontouchstart !== 'undefined';

    frequencyRatioTempered = 1.059463;//平均律

    keyboards = Array.prototype.slice.call(
      $('.key')
    );
   
    keyboards.reverse().map(function(keyboard, index) {
      var i, frequencyRatio;
      frequencyRatio = 1;
      for (i = 0; i < index; i++) {
        frequencyRatio /= frequencyRatioTempered;
      }
      keyboard.addEventListener(isSP ? 'touchstart' : 'click', function () {
        $(this).addClass('active');
        var bufferSource;
        bufferSource = ctx.createBufferSource();
        bufferSource.buffer = data;
        bufferSource.playbackRate.value = frequencyRatio;
        bufferSource.connect(ctx.destination);
        if(!$(this).hasClass('disable')){
          bufferSource.start(0);
        };
      });
    });

    $(document).keydown(function(e){
      var pressed = String.fromCharCode(e.which);
      if(keybind.indexOf(pressed) !== -1){
        var index = keybind.indexOf(pressed);
        $('.key[data-note="' + notes[index] + '"]').click();
        setTimeout(function(){
          $(".key").removeClass("active").unbind("mouseover");      
        }, 300);
      }
    });
  })();
  
})();

/* beeplay.min.js --------- */
!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a){window.beeplay=function(b){"use strict";var c=a("./modules/main");return c.prototype.isArray=a("./modules/isArray"),c.prototype.nn=a("./modules/nn"),c.prototype.pd=a("./modules/pd"),c.prototype.pn=a("./modules/pn"),c.prototype.play=a("./modules/play"),c.prototype.start=a("./modules/start"),c.prototype.put=a("./modules/put"),c.prototype.toJSON=a("./modules/toJSON"),new c(b)}},{"./modules/isArray":2,"./modules/main":3,"./modules/nn":4,"./modules/pd":5,"./modules/play":6,"./modules/pn":7,"./modules/put":8,"./modules/start":9,"./modules/toJSON":10}],2:[function(a,b){b.exports=function(a){return Array.isArray?Array.isArray(a):"[object Array]"===Object.prototype.toString.call(a)}},{}],3:[function(a,b){b.exports=function(a){a="object"==typeof a?a:{},this.bpm=a.bpm||120,this.sampleRate=a.sampleRate||44100,this.key=a.key||"C",this.time=a.time||"4/4",this.volume=a.volume||1,this.stack=[],this.currentTime=0;try{var b=window.AudioContext||window.webkitAudioContext||window.mozAudioContext||window.oAudioContext||window.msAudioContext;this.context=window.__audioContext__||new b,this.context.sampleRate=this.sampleRate,window.__audioContext__=this.context}catch(c){console.error(c.message)}return this}},{}],4:[function(a,b){b.exports=function(a){var b=["c","c#","d","d#","e","f","f#","g","g#","a","a#","b"],c=-1!==a.indexOf("#")?2:1,d=a.substring(0,c).toLowerCase(),e=Number(a.substring(c))+1;return b.indexOf(d)+12*e}},{}],5:[function(a,b){b.exports=function(a){var b=this.volume/7,c=["pp","p","mp","m","mf","f","ff"];a=a.toLowerCase();var d=(c.indexOf(a)+1)*b;return d}},{}],6:[function(a,b){b.exports=function(a,b,c){return a=this.isArray(a)?a:[a],c=c||"m",this.put(a,b,c),this.start(a,b,c),this}},{}],7:[function(a,b){b.exports=function(a){if(null===a)return-1;var b=this.nn(a),c=this.sampleRate/100,d=b-69,e=Math.abs(d);if(69===b)return c;if(d>0)for(;e--;)c*=Math.pow(2,1/12);else for(;e--;)c/=Math.pow(2,1/12);return c}},{}],8:[function(a,b){b.exports=function(a,b,c){this.stack.push({notes:a,length:b,dynamics:c})}},{}],9:[function(a,b){b.exports=function(a,b,c){var d=this.context,e=this.sampleRate,f=this.bpm,g=this;return a.forEach(function(a){var h=d.createBuffer(1,e,e),i=h.getChannelData(0),j=g.pn(a);if(-1!==j){for(var k=0;60/f*b*e>k;k++)i[k]=Math.sin(2*Math.PI*j*(k/e));var l=d.createGain();l.gain.value=g.pd(c),l.connect(d.destination);var m=d.createBufferSource();m.buffer=h,m.connect(l),m.start(g.currentTime)}}),this.currentTime+=60/f*b,this.time}},{}],10:[function(a,b){b.exports=function(){var a={key:this.key,bpm:this.bpm,frequency:this.frequency,time:this.time,notes:JSON.stringify(this.stack)};return JSON.stringify(a)}},{}]},{},[1,2,3,4,5,6,7,8,9,10]);