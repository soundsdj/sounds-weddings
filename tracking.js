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
     book_consultation_click  any click through to /appointment
     phone_click              any click-to-call
   Import these into Google Ads as conversion actions:
     Goals > Conversions > + Create conversion action > Import > Google Analytics 4
*/

window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
gtag('js', new Date());

var SDJ_LINKER = { 'domains': ['weddings.soundsdjevents.com', 'soundsdjevents.com'] };
gtag('config', 'G-7EG50CWDVF', { 'linker': SDJ_LINKER });
gtag('config', 'AW-972541419', { 'linker': SDJ_LINKER });

/* Microsoft Clarity */
(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "yd28luey3g");

/* Meta Pixel — same id as soundsdjevents.com, so the landing pages and the
   booking flow feed one pixel. Actual bookings are tracked by the pixel on
   the GHL thank-you page; the click below is intent only, so it uses a custom
   event rather than a standard "Lead" that would inflate Meta's numbers. */
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','860582841130253');
fbq('track','PageView');

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

  if (href.indexOf('/appointment') !== -1) {
    gtag('event', 'book_consultation_click', {
      'page_name': page,
      'link_text': label,
      'link_url': href
    });
    if (window.fbq) fbq('trackCustom', 'BookConsultationClick', { page_name: page });
  } else if (href.indexOf('tel:') === 0) {
    gtag('event', 'phone_click', {
      'page_name': page,
      'link_text': label,
      'phone_number': href.replace('tel:', '')
    });
    if (window.fbq) fbq('trackCustom', 'PhoneClick', { page_name: page });
  }
}, true);
