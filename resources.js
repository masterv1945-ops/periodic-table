(() => {
  const statusEl = () => document.getElementById('public-resource-status');
  const listEl = () => document.getElementById('public-resource-list');
  const escapeHTML = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const humanSize = n => { if (!n) return ''; const u=['B','KB','MB','GB']; let i=0,x=Number(n); while(x>=1024&&i<u.length-1){x/=1024;i++;} return `${x.toFixed(i?1:0)} ${u[i]}`; };
  async function loadPublicResources() {
    const status=statusEl(), root=listEl(); if(!status||!root) return;
    try {
      const db=window.createScience9SupabaseClient();
      status.textContent='در حال دریافت منابع منتشرشده...'; root.innerHTML='';
      const {data:folders,error:fErr}=await db.from('resource_folders').select('id,name,description,is_published,created_at').eq('is_published',true).order('created_at',{ascending:false});
      if(fErr) throw fErr;
      if(!folders?.length){status.textContent='هنوز منبعی منتشر نشده است.';return;}
      const {data:files,error:rErr}=await db.from('resources').select('id,folder_id,title,description,file_name,storage_path,mime_type,size_bytes,created_at,is_published').eq('is_published',true).order('created_at',{ascending:false});
      if(rErr) throw rErr;
      const byFolder=new Map(); for(const f of (files||[])){ if(!byFolder.has(f.folder_id))byFolder.set(f.folder_id,[]); byFolder.get(f.folder_id).push(f); }
      let count=0;
      root.innerHTML=folders.map(folder=>{
        const items=byFolder.get(folder.id)||[];
        const cards=items.map(item=>{
          const {data:{publicUrl}}=db.storage.from(window.SUPABASE_BUCKET).getPublicUrl(item.storage_path);
          const mime=item.mime_type||''; const isPdf=mime==='application/pdf'||/\.pdf$/i.test(item.file_name||'');
          const isImage=mime.startsWith('image/'); const icon=isPdf?'📄':isImage?'🖼️':'📎'; count++;
          const preview=isImage?`<a class="resource-public-preview" href="${escapeHTML(publicUrl)}" target="_blank" rel="noopener"><img loading="lazy" src="${escapeHTML(publicUrl)}" alt="${escapeHTML(item.title)}"></a>`:'';
          return `<article class="resource-card ${isPdf?'pdf-card':''}">${preview}<div class="resource-title">${icon} ${escapeHTML(item.title||item.file_name)}</div>${item.description?`<p class="resource-sub">${escapeHTML(item.description)}</p>`:''}<p class="resource-sub">${escapeHTML(item.file_name||'')} ${item.size_bytes?` · ${humanSize(item.size_bytes)}`:''}</p><div class="resource-actions"><a href="${escapeHTML(publicUrl)}" target="_blank" rel="noopener">${isPdf?'مشاهده PDF':'باز کردن فایل'}</a></div></article>`;
        }).join('');
        return `<section class="resource-folder"><header class="resource-folder-head"><h3>${escapeHTML(folder.name)}</h3>${folder.description?`<p>${escapeHTML(folder.description)}</p>`:''}</header><div class="resource-grid">${cards||'<p class="sm">هنوز فایلی در این پوشه منتشر نشده است.</p>'}</div></section>`;
      }).join('');
      status.textContent=count?`${count} فایل منتشرشده در ${folders.length} پوشه`:'پوشه‌ای وجود دارد، اما هنوز فایلی منتشر نشده است.';
    } catch(err) {
      console.error('Public resources error:',err);
      status.textContent='دریافت منابع انجام نشد. اتصال Supabase و مجوزهای خواندن را بررسی کنید.';
    }
  }
  window.loadScience9Resources=loadPublicResources;
  document.addEventListener('DOMContentLoaded',loadPublicResources);
  document.addEventListener('click',e=>{const tab=e.target.closest('[data-t="rs"]');if(tab)setTimeout(loadPublicResources,0);});
})();
