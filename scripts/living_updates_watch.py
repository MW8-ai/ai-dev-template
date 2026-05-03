#!/usr/bin/env python3
import argparse, datetime as dt, hashlib, html.parser, json, re, urllib.request, xml.etree.ElementTree as ET
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCES_FILE=ROOT/'docs/06-living-updates/sources/update-sources.yml'
STATE_FILE=ROOT/'docs/06-living-updates/sources/seen-updates.json'
INCOMING_DIR=ROOT/'docs/06-living-updates/incoming'
def now(): return dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
def slug(s): return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')[:80] or 'update'
def clean(s): return re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',s or '').replace('&amp;','&')).strip()
def parse_sources(text):
    sources=[]; cur=None; key=None
    for raw in text.splitlines():
        s=raw.strip()
        if not s or s.startswith('#') or s=='sources:': continue
        if s.startswith('- id:'):
            if cur: sources.append(cur)
            cur={'id':s.split(':',1)[1].strip()}; key=None; continue
        if cur is None: continue
        if re.match(r'^[A-Za-z_]+:',s):
            k,v=s.split(':',1); k=k.strip(); v=v.strip()
            if v.startswith('[') and v.endswith(']'):
                cur[k]=[x.strip().strip('"\'') for x in v[1:-1].split(',') if x.strip()]
            elif v=='': cur[k]=[]; key=k
            else: cur[k]=v.strip('"\''); key=None
        elif s.startswith('- ') and key:
            cur[key].append(s[2:].strip())
    if cur: sources.append(cur)
    return sources
def fetch(url):
    req=urllib.request.Request(url,headers={'User-Agent':'living-updates-watch/1.0'})
    with urllib.request.urlopen(req,timeout=30) as r: return r.read().decode(r.headers.get_content_charset() or 'utf-8','replace')
def parse_feed(body):
    out=[]
    try: root=ET.fromstring(body)
    except ET.ParseError: return out
    for item in root.findall('.//item'):
        out.append({'title':clean(item.findtext('title')),'link':clean(item.findtext('link')),'published':clean(item.findtext('pubDate')),'summary':clean(item.findtext('description'))})
    ns={'a':'http://www.w3.org/2005/Atom'}
    for e in root.findall('.//a:entry',ns):
        le=e.find('a:link',ns); link=le.attrib.get('href','') if le is not None else ''
        out.append({'title':clean(e.findtext('a:title',default='',namespaces=ns)),'link':link,'published':clean(e.findtext('a:updated',default='',namespaces=ns)),'summary':clean(e.findtext('a:summary',default='',namespaces=ns))})
    return [x for x in out if x['title']][:10]
class T(html.parser.HTMLParser):
    def __init__(self): super().__init__(); self.on=False; self.title=''
    def handle_starttag(self,tag,attrs):
        if tag=='title': self.on=True
    def handle_endtag(self,tag):
        if tag=='title': self.on=False
    def handle_data(self,data):
        if self.on: self.title+=data
def parse_page(body,src):
    t=T(); t.feed(body); h=hashlib.sha256(re.sub(r'\s+',' ',body).encode()).hexdigest()[:16]
    return [{'title':'Watched page changed: '+clean(t.title or src['vendor']),'link':src['url'],'published':now(),'summary':'Page snapshot hash: '+h+'. Review source page for meaningful changes.','hash':h}]
def match(item,src):
    kws=src.get('include_keywords',[])
    if not kws: return True
    txt=(item.get('title','')+' '+item.get('summary','')+' '+item.get('link','')).lower()
    return any(str(k).lower() in txt for k in kws)
def note(src,item,iid):
    INCOMING_DIR.mkdir(parents=True,exist_ok=True)
    p=INCOMING_DIR/(dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%d')+'-'+src['id']+'-'+slug(item['title'])+'.md')
    tags=src.get('tags',[]); tags=', '.join(tags) if isinstance(tags,list) else str(tags)
    p.write_text(f"""# Incoming Update: {src.get('vendor')} — {item.get('title')}

## Status
Needs human review.

## Source
- Source ID: `{src.get('id')}`
- Vendor: {src.get('vendor')}
- Category: {src.get('category')}
- Priority: {src.get('priority')}
- URL: {item.get('link') or src.get('url')}
- Source date: {item.get('published') or 'Unknown'}
- Detected: {now()}
- Tracking ID: `{iid}`
- Tags: {tags}

## Auto-Detected Summary
{item.get('summary') or 'No summary provided by source.'}

## Human Review Questions
1. Is this meaningful for our repo, team, AI workflow, CI/CD, or security posture?
2. Does this change any existing guidance?
3. Should this become an impact note?
4. Should related docs be updated?
5. Should this be archived with no action?

## Suggested Disposition
- [ ] Convert to impact note
- [ ] Update existing docs
- [ ] Add to AI guardrails
- [ ] No action / archive
- [ ] Security review
""",encoding='utf-8')
    return p
def main():
    a=argparse.ArgumentParser(); a.add_argument('--max-new',type=int,default=10); args=a.parse_args()
    state=json.loads(STATE_FILE.read_text()) if STATE_FILE.exists() else {'seen':{}}
    created=[]
    for src in parse_sources(SOURCES_FILE.read_text()):
        if len(created)>=args.max_new: break
        seen=state['seen'].setdefault(src['id'],{})
        try: body=fetch(src['url'])
        except Exception as e: print('[WARN]',src['id'],e); continue
        items=parse_feed(body) if src.get('type')=='rss' else parse_page(body,src)
        for item in items:
            if len(created)>=args.max_new: break
            if not match(item,src): continue
            basis=item.get('hash') or item.get('link') or item.get('title')
            iid=hashlib.sha256((src['id']+'|'+item.get('title','')+'|'+basis+'|'+item.get('published','')).encode()).hexdigest()[:16]
            if iid in seen: continue
            p=note(src,item,iid); created.append(str(p.relative_to(ROOT))); seen[iid]={'file':str(p.relative_to(ROOT)),'detected':now(),'title':item.get('title')}
    state['last_run']=now(); STATE_FILE.write_text(json.dumps(state,indent=2,sort_keys=True)+'\n')
    print(json.dumps({'count':len(created),'created':created},indent=2))
if __name__=='__main__': main()
