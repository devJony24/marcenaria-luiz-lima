import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "UPLOAD-NETLIFY-DROP");
const assets = await readdir(path.join(root, "dist", "client", "assets"));
const cssFile = assets.find((name) => name.endsWith(".css"));

if (!cssFile) throw new Error("CSS compilado não encontrado.");

let html = await (await fetch("http://localhost:3000/")).text();
const css = await readFile(path.join(root, "dist", "client", "assets", cssFile), "utf8");

html = html
  .replace(/<link[^>]+rel="stylesheet"[^>]*>/g, "")
  .replace(/<link[^>]+rel="modulepreload"[^>]*>/g, "")
  .replace(/<link[^>]+href="\/_vinext\/image[^>]*>/g, "")
  .replace(/<script[\s\S]*?<\/script>/g, "")
  .replace(/\s(?:srcSet|imagesrcset)="[^"]*\/_vinext\/image[^"]*"/gi, "")
  .replace(/src="\/_vinext\/image\?url=([^&"]+)[^"]*"/g, (_, encoded) =>
    `src="${decodeURIComponent(encoded)}"`,
  );

const behavior = `<script>(()=>{const h=document.querySelector('.site-header'),b=document.querySelector('.menu-button'),m=document.querySelector('.main-nav'),u=()=>h?.classList.toggle('scrolled',scrollY>24);u();addEventListener('scroll',u,{passive:true});b?.addEventListener('click',()=>{const o=m?.classList.toggle('open')??false;b.setAttribute('aria-expanded',String(o));b.setAttribute('aria-label',o?'Fechar menu':'Abrir menu')});m?.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{m.classList.remove('open');b?.setAttribute('aria-expanded','false');b?.setAttribute('aria-label','Abrir menu')}));const r=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('is-visible')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(x=>r.observe(x));const closeLb=()=>{const lb=document.querySelector('.video-lightbox');if(!lb)return;lb.querySelector('video')?.pause();lb.remove();document.body.style.overflow=''};document.querySelectorAll('.video-thumbnail').forEach(t=>t.addEventListener('click',()=>{closeLb();const lb=document.createElement('div');lb.className='video-lightbox';lb.role='dialog';lb.setAttribute('aria-modal','true');const title=t.dataset.videoTitle||'Vídeo';lb.setAttribute('aria-label',title);lb.innerHTML='<div class="video-lightbox-inner"><button class="video-lightbox-close" type="button" aria-label="Fechar vídeo">×</button><video controls autoplay playsinline></video></div>';const v=lb.querySelector('video');v.poster=t.dataset.videoPoster;v.src=t.dataset.videoSrc;v.setAttribute('aria-label',title+' — vídeo da Luiz Lima Marcenaria');lb.addEventListener('click',closeLb);lb.querySelector('.video-lightbox-inner').addEventListener('click',e=>e.stopPropagation());lb.querySelector('.video-lightbox-close').addEventListener('click',closeLb);document.body.append(lb);document.body.style.overflow='hidden';v.play().catch(()=>{})}));addEventListener('keydown',e=>{if(e.key==='Escape')closeLb()})})();</script>`;

html = html
  .replace("</head>", `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700&display=swap"><style>${css}</style></head>`)
  .replace("</body>", `${behavior}</body>`);

await mkdir(output, { recursive: true });
await mkdir(path.join(output, "projects"), { recursive: true });
await mkdir(path.join(output, "media"), { recursive: true });
await cp(path.join(root, "public", "projects"), path.join(output, "projects"), { recursive: true, force: true });
await cp(path.join(root, "public", "media"), path.join(output, "media"), { recursive: true, force: true });
for (const file of ["favicon.svg", "luiz-lima-logo.svg", "og-marcenaria.png"]) {
  await cp(path.join(root, "public", file), path.join(output, file), { force: true });
}
await writeFile(path.join(output, "index.html"), html, "utf8");
await writeFile(path.join(output, "_redirects"), "/* /index.html 200\n", "utf8");
await writeFile(path.join(output, "_headers"), "/*\n  X-Frame-Options: DENY\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n", "utf8");

console.log(`Prévia estática gerada em ${output}`);
