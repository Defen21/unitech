"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ============ TYPES ============
interface AvatarConfig { skin: number; hair: number; hairColor: number; outfit: number; accessory: number }
interface NPC {
  id: number; x: number; y: number; facing: "up"|"down"|"left"|"right";
  name: string; title: string; classLabel: string; level: number; rarity: string;
  matchRate: number; skills: string[]; questLog: string;
  hairColor: number; outfit: number; skin: number;
}

// ============ CONSTANTS ============
const SKINS = ["#FFD5B8","#F4B183","#D08B5B","#AE5D29","#6B3E26"];
const HAIR_COLORS = ["#1a1a2e","#5C3317","#C49A3C","#D4451A","#8B5CF6","#EC4899"];
const OUTFIT_COLORS = ["#3B82F6","#EF4444","#22C55E","#8B5CF6","#F59E0B","#EC4899","#14B8A6","#1a1a2e"];
const HAIR_STYLES = ["Spiky","Short","Long","Bun"];
const ACCESSORIES = ["None","Glasses","Headband","Earring"];
const TILE = 32, MAP_W = 24, MAP_H = 18;
const VIEW_W = 23, VIEW_H = 15;
const CANVAS_W = VIEW_W * TILE, CANVAS_H = VIEW_H * TILE;
const MOVE_SPEED = 4.5; // tiles per second (free movement)
const CHAR_W = 0.45, CHAR_H = 0.45; // character collision box (smaller than tile for tight spaces)

// 0=grass 1=path 2=tree 3=water 4=building 5=bench 6=flower 7=fence 8=bush
const MAP: number[][] = [
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [7,0,6,0,0,1,1,1,1,1,1,4,4,4,4,1,1,1,1,0,0,6,0,7],
  [7,0,0,0,0,1,0,0,0,0,1,4,4,4,4,1,0,0,0,0,0,0,0,7],
  [7,0,0,6,0,1,0,0,0,0,1,1,1,1,1,1,0,0,6,0,0,0,0,7],
  [7,0,0,0,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,7],
  [7,1,1,1,1,1,0,0,0,6,0,0,5,0,5,0,0,6,0,1,1,1,1,7],
  [7,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,7],
  [7,0,0,6,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,6,0,7],
  [7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7],
  [7,0,2,0,0,0,0,0,6,0,0,0,0,0,0,0,6,0,0,0,0,2,0,7],
  [7,0,0,0,0,6,0,0,0,0,0,5,0,0,5,0,0,0,0,6,0,0,0,7],
  [7,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,7],
  [7,0,0,0,0,0,0,1,0,0,0,3,3,3,0,0,1,0,0,0,0,0,0,7],
  [7,0,2,0,6,0,0,1,0,3,3,3,3,3,3,0,1,0,0,6,0,2,0,7],
  [7,0,0,0,0,0,0,1,0,0,3,3,3,3,0,0,1,0,0,0,0,0,0,7],
  [7,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,7],
  [7,0,6,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,6,0,7],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
];

const NPCS: NPC[] = [
  { id:1,x:9,y:2,facing:"down",name:"Rizky",title:"The Backend Guardian",classLabel:"Code Knight",level:42,rarity:"Legendary",matchRate:95,skills:["Go Slash","Python Strike","Docker Shield"],questLog:"Seeking a team for Hackathon Nasional 2025!",hairColor:0,outfit:0,skin:0 },
  { id:2,x:18,y:4,facing:"left",name:"Putri",title:"The Pixel Enchantress",classLabel:"Pixel Mage",level:38,rarity:"Epic",matchRate:88,skills:["Figma Blast","Research Spell","Prototype Charm"],questLog:"Looking for a dev team to design amazing UIs!",hairColor:2,outfit:5,skin:0 },
  { id:3,x:4,y:9,facing:"right",name:"Dimas",title:"The Data Oracle",classLabel:"Data Wizard",level:45,rarity:"Legendary",matchRate:85,skills:["Python Analytics","ML Storm","SQL Query"],questLog:"Need a frontend + designer for data viz competition!",hairColor:0,outfit:3,skin:1 },
  { id:4,x:20,y:10,facing:"left",name:"Anisa",title:"The Quest Strategist",classLabel:"Quest Planner",level:36,rarity:"Epic",matchRate:82,skills:["Canvas Map","Pitch Deck Buff","Finance Aura"],questLog:"Building the ultimate business plan team!",hairColor:1,outfit:4,skin:0 },
  { id:5,x:14,y:14,facing:"up",name:"Fajar",title:"The Frontend Ranger",classLabel:"Craft Ranger",level:39,rarity:"Rare",matchRate:79,skills:["React Arrow","TypeScript Bolt","Tailwind Wind"],questLog:"Fast & pixel-perfect UIs, let's team up!",hairColor:0,outfit:2,skin:2 },
  { id:6,x:3,y:15,facing:"right",name:"Lina",title:"The Mobile Shadow",classLabel:"Shadow Dev",level:41,rarity:"Epic",matchRate:76,skills:["Kotlin Dagger","Flutter Dash","Firebase Trap"],questLog:"Mobile dev specialist seeking competition squad!",hairColor:3,outfit:7,skin:1 },
];

// ============ COLLISION ============
function isBlocked(x: number, y: number): boolean {
  const hw = CHAR_W / 2, hh = CHAR_H / 2;
  const checks = [
    [x - hw, y - hh], [x + hw, y - hh],
    [x - hw, y + hh], [x + hw, y + hh],
    [x, y - hh], [x, y + hh],
    [x - hw, y], [x + hw, y],
  ];
  for (const [cx, cy] of checks) {
    const tx = Math.floor(cx), ty = Math.floor(cy);
    if (tx < 0 || tx >= MAP_W || ty < 0 || ty >= MAP_H) return true;
    const t = MAP[ty]?.[tx];
    if (t === 2 || t === 3 || t === 4 || t === 7 || t === 8) return true;
  }
  return false;
}

