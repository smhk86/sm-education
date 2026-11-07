const CACHE='sm-school-ai-v2.4.0-shell-r1';const ASSETS=['./','./index.html','./styles.css','./app.js','./lessons-extra.js','./config.js','./lexicon.js','./translate.js','./ai-course-i18n.js','./ai-course.js','./ai-course-sync.js','./download-center.js','./family-planner.js','./home-school.js','./offline-tutor.js','./groq-direct.js','./shell-fixes.js','./ux-v1-19.js','./v2-pro.js','./dzexams-library.js','./platform-enhancements.js','./grade-switcher.js','./home-v2.js','./ux-v2-1-8.js','./ux-v2-1-9.js','./ux-v2-2-1.js','./ux-v2-2-2.js','./ux-v2-3-0.js','./ux-v2-4-0.js','./learning-diagnostics.js','./student-profile.js','./learning-memory.js','./family-dashboard.js','./parent-account.js','./smart-teacher.js','./study-center.js','./curriculum-progress.js','./labs-v1-16.js','./exam-timer-v1-17.js','./weekly-planner-v1-18.js','./lesson-planner-v1-18-2.js','./data/curriculum-verification-template-2026-2027.csv','./data/official-source-register-2026-2027.json','./data/secondary-pathways-2026-2027.json','./data/coverage-report-2026-2027.json','./data/curriculum-integrity-audit-2026-2027.json','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/favicon.png','./vendor/pdfjs/pdf.min.js','./vendor/pdfjs/pdf.worker.min.js'];const HEAVY=['./data/curriculum-2026-2027.json','./data/exercise-bank-2026-2027.json','./data/term-exams-2026-2027.json','./data/integrative-assessments-2026-2027.json'];
// Install core resources independently: one optional/missing asset must not abort the shell.
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 const core=ASSETS.filter(path=>['./','./index.html','./styles.css','./app.js','./manifest.webmanifest'].includes(path));
 const optional=ASSETS.filter(path=>!core.includes(path));
 const results=await Promise.allSettled(core.map(async path=>{const response=await fetch(path,{cache:'reload'});if(!response.ok)throw new Error('Precache failed: '+path);await cache.put(path,response)}));
 if(results.some(result=>result.status==='rejected'))throw new Error('A required app-shell resource could not be cached');
 await Promise.allSettled(optional.concat(HEAVY).map(async path=>{const response=await fetch(path);if(response.ok)await cache.put(path,response)}));
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(key=>key.startsWith('sm-school-ai-')&&key!==CACHE).map(key=>caches.delete(key)));
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const request=event.request;if(request.method!=='GET')return;
 const url=new URL(request.url);if(url.origin!==self.location.origin)return;
 if(url.hostname==='api.github.com'||/\/exams\//.test(url.pathname))return;
 const path=url.pathname;
 const isNavigation=request.mode==='navigate';
 const isShell=isNavigation||/\.(?:html|js|css)$/.test(path);
 if(path.endsWith('/ai-course-updates.json')){
  event.respondWith((async()=>{try{const response=await fetch(request,{cache:'no-store'});if(response.ok){const cache=await caches.open(CACHE);await cache.put(request,response.clone())}return response}catch(error){return (await caches.match(request))||Response.error()}})());return;
 }
 if(isShell){
  event.respondWith((async()=>{try{const response=await fetch(request,{cache:'no-store'});if(response.ok){const cache=await caches.open(CACHE);await cache.put(request,response.clone())}return response}catch(error){return (await caches.match(request))||(isNavigation?await caches.match('./index.html'):Response.error())}})());return;
 }
 event.respondWith((async()=>{const cached=await caches.match(request);if(cached)return cached;try{const response=await fetch(request);if(response.ok){const cache=await caches.open(CACHE);await cache.put(request,response.clone())}return response}catch(error){return Response.error()}})());
});
