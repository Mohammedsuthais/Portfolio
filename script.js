(() => {
  'use strict';
  const d = window.PORTFOLIO;
  const $ = id => document.getElementById(id);
  const el = (tag, cls, txt) => { const node = document.createElement(tag); if (cls) node.className = cls; if (txt !== undefined) node.textContent = txt; return node; };
  const appendText = (parent, tag, cls, value) => { const node = el(tag,cls,value); parent.append(node); return node; };
  const externalUrl = input => { try { const u = new URL(input); return ['https:','http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };
  function safeImage(input) { return input && !/^(?:javascript|data):/i.test(input.trim()) ? input : ''; }
  $('availabilityText').textContent = d.eyebrow;
  $('heroRole').textContent = d.role;
  $('heroTagline').textContent = d.tagline;
  $('heroLocation').textContent = d.location;
  $('contactLocation').textContent = d.location;
  $('year').textContent = new Date().getFullYear();
  d.about.forEach(p => appendText($('aboutParagraphs'),'p','',p));
  const education = $('education');
  appendText(education,'span','edu-icon','✦');
  const eduText = el('div'); education.append(eduText);
  appendText(eduText,'strong','',d.education.degree+' ('+d.education.status+')');
  appendText(eduText,'small','',d.education.university);
  if(d.portrait && safeImage(d.portrait)) { $('portrait').src=safeImage(d.portrait); $('portrait').hidden=false; }
  Object.entries(d.skills).forEach(([category,skills],idx) => {
    const card = el('div','skill-card reveal');
    appendText(card,'div','skill-icon',['⌘','◇','✳'][idx%3]);
    appendText(card,'h3','',category);
    const pills = el('div','skill-pills'); card.append(pills);
    skills.forEach(s=>appendText(pills,'span','skill-pill',s)); $('skillsGrid').append(card);
  });
  d.services.forEach(s => {
    const card = el('article','service-card reveal');const top=el('div','service-top');
    appendText(top,'span','',s.number);appendText(top,'span','','↗');card.append(top);
    appendText(card,'h3','',s.title);appendText(card,'p','',s.description);$('servicesGrid').append(card);
  });
  const observer=('IntersectionObserver' in window)?new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.08,rootMargin:'0px 0px 40px 0px'}):null;
  function observeReveals(){document.querySelectorAll('.reveal:not(.visible)').forEach(e=>observer?observer.observe(e):e.classList.add('visible'));}
  let filter = 'All';
  function addProjectLink(parent, title, url) { const clean=externalUrl(url); if(!clean)return; const link=el('a','',title+' ↗');link.href=clean;link.target='_blank';link.rel='noopener noreferrer';parent.append(link); }
  function renderProjects() {
    const root=$('projectsGrid');root.replaceChildren();let count=0;
    d.projects.filter(p=>filter==='All'||p.status===filter).forEach(p=>{
      count++;
      const card=el('article','project-card reveal');
      const art=el('div','project-art');art.style.setProperty('--accent',/^#[\da-fA-F]{3,8}$/.test(p.color)?p.color:'#438dff');
      if(p.image && safeImage(p.image)) {const img=el('img');img.src=safeImage(p.image);img.alt=p.title+' project preview';img.loading='lazy';art.append(img);}
      else appendText(art,'span','project-initials',p.initials||p.title.substring(0,2).toUpperCase());
      appendText(art,'span','status'+(p.status==='Ongoing'?' ongoing':''),p.status);
      card.append(art);
      const body=el('div','project-body');appendText(body,'span','project-category',p.category);appendText(body,'h3','',p.title);appendText(body,'p','',p.description);
      const stack=el('div','project-stack');p.stack.forEach(t=>appendText(stack,'span','',t));body.append(stack);
      const links=el('div','project-links');
      const projectUrl=externalUrl(p.live);
      if(projectUrl){
        const view=el('a','view-project-btn','View Project ↗');view.href=projectUrl;view.target='_blank';view.rel='noopener noreferrer';links.append(view);
      }else{
        const pending=el('span','view-project-btn is-unavailable','View Project ↗');pending.setAttribute('aria-label','View Project — link not added yet');pending.title='Project link will be added soon';links.append(pending);
      }
      addProjectLink(links,'Source code',p.github);
      body.append(links);
      card.append(body);root.append(card);
    });
    $('projectCount').textContent=count+' PROJECT'+(count===1?'':'S');observeReveals();
  }
  $('filters').addEventListener('click',event=>{const btn=event.target.closest('[data-filter]');if(!btn)return;filter=btn.dataset.filter;$('filters').querySelectorAll('[data-filter]').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});renderProjects();});
  renderProjects();
  const email='mailto:'+encodeURIComponent(d.email);
  $('emailAction').href=email;$('emailText').href=email;$('emailText').textContent=d.email;
  $('waAction').href='https://wa.me/'+d.whatsapp.replace(/\D/g,'')+'?text='+encodeURIComponent('Hello Suthais, I found your portfolio and would like to discuss a project.');
  if(d.cv && safeImage(d.cv)) { $('cvAction').href=safeImage(d.cv);$('cvAction').hidden=false;$('cvAction').setAttribute('download',''); }
  [['GitHub',d.github],['LinkedIn',d.linkedin]].forEach(([label,url])=>addProjectLink($('socialLinks'),label,url));
  const optional=$('optionalSections');
  if(d.certifications.length) {const section=el('div','optional-block reveal');appendText(section,'h3','','Certifications');d.certifications.forEach(c=>{const p=appendText(section,'p','',c.title+' — '+c.issuer+(c.year?' ('+c.year+')':''));if(externalUrl(c.link)){const a=el('a','',' Verify ↗');a.href=externalUrl(c.link);a.rel='noopener noreferrer';a.target='_blank';p.append(a);}});optional.append(section);}
  if(d.achievements.length){const section=el('div','optional-block reveal');appendText(section,'h3','','Achievements');d.achievements.forEach(a=>appendText(section,'p','',a));optional.append(section);}
  const menu=$('menuToggle'),links=$('navLinks');
  function closeMenu(){document.body.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}
  menu.addEventListener('click',()=>{const open=!document.body.classList.contains('menu-open');document.body.classList.toggle('menu-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
  links.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  observeReveals();
  const sections=document.querySelectorAll('main section[id]');const navItems=[...links.querySelectorAll('a')];
  let ticking=false;
  function onScroll(){if(ticking)return;ticking=true;requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;$('progress').style.width=(max>0?scrollY/max*100:0)+'%';let current='home';sections.forEach(sec=>{if(sec.getBoundingClientRect().top<160)current=sec.id;});navItems.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+current));ticking=false;});}
  addEventListener('scroll',onScroll,{passive:true});onScroll();
})();