// ============ DRAW HELPERS ============
function drawChar(ctx: CanvasRenderingContext2D, px: number, py: number, skin: number, hairColor: number, outfit: number, facing: string, walkT: number) {
  const sk = SKINS[skin], hc = HAIR_COLORS[hairColor], oc = OUTFIT_COLORS[outfit], s = TILE/8;
  ctx.fillStyle = "rgba(0,0,0,0.18)"; ctx.fillRect(px+s, py+s*7.2, s*6, s*0.8);
  const legOff = walkT > 0 ? Math.sin(walkT * 10) * s * 0.7 : 0;
  ctx.fillStyle = "#374151";
  ctx.fillRect(px+s*2, py+s*5.5+legOff, s*1.5, s*2);
  ctx.fillRect(px+s*4.5, py+s*5.5-legOff, s*1.5, s*2);
  ctx.fillStyle = oc; ctx.fillRect(px+s*1.5, py+s*3, s*5, s*3);
  ctx.fillStyle = oc+"cc"; ctx.fillRect(px+s*2, py+s*3.5, s*4, s*2);
  const armOff = walkT > 0 ? Math.sin(walkT * 10) * s * 0.6 : 0;
  ctx.fillStyle = sk;
  ctx.fillRect(px+s*0.3, py+s*3.5+armOff, s*1.3, s*2);
  ctx.fillRect(px+s*6.3, py+s*3.5-armOff, s*1.3, s*2);
  ctx.fillStyle = sk; ctx.fillRect(px+s*2, py+s*0.5, s*4, s*3);
  ctx.fillStyle = hc; ctx.fillRect(px+s*1.5, py, s*5, s*1.5);
  if (facing==="left") ctx.fillRect(px+s*1.5,py+s*0.5,s*1,s*2);
  else if (facing==="right") ctx.fillRect(px+s*5.5,py+s*0.5,s*1,s*2);
  if (facing!=="up") {
    ctx.fillStyle="#fff"; const ex=facing==="left"?-s*0.5:facing==="right"?s*0.5:0;
    ctx.fillRect(px+s*2.5+ex,py+s*1.5,s,s*0.8); ctx.fillRect(px+s*4.5+ex,py+s*1.5,s,s*0.8);
    ctx.fillStyle="#1a1a2e"; ctx.fillRect(px+s*2.8+ex,py+s*1.7,s*0.5,s*0.5); ctx.fillRect(px+s*4.8+ex,py+s*1.7,s*0.5,s*0.5);
  }
}

function drawTile(ctx: CanvasRenderingContext2D, t: number, px: number, py: number, mx: number, my: number, time: number) {
  const c1 = ["#4a7c3f","#c4a66a","#2d5a27","#3b82c4","#8b6f47","#8b6844","#e8596e","#5a4a3a","#3d6b35"][t]||"#4a7c3f";
  ctx.fillStyle = c1; ctx.fillRect(px,py,TILE+1,TILE+1);
  if (t===0||t===6) { ctx.fillStyle=["#5a8c4f","#b8965a","#3d6b35","#4a92d4","#7b5f37","#7b5834","#d84960","#4a3a2a","#4d7b45"][t]||"#5a8c4f"; if((mx+my)%3===0)ctx.fillRect(px+4,py+4,3,3); if((mx*7+my*3)%5===0)ctx.fillRect(px+18,py+12,2,4); }
  if (t===6) { ctx.fillStyle="#FFD700"; ctx.fillRect(px+12,py+10,3,3); ctx.fillRect(px+18,py+16,3,3); ctx.fillStyle="#FF69B4"; ctx.fillRect(px+8,py+20,3,3); }
  if (t===1) { ctx.fillStyle="#b8965a"; if((mx+my)%2===0) ctx.fillRect(px+2,py+2,TILE-4,TILE-4); }
  if (t===2) { ctx.fillStyle="#5C3317"; ctx.fillRect(px+12,py+16,8,16); ctx.fillStyle="#2d5a27"; ctx.fillRect(px+4,py+2,24,16); ctx.fillStyle="#3d6b35"; ctx.fillRect(px+8,py+4,16,10); }
  if (t===3) { ctx.fillStyle="#4a92d4"; ctx.fillRect(px+(time/400%1)*6,py+8,10,2); ctx.fillRect(px+14-(time/400%1)*6,py+20,10,2); }
  if (t===4) { ctx.fillStyle="#6b5535"; ctx.fillRect(px,py,TILE,TILE); ctx.fillStyle="#8b7555"; ctx.fillRect(px+2,py+2,TILE-4,TILE-4); ctx.fillStyle="#5b4525"; ctx.fillRect(px,py,TILE,4); }
  if (t===5) { ctx.fillStyle="#8b6844"; ctx.fillRect(px+4,py+12,24,8); ctx.fillStyle="#6b4824"; ctx.fillRect(px+6,py+20,4,8); ctx.fillRect(px+22,py+20,4,8); }
  if (t===7) { ctx.fillStyle="#4a3a2a"; ctx.fillRect(px,py,TILE,TILE); ctx.fillStyle="#5a4a3a"; ctx.fillRect(px+4,py+4,8,8); ctx.fillRect(px+20,py+20,8,8); }
  if (t===8) { ctx.fillStyle="#3d6b35"; ctx.fillRect(px+2,py+8,28,20); ctx.fillStyle="#4d7b45"; ctx.fillRect(px+6,py+10,20,14); }
}

