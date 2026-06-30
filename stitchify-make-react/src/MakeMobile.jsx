import { useState, useCallback, useRef, useEffect } from "react";

const T={bg:"#FFFFFF",surfaceCool:"#F5F5F7",surfaceSubtle:"#F1F0FA",surfaceEditorial:"#1A1A2E",primary:"#4E35E8",primaryLight:"#7B6BF0",accent:"#A3E635",accentBg:"#F7FEE7",accentText:"#4D7C0F",text:"#1A1A2E",textSec:"#6B7280",textPh:"#757575",border:"#E8E5F0",hairline:"#F0F0F0",success:"#15803D",warning:"#B45309",error:"#B91C1C",r:16,rs:12,rp:999,font:"'Hind','Noto Sans JP',-apple-system,sans-serif",shadow:"0 1px 3px rgba(0,0,0,0.06),0 4px 12px rgba(0,0,0,0.06)",eo:"cubic-bezier(0.05,0.7,0.1,1)"};

const STATUSES={draft:{label:"Draft",bg:"#ECECEF",color:"#57606A"},creating:{label:"Creating Spec",bg:"#EAE6FB",color:"#4E35E8"},waiting:{label:"Waiting for Quote",bg:"#FEF0C7",color:"#B45309"},ordered:{label:"Ordered",bg:"#DDEAFE",color:"#2563EB"},manufacturing:{label:"Manufacturing",bg:"#E6F9C9",color:"#4D7C0F"},inspection:{label:"Inspection",bg:"#FFE8CC",color:"#C2410C"},shipping:{label:"Shipping",bg:"#D2F4F7",color:"#0E7490"},completed:{label:"Completed",bg:"#D7F7E0",color:"#15803D"},cancelled:{label:"Cancelled",bg:"#FCE0E0",color:"#B91C1C"}};

const PROJECTS=[
  {id:1,nameEn:"SS Collection T-shirt",type:"T-shirt",qty:100,roughCost:"¥280,000",status:"manufacturing",factory:"TOKYO STITCH Co.",img:"IMG_0",updated:"May 12"},
  {id:2,nameEn:"Logo embroidery sweat",type:"Sweatshirt",qty:50,roughCost:"¥195,000",status:"waiting",factory:"–",img:"IMG_1",updated:"May 10"},
  {id:3,nameEn:"Wide silhouette pants",type:"Pants",qty:30,roughCost:"¥142,000",status:"creating",factory:"–",img:"IMG_4",updated:"May 9"},
  {id:4,nameEn:"Knit vest sample",type:"Knit",qty:3,roughCost:"¥45,000",status:"ordered",factory:"OSAKA KNIT Lab",img:"IMG_2",updated:"May 7"},
  {id:5,nameEn:"Cap prototype",type:"Accessory",qty:10,roughCost:"¥38,000",status:"draft",factory:"–",img:"IMG_3",updated:"May 5"},
  {id:6,nameEn:"Denim jacket",type:"Jacket",qty:20,roughCost:"¥210,000",status:"completed",factory:"KOBE DENIM",img:"IMG_1",updated:"Apr 28"},
];
const FACTORIES=[
  {id:1,name:"TOKYO STITCH Co.",score:94,location:"Tokyo",delivery:"25–30 days",specialty:"Cut & sew, embroidery",match:"Excellent"},
  {id:2,name:"OSAKA KNIT Lab",score:87,location:"Osaka",delivery:"20–25 days",specialty:"Knitwear, small lot",match:"Good"},
  {id:3,name:"FUKUOKA CRAFT",score:79,location:"Fukuoka",delivery:"30–35 days",specialty:"Mass production",match:"Partial"},
];
const CHAT_THREADS=[
  {id:1,name:"Stitchify Support",avatar:"S",online:true,unread:1,preview:"For 100 pcs with screen printing, most factories quote 25–30 days...",time:"10:09",msgs:[
    {from:"admin",name:"Stitchify Support",text:"Hi Aiko! This is the Stitchify MAKE team. How can we help with your project today?",time:"10:02"},
    {from:"user",text:"Can I change the fabric after submitting the spec?",time:"10:05"},
    {from:"admin",name:"Stitchify Support",text:"You can edit the spec freely until an order is placed. Once you request a quote, you'll need to withdraw it first to make changes.",time:"10:06"},
    {from:"user",text:"Got it, thank you. And what's the typical lead time for 100 pieces?",time:"10:08"},
    {from:"admin",name:"Stitchify Support",text:"For 100 pcs with screen printing, most matched factories quote 25–30 days including QC.",time:"10:09"},
  ]},
  {id:2,name:"TOKYO STITCH Co.",avatar:"T",online:true,unread:2,preview:"Pattern cutting completed. Sewing begins tomorrow.",time:"Yesterday",msgs:[
    {from:"admin",name:"TOKYO STITCH Co.",text:"Thank you for your order! We've confirmed the SS Collection T-shirt (100 pcs).",time:"Mon"},
    {from:"admin",name:"TOKYO STITCH Co.",text:"Material procurement is complete. Moving to pattern cutting.",time:"Wed"},
    {from:"admin",name:"TOKYO STITCH Co.",text:"Pattern cutting completed. Sewing begins tomorrow.",time:"Yesterday"},
  ]},
  {id:3,name:"OSAKA KNIT Lab",avatar:"O",online:false,unread:0,preview:"You: Sounds good, please proceed with the sample.",time:"May 8",msgs:[
    {from:"admin",name:"OSAKA KNIT Lab",text:"We can produce the knit vest sample within 2 weeks.",time:"May 7"},
    {from:"user",text:"Sounds good, please proceed with the sample.",time:"May 8"},
  ]},
];
const NOTIFICATIONS=[
  {id:1,icon:"check",color:T.success,title:"Order confirmed",body:"TOKYO STITCH Co. confirmed your SS Collection T-shirt order.",time:"2h ago",unread:true},
  {id:2,icon:"factory",color:T.accentText,title:"Production update",body:"Pattern cutting completed for SS Collection T-shirt.",time:"5h ago",unread:true},
  {id:3,icon:"quote",color:T.primary,title:"Quote ready",body:"OSAKA KNIT Lab sent a quote for Knit vest sample.",time:"1d ago",unread:false},
  {id:4,icon:"chat",color:T.warning,title:"New message",body:"Stitchify Support replied to your question about lead times.",time:"1d ago",unread:false},
  {id:5,icon:"track",color:"#2563EB",title:"Shipped",body:"Denim jacket order has shipped via Yamato Transport.",time:"3d ago",unread:false},
];
const REVIEWS=[
  {id:1,stars:5,text:"The service was polite and communication was clear throughout.",author:"@mika.style",date:"May 12"},
  {id:2,stars:4,text:"The worldview was very clear and easy to work with.",author:"@yuki.tnk",date:"May 4"},
  {id:3,stars:4,text:"Fast responses and the samples matched our concept well.",author:"@aoi.s",date:"Apr 28"},
];

