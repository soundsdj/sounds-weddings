/* Loads the booking form iframe shortly before it scrolls into view, instead of
   on page load. The form pulls ~1 MB of ProfitFlo code, which was competing with
   the hero image and pushing mobile load times past 10 s.
   Native loading="lazy" was tried on 7 Oct 2026 and the form never loaded.
   Safety net: every form loads 8 s after the page finishes, scrolled or not.
   (Was 3 s: PageSpeed often caught that and counted ~1 MB of form code.) */
(function(){
  var frames = document.querySelectorAll('iframe[data-src]');
  if (!frames.length) return;
  function go(f){ if (!f.getAttribute('src')) f.setAttribute('src', f.getAttribute('data-src')); }
  function all(){ for (var i = 0; i < frames.length; i++) go(frames[i]); }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting) { go(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '1200px 0px' });
    for (var i = 0; i < frames.length; i++) io.observe(frames[i]);
  } else { all(); }
  if (document.readyState === 'complete') setTimeout(all, 8000);
  else window.addEventListener('load', function(){ setTimeout(all, 8000); });
})();
