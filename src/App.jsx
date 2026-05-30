import React, { useState, useMemo } from "react";

/* ============================================================
   WILD ROSE — Western Canada Girls' Trip Planner
   A questionnaire that scores a seed database of attractions
   across MB / SK / AB / BC and recommends the top 3.
   ============================================================ */

/* ---------- VIBE TAGS (must match question option `tag`s) ---------- */
const VIBES = {
  mountains: "Mountains & scenery",
  city: "City & food",
  culture: "Arts & culture",
  wine: "Wine & culinary",
  wildlife: "Wildlife & bucket-list",
  nightlife: "Nightlife",
};

/* ---------- SEED DATABASE ----------
   io      : 0 = fully indoor ........ 1 = fully outdoor
   energy  : 0 = chill / spa ......... 1 = high-energy / physical
   festival: 0 = none ................ 1 = it's basically a festival
   budget  : [min,max] on a 1($)/2($$)/3($$$) scale
   seasons : "all" or array of winter|spring|summer|fall
   group   : "small" | "any" | "large"
*/
const ATTRACTIONS = [
  // ---------------- ALBERTA ----------------
  {
    id: "banff", name: "Banff & Lake Louise", area: "Banff National Park", prov: "AB",
    blurb: "Turquoise glacial lakes, gondolas and that postcard Rockies skyline. Hike hard or just sip wine on a patio with a mountain view.",
    io: 0.9, energy: 0.65, festival: 0.1, budget: [2, 3], seasons: "all",
    vibes: ["mountains", "wildlife"], group: "any",
  },
  {
    id: "kananaskis", name: "Kananaskis Nordic Spa", area: "Kananaskis, AB", prov: "AB",
    blurb: "Open-air hot pools, cold plunges and saunas tucked into the spruce. Pure thermal-cycle bliss with the peaks all around you.",
    io: 0.5, energy: 0.05, festival: 0, budget: [3, 3], seasons: "all",
    vibes: ["mountains"], group: "small",
  },
  {
    id: "stampede", name: "The Calgary Stampede", area: "Calgary, AB", prov: "AB",
    blurb: "Ten days of rodeo, midway, free pancakes, concerts and patios. The whole city dresses in denim and dances till late.",
    io: 0.5, energy: 0.6, festival: 1, budget: [1, 3], seasons: ["summer"],
    vibes: ["city", "nightlife", "culture"], group: "large",
  },
  {
    id: "jasper", name: "Jasper & the Columbia Icefield", area: "Jasper National Park", prov: "AB",
    blurb: "Wilder and quieter than Banff: glacier walks, elk on the road, canyon hikes and one of the world's largest dark-sky preserves.",
    io: 0.95, energy: 0.6, festival: 0, budget: [2, 3], seasons: ["spring", "summer", "fall"],
    vibes: ["mountains", "wildlife"], group: "any",
  },
  {
    id: "drumheller", name: "Drumheller & the Royal Tyrrell", area: "Badlands, AB", prov: "AB",
    blurb: "World-class dinosaur museum, hoodoos and a giant T-Rex you can climb. Goofy, photogenic and great when the weather turns.",
    io: 0.4, energy: 0.4, festival: 0, budget: [1, 2], seasons: "all",
    vibes: ["culture"], group: "any",
  },
  {
    id: "edmonton", name: "Edmonton: Mall + Festival City", area: "Edmonton, AB", prov: "AB",
    blurb: "West Edmonton Mall (waterpark, rides, shopping) in any weather, plus North America's biggest Fringe and a stacked summer festival calendar.",
    io: 0.25, energy: 0.4, festival: 0.6, budget: [1, 3], seasons: "all",
    vibes: ["city", "nightlife", "culture"], group: "large",
  },

  // ---------------- BRITISH COLUMBIA ----------------
  {
    id: "whistler", name: "Whistler", area: "Sea-to-Sky, BC", prov: "BC",
    blurb: "Ski and après in winter, bike park and alpine hikes in summer, and the Scandinave Spa year-round. Walkable village full of restaurants and bars.",
    io: 0.85, energy: 0.7, festival: 0.3, budget: [2, 3], seasons: "all",
    vibes: ["mountains", "nightlife", "city"], group: "any",
  },
  {
    id: "harrison", name: "Harrison Hot Springs", area: "Fraser Valley, BC", prov: "BC",
    blurb: "A lazy lakeside resort town built around natural hot springs. Easy day spa, lake float, and a short drive from Vancouver.",
    io: 0.4, energy: 0.1, festival: 0.1, budget: [2, 3], seasons: "all",
    vibes: ["mountains"], group: "small",
  },
  {
    id: "tofino", name: "Tofino", area: "Vancouver Island, BC", prov: "BC",
    blurb: "Wild Pacific surf, old-growth rainforest and dramatic winter storm-watching. Whale tours, beach saunas and seriously good seafood.",
    io: 0.9, energy: 0.55, festival: 0.1, budget: [2, 3], seasons: "all",
    vibes: ["wildlife", "mountains"], group: "small",
  },
  {
    id: "okanagan", name: "Okanagan Wine Country", area: "Kelowna, BC", prov: "BC",
    blurb: "Vineyard-hop by lake and orchard, then float the warm Okanagan all afternoon. Tasting flights, lakeside patios and golden-hour everything.",
    io: 0.55, energy: 0.3, festival: 0.2, budget: [2, 3], seasons: ["summer", "fall"],
    vibes: ["wine", "city"], group: "any",
  },
  {
    id: "victoria", name: "Victoria & Butchart Gardens", area: "Vancouver Island, BC", prov: "BC",
    blurb: "Afternoon tea, harbour strolls and the famous Butchart Gardens. Refined, walkable and very easy on a relaxed pace.",
    io: 0.5, energy: 0.3, festival: 0.2, budget: [2, 3], seasons: "all",
    vibes: ["city", "culture"], group: "any",
  },
  {
    id: "vancouver", name: "Vancouver", area: "Lower Mainland, BC", prov: "BC",
    blurb: "Big-city food scene, Stanley Park seawall, Granville Island and proper nightlife — with mountains and ocean in the same skyline.",
    io: 0.45, energy: 0.4, festival: 0.5, budget: [2, 3], seasons: "all",
    vibes: ["city", "nightlife", "culture"], group: "large",
  },
  {
    id: "nelson", name: "Nelson & Kootenay Hot Springs", area: "Kootenays, BC", prov: "BC",
    blurb: "An artsy heritage mountain town, indie cafés and galleries, with Ainsworth's cave hot springs a short drive away. Low-key and charming.",
    io: 0.6, energy: 0.4, festival: 0.3, budget: [1, 2], seasons: "all",
    vibes: ["mountains", "culture"], group: "small",
  },

  // ---------------- SASKATCHEWAN ----------------
  {
    id: "manitou", name: "Manitou Beach", area: "Little Manitou Lake, SK", prov: "SK",
    blurb: "Float effortlessly in the mineral-dense 'Dead Sea of Canada,' soak in the mineral spa, then two-step at historic Danceland. Quirky and restorative.",
    io: 0.5, energy: 0.1, festival: 0.1, budget: [1, 2], seasons: ["summer"],
    vibes: ["culture"], group: "small",
  },
  {
    id: "saskatoon", name: "Saskatoon", area: "Saskatoon, SK", prov: "SK",
    blurb: "A pretty riverbank city with the Remai Modern, Wanuskewin heritage park, a strong food scene and lively summer jazz & folk festivals.",
    io: 0.4, energy: 0.4, festival: 0.6, budget: [1, 2], seasons: "all",
    vibes: ["city", "culture", "nightlife"], group: "any",
  },
  {
    id: "grasslands", name: "Grasslands National Park", area: "Val Marie, SK", prov: "SK",
    blurb: "Wild bison, prairie-dog towns and one of the darkest night skies on the continent. Deeply remote, big-sky stargazing.",
    io: 1.0, energy: 0.6, festival: 0, budget: [1, 2], seasons: ["spring", "summer", "fall"],
    vibes: ["wildlife"], group: "small",
  },
  {
    id: "princealbert", name: "Prince Albert National Park", area: "Waskesiu, SK", prov: "SK",
    blurb: "Boreal lakes made for canoeing and lakeside cabins, plus the paddle out to Grey Owl's cabin. Classic, affordable Canadian-lake summer.",
    io: 0.95, energy: 0.6, festival: 0, budget: [1, 2], seasons: ["summer", "fall"],
    vibes: ["wildlife"], group: "any",
  },

  // ---------------- MANITOBA ----------------
  {
    id: "churchill", name: "Churchill", area: "Hudson Bay, MB", prov: "MB",
    blurb: "The bucket-list one: polar bears in fall, beluga whales in summer, northern lights in winter. Fly-in, unforgettable, splurge-worthy.",
    io: 0.9, energy: 0.4, festival: 0, budget: [3, 3], seasons: ["winter", "summer", "fall"],
    vibes: ["wildlife"], group: "small",
  },
  {
    id: "winnipeg", name: "Winnipeg & The Forks", area: "Winnipeg, MB", prov: "MB",
    blurb: "The Forks market, the striking Human Rights Museum and a genuinely fun festival town — Folklorama, the Folk Fest, and winter's Festival du Voyageur.",
    io: 0.4, energy: 0.4, festival: 0.8, budget: [1, 2], seasons: "all",
    vibes: ["city", "culture", "nightlife"], group: "large",
  },
  {
    id: "thermea", name: "Thermëa Spa", area: "Winnipeg, MB", prov: "MB",
    blurb: "A gorgeous Nordic thermal spa — hot pools, steam, eucalyptus saunas and cold plunges. The easiest reset in the prairies.",
    io: 0.4, energy: 0.05, festival: 0, budget: [2, 3], seasons: "all",
    vibes: ["city"], group: "small",
  },
  {
    id: "ridingmtn", name: "Riding Mountain National Park", area: "Wasagaming, MB", prov: "MB",
    blurb: "A bison enclosure, Clear Lake beaches and a cute resort townsite. Hiking, paddling and patio ice cream in equal measure.",
    io: 0.9, energy: 0.6, festival: 0.1, budget: [1, 2], seasons: ["summer", "fall"],
    vibes: ["wildlife", "mountains"], group: "any",
  },
];

