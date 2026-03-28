// PSTOrbitalDebris.jsx
// Postnieks Impossibility Program — SAPM Companion Dashboard
// Bloomberg terminal aesthetic: JetBrains Mono + Newsreader, navy/gold/crimson/green
// Drop into Next.js: pages/dashboards/PSTOrbitalDebris.jsx  (or app/dashboards/PSTOrbitalDebris/page.jsx)
// Dependencies: none (pure React + inline styles)

import { useState } from 'react';
import SAPMNav from "./SAPMNav";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

// ─── Data ─────────────────────────────────────────────────────────────────
const META = {
  title: "Orbital Debris and LEO Congestion",
  subtitle: "System Welfare Cost of Low Earth Orbit Congestion",
  beta: "5065.61",
  ci: "3524.21–7080.01",
  pi: "$293B",
  psa: "−$601T (NPV annualized)",
  mu: "0.9995",
  kappa: "62.09",
  type: "Orbital Congestion Ceiling (Theorem IX) | Floor β ≈ 12.0 | Slow Hollow Win | Tier 4 Governance Vacuum",
  companion: "",
};

const CHANNELS = [
        { id:1, name:"Collision cascade (direct fragmentation)", beta:"0.043", value:"$12.6B/yr", weight:"tiny" },
        { id:2, name:"Collision avoidance friction", beta:"0.021", value:"$6.1B/yr", weight:"tiny" },
        { id:3, name:"Terrestrial service dependency disruption", beta:"0.107", value:"$31.3B/yr", weight:"small" },
        { id:4, name:"Intertemporal option value DESTRUCTION", beta:"2,052", value:"$601T NPV", weight:"DOMINANT" },
        { id:5, name:"Insurance market distortion", beta:"0.013", value:"$3.8B/yr", weight:"tiny" },
        { id:6, name:"Non-collision environmental (photopollution)", beta:"0.064", value:"$18.7B/yr", weight:"small" },
        { id:7, name:"Military externality (ASAT debris)", beta:"0.043", value:"$12.6B/yr", weight:"tiny" },
];

const CROSS_DOMAIN = [
        { domain:"ERCOT (Texas Grid)", beta:"2,053", type:"Institutional", pi:"$2.3B" },
        { domain:"PFAS (Forever Chemicals)", beta:"35.2", type:"Impossibility", pi:"$4.1B" },
        { domain:"Monoculture Agriculture", beta:"8.6", type:"Impossibility", pi:"$52B" },
        { domain:"Opioid Ecosystem", beta:"10.2", type:"Institutional", pi:"~$35B" },
        { domain:"Commercial Real Estate", beta:"8.4", type:"Institutional", pi:"$12-15B" },
        { domain:"Persistent Org. Pollutants", beta:"8.4", type:"Institutional", pi:"$293B" },
        { domain:"Gene Drives", beta:"12.4", type:"Impossibility", pi:"$293B" },
        { domain:"Big Tech / Platform", beta:"7.4", type:"Institutional", pi:"$158B" },
        { domain:"Frontier AI", beta:"7.4", type:"Impossibility", pi:"" },
        { domain:"Palm Oil", beta:"6.2", type:"Institutional", pi:"$67B" },
        { domain:"Oil & Gas Extraction", beta:"6.2", type:"Institutional", pi:"$3.5T" },
        { domain:"Gambling (Commercial)", beta:"6.3", type:"Institutional", pi:"$44.2B" },
        { domain:"PBM Rebate System", beta:"6.3", type:"Institutional", pi:"$27.6B" },
        { domain:"Coal Combustion", beta:"6.1", type:"Institutional", pi:"" },
        { domain:"Aviation Emissions", beta:"4.6", type:"Institutional", pi:"$1.007T" },
        { domain:"Algorithmic Pricing", beta:"4.2", type:"Institutional", pi:"$39.5B" },
        { domain:"Gig Economy Platforms", beta:"4.2", type:"Institutional", pi:"" },
        { domain:"Global Fisheries", beta:"4.72", type:"Institutional", pi:"" },
        { domain:"UPF / Ultra-Processed Food", beta:"6.2", type:"Institutional", pi:"" },
        { domain:"Deep-Sea Mining", beta:"4.7", type:"Impossibility", pi:"" },
        { domain:"Arms Exports", beta:"2.4", type:"Institutional", pi:"$293B" },
        { domain:"Antimicrobial Resistance", beta:"2.1", type:"Impossibility", pi:"" },
        { domain:"Nuclear Energy", beta:"0.7", type:"Impossibility", pi:"" },
        { domain:"Orbital Debris (LEO)", beta:"2,053", type:"Impossibility", pi:"$293B" },
        { domain:"WMD Capability Diffusion", beta:"—", type:"Impossibility", pi:"" },
        { domain:"Bitcoin (PoW)", beta:"5.0", type:"Impossibility", pi:"" },
];

const HIGHLIGHTS = [
        "β_W = 2,053 — dominated by Channel 4 (Intertemporal Option Value). Destroying an orbit forecloses every satellite that would ever operate there, every GPS fix, every weather forecast — for centuries.",
        "Floor β ≈ 12.0 under Orbital Congestion Ceiling (Theorem IX). Even with perfect debris removal of all other channels, option value destruction floor cannot be escaped.",
        "Tier 4 governance vacuum: first domain in SAPM program where impossibility is driven by constitutional architecture of international legal order — no sovereign has jurisdiction over orbital commons.",
        "50:1 to 100:1 system beta differential between low-altitude (~550 km, self-cleaning) and high-altitude (800–1,200 km, permanent contamination). Altitude architecture IS the welfare cost.",
        "2028–2035: convergence of thresholds 1, 2, 3, 5. Closing intervention window. Mega-constellation deployments saturating 500–600 km shell.",
        "Once Economic Kessler Syndrome renders 800–1,000 km band commercially dead, political constituency shifts from opposing to demanding regulation — the PFAS inflection analogy.",
];