const Ic=({n,s=18,color,bold})=>{const html=(typeof window!=="undefined"&&window._ICONS&&window._ICONS[n])||"";return <svg width={s} height={s} viewBox="0 0 15 15" fill="none" style={{color:color||"currentColor",flexShrink:0,...(bold?{stroke:"currentColor",strokeWidth:0.7}:{})}} dangerouslySetInnerHTML={{__html:html}}/>;};

const inpS={width:"100%",padding:"13px 14px",border:`1px solid ${T.border}`,borderRadius:T.rs,fontSize:16,fontFamily:T.font,color:T.text,outline:"none",background:T.bg};
const btnP={display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 24px",background:T.primary,color:"#fff",border:"none",borderRadius:T.rp,fontSize:16,fontWeight:600,cursor:"pointer",fontFamily:T.font,width:"100%"};
const btnGhost={...btnP,background:"transparent",color:T.textSec,border:`1px solid ${T.border}`};
const cardS={background:T.bg,border:`1px solid ${T.border}`,borderRadius:T.r,overflow:"hidden"};
const resolveImg=(k)=>{try{return window._D?window._D[k]:k}catch{return null}};
const titleCase=(s)=>String(s||"").split(" ").map(w=>w===w.toUpperCase()&&w.length<=3?w:w.split("-").map(p=>p.charAt(0).toUpperCase()+p.slice(1).toLowerCase()).join("-")).join(" ");
const Badge=({label,bg,color,size=11})=>(<span style={{fontSize:size,fontWeight:600,padding:"3px 9px",borderRadius:T.rp,background:bg,color,whiteSpace:"nowrap",lineHeight:1.4,letterSpacing:0.1}}>{label}</span>);
const StatusBadge=({status})=>{const s=STATUSES[status]||STATUSES.draft;return<Badge label={s.label} bg={s.bg} color={s.color}/>;};
const ImgFull=({src,h=160,ar,bg=T.surfaceCool,cover})=>{const[err,setErr]=useState(false);const i=resolveImg(src);const box=ar?{width:"100%",aspectRatio:ar}:{width:"100%",height:h};return(<div style={{...box,background:bg,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>{(!err&&i)?<img src={i} alt="" onError={()=>setErr(true)} style={cover?{width:"100%",height:"100%",objectFit:"cover"}:{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}}/>:<Ic n="img" s={(ar?56:h)*0.3} color={T.textPh}/>}</div>)};

const OptionGroup=({label,options,value,onChange,multi,disabled,required})=>{
  const isSel=(o)=>multi?(value||[]).includes(o):value===o;
  const toggle=(o)=>{if(disabled)return;if(multi){const cur=value||[];onChange(cur.includes(o)?cur.filter(x=>x!==o):[...cur,o])}else onChange(o)};
  return(<div style={{marginBottom:22}}>
    <div style={{fontSize:14,fontWeight:600,color:T.text,marginBottom:10}}>{label}{required&&<span style={{color:T.error,marginLeft:3}}>*</span>}</div>
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      {options.map(o=>{const sel=isSel(o);return(<button key={o} onClick={()=>toggle(o)} disabled={disabled} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",borderRadius:12,border:`1.5px solid ${sel?T.accent:T.border}`,background:sel?T.accentBg:T.bg,color:T.text,fontSize:13,fontWeight:sel?600:400,cursor:disabled?"not-allowed":"pointer",fontFamily:T.font,opacity:disabled?0.6:1}}>
        {sel&&<span style={{width:14,height:14,borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic n="check" s={9} color="#1A1A2E"/></span>}{o}
      </button>)})}
    </div>
  </div>)};

const LOCKED=["waiting","ordered","manufacturing","inspection","shipping","completed"];

const ORDER_STAGES=[{k:"ordered",label:"Ordered"},{k:"manufacturing",label:"Production"},{k:"inspection",label:"Inspection"},{k:"shipping",label:"Shipping"},{k:"completed",label:"Delivered"}];
const OrderPopup=({item,onDismiss,onOpen})=>{
  const idx=Math.max(0,ORDER_STAGES.findIndex(s=>s.k===item.status));
  return(<div style={{background:T.bg,border:`1.5px solid ${T.accent}`,borderRadius:T.r,padding:"16px",marginBottom:16,boxShadow:T.shadow,position:"relative"}}>
    <button onClick={onDismiss} aria-label="Dismiss" style={{position:"absolute",top:12,right:12,background:"none",border:"none",cursor:"pointer",padding:2,color:T.textPh}}><Ic n="close" s={16} color={T.textPh}/></button>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
      <span style={{width:20,height:20,borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="check" s={11} color="#1A1A2E"/></span>
      <span style={{fontSize:15,fontWeight:700,color:T.text}}>Order placed!</span>
    </div>
    <div style={{fontSize:13,color:T.textSec,marginBottom:16}}>{titleCase(item.nameEn)} · {item.qty} pcs · {item.factory}</div>
    <div style={{display:"flex",alignItems:"center",width:"100%",marginBottom:12}}>
      {ORDER_STAGES.map((st,i)=>{const done=i<=idx;return(<React.Fragment key={st.k}>
        {i>0&&<div style={{flex:1,height:2,background:i<=idx?T.accent:T.hairline}}/>}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div style={{width:18,height:18,borderRadius:"50%",background:done?T.accent:T.bg,border:`2px solid ${done?T.accent:T.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{done&&<Ic n="check" s={9} color="#1A1A2E"/>}</div>
          <span style={{fontSize:8,color:done?T.accentText:T.textPh,fontWeight:i===idx?600:400,whiteSpace:"nowrap"}}>{st.label}</span>
        </div>
      </React.Fragment>)})}
    </div>
    <button onClick={()=>onOpen(item)} style={{...btnP,background:"transparent",color:T.primary,border:`1px solid ${T.primary}`,padding:"9px"}}>View order details →</button>
  </div>)};

const IN_PRODUCTION=["ordered","manufacturing","inspection","shipping"];
const ProductionTracker=({items,onOpen})=>(
  <div style={{...cardS,padding:"16px",marginBottom:18,background:T.accentBg,borderColor:T.accent}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
      <Ic n="factory" s={16} color={T.accentText}/><span style={{fontSize:14,fontWeight:700,color:T.text}}>In production</span>
      <span style={{fontSize:11,color:T.accentText,background:T.bg,borderRadius:T.rp,padding:"1px 9px",fontWeight:600}}>{items.length}</span>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {items.map(it=>{const idx=Math.max(0,ORDER_STAGES.findIndex(s=>s.k===it.status));return(
        <div key={it.id} onClick={()=>onOpen(it)} style={{background:T.bg,borderRadius:T.rs,padding:"12px 14px",cursor:"pointer",border:`1px solid ${T.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
              <div style={{width:34,height:34,borderRadius:7,overflow:"hidden",background:T.surfaceCool,flexShrink:0}}><ImgFull src={it.img} h={34}/></div>
              <div style={{minWidth:0}}><div style={{fontSize:13,fontWeight:600,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{titleCase(it.nameEn)}</div><div style={{fontSize:11,color:T.textSec}}>{it.qty} pcs</div></div>
            </div>
            <StatusBadge status={it.status} size={10}/>
          </div>
          <div style={{display:"flex",alignItems:"center",width:"100%"}}>
            {ORDER_STAGES.map((st,i)=>{const done=i<=idx;return(<React.Fragment key={st.k}>
              {i>0&&<div style={{flex:1,height:2,background:i<=idx?T.accent:T.hairline}}/>}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                <div style={{width:14,height:14,borderRadius:"50%",background:done?T.accent:T.bg,border:`2px solid ${done?T.accent:T.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{done&&<Ic n="check" s={7} color="#1A1A2E"/>}</div>
                <span style={{fontSize:8,color:done?T.accentText:T.textPh,fontWeight:i===idx?600:400,whiteSpace:"nowrap"}}>{st.label}</span>
              </div>
            </React.Fragment>)})}
          </div>
        </div>)})}
    </div>
  </div>);

const PCard=({p,onOpen})=>(
  <div style={{...cardS,boxShadow:T.shadow,cursor:"pointer",overflow:"hidden"}} onClick={()=>onOpen(p)}>
    <div style={{position:"relative"}}><ImgFull src={p.img} ar="3/4" cover/><div style={{position:"absolute",top:8,right:8,filter:"drop-shadow(0 1px 3px rgba(0,0,0,0.25))"}}><StatusBadge status={p.status} size={10}/></div></div>
    <div style={{padding:"10px 12px 12px"}}>
      <div style={{fontSize:14,fontWeight:600,color:T.text,lineHeight:1.3}}>{titleCase(p.nameEn)}</div>
      <div style={{fontSize:12,color:T.textSec,marginTop:2}}>{p.qty} pcs · {p.roughCost}</div>
      {p.factory!=="–"&&<div style={{fontSize:11,color:T.accentText,fontWeight:500,marginTop:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>🏭 {p.factory}</div>}
    </div>
  </div>);

const SECTION_ORDER=[["draft","Drafts"],["creating","Creating Spec"],["waiting","Waiting for Quote"],["ordered","Ordered"],["manufacturing","Manufacturing"],["inspection","Inspection"],["shipping","Shipping"],["completed","Completed"],["cancelled","Cancelled"]];
const stageIdxOf=(status)=>{const i=ORDER_STAGES.findIndex(s=>s.k===status);return i<0?0:i;};
const MiniProgress=({status})=>{const idx=stageIdxOf(status);return(<div style={{display:"flex",alignItems:"center",gap:8,width:"100%"}}>
  <div style={{display:"flex",gap:2,flex:1}}>{ORDER_STAGES.map((st,i)=>(<div key={st.k} style={{flex:1,height:4,borderRadius:2,background:i<=idx?T.accent:T.hairline}}/>))}</div>
  <span style={{fontSize:11,fontWeight:600,color:T.accentText,whiteSpace:"nowrap"}}>{ORDER_STAGES[idx].label}</span>
</div>)};
const ProjectRow=({p,onOpen})=>{const inProd=IN_PRODUCTION.includes(p.status);return(
  <div onClick={()=>onOpen(p)} style={{...cardS,boxShadow:T.shadow,padding:"12px 14px",cursor:"pointer"}}>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:inProd?10:0}}>
      <div style={{width:38,height:50,borderRadius:7,overflow:"hidden",flexShrink:0}}><ImgFull src={p.img} ar="3/4"/></div>
      <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:600,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{titleCase(p.nameEn)}</div><div style={{fontSize:12,color:T.textSec}}>{p.qty} pcs · {p.roughCost}</div></div>
      <StatusBadge status={p.status} size={10}/>
    </div>
    {inProd&&<MiniProgress status={p.status}/>}
  </div>)};

const DashboardPage=({projects,onNew,onOpen,justOrdered,onDismiss})=>{
  const inProduction=projects.filter(p=>IN_PRODUCTION.includes(p.status));
  const others=projects.filter(p=>!IN_PRODUCTION.includes(p.status));
  return(<div style={{padding:"16px 16px 100px"}}>
    {justOrdered&&<OrderPopup item={justOrdered} onDismiss={onDismiss} onOpen={onOpen}/>}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div style={{fontSize:22,fontWeight:700,color:T.text}}>Home</div>
      <button onClick={onNew} className="stitched" style={{...btnP,width:"auto",padding:"9px 16px",fontSize:14,borderRadius:12}}><Ic n="create" s={15} color="#fff"/> MAKE</button>
    </div>
    {/* Two zones: in-production progress list on top + grid of the rest */}
    {inProduction.length>0&&<div style={{marginBottom:22}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><Ic n="factory" s={15} color={T.accentText}/><div style={{fontSize:15,fontWeight:700,color:T.text}}>In production</div><span style={{fontSize:12,color:T.textPh}}>{inProduction.length}</span></div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>{inProduction.map(p=><ProjectRow key={p.id} p={p} onOpen={onOpen}/>)}</div>
    </div>}
    <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:10}}>All projects <span style={{fontSize:12,color:T.textPh,fontWeight:400}}>{others.length}</span></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{others.map(p=><PCard key={p.id} p={p} onOpen={onOpen}/>)}</div>
  </div>)};

const ConfiguratorPage=({onBack,project,onWithdraw,onMatch})=>{
  const locked=project&&LOCKED.includes(project.status);
  const[spec,setSpec]=useState({garment:project?project.type:"T-shirt",material:"100% Cotton",processing:"Screen printing",sizes:["S","M","L"],body:"Gildan G500"});
  const[qty,setQty]=useState(project?String(project.qty):"100");
  const set=(k,v)=>setSpec(s=>({...s,[k]:v}));
  const q=parseInt(qty)||0;
  const base={"T-shirt":200,"Sweatshirt":420,"Pants":480,"Jacket":900,"Knitwear":650,"Knit":650,"Accessory":150}[spec.garment]||200;
  const proc={"Screen printing":350,"Embroidery":500,"Heat transfer":300,"Dye sublimation":450,"None":0}[spec.processing]||0;
  const low=Math.round((base*q+proc*q*0.6+15000)/1000)*1000;
  const high=Math.round((base*q*1.25+proc*q+25000)/1000)*1000;
  const estimate=q>0?`¥${low.toLocaleString()} – ¥${high.toLocaleString()}`:"–";
  return(<div style={{paddingBottom:160}}>
    <div style={{padding:"16px"}}>
      <button onClick={onBack} style={{display:"inline-flex",alignItems:"center",gap:6,background:"none",border:"none",color:T.primary,fontSize:14,fontWeight:500,cursor:"pointer",marginBottom:14,fontFamily:T.font,padding:0}}><Ic n="back" s={16}/> Back</button>
      {project?<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}><div style={{fontSize:22,fontWeight:700,color:T.text}}>{titleCase(project.nameEn)}</div></div>:<div style={{fontSize:22,fontWeight:700,color:T.text,marginBottom:6}}>Create a project</div>}
      {project&&<div style={{marginBottom:12}}><StatusBadge status={project.status}/></div>}
      <p style={{fontSize:14,color:T.textSec,marginBottom:20}}>Configure design, spec and body in one place.</p>
      {locked&&<div style={{background:"#FEF3C7",border:"1px solid #FCD34D",borderRadius:T.rs,padding:"14px",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:12}}><Ic n="spec" s={18} color={T.warning}/><div><div style={{fontSize:14,fontWeight:600,color:T.warning}}>Specs are locked</div><div style={{fontSize:13,color:T.textSec,marginTop:2}}>Active order ({STATUSES[project.status].label}). Withdraw to edit.</div></div></div>
        <button onClick={()=>onWithdraw(project.id)} style={{...btnGhost,borderColor:T.warning,color:T.warning,padding:"10px"}}>Withdraw order</button>
      </div>}
      <div style={locked?{opacity:0.55,pointerEvents:"none"}:{}}>
        <div style={{fontSize:14,fontWeight:600,color:T.text,marginBottom:10}}>Design images</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24}}>
          {["Front","Back","Detail","Reference"].map((role,i)=>(<div key={role} style={{border:`2px dashed ${T.border}`,borderRadius:T.rs,background:T.surfaceCool,overflow:"hidden"}}>
            {i===0&&project?<ImgFull src={project.img} ar="3/4"/>:<div style={{aspectRatio:"3/4",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}><Ic n="upload" s={20} color={T.textPh}/><span style={{fontSize:12,color:T.textPh}}>{role}</span></div>}
          </div>))}
        </div>
        <OptionGroup label="Garment type" required value={spec.garment} onChange={v=>set("garment",v)} disabled={locked} options={["T-shirt","Sweatshirt","Pants","Jacket","Knitwear"]}/>
        <OptionGroup label="Primary material" required value={spec.material} onChange={v=>set("material",v)} disabled={locked} options={["100% Cotton","Cotton/Poly","100% Polyester","Linen","Wool blend"]}/>
        <OptionGroup label="Processing" value={spec.processing} onChange={v=>set("processing",v)} disabled={locked} options={["Screen printing","Embroidery","Heat transfer","Dye sublimation","None"]}/>
        <OptionGroup label="Size range" multi value={spec.sizes} onChange={v=>set("sizes",v)} disabled={locked} options={["XS","S","M","L","XL","XXL"]}/>
        <div style={{marginBottom:22}}>
          <div style={{fontSize:14,fontWeight:600,color:T.text,marginBottom:10}}>Target quantity<span style={{color:T.error,marginLeft:3}}>*</span></div>
          <input type="number" value={qty} onChange={e=>setQty(e.target.value)} disabled={locked} style={inpS} min={1}/>
        </div>
        <div style={{fontSize:14,fontWeight:600,color:T.text,marginBottom:10}}>Select a body</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[{n:"Gildan G500",d:"XS–XXL · ¥180–220/pc",rec:true},{n:"Champion T525",d:"S–XL · ¥320–380/pc",rec:false},{n:"Hanes 5280",d:"XS–3XL · ¥150–180/pc",rec:false}].map(b=>{const sel=spec.body===b.n;return(<button key={b.n} onClick={()=>!locked&&set("body",b.n)} disabled={locked} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",borderRadius:12,border:`1.5px solid ${sel?T.accent:T.border}`,background:sel?T.accentBg:T.bg,cursor:locked?"not-allowed":"pointer",fontFamily:T.font,textAlign:"left",width:"100%"}}>
            <div><div style={{fontSize:14,fontWeight:600,color:T.text,display:"flex",alignItems:"center",gap:8}}>{b.n}{b.rec&&<Badge label="Rec" bg={T.accent} color={T.text}/>}</div><div style={{fontSize:12,color:T.textSec,marginTop:2}}>{b.d}</div></div>
            {sel&&<span style={{width:18,height:18,borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic n="check" s={11} color="#1A1A2E"/></span>}
          </button>)})}
        </div>
      </div>
    </div>
    {/* Sticky cart bar */}
    {!locked&&<div style={{position:"fixed",bottom:62,left:0,right:0,maxWidth:430,margin:"0 auto",background:T.bg,borderTop:`1px solid ${T.hairline}`,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 -2px 12px rgba(0,0,0,0.06)"}}>
      <div style={{flex:1}}><div style={{fontSize:11,color:T.textSec}}>Rough estimate</div><div style={{fontSize:17,fontWeight:700,color:T.text}}>{estimate}</div></div>
      <button onClick={onMatch} className="stitched" style={{...btnP,width:"auto",padding:"12px 20px",fontSize:15}}>Get matches →</button>
    </div>}
  </div>)};

const MatchingPage=({onBack,onQuote})=>{
  const[sel,setSel]=useState(null);
  return(<div style={{padding:"16px 16px 160px"}}>
    <button onClick={onBack} style={{display:"inline-flex",alignItems:"center",gap:6,background:"none",border:"none",color:T.primary,fontSize:14,fontWeight:500,cursor:"pointer",marginBottom:14,fontFamily:T.font,padding:0}}><Ic n="back" s={16}/> Back</button>
    <div style={{fontSize:22,fontWeight:700,color:T.text,marginBottom:4}}>Factory matches</div>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}><div style={{width:8,height:8,borderRadius:"50%",background:T.accent}}/><span style={{fontSize:13,color:T.accentText,fontWeight:500}}>AI ranked {FACTORIES.length} factories</span></div>
    {FACTORIES.map(f=>(<div key={f.id} onClick={()=>setSel(f.id)} style={{...cardS,padding:"16px",marginBottom:12,cursor:"pointer",border:`1.5px solid ${sel===f.id?T.accent:T.border}`,background:sel===f.id?T.accentBg:T.bg}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
        <div><div style={{fontSize:16,fontWeight:600,color:T.text}}>{f.name}</div><div style={{fontSize:12,color:T.textSec}}>{f.location} · {f.delivery}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:24,fontWeight:700,color:T.accentText}}>{f.score}%</div></div>
      </div>
      <div style={{fontSize:13,color:T.textSec}}>{f.specialty} · {f.match} match</div>
    </div>))}
    {sel&&<div style={{position:"fixed",bottom:62,left:0,right:0,maxWidth:430,margin:"0 auto",background:T.bg,borderTop:`1px solid ${T.hairline}`,padding:"12px 16px",boxShadow:"0 -2px 12px rgba(0,0,0,0.06)"}}>
      <button onClick={onQuote} className="stitched" style={btnP}>Continue to quote →</button>
    </div>}
  </div>)};

const QuotePage=({onBack,onOrder})=>(<div style={{padding:"16px 16px 100px"}}>
  <button onClick={onBack} style={{display:"inline-flex",alignItems:"center",gap:6,background:"none",border:"none",color:T.primary,fontSize:14,fontWeight:500,cursor:"pointer",marginBottom:14,fontFamily:T.font,padding:0}}><Ic n="back" s={16}/> Back</button>
  <div style={{fontSize:22,fontWeight:700,color:T.text,marginBottom:20}}>Quote & order</div>
  <div style={{...cardS,padding:"20px"}}>
    {[["Body (100 × ¥200)","¥20,000"],["Screen printing","¥35,000"],["Woven label","¥8,000"],["Setup fee","¥15,000"],["Shipping","¥4,000"]].map(([l,v])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:14,marginBottom:10}}><span style={{color:T.textSec}}>{l}</span><span style={{color:T.text,fontWeight:500}}>{v}</span></div>))}
    <div style={{height:1,background:T.hairline,margin:"12px 0"}}/>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><span style={{fontSize:17,fontWeight:700}}>Total</span><span style={{fontSize:22,fontWeight:700,color:T.primary}}>¥82,000</span></div>
    <button onClick={onOrder} className="stitched" style={btnP}>Place order · ¥82,000</button>
  </div>
</div>);

const StatusPage=({project,onBack,onEditSpec})=>{
  const steps=[{label:"Order confirmed",date:"May 12",done:true},{label:"Material procurement",date:"May 14–16",done:true},{label:"Pattern cutting",date:"May 17–19",done:project.status!=="ordered"},{label:"Sewing",date:"May 20–25",done:false},{label:"Printing",date:"May 26–28",done:false},{label:"QC inspection",date:"May 29–30",done:false},{label:"Shipping",date:"Jun 2",done:false}];
  return(<div style={{padding:"16px 16px 100px"}}>
    <button onClick={onBack} style={{display:"inline-flex",alignItems:"center",gap:6,background:"none",border:"none",color:T.primary,fontSize:14,fontWeight:500,cursor:"pointer",marginBottom:14,fontFamily:T.font,padding:0}}><Ic n="back" s={16}/> Back</button>
    <div style={{fontSize:22,fontWeight:700,color:T.text,marginBottom:6}}>{project.nameEn}</div>
    <div style={{marginBottom:16}}><StatusBadge status={project.status}/></div>
    <div style={{...cardS,padding:"18px",marginBottom:14}}>
      <div style={{fontSize:13,fontWeight:600,color:T.accentText,marginBottom:6}}>Latest factory update</div>
      <div style={{fontSize:14,color:T.text}}>"Pattern cutting completed. Sewing begins tomorrow."</div>
      <div style={{fontSize:12,color:T.textPh,marginTop:4}}>May 19, 2:34 PM</div>
    </div>
    <div style={{...cardS,padding:"18px",marginBottom:14}}>
      <div style={{fontSize:15,fontWeight:600,marginBottom:16}}>Production timeline</div>
      {steps.map((s,i)=>(<div key={i} style={{display:"flex",gap:12}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
          <div style={{width:18,height:18,borderRadius:"50%",background:s.done?T.accent:T.bg,border:`2px solid ${s.done?T.accent:T.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{s.done&&<Ic n="check" s={9} color="#1A1A2E"/>}</div>
          {i<steps.length-1&&<div style={{width:2,height:22,background:s.done?T.accent:T.hairline}}/>}
        </div>
        <div style={{paddingBottom:16}}><div style={{fontSize:14,fontWeight:s.done?600:400,color:s.done?T.text:T.textSec}}>{s.label}</div><div style={{fontSize:12,color:T.textPh}}>{s.date}</div></div>
      </div>))}
    </div>
    <div style={{...cardS,padding:"18px",marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:600,marginBottom:8}}>Specification</div>
      <div style={{fontSize:13,color:T.textSec,marginBottom:12}}>Locked while order is active.</div>
      <button onClick={()=>onEditSpec(project)} style={{...btnGhost,padding:"12px"}}>View / edit spec</button>
    </div>
  </div>)};

const NotificationsPage=()=>(<div style={{padding:"16px 16px 100px"}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
    <div style={{fontSize:22,fontWeight:700,color:T.text}}>Notifications</div>
    <button style={{background:"none",border:"none",color:T.primary,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>Mark all read</button>
  </div>
  <div style={{display:"flex",flexDirection:"column",gap:10}}>
    {NOTIFICATIONS.map(n=>(<div key={n.id} style={{...cardS,padding:"14px",display:"flex",gap:12,alignItems:"flex-start",background:n.unread?T.accentBg:T.bg,borderColor:n.unread?T.accent:T.border}}>
      <div style={{width:36,height:36,borderRadius:10,background:T.surfaceCool,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic n={n.icon} s={18} color={n.color}/></div>
      <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:T.text}}>{n.title}</div><div style={{fontSize:13,color:T.textSec,marginTop:2,lineHeight:1.4}}>{n.body}</div><div style={{fontSize:11,color:T.textPh,marginTop:4}}>{n.time}</div></div>
      {n.unread&&<div style={{width:8,height:8,borderRadius:"50%",background:T.primary,flexShrink:0,marginTop:6}}/>}
    </div>))}
  </div>
</div>);

const ChatThread=({thread,onBack})=>{
  const[msgs,setMsgs]=useState(thread.msgs);const[txt,setTxt]=useState("");const endRef=useRef(null);
  useEffect(()=>{endRef.current&&endRef.current.scrollIntoView({behavior:"smooth"})},[msgs]);
  const send=()=>{if(!txt.trim())return;setMsgs(m=>[...m,{from:"user",text:txt,time:"now"}]);setTxt("");setTimeout(()=>setMsgs(m=>[...m,{from:"admin",name:thread.name,text:"Thanks for your message! We'll get back to you shortly.",time:"now"}]),900)};
  return(<div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 124px)"}}>
    <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.hairline}`,display:"flex",alignItems:"center",gap:10,background:T.bg}}>
      <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",padding:4,display:"flex"}}><Ic n="back" s={20} color={T.text}/></button>
      <div style={{width:36,height:36,borderRadius:"50%",background:T.surfaceEditorial,display:"flex",alignItems:"center",justifyContent:"center",color:T.accent,fontWeight:700,fontSize:14}}>{thread.avatar}</div>
      <div><div style={{fontSize:14,fontWeight:600,color:T.text}}>{thread.name}</div><div style={{fontSize:12,color:thread.online?T.success:T.textPh}}>{thread.online?"● Online":"Offline"}</div></div>
    </div>
    <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:10,background:T.surfaceCool}}>
      {msgs.map((m,i)=>(<div key={i} style={{display:"flex",justifyContent:m.from==="user"?"flex-end":"flex-start"}}>
        <div style={{maxWidth:"80%"}}>
          {m.from==="admin"&&<div style={{fontSize:11,color:T.textPh,marginBottom:3,marginLeft:4}}>{m.name}</div>}
          <div style={{padding:"10px 13px",borderRadius:m.from==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:m.from==="user"?T.primary:T.bg,color:m.from==="user"?"#fff":T.text,fontSize:14,lineHeight:1.5,border:m.from==="user"?"none":`1px solid ${T.border}`}}>{m.text}</div>
          <div style={{fontSize:10,color:T.textPh,marginTop:3,textAlign:m.from==="user"?"right":"left",padding:"0 4px"}}>{m.time}</div>
        </div>
      </div>))}
      <div ref={endRef}/>
    </div>
    <div style={{padding:"12px 16px",borderTop:`1px solid ${T.hairline}`,display:"flex",gap:10,background:T.bg}}>
      <input value={txt} onChange={e=>setTxt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Type a message..." style={{...inpS,flex:1}}/>
      <button onClick={send} className="stitched" style={{...btnP,width:"auto",padding:"0 16px"}}><Ic n="send" s={16} color="#fff"/></button>
    </div>
  </div>)};

const ChatPage=()=>{
  const[open,setOpen]=useState(null);
  if(open)return <ChatThread thread={open} onBack={()=>setOpen(null)}/>;
  return(<div style={{padding:"16px 16px 100px"}}>
    <div style={{fontSize:22,fontWeight:700,color:T.text,marginBottom:6}}>Chat</div>
    <p style={{fontSize:13,color:T.textSec,marginBottom:18}}>Your conversations with Stitchify and your factories</p>
    <div style={{display:"flex",flexDirection:"column",gap:2}}>
      {CHAT_THREADS.map(t=>(<button key={t.id} onClick={()=>setOpen(t)} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 8px",background:"none",border:"none",borderBottom:`1px solid ${T.hairline}`,cursor:"pointer",fontFamily:T.font,textAlign:"left",width:"100%"}}>
        <div style={{position:"relative",flexShrink:0}}>
          <div style={{width:48,height:48,borderRadius:"50%",background:T.surfaceEditorial,display:"flex",alignItems:"center",justifyContent:"center",color:T.accent,fontWeight:700,fontSize:17}}>{t.avatar}</div>
          {t.online&&<div style={{position:"absolute",bottom:1,right:1,width:11,height:11,borderRadius:"50%",background:T.success,border:"2px solid #fff"}}/>}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}><span style={{fontSize:15,fontWeight:t.unread?700:600,color:T.text}}>{t.name}</span><span style={{fontSize:11,color:T.textPh,flexShrink:0,marginLeft:8}}>{t.time}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}><span style={{fontSize:13,color:t.unread?T.text:T.textSec,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:t.unread?500:400}}>{t.preview}</span>{t.unread>0&&<span style={{flexShrink:0,minWidth:18,height:18,borderRadius:9,background:T.primary,color:"#fff",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 5px"}}>{t.unread}</span>}</div>
        </div>
      </button>))}
    </div>
  </div>)};

const ProfilePage=()=>{
  const[editing,setEditing]=useState(false);
  const[tags,setTags]=useState(["Street style","Clean look","Sustainable"]);
  const allTags=["Street style","Clean look","Sustainable","Vintage","Minimal","Avant-garde","Casual","Luxury"];
  const toggleTag=(t)=>{if(!editing)return;setTags(p=>p.includes(t)?p.filter(x=>x!==t):p.length<5?[...p,t]:p)};
  const ro=!editing;
  const sectionHdr={fontSize:13,fontWeight:700,color:T.text,marginBottom:12,textTransform:"uppercase",letterSpacing:0.5};
  const field=(label,val,ph)=>(<div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,color:T.textSec,marginBottom:6}}>{label}</label><input style={{...inpS,background:ro?T.surfaceCool:T.bg,color:ro?T.textSec:T.text}} defaultValue={val} placeholder={ph} disabled={ro}/></div>);
  return(<div style={{padding:"16px 16px 100px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
      <div style={{fontSize:22,fontWeight:700,color:T.text}}>{editing?"Edit Profile":"My Profile"}</div>
      {editing
        ?<div style={{display:"flex",gap:8}}><button onClick={()=>setEditing(false)} style={{...btnGhost,width:"auto",padding:"8px 14px",fontSize:13,borderRadius:10}}>Cancel</button><button onClick={()=>setEditing(false)} className="stitched" style={{...btnP,width:"auto",padding:"8px 18px",fontSize:13,borderRadius:10}}>Save</button></div>
        :<button onClick={()=>setEditing(true)} style={{...btnP,background:"transparent",color:T.primary,border:`1px solid ${T.primary}`,width:"auto",padding:"8px 16px",fontSize:13,borderRadius:10}}><Ic n="edit" s={14} color={T.primary}/> Edit</button>}
    </div>
    {/* Brand identity */}
    <div style={{...cardS,padding:"22px",textAlign:"center",marginBottom:14}}>
      <div style={{position:"relative",width:96,height:96,margin:"0 auto 12px"}}>
        <div style={{width:96,height:96,borderRadius:"50%",overflow:"hidden",background:T.surfaceCool,border:`2px solid ${T.border}`}}><ImgFull src="IMG_0" h={96}/></div>
        {editing&&<div style={{position:"absolute",bottom:0,right:0,width:30,height:30,borderRadius:"50%",background:T.primary,border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="camera" s={15} color="#fff"/></div>}
      </div>
      <input style={{...inpS,textAlign:"center",fontSize:18,fontWeight:700,border:"none",marginBottom:4,background:"transparent",color:T.text}} defaultValue="Aiko Studio" maxLength={30} placeholder="Brand name" disabled={ro}/>
      <div style={{fontSize:13,color:T.textPh}}>@aiko.studio</div>
    </div>
    {/* About */}
    <div style={{...cardS,padding:"18px",marginBottom:14}}>
      <div style={sectionHdr}>About the Brand</div>
      <textarea style={{...inpS,minHeight:90,resize:"vertical",lineHeight:1.5,background:ro?T.surfaceCool:T.bg,color:ro?T.textSec:T.text}} maxLength={200} defaultValue="Modern Tokyo streetwear blending utilitarian silhouettes with clean, minimal detailing. Made for everyday movement in the city." placeholder="Your worldview / concept (max 200 chars)" disabled={ro}/>
    </div>
    {/* Style tags */}
    <div style={{...cardS,padding:"18px",marginBottom:14}}>
      <div style={sectionHdr}>Style Tags <span style={{fontWeight:400,textTransform:"none",letterSpacing:0,color:T.textPh}}>(up to 5)</span></div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {(ro?tags:allTags).map(t=>{const sel=tags.includes(t);return(<button key={t} onClick={()=>toggleTag(t)} disabled={ro} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 13px",borderRadius:T.rp,border:`1.5px solid ${sel?T.accent:T.border}`,background:sel?T.accentBg:T.bg,color:sel?T.accentText:T.textSec,fontSize:13,fontWeight:sel?600:400,cursor:ro?"default":"pointer",fontFamily:T.font}}>{sel&&<Ic n="check" s={12} color={T.accentText}/>}{t}</button>)})}
      </div>
    </div>
    {/* Brand info */}
    <div style={{...cardS,padding:"18px",marginBottom:14}}>
      <div style={sectionHdr}>Brand Information</div>
      {field("Personal name","Aiko Tanaka")}
      {field("Email","aiko@brand.jp")}
      {field("Phone","+81 90-1234-5678")}
      {field("Address","1-2-3 Shibuya, Tokyo 150-0001")}
      {field("EC / Site URL","","https://yourbrand.com")}
      <div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,color:T.textSec,marginBottom:6}}>Follower count (estimate)</label><select style={{...inpS,appearance:"none",background:ro?T.surfaceCool:T.bg,color:ro?T.textSec:T.text}} disabled={ro}><option>~200</option><option>~1,000</option><option>~10,000</option><option>10,000+</option></select></div>
      <div style={{marginBottom:2}}><label style={{display:"block",fontSize:12,color:T.textSec,marginBottom:6}}>Monthly sales (estimate)</label><select style={{...inpS,appearance:"none",background:ro?T.surfaceCool:T.bg,color:ro?T.textSec:T.text}} disabled={ro}><option>~¥100,000</option><option>~¥500,000</option><option>~¥1,000,000</option><option>Undisclosed</option></select></div>
    </div>
    {/* Gallery */}
    <div style={{...cardS,padding:"18px",marginBottom:14}}>
      <div style={sectionHdr}>Past Posts & Products</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        {["IMG_0","IMG_3","IMG_4","IMG_1","IMG_5"].map((im,i)=>(<div key={i} style={{borderRadius:T.rs,overflow:"hidden",background:T.surfaceCool}}><ImgFull src={im} ar="1/1"/></div>))}
        {editing&&<div style={{borderRadius:T.rs,border:`2px dashed ${T.border}`,aspectRatio:"1/1",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Ic n="plus" s={22} color={T.textPh}/></div>}
      </div>
    </div>
    {/* Achievements (auto) */}
    <div style={{...cardS,padding:"18px",marginBottom:14}}>
      <div style={sectionHdr}>Past Achievements</div>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:1,background:T.surfaceCool,borderRadius:T.rs,padding:"14px"}}><div style={{fontSize:24,fontWeight:700,color:T.accentText}}>12</div><div style={{fontSize:12,color:T.textSec}}>MAKE items manufactured</div></div>
        <div style={{flex:1,background:T.surfaceCool,borderRadius:T.rs,padding:"14px"}}><div style={{fontSize:24,fontWeight:700,color:T.primary}}>34</div><div style={{fontSize:12,color:T.textSec}}>Showroom orders completed</div></div>
      </div>
      <div style={{fontSize:11,color:T.textPh,marginTop:8}}>Auto-calculated by the system · not editable</div>
    </div>
    {/* Reviews */}
    <div style={{...cardS,padding:"18px",marginBottom:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,color:T.text,textTransform:"uppercase",letterSpacing:0.5}}>Reviews ({REVIEWS.length})</div>
        <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:"#F5A623",fontSize:14}}>★★★★☆</span><span style={{fontSize:14,fontWeight:600}}>4.2</span></div>
      </div>
      {REVIEWS.map(r=>(<div key={r.id} style={{paddingBottom:12,marginBottom:12,borderBottom:`1px solid ${T.hairline}`}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{color:"#F5A623",fontSize:12}}>{"★".repeat(r.stars)}{"☆".repeat(5-r.stars)}</span><span style={{fontSize:11,color:T.textPh}}>{r.date}</span></div>
        <div style={{fontSize:13,color:T.text,lineHeight:1.4}}>"{r.text}"</div>
        <div style={{fontSize:11,color:T.textPh,marginTop:3}}>{r.author}</div>
      </div>))}
      <button style={{background:"none",border:"none",color:T.primary,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:T.font}}>See all reviews →</button>
    </div>
    {editing&&<button className="stitched" style={btnP} onClick={()=>setEditing(false)}>Save</button>}
  </div>)};

const TabBar=({pg,onChange,inFlow})=>{
  const left=[{key:"dashboard",icon:"home",label:"Home"},{key:"design",icon:"needle",label:"Design",disabled:true}];
  const right=[{key:"chat",icon:"chat",label:"Chat"},{key:"profile",icon:"profile",label:"Profile"}];
  const Tab=(t)=>{if(t.disabled)return(<div key={t.key} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 0",opacity:1}}>
    <div style={{width:34,height:34,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n={t.icon} s={22} bold color="#C4C0CF"/></div>
    <span style={{fontSize:10,color:"#C4C0CF",fontWeight:500}}>{t.label}</span>
  </div>);
  const act=pg===t.key&&!inFlow;return(<button key={t.key} onClick={()=>onChange(t.key)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"4px 0",fontFamily:T.font}}>
    <div style={{width:34,height:34,borderRadius:11,background:act?T.accentBg:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n={t.icon} s={22} bold color={act?T.accentText:T.textPh}/></div>
    <span style={{fontSize:10,color:act?T.accentText:T.textPh,fontWeight:act?600:500}}>{t.label}</span>
  </button>)};
  const createActive=inFlow;
  return(<div style={{position:"fixed",bottom:0,left:0,right:0,maxWidth:430,margin:"0 auto",background:T.bg,borderTop:`1px solid ${T.hairline}`,display:"flex",alignItems:"flex-end",padding:"6px 0 env(safe-area-inset-bottom,6px)",zIndex:100,boxShadow:"0 -2px 12px rgba(0,0,0,0.06)"}}>
    {left.map(Tab)}
    {/* Centered embroidered Create */}
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
      <button onClick={()=>onChange("create")} className="embroidered" style={{width:54,height:54,borderRadius:18,background:createActive?T.primaryHover:T.primary,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginTop:-22,boxShadow:"0 6px 16px rgba(78,53,232,0.35)",position:"relative"}}>
        <Ic n="create" s={26} color="#fff"/>
      </button>
      <span style={{fontSize:10,color:createActive?T.primary:T.textPh,fontWeight:createActive?600:500}}>MAKE</span>
    </div>
    {right.map(Tab)}
  </div>)};

function App(){
  const[pg,setPg]=useState("dashboard");const[projects,setProjects]=useState(PROJECTS);const[flow,setFlow]=useState(null);const[justOrdered,setJustOrdered]=useState(null);
  const startNew=useCallback(()=>setFlow({phase:"configure",project:null}),[]);
  const openProject=useCallback((p)=>setFlow({phase:LOCKED.includes(p.status)?"status":"configure",project:p}),[]);
  const exitFlow=useCallback(()=>setFlow(null),[]);
  const onTab=useCallback((k)=>{if(k==="create"){startNew()}else{setFlow(null);setPg(k)}},[startNew]);
  const withdraw=useCallback((id)=>{setProjects(prev=>prev.map(p=>p.id===id?{...p,status:"creating",factory:"–"}:p));setFlow(f=>f&&f.project?{phase:"configure",project:{...f.project,status:"creating",factory:"–"}}:f)},[]);
  const placeOrder=useCallback((proj)=>{
    let ordered;
    if(proj){ordered={...proj,status:"ordered",factory:"TOKYO STITCH Co.",roughCost:"¥82,000"};setProjects(prev=>prev.map(p=>p.id===proj.id?ordered:p));}
    else{const id=Date.now();ordered={id,nameEn:"New order",type:"T-shirt",qty:100,roughCost:"¥82,000",status:"ordered",factory:"TOKYO STITCH Co.",img:"IMG_0",updated:"now"};setProjects(prev=>[ordered,...prev]);}
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
  const logo=resolveImg("LOGO_AUTH");
  return(<div style={{minHeight:"100vh",background:T.surfaceCool,fontFamily:T.font,maxWidth:430,margin:"0 auto",position:"relative"}}>
    <div style={{position:"sticky",top:0,zIndex:50,background:T.bg,borderBottom:`1px solid ${T.hairline}`,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      {logo?<img src={logo} alt="Stitchify" style={{height:22}}/>:<span style={{fontSize:16,fontWeight:700}}>Stitchify</span>}
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>onTab("notifications")} title="Notifications" style={{position:"relative",background:"none",border:"none",cursor:"pointer",padding:4,display:"flex"}}>
          <Ic n="bell" s={21} bold color={pg==="notifications"&&!flow?T.primary:T.textSec}/>
          <span style={{position:"absolute",top:2,right:3,width:7,height:7,borderRadius:"50%",background:T.error,border:"1.5px solid #fff"}}/>
        </button>
        <div style={{position:"relative",width:150,display:"flex",background:T.surfaceCool,borderRadius:T.rp,padding:3,fontFamily:T.font}}>
          <div style={{position:"absolute",top:3,bottom:3,left:"calc(50% + 0px)",right:3,background:T.bg,borderRadius:T.rp,boxShadow:"0 1px 3px rgba(0,0,0,0.12)",transition:`all 280ms ${T.eo}`}}/>
          <a href="../dashboard-mobile/" style={{flex:1,textAlign:"center",position:"relative",zIndex:1,padding:"6px 0",fontSize:12,fontWeight:500,color:T.textSec,textDecoration:"none"}}>Showroom</a>
          <span style={{flex:1,textAlign:"center",position:"relative",zIndex:1,padding:"6px 0",fontSize:12,fontWeight:700,color:T.primary}}>MAKE</span>
        </div>
      </div>
    </div>
    {content}
    <TabBar pg={pg} onChange={onTab} inFlow={!!flow}/>
  </div>);
}

export default App;