// ============ AVATAR PREVIEW (CSS) ============
function AvatarPreview({ config, size = 128 }: { config: AvatarConfig; size?: number }) {
  const s = size/8;
  return (
    <div className="relative" style={{ width:size, height:size, imageRendering:"pixelated" }}>
      <div className="absolute rounded-full" style={{ left:s, top:s*7.2, width:s*6, height:s*0.8, background:"rgba(0,0,0,0.2)" }}/>
      <div className="absolute" style={{ left:s*2, top:s*5.5, width:s*1.5, height:s*2, background:"#374151" }}/>
      <div className="absolute" style={{ left:s*4.5, top:s*5.5, width:s*1.5, height:s*2, background:"#374151" }}/>
      <div className="absolute" style={{ left:s*1.5, top:s*3, width:s*5, height:s*3, background:OUTFIT_COLORS[config.outfit] }}/>
      <div className="absolute" style={{ left:s*0.3, top:s*3.5, width:s*1.4, height:s*2, background:SKINS[config.skin] }}/>
      <div className="absolute" style={{ left:s*6.3, top:s*3.5, width:s*1.4, height:s*2, background:SKINS[config.skin] }}/>
      <div className="absolute" style={{ left:s*2, top:s*0.5, width:s*4, height:s*3, background:SKINS[config.skin] }}/>
      <div className="absolute" style={{ left:s*1.5, top:0, width:s*5, height:s*1.5, background:HAIR_COLORS[config.hairColor] }}/>
      {config.hair===2&&<><div className="absolute" style={{ left:s*1.5, top:s, width:s*1.2, height:s*3, background:HAIR_COLORS[config.hairColor] }}/><div className="absolute" style={{ left:s*5.3, top:s, width:s*1.2, height:s*3, background:HAIR_COLORS[config.hairColor] }}/></>}
      {config.hair===3&&<div className="absolute rounded-full" style={{ left:s*2.5, top:-s*0.8, width:s*3, height:s*2, background:HAIR_COLORS[config.hairColor] }}/>}
      {config.hair===0&&<><div className="absolute" style={{ left:s*2, top:-s*0.3, width:s, height:s, background:HAIR_COLORS[config.hairColor] }}/><div className="absolute" style={{ left:s*3.5, top:-s*0.5, width:s, height:s*1.2, background:HAIR_COLORS[config.hairColor] }}/><div className="absolute" style={{ left:s*5, top:-s*0.2, width:s, height:s*0.9, background:HAIR_COLORS[config.hairColor] }}/></>}
      <div className="absolute bg-white" style={{ left:s*2.5, top:s*1.5, width:s*0.9, height:s*0.8 }}/><div className="absolute bg-white" style={{ left:s*4.5, top:s*1.5, width:s*0.9, height:s*0.8 }}/>
      <div className="absolute" style={{ left:s*2.8, top:s*1.7, width:s*0.4, height:s*0.4, background:"#1a1a2e" }}/><div className="absolute" style={{ left:s*4.8, top:s*1.7, width:s*0.4, height:s*0.4, background:"#1a1a2e" }}/>
      <div className="absolute" style={{ left:s*3.5, top:s*2.5, width:s, height:s*0.3, background:"#c44" }}/>
      {config.accessory===1&&<><div className="absolute border-2 border-gray-800 rounded-sm" style={{ left:s*2, top:s*1.3, width:s*1.5, height:s*1.2 }}/><div className="absolute border-2 border-gray-800 rounded-sm" style={{ left:s*4.2, top:s*1.3, width:s*1.5, height:s*1.2 }}/><div className="absolute bg-gray-800" style={{ left:s*3.5, top:s*1.7, width:s*0.7, height:s*0.2 }}/></>}
      {config.accessory===2&&<div className="absolute" style={{ left:s*1.5, top:s*0.8, width:s*5, height:s*0.5, background:"#EF4444" }}/>}
      {config.accessory===3&&<><div className="absolute rounded-full bg-yellow-400" style={{ left:s, top:s*2, width:s*0.6, height:s*0.6 }}/><div className="absolute rounded-full bg-yellow-400" style={{ left:s*6.4, top:s*2, width:s*0.6, height:s*0.6 }}/></>}
    </div>
  );
}