const PSF_PARAMS = {pi_c:15.0,pi_p:293.0,w_c:600000.0,kappa:3.2};
const PSF_DATA = [{pi:1.5,w:595472.28},{pi:14.15,w:599982.05},{pi:26.79,w:596546.66},{pi:39.44,w:585160.68},{pi:52.09,w:565823.68},{pi:64.73,w:538560.38},{pi:77.38,w:503327.63},{pi:90.03,w:460143.86},{pi:102.67,w:409052.64},{pi:115.32,w:349973.13},{pi:127.97,w:282942.6},{pi:140.61,w:208023.47},{pi:153.26,w:125097.19},{pi:165.91,w:34219.89},{pi:178.55,w:-64527.16},{pi:191.2,w:-171300.2},{pi:203.85,w:-286024.26},{pi:216.49,w:-408599.23},{pi:229.14,w:-539219.04},{pi:241.79,w:-677789.86},{pi:254.43,w:-824192.74},{pi:267.08,w:-978659.32},{pi:279.73,w:-1141076.91},{pi:292.37,w:-1311307.7},{pi:305.02,w:-1489621.04},{pi:317.67,w:-1675885.4},{pi:330.31,w:-1869944.11},{pi:342.96,w:-2072104.22},{pi:355.61,w:-2282215.34},{pi:368.25,w:-2500101.96},{pi:380.9,w:-2726108.83}];

const MC_HIST = [{bin:"2989.32",lo:2989.3203,hi:3096.6948,count:36},{bin:"3096.69",lo:3096.6948,hi:3204.0693,count:67},{bin:"3204.07",lo:3204.0693,hi:3311.4438,count:88},{bin:"3311.44",lo:3311.4438,hi:3418.8183,count:104},{bin:"3418.82",lo:3418.8183,hi:3526.1928,count:158},{bin:"3526.19",lo:3526.1928,hi:3633.5674,count:193},{bin:"3633.57",lo:3633.5674,hi:3740.9419,count:229},{bin:"3740.94",lo:3740.9419,hi:3848.3164,count:289},{bin:"3848.32",lo:3848.3164,hi:3955.6909,count:304},{bin:"3955.69",lo:3955.6909,hi:4063.0654,count:325},{bin:"4063.07",lo:4063.0654,hi:4170.4399,count:374},{bin:"4170.44",lo:4170.4399,hi:4277.8144,count:382},{bin:"4277.81",lo:4277.8144,hi:4385.1889,count:386},{bin:"4385.19",lo:4385.1889,hi:4492.5634,count:391},{bin:"4492.56",lo:4492.5634,hi:4599.9379,count:422},{bin:"4599.94",lo:4599.9379,hi:4707.3124,count:385},{bin:"4707.31",lo:4707.3124,hi:4814.6869,count:413},{bin:"4814.69",lo:4814.6869,hi:4922.0614,count:398},{bin:"4922.06",lo:4922.0614,hi:5029.4359,count:359},{bin:"5029.44",lo:5029.4359,hi:5136.8104,count:389},{bin:"5136.81",lo:5136.8104,hi:5244.1849,count:347},{bin:"5244.18",lo:5244.1849,hi:5351.5594,count:329},{bin:"5351.56",lo:5351.5594,hi:5458.9339,count:301},{bin:"5458.93",lo:5458.9339,hi:5566.3084,count:298},{bin:"5566.31",lo:5566.3084,hi:5673.6829,count:279},{bin:"5673.68",lo:5673.6829,hi:5781.0574,count:260},{bin:"5781.06",lo:5781.0574,hi:5888.4319,count:232},{bin:"5888.43",lo:5888.4319,hi:5995.8064,count:255},{bin:"5995.81",lo:5995.8064,hi:6103.1809,count:206},{bin:"6103.18",lo:6103.1809,hi:6210.5555,count:224},{bin:"6210.56",lo:6210.5555,hi:6317.9300,count:180},{bin:"6317.93",lo:6317.9300,hi:6425.3045,count:162},{bin:"6425.30",lo:6425.3045,hi:6532.6790,count:150},{bin:"6532.68",lo:6532.6790,hi:6640.0535,count:140},{bin:"6640.05",lo:6640.0535,hi:6747.4280,count:126},{bin:"6747.43",lo:6747.4280,hi:6854.8025,count:93},{bin:"6854.80",lo:6854.8025,hi:6962.1770,count:87},{bin:"6962.18",lo:6962.1770,hi:7069.5515,count:82},{bin:"7069.55",lo:7069.5515,hi:7176.9260,count:77},{bin:"7176.93",lo:7176.9260,hi:7284.3005,count:69},{bin:"7284.30",lo:7284.3005,hi:7391.6750,count:58},{bin:"7391.67",lo:7391.6750,hi:7499.0495,count:57},{bin:"7499.05",lo:7499.0495,hi:7606.4240,count:41},{bin:"7606.42",lo:7606.4240,hi:7713.7985,count:41},{bin:"7713.80",lo:7713.7985,hi:7821.1730,count:35},{bin:"7821.17",lo:7821.1730,hi:7928.5475,count:20},{bin:"7928.55",lo:7928.5475,hi:8035.9220,count:19},{bin:"8035.92",lo:8035.9220,hi:8143.2965,count:17},{bin:"8143.30",lo:8143.2965,hi:8250.6710,count:11},{bin:"8250.67",lo:8250.6710,hi:8358.0455,count:12}];
const MC_STATS = {mean:5065.6083,median:4923.9502,ci_lo:3524.2118,ci_hi:7080.0093,pct_hw:100.0,pct_above_3:100.0,pct_above_5:100.0,min:2599.2905,max:10852.3889,n_draws:10000,seed:42};
const MC_CHANNELS = [{name:"Kessler cascade risk",mean:1215696.97,p5:905098.79,p50:1195140.68,p95:1587088.60,share:0.8198},{name:"LEO congestion externalities",mean:206760.08,p5:134979.53,p50:200779.34,p95:299456.17,share:0.1394},{name:"Satellite lifetime reduction",mean:36656.67,p5:21786.07,p50:36268.09,p95:52589.02,share:0.0247},{name:"Launch risk & insurance",mean:16051.63,p5:10483.04,p50:15831.60,p95:22155.61,share:0.0108},{name:"Astronomy & dark sky",mean:4824.04,p5:2878.71,p50:4752.54,p95:6983.53,share:0.0033},{name:"Governance failure",mean:3013.56,p5:1210.44,p50:3041.80,p95:4799.00,share:0.0020}];
const MC_WELFARE = {mean:1483002.95,ci_lo:1159971.88,ci_hi:1864292.61};

