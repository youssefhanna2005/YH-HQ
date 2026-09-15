import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
const scene=new THREE.Scene(); scene.background=new THREE.Color(0x05080d); scene.fog=new THREE.Fog(0x05080d,28,70);
const camera=new THREE.PerspectiveCamera(50,innerWidth/innerHeight,.1,150); camera.position.set(25,19,27);
const renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setSize(innerWidth,innerHeight); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.shadowMap.enabled=true; document.body.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0x9adfff,0x101018,1.7)); const sun=new THREE.DirectionalLight(0xffffff,2.2);sun.position.set(12,22,10);sun.castShadow=true;scene.add(sun);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,2,0);controls.enableDamping=true;controls.maxPolarAngle=1.48;controls.minDistance=8;controls.maxDistance=55;
const mat=(c,rough=.65)=>new THREE.MeshStandardMaterial({color:c,roughness:rough,metalness:.15});
function box(x,y,z,w,h,d,c,parent=scene){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m}
box(0,-.25,0,27,.5,20,0x182028); // floor
// exterior partial walls, cut away front for dollhouse reference-photo view
box(-13.25,2.6,0,.5,5.7,20,0x222b33);box(13.25,2.6,0,.5,5.7,20,0x222b33);box(0,2.6,-9.75,27,5.7,.5,0x222b33);
const rooms=[
{name:'Youssef — CEO Office',role:'OWNER / YH HQ',x:-8,z:-5,w:8,d:7,c:0x162d38,body:'Central owner office overlooking HQ operations. Future controls: company overview, employee management and HQ expansion.'},
{name:'Kai Havertz',role:'HEAD OF SPORTS BETTING',x:1,z:-5,w:9,d:7,c:0x142b35,body:'Leads the betting division and coordinates research, matchup analysis and recommended picks.'},
{name:'Pedro Neto',role:'FIXTURE & RESEARCH ANALYST',x:9,z:-5,w:6,d:7,c:0x172a31,body:'Research station for fixtures, player form, opponent history, home/away splits and market information.'},
{name:'Jude Bellingham',role:'RISK & BANKROLL MANAGER',x:-8,z:4,w:8,d:7,c:0x202b2c,body:'Responsible for stake sizing, bankroll protection and risk controls under every suggested bet.'},
{name:'Strategy Room',role:'OPERATIONS',x:1,z:4,w:9,d:7,c:0x1b2731,body:'Shared decision room for reviewing research, picks, risk and performance before execution.'},
{name:'Lounge',role:'YH HQ',x:9,z:4,w:6,d:7,c:0x25282c,body:'Employee lounge and future social area for the expanding AI team.'}
];
const clickable=[];
function room(r){const g=new THREE.Group();g.position.set(r.x,0,r.z);scene.add(g);box(0,.08,0,r.w,.16,r.d,r.c,g);box(-r.w/2,2.2,0,.18,4.4,r.d,0x34414a,g);box(r.w/2,2.2,0,.18,4.4,r.d,0x34414a,g);box(0,2.2,-r.d/2,r.w,4.4,.18,0x34414a,g);
const desk=box(0,.85,-.6,Math.min(3.6,r.w*.55),.18,1.25,0x3b2d25,g);box(0,.43,-.6,.18,.8,1,0x252525,g);
const screen=box(0,1.55,-1.05,2.15,1.15,.1,0x07151d,g);const glow=new THREE.MeshBasicMaterial({color:0x43dcff});const s=new THREE.Mesh(new THREE.PlaneGeometry(1.85,.85),glow);s.position.set(0,1.55,-.99);g.add(s);
const hit=box(0,.02,0,r.w-.5,.05,r.d-.5,r.c,g);hit.userData=r;clickable.push(hit);
const label=document.createElement('canvas');label.width=512;label.height=100;const ctx=label.getContext('2d');ctx.fillStyle='#071019dd';ctx.fillRect(0,0,512,100);ctx.fillStyle='#fff';ctx.font='bold 30px Arial';ctx.textAlign='center';ctx.fillText(r.name,256,48);ctx.fillStyle='#64e6ff';ctx.font='18px Arial';ctx.fillText(r.role,256,77);const tex=new THREE.CanvasTexture(label);const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true}));sp.position.set(0,3.65,-r.d/2+.15);sp.scale.set(5.1,1,1);g.add(sp)}
rooms.forEach(room);
// central HQ logo
const ring=new THREE.Mesh(new THREE.TorusGeometry(2.1,.08,12,64),new THREE.MeshBasicMaterial({color:0x4ce5ff}));ring.rotation.x=Math.PI/2;ring.position.set(0,.08,0);scene.add(ring);
const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();renderer.domElement.addEventListener('click',e=>{mouse.x=e.clientX/innerWidth*2-1;mouse.y=-(e.clientY/innerHeight)*2+1;ray.setFromCamera(mouse,camera);const h=ray.intersectObjects(clickable)[0];if(!h)return;const r=h.object.userData;document.querySelector('#panelTitle').textContent=r.name;document.querySelector('#panelRole').textContent=r.role;document.querySelector('#panelBody').innerHTML=r.body+'<div class="status"><span>Employee status</span><span class="online">● ONLINE</span></div><div class="status"><span>Workspace</span><span>ACTIVE</span></div>';document.querySelector('#panel').classList.remove('hidden')});
document.querySelector('#close').onclick=()=>document.querySelector('#panel').classList.add('hidden');
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
document.querySelector('#loading').remove();function loop(){requestAnimationFrame(loop);controls.update();renderer.render(scene,camera)}loop();