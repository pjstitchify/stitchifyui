import { useState, useCallback, useRef, useEffect } from "react";

const T={bg:"#FFFFFF",surface:"#FFFFFF",surfaceCool:"#F5F5F7",surfaceSubtle:"#F1F0FA",surfaceEditorial:"#1A1A2E",primary:"#4E35E8",primaryHover:"#3D27D4",primaryLight:"#7B6BF0",accent:"#A3E635",accentBg:"#F7FEE7",accentText:"#4D7C0F",text:"#1A1A2E",textSec:"#6B7280",textPh:"#757575",border:"#E8E5F0",hairline:"#F0F0F0",success:"#15803D",warning:"#B45309",error:"#B91C1C",r:16,rs:10,rp:999,font:"'Hind','Noto Sans JP',-apple-system,sans-serif",shadow:"0 1px 3px rgba(0,0,0,0.04),0 4px 12px rgba(0,0,0,0.04)",shadowH:"0 2px 6px rgba(0,0,0,0.04),0 8px 24px rgba(78,53,232,0.08)",e:"cubic-bezier(0.25,0.1,0.25,1)",eo:"cubic-bezier(0.05,0.7,0.1,1)"};

const STATUSES={draft:{label:"Draft",bg:"#ECECEF",color:"#57606A"},creating:{label:"Creating Spec",bg:"#EAE6FB",color:"#4E35E8"},waiting:{label:"Waiting for Quote",bg:"#FEF0C7",color:"#B45309"},ordered:{label:"Ordered",bg:"#DDEAFE",color:"#2563EB"},manufacturing:{label:"Manufacturing",bg:"#E6F9C9",color:"#4D7C0F"},inspection:{label:"Inspection",bg:"#FFE8CC",color:"#C2410C"},shipping:{label:"Shipping",bg:"#D2F4F7",color:"#0E7490"},completed:{label:"Completed",bg:"#D7F7E0",color:"#15803D"},cancelled:{label:"Cancelled",bg:"#FCE0E0",color:"#B91C1C"}};

const PROJECTS=[
  {id:1,name:"春夏コレクション Tシャツ",nameEn:"SS Collection T-shirt",type:"T-shirt",qty:100,roughCost:"¥280,000",status:"manufacturing",factory:"TOKYO STITCH Co.",img:"IMG_0",updated:"2026-05-12"},
  {id:2,name:"ロゴ刺繍 スウェット",nameEn:"Logo embroidery sweat",type:"Sweatshirt",qty:50,roughCost:"¥195,000",status:"waiting",factory:"–",img:"IMG_1",updated:"2026-05-10"},
  {id:3,name:"ワイドシルエット パンツ",nameEn:"Wide silhouette pants",type:"Pants",qty:30,roughCost:"¥142,000",status:"creating",factory:"–",img:"IMG_4",updated:"2026-05-09"},
  {id:4,name:"ニットベスト サンプル",nameEn:"Knit vest sample",type:"Knit",qty:3,roughCost:"¥45,000",status:"ordered",factory:"OSAKA KNIT Lab",img:"IMG_2",updated:"2026-05-07"},
  {id:5,name:"キャップ プロトタイプ",nameEn:"Cap prototype",type:"Accessory",qty:10,roughCost:"¥38,000",status:"draft",factory:"–",img:"IMG_3",updated:"2026-05-05"},
  {id:6,name:"デニムジャケット",nameEn:"Denim jacket",type:"Jacket",qty:20,roughCost:"¥210,000",status:"completed",factory:"KOBE DENIM Works",img:"IMG_1",updated:"2026-04-28"},
];

const FACTORIES=[
  {id:1,name:"TOKYO STITCH Co.",score:94,location:"Tokyo",minLot:30,delivery:"25–30 days",specialty:"Cut & sew, embroidery",price:"¥¥",quality:"★★★★★",match:"Excellent match"},
  {id:2,name:"OSAKA KNIT Lab",score:87,location:"Osaka",minLot:10,delivery:"20–25 days",specialty:"Knitwear, small lot",price:"¥¥¥",quality:"★★★★☆",match:"Good match"},
  {id:3,name:"FUKUOKA CRAFT",score:79,location:"Fukuoka",minLot:50,delivery:"30–35 days",specialty:"Mass production, printing",price:"¥",quality:"★★★★☆",match:"Partial match"},
];

const CHAT_MSGS=[
  {from:"admin",name:"Stitchify Support",text:"Hi Aiko! This is the Stitchify MAKE team. How can we help with your project today?",time:"10:02"},
  {from:"user",text:"Hi! I'm setting up the SS Collection T-shirt. Can I change the fabric after submitting the spec?",time:"10:05"},
  {from:"admin",name:"Stitchify Support",text:"Great question! You can edit the spec freely until an order is placed. Once you request a quote, you'll need to withdraw it first to make changes.",time:"10:06"},
  {from:"user",text:"Got it, thank you. And what's the typical lead time for 100 pieces?",time:"10:08"},
  {from:"admin",name:"Stitchify Support",text:"For 100 pcs with screen printing, most matched factories quote 25–30 days including QC. I can share specific factory timelines once you run the AI match.",time:"10:09"},
];

const Ic=({n,s=18,color,bold})=>{const html=(typeof window!=="undefined"&&window._ICONS&&window._ICONS[n])||"";return <svg width={s} height={s} viewBox="0 0 15 15" fill="none" style={{color:color||"currentColor",flexShrink:0,...(bold?{stroke:"currentColor",strokeWidth:0.6}:{})}} dangerouslySetInnerHTML={{__html:html}}/>;};

const inpS={width:"100%",padding:"11px 14px",border:`1px solid ${T.border}`,borderRadius:T.rs,fontSize:16,fontFamily:T.font,color:T.text,outline:"none",background:T.bg};
const btnP={display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,padding:"10px 24px",background:T.primary,color:"#fff",border:"none",borderRadius:T.rp,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:T.font};
const btnO={...btnP,background:"transparent",color:T.primary,border:`1px solid ${T.primary}`};
const btnGhost={...btnP,background:"transparent",color:T.textSec,border:`1px solid ${T.border}`};
const cardS={background:T.bg,border:`1px solid ${T.border}`,borderRadius:T.r};
const hov=(e,on)=>{e.currentTarget.style.transform=on?"translateY(-2px)":"";e.currentTarget.style.boxShadow=on?T.shadowH:""};
const resolveImg=(k)=>{try{return window._D?window._D[k]:k}catch{return null}};
// Title Case for product names, preserving acronyms (SS) and hyphenated words (T-Shirt)
const titleCase=(s)=>String(s||"").split(" ").map(w=>w===w.toUpperCase()&&w.length<=3?w:w.split("-").map(part=>part.charAt(0).toUpperCase()+part.slice(1).toLowerCase()).join("-")).join(" ");

