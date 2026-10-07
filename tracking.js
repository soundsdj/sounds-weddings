/* Shared analytics + conversion tracking for weddings.soundsdjevents.com
   Loaded by every page. Single source of truth — edit here, not per page.

   GA4        G-7EG50CWDVF   (same property as soundsdjevents.com)
   Google Ads AW-972541419
   Clarity    yd28luey3g
   Meta Pixel 860582841130253

   The booking form lives on soundsdjevents.com, a different domain, so the
   linker below carries the session across. Both domains use the same GA4 id,
   which is what makes that work.

   Events sent:
     check_date_click         any click on a Check Your Date / See the Prices CTA
     phone_click              any click-to-call
     generate_lead            the /thanks page loading, i.e. a real form submission
   The /thanks page also fires the Google Ads conversion "Wedding Inquiry
   (landing form)" directly with its own event snippet — no GA4 import needed.
*/

window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
gtag('js', new Date());

var SDJ_LINKER = { 'domains': ['weddings.soundsdjevents.com', 'soundsdjevents.com'] };
gtag('config', 'G-7EG50CWDVF', { 'linker': SDJ_LINKER });
gtag('config', 'AW-972541419', { 'linker': SDJ_LINKER });

/* Clarity and the Meta pixel load a moment after the page appears (or on the
   visitor's first scroll, tap, click or key), so their ~250 KB doesn't compete
   with the hero photo on a phone. Their queues exist from the start, so any
   event fired earlier is held and sent once they load. The thanks page loads
   them straight away so no conversion is ever missed. Changed 7 Oct 2026. */
function sdjLoadLater(fn){
  if (/^\/thanks\/?$/.test(location.pathname)) { fn(); return; }
  var done = false, evs = ['scroll','pointerdown','keydown','touchstart'];
  function go(){ if (done) return; done = true;
    evs.forEach(function(e){ removeEventListener(e, go, true); }); fn(); }
  evs.forEach(function(e){ addEventListener(e, go, { capture: true, passive: true, once: true }); });
  if (document.readyState === 'complete') setTimeout(go, 2500);
  else addEventListener('load', function(){ setTimeout(go, 2500); });
}
function sdjAddScript(src){
  var t = document.createElement('script'); t.async = true; t.src = src;
  var y = document.getElementsByTagName('script')[0]; y.parentNode.insertBefore(t, y);
}

/* Microsoft Clarity */
window.clarity = window.clarity || function(){ (window.clarity.q = window.clarity.q || []).push(arguments); };
sdjLoadLater(function(){ sdjAddScript('https://www.clarity.ms/tag/yd28luey3g'); });

/* Meta Pixel — same id as soundsdjevents.com, so the landing pages and the
   booking flow feed one pixel. Actual bookings are tracked by the pixel on
   the GHL thank-you page; the click below is intent only, so it uses a custom
   event rather than a standard "Lead" that would inflate Meta's numbers. */
!function(f){if(f.fbq)return;var n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];}(window);
fbq('init','860582841130253');
fbq('track','PageView');
sdjLoadLater(function(){ sdjAddScript('https://connect.facebook.net/en_US/fbevents.js'); });

/* Which city page is this? /wedding-dj-burlington -> "burlington". */
function sdjPageName(){
  var p = location.pathname.replace(/\/$/, '');
  var m = p.match(/wedding-dj-([a-z-]+)$/);
  if (m) return m[1];
  if (p === '' || p === '/index.html') return 'home';
  return p.replace(/^\//, '').replace(/\.html$/, '') || 'home';
}

/* One delegated listener covers every CTA on the page, including any added
   later. Clicks are not blocked — GA4 sends these via the Beacon API, which
   survives the page unloading. */
document.addEventListener('click', function(e){
  var a = e.target.closest && e.target.closest('a[href]');
  if (!a) return;

  var href = a.getAttribute('href') || '';
  /* innerText, not textContent — these buttons hold two responsive labels
     ("Book Free Consultation" / "Book Now") and only one is ever visible. */
  var label = ((a.innerText || a.textContent || '').trim().replace(/\s+/g, ' ')).slice(0, 80);
  var page = sdjPageName();

  if (href === '#check' || href === '#pricing' || href.indexOf('/appointment') !== -1) {
    gtag('event', 'check_date_click', {
      'page_name': page,
      'link_text': label,
      'link_url': href
    });
    if (window.fbq) fbq('trackCustom', 'CheckDateClick', { page_name: page });
  } else if (href.indexOf('tel:') === 0) {
    gtag('event', 'phone_click', {
      'page_name': page,
      'link_text': label,
      'phone_number': href.replace('tel:', '')
    });
    if (window.fbq) fbq('trackCustom', 'PhoneClick', { page_name: page });
  }
}, true);

/* The form now lives on the page and redirects to /thanks on success, so the
   thank-you page loading IS the conversion. Fired once, on view. */
if (/^\/thanks\/?$/.test(location.pathname)) {
  gtag('event', 'generate_lead', { 'page_name': 'thanks', 'currency': 'CAD', 'value': 2900 });
  /* Google Ads "Wedding Inquiry (landing form)", id 7790333453, primary.
     Value ($300 CAD) is fixed on the action itself. */
  gtag('event', 'conversion', { 'send_to': 'AW-972541419/cYBcCI2c3IIdEOub388D' });
  if (window.fbq) fbq('track', 'Lead');
}