// ============ CUSTOMIZER ============
function AvatarCustomizer({ config, setConfig, onEnter }: { config: AvatarConfig; setConfig: (c: AvatarConfig) => void; onEnter: () => void }) {
  const u = (k: keyof AvatarConfig, v: number) => setConfig({ ...config, [k]: v });
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 pixel-grid-bg">
      <div className="text-center mb-8">
        <p className="font-pixel text-[10px] text-yellow-400 tracking-widest mb-2 pixel-blink">CREATE YOUR HERO</p>
        <h1 className="font-pixel text-2xl text-white">AVATAR STUDIO</h1>
        <p className="font-pixel text-[8px] text-gray-500 mt-2">Design your hero before entering the world</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
        <div className="bg-gray-800 pixel-border rounded-sm p-8 flex flex-col items-center">
          <div className="bg-gray-700 border-4 border-gray-600 rounded-sm p-6 mb-4"><AvatarPreview config={config} size={160} /></div>
          <p className="font-pixel text-[8px] text-cyan-400 mb-1">YOUR HERO</p>
        </div>
        <div className="bg-gray-800 pixel-border rounded-sm p-6 space-y-5 min-w-[320px]">
          <div><p className="font-pixel text-[8px] text-yellow-400 mb-2">SKIN TONE</p><div className="flex gap-2">{SKINS.map((c,i)=><button key={i} onClick={()=>u("skin",i)} className={`w-10 h-10 rounded-sm border-4 transition-all ${config.skin===i?"border-cyan-400 scale-110":"border-gray-600 hover:border-gray-400"}`} style={{background:c}}/>)}</div></div>
          <div><p className="font-pixel text-[8px] text-yellow-400 mb-2">HAIR STYLE</p><div className="flex gap-2">{HAIR_STYLES.map((h,i)=><button key={h} onClick={()=>u("hair",i)} className={`font-pixel text-[7px] px-3 py-2 border-3 rounded-sm transition-all ${config.hair===i?"bg-cyan-600 text-white border-cyan-400":"bg-gray-700 text-gray-400 border-gray-600 hover:border-gray-400"}`}>{h}</button>)}</div></div>
          <div><p className="font-pixel text-[8px] text-yellow-400 mb-2">HAIR COLOR</p><div className="flex gap-2">{HAIR_COLORS.map((c,i)=><button key={i} onClick={()=>u("hairColor",i)} className={`w-10 h-10 rounded-sm border-4 transition-all ${config.hairColor===i?"border-cyan-400 scale-110":"border-gray-600 hover:border-gray-400"}`} style={{background:c}}/>)}</div></div>
          <div><p className="font-pixel text-[8px] text-yellow-400 mb-2">OUTFIT COLOR</p><div className="flex gap-2 flex-wrap">{OUTFIT_COLORS.map((c,i)=><button key={i} onClick={()=>u("outfit",i)} className={`w-10 h-10 rounded-sm border-4 transition-all ${config.outfit===i?"border-cyan-400 scale-110":"border-gray-600 hover:border-gray-400"}`} style={{background:c}}/>)}</div></div>
          <div><p className="font-pixel text-[8px] text-yellow-400 mb-2">ACCESSORY</p><div className="flex gap-2 flex-wrap">{ACCESSORIES.map((a,i)=><button key={a} onClick={()=>u("accessory",i)} className={`font-pixel text-[7px] px-3 py-2 border-3 rounded-sm transition-all ${config.accessory===i?"bg-cyan-600 text-white border-cyan-400":"bg-gray-700 text-gray-400 border-gray-600 hover:border-gray-400"}`}>{a}</button>)}</div></div>
          <button onClick={onEnter} className="w-full font-pixel text-[10px] py-4 pixel-btn bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 rounded-sm mt-4 hover:from-cyan-500 hover:to-blue-500">ENTER WORLD →</button>
        </div>
      </div>
    </div>
  );
}