const THRESHOLDS = [{domain:"Kessler Syndrome initiation in LEO",year:2050,confidence:"Medium",status:"NASA models: self-sustaining cascade possible by 2050 without active debris removal",crossed:false},{domain:"Starlink Mega-constellation >10,000 objects",year:2025,confidence:"High",status:"SpaceX has deployed >6,000 Starlinks; Gen2 approval for 30,000+",crossed:true},{domain:"Annual conjunction warnings >500K",year:2024,confidence:"High",status:"LeoLabs tracking >1M conjunctions annually in 2024",crossed:true},{domain:"First commercial active debris removal mission",year:2026,confidence:"High",status:"Astroscale ELSA-M and ESA ClearSpace-1 both targeting 2026-2027",crossed:false},{domain:"Mandatory 5-year deorbit compliance >80%",year:2030,confidence:"Low",status:"FCC now requires 5-year deorbit; enforcement capacity unclear",crossed:false}];

const AXIOMS = {type:"impossibility",items:[{id:"A1",name:"Launch Necessity",description:"Access to orbital space is required for telecommunications, navigation, Earth observation, weather prediction, and national security — demand that no single actor can eliminate under current technological and geopolitical conditions."},{id:"A2",name:"Debris Generation Identity",description:"Every object placed in orbit increases conjunction probability for all existing objects; launch and orbital congestion are the same orbital-mechanics event, and no demonstrated technology removes debris at the rate current launch cadences generate it."},{id:"A3",name:"Kessler Cascade Irreversibility",description:"Above a critical orbital density threshold, collisional cascading becomes self-sustaining — each collision generates fragments that cause additional collisions, thermodynamically irreversible without removal rates exceeding any demonstrated technology."}]};

const METHODS_DATA = {
  welfare_function: "W computed as expected value of Kessler cascade welfare cost (loss of all orbital infrastructure) weighted by cascade probability under current trajectory, plus annual congestion externalities and satellite lifetime reduction costs.",
  cooperative_baseline: "Orbital access under binding congestion pricing, mandatory active debris removal, and strict post-mission disposal, generating $15B in legitimate satellite service value with maintained orbital environment.",
  falsification: ["F1: Demonstrate that current LEO debris density is below the Kessler cascade threshold for all major orbital shells using NASA LEGEND model validation.","F2: Show that active debris removal technology (ClearSpace-1, ELSA-M class) can remove debris faster than current launch cadences generate it at commercially viable cost.","F3: Demonstrate that orbital debris collision risk has not increased since 2010 despite a 300% increase in tracked objects."],
  key_sources: ["NASA, Orbital Debris Quarterly News (2024)","Liou & Johnson, Risks in space from orbiting debris (2006) Science","ESA, Space Environment Report (2024)","Kessler & Cour-Palais, Collision frequency of artificial satellites (1978) JGR"]
};

// ─── Color palette ───────────────────────────────────────────────────────────
const C = {
  bg:      '#0D0D0D',
  panel:   '#1A1A1A',
  border:  'rgba(255,255,255,0.08)',
  navy:    '#1A1A1A',
  gold:    '#F59E0B',
  crimson: '#EF4444',
  green:   '#22C55E',
  text:    '#F5F0E8',
  muted:   'rgba(255,255,255,0.4)',
  thead:   '#141414',
  mono:    "'JetBrains Mono', 'Fira Code', monospace",
  serif:   "'Newsreader', 'Georgia', serif",
};

// ─── Sub-components ──────────────────────────────────────────────────────────
function Metric({ label, value, sub, color }) {
  return (
    <div style={{flex:1,minWidth:140,background:C.panel,border:`1px solid ${C.border}`,borderRadius:3,padding:'12px 16px'}}>
      <div style={{fontFamily:C.mono,fontSize:11,color:C.muted,letterSpacing:1,marginBottom:4}}>{label}</div>
      <div style={{fontFamily:C.mono,fontSize:28,fontWeight:700,color:color||C.gold,lineHeight:1}}>{value}</div>
      {sub && <div style={{fontFamily:C.mono,fontSize:11,color:C.muted,marginTop:4}}>{sub}</div>}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{fontFamily:C.mono,fontSize:12,color:C.muted,letterSpacing:2,borderBottom:`1px solid ${C.border}`,paddingBottom:6,marginBottom:12,marginTop:20,textTransform:'uppercase'}}>
      {children}
    </div>
  );
}