/* ---------- QUESTIONNAIRE ---------- */
const QUESTIONS = [
  {
    key: "group", title: "How big is the crew?",
    sub: "Some spots shine for an intimate few, others for a whole squad.",
    type: "single",
    options: [
      { val: "2-3", label: "Just 2–3 of us" },
      { val: "4-6", label: "A group of 4–6" },
      { val: "7+", label: "Big group, 7+" },
    ],
  },
  {
    key: "budget", title: "What's the budget vibe?",
    sub: "Per person, roughly.",
    type: "single",
    options: [
      { val: 1, label: "Budget-friendly", note: "$" },
      { val: 2, label: "Comfortable mid-range", note: "$$" },
      { val: 3, label: "Treat ourselves", note: "$$$" },
    ],
  },
  {
    key: "season", title: "When are you going?",
    sub: "Season changes everything out here.",
    type: "single",
    options: [
      { val: "winter", label: "Winter" },
      { val: "spring", label: "Spring" },
      { val: "summer", label: "Summer" },
      { val: "fall", label: "Fall" },
      { val: "flex", label: "We're flexible" },
    ],
  },
  {
    key: "io", title: "Indoors or outdoors?",
    sub: "Be honest about how much you want to be in nature.",
    type: "single",
    options: [
      { val: 0, label: "Mostly indoors" },
      { val: 0.5, label: "A healthy mix" },
      { val: 1, label: "Get us outside" },
    ],
  },
  {
    key: "energy", title: "Active or restorative?",
    sub: "Adventure trip or recharge trip?",
    type: "single",
    options: [
      { val: 1, label: "Go-go-go, keep us moving" },
      { val: 0.5, label: "Balanced — a bit of both" },
      { val: 0, label: "Chill, spa, slow mornings" },
    ],
  },
  {
    key: "festival", title: "Festivals & live music?",
    sub: "Concerts, rodeos, food fests, dancing.",
    type: "single",
    options: [
      { val: 1, label: "Yes — that's the whole point" },
      { val: 0.5, label: "Sure, if it fits" },
      { val: 0, label: "Not really our thing" },
    ],
  },
  {
    key: "vibes", title: "What's calling your name?",
    sub: "Pick as many as you like.",
    type: "multi",
    options: Object.entries(VIBES).map(([tag, label]) => ({ val: tag, label })),
  },
  {
    key: "provs", title: "Anywhere in particular?",
    sub: "Pick provinces, or leave it open to us.",
    type: "multi",
    options: [
      { val: "MB", label: "Manitoba" },
      { val: "SK", label: "Saskatchewan" },
      { val: "AB", label: "Alberta" },
      { val: "BC", label: "British Columbia" },
      { val: "open", label: "Open to anywhere" },
    ],
  },
];

