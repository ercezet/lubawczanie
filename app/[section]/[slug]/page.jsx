import {cache} from 'react';
import {notFound} from 'next/navigation';
import {createClient} from '@supabase/supabase-js';
import {labels,languages} from '../../../lib/content';
import seed from '../../../lib/seed.json';

export const dynamic='force-dynamic';
const sections=['aktualnosci','o-nas','misja','projekty','dolacz','wesprzyj','kontakt'];
const kinds={projekty:'project',aktualnosci:'news'};
const flags={pl:'PL',cs:'CZ',de:'DE',en:'EN'};
const langOf=q=>languages.includes(q.lang)?q.lang:'pl';
const href=(path,lang)=>path+(lang==='pl'?'':'?lang='+lang);
const tr=(x,l)=>x.translations[l]?.title?x.translations[l]:x.translations.pl;
const getEntry=cache(async (section,slug)=>{
  if(!Object.hasOwn(kinds,section))return null;
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key)return seed.find(x=>x.id===slug&&x.kind===kinds[section]&&x.published)||null;
  const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const {data,error}=await db.from('entries').select('*').eq('id',slug).eq('kind',kinds[section]).eq('published',true).maybeSingle();
  if(error)throw new Error('Unable to load article');
  return data;
});
export async function generateMetadata({params,searchParams}){
  const {section,slug}=await params,l=langOf(await searchParams);
  const x=await getEntry(section,slug);
  if(!x)return {title:'Stowarzyszenie Lubawczanie',robots:{index:false}};
  const {title,body}=tr(x,l);
  return {title:title+' | Stowarzyszenie Lubawczanie',description:body.slice(0,160),openGraph:{title,description:body.slice(0,160),type:'article',...(x.image?.startsWith('https://')?{images:[x.image]}:{})}};
}
export default async function EntryPage({params,searchParams}){
  const {section,slug}=await params,l=langOf(await searchParams),t=labels[l];
  const x=await getEntry(section,slug);
  if(!x)notFound();
  const {title,body}=tr(x,l),path='/'+section+'/'+encodeURIComponent(slug),category=t[x.kind==='project'?3:0];
  const status=t[x.status==='done'?12:x.status==='active'?13:14];
  const date=x.date?new Intl.DateTimeFormat(l==='cs'?'cs-CZ':l,{dateStyle:'long',timeZone:'UTC'}).format(new Date(x.date+'T00:00:00Z')):'';
  const money=x.funding!=null?new Intl.NumberFormat(l==='cs'?'cs-CZ':l,{style:'currency',currency:'PLN',maximumFractionDigits:0}).format(x.funding):null;
  const home={pl:'Strona główna',cs:'Úvod',de:'Startseite',en:'Home'}[l];
  return <div lang={l}><a className="skip" href="#main">{t[32]}</a><header><div className="flag"/><div className="nav wrap"><a className="brand" href={href('/',l)}><img src="/images/logo-icon.webp" alt=""/><span>LUBAWCZANIE<small>STOWARZYSZENIE</small></span></a><nav className="article-nav" aria-label={t[26]}>{sections.map((s,i)=><a key={s} href={href('/',l)+'#'+s}>{t[i]}</a>)}</nav><div className="langs article-langs">{languages.map(v=><a key={v} lang={v} aria-current={l===v?'page':undefined} href={href(path,v)}>{flags[v]}</a>)}</div></div></header>
  <main id="main" className="wrap article-page"><div className="breadcrumbs"><a href={href('/',l)}>{home}</a><span aria-hidden="true"> / </span><a href={href('/',l)+'#'+section}>{category}</a></div><article className="article-content"><div className="eyebrow blue">{category}</div><h1>{title}</h1><div className="article-meta"><span className={'tag '+x.status}>{status}</span>{date&&<time dateTime={x.date}>{date}</time>}</div>{x.image&&<img className="article-photo" src={x.image} alt=""/>}<div className="article-text">{body.split(/\n+/).filter(Boolean).map((p,i)=><p key={i}>{p}</p>)}</div>{money&&<div className="article-funding"><small>{t[27]}</small><strong>{money}</strong></div>}<a className="btn" href={href('/',l)+'#'+section}>← {t[22]} · {category}</a></article></main><footer><div className="wrap"><strong>STOWARZYSZENIE LUBAWCZANIE</strong><span>© {new Date().getFullYear()} · <a href="/admin">CMS</a></span></div></footer></div>;
}
