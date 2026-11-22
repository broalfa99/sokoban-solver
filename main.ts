// Push-optimal Sokoban (MIT, broalfa99): boxes never leave their room, so each room gets its own BFS over pushes.
import{mkdirSync as M,readdirSync as R,readFileSync as F,writeFileSync as W}from'node:fs'
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output'
function S(t:string){const r=t.split('\n').filter(x=>x.trim()),w=Math.max(...r.map(x=>x.length))+2,N=w*(r.length+2),D=[-w,w,-1,1],L='udlr',f=new Uint8Array(N),g=new Uint8Array(N),H=new Uint8Array(N),m=new Int32Array(N).fill(-1),B:number[]=[];let P=0,n=0
r.forEach((s,y)=>[...s].forEach((c,x)=>{const i=(y+1)*w+x+1;if(c!='#'&&c!='-')f[i]=2;if('.*+'.includes(c))g[i]=1;if('$*'.includes(c))B.push(i);if('@+'.includes(c))P=i}))
let q=[P];f[P]=1;while(q.length){const p=q.pop()!;for(const d of D)if(f[p+d]==2)f[p+d]=1,q.push(p+d)}
for(let p=P;f[p]==1;p--)H[p]=1;for(let p=P;f[p]==1;p++)H[p]=1
for(let i=0;i<N;i++)if(f[i]==1&&!H[i]&&m[i]<0){q=[i];m[i]=n;while(q.length){const p=q.pop()!;for(const d of D)if(f[p+d]==1&&!H[p+d]&&m[p+d]<0)m[p+d]=n,q.push(p+d)}n++}
// flood: player area from p avoiding boxes b; returns min square, marks area in a
const fl=(p:number,b:Uint8Array,ok:(v:number)=>any,a:Int32Array,s:number)=>{let k=p;q=[p];a[p]=s;while(q.length){const u=q.pop()!;if(u<k)k=u;for(const d of D){const v=u+d;if(ok(v)&&!b[v]&&a[v]!=s)a[v]=s,q.push(v)}}return k}
const A=new Int32Array(N),C=new Int32Array(N),b=new Uint8Array(N),pl:number[]=[];let s=0
for(let k=0;k<n;k++){const c=(v:number)=>m[v]==k,wk=(v:number)=>c(v)||H[v],bs=B.filter(c).sort((x,y)=>x-y);if(!bs.length)continue
const lv=new Uint8Array(N);for(let i=0;i<N;i++)if(c(i)&&g[i])lv[i]=1
for(let ch=1;ch;){ch=0;for(let x=0;x<N;x++)if(c(x)&&!lv[x])for(const d of D)if(lv[x+d]&&wk(x-d)){lv[x]=1;ch=1;break}}
const key=(z:number[],p:number)=>{for(const x of z)b[x]=1;const k=String.fromCharCode(fl(p,b,wk,C,++s),...z);for(const x of z)b[x]=0;return k}
const X=[bs],Y=[P],Z=[-1],V=[0],seen=new Set([key(bs,P)]);let i=0
for(;i<X.length;i++){const z=X[i]!;if(z.every(x=>g[x]))break;for(const x of z)b[x]=1;fl(Y[i]!,b,wk,A,++s);const a=s;for(const x of z)b[x]=0
z.forEach((x,j)=>D.forEach((d,e)=>{const y=x+d;if(A[x-d]!=a||!c(y)||!lv[y]||z.includes(y))return;const u=z.slice();u[j]=y;u.sort((p,o)=>p-o);const h=key(u,x);if(seen.has(h))return;seen.add(h);X.push(u);Y.push(x);Z.push(i);V.push(x*4+e)}))}
if(i==X.length)return'';const o=[];for(;i>0;i=Z[i]!)o.push(V[i]!);pl.push(...o.reverse())}
for(const x of B)b[x]=1;let o='',p=P
for(const v of pl){const x=v>>2,e=v&3,t=x-D[e]!;C.fill(-1);C[p]=p;q=[p];for(let j=0;j<q.length;j++){const u=q[j]!;for(const d of D)if(f[u+d]==1&&!b[u+d]&&C[u+d]<0)C[u+d]=u,q.push(u+d)}
if(C[t]<0)return'';let w2='';for(let u=t;u!=p;u=C[u]!)w2=L[D.indexOf(u-C[u]!)]+w2;o+=w2+L[e]!.toUpperCase();b[x]=0;b[x+D[e]!]=1;p=x}
return o}
for(const d of R(I).sort()){const a=S(F(`${I}/${d}/level.txt`,'utf8'));M(`${O}/${d}`,{recursive:true});W(`${O}/${d}/solution.txt`,a+'\n')}