const PROV_NAME = { MB: "Manitoba", SK: "Saskatchewan", AB: "Alberta", BC: "British Columbia" };

/* ---------- SCORING RUBRIC ---------- */
function groupScore(best, userGroup) {
  if (best === "any") return 1;
  if (userGroup === "2-3") return best === "small" ? 1 : 0.5;
  if (userGroup === "7+") return best === "large" ? 1 : 0.4;
  return 0.85; // 4-6 works reasonably anywhere
}

function budgetScore([min, max], u) {
  if (u >= min && u <= max) return 1;
  if (u > max) return 0.95;            // more budget than needed — fine
  return Math.max(0.15, 1 - 0.5 * (min - u)); // can't really afford it
}

function seasonOk(seasons, s) {
  if (s === "flex" || seasons === "all") return true;
  return seasons.includes(s);
}

function scoreAttraction(a, ans) {
  const W = { vibes: 30, io: 16, energy: 16, budget: 12, festival: 12, group: 14 };

  // vibes: share of the user's chosen vibes this place delivers
  let vibeFit;
  if (!ans.vibes || ans.vibes.length === 0) {
    vibeFit = 0.6; // neutral baseline when nothing picked
  } else {
    const hits = ans.vibes.filter((v) => a.vibes.includes(v)).length;
    vibeFit = hits / ans.vibes.length;
  }

  const ioFit = 1 - Math.abs(a.io - ans.io);
  const energyFit = 1 - Math.abs(a.energy - ans.energy);
  const festFit = 1 - Math.abs(a.festival - ans.festival);
  const budFit = budgetScore(a.budget, ans.budget);
  const grpFit = groupScore(a.group, ans.group);

  let raw =
    vibeFit * W.vibes +
    ioFit * W.io +
    energyFit * W.energy +
    festFit * W.festival +
    budFit * W.budget +
    grpFit * W.group;

  const okSeason = seasonOk(a.seasons, ans.season);
  if (!okSeason) raw *= 0.35; // strong penalty for wrong season

  const pct = Math.round((raw / 100) * 100);

  // human-readable reasons
  const reasons = [];
  if (ans.vibes && ans.vibes.length) {
    const matched = ans.vibes.filter((v) => a.vibes.includes(v)).map((v) => VIBES[v].split(" ")[0]);
    if (matched.length) reasons.push(`${matched.join(" + ")} fit`);
  }
  if (ans.energy <= 0.25 && a.energy <= 0.25) reasons.push("Restorative & relaxing");
  if (ans.energy >= 0.75 && a.energy >= 0.55) reasons.push("Active & adventurous");
  if (ans.io >= 0.75 && a.io >= 0.75) reasons.push("Big outdoors energy");
  if (ans.io <= 0.25 && a.io <= 0.45) reasons.push("Lots to do indoors");
  if (ans.festival >= 0.5 && a.festival >= 0.6) reasons.push("Festivals & live music");
  if (budFit >= 1) reasons.push(["", "Budget-friendly", "Mid-range", "Splurge"][ans.budget] + " match");
  if (a.group === "large" && ans.group === "7+") reasons.push("Great for big groups");
  if (a.group === "small" && ans.group === "2-3") reasons.push("Perfect for a small crew");

  const seasonLabel = a.seasons === "all" ? "Year-round" : "Best in " + a.seasons.map(cap).join(", ");
  if (!okSeason) reasons.unshift("⚠ Off-season for your dates");

  return { ...a, pct, reasons: reasons.slice(0, 4), seasonLabel, okSeason };
}