function BetaBar({ beta, max }) {
  const pct = Math.min(100, (parseFloat(beta)||0) / (max||15) * 100);
  const color = pct > 80 ? C.crimson : pct > 50 ? '#D97706' : C.gold;
  return (
    <div style={{background:'rgba(255,255,255,0.04)',borderRadius:2,height:8,flex:1,margin:'0 8px'}}>
      <div style={{width:`${pct}%`,height:'100%',background:color,borderRadius:2,transition:'width 0.4s'}} />
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      fontFamily:C.mono, fontSize:12, letterSpacing:1,
      padding:'6px 14px', border:'none', cursor:'pointer',
      background: active ? C.gold : 'transparent',
      color: active ? '#000' : C.muted,
      borderBottom: active ? `2px solid ${C.gold}` : '2px solid transparent',
      textTransform:'uppercase',
    }}>{label}</button>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function PSTOrbitalDebrisDashboard() {
  const [tab, setTab] = useState('overview');
  const maxBeta = Math.max(...CROSS_DOMAIN.map(d => parseFloat(d.beta)||0), parseFloat(META.beta)||0, 10);

  return (
    <div style={{background:C.bg,minHeight:'100vh',padding:'0',fontFamily:C.mono,color:C.text}}>

      {/* Header */}
      <div style={{background:C.panel,borderBottom:`2px solid ${C.gold}`,padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontFamily:C.mono,fontSize:11,color:C.muted,letterSpacing:2,marginBottom:4}}>POSTNIEKS IMPOSSIBILITY PROGRAM · SAPM</div>
          <div style={{fontFamily:C.serif,fontSize:24,fontWeight:700,color:C.text}}>{META.title}</div>
          {META.subtitle && <div style={{fontFamily:C.serif,fontSize:15,color:C.muted,marginTop:2,fontStyle:'italic'}}>{META.subtitle}</div>}
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontFamily:C.mono,fontSize:11,color:C.muted,letterSpacing:1}}>SYSTEM BETA</div>
          <div style={{fontFamily:C.mono,fontSize:36,fontWeight:700,color:C.gold,lineHeight:1}}>β_W = {META.beta}</div>
          {META.ci && <div style={{fontFamily:C.mono,fontSize:11,color:C.muted}}>90% CI [{META.ci}]</div>}
        </div>
      </div>

      {/* PST badge + type */}
      <div style={{background:'rgba(245,158,11,0.06)',padding:'8px 24px',display:'flex',gap:10,alignItems:'center',borderBottom:`1px solid ${C.border}`}}>
        <span style={{background:'#7b1a1a',color:'#ffdddd',fontSize:12,padding:'4px 10px',borderRadius:2,fontFamily:'JetBrains Mono,monospace',letterSpacing:0.5}}>IMPOSSIBILITY THEOREM</span>
        <span style={{fontFamily:C.mono,fontSize:12,color:C.muted}}>{META.type}</span>
        {META.companion && <a href={META.companion} target="_blank" rel="noreferrer" style={{marginLeft:'auto',fontFamily:C.mono,fontSize:11,color:C.gold,textDecoration:'none'}}>↗ Companion Dashboard</a>}
      </div>

      {/* Tab bar */}
      <div style={{background:C.panel,borderBottom:`1px solid ${C.border}`,padding:'0 24px',display:'flex',gap:4}}>
        {['overview','channels','psf','monte-carlo','thresholds','cross-domain','methods','highlights'].map(t => (
          <Tab key={t} label={t} active={tab===t} onClick={()=>setTab(t)} />
        ))}
      </div>

      <div style={{padding:'20px 24px',maxWidth:1100}}>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div>
            {/* Key metrics row */}
            <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:16}}>
              <Metric label="β_W  (System Beta)" value={META.beta} sub={META.ci ? `90% CI [${META.ci}]` : 'Headline estimate'} color={C.gold} />
              {META.pi && <Metric label="Private Payoff Π" value={META.pi+'/yr'} sub="Private sector capture" color={C.text} />}
              {META.psa && <Metric label="System-Adj. Payoff Π_SA" value={META.psa} sub="β_W · Π − W" color={C.crimson} />}
              {META.mu && <Metric label="Break-Even μ*" value={META.mu} sub="Welfare neutrality threshold" color={'#22C55E'} />}
              {META.kappa && <Metric label="PSF Curvature κ" value={META.kappa} sub="Pareto shortfall index" color={C.muted} />}
            </div>

            
      {/* Theorem Statement */}
      <div style={{background:'#1A1A1A',border:'2px solid #F59E0B',borderRadius:4,padding:'16px 20px',marginBottom:16}}>
        <div style={{fontFamily:'Newsreader,serif',fontSize:11,color:'#aabbcc',marginBottom:6,letterSpacing:1}}>THEOREM STATEMENT</div>
        <div style={{fontFamily:'Newsreader,serif',fontSize:14,color:'#e8e8e8',fontStyle:'italic',lineHeight:1.6}}>Orbital Congestion Ceiling (Theorem IX): No market mechanism satisfying Launch Necessity (A1), Debris Generation Identity (A2), and Kessler Cascade Irreversibility (A3) can reduce the system beta below approximately 12.0 through private action alone. (Postnieks, 2026)</div>
      </div>

            {/* Channel waterfall */}
            {CHANNELS.length > 0 && (
              <div>
                <SectionTitle>Channel Decomposition — Welfare Cost Waterfall</SectionTitle>
                {CHANNELS.map((ch,i) => (
                  <div key={i} style={{display:'flex',alignItems:'center',marginBottom:8,gap:8}}>
                    <div style={{fontFamily:C.mono,fontSize:12,color:C.muted,width:22,textAlign:'right'}}>{ch.id}</div>
                    <div style={{fontFamily:C.serif,fontSize:15,color:C.text,width:300,flexShrink:0}}>{ch.name}</div>
                    <BetaBar beta={ch.beta} max={parseFloat(META.beta)||15} />
                    <div style={{fontFamily:C.mono,fontSize:13,color:C.gold,width:55,textAlign:'right'}}>{ch.beta}</div>
                    <div style={{fontFamily:C.mono,fontSize:13,color:C.text,width:110,textAlign:'right'}}>{ch.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CHANNELS TAB */}
        {tab === 'channels' && (
          <div>
            <SectionTitle>Channel-by-Channel Breakdown</SectionTitle>
            <table style={{width:'100%',borderCollapse:'collapse',fontFamily:C.mono,fontSize:13}}>
              <thead>
                <tr style={{background:C.thead}}>
                  <th style={{padding:'8px 12px',textAlign:'left',color:C.gold,borderBottom:`1px solid ${C.border}`}}>#</th>
                  <th style={{padding:'8px 12px',textAlign:'left',color:C.gold,borderBottom:`1px solid ${C.border}`}}>Channel</th>
                  <th style={{padding:'8px 12px',textAlign:'right',color:C.gold,borderBottom:`1px solid ${C.border}`}}>β_W(i)</th>
                  <th style={{padding:'8px 12px',textAlign:'right',color:C.gold,borderBottom:`1px solid ${C.border}`}}>δ_i ($/yr)</th>
                  <th style={{padding:'8px 12px',textAlign:'right',color:C.gold,borderBottom:`1px solid ${C.border}`}}>Weight</th>
                </tr>
              </thead>
              <tbody>
                {CHANNELS.map((ch,i) => (
                  <tr key={i} style={{background: i%2===0 ? C.panel : C.bg}}>
                    <td style={{padding:'8px 12px',color:C.muted,borderBottom:`1px solid ${C.border}`}}>{ch.id}</td>
                    <td style={{padding:'8px 12px',color:C.text,fontFamily:C.serif,fontSize:14,borderBottom:`1px solid ${C.border}`}}>{ch.name}</td>
                    <td style={{padding:'8px 12px',color:C.gold,textAlign:'right',borderBottom:`1px solid ${C.border}`}}>{ch.beta}</td>
                    <td style={{padding:'8px 12px',color:C.text,textAlign:'right',borderBottom:`1px solid ${C.border}`}}>{ch.value}</td>
                    <td style={{padding:'8px 12px',color:C.muted,textAlign:'right',borderBottom:`1px solid ${C.border}`}}>{ch.weight}</td>
                  </tr>
                ))}
                <tr style={{background:C.thead}}>
                  <td colSpan={2} style={{padding:'10px 12px',color:C.gold,fontWeight:700,fontSize:14}}>AGGREGATE β_W</td>
                  <td colSpan={3} style={{padding:'10px 12px',color:C.gold,fontWeight:700,fontSize:16,textAlign:'right'}}>{META.beta}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* CROSS-DOMAIN TAB */}
        {tab === 'cross-domain' && (
          <div>
            <SectionTitle>Cross-Domain SAPM Registry</SectionTitle>
            <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,padding:16,marginBottom:16}}>
              <ResponsiveContainer width="100%" height={Math.min(500, CROSS_DOMAIN.filter(d => parseFloat(d.beta) > 0 && parseFloat(d.beta) <= 50).length * 28 + 60)}>
                <BarChart data={[...CROSS_DOMAIN].filter(d => parseFloat(d.beta) > 0 && parseFloat(d.beta) <= 50).sort((a,b) => parseFloat(a.beta) - parseFloat(b.beta)).map(d => ({...d, betaNum: parseFloat(d.beta)}))} layout="vertical" margin={{top:10,right:30,left:200,bottom:10}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis type="number" stroke={C.muted} tick={{fontFamily:C.mono,fontSize:11}} />
                  <YAxis type="category" dataKey="domain" stroke={C.muted} tick={{fontFamily:C.mono,fontSize:11}} width={190} />
                  <Tooltip contentStyle={{background:C.panel,border:`1px solid ${C.border}`,fontFamily:C.mono,fontSize:12,color:C.text}} />
                  <ReferenceLine x={1} stroke={C.crimson} strokeDasharray="3 3" label={{value:"β=1",fill:C.crimson,fontFamily:C.mono,fontSize:11}} />
                  <Bar dataKey="betaNum" fill={C.gold} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <table style={{width:'100%',borderCollapse:'collapse',fontFamily:C.mono,fontSize:13}}>
              <thead>
                <tr style={{background:C.thead}}>
                  <th style={{padding:'8px 12px',textAlign:'left',color:C.gold,borderBottom:`1px solid ${C.border}`}}>Domain</th>
                  <th style={{padding:'8px 12px',textAlign:'right',color:C.gold,borderBottom:`1px solid ${C.border}`}}>β_W</th>
                  <th style={{padding:'8px 12px',textAlign:'left',color:C.gold,borderBottom:`1px solid ${C.border}`}}>PST Type</th>
                  <th style={{padding:'8px 12px',textAlign:'right',color:C.gold,borderBottom:`1px solid ${C.border}`}}>Π ($/yr)</th>
                </tr>
              </thead>
              <tbody>
                {[...CROSS_DOMAIN].sort((a,b) => (parseFloat(b.beta)||0) - (parseFloat(a.beta)||0)).map((d,i) => (
                  <tr key={i} style={{background: d.domain===META.title ? 'rgba(34,197,94,0.08)' : i%2===0 ? C.panel : C.bg}}>
                    <td style={{padding:'8px 12px',color: d.domain===META.title ? '#22C55E' : C.text,fontFamily:C.serif,fontSize:14,borderBottom:`1px solid ${C.border}`}}>
                      {d.domain===META.title ? '▶ ' : ''}{d.domain}
                    </td>
                    <td style={{padding:'8px 12px',color: parseFloat(d.beta)>10 ? C.crimson : C.gold,textAlign:'right',fontWeight:700,borderBottom:`1px solid ${C.border}`}}>{d.beta}</td>
                    <td style={{padding:'8px 12px',color:C.muted,borderBottom:`1px solid ${C.border}`}}>{d.type}</td>
                    <td style={{padding:'8px 12px',color:C.text,textAlign:'right',borderBottom:`1px solid ${C.border}`}}>{d.pi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}


        {/* PSF TAB */}
        {tab === 'psf' && (
          <div>
            <SectionTitle>Private-Systemic Frontier</SectionTitle>
            <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,padding:16,marginBottom:16}}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={PSF_DATA} margin={{top:10,right:30,left:20,bottom:10}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="pi" stroke={C.muted} tick={{fontFamily:C.mono,fontSize:11}} label={{value:"Π (Private Payoff)",position:"bottom",fill:C.muted,fontFamily:C.mono,fontSize:11}} />
                  <YAxis stroke={C.muted} tick={{fontFamily:C.mono,fontSize:11}} label={{value:"W (System Welfare)",angle:-90,position:"insideLeft",fill:C.muted,fontFamily:C.mono,fontSize:11}} />
                  <Tooltip contentStyle={{background:C.panel,border:`1px solid ${C.border}`,fontFamily:C.mono,fontSize:12,color:C.text}} />
                  <Area type="monotone" dataKey="w" stroke={C.gold} fill="rgba(245,158,11,0.15)" strokeWidth={2} />
                  <ReferenceLine x={PSF_PARAMS.pi_c} stroke={C.green} strokeDasharray="5 5" label={{value:"Π_C",fill:C.green,fontFamily:C.mono,fontSize:11}} />
                  <ReferenceLine x={PSF_PARAMS.pi_p} stroke={C.crimson} strokeDasharray="5 5" label={{value:"Current",fill:C.crimson,fontFamily:C.mono,fontSize:11}} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
              <Metric label="COOPERATIVE PAYOFF Π_C" value={'$'+PSF_PARAMS.pi_c+'B'} sub="Welfare-maximizing extraction" color={C.green} />
              <Metric label="CURRENT PAYOFF Π_P" value={'$'+PSF_PARAMS.pi_p+'B'} sub="Actual private extraction" color={C.crimson} />
              <Metric label="OVER-EXTRACTION" value={'$'+(PSF_PARAMS.pi_p - PSF_PARAMS.pi_c)+'B'} sub="Gap driving welfare loss" color={C.gold} />
            </div>
            <div style={{marginTop:16,padding:16,background:C.panel,border:`1px solid ${C.border}`,borderRadius:4}}>
              <div style={{fontFamily:C.mono,fontSize:12,color:C.gold,marginBottom:8}}>SAPM ↔ CAPM CORRESPONDENCE</div>
              <table style={{width:'100%',borderCollapse:'collapse',fontFamily:C.mono,fontSize:13}}>
                <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>
                  <th style={{padding:'8px 12px',textAlign:'left',color:C.gold}}>SAPM CONSTRUCT</th>
                  <th style={{padding:'8px 12px',textAlign:'left',color:C.gold}}>CAPM ANALOGUE</th>
                </tr></thead>
                <tbody>
                  {[['β_W (System Beta)','β (Market Beta)'],['PSF (Private-Systemic Frontier)','SML (Security Market Line)'],['μ* (Shadow Price)','r_f (Risk-Free Rate)'],['Πˢᵃ (System-Adjusted Payoff)','α (Jensen\'s Alpha)'],['W (System Welfare)','No equivalent — structurally invisible'],['𝒮_W (Welfare Efficiency)','Sharpe Ratio']].map(([s,c],i) => (
                    <tr key={i} style={{borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                      <td style={{padding:'8px 12px',color:C.text}}>{s}</td>
                      <td style={{padding:'8px 12px',color:C.muted,fontFamily:C.serif}}>{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* MONTE CARLO TAB */}
        {tab === 'monte-carlo' && (
          <div>
            <SectionTitle>Monte Carlo Simulation — {MC_STATS.n_draws.toLocaleString()} Draws (seed={MC_STATS.seed})</SectionTitle>
            <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,padding:16,marginBottom:16}}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={MC_HIST} margin={{top:10,right:30,left:20,bottom:30}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="bin" stroke={C.muted} tick={{fontFamily:C.mono,fontSize:9}} angle={-45} textAnchor="end" interval={4} />
                  <YAxis stroke={C.muted} tick={{fontFamily:C.mono,fontSize:11}} />
                  <Tooltip contentStyle={{background:C.panel,border:`1px solid ${C.border}`,fontFamily:C.mono,fontSize:12,color:C.text}} formatter={(v)=>[v,'Draws']} />
                  <Bar dataKey="count" fill={C.gold} />
                  <ReferenceLine x={MC_STATS.mean.toFixed(2)} stroke={C.crimson} strokeWidth={2} strokeDasharray="5 5" label={{value:'μ='+MC_STATS.mean.toFixed(2),fill:C.crimson,fontFamily:C.mono,fontSize:11,position:'top'}} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:16}}>
              <Metric label="MEAN β_W" value={MC_STATS.mean.toFixed(2)} sub={'Median: '+MC_STATS.median.toFixed(2)} color={C.gold} />
              <Metric label="90% CI" value={'['+MC_STATS.ci_lo.toFixed(2)+', '+MC_STATS.ci_hi.toFixed(2)+']'} sub={'Range: '+MC_STATS.min.toFixed(2)+'–'+MC_STATS.max.toFixed(2)} color={C.muted} />
              <Metric label="% HOLLOW WIN" value={MC_STATS.pct_hw.toFixed(1)+'%'} sub={'β_W > 1 in all draws'} color={MC_STATS.pct_hw > 95 ? C.crimson : C.gold} />
              <Metric label="% β_W > 3" value={MC_STATS.pct_above_3.toFixed(1)+'%'} color={MC_STATS.pct_above_3 > 90 ? C.crimson : C.gold} />
              <Metric label="% β_W > 5" value={MC_STATS.pct_above_5.toFixed(1)+'%'} color={MC_STATS.pct_above_5 > 50 ? '#D97706' : C.gold} />
            </div>
            <SectionTitle>Channel Welfare Contributions</SectionTitle>
            <table style={{width:'100%',borderCollapse:'collapse',fontFamily:C.mono,fontSize:13}}>
              <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>
                <th style={{padding:'8px 12px',textAlign:'left',color:C.gold}}>CHANNEL</th>
                <th style={{padding:'8px 12px',textAlign:'right',color:C.gold}}>MEAN $B</th>
                <th style={{padding:'8px 12px',textAlign:'right',color:C.gold}}>P5</th>
                <th style={{padding:'8px 12px',textAlign:'right',color:C.gold}}>P50</th>
                <th style={{padding:'8px 12px',textAlign:'right',color:C.gold}}>P95</th>
                <th style={{padding:'8px 12px',textAlign:'right',color:C.gold}}>SHARE</th>
              </tr></thead>
              <tbody>
                {MC_CHANNELS.map((ch,i) => (
                  <tr key={i} style={{borderBottom:`1px solid rgba(255,255,255,0.04)`,background:i%2===0?C.panel:C.bg}}>
                    <td style={{padding:'8px 12px',color:C.text,fontFamily:C.serif,fontSize:14}}>{ch.name}</td>
                    <td style={{padding:'8px 12px',color:C.gold,textAlign:'right',fontWeight:600}}>{ch.mean.toFixed(1)}</td>
                    <td style={{padding:'8px 12px',color:C.muted,textAlign:'right'}}>{ch.p5.toFixed(1)}</td>
                    <td style={{padding:'8px 12px',color:C.muted,textAlign:'right'}}>{ch.p50.toFixed(1)}</td>
                    <td style={{padding:'8px 12px',color:C.muted,textAlign:'right'}}>{ch.p95.toFixed(1)}</td>
                    <td style={{padding:'8px 12px',color:C.muted,textAlign:'right'}}>{(ch.share*100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{marginTop:16,padding:12,background:'rgba(245,158,11,0.06)',border:`1px solid rgba(245,158,11,0.15)`,borderRadius:4}}>
              <div style={{fontFamily:C.mono,fontSize:11,color:C.muted}}>Total welfare cost: <span style={{color:C.gold}}>${MC_WELFARE.mean.toFixed(1)}B</span> (90% CI: ${MC_WELFARE.ci_lo.toFixed(1)}B – ${MC_WELFARE.ci_hi.toFixed(1)}B) · Source: sapm_monte_carlo.py (seed=42)</div>
            </div>
          </div>
        )}

          </div>
        )}

        {/* THRESHOLDS TAB */}
        {tab === 'thresholds' && (
          <div>
            <SectionTitle>Critical Thresholds & Predicted Crossover</SectionTitle>
            <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,padding:16,marginBottom:16}}>
              <ResponsiveContainer width="100%" height={Math.max(200, THRESHOLDS.length * 44)}>
                <BarChart data={THRESHOLDS.map(t=>({...t,yearsFromNow:t.year-2026}))} layout="vertical" margin={{top:10,right:30,left:180,bottom:10}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis type="number" stroke={C.muted} tick={{fontFamily:C.mono,fontSize:11}} label={{value:"Years from 2026",position:"bottom",fill:C.muted,fontFamily:C.mono,fontSize:11}} />
                  <YAxis type="category" dataKey="domain" stroke={C.muted} tick={{fontFamily:C.mono,fontSize:11}} width={170} />
                  <Tooltip contentStyle={{background:C.panel,border:`1px solid ${C.border}`,fontFamily:C.mono,fontSize:12,color:C.text}} />
                  <ReferenceLine x={0} stroke={C.crimson} strokeDasharray="3 3" label={{value:"NOW",fill:C.crimson,fontFamily:C.mono,fontSize:11}} />
                  <Bar dataKey="yearsFromNow" fill={C.gold} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{display:'grid',gap:12}}>
              {THRESHOLDS.map((t,i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:16,padding:'12px 16px',background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,borderLeft:`3px solid ${t.crossed ? C.crimson : C.gold}`}}>
                  <div style={{fontFamily:C.mono,fontSize:14,color:t.crossed ? C.crimson : C.gold,fontWeight:700,minWidth:50}}>{t.year}</div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:C.mono,fontSize:13,color:C.text}}>{t.domain}</div>
                    <div style={{fontFamily:C.serif,fontSize:13,color:C.muted,marginTop:2}}>{t.status}</div>
                  </div>
                  <div style={{fontFamily:C.mono,fontSize:11,color:C.muted,padding:'2px 8px',border:`1px solid ${C.border}`,borderRadius:2}}>{t.confidence}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* METHODS TAB */}
        {tab === 'methods' && (
          <div>
            <SectionTitle>{AXIOMS.type === 'impossibility' ? 'Impossibility Axioms' : 'Institutional Failure Mechanisms'}</SectionTitle>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:12,marginBottom:20}}>
              {AXIOMS.items.map((a,i) => (
                <div key={i} style={{padding:16,background:C.panel,border:`1px solid ${AXIOMS.type === 'impossibility' ? 'rgba(239,68,68,0.2)' : C.border}`,borderRadius:4}}>
                  <div style={{fontFamily:C.mono,fontSize:12,color:AXIOMS.type === 'impossibility' ? C.crimson : C.gold,letterSpacing:1,marginBottom:6}}>{a.id}</div>
                  <div style={{fontFamily:C.serif,fontSize:15,color:C.text,fontWeight:600,marginBottom:6}}>{a.name}</div>
                  <div style={{fontFamily:C.serif,fontSize:14,color:C.muted,lineHeight:1.6}}>{a.description}</div>
                </div>
              ))}
            </div>

            <SectionTitle>System Welfare Function</SectionTitle>
            <div style={{padding:16,background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,marginBottom:20}}>
              <div style={{fontFamily:C.serif,fontSize:15,color:C.text,lineHeight:1.7}}>{METHODS_DATA.welfare_function}</div>
            </div>

            <SectionTitle>Cooperative Baseline</SectionTitle>
            <div style={{padding:16,background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,marginBottom:20}}>
              <div style={{fontFamily:C.serif,fontSize:15,color:C.text,lineHeight:1.7}}>{METHODS_DATA.cooperative_baseline}</div>
            </div>

            <SectionTitle>Falsification Criteria</SectionTitle>
            <div style={{display:'grid',gap:8,marginBottom:20}}>
              {METHODS_DATA.falsification.map((f,i) => (
                <div key={i} style={{padding:'10px 16px',background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,fontFamily:C.serif,fontSize:14,color:C.text,lineHeight:1.6}}>{f}</div>
              ))}
            </div>

            <SectionTitle>Key Sources</SectionTitle>
            <div style={{padding:16,background:C.panel,border:`1px solid ${C.border}`,borderRadius:4,marginBottom:20}}>
              {METHODS_DATA.key_sources.map((s,i) => (
                <div key={i} style={{fontFamily:C.mono,fontSize:12,color:C.muted,padding:'4px 0',borderBottom:`1px solid rgba(255,255,255,0.04)`}}>{s}</div>
              ))}
            </div>

            <div style={{padding:16,background:'rgba(245,158,11,0.06)',border:`1px solid rgba(245,158,11,0.15)`,borderRadius:4}}>
              <div style={{fontFamily:C.mono,fontSize:12,color:C.gold,marginBottom:8}}>CITATION</div>
              <div style={{fontFamily:C.serif,fontSize:14,color:C.text,lineHeight:1.6}}>
                Postnieks, E. (2026). System Asset Pricing Model: {META.title}. SAPM Working Paper. Wooster LLC.
              </div>
            </div>
          </div>
        )}

        {/* HIGHLIGHTS TAB */}
        {tab === 'highlights' && (
          <div>
            <SectionTitle>Key Findings</SectionTitle>
            {HIGHLIGHTS.map((h,i) => (
              <div key={i} style={{display:'flex',gap:12,marginBottom:12,background:C.panel,border:`1px solid ${C.border}`,borderRadius:3,padding:'12px 16px'}}>
                <div style={{fontFamily:C.mono,fontSize:16,color:C.gold,flexShrink:0}}>▸</div>
                <div style={{fontFamily:C.serif,fontSize:15,color:C.text,lineHeight:1.7}}>{h}</div>
              </div>
            ))}
          </div>
        )}

      </div>

      
      {/* 𝒮_W WELFARE EFFICIENCY RATIO */}
      <div style={{padding:"24px",background:C.panel,border:"2px solid #EF444440",borderRadius:4,margin:"24px 0"}}>
        <div style={{fontFamily:C.mono,fontSize:12,color:"#EF4444",letterSpacing:2,marginBottom:16}}>WELFARE EFFICIENCY RATIO</div>
        <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:12}}>
          <span style={{fontFamily:C.mono,fontSize:42,fontWeight:700,color:"#EF4444"}}>𝒮_W = 0.00049</span>
        </div>
        <div style={{fontFamily:C.mono,fontSize:13,color:C.muted,marginBottom:16}}>
          S&P 500 long-run Sharpe ≈ 0.40 &nbsp;|&nbsp; Acceptable ≥ 0.30 &nbsp;|&nbsp; Poor &lt; 0.10
        </div>
        <div style={{fontFamily:C.serif,fontSize:16,color:"#EF4444",lineHeight:1.7,fontStyle:"italic"}}>
          No institutional investor would hold an asset with this risk-adjusted return. This is what GDP calls productive output.
        </div>
      </div>

      {/* GREEK SYMBOL GLOSSARY */}
      <details style={{margin:"24px 0"}}>
        <summary style={{fontFamily:C.mono,fontSize:13,color:C.gold,cursor:"pointer",padding:"12px 16px",background:C.panel,border:"1px solid rgba(245,158,11,0.15)",borderRadius:4,letterSpacing:1,listStyle:"none",display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:C.gold,fontSize:14}}>▸</span> WHAT THESE SYMBOLS MEAN — AND WHY THEY MATTER
        </summary>
        <div style={{background:C.panel,border:"1px solid rgba(245,158,11,0.15)",borderTop:"none",borderRadius:"0 0 4px 4px",padding:"16px",overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontFamily:C.mono,fontSize:13}}>
            <thead>
              <tr style={{borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
                <th style={{textAlign:"left",padding:"8px 10px",color:C.gold,fontSize:12,letterSpacing:1}}>SYMBOL</th>
                <th style={{textAlign:"left",padding:"8px 10px",color:C.gold,fontSize:12,letterSpacing:1}}>PRONOUNCED</th>
                <th style={{textAlign:"left",padding:"8px 10px",color:C.gold,fontSize:12,letterSpacing:1}}>WHAT IT MEASURES</th>
                <th style={{textAlign:"left",padding:"8px 10px",color:C.gold,fontSize:12,letterSpacing:1}}>CAPM EQUIVALENT</th>
                <th style={{textAlign:"left",padding:"8px 10px",color:C.gold,fontSize:12,letterSpacing:1}}>WHY IT MATTERS</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <td style={{padding:"10px",color:C.gold,fontWeight:600}}>β_W</td>
                <td style={{padding:"10px",color:C.text}}>beta-W</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>How much social welfare this sector destroys per dollar of private gain. β_W = 5.0 means $5 of welfare destroyed per $1 earned.</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>β (market beta) — measures how much an asset moves with the market</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>In CAPM, high beta means high financial risk. In SAPM, high β_W means high welfare destruction per dollar of revenue.</td>
              </tr>
              <tr style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <td style={{padding:"10px",color:C.gold,fontWeight:600}}>𝒮_W</td>
                <td style={{padding:"10px",color:C.text}}>S-W</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>Private gain per dollar of system welfare cost. Higher is better — but in PST domains it is always low.</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>Sharpe Ratio — return per unit of risk</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>S&P 500 long-run Sharpe ≈ 0.40. A Sharpe of 0.10 is poor. VW Dieselgate: 𝒮_W = 0.12. LIBOR: 𝒮_W ≈ 0. ERCOT: 𝒮_W = 0.0005. These are welfare efficiency ratios of industries that GDP calls productive.</td>
              </tr>
              <tr style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <td style={{padding:"10px",color:C.gold,fontWeight:600}}>T*</td>
                <td style={{padding:"10px",color:C.text}}>T-star</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>The predicted time until a Hollow Win collapses into outright failure.</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>Closest to duration or time-to-default in credit analysis</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>VW: T* = 6.1 years predicted, ~6 years observed. LIBOR: T* ≤ 0 — the system was failing from day one. Seven years of concealment, not surplus.</td>
              </tr>
              <tr style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <td style={{padding:"10px",color:C.gold,fontWeight:600}}>μ*</td>
                <td style={{padding:"10px",color:C.text}}>mu-star</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>The efficient price of system welfare — what it would cost to make the deal system-preserving. μ* = 1/β_W. Derived from frontier geometry, not assigned by an analyst.</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>Closest to the risk-free rate as a floor price for risk</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>β_W = 7.4 → μ* ≈ 0.135. β_W = 35.2 → μ* ≈ 0.028. Lower μ* means cheaper welfare preservation in theory — PST means it never happens without intervention.</td>
              </tr>
              <tr style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <td style={{padding:"10px",color:C.gold,fontWeight:600}}>Πˢᵃ</td>
                <td style={{padding:"10px",color:C.text}}>pi-SA</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>The deal's true value after subtracting welfare cost. Πˢᵃ = Π − μ* · ΔW. If negative, the deal destroys more welfare than it creates.</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>Jensen's alpha — return above what risk justifies</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>A deal that looks like +$2.3M joint gain may be −$2.4M system-adjusted. Every GDSS deployed today shows only the first number.</td>
              </tr>
              <tr style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <td style={{padding:"10px",color:C.gold,fontWeight:600}}>W</td>
                <td style={{padding:"10px",color:C.text}}>W</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>The health of the shared system both parties are embedded in. Not A's welfare. Not B's welfare. The system's.</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>No CAPM equivalent — this is the variable CAPM cannot see</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>The Private Pareto Theorem proves W cannot be computed from bilateral payoffs. It is structurally outside the payoff space. This is the impossibility.</td>
              </tr>
              <tr style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <td style={{padding:"10px",color:C.gold,fontWeight:600}}>δ</td>
                <td style={{padding:"10px",color:C.text}}>delta</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>Total accumulated welfare cost at crossover — the damage done before the Hollow Win collapses.</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>No direct equivalent</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>VW: δ ≈ $3.7 billion in accumulated emissions damage before EPA notice of violation.</td>
              </tr>
              <tr style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <td style={{padding:"10px",color:C.gold,fontWeight:600}}>η</td>
                <td style={{padding:"10px",color:C.text}}>eta</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>How quickly system damage feeds back into private costs. Low η means the Hollow Win persists longer before collapsing.</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>Closest to mean reversion speed in financial models</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>VW: η ≈ 0.3. ERCOT: η ≈ 0 — no feedback until catastrophic failure.</td>
              </tr>
              <tr>
                <td style={{padding:"10px",color:C.gold,fontWeight:600}}>λ</td>
                <td style={{padding:"10px",color:C.text}}>lambda</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>Rate of welfare cost accumulation per unit of private gain. Combined with η and δ determines T*.</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>No direct equivalent</td>
                <td style={{padding:"10px",color:C.muted,fontFamily:C.serif}}>Higher λ means faster damage accumulation.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>

      {/* Footer */}
      <div style={{background:C.panel,borderTop:`1px solid ${C.border}`,padding:'10px 24px',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:40}}>
        <div style={{fontFamily:C.mono,fontSize:11,color:C.muted}}>Erik Postnieks · Wooster LLC · Postnieks Impossibility Program</div>
        <div style={{fontFamily:C.mono,fontSize:11,color:C.muted}}>SAPM Working Paper · 2026</div>
      </div>
    <SAPMNav />
      </div>
  );
}