// ============ NPC DIALOG ============
function NpcDialog({ npc, onRecruit, onClose, recruited }: { npc: NPC; onRecruit: () => void; onClose: () => void; recruited: boolean }) {
  const rc = npc.rarity==="Legendary"?"text-yellow-400":npc.rarity==="Epic"?"text-purple-400":"text-blue-400";
  return (
    <div className="absolute inset-0 flex items-end justify-center z-20 p-4 pointer-events-none">
      <div className="pointer-events-auto bg-gray-900 pixel-border rounded-sm w-full max-w-lg">
        <div className="p-4 border-b-2 border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gray-800 border-3 border-gray-600 rounded-sm flex items-center justify-center"><AvatarPreview config={{skin:npc.skin,hair:1,hairColor:npc.hairColor,outfit:npc.outfit,accessory:0}} size={48}/></div>
            <div><p className="font-pixel text-sm text-white">{npc.name}</p><p className={`font-pixel text-[8px] ${rc}`}>Lv.{npc.level} {npc.classLabel} • {npc.rarity}</p></div>
            <span className={`ml-auto font-pixel text-[8px] px-2 py-1 border-2 border-gray-600 rounded-sm ${rc}`}>{npc.matchRate}% MATCH</span>
          </div>
          <p className="font-pixel text-[7px] text-cyan-400 italic">&quot;{npc.title}&quot;</p>
        </div>
        <div className="p-4 space-y-2">
          <p className="font-pixel text-[8px] text-yellow-400">ABILITIES:</p>
          <div className="flex flex-wrap gap-1.5">{npc.skills.map(s=><span key={s} className="font-pixel text-[7px] px-2 py-1 bg-gray-800 border-2 border-gray-700 rounded-sm text-cyan-300">✦ {s}</span>)}</div>
          <p className="font-pixel text-[7px] text-yellow-500 mt-2">💬 &quot;{npc.questLog}&quot;</p>
        </div>
        <div className="p-3 border-t-2 border-gray-700 flex gap-2">
          {recruited?<button disabled className="flex-1 font-pixel text-[8px] py-3 bg-gray-800 text-green-400 border-3 border-green-700 rounded-sm">✓ IN YOUR PARTY</button>
          :<button onClick={onRecruit} className="flex-1 font-pixel text-[8px] py-3 pixel-btn bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 rounded-sm">⚔️ RECRUIT!</button>}
          <button onClick={onClose} className="font-pixel text-[8px] px-5 py-3 pixel-btn bg-gray-700 text-gray-300 border-gray-600 rounded-sm">✕</button>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN COMPONENT ============
export default function UniMatchPage() {
  const [phase, setPhase] = useState<"custom" | "select" | "world" | "swipe">("custom");
  const [avatar, setAvatar] = useState<AvatarConfig>({ skin: 0, hair: 0, hairColor: 0, outfit: 0, accessory: 0 });
  const [talkingNpc, setTalkingNpc] = useState<NPC | null>(null);
  const [party, setParty] = useState<number[]>([]);
  const [showIntro, setShowIntro] = useState(false);
  const [, forceUpdate] = useState(0);

  // Swipe mode states
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [lastAction, setLastAction] = useState<"like" | "pass" | null>(null);
  const [matchNpc, setMatchNpc] = useState<NPC | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Set<string>>(new Set());

  // FREE MOVEMENT: float position, no grid snapping
  const posRef = useRef({ x: 11.5, y: 7.5 });
  const facingRef = useRef<"up" | "down" | "left" | "right">("down");
  const walkTRef = useRef(0);
  const movingRef = useRef(false);
  const partyRef = useRef<number[]>([]);
  const avatarRef = useRef(avatar);
  const talkingRef = useRef(false);
  const animRef = useRef(0);

  useEffect(() => { partyRef.current = party; }, [party]);
  useEffect(() => { avatarRef.current = avatar; }, [avatar]);
  useEffect(() => { talkingRef.current = !!talkingNpc; }, [talkingNpc]);

  const enterSelection = () => { setPhase("select"); };

  // Find nearest NPC within range
  const findNearbyNpc = useCallback((): NPC | null => {
    const p = posRef.current;
    let closest: NPC | null = null, minDist = 1.8;
    const f = facingRef.current;
    const dirs: Record<string, { x: number; y: number }> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
    const d = dirs[f];
    for (const npc of NPCS) {
      const dx = npc.x + 0.5 - p.x, dy = npc.y + 0.5 - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Check if NPC is roughly in the facing direction
      const dot = dx * d.x + dy * d.y;
      if (dist < minDist && dot > -0.3) { closest = npc; minDist = dist; }
    }
    return closest;
  }, []);

  const tryInteract = useCallback(() => {
    const npc = findNearbyNpc();
    if (npc) setTalkingNpc(npc);
  }, [findNearbyNpc]);

  // Keyboard listeners
  useEffect(() => {
    if (phase !== "world") return;
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
      if (e.key.toLowerCase() === "e") tryInteract();
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, [phase, tryInteract]);

  // ===== MAIN GAME LOOP: FREE MOVEMENT =====
  useEffect(() => {
    if (phase !== "world") return;
    let lastTime = 0;

    const loop = (time: number) => {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
      lastTime = time;

      // === FREE MOVEMENT ===
      if (!talkingRef.current) {
        const keys = keysRef.current;
        let dx = 0, dy = 0;
        if (keys.has("w") || keys.has("arrowup")) { dy = -1; facingRef.current = "up"; }
        if (keys.has("s") || keys.has("arrowdown")) { dy = 1; facingRef.current = "down"; }
        if (keys.has("a") || keys.has("arrowleft")) { dx = -1; facingRef.current = "left"; }
        if (keys.has("d") || keys.has("arrowright")) { dx = 1; facingRef.current = "right"; }

        // Normalize diagonal
        if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }

        const isMoving = dx !== 0 || dy !== 0;
        movingRef.current = isMoving;
        if (isMoving) walkTRef.current += dt;

        const p = posRef.current;
        const spd = MOVE_SPEED * dt;

        // Try X axis independently (allows wall sliding)
        if (dx !== 0) {
          const nx = p.x + dx * spd;
          if (!isBlocked(nx, p.y)) p.x = nx;
        }
        // Try Y axis independently
        if (dy !== 0) {
          const ny = p.y + dy * spd;
          if (!isBlocked(p.x, ny)) p.y = ny;
        }
      } else {
        movingRef.current = false;
      }

      // === RENDER ===
      const canvas = canvasRef.current;
      if (!canvas) { animRef.current = requestAnimationFrame(loop); return; }
      const ctx = canvas.getContext("2d");
      if (!ctx) { animRef.current = requestAnimationFrame(loop); return; }
      ctx.imageSmoothingEnabled = false;

      const p = posRef.current;
      // Smooth camera
      const camX = Math.max(0, Math.min(p.x - VIEW_W / 2, MAP_W - VIEW_W));
      const camY = Math.max(0, Math.min(p.y - VIEW_H / 2, MAP_H - VIEW_H));

      // Draw tiles
      const startX = Math.floor(camX), startY = Math.floor(camY);
      const endX = Math.min(startX + VIEW_W + 2, MAP_W);
      const endY = Math.min(startY + VIEW_H + 2, MAP_H);
      for (let my = Math.max(0, startY); my < endY; my++) {
        for (let mx = Math.max(0, startX); mx < endX; mx++) {
          const t = MAP[my]?.[mx] ?? 7;
          const px = (mx - camX) * TILE, py = (my - camY) * TILE;
          drawTile(ctx, t, px, py, mx, my, time);
        }
      }

      // Draw NPCs
      NPCS.forEach(npc => {
        const sx = (npc.x - camX) * TILE, sy = (npc.y - camY) * TILE;
        if (sx < -TILE * 2 || sx > CANVAS_W + TILE || sy < -TILE * 2 || sy > CANVAS_H + TILE) return;
        drawChar(ctx, sx, sy, npc.skin, npc.hairColor, npc.outfit, npc.facing, 0);
        ctx.fillStyle = "rgba(0,0,0,0.75)"; ctx.fillRect(sx - 12, sy - 12, TILE + 24, 12);
        ctx.font = "bold 8px monospace"; ctx.fillStyle = partyRef.current.includes(npc.id) ? "#4ade80" : "#fff";
        ctx.textAlign = "center"; ctx.fillText(npc.name, sx + TILE / 2, sy - 3);
        // Interaction hint
        const ndx = npc.x + 0.5 - p.x, ndy = npc.y + 0.5 - p.y;
        const dist = Math.sqrt(ndx * ndx + ndy * ndy);
        if (dist < 1.8) {
          const bob = Math.sin(time / 300) * 2;
          ctx.fillStyle = "#FFD700"; ctx.font = "bold 9px monospace";
          ctx.fillText("[E]", sx + TILE / 2, sy - 16 + bob);
        }
      });

      // Draw player (FREE position, no grid)
      const plx = (p.x - camX) * TILE - TILE / 2;
      const ply = (p.y - camY) * TILE - TILE / 2;
      drawChar(ctx, plx, ply, avatarRef.current.skin, avatarRef.current.hairColor, avatarRef.current.outfit, facingRef.current, movingRef.current ? walkTRef.current : 0);
      // Arrow indicator
      const arrowBob = Math.sin(time / 250) * 2;
      ctx.fillStyle = "#22d3ee";
      ctx.beginPath(); ctx.moveTo(plx + TILE / 2, ply - 5 + arrowBob); ctx.lineTo(plx + TILE / 2 - 5, ply - 12 + arrowBob); ctx.lineTo(plx + TILE / 2 + 5, ply - 12 + arrowBob); ctx.fill();

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase]);

  // Mobile controls (also free movement)
  const mobileDir = useRef<string | null>(null);
  const mobileInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startMobileMove = (dir: string) => {
    const keys: Record<string, string[]> = { up: ["w"], down: ["s"], left: ["a"], right: ["d"] };
    keys[dir]?.forEach(k => keysRef.current.add(k));
    mobileDir.current = dir;
  };
  const stopMobileMove = () => {
    keysRef.current.clear();
    mobileDir.current = null;
  };

  const handleSwipe = (action: "like" | "pass") => {
    setLastAction(action);
    const currentNpc = NPCS[swipeIndex];
    setTimeout(() => {
      setLastAction(null);
      if (action === "like" && currentNpc) {
        if (!party.includes(currentNpc.id) && party.length < 5) {
          setParty(prev => [...prev, currentNpc.id]);
          if (currentNpc.matchRate >= 80) {
            setMatchNpc(currentNpc);
          }
        }
      }
      setSwipeIndex(prev => prev + 1);
    }, 300);
  };

  const resetSwiper = () => {
    setSwipeIndex(0);
    setParty([]);
  };

  if (phase === "custom") return <AvatarCustomizer config={avatar} setConfig={setAvatar} onEnter={enterSelection} />;

  if (phase === "select") {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 pixel-grid-bg animate-fade-in">
        <div className="text-center mb-10">
          <p className="font-pixel text-[8px] text-cyan-400 tracking-widest mb-2">CHOOSE YOUR PATH</p>
          <h1 className="font-pixel text-xl text-white">SELECT PLAY MODE</h1>
          <p className="font-pixel text-[7px] text-gray-500 mt-2">How do you want to find your team squad?</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 max-w-2xl w-full">
          {/* Card 1: RPG 2D Game */}
          <div className="flex-1 bg-gray-800 border-4 border-gray-700 hover:border-cyan-400 rounded-sm p-6 flex flex-col items-center justify-between text-center transition-all group hover:scale-[1.02]">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-700 border-4 border-gray-600 rounded-sm flex items-center justify-center text-3xl mb-4 group-hover:bg-cyan-950 transition-colors">
                🎮
              </div>
              <h2 className="font-pixel text-sm text-white mb-2">RPG Game Mode</h2>
              <p className="font-pixel text-[7px] text-gray-400 leading-relaxed">
                Explore the campus 2D pixel world map freely, walk up to potential candidates, chat, inspect stats, and recruit them into your party!
              </p>
            </div>
            <button
              onClick={() => {
                setPhase("world");
                setShowIntro(true);
                setTimeout(() => setShowIntro(false), 3000);
              }}
              className="w-full mt-6 font-pixel text-[8px] py-3 pixel-btn bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-400 rounded-sm"
            >
              Enter RPG World
            </button>
          </div>

          {/* Card 2: Swipe Dating App */}
          <div className="flex-1 bg-gray-800 border-4 border-gray-700 hover:border-pink-500 rounded-sm p-6 flex flex-col items-center justify-between text-center transition-all group hover:scale-[1.02]">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-700 border-4 border-gray-600 rounded-sm flex items-center justify-center text-3xl mb-4 group-hover:bg-pink-950 transition-colors">
                🔥
              </div>
              <h2 className="font-pixel text-sm text-white mb-2">Swiper Mode</h2>
              <p className="font-pixel text-[7px] text-gray-400 leading-relaxed">
                A modern swipe layout. Go through candidate profile cards tinder-style, view their tech stacks, like or pass to build your ultimate squad instantly!
              </p>
            </div>
            <button
              onClick={() => {
                setPhase("swipe");
                setSwipeIndex(0);
              }}
              className="w-full mt-6 font-pixel text-[8px] py-3 pixel-btn bg-pink-600 hover:bg-pink-500 text-white border-pink-400 rounded-sm"
            >
              Start Swiping
            </button>
          </div>
        </div>

        <button
          onClick={() => setPhase("custom")}
          className="font-pixel text-[7px] mt-8 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 border-2 border-gray-700 rounded-sm"
        >
          Edit Hero Avatar
        </button>
      </div>
    );
  }

  if (phase === "swipe") {
    const currentNpc = NPCS[swipeIndex];
    const isCompleted = swipeIndex >= NPCS.length;

    return (
      <div className="space-y-4 animate-fade-in pixel-grid-bg min-h-screen pb-12">
        {/* Header */}
        <div className="bg-gray-900 pixel-border rounded-sm p-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="font-pixel text-[8px] text-pink-500">🔥 UNIMATCH SWIPER</p>
            <p className="font-pixel text-[7px] text-gray-500">Swipe right to recruit • Swipe left to pass</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="font-pixel text-[8px] text-cyan-400">PARTY:</span>
              {Array.from({ length: 5 }).map((_, i) => {
                const memberId = party[i];
                const member = NPCS.find(n => n.id === memberId);
                return (
                  <div 
                    key={i} 
                    className={`w-8 h-8 border-2 rounded-sm flex items-center justify-center relative ${
                      member ? "border-green-500 bg-gray-800" : "border-gray-700 bg-gray-800"
                    }`}
                  >
                    {member ? (
                      <AvatarPreview 
                        config={{ skin: member.skin, hair: 1, hairColor: member.hairColor, outfit: member.outfit, accessory: 0 }} 
                        size={28} 
                      />
                    ) : (
                      <span className="font-pixel text-[8px] text-gray-600">?</span>
                    )}
                  </div>
                );
              })}
            </div>
            <button 
              onClick={() => setPhase("select")} 
              className="font-pixel text-[7px] px-3 py-1.5 bg-gray-800 text-gray-400 border-2 border-gray-700 rounded-sm hover:border-gray-500"
            >
              CHANGE MODE
            </button>
          </div>
        </div>

        {/* Swipe Card Deck Container */}
        <div className="flex flex-col items-center justify-center py-6 min-h-[450px]">
          {isCompleted ? (
            <div className="bg-gray-900 border-4 border-gray-700 rounded-sm p-8 max-w-sm w-full text-center space-y-6">
              <span className="text-4xl">🏁</span>
              <h2 className="font-pixel text-base text-white">DECK COMPLETED</h2>
              <p className="font-pixel text-[8px] text-gray-400 leading-relaxed">
                You have swiped through all available candidates.
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={resetSwiper} 
                  className="flex-1 font-pixel text-[8px] py-3 pixel-btn bg-pink-600 text-white border-pink-400 rounded-sm"
                >
                  Start Over
                </button>
                <button 
                  onClick={() => setPhase("select")} 
                  className="flex-1 font-pixel text-[8px] py-3 pixel-btn bg-gray-800 text-gray-300 border-gray-600 rounded-sm"
                >
                  Back
                </button>
              </div>
            </div>
          ) : (
            <div className="relative w-full max-w-sm h-[400px] flex justify-center">
              {/* Tinder Card */}
              <div 
                className={`w-full bg-gray-900 border-4 rounded-sm p-6 flex flex-col justify-between transition-all duration-300 ${
                  lastAction === "like" 
                    ? "translate-x-full rotate-12 opacity-0 border-green-500" 
                    : lastAction === "pass" 
                    ? "-translate-x-full -rotate-12 opacity-0 border-red-500" 
                    : "border-gray-700"
                }`}
              >
                {/* Rarity & Ratios */}
                <div className="flex justify-between items-center mb-4">
                  <span className={`font-pixel text-[7px] px-2 py-1 bg-gray-800 border border-gray-600 rounded-sm ${
                    currentNpc.rarity === "Legendary" ? "text-yellow-400" : currentNpc.rarity === "Epic" ? "text-purple-400" : "text-blue-400"
                  }`}>
                    {currentNpc.rarity.toUpperCase()}
                  </span>
                  <span className="font-pixel text-[7px] text-green-400 bg-green-950/40 px-2 py-1 border border-green-800 rounded-sm">
                    {currentNpc.matchRate}% MATCH
                  </span>
                </div>

                {/* Avatar Display */}
                <div className="flex justify-center mb-4 py-4 bg-gray-800/40 border border-gray-700 rounded-sm">
                  <AvatarPreview 
                    config={{ skin: currentNpc.skin, hair: 1, hairColor: currentNpc.hairColor, outfit: currentNpc.outfit, accessory: 0 }} 
                    size={112} 
                  />
                </div>

                {/* Profile info */}
                <div className="text-center space-y-1">
                  <h3 className="font-pixel text-sm text-white">{currentNpc.name}</h3>
                  <p className="font-pixel text-[8px] text-cyan-400">Lv.{currentNpc.level} {currentNpc.classLabel}</p>
                  <p className="font-pixel text-[7px] text-gray-400 italic mt-2">&quot;{currentNpc.questLog}&quot;</p>
                </div>

                {/* Skills */}
                <div className="mt-4 flex flex-wrap gap-1 justify-center">
                  {currentNpc.skills.slice(0, 2).map(skill => (
                    <span key={skill} className="font-pixel text-[6px] px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded-sm text-cyan-300">
                      ✦ {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Swipe Buttons */}
          {!isCompleted && (
            <div className="flex items-center gap-6 mt-6">
              {/* Pass Button */}
              <button 
                onClick={() => handleSwipe("pass")} 
                className="w-14 h-14 rounded-full border-4 border-red-500 bg-gray-900 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center text-xl font-bold transition-all active:scale-95"
                title="Pass"
              >
                ✕
              </button>
              {/* Super Like */}
              <button 
                onClick={() => handleSwipe("like")} 
                className="w-10 h-10 rounded-full border-3 border-blue-500 bg-gray-900 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center text-sm font-bold transition-all active:scale-95"
                title="Super Like"
              >
                ★
              </button>
              {/* Like Button */}
              <button 
                onClick={() => handleSwipe("like")} 
                className="w-14 h-14 rounded-full border-4 border-green-500 bg-gray-900 text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center text-xl font-bold transition-all active:scale-95"
                title="Like"
              >
                ♥
              </button>
            </div>
          )}
        </div>

        {/* Match Popup Modal */}
        {matchNpc && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-gray-900 border-4 border-pink-500 rounded-sm p-8 max-w-sm w-full text-center space-y-6">
              <span className="text-4xl animate-bounce">💖</span>
              <h2 className="font-pixel text-base text-pink-400">IT&apos;S A MATCH!</h2>
              <p className="font-pixel text-[8px] text-white">
                You and {matchNpc.name} have joined forces. Build something amazing together!
              </p>
              <div className="flex justify-center py-4 bg-gray-800/40 border border-gray-700 rounded-sm">
                <AvatarPreview 
                  config={{ skin: matchNpc.skin, hair: 1, hairColor: matchNpc.hairColor, outfit: matchNpc.outfit, accessory: 0 }} 
                  size={96} 
                />
              </div>
              <button 
                onClick={() => setMatchNpc(null)} 
                className="w-full font-pixel text-[8px] py-3 pixel-btn bg-pink-600 text-white border-pink-400 rounded-sm"
              >
                CONTINUE SWIPING
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in pixel-grid-bg min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 pixel-border rounded-sm p-3 flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="font-pixel text-[8px] text-yellow-400">⚔️ UNIMATCH WORLD</p>
          <p className="font-pixel text-[7px] text-gray-500">Walk around • Talk to heroes • Build your party</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="font-pixel text-[8px] text-cyan-400">PARTY:</span>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`w-6 h-6 border-2 rounded-sm flex items-center justify-center text-[10px] font-pixel ${party[i] ? "border-green-500 bg-gray-800 text-green-400" : "border-gray-700 bg-gray-800"}`}>{party[i] ? "✓" : ""}</div>
            ))}
          </div>
          <button onClick={() => setPhase("select")} className="font-pixel text-[7px] px-3 py-1.5 bg-gray-800 text-gray-400 border-2 border-gray-700 rounded-sm hover:border-gray-500">CHANGE MODE</button>
        </div>
      </div>

      {/* Game Canvas - WIDE DISPLAY */}
      <div className="relative flex justify-center">
        <div className="relative" style={{ maxWidth: "100%" }}>
          <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H}
            className="pixel-border rounded-sm bg-gray-900 block"
            style={{ imageRendering: "pixelated", width: "100%", maxWidth: CANVAS_W, height: "auto" }} />

          {showIntro && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-30 rounded-sm">
              <p className="font-pixel text-lg text-white mb-2">WELCOME, HERO!</p>
              <p className="font-pixel text-[8px] text-cyan-400 mb-4">Explore the campus to find your party</p>
              <div className="space-y-2 text-center">
                <p className="font-pixel text-[8px] text-yellow-400">WASD / Arrow Keys = Move freely</p>
                <p className="font-pixel text-[8px] text-yellow-400">E = Talk to nearby hero</p>
                <p className="font-pixel text-[8px] text-gray-500 pixel-blink">Loading world...</p>
              </div>
            </div>
          )}

          {talkingNpc && (
            <NpcDialog npc={talkingNpc} recruited={party.includes(talkingNpc.id)}
              onRecruit={() => { if (!party.includes(talkingNpc.id) && party.length < 5) { const np = [...party, talkingNpc.id]; setParty(np); partyRef.current = np; forceUpdate(n => n + 1); } }}
              onClose={() => setTalkingNpc(null)} />
          )}
        </div>
      </div>

      {/* Mobile D-Pad with hold-to-move */}
      <div className="flex justify-center gap-8 lg:hidden">
        <div className="grid grid-cols-3 gap-1 w-36">
          <div />
          <button onPointerDown={() => startMobileMove("up")} onPointerUp={stopMobileMove} onPointerLeave={stopMobileMove} className="font-pixel text-xs bg-gray-800 text-white border-3 border-gray-600 rounded-sm p-3 active:bg-gray-700 select-none">▲</button>
          <div />
          <button onPointerDown={() => startMobileMove("left")} onPointerUp={stopMobileMove} onPointerLeave={stopMobileMove} className="font-pixel text-xs bg-gray-800 text-white border-3 border-gray-600 rounded-sm p-3 active:bg-gray-700 select-none">◀</button>
          <button onClick={tryInteract} className="font-pixel text-[8px] bg-yellow-700 text-white border-3 border-yellow-500 rounded-sm p-3 active:bg-yellow-600 select-none">E</button>
          <button onPointerDown={() => startMobileMove("right")} onPointerUp={stopMobileMove} onPointerLeave={stopMobileMove} className="font-pixel text-xs bg-gray-800 text-white border-3 border-gray-600 rounded-sm p-3 active:bg-gray-700 select-none">▶</button>
          <div />
          <button onPointerDown={() => startMobileMove("down")} onPointerUp={stopMobileMove} onPointerLeave={stopMobileMove} className="font-pixel text-xs bg-gray-800 text-white border-3 border-gray-600 rounded-sm p-3 active:bg-gray-700 select-none">▼</button>
          <div />
        </div>
      </div>

      <div className="hidden lg:flex justify-center gap-6">
        <span className="font-pixel text-[8px] text-gray-600">WASD / Arrow Keys = Move freely</span>
        <span className="font-pixel text-[8px] text-gray-600">E = Talk to hero</span>
        <span className="font-pixel text-[8px] text-gray-600">Hold keys to move • Diagonal works too!</span>
      </div>
    </div>
  );
}
