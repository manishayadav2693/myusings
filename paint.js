/* MYusings: small ink-and-watercolour painter shared by the inner pages */
(()=>{
let sv=7;
const rnd=()=>(sv=sv*16807%2147483647)/2147483647;
const f1=n=>(+n).toFixed(1);
const ease=x=>x<=0?0:x>=1?1:x*x*(3-2*x);
const ramp=(u,a,b)=>ease((u-a)/(b-a));
const lerp=(a,b,t)=>a+(b-a)*t;
const cr=(p,open)=>{const n=p.length;let d='M'+f1(p[0][0])+','+f1(p[0][1]);const L=open?n-1:n;for(let i=0;i<L;i++){const a=p[open?Math.max(i-1,0):(i-1+n)%n],b=p[i],c=p[(i+1)%n],e=p[open?Math.min(i+2,n-1):(i+2)%n];d+='C'+f1(b[0]+(c[0]-a[0])/6)+','+f1(b[1]+(c[1]-a[1])/6)+' '+f1(c[0]-(e[0]-b[0])/6)+','+f1(c[1]-(e[1]-b[1])/6)+' '+f1(c[0])+','+f1(c[1])}return d+(open?'':'Z')};
const jit=(p,j)=>p.map(([x,y])=>[x+(rnd()-.5)*j,y+(rnd()-.5)*j]);
const ell=(cx,cy,rx,ry,j)=>{const p=[];for(let i=0;i<14;i++){const a=i/14*Math.PI*2,k=1+(rnd()-.5)*j;p.push([cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k])}return p};
const INK='stroke="#1f1b1d" fill="none" stroke-linecap="round" stroke-linejoin="round"';
const wash=(p,fill,op,s=.9,dx=0,dy=0)=>'<path d="'+cr(jit(p.map(([x,y])=>[x*s+dx,y*s+dy]),1.6))+'" fill="'+fill+'" opacity="'+op+'"/>';
const line=(p,w=.7,op=.9,cut=2)=>{const q=jit(p,.8);return '<path d="'+cr(q.slice(0,q.length-cut),true)+'" '+INK+' stroke-width="'+w+'" opacity="'+op+'"/>'};
const wc=(p,fill,op,o={})=>wash(p,fill,op,o.s||.92,o.dx||0,o.dy||0)+(o.second?wash(p,o.second,o.sop||.3,.68,o.sdx||0,o.sdy||0):'')+line(o.ls?p.map(([x,y])=>[x*o.ls,y*o.ls]):p,o.w,o.lop,o.cut);
const blade=(x,y,h,l)=>'M'+f1(x)+','+f1(y)+'q'+f1(l*.3)+','+f1(-h*.55)+' '+f1(l)+','+f1(-h);
const petalPts=(R,sp)=>{const p=[[-3,-1]];const s=Math.sin(sp*.85),c=Math.cos(sp*.85);p.push([-R*.42*s,-R*.42*c]);for(let k=0;k<=12;k++){const th=-sp+2*sp*k/12;const r=R*(.8+.2*Math.sin(Math.PI*k/12))*(1+(rnd()-.5)*.12);p.push([r*Math.sin(th),-r*Math.cos(th)])}p.push([R*.42*s,-R*.42*c]);p.push([3,-1]);return p};
const leafPts=(L,W)=>{const up=[],lo=[];for(let i=1;i<9;i++){const x=L*i/9,e=Math.sin(Math.PI*i/9)**.8*W;up.push([x,-e*(i%2?1:.55)]);lo.push([x+L*.03,e*(i%2?.6:1)])}return [[0,0],...up,[L,0],...lo.reverse()]};
let uid=0;

/* A poppy in a 160 x 260 box: set(0) is a nodding bud, set(1) is full bloom */
const poppy=(svg,opt={})=>{
  sv=opt.seed||7;const id='p'+(uid++),k=opt.petal||'pink';
  const G=k==='scarlet'?['#5a0a06','#b80d05','#f2210f','#ff6a45','#ffc2b0']:['#3a0d4f','#9c1356','#ef2f55','#ff5f9e','#ffc4dd'];
  svg.setAttribute('viewBox','0 0 160 260');
  let h='<defs><radialGradient id="'+id+'g" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="52"><stop offset="0" stop-color="'+G[0]+'"/><stop offset=".16" stop-color="'+G[1]+'"/><stop offset=".45" stop-color="'+G[2]+'"/><stop offset=".8" stop-color="'+G[3]+'"/><stop offset="1" stop-color="'+G[4]+'"/></radialGradient><linearGradient id="'+id+'l" x1="0" x2="1"><stop offset="0" stop-color="#1f8a3a"/><stop offset="1" stop-color="#a6dc6a"/></linearGradient></defs>';
  if(opt.ground!==false){h+='<path d="M4 241C40 239 70 242 80 240S130 238 156 241" '+INK+' stroke-width=".7" opacity=".45"/>';
    for(let x=10;x<156;x+=9+rnd()*10){if(Math.abs(x-80)<8)continue;h+='<g class="sw" style="animation-delay:'+f1(-x/160*6)+'s"><path d="'+blade(x,241,5+rnd()*9,(rnd()-.3)*6)+'" stroke="#3faa4a" fill="none" stroke-width=".8" opacity=".6" stroke-linecap="round"/></g>'}}
  [[-160,52,10],[-20,48,9]].forEach(([r,L,W])=>h+='<g transform="translate(80 240) rotate('+r+')">'+wc(leafPts(L,W),'url(#'+id+'l)','.85',{cut:3,w:.6})+'</g>');
  h+='<path class="sw2" fill="none" stroke="#5cbf4a" stroke-width="3" opacity=".5" stroke-linecap="round"/><path class="sk" fill="none" stroke="#1f1b1d" stroke-width=".6" opacity=".8" stroke-linecap="round"/>';
  h+='<g class="hd"><g class="drops">';for(let i=0;i<6;i++){const a=rnd()*6.28,r=40+rnd()*36;h+='<circle cx="'+f1(Math.cos(a)*r)+'" cy="'+f1(-20+Math.sin(a)*r*.7)+'" r="'+f1(.8+rnd()*1.6)+'" fill="'+['#ef2f55','#ff4f9a','#8b45c9'][i%3]+'" opacity=".7"/>'}h+='</g>';
  [-128,-52,166,14].forEach((a,i)=>{const R=i<2?52:47;const p=petalPts(R,.98);h+='<g class="pt" data-a="'+(a+90)+'">'+wc(p,'url(#'+id+'g)','.86',{s:1,dx:1.5,dy:-1.5,ls:.95,second:k==='scarlet'?'#ff7a5c':'#ff4f9a',sop:.3,sdy:-8,cut:3,w:.6})+'<path d="M0,-6Q-6,-20 -14,-34M0,-6Q6,-20 12,-36" '+INK+' stroke-width=".45" opacity=".6"/></g>'});
  h+='<g class="ct"><ellipse cx="0" cy="-5" rx="10" ry="9" fill="#2a0a3a" opacity=".5"/><ellipse cx="0" cy="-8" rx="5" ry="6" fill="#6fb046" opacity=".9"/><path d="M-5,-8A5,6 0 1 1 5,-8" '+INK+' stroke-width=".5"/></g>';
  h+='<g class="bd" transform="scale(.62)">'+[-1,1].map(s=>'<g class="hf">'+wc([[0,0],[12*s,-8],[15*s,-26],[9*s,-44],[0,-52],[3*s,-30]],s<0?'#5e9a32':'#79b23e','.85',{second:'#8b45c9',sop:.3,sdy:6,cut:1,w:.8})+'</g>').join('')+'</g></g>';
  svg.innerHTML=h;
  const q=s=>svg.querySelector(s),qa=s=>[...svg.querySelectorAll(s)];
  const hd=q('.hd'),bd=q('.bd'),hf=qa('.hf'),pt=qa('.pt'),ct=q('.ct'),dr=q('.drops'),st=[q('.sw2'),q('.sk')];
  const set=p=>{
    const n=1-ramp(p,.12,.5),Ty=70,Hx=80+18*n,Hy=Ty+14*n;
    const d='M80 241C78 '+f1(240-85)+' '+f1(80+6*n)+' '+f1(Ty-16*n)+' '+f1(Hx)+' '+f1(Hy);st.forEach(e=>e.setAttribute('d',d));
    hd.setAttribute('transform','translate('+f1(Hx)+' '+f1(Hy)+') rotate('+f1(150*n)+')');
    const o=ramp(p,.42,.62),ps=ramp(p,.5,.88);
    bd.style.opacity=o<1?1:0;hf.forEach((e,i)=>{e.setAttribute('transform','rotate('+f1((i?1:-1)*o*50)+')');e.style.opacity=1-o});
    pt.forEach(e=>{const w=.5+.5*ps;e.setAttribute('transform','rotate('+e.dataset.a+') scale('+f1(w*ps*100)/100+' '+f1(ps*100)/100+')');e.style.opacity=ps>0?1:0});
    ct.setAttribute('transform','scale('+f1(ps*100)/100+')');ct.style.opacity=ps>0?1:0;dr.style.opacity=ramp(p,.85,1);
  };
  set(opt.p||0);return {set};
};

/* a row of watercolour swatches */
const swatches=(svg,cols)=>{sv=31;const w=cols.length*64+16;svg.setAttribute('viewBox','0 0 '+w+' 90');svg.innerHTML=cols.map((c,i)=>{const p=ell(40+i*64,44,24,22,.35);return wash(p,c,'.85',1)+wash(p,'#fff','.25',.5,-6,-6)+line(p,.5,.35,4)}).join('')};


/* a hand-drawn 2x2: awareness (up) by entitlement (right), each quadrant washed in its own colour with a small ink sign */
const mv=(q,dx,dy)=>q.map(([x,y])=>[x+dx,y+dy]);
const matrix=(svg)=>{sv=57;svg.setAttribute('viewBox','0 0 640 600');
  const X0=70,X1=610,Y0=40,Y1=520,CX=340,CY=280,T=(x,y,s,a,f,c,w)=>'<text x="'+x+'" y="'+y+'" font-family="'+f+'" font-size="'+s+'" text-anchor="'+a+'" fill="'+c+'"'+(w?' font-weight="'+w+'"':'')+'>';
  let h='';
  const Q=[{x:205,y:160,c:'#8b45c9',n:'The Side-Eye',n2:'Specialist',d:'Knows it’s wrong. Does it anyway.'},{x:475,y:160,c:'#f2210f',n:'The Aristocrat',d:'Waits for the line to part.',n3:'The Strategist',d3:'Builds her own line.'},{x:205,y:400,c:'#8fae7a',n:'The Lost One',d:'A wrong turn. Mortified.'},{x:475,y:400,c:'#ff4f9a',n:'The Drifter',d:'Never noticed there was a you.'}];
  const ax=(x1,y1,x2,y2)=>{const pts=[];for(let i=0;i<=8;i++){const t=i/8;pts.push([x1+(x2-x1)*t,y1+(y2-y1)*t])}return '<path d="'+cr(jit(pts,1.6),true)+'" '+INK+' stroke-width="1.3" opacity=".85"/><path d="'+cr(jit(pts,2.4),true)+'" '+INK+' stroke-width=".5" opacity=".35"/>'};
  h+=ax(CX,Y1,CX,Y0)+ax(X0,CY,X1,CY);
  h+='<path d="M'+(CX-7)+','+(Y0+12)+'L'+CX+','+(Y0-1)+'L'+(CX+7)+','+(Y0+12)+'M'+(X1-12)+','+(CY-7)+'L'+(X1+1)+','+CY+'L'+(X1-12)+','+(CY+7)+'" '+INK+' stroke-width="1.3"/>';
  const S="'La Belle Aurore',cursive",F="'Cormorant Garamond',Georgia,serif",G="Geist,system-ui,sans-serif";
  h+=T(CX+12,Y0+8,19,'start',S,'#2c3a6b')+'aware of others</text>'+T(CX+12,Y1-4,19,'start',S,'#2c3a6b')+'unaware</text>';
  h+=T(X1,CY+28,19,'end',S,'#2c3a6b')+'more entitled</text>'+T(X0,CY+28,19,'start',S,'#2c3a6b')+'less entitled</text>';
  /* signs */
  const eye=(x,y)=>{const e=[[-22,0],[-8,-10],[8,-10],[22,0],[8,10],[-8,10]];return line(mv(e,x,y),1,.9,0)+wash(ell(x+9,y,6.5,6.5,.1),'#8b45c9','.8',1)+'<circle cx="'+(x+10)+'" cy="'+y+'" r="2.6" fill="#1f1b1d"/>'};
  const crown=(x,y)=>{const c=[[-18,8],[-20,-10],[-9,0],[0,-14],[9,0],[20,-10],[18,8]];return wash(mv(c,x,y),'#f2210f','.75',1)+line(mv(c,x,y),1,.9,0)+'<circle cx="'+x+'" cy="'+(y-15)+'" r="2" fill="#f2210f"/>'};
  const merge=(x,y)=>'<path d="M'+(x-26)+','+(y-6)+'H'+(x+2)+'M'+(x-26)+','+(y+6)+'H'+(x-8)+'Q'+(x-2)+','+(y+6)+' '+(x+2)+','+y+'" '+INK+' stroke-width="1" stroke-dasharray="2 3"/><path d="M'+(x+2)+','+y+'H'+(x+16)+'M'+(x+11)+','+(y-4)+'L'+(x+16)+','+y+'L'+(x+11)+','+(y+4)+'" '+INK+' stroke-width="1"/>';
  const lost=(x,y)=>wash(ell(x,y,15,15,.15),'#8fae7a','.6',1)+'<path d="M'+(x-6)+','+(y-5)+'Q'+(x-6)+','+(y-13)+' '+x+','+(y-13)+'Q'+(x+7)+','+(y-13)+' '+(x+6)+','+(y-6)+'Q'+(x+5)+','+(y-1)+' '+x+','+(y+1)+'V'+(y+5)+'" '+INK+' stroke-width="1.4"/><circle cx="'+x+'" cy="'+(y+10)+'" r="1.6" fill="#1f1b1d"/>';
  const leaf=(x,y)=>{const l=[[-14,4],[-4,-8],[12,-10],[16,-2],[4,8]];return wash(mv(l,x,y),'#ff4f9a','.7',1)+line(mv(l,x,y),.9,.85,0)+'<path d="M'+(x-30)+','+(y+16)+'Q'+(x-20)+','+(y+4)+' '+(x-12)+','+(y+4)+'" '+INK+' stroke-width=".8" stroke-dasharray="2 3"/>'};
  h+=eye(205,105)+crown(475,84)+lost(205,346)+leaf(478,346);
  Q.forEach(q=>{let y=q.n3?q.y-22:q.y-2;h+=T(q.x,y,23,'middle',F,'#1f1b1d',400)+q.n+'</text>';if(q.n2){y+=26;h+=T(q.x,y,23,'middle',F,'#1f1b1d',400)+q.n2+'</text>'}y+=24;h+=T(q.x,y,14.5,'middle',G,'#6f686c')+q.d+'</text>';if(q.n3){y+=40;h+=merge(q.x-86,y-7)+T(q.x+6,y,21,'middle',F,'#1f1b1d',400)+q.n3+'</text>';y+=22;h+=T(q.x,y,14.5,'middle',G,'#6f686c')+q.d3+'</text>'}});
  svg.innerHTML=h};
window.MY={poppy,swatches,matrix,ramp};
})();