const Badge=({label,bg,color,size=12})=>(<span style={{fontSize:size,fontWeight:600,padding:"3px 10px",borderRadius:T.rp,background:bg,color,whiteSpace:"nowrap",lineHeight:1.4,letterSpacing:0.1}}>{label}</span>);
const StatusBadge=({status})=>{const s=STATUSES[status]||STATUSES.draft;return<Badge label={s.label} bg={s.bg} color={s.color}/>;};
const Footer=()=>(<div style={{textAlign:"center",padding:"28px 0 12px",fontSize:13,color:T.textPh}}>For questions and help, please email support@stitchify.ai</div>);
const ImgFull=({src,h=180,ar,bg=T.surfaceCool,cover})=>{const[err,setErr]=useState(false);const i=resolveImg(src);const box=ar?{width:"100%",aspectRatio:ar}:{width:"100%",height:h};return(<div style={{...box,background:bg,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>{(!err&&i)?<img src={i} alt="" onError={()=>setErr(true)} style={cover?{width:"100%",height:"100%",objectFit:"cover"}:{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}}/>:<Ic n="img" s={(ar?60:h)*0.3} color={T.textPh}/>}</div>)};

const OptionGroup=({label,options,value,onChange,multi,disabled,required})=>{
  const isSel=(o)=>multi?(value||[]).includes(o):value===o;
  const toggle=(o)=>{if(disabled)return;if(multi){const cur=value||[];onChange(cur.includes(o)?cur.filter(x=>x!==o):[...cur,o])}else onChange(o)};
  return(<div style={{marginBottom:24}}>
    <div style={{fontSize:14,fontWeight:600,color:T.text,marginBottom:10}}>{label}{required&&<span style={{color:T.error,marginLeft:3}}>*</span>}</div>
    <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
      {options.map(o=>{const sel=isSel(o);return(<button key={o} onClick={()=>toggle(o)} disabled={disabled} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",borderRadius:12,border:`1.5px solid ${sel?T.accent:T.border}`,background:sel?T.accentBg:T.bg,color:T.text,fontSize:14,fontWeight:sel?600:400,cursor:disabled?"not-allowed":"pointer",fontFamily:T.font,opacity:disabled?0.6:1,transition:`all 150ms ${T.e}`}}>
        {sel&&<span style={{width:16,height:16,borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic n="check" s={10} color="#1A1A2E"/></span>}{o}
      </button>)})}
    </div>
  </div>)};

// Mini status tracker for the order popup
const ORDER_STAGES=[{k:"ordered",label:"Ordered"},{k:"manufacturing",label:"In production"},{k:"inspection",label:"Inspection"},{k:"shipping",label:"Shipping"},{k:"completed",label:"Delivered"}];
const OrderPopup=({item,onDismiss,onOpen})=>{
  const idx=Math.max(0,ORDER_STAGES.findIndex(s=>s.k===item.status));
  return(<div style={{background:T.bg,border:`1.5px solid ${T.accent}`,borderRadius:T.r,padding:"20px 24px",marginBottom:24,boxShadow:T.shadowH,position:"relative"}}>
    <button onClick={onDismiss} aria-label="Dismiss" style={{position:"absolute",top:14,right:14,background:"none",border:"none",cursor:"pointer",padding:4,color:T.textPh}}><Ic n="close" s={16} color={T.textPh}/></button>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
      <span style={{width:22,height:22,borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="check" s={12} color="#1A1A2E"/></span>
      <span style={{fontSize:16,fontWeight:700,color:T.text}}>Order placed!</span>
    </div>
    <div style={{fontSize:14,color:T.textSec,marginBottom:18,marginLeft:32}}>{titleCase(item.nameEn)} · {item.qty} pcs · confirmed with {item.factory}. Track its progress below.</div>
    <div style={{display:"flex",alignItems:"center",width:"100%",marginBottom:8}}>
      {ORDER_STAGES.map((st,i)=>{const done=i<=idx;return(<React.Fragment key={st.k}>
        {i>0&&<div style={{flex:1,height:2,background:i<=idx?T.accent:T.hairline}}/>}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
          <div style={{width:20,height:20,borderRadius:"50%",background:done?T.accent:T.bg,border:`2px solid ${done?T.accent:T.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{done&&<Ic n="check" s={10} color="#1A1A2E"/>}</div>
          <span style={{fontSize:11,color:done?T.accentText:T.textPh,fontWeight:i===idx?600:400,whiteSpace:"nowrap"}}>{st.label}</span>
        </div>
      </React.Fragment>)})}
    </div>
    <div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}><button onClick={()=>onOpen(item)} style={{...btnO,padding:"7px 16px",fontSize:13}}>View order details →</button></div>
  </div>)};

// Compact production-tracking indicator (shown only when items are in production)
const IN_PRODUCTION=["ordered","manufacturing","inspection","shipping"];
const ProductionTracker=({items,onOpen})=>{
  const[open,setOpen]=useState(true);
  return(<div style={{...cardS,marginBottom:28,background:T.accentBg,borderColor:T.accent,overflow:"hidden"}}>
    <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"18px 24px",background:"none",border:"none",cursor:"pointer",fontFamily:T.font}}>
      <Ic n="factory" s={18} color={T.accentText}/><span style={{fontSize:15,fontWeight:700,color:T.text}}>In production</span>
      <span style={{fontSize:12,color:T.accentText,background:T.bg,borderRadius:T.rp,padding:"2px 10px",fontWeight:600}}>{items.length}</span>
      <span style={{marginLeft:"auto",transform:open?"rotate(180deg)":"none",transition:"transform 200ms",display:"flex"}}><Ic n="chevDown" s={18} color={T.accentText}/></span>
    </button>
    {open&&<div style={{display:"flex",flexDirection:"column",gap:14,padding:"0 24px 22px"}}>
      {items.map(it=>{const idx=Math.max(0,ORDER_STAGES.findIndex(s=>s.k===it.status));return(
        <div key={it.id} onClick={()=>onOpen(it)} style={{background:T.bg,borderRadius:T.rs,padding:"14px 18px",cursor:"pointer",border:`1px solid ${T.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:40,height:40,borderRadius:8,overflow:"hidden",background:T.surfaceCool,flexShrink:0}}><ImgFull src={it.img} h={40}/></div>
              <div><div style={{fontSize:15,fontWeight:600,color:T.text}}>{titleCase(it.nameEn)}</div><div style={{fontSize:12,color:T.textSec}}>{it.qty} pcs · {it.factory}</div></div>
            </div>
            <StatusBadge status={it.status}/>
          </div>
          <div style={{display:"flex",alignItems:"center",width:"100%"}}>
            {ORDER_STAGES.map((st,i)=>{const done=i<=idx;return(<React.Fragment key={st.k}>
              {i>0&&<div style={{flex:1,height:2,background:i<=idx?T.accent:T.hairline}}/>}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{width:16,height:16,borderRadius:"50%",background:done?T.accent:T.bg,border:`2px solid ${done?T.accent:T.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{done&&<Ic n="check" s={8} color="#1A1A2E"/>}</div>
                <span style={{fontSize:10,color:done?T.accentText:T.textPh,fontWeight:i===idx?600:400,whiteSpace:"nowrap"}}>{st.label}</span>
              </div>
            </React.Fragment>)})}
          </div>
        </div>)})}
    </div>}
  </div>)};

const ProjectCard=({p,onOpen})=>{
  const manuf=p.status==="manufacturing";
  const actBtn={width:32,height:32,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",border:"none",background:T.surfaceCool,transition:"background 150ms"};
  return(
  <div style={{...cardS,overflow:"hidden",cursor:"pointer",transition:`all 300ms ${T.eo}`}} onMouseEnter={e=>hov(e,1)} onMouseLeave={e=>hov(e,0)} onClick={()=>onOpen(p)}>
    <div style={{position:"relative"}}>
      <ImgFull src={p.img} ar="3/4" cover/>
      <div style={{position:"absolute",top:12,right:12,filter:"drop-shadow(0 1px 3px rgba(0,0,0,0.25))"}}><StatusBadge status={p.status}/></div>
    </div>
    <div style={{padding:"16px 20px 18px"}}>
      <div style={{fontSize:18,fontWeight:600,color:T.text,marginBottom:2}}>{titleCase(p.nameEn)}</div>
      <div style={{fontSize:13,color:T.textSec}}>{p.type} · {p.qty} pcs · {p.roughCost}</div>
      {p.factory!=="–"&&<div style={{fontSize:12,color:T.accentText,fontWeight:500,marginTop:8}}>🏭 {p.factory}</div>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:14,paddingTop:14,borderTop:`1px solid ${T.hairline}`}}>
        <span style={{fontSize:12,color:T.textPh}}>Updated {p.updated}</span>
        <div style={{display:"flex",gap:8}}>
          <button title="Duplicate" onClick={e=>e.stopPropagation()} style={actBtn} onMouseEnter={e=>e.currentTarget.style.background=T.surfaceSubtle} onMouseLeave={e=>e.currentTarget.style.background=T.surfaceCool}><Ic n="copy" s={16} bold color={T.textSec}/></button>
          {manuf
            ?<button disabled title="Cannot delete a project in manufacturing" onClick={e=>e.stopPropagation()} style={{...actBtn,cursor:"not-allowed"}}><Ic n="trash" s={16} bold color="#C4C0CF"/></button>
            :<button title="Delete" onClick={e=>e.stopPropagation()} style={{...actBtn,background:"#FCE9E9"}} onMouseEnter={e=>e.currentTarget.style.background="#F9D5D5"} onMouseLeave={e=>e.currentTarget.style.background="#FCE9E9"}><Ic n="trash" s={16} bold color={T.error}/></button>}
        </div>
      </div>
    </div>
  </div>)};

const CreateCard=({onNew})=>(
  <div onClick={onNew} style={{border:`2px dashed ${T.border}`,borderRadius:T.r,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,cursor:"pointer",background:T.surfaceCool,minHeight:260,transition:`border-color 200ms`}} onMouseEnter={e=>e.currentTarget.style.borderColor=T.primary} onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
    <button onClick={onNew} className="embroidered" style={{width:56,height:56,borderRadius:"50%",background:T.primary,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 16px rgba(78,53,232,0.35)"}}><Ic n="create" s={24} color="#fff"/></button>
    <span style={{fontSize:14,color:T.textSec,fontWeight:600}}>Create new</span>
  </div>);

// Section order for ungrouped (non-production) items
const SECTION_ORDER=[["draft","Drafts"],["creating","Creating Spec"],["waiting","Waiting for Quote"],["ordered","Ordered"],["manufacturing","Manufacturing"],["inspection","Inspection"],["shipping","Shipping"],["completed","Completed"],["cancelled","Cancelled"]];
const stageIdxOf=(status)=>{const i=ORDER_STAGES.findIndex(s=>s.k===status);return i<0?0:i;};
// Slim inline progress bar (compact) for in-production items
const MiniProgress=({status})=>{const idx=stageIdxOf(status);return(<div style={{display:"flex",alignItems:"center",gap:10,width:"100%"}}>
  <div style={{display:"flex",gap:3,flex:1}}>{ORDER_STAGES.map((st,i)=>(<div key={st.k} style={{flex:1,height:5,borderRadius:3,background:i<=idx?T.accent:T.hairline}}/>))}</div>
  <span style={{fontSize:12,fontWeight:600,color:T.accentText,whiteSpace:"nowrap",minWidth:78,textAlign:"right"}}>{ORDER_STAGES[idx].label}</span>
</div>)};
// Compact one-line project row
const ProjectRow=({p,onOpen})=>{const inProd=IN_PRODUCTION.includes(p.status);return(
  <div onClick={()=>onOpen(p)} style={{...cardS,display:"flex",alignItems:"center",gap:14,padding:"12px 16px",cursor:"pointer",transition:`all 200ms ${T.eo}`}} onMouseEnter={e=>e.currentTarget.style.borderColor=T.primaryLight} onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
    <div style={{width:44,height:58,borderRadius:8,overflow:"hidden",flexShrink:0}}><ImgFull src={p.img} ar="3/4"/></div>
    <div style={{width:200,flexShrink:0}}><div style={{fontSize:15,fontWeight:600,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{titleCase(p.nameEn)}</div><div style={{fontSize:12,color:T.textSec}}>{p.qty} pcs · {p.roughCost}</div></div>
    <div style={{flex:1,minWidth:120}}>{inProd?<MiniProgress status={p.status}/>:<span style={{fontSize:12,color:T.textPh}}>{p.factory!=="–"?`🏭 ${p.factory}`:`Updated ${p.updated}`}</span>}</div>
    <div style={{flexShrink:0}}><StatusBadge status={p.status}/></div>
  </div>)};

const DashboardPage=({projects,onNew,onOpen,justOrdered,onDismiss})=>{
  const inProduction=projects.filter(p=>IN_PRODUCTION.includes(p.status));
  const others=projects.filter(p=>!IN_PRODUCTION.includes(p.status));
  return(<div>
    {justOrdered&&<OrderPopup item={justOrdered} onDismiss={onDismiss} onOpen={onOpen}/>}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
      <div><h1 style={{fontSize:34,fontWeight:700,color:T.text}}>Home</h1><p style={{fontSize:14,color:T.textSec,marginTop:4}}>{projects.length} projects · {inProduction.length} in production</p></div>
      <button onClick={onNew} className="stitched" style={btnP}><Ic n="create" s={15} color="#fff"/> MAKE</button>
    </div>
    {/* Two zones: in-production progress list on top + grid of the rest */}
    {inProduction.length>0&&<div style={{marginBottom:28}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><Ic n="factory" s={17} color={T.accentText}/><h2 style={{fontSize:17,fontWeight:700,color:T.text}}>In production</h2><span style={{fontSize:13,color:T.textPh}}>{inProduction.length}</span></div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>{inProduction.map(p=><ProjectRow key={p.id} p={p} onOpen={onOpen}/>)}</div>
    </div>}
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><h2 style={{fontSize:17,fontWeight:700,color:T.text}}>All projects</h2><span style={{fontSize:13,color:T.textPh}}>{others.length}</span></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:16}}>{others.map(p=><ProjectCard key={p.id} p={p} onOpen={onOpen}/>)}<CreateCard onNew={onNew}/></div>
    <Footer/>
  </div>)};

const LOCKED=["waiting","ordered","manufacturing","inspection","shipping","completed"];
const ConfiguratorPage=({onBack,project,onWithdraw,onMatch})=>{
  const locked=project&&LOCKED.includes(project.status);
  const[spec,setSpec]=useState({orderType:"Mass production",garment:project?project.type:"T-shirt",material:"100% Cotton",processing:"Screen printing",printLoc:"Front centre",printSize:"Medium (10–20cm)",sizes:["S","M","L"],label:"Brand woven label",body:"Gildan G500"});
  const[qty,setQty]=useState(project?String(project.qty):"100");
  const set=(k,v)=>setSpec(s=>({...s,[k]:v}));
  const q=parseInt(qty)||0;
  const base={"T-shirt":200,"Sweatshirt":420,"Pants":480,"Jacket":900,"Knitwear":650,"Knit":650,"Accessory":150}[spec.garment]||200;
  const proc={"Screen printing":350,"Embroidery":500,"Heat transfer":300,"Dye sublimation":450,"None":0}[spec.processing]||0;
  const low=Math.round((base*q+proc*q*0.6+15000)/1000)*1000;
  const high=Math.round((base*q*1.25+proc*q+25000)/1000)*1000;
  const estimate=q>0?`¥${low.toLocaleString()} – ¥${high.toLocaleString()}`:"–";

  return(<div>
    <button onClick={onBack} style={{display:"inline-flex",alignItems:"center",gap:6,background:"none",border:"none",color:T.primary,fontSize:14,fontWeight:500,cursor:"pointer",marginBottom:16,fontFamily:T.font,padding:0}}><Ic n="back" s={15}/> Back to projects</button>
    {project?<div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}><h1 style={{fontSize:28,fontWeight:700,color:T.text}}>{titleCase(project.nameEn)}</h1><StatusBadge status={project.status}/></div>:<h1 style={{fontSize:28,fontWeight:700,color:T.text,marginBottom:8}}>Create a project</h1>}
    <p style={{fontSize:15,color:T.textSec,marginBottom:24}}>Configure your design, specification and body in one place. We'll match you to the best factories.</p>
    {locked&&<div style={{background:"#FEF3C7",border:"1px solid #FCD34D",borderRadius:T.rs,padding:"14px 18px",marginBottom:24,display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:10}}><Ic n="spec" s={18} color={T.warning}/><div><div style={{fontSize:14,fontWeight:600,color:T.warning}}>Specs are locked</div><div style={{fontSize:13,color:T.textSec,marginTop:2}}>This project has an active order ({STATUSES[project.status].label}). Withdraw the order to edit.</div></div></div>
      <button onClick={()=>onWithdraw(project.id)} style={{...btnGhost,flexShrink:0,borderColor:T.warning,color:T.warning}}>Withdraw order</button>
    </div>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:32,alignItems:"start"}}>
      <div style={locked?{opacity:0.55,pointerEvents:"none"}:{}}>
        <div style={{fontSize:14,fontWeight:600,color:T.text,marginBottom:10}}>Design images</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:28}}>
          {["Front","Back","Detail","Reference"].map((role,i)=>(<div key={role} style={{border:`2px dashed ${T.border}`,borderRadius:T.rs,background:T.surfaceCool,cursor:"pointer",overflow:"hidden"}}>
            {i===0&&project?<ImgFull src={project.img} ar="3/4"/>:<div style={{aspectRatio:"3/4",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}><Ic n="upload" s={22} color={T.textPh}/><span style={{fontSize:12,color:T.textPh}}>{role}</span></div>}
          </div>))}
        </div>
        <OptionGroup label="Order type" required value={spec.orderType} onChange={v=>set("orderType",v)} disabled={locked} options={["Mass production","Sample","Sample → Mass plan"]}/>
        <OptionGroup label="Garment type" required value={spec.garment} onChange={v=>set("garment",v)} disabled={locked} options={["T-shirt","Sweatshirt","Pants","Jacket","Knitwear"]}/>
        <OptionGroup label="Primary material" required value={spec.material} onChange={v=>set("material",v)} disabled={locked} options={["100% Cotton","Cotton/Poly blend","100% Polyester","Linen","Wool blend"]}/>
        <OptionGroup label="Processing method" value={spec.processing} onChange={v=>set("processing",v)} disabled={locked} options={["Screen printing","Embroidery","Heat transfer","Dye sublimation","None"]}/>
        <OptionGroup label="Print location" value={spec.printLoc} onChange={v=>set("printLoc",v)} disabled={locked} options={["Front centre","Back centre","Left chest","Sleeve","Multiple"]}/>
        <OptionGroup label="Print size" value={spec.printSize} onChange={v=>set("printSize",v)} disabled={locked} options={["Small (under 10cm)","Medium (10–20cm)","Large (over 20cm)"]}/>
        <OptionGroup label="Size range" multi value={spec.sizes} onChange={v=>set("sizes",v)} disabled={locked} options={["XS","S","M","L","XL","XXL"]}/>
        <OptionGroup label="Tag / Label" value={spec.label} onChange={v=>set("label",v)} disabled={locked} options={["Brand woven label","Printed care label","None"]}/>
        <div style={{marginBottom:28}}>
          <div style={{fontSize:14,fontWeight:600,color:T.text,marginBottom:10}}>Target quantity<span style={{color:T.error,marginLeft:3}}>*</span></div>
          <input type="number" value={qty} onChange={e=>setQty(e.target.value)} disabled={locked} style={{...inpS,maxWidth:200}} min={1}/>
          <div style={{fontSize:12,color:T.textPh,marginTop:6}}>Minimum order quantity varies by factory</div>
        </div>
        <div style={{fontSize:14,fontWeight:600,color:T.text,marginBottom:10}}>Select a body</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[{n:"Gildan G500",d:"White / Black / Navy / Grey · XS–XXL · ¥180–220/pc",rec:true},{n:"Champion T525",d:"White / Oxford Grey · S–XL · ¥320–380/pc",rec:false},{n:"Hanes 5280",d:"10+ colours · XS–3XL · ¥150–180/pc",rec:false}].map(b=>{const sel=spec.body===b.n;return(<button key={b.n} onClick={()=>!locked&&set("body",b.n)} disabled={locked} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 18px",borderRadius:12,border:`1.5px solid ${sel?T.accent:T.border}`,background:sel?T.accentBg:T.bg,cursor:locked?"not-allowed":"pointer",fontFamily:T.font,textAlign:"left",width:"100%"}}>
            <div><div style={{fontSize:15,fontWeight:600,color:T.text,display:"flex",alignItems:"center",gap:8}}>{b.n}{b.rec&&<Badge label="Recommended" bg={T.accent} color={T.text} size={11}/>}</div><div style={{fontSize:13,color:T.textSec,marginTop:2}}>{b.d}</div></div>
            {sel&&<span style={{width:20,height:20,borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic n="check" s={12} color="#1A1A2E"/></span>}
          </button>)})}
        </div>
      </div>
      <div style={{position:"sticky",top:84}}>
        <div style={{...cardS,padding:"24px"}}>
          <div style={{fontSize:16,fontWeight:600,color:T.text,marginBottom:16}}>Summary</div>
          {[["Garment",spec.garment],["Material",spec.material],["Processing",spec.processing],["Body",spec.body],["Sizes",(spec.sizes||[]).join(", ")||"–"],["Quantity",qty?`${qty} pcs`:"–"]].map(([l,v])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:8,gap:12}}><span style={{color:T.textSec}}>{l}</span><span style={{color:T.text,fontWeight:500,textAlign:"right"}}>{v}</span></div>))}
          <div style={{height:1,background:T.hairline,margin:"14px 0"}}/>
          <div style={{fontSize:12,color:T.textSec,marginBottom:2}}>Rough estimate</div>
          <div style={{fontSize:24,fontWeight:700,color:T.text,marginBottom:2}}>{estimate}</div>
          <div style={{fontSize:12,color:T.textPh,marginBottom:18}}>Final quote after factory matching</div>
          <button onClick={onMatch} disabled={locked} className="stitched" style={{...btnP,width:"100%",padding:"14px",fontSize:15,opacity:locked?0.5:1,cursor:locked?"not-allowed":"pointer"}}>Get factory matches</button>
          <div style={{fontSize:12,color:T.textPh,textAlign:"center",marginTop:10}}>No payment required to see matches</div>
        </div>
      </div>
    </div>
    <Footer/>
  </div>)};

const MatchingPage=({onBack,onQuote})=>{
  const[sel,setSel]=useState(null);
  return(<div>
    <button onClick={onBack} style={{display:"inline-flex",alignItems:"center",gap:6,background:"none",border:"none",color:T.primary,fontSize:14,fontWeight:500,cursor:"pointer",marginBottom:16,fontFamily:T.font,padding:0}}><Ic n="back" s={15}/> Back to configurator</button>
    <h1 style={{fontSize:28,fontWeight:700,color:T.text,marginBottom:4}}>Factory matches</h1>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:24}}><div style={{width:8,height:8,borderRadius:"50%",background:T.accent}}/><span style={{fontSize:14,color:T.accentText,fontWeight:500}}>AI ranked {FACTORIES.length} compatible factories for your spec</span></div>
    <div style={{display:"flex",gap:10,marginBottom:24}}>{["Price priority","Delivery priority","Quality priority"].map((p,i)=>(<button key={i} style={{padding:"8px 16px",borderRadius:T.rp,border:`1px solid ${i===0?T.accent:T.border}`,background:i===0?T.accentBg:"transparent",color:i===0?T.accentText:T.textSec,fontSize:13,cursor:"pointer",fontFamily:T.font}}>{p}</button>))}</div>
    {FACTORIES.map(f=>(<div key={f.id} onClick={()=>setSel(f.id)} style={{...cardS,padding:"20px 24px",marginBottom:16,cursor:"pointer",border:`1.5px solid ${sel===f.id?T.accent:T.border}`,background:sel===f.id?T.accentBg:T.bg}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
        <div><div style={{fontSize:18,fontWeight:600,color:T.text}}>{f.name}</div><div style={{fontSize:13,color:T.textSec}}>{f.location} · Min lot {f.minLot} · {f.delivery}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:28,fontWeight:700,color:T.accentText}}>{f.score}<span style={{fontSize:14,color:T.textSec}}>%</span></div><Badge label={f.match} bg={f.score>90?T.accentBg:"#FEF3C7"} color={f.score>90?T.accentText:T.warning}/></div>
      </div>
      <div style={{display:"flex",gap:16,fontSize:14,color:T.textSec}}><span>{f.specialty}</span><span>Price {f.price}</span><span>{f.quality}</span></div>
    </div>))}
    <button onClick={onQuote} disabled={!sel} className="stitched" style={{...btnP,width:"100%",padding:"14px",fontSize:15,marginTop:8,opacity:sel?1:0.5,cursor:sel?"pointer":"not-allowed"}}>Continue to quote →</button>
    <Footer/>
  </div>)};

const QuotePage=({onBack,onOrder})=>(<div>
  <button onClick={onBack} style={{display:"inline-flex",alignItems:"center",gap:6,background:"none",border:"none",color:T.primary,fontSize:14,fontWeight:500,cursor:"pointer",marginBottom:16,fontFamily:T.font,padding:0}}><Ic n="back" s={15}/> Back to matches</button>
  <h1 style={{fontSize:28,fontWeight:700,color:T.text,marginBottom:24}}>Quote & order</h1>
  <div style={{...cardS,padding:"28px",maxWidth:560}}>
    {[["Body (100 × ¥200)","¥20,000"],["Screen printing (front)","¥35,000"],["Brand woven label","¥8,000"],["Factory setup fee","¥15,000"],["Shipping (Tokyo)","¥4,000"]].map(([l,v])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:15,marginBottom:10}}><span style={{color:T.textSec}}>{l}</span><span style={{color:T.text,fontWeight:500}}>{v}</span></div>))}
    <div style={{height:1,background:T.hairline,margin:"14px 0"}}/>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><span style={{fontSize:18,fontWeight:700}}>Total</span><span style={{fontSize:24,fontWeight:700,color:T.primary}}>¥82,000</span></div>
    <div style={{background:T.surfaceSubtle,borderRadius:T.rs,padding:"14px 18px",marginBottom:20,fontSize:13,color:T.textSec,lineHeight:1.7}}>1. Factory confirms within 2 business days<br/>2. 50% deposit processed<br/>3. Manufacturing begins · tracked in your project</div>
    <button onClick={onOrder} className="stitched" style={{...btnP,width:"100%",padding:"14px",fontSize:16}}>Place order · ¥82,000</button>
  </div>
  <Footer/>
</div>);

const StatusPage=({project,onBack,onEditSpec})=>{
  const steps=[{label:"Order confirmed",date:"May 12",done:true},{label:"Material procurement",date:"May 14–16",done:true},{label:"Pattern cutting",date:"May 17–19",done:project.status!=="ordered"},{label:"Sewing",date:"May 20–25",done:false},{label:"Printing",date:"May 26–28",done:false},{label:"QC inspection",date:"May 29–30",done:false},{label:"Shipping",date:"Jun 2",done:false}];
  return(<div>
    <button onClick={onBack} style={{display:"inline-flex",alignItems:"center",gap:6,background:"none",border:"none",color:T.primary,fontSize:14,fontWeight:500,cursor:"pointer",marginBottom:16,fontFamily:T.font,padding:0}}><Ic n="back" s={15}/> Back to projects</button>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}><h1 style={{fontSize:28,fontWeight:700,color:T.text}}>{titleCase(project.nameEn)}</h1><StatusBadge status={project.status}/></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:24,alignItems:"start"}}>
      <div style={{...cardS,padding:"24px"}}>
        <div style={{fontSize:16,fontWeight:600,marginBottom:18}}>Production timeline</div>
        {steps.map((s,i)=>(<div key={i} style={{display:"flex",gap:14}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{width:20,height:20,borderRadius:"50%",background:s.done?T.accent:T.bg,border:`2px solid ${s.done?T.accent:T.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{s.done&&<Ic n="check" s={10} color="#1A1A2E"/>}</div>
            {i<steps.length-1&&<div style={{width:2,height:24,background:s.done?T.accent:T.hairline}}/>}
          </div>
          <div style={{paddingBottom:18}}><div style={{fontSize:14,fontWeight:s.done?600:400,color:s.done?T.text:T.textSec}}>{s.label}</div><div style={{fontSize:12,color:T.textPh}}>{s.date}</div></div>
        </div>))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div style={{...cardS,padding:"20px"}}>
          <div style={{fontSize:13,fontWeight:600,color:T.accentText,marginBottom:6}}>Latest factory update</div>
          <div style={{fontSize:14,color:T.text}}>"Pattern cutting completed. Sewing begins tomorrow."</div>
          <div style={{fontSize:12,color:T.textPh,marginTop:4}}>May 19, 2:34 PM</div>
        </div>
        <div style={{...cardS,padding:"20px"}}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:10}}>Specification</div>
          <div style={{fontSize:13,color:T.textSec,marginBottom:12}}>Locked while the order is active.</div>
          <button onClick={()=>onEditSpec(project)} style={{...btnGhost,width:"100%",justifyContent:"center"}}>View / edit spec</button>
        </div>
        <button style={{...btnO,justifyContent:"center"}}>Chat with factory</button>
      </div>
    </div>
    <Footer/>
  </div>)};

const ChatPage=()=>{
  const[msgs,setMsgs]=useState(CHAT_MSGS);const[txt,setTxt]=useState("");const endRef=useRef(null);
  useEffect(()=>{endRef.current&&endRef.current.scrollIntoView({behavior:"smooth"})},[msgs]);
  const send=()=>{if(!txt.trim())return;setMsgs(m=>[...m,{from:"user",text:txt,time:"now"}]);setTxt("");setTimeout(()=>setMsgs(m=>[...m,{from:"admin",name:"Stitchify Support",text:"Thanks for your message! A team member will reply shortly.",time:"now"}]),900)};
  return(<div style={{maxWidth:760}}>
    <h1 style={{fontSize:28,fontWeight:700,color:T.text,marginBottom:4}}>Chat with Stitchify</h1>
    <p style={{fontSize:14,color:T.textSec,marginBottom:20}}>Questions about your specs, factories or orders? Our team is here to help.</p>
    <div style={{...cardS,overflow:"hidden",display:"flex",flexDirection:"column",height:"calc(100vh - 230px)"}}>
      <div style={{padding:"14px 20px",borderBottom:`1px solid ${T.hairline}`,display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:T.surfaceEditorial,display:"flex",alignItems:"center",justifyContent:"center",color:T.accent,fontWeight:700,fontSize:14}}>S</div>
        <div><div style={{fontSize:14,fontWeight:600,color:T.text}}>Stitchify Support</div><div style={{fontSize:12,color:T.success}}>● Online · replies in ~5 min</div></div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"20px",display:"flex",flexDirection:"column",gap:12,background:T.surfaceCool}}>
        {msgs.map((m,i)=>(<div key={i} style={{display:"flex",justifyContent:m.from==="user"?"flex-end":"flex-start"}}>
          <div style={{maxWidth:"72%"}}>
            {m.from==="admin"&&<div style={{fontSize:11,color:T.textPh,marginBottom:3,marginLeft:4}}>{m.name}</div>}
            <div style={{padding:"10px 14px",borderRadius:m.from==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:m.from==="user"?T.primary:T.bg,color:m.from==="user"?"#fff":T.text,fontSize:14,lineHeight:1.5,border:m.from==="user"?"none":`1px solid ${T.border}`}}>{m.text}</div>
            <div style={{fontSize:10,color:T.textPh,marginTop:3,textAlign:m.from==="user"?"right":"left",padding:"0 4px"}}>{m.time}</div>
          </div>
        </div>))}
        <div ref={endRef}/>
      </div>
      <div style={{padding:"14px 16px",borderTop:`1px solid ${T.hairline}`,display:"flex",gap:10}}>
        <input value={txt} onChange={e=>setTxt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Type a message..." style={{...inpS,flex:1}}/>
        <button onClick={send} className="stitched" style={{...btnP,padding:"0 18px"}}><Ic n="send" s={16} color="#fff"/></button>
      </div>
    </div>
  </div>)};

const REVIEWS=[
  {id:1,stars:5,text:"The service was polite and communication was clear throughout.",author:"@mika.style",date:"May 12"},
  {id:2,stars:4,text:"The worldview was very clear and easy to work with.",author:"@yuki.tnk",date:"May 4"},
  {id:3,stars:4,text:"Fast responses and the samples matched our concept well.",author:"@aoi.s",date:"Apr 28"},
];
const ProfilePage=()=>{
  const[editing,setEditing]=useState(false);
  const[tags,setTags]=useState(["Street style","Clean look","Sustainable"]);
  const allTags=["Street style","Clean look","Sustainable","Vintage","Minimal","Avant-garde","Casual","Luxury"];
  const toggleTag=(t)=>{if(!editing)return;setTags(p=>p.includes(t)?p.filter(x=>x!==t):p.length<5?[...p,t]:p)};
  const hdr={fontSize:13,fontWeight:700,color:T.text,marginBottom:14,textTransform:"uppercase",letterSpacing:0.5};
  const ro=!editing;
  const fld=(label,val,ph)=>(<div style={{marginBottom:16}}><label style={{display:"block",fontSize:12,color:T.textSec,marginBottom:6}}>{label}</label><input style={{...inpS,background:ro?T.surfaceCool:T.bg,color:ro?T.textSec:T.text}} defaultValue={val} placeholder={ph} disabled={ro}/></div>);
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
      <h1 style={{fontSize:28,fontWeight:700,color:T.text}}>{editing?"Edit Profile":"My Profile"}</h1>
      {editing
        ?<div style={{display:"flex",gap:10}}><button onClick={()=>setEditing(false)} style={btnGhost}>Cancel</button><button onClick={()=>setEditing(false)} className="stitched" style={{...btnP,padding:"10px 28px"}}>Save</button></div>
        :<button onClick={()=>setEditing(true)} style={btnO}><Ic n="edit" s={15} color={T.primary}/> Edit profile</button>}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,maxWidth:900,alignItems:"start"}}>
      {/* Left column */}
      <div>
        <div style={{...cardS,padding:"28px",textAlign:"center",marginBottom:20}}>
          <div style={{position:"relative",width:96,height:96,margin:"0 auto 14px"}}>
            <div style={{width:96,height:96,borderRadius:"50%",overflow:"hidden",background:T.surfaceCool,border:`2px solid ${T.border}`}}><ImgFull src="IMG_0" h={96}/></div>
            {editing&&<div style={{position:"absolute",bottom:0,right:0,width:30,height:30,borderRadius:"50%",background:T.primary,border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Ic n="camera" s={15} color="#fff"/></div>}
          </div>
          <input style={{...inpS,textAlign:"center",fontSize:20,fontWeight:700,border:"none",marginBottom:4,background:"transparent",color:T.text}} defaultValue="Aiko Studio" maxLength={30} disabled={ro}/>
          <div style={{fontSize:13,color:T.textPh}}>@aiko.studio</div>
        </div>
        <div style={{...cardS,padding:"24px",marginBottom:20}}>
          <div style={hdr}>About the Brand</div>
          <textarea style={{...inpS,minHeight:100,resize:"vertical",lineHeight:1.5,background:ro?T.surfaceCool:T.bg,color:ro?T.textSec:T.text}} maxLength={200} defaultValue="Modern Tokyo streetwear blending utilitarian silhouettes with clean, minimal detailing. Made for everyday movement in the city." disabled={ro}/>
        </div>
        <div style={{...cardS,padding:"24px",marginBottom:20}}>
          <div style={hdr}>Style Tags <span style={{fontWeight:400,textTransform:"none",letterSpacing:0,color:T.textPh}}>(up to 5)</span></div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {(ro?tags:allTags).map(t=>{const sel=tags.includes(t);return(<button key={t} onClick={()=>toggleTag(t)} disabled={ro} style={{display:"flex",alignItems:"center",gap:5,padding:"8px 14px",borderRadius:T.rp,border:`1.5px solid ${sel?T.accent:T.border}`,background:sel?T.accentBg:T.bg,color:sel?T.accentText:T.textSec,fontSize:13,fontWeight:sel?600:400,cursor:ro?"default":"pointer",fontFamily:T.font}}>{sel&&<Ic n="check" s={12} color={T.accentText}/>}{t}</button>)})}
          </div>
        </div>
        <div style={{...cardS,padding:"24px"}}>
          <div style={hdr}>Past Posts & Products</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            {["IMG_0","IMG_3","IMG_4","IMG_1","IMG_5"].map((im,i)=>(<div key={i} style={{borderRadius:T.rs,overflow:"hidden",background:T.surfaceCool}}><ImgFull src={im} ar="1/1"/></div>))}
            {editing&&<div style={{borderRadius:T.rs,border:`2px dashed ${T.border}`,aspectRatio:"1/1",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Ic n="create" s={22} color={T.textPh}/></div>}
          </div>
        </div>
      </div>
      {/* Right column */}
      <div>
        <div style={{...cardS,padding:"24px",marginBottom:20}}>
          <div style={hdr}>Brand Information</div>
          {fld("Personal name","Aiko Tanaka")}
          {fld("Email","aiko@brand.jp")}
          {fld("Phone","+81 90-1234-5678")}
          {fld("Address","1-2-3 Shibuya, Tokyo 150-0001")}
          {fld("EC / Site URL","","https://yourbrand.com")}
          <div style={{marginBottom:16}}><label style={{display:"block",fontSize:12,color:T.textSec,marginBottom:6}}>Follower count (estimate)</label><select style={{...inpS,appearance:"none",background:ro?T.surfaceCool:T.bg,color:ro?T.textSec:T.text}} disabled={ro}><option>~200</option><option>~1,000</option><option>~10,000</option><option>10,000+</option></select></div>
          <div><label style={{display:"block",fontSize:12,color:T.textSec,marginBottom:6}}>Monthly sales (estimate)</label><select style={{...inpS,appearance:"none",background:ro?T.surfaceCool:T.bg,color:ro?T.textSec:T.text}} disabled={ro}><option>~¥100,000</option><option>~¥500,000</option><option>~¥1,000,000</option><option>Undisclosed</option></select></div>
        </div>
        <div style={{...cardS,padding:"24px",marginBottom:20}}>
          <div style={hdr}>Past Achievements</div>
          <div style={{display:"flex",gap:12}}>
            <div style={{flex:1,background:T.surfaceCool,borderRadius:T.rs,padding:"16px"}}><div style={{fontSize:28,fontWeight:700,color:T.accentText}}>12</div><div style={{fontSize:12,color:T.textSec}}>MAKE items manufactured</div></div>
            <div style={{flex:1,background:T.surfaceCool,borderRadius:T.rs,padding:"16px"}}><div style={{fontSize:28,fontWeight:700,color:T.primary}}>34</div><div style={{fontSize:12,color:T.textSec}}>Showroom orders completed</div></div>
          </div>
          <div style={{fontSize:11,color:T.textPh,marginTop:8}}>Auto-calculated by the system · not editable</div>
        </div>
        <div style={{...cardS,padding:"24px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:T.text,textTransform:"uppercase",letterSpacing:0.5}}>Reviews ({REVIEWS.length})</div>
            <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:"#F5A623"}}>★★★★☆</span><span style={{fontSize:14,fontWeight:600}}>4.2</span></div>
          </div>
          {REVIEWS.map(r=>(<div key={r.id} style={{paddingBottom:14,marginBottom:14,borderBottom:`1px solid ${T.hairline}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{color:"#F5A623",fontSize:13}}>{"★".repeat(r.stars)}{"☆".repeat(5-r.stars)}</span><span style={{fontSize:11,color:T.textPh}}>{r.date}</span></div>
            <div style={{fontSize:13,color:T.text,lineHeight:1.4}}>"{r.text}"</div>
            <div style={{fontSize:11,color:T.textPh,marginTop:3}}>{r.author}</div>
          </div>))}
          <button style={{background:"none",border:"none",color:T.primary,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>See all reviews →</button>
        </div>
      </div>
    </div>
    <Footer/>
  </div>)};

// Sliding segmented toggle (Showroom ⇄ MAKE)
const SegToggle=()=>(
  <div style={{position:"relative",width:208,display:"flex",background:T.surfaceCool,borderRadius:T.rp,padding:4,fontFamily:T.font}}>
    <div style={{position:"absolute",top:4,bottom:4,left:"calc(50% + 0px)",right:4,background:T.bg,borderRadius:T.rp,boxShadow:"0 1px 3px rgba(0,0,0,0.12)",transition:`all 280ms ${T.eo}`}}/>
    <a href="../dashboard/" style={{flex:1,textAlign:"center",position:"relative",zIndex:1,padding:"7px 0",fontSize:13,fontWeight:500,color:T.textSec,textDecoration:"none"}}>Showroom</a>
    <span style={{flex:1,textAlign:"center",position:"relative",zIndex:1,padding:"7px 0",fontSize:13,fontWeight:700,color:T.primary}}>MAKE</span>
  </div>);

const NOTIFICATIONS=[
  {id:1,icon:"check",color:T.success,title:"Order confirmed",body:"TOKYO STITCH Co. confirmed your SS Collection T-shirt order.",time:"2h ago",unread:true},
  {id:2,icon:"factory",color:T.accentText,title:"Production update",body:"Pattern cutting completed for SS Collection T-shirt.",time:"5h ago",unread:true},
  {id:3,icon:"quote",color:T.primary,title:"Quote ready",body:"OSAKA KNIT Lab sent a quote for Knit vest sample.",time:"1d ago",unread:false},
  {id:4,icon:"chat",color:T.warning,title:"New message",body:"Stitchify Support replied to your question about lead times.",time:"1d ago",unread:false},
  {id:5,icon:"track",color:"#2563EB",title:"Shipped",body:"Denim jacket order has shipped via Yamato Transport.",time:"3d ago",unread:false},
];
const NotificationsPage=()=>(<div style={{maxWidth:720}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
    <h1 style={{fontSize:34,fontWeight:700,color:T.text}}>Notifications</h1>
    <button style={{background:"none",border:"none",color:T.primary,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>Mark all read</button>
  </div>
  <div style={{display:"flex",flexDirection:"column",gap:10}}>
    {NOTIFICATIONS.map(n=>(<div key={n.id} style={{...cardS,padding:"16px 18px",display:"flex",gap:14,alignItems:"flex-start",background:n.unread?T.accentBg:T.bg,borderColor:n.unread?T.accent:T.border}}>
      <div style={{width:40,height:40,borderRadius:10,background:T.surfaceCool,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic n={n.icon} s={19} color={n.color}/></div>
      <div style={{flex:1}}><div style={{fontSize:15,fontWeight:600,color:T.text}}>{n.title}</div><div style={{fontSize:14,color:T.textSec,marginTop:2,lineHeight:1.4}}>{n.body}</div><div style={{fontSize:12,color:T.textPh,marginTop:4}}>{n.time}</div></div>
      {n.unread&&<div style={{width:8,height:8,borderRadius:"50%",background:T.primary,flexShrink:0,marginTop:6}}/>}
    </div>))}
  </div>
  <Footer/>
</div>);

const Header=({pg,setPg,onNew,inFlow})=>{
  const items=[{key:"dashboard",label:"Home"},{key:"create",label:"MAKE"},{key:"design",label:"Design",disabled:true},{key:"chat",label:"Chat"},{key:"profile",label:"Profile"}];
  const logo=resolveImg("LOGO_AUTH");
  return(<div style={{position:"sticky",top:0,zIndex:50,background:T.bg,borderBottom:`1px solid ${T.hairline}`}}>
    <div style={{maxWidth:1200,margin:"0 auto",padding:"0 44px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:28}}>
        {logo?<img src={logo} alt="Stitchify" style={{height:26}}/>:<span style={{fontSize:18,fontWeight:700}}>Stitchify</span>}
        <nav style={{display:"flex",gap:4}}>
          {items.map(it=>{if(it.disabled)return(<span key={it.key} title="Coming soon" style={{padding:"8px 14px",fontSize:14,color:"#C4C0CF",fontFamily:T.font,cursor:"default",userSelect:"none"}}>{it.label}</span>);const active=(it.key==="create"?inFlow:(pg===it.key&&!inFlow));return(<button key={it.key} onClick={()=>it.key==="create"?onNew():setPg(it.key)} style={{background:"none",border:"none",borderRadius:8,padding:"8px 14px",fontSize:14,color:active?T.primary:T.textSec,fontWeight:active?600:400,cursor:"pointer",fontFamily:T.font,position:"relative"}}>{it.label}{active&&<span style={{position:"absolute",bottom:-1,left:14,right:14,height:2,background:T.primary,borderRadius:2}}/>}</button>)})}
        </nav>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:16}}>
        <button onClick={()=>setPg("notifications")} title="Notifications" style={{position:"relative",background:"none",border:"none",cursor:"pointer",padding:6,display:"flex"}}>
          <Ic n="bell" s={20} color={pg==="notifications"&&!inFlow?T.primary:T.textSec}/>
          <span style={{position:"absolute",top:3,right:4,width:8,height:8,borderRadius:"50%",background:T.error,border:"2px solid #fff"}}/>
        </button>
        <SegToggle/>
      </div>
    </div>
  </div>)};

function App(){
  const[pg,setPg]=useState("dashboard");const[projects,setProjects]=useState(PROJECTS);
  const[flow,setFlow]=useState(null);const[justOrdered,setJustOrdered]=useState(null);
  const navTo=useCallback((p)=>{setFlow(null);setPg(p)},[]);
  const startNew=useCallback(()=>setFlow({phase:"configure",project:null}),[]);
  const openProject=useCallback((p)=>{setFlow({phase:LOCKED.includes(p.status)?"status":"configure",project:p})},[]);
  const exitFlow=useCallback(()=>setFlow(null),[]);
  const withdraw=useCallback((id)=>{setProjects(prev=>prev.map(p=>p.id===id?{...p,status:"creating",factory:"–"}:p));setFlow(f=>f&&f.project?{phase:"configure",project:{...f.project,status:"creating",factory:"–"}}:f)},[]);
  const placeOrder=useCallback((proj)=>{
    let ordered;
    if(proj){ordered={...proj,status:"ordered",factory:"TOKYO STITCH Co.",roughCost:"¥82,000"};setProjects(prev=>prev.map(p=>p.id===proj.id?ordered:p));}
    else{const id=Date.now();ordered={id,name:"新規オーダー",nameEn:"New order",type:"T-shirt",qty:100,roughCost:"¥82,000",status:"ordered",factory:"TOKYO STITCH Co.",img:"IMG_0",updated:"今"};setProjects(prev=>[ordered,...prev]);}
    setJustOrdered(ordered);setFlow(null);setPg("dashboard");
  },[]);
  let content=null;
  if(flow){
    const {phase,project}=flow;
    if(phase==="configure")content=<ConfiguratorPage project={project} onBack={exitFlow} onWithdraw={withdraw} onMatch={()=>setFlow({...flow,phase:"matching"})}/>;
    else if(phase==="matching")content=<MatchingPage onBack={()=>setFlow({...flow,phase:"configure"})} onQuote={()=>setFlow({...flow,phase:"quote"})}/>;
    else if(phase==="quote")content=<QuotePage onBack={()=>setFlow({...flow,phase:"matching"})} onOrder={()=>placeOrder(project)}/>;
    else if(phase==="status")content=<StatusPage project={project} onBack={exitFlow} onEditSpec={(p)=>setFlow({phase:"configure",project:p})}/>;
  } else {
    if(pg==="dashboard")content=<DashboardPage projects={projects} onNew={startNew} onOpen={openProject} justOrdered={justOrdered} onDismiss={()=>setJustOrdered(null)}/>;
    else if(pg==="notifications")content=<NotificationsPage/>;
    else if(pg==="chat")content=<ChatPage/>;
    else if(pg==="profile")content=<ProfilePage/>;
  }
  return(<div style={{minHeight:"100vh",background:T.surfaceCool,fontFamily:T.font}}>
    <Header pg={pg} setPg={navTo} onNew={startNew} inFlow={!!flow}/>
    <main style={{maxWidth:1200,margin:"0 auto",padding:"32px 44px 40px"}}>{content}</main>
  </div>);
}

export default App;