function recommend(ans) {
  let pool = ATTRACTIONS;
  if (ans.provs && ans.provs.length && !ans.provs.includes("open")) {
    pool = pool.filter((a) => ans.provs.includes(a.prov));
  }
  return pool
    .map((a) => scoreAttraction(a, ans))
    .sort((x, y) => y.pct - x.pct)
    .slice(0, 3);
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const PRICE = { 1: "$", 2: "$$", 3: "$$$" };

/* ============================================================
   UI
   ============================================================ */
export default function App() {
  const [view, setView] = useState("intro"); // intro | quiz | results
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState({});

  const q = QUESTIONS[step];
  const results = useMemo(() => (view === "results" ? recommend(ans) : []), [view, ans]);

  const setSingle = (key, val) => {
    setAns((p) => ({ ...p, [key]: val }));
    setTimeout(next, 180);
  };
  const toggleMulti = (key, val) => {
    setAns((p) => {
      const cur = new Set(p[key] || []);
      if (key === "provs" && val === "open") return { ...p, provs: cur.has("open") ? [] : ["open"] };
      if (key === "provs" && cur.has("open")) cur.delete("open");
      cur.has(val) ? cur.delete(val) : cur.add(val);
      return { ...p, [key]: [...cur] };
    });
  };
  const next = () => (step < QUESTIONS.length - 1 ? setStep((s) => s + 1) : setView("results"));
  const back = () => (step > 0 ? setStep((s) => s - 1) : setView("intro"));
  const restart = () => { setAns({}); setStep(0); setView("intro"); };

  const answered =
    q && (q.type === "single" ? ans[q.key] !== undefined : (ans[q.key] || []).length > 0);

  return (
    <div className="wr-root">
      <style>{CSS}</style>

      {/* ---------------- INTRO ---------------- */}
      {view === "intro" && (
        <section className="hero">
          <Mountains />
          <div className="hero-inner">
            <span className="kicker">Manitoba · Saskatchewan · Alberta · British Columbia</span>
            <h1 className="display">
              Wild Rose<span className="amp">&</span>
              <em>Western Canada girls' trip planner</em>
            </h1>
            <p className="lede">
              Eight quick questions. We score every spot in our little black book
              against what your crew actually wants — and hand you the top three.
            </p>
            <button className="btn-primary" onClick={() => { setView("quiz"); setStep(0); }}>
              Plan our trip →
            </button>
            <div className="hero-meta">{ATTRACTIONS.length} curated destinations · 4 provinces</div>
          </div>
        </section>
      )}

      {/* ---------------- QUIZ ---------------- */}
      {view === "quiz" && q && (
        <section className="quiz">
          <div className="quiz-top">
            <button className="link" onClick={back}>← Back</button>
            <div className="progress">
              <div className="progress-fill" style={{ width: `${((step) / QUESTIONS.length) * 100}%` }} />
            </div>
            <span className="count">{step + 1} / {QUESTIONS.length}</span>
          </div>

          <div className="q-body" key={step}>
            <h2 className="q-title">{q.title}</h2>
            <p className="q-sub">{q.sub}</p>

            <div className={`opts ${q.type === "multi" ? "opts-multi" : ""}`}>
              {q.options.map((o) => {
                const selected =
                  q.type === "single"
                    ? ans[q.key] === o.val
                    : (ans[q.key] || []).includes(o.val);
                return (
                  <button
                    key={String(o.val)}
                    className={`opt ${selected ? "sel" : ""}`}
                    onClick={() =>
                      q.type === "single" ? setSingle(q.key, o.val) : toggleMulti(q.key, o.val)
                    }
                  >
                    {o.note && <span className="opt-note">{o.note}</span>}
                    <span className="opt-label">{o.label}</span>
                    {q.type === "multi" && <span className="check">{selected ? "✓" : "+"}</span>}
                  </button>
                );
              })}
            </div>

            {q.type === "multi" && (
              <button className="btn-primary next" disabled={!answered} onClick={next}>
                {step === QUESTIONS.length - 1 ? "See our matches →" : "Next →"}
              </button>
            )}
          </div>
        </section>
      )}

      {/* ---------------- RESULTS ---------------- */}
      {view === "results" && (
        <section className="results">
          <div className="results-head">
            <span className="kicker">Your top three</span>
            <h2 className="display sm">Pack your bags, ladies.</h2>
            <p className="lede sm">Based on your answers, here's where your crew should be headed.</p>
          </div>

          <div className="cards">
            {results.map((r, i) => (
              <article className="card" key={r.id} style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="rank">{["01", "02", "03"][i]}</div>
                <div className="card-main">
                  <div className="card-head">
                    <div>
                      <span className="prov-badge">{PROV_NAME[r.prov]}</span>
                      <h3 className="card-name">{r.name}</h3>
                      <span className="area">{r.area}</span>
                    </div>
                    <Ring pct={r.pct} top={i === 0} />
                  </div>
                  <p className="card-blurb">{r.blurb}</p>
                  <div className="chips">
                    {r.reasons.map((re) => (
                      <span className={`chip ${re.startsWith("⚠") ? "warn" : ""}`} key={re}>{re}</span>
                    ))}
                  </div>
                  <div className="card-foot">
                    <span className="price">{PRICE[r.budget[0]]}{r.budget[1] > r.budget[0] ? "–" + PRICE[r.budget[1]] : ""}</span>
                    <span className="dot">·</span>
                    <span>{r.seasonLabel}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <button className="btn-ghost" onClick={restart}>↺ Start over</button>
        </section>
      )}
    </div>
  );
}

/* ---------- score ring ---------- */
function Ring({ pct, top }) {
  return (
    <div className={`ring ${top ? "ring-top" : ""}`} style={{ "--p": pct }}>
      <span>{pct}<i>%</i></span>
      <small>match</small>
    </div>
  );
}

/* ---------- decorative layered mountains ---------- */
function Mountains() {
  return (
    <svg className="mtn" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F3D9A6" />
          <stop offset="1" stopColor="#F6EFE2" />
        </linearGradient>
      </defs>
      <rect width="1440" height="420" fill="url(#sky)" />
      <circle cx="1060" cy="150" r="70" fill="#E9A85A" opacity="0.85" />
      <path d="M0 300 L220 150 L360 250 L520 120 L700 270 L860 160 L1040 280 L1220 170 L1440 300 L1440 420 L0 420Z" fill="#C9743E" opacity="0.5" />
      <path d="M0 360 L180 240 L340 330 L520 220 L700 340 L900 250 L1100 360 L1300 260 L1440 350 L1440 420 L0 420Z" fill="#9C4F2C" opacity="0.65" />
      <path d="M0 420 L160 330 L380 400 L600 320 L820 410 L1040 330 L1280 410 L1440 350 L1440 420Z" fill="#2D5650" />
    </svg>
  );
}

/* ============================================================ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Albert+Sans:wght@400;500;600;700&display=swap');

.wr-root{
  --cream:#F6EFE2; --cream2:#EFE6D4; --card:#FFFCF5;
  --ink:#23302A; --ink2:#5A675F;
  --terra:#C25A36; --terra-d:#A8431F; --teal:#2D5650; --gold:#CB9A3C;
  --line:rgba(35,48,42,.14);
  font-family:'Albert Sans',system-ui,sans-serif;
  color:var(--ink); background:var(--cream);
  min-height:100%; -webkit-font-smoothing:antialiased;
  border-radius:14px; overflow:hidden;
}
.wr-root *{box-sizing:border-box;}
.display{font-family:'Fraunces',serif; font-weight:600; line-height:.98; letter-spacing:-.015em;}
.kicker{font-size:11.5px; letter-spacing:.22em; text-transform:uppercase; color:var(--teal); font-weight:600;}
.lede{font-size:17px; line-height:1.55; color:var(--ink2); max-width:46ch;}
.lede.sm{font-size:15px;}

/* ---- hero ---- */
.hero{position:relative; min-height:560px; display:flex; align-items:flex-end;}
.mtn{position:absolute; inset:0; width:100%; height:100%; z-index:0;}
.hero-inner{position:relative; z-index:1; padding:48px 44px 56px; max-width:680px;}
.hero .display{font-size:clamp(40px,6vw,68px); margin:14px 0 0; color:var(--ink);}
.hero .amp{display:inline-block; color:var(--terra); font-style:italic; margin:0 .12em; transform:translateY(.04em);}
.hero .display em{display:block; font-size:.34em; font-style:italic; font-weight:500; color:var(--teal); letter-spacing:0; margin-top:.5em;}
.hero .lede{margin:22px 0 28px;}
.hero-meta{margin-top:18px; font-size:13px; color:var(--ink2); letter-spacing:.02em;}

/* ---- buttons ---- */
.btn-primary{
  font-family:inherit; font-size:16px; font-weight:600; color:#fff;
  background:var(--terra); border:none; border-radius:999px;
  padding:15px 30px; cursor:pointer; transition:.25s; box-shadow:0 8px 22px rgba(168,67,31,.25);
}
.btn-primary:hover{background:var(--terra-d); transform:translateY(-2px);}
.btn-primary:disabled{opacity:.4; cursor:not-allowed; transform:none; box-shadow:none;}
.btn-primary.next{margin-top:30px;}
.btn-ghost{
  font-family:inherit; font-size:14px; font-weight:600; color:var(--teal);
  background:transparent; border:1.5px solid var(--line); border-radius:999px;
  padding:11px 22px; cursor:pointer; transition:.2s; margin:8px auto 0; display:block;
}
.btn-ghost:hover{border-color:var(--teal); background:rgba(45,86,80,.05);}
.link{font-family:inherit; background:none; border:none; color:var(--ink2); font-size:14px; font-weight:600; cursor:pointer; padding:4px 0;}
.link:hover{color:var(--ink);}

/* ---- quiz ---- */
.quiz{padding:34px 44px 54px; max-width:720px; margin:0 auto;}
.quiz-top{display:flex; align-items:center; gap:18px; margin-bottom:40px;}
.progress{flex:1; height:5px; background:var(--cream2); border-radius:99px; overflow:hidden;}
.progress-fill{height:100%; background:var(--teal); border-radius:99px; transition:width .4s cubic-bezier(.4,0,.1,1);}
.count{font-size:12.5px; color:var(--ink2); font-weight:600; font-variant-numeric:tabular-nums;}
.q-body{animation:rise .45s cubic-bezier(.2,.7,.2,1);}
.q-title{font-family:'Fraunces',serif; font-weight:600; font-size:clamp(28px,4.4vw,40px); margin:0; letter-spacing:-.01em;}
.q-sub{color:var(--ink2); font-size:15.5px; margin:10px 0 30px;}
.opts{display:flex; flex-direction:column; gap:11px;}
.opts-multi{display:grid; grid-template-columns:1fr 1fr; gap:11px;}
.opt{
  font-family:inherit; text-align:left; background:var(--card); border:1.5px solid var(--line);
  border-radius:15px; padding:17px 20px; cursor:pointer; transition:.18s;
  display:flex; align-items:center; gap:14px; color:var(--ink); font-size:16px; font-weight:500;
}
.opt:hover{border-color:var(--teal); transform:translateX(3px);}
.opts-multi .opt:hover{transform:translateY(-2px);}
.opt.sel{border-color:var(--terra); background:#fff; box-shadow:0 0 0 3px rgba(194,90,54,.14);}
.opt-note{font-family:'Fraunces',serif; font-weight:600; color:var(--terra); font-size:18px; min-width:34px;}
.opt-label{flex:1;}
.check{margin-left:auto; width:24px; height:24px; border-radius:50%; display:grid; place-items:center;
  background:var(--cream2); color:var(--ink2); font-weight:700; font-size:14px; transition:.18s;}
.opt.sel .check{background:var(--terra); color:#fff;}

/* ---- results ---- */
.results{padding:40px 40px 50px; max-width:820px; margin:0 auto;}
.results-head{text-align:center; margin-bottom:34px;}
.results-head .display.sm{font-size:clamp(30px,4.6vw,42px); margin:12px 0 8px;}
.results-head .lede{margin:0 auto;}
.cards{display:flex; flex-direction:column; gap:18px;}
.card{
  background:var(--card); border:1.5px solid var(--line); border-radius:20px;
  display:flex; overflow:hidden; opacity:0; animation:rise .55s cubic-bezier(.2,.7,.2,1) forwards;
}
.card:first-child{border-color:rgba(203,154,60,.55); box-shadow:0 14px 36px rgba(168,67,31,.1);}
.rank{font-family:'Fraunces',serif; font-weight:600; font-size:22px; color:#fff; background:var(--teal);
  display:grid; place-items:center; min-width:60px; letter-spacing:.02em;}
.card:first-child .rank{background:var(--terra);}
.card-main{padding:22px 24px; flex:1;}
.card-head{display:flex; justify-content:space-between; gap:16px; align-items:flex-start;}
.prov-badge{font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--teal); font-weight:700;}
.card-name{font-family:'Fraunces',serif; font-weight:600; font-size:23px; margin:5px 0 2px; line-height:1.05;}
.area{font-size:13px; color:var(--ink2);}
.card-blurb{font-size:14.5px; line-height:1.55; color:var(--ink2); margin:14px 0 16px;}
.chips{display:flex; flex-wrap:wrap; gap:7px; margin-bottom:16px;}
.chip{font-size:12px; font-weight:600; color:var(--teal); background:rgba(45,86,80,.09);
  padding:5px 11px; border-radius:99px;}
.chip.warn{color:var(--terra-d); background:rgba(168,67,31,.1);}
.card-foot{display:flex; align-items:center; gap:9px; font-size:13px; color:var(--ink2); font-weight:500;}
.price{font-family:'Fraunces',serif; font-weight:600; color:var(--ink); font-size:15px;}
.dot{opacity:.5;}

/* ---- score ring ---- */
.ring{
  --p:0; min-width:64px; width:64px; height:64px; border-radius:50%;
  background:conic-gradient(var(--teal) calc(var(--p)*1%), var(--cream2) 0);
  display:grid; place-items:center; position:relative; flex-shrink:0;
}
.ring::before{content:""; position:absolute; inset:6px; background:var(--card); border-radius:50%;}
.ring-top{background:conic-gradient(var(--terra) calc(var(--p)*1%), var(--cream2) 0);}
.ring span{position:relative; font-family:'Fraunces',serif; font-weight:600; font-size:19px; line-height:1;}
.ring span i{font-style:normal; font-size:11px;}
.ring small{position:relative; font-size:8.5px; letter-spacing:.14em; text-transform:uppercase; color:var(--ink2); margin-top:1px;}

@keyframes rise{from{opacity:0; transform:translateY(16px);} to{opacity:1; transform:translateY(0);}}

@media(max-width:600px){
  .hero-inner,.quiz,.results{padding-left:22px; padding-right:22px;}
  .opts-multi{grid-template-columns:1fr;}
  .card{flex-direction:column;}
  .rank{min-width:0; padding:8px; font-size:16px;}
}
`;
