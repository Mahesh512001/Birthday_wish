(function () {
  'use strict';
  var NAME = 'Anjali Bhande';
  var COLORS = ['#ff5d8f', '#ffd27a', '#7cf0c9', '#8ab4ff', '#ffffff', '#ff9a5d'];

  /* ---------- Your photos: images/image1 ... images/image23 ---------- */
  var IMAGE_COUNT = 23;          // how many pictures you have
  var FOLDER = 'images/';        // folder name
  var PREFIX = 'image';          // file name start: image1, image2 ...
  var EXTS = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG']; // tried in order, so mixed types work

  // Sets img.src to image<n> and tries each extension until one loads
  function setPhoto(img, n, onFail) {
    var t = 0;
    img.onerror = function () {
      t++;
      if (t < EXTS.length) img.src = FOLDER + PREFIX + n + '.' + EXTS[t];
      else { img.onerror = null; if (onFail) onFail(img); }
    };
    img.src = FOLDER + PREFIX + n + '.' + EXTS[0];
  }
  function shuffled() {
    var a = [], i, j, t;
    for (i = 1; i <= IMAGE_COUNT; i++) a.push(i);
    for (i = a.length - 1; i > 0; i--) { j = (Math.random() * (i + 1)) | 0; t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  /* ---------- Confetti ---------- */
  var cv = document.getElementById('confetti');
  var cx = cv.getContext('2d');
  var bits = [];
  var running = false;

  function resize() {
    cv.width = innerWidth * devicePixelRatio;
    cv.height = innerHeight * devicePixelRatio;
  }
  resize();
  addEventListener('resize', resize);

  function burst(x, y, n) {
    var d = devicePixelRatio;
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, s = 4 + Math.random() * 9;
      bits.push({
        x: x * d, y: y * d,
        vx: Math.cos(a) * s * d, vy: (Math.sin(a) * s - 6) * d,
        w: (6 + Math.random() * 6) * d, h: (4 + Math.random() * 5) * d,
        r: Math.random() * 6, vr: (Math.random() - .5) * .4,
        c: COLORS[(Math.random() * COLORS.length) | 0], life: 1
      });
    }
    if (!running) { running = true; requestAnimationFrame(tick); }
  }

  function tick() {
    cx.clearRect(0, 0, cv.width, cv.height);
    bits = bits.filter(function (p) { return p.life > 0 && p.y < cv.height + 40; });
    bits.forEach(function (p) {
      p.vy += .25 * devicePixelRatio; p.vx *= .99;
      p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life -= .004;
      cx.save();
      cx.globalAlpha = Math.max(p.life, 0);
      cx.translate(p.x, p.y); cx.rotate(p.r);
      cx.fillStyle = p.c; cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      cx.restore();
    });
    if (bits.length) requestAnimationFrame(tick); else running = false;
  }

  function party(n) {
    burst(innerWidth * .2, innerHeight * .6, n);
    burst(innerWidth * .8, innerHeight * .6, n);
    burst(innerWidth * .5, innerHeight * .4, n);
  }

  /* ---------- Faint drifting background photos ---------- */
  // Lower BG_OPACITY = harder to see.
  var BG_COUNT = innerWidth < 700 ? 10 : 18;
  var BG_OPACITY = 0.12;

  (function bgPhotos() {
    var box = document.getElementById('bgphotos');
    var bgOrder = shuffled();
    for (var i = 0; i < BG_COUNT; i++) {
      var img = document.createElement('img');
      img.className = 'bgp';
      setPhoto(img, bgOrder[i % IMAGE_COUNT], function (x) { x.remove(); });
      img.alt = '';
      var size = 90 + Math.random() * 130;
      img.style.width = size + 'px';
      img.style.height = size * 1.25 + 'px';
      img.style.left = Math.random() * 92 + '%';
      img.style.top = Math.random() * 92 + '%';
      img.style.setProperty('--op', (BG_OPACITY * (0.6 + Math.random() * 0.8)).toFixed(3));
      img.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
      img.style.setProperty('--dy', (Math.random() * 200 - 100) + 'px');
      img.style.setProperty('--r0', (Math.random() * 20 - 10) + 'deg');
      img.style.setProperty('--r1', (Math.random() * 20 - 10) + 'deg');
      img.style.setProperty('--dur', (28 + Math.random() * 30) + 's');
      img.style.animationDelay = (-Math.random() * 30) + 's';
      box.appendChild(img);
    }
  })();

  /* ---------- Floating balloons ---------- */
  var balloonOrder = shuffled();
  var balloonCount = 0;
  var sky = document.getElementById('sky');
  var skyTimer;
  function spawn() {
    var el = document.createElement('div');
    el.className = 'float';
    var heart = Math.random() < .35;
    if (heart) {
      el.textContent = '\u2764';
      el.style.fontSize = (18 + Math.random() * 22) + 'px';
      el.style.color = COLORS[(Math.random() * 2) | 0];
    } else {
      // Each balloon holds an <img> showing the next photo in a shuffled loop
      var n = balloonOrder[balloonCount++ % IMAGE_COUNT];
      el.innerHTML = '<div class="balloon" style="background:' + COLORS[(Math.random() * COLORS.length) | 0] + '"><img alt=""></div>';
      setPhoto(el.querySelector('img'), n, function (x) { x.remove(); });
    }
    el.style.left = Math.random() * 96 + 'vw';
    el.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px');
    el.style.setProperty('--r', (Math.random() * 30 - 15) + 'deg');
    el.style.animationDuration = (9 + Math.random() * 8) + 's';
    sky.appendChild(el);
    setTimeout(function () { el.remove(); }, 18000);
  }
  function startSky() {
    for (var i = 0; i < 8; i++) setTimeout(spawn, i * 250);
    skyTimer = setInterval(spawn, 1100);
  }

  /* ---------- Opening gift ---------- */
  var gift = document.getElementById('giftBtn');
  var gate = document.getElementById('gate');
  var main = document.getElementById('main');

  gift.addEventListener('click', function () {
    gift.classList.add('open');
    var r = gift.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + 30, 120);
    setTimeout(function () {
      gate.classList.add('leave');
      setTimeout(function () {
        gate.style.display = 'none';
        main.hidden = false;
        scrollTo(0, 0);
        party(70);
        startSky();
        typeName();
      }, 700);
    }, 600);
  });

  /* ---------- Typewriter ---------- */
  function typeName() {
    var out = document.getElementById('typed'), i = 0;
    (function next() {
      out.textContent = NAME.slice(0, ++i);
      if (i < NAME.length) setTimeout(next, 130);
      else setTimeout(function () { party(40); }, 300);
    })();
  }

  /* ---------- Slider ---------- */
  var track = document.getElementById('track');
  var CAPTIONS = ['Where the best memories begin', 'Laughter that never gets old', 'A smile that lights up every room',
    'Friendship worth celebrating', 'Moments I will always cherish', 'Grace in every moment', 'Together, always', 'Here is to many more'];
  for (var n = 1; n <= IMAGE_COUNT; n++) {
    var fig = document.createElement('figure');
    var im = document.createElement('img');
    im.alt = 'Anjali photo ' + n;
    im.decoding = 'async';
    if (n > 3) im.loading = 'lazy';
    setPhoto(im, n, function (x) { x.style.display = 'none'; });
    var cap = document.createElement('figcaption');
    cap.textContent = CAPTIONS[(n - 1) % CAPTIONS.length];
    fig.appendChild(im); fig.appendChild(cap);
    track.appendChild(fig);
  }
  var slides = track.children.length;
  var dotsBox = document.getElementById('dots');
  var idx = 0, auto;


  function go(n) {
    idx = (n + slides) % slides;
    track.style.transform = 'translateX(-' + idx * 100 + '%)';
    dotsBox.textContent = (idx + 1) + ' / ' + slides;
  }
  function restart() { clearInterval(auto); auto = setInterval(function () { go(idx + 1); }, 3500); }

  document.getElementById('next').onclick = function () { go(idx + 1); restart(); };
  document.getElementById('prev').onclick = function () { go(idx - 1); restart(); };

  var sx = 0;
  var sl = document.getElementById('slider');
  sl.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  sl.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) { go(idx + (dx < 0 ? 1 : -1)); restart(); }
  });

  go(0); restart();

  /* ---------- Cake ---------- */
  var candles = document.querySelectorAll('.candle');
  var finalMsg = document.getElementById('final');
  var again = document.getElementById('again');

  Array.prototype.forEach.call(candles, function (c) {
    c.addEventListener('click', function () {
      c.classList.add('out');
      if (document.querySelectorAll('.candle.out').length === candles.length) {
        finalMsg.hidden = false; again.hidden = false;
        party(110);
        setTimeout(function () { party(80); }, 700);
        document.dispatchEvent(new Event('allCandlesOut'));
      }
    });
  });
  again.addEventListener('click', function () {
    Array.prototype.forEach.call(candles, function (c) { c.classList.remove('out'); });
    finalMsg.hidden = true; again.hidden = true;
    document.dispatchEvent(new Event('candlesRelit'));
    party(120);
  });

  /* ---------- Wish picker: notifies YOU when she chooses ---------- */
  // WHATSAPP: your number with country code, no + or spaces. Example India: '919876543210'
  // Her tap on "Send my wish" opens WhatsApp to you with the full message ready.
  // OPTIONAL fully automatic: get a free key from callmebot.com (WhatsApp section) and fill both callmebotKey and whatsapp.
  // OPTIONAL email copy: formspree.io form URL.
  var NOTIFY = { whatsapp: '917839072326', callmebotKey: '', formspree: '' };

  var WISHES = [
    ['\uD83C\uDF70', 'Cake & coffee date'], ['\uD83C\uDF7D\uFE0F', 'Dinner treat'],
    ['\uD83C\uDFAC', 'Movie night'], ['\uD83D\uDECD\uFE0F', 'Shopping'],
    ['\uD83C\uDF04', 'A little trip'], ['\uD83C\uDF81', 'Surprise gift'],
    ['\uD83D\uDCF8', 'Photoshoot'], ['\uD83C\uDFB6', 'Music night']
  ];
  var picked = {};
  var chBox = document.getElementById('choices');
  var status = document.getElementById('wishStatus');
  var sendBtn = document.getElementById('sendWish');
  var noteBox = document.getElementById('note');

  WISHES.forEach(function (w) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'choice';
    b.innerHTML = '<b>' + w[0] + '</b>' + w[1];
    b.addEventListener('click', function () {
      b.classList.toggle('on');
      if (b.classList.contains('on')) picked[w[1]] = 1; else delete picked[w[1]];
      status.textContent = '';
    });
    chBox.appendChild(b);
  });

  // Instant on-screen reply shown to her right after she sends (edit the lines to sound like you)
  var REPLIES = {
    'Cake & coffee date': 'Cake and coffee is happening. Your favourite cafe, my treat.',
    'Dinner treat': 'Dinner is on me. Pick the place and I will book the table.',
    'Movie night': 'Movie night it is. You choose the film, I bring the popcorn.',
    'Shopping': 'Shopping day is a yes. Get ready for a fun, long walk.',
    'A little trip': 'A little trip sounds perfect. Let us plan it together soon.',
    'Surprise gift': 'A surprise gift is coming your way. No peeking!',
    'Photoshoot': 'Photoshoot approved. We are going to make some beautiful memories.',
    'Music night': 'Music night is on. Your playlist, your rules.'
  };
  var REPLY_SIGN = 'Your friend';

  var replyRun = 0;
  function showReply() {
    var chat = document.getElementById('chat');
    var list = Object.keys(picked);
    var note = noteBox.value.trim();
    var run = ++replyRun;
    var emoji = {};
    WISHES.forEach(function (w) { emoji[w[1]] = w[0]; });

    // one reply per choice, in the order she picked
    var msgs = ['Wish received, Anjali! \uD83D\uDC96'];
    list.forEach(function (x) { msgs.push((emoji[x] || '') + ' ' + (REPLIES[x] || 'Done!')); });
    if (note) msgs.push('\u270D\uFE0F I read your note, and I will make that happen too.');
    msgs.push('Consider it all done. Happy Birthday! \uD83C\uDF89');

    chat.hidden = false;
    chat.innerHTML = '<div class="bubble who">' + REPLY_SIGN + '</div>';

    (function next(i) {
      if (run !== replyRun || i >= msgs.length) return;
      var typing = document.createElement('div');
      typing.className = 'bubble typing';
      typing.innerHTML = '<i></i><i></i><i></i>';
      chat.appendChild(typing);
      typing.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(function () {
        if (run !== replyRun) return;
        typing.remove();
        var b = document.createElement('div');
        b.className = 'bubble'; b.textContent = msgs[i];
        chat.appendChild(b);
        b.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (i === msgs.length - 1) party(80);
        next(i + 1);
      }, 1000);
    })(0);
  }

  function thanks() {
    status.textContent = 'Your wish is on its way, Anjali!';
    sendBtn.textContent = 'Wish sent';
    party(120); setTimeout(function () { party(80); }, 600);
    showReply();
  }

  sendBtn.addEventListener('click', function () {
    var list = Object.keys(picked);
    var note = document.getElementById('note').value.trim();
    if (!list.length && !note) { status.textContent = 'Pick at least one thing first.'; return; }

    var lines = ['\uD83C\uDF82 *Birthday Wish Received* \uD83C\uDF82', '', '*From:* Anjali Bhande', '', '*Her wishes:*'];
    if (list.length) list.forEach(function (x, i) { lines.push((i + 1) + '. ' + x); });
    else lines.push('(none selected)');
    if (note) { lines.push('', '*Personal note:*', note); }
    lines.push('', '_Sent from your birthday surprise_ \uD83C\uDF81');
    var msg = lines.join('\n');

    // optional email copy (silent)
    if (NOTIFY.formspree) {
      fetch(NOTIFY.formspree, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ subject: 'Anjali picked her birthday wish!', message: msg }) }).catch(function () {});
    }

    if (!NOTIFY.whatsapp) {
      status.textContent = 'Not set up yet: add your WhatsApp number in script.js (NOTIFY.whatsapp).';
      console.warn('Message was:\n' + msg);
      return;
    }

    function openWA() {
      var url = 'https://wa.me/' + NOTIFY.whatsapp + '?text=' + encodeURIComponent(msg);
      var w = window.open(url, '_blank');
      if (!w) window.location.href = url;
      thanks();
    }

    if (NOTIFY.callmebotKey) {
      // fully automatic: delivered to your WhatsApp without her pressing send
      sendBtn.disabled = true; status.textContent = 'Sending...';
      var u = 'https://api.callmebot.com/whatsapp.php?phone=' + NOTIFY.whatsapp +
        '&text=' + encodeURIComponent(msg) + '&apikey=' + NOTIFY.callmebotKey;
      fetch(u, { mode: 'no-cors' }).then(function () { sendBtn.disabled = false; thanks(); })
        .catch(function () { sendBtn.disabled = false; openWA(); });
    } else {
      openWA();
    }
  });

  // wishes stay locked until every candle is blown out
  var wishScene = document.getElementById('wishScene');
  var lockMsg = document.getElementById('lockMsg');
  function setLock(on) {
    wishScene.classList.toggle('locked', on);
    Array.prototype.forEach.call(chBox.children, function (b) { b.disabled = on; });
    noteBox.disabled = on; sendBtn.disabled = on;
    lockMsg.textContent = on ? 'Blow out all the candles first to unlock your wishes.' : 'Your wishes are unlocked. Choose what you love!';
  }
  setLock(true);

  document.addEventListener('allCandlesOut', function () {
    setLock(false);
    wishScene.classList.add('unlocking');
    setTimeout(function () { wishScene.classList.remove('unlocking'); }, 800);
    setTimeout(function () { wishScene.scrollIntoView({ behavior: 'smooth' }); }, 3200);
  });
  document.addEventListener('candlesRelit', function () { setLock(true); replyRun++; document.getElementById('chat').hidden = true; sendBtn.textContent = 'Send my wish'; });
})();