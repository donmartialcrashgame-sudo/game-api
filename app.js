window.GameApiAppReady = (async () => {
  if (window.__GAME_API_APP_LOADED__) return window.GameApiApp;

  window.__GAME_API_APP_LOADED__ = true;
  const NAV = [
    { title: "MARKETS", items: [
      ["▦", "Dashboard", "dashboard.html"],
      ["⌘", "API Keys", "api-keys.html"],
      ["◉", "Test API", "test.html"],
      ["◌", "Usage", "usage.html"],
      ["▣", "Projects", "projects.html"]
    ]},
    { title: "PLATFORM", items: [
      ["◈", "Live Stream", "live.html"],
      ["▤", "Documentation", "documentation.html"],
      ["●", "Status", "status.html"],
      ["◇", "Plans", "pricing.html"],
      ["⌾", "Security", "mfa-setup.html"]
    ]},
    { title: "ACCOUNT", items: [
      ["⚙", "Settings", "settings.html"]
    ]}
  ];

  let sidebarPrefs = { position: "left", collapsed: false, color: "blue" }; try { sidebarPrefs = { ...sidebarPrefs, ...JSON.parse(localStorage.getItem("gaming_api_sidebar") || "{}") }; } catch {}
  const colors = { dark: ["#07101b","#5b8cff"], blue: ["#07101b","#5b8cff"], purple: ["#100a1b","#9b6cff"], green: ["#071711","#22c99a"], slate: ["#0d1118","#8796aa"], white: ["#ffffff","#3569e8"] };
  const theme = colors[sidebarPrefs.color] || colors.dark;
  const SUPABASE_URL = "https://qbagxeqquskkjksoraiz.supabase.co";
  const SUPABASE_KEY = "sb_publishable_chfRxHSFPSA1SZJtBajtKA_I7vs8R--";
  let authClient = null;
  let currentSession = null;
  async function getAuthClient() {
    if (authClient) return authClient;
    const mod = await import("https://esm.sh/@supabase/supabase-js@2.105.0");
    authClient = mod.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    window.supabase = authClient;
    return authClient;
  }
  const publicPages = new Set(["", "index.html", "login.html", "signup.html", "forgot-password.html", "reset-password.html", "about.html", "status.html", "contact.html", "live.html", "documentation.html", "api-reference.html", "test.html", "pricing.html", "guide.html", "policy.html", "agreement.html", "usage-details.html"]);
  const developerPages = new Set(["dashboard.html", "api-keys.html", "test.html", "usage.html", "projects.html", "documentation.html", "api-reference.html", "guide.html", "settings.html", "mfa-setup.html", "passkey-setup.html", "verify-mfa.html"]);
  const pageName = location.pathname.split("/").pop() || "index.html";
  const isPublicPage = publicPages.has(pageName);
  const isDeveloperPage = developerPages.has(pageName);
  const isGuidePage = pageName === "guide.html";

  const manifestLink = document.createElement("link");
  manifestLink.rel = "manifest";
  manifestLink.href = "/manifest.json";
  document.head.appendChild(manifestLink);

  const css = `
.has-app-sidebar{padding-left:269px!important}.has-app-sidebar .app-sidebar{left:0}.has-app-sidebar .side,.has-app-sidebar .sidebar{display:none!important}.has-app-sidebar .main{margin-left:0!important;width:100%!important}.app-sidebar{background:var(--app-sidebar-bg,#07101b)}
.app-sidebar-white .app-sidebar{background:#fff!important;border-right:1px solid #dce3ee!important}.app-sidebar-white .app-brand{color:#172033}.app-sidebar-white .app-brand small{color:#7a879b}.app-sidebar-white .app-title{color:#8793a6}.app-sidebar-white .app-nav a{color:#526078}.app-sidebar-white .app-nav a:hover,.app-sidebar-white .app-nav a.active{background:#3569e80d;color:#172033;box-shadow:inset 2px 0 #3569e8}.app-sidebar-white .app-user{background:#f6f8fc;border-color:#e1e6ef;color:#172033}.app-sidebar-white .app-user span{color:#7a879b}.app-sidebar-white .app-out{background:#f6f8fc;border-color:#e1e6ef;color:#526078}.app-sidebar-white .app-menu{background:#fff;color:#172033;border-color:#dce3ee}.app-sidebar-white .app-upgrade{background:linear-gradient(135deg,#3569e8,#7047e8)}.app-sidebar.app-collapsed{width:72px}.app-sidebar.app-collapsed .app-brand span:last-child,.app-sidebar.app-collapsed .app-title,.app-sidebar.app-collapsed .app-nav a{font-size:0}.app-sidebar.app-collapsed .app-brand{justify-content:center}.app-sidebar.app-collapsed .app-nav a{display:grid;place-items:center}.app-sidebar.app-collapsed .app-user,.app-sidebar.app-collapsed .app-upgrade{display:none}.app-sidebar.app-collapsed .app-out{font-size:0}.app-sidebar.app-collapsed .app-out:after{content:'↪';font-size:14px}.app-sidebar.app-top{width:100%;height:66px;inset:0 0 auto 0;flex-direction:row;align-items:center;border-right:0;border-bottom:1px solid #ffffff10;padding:8px 14px}.app-top-body{padding-top:66px}.app-top .app-brand{padding:0 10px}.app-top .app-group{padding:0;display:flex;align-items:center}.app-top .app-title,.app-top .app-user,.app-top .app-out{display:none}.app-top .app-nav{display:flex}.app-top .app-bottom{margin-left:auto}.app-top .app-upgrade{margin:0;width:auto}@media(max-width:900px){.has-app-sidebar{padding-left:0}}
.app-sidebar{width:245px;position:fixed;inset:0 auto 0 0;background:#07101b;border-right:1px solid #ffffff10;padding:15px 12px;display:flex;flex-direction:column;z-index:100}
.app-brand{display:flex;align-items:center;gap:10px;padding:7px 9px 22px;font-weight:900;color:#f3f7fb;text-decoration:none}
.app-logo{width:37px;height:37px;border-radius:10px;display:grid;place-items:center;background:linear-gradient(135deg,#5b8cff,#7047e8);box-shadow:0 8px 28px #5b8cff24}
.app-brand small{display:block;color:#58677d;font-size:8px;letter-spacing:1.2px;margin-top:2px}
.app-group{padding-top:12px}.app-title{padding:0 10px 7px;color:#4f5e73;font-size:8px;font-weight:900;letter-spacing:1.2px}
.app-nav{display:grid;gap:3px}.app-nav a{color:#9aa8bc;text-decoration:none;padding:10px;border-radius:8px;font-size:11px;font-weight:700}
.app-nav a:hover,.app-nav a.active{background:#5b8cff12;color:#fff;box-shadow:inset 2px 0 #5b8cff}
.app-bottom{margin-top:auto}.app-user{padding:10px;border:1px solid #ffffff10;border-radius:9px;background:#ffffff03;font-size:9px;color:#f3f7fb}
.app-user b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.app-user span{color:#58677d}
.app-upgrade{display:flex;align-items:center;justify-content:center;width:100%;margin-top:9px;padding:10px;border-radius:8px;background:linear-gradient(135deg,#5b8cff,#7047e8);color:#fff;text-decoration:none;font-size:10px;font-weight:900;box-shadow:0 8px 22px #5b8cff20}.app-upgrade:hover{filter:brightness(1.08);transform:translateY(-1px)}
.app-out{width:100%;margin-top:7px;background:#ffffff04;border:1px solid #ffffff10;color:#9eabbc;border-radius:8px;padding:9px;cursor:pointer;font-weight:800;font-size:10px}
.app-menu{display:none;position:fixed;left:12px;top:12px;z-index:110;border:1px solid #ffffff18;background:#0b1523;color:#fff;border-radius:8px;padding:9px 11px;cursor:pointer}
.app-shade{display:none;position:fixed;inset:0;background:#0009;z-index:90}
@media(max-width:900px){
  .has-app-sidebar{padding-left:0!important;overflow-x:hidden!important}
  .has-app-sidebar .main,.has-app-sidebar .content,.has-app-sidebar .page,.has-app-sidebar .container{
    width:100%!important;max-width:100%!important;min-width:0!important;margin-left:0!important;margin-right:0!important;
  }
  .has-app-sidebar img,.has-app-sidebar video,.has-app-sidebar canvas,.has-app-sidebar svg{max-width:100%;height:auto}
  .has-app-sidebar table{max-width:100%;display:block;overflow-x:auto}
  .app-sidebar{transform:translateX(-100%);transition:transform .2s}
  .app-sidebar.open{transform:none;box-shadow:20px 0 60px #000}
  .app-menu{display:block}
  .app-shade.show{display:block}
}
  `;
  document.documentElement.style.setProperty("--app-sidebar-bg", theme[0]);
  document.documentElement.style.setProperty("--app-sidebar-accent", theme[1]);
  if (sidebarPrefs.color === "white") document.body.classList.add("app-sidebar-white");
  if (isDeveloperPage && sidebarPrefs.position === "top") document.body.classList.add("app-top-body");
  const style = document.createElement("style");
  style.id = "game-api-app-style";
  style.textContent = css;
  document.head.appendChild(style);

  let host = document.getElementById("appSidebar");
  if (isDeveloperPage) {
    if (!host) { host = document.createElement("div"); host.id = "appSidebar"; document.body.prepend(host); }
    document.body.classList.add("has-app-sidebar");
  }

  const current = location.pathname.split("/").pop() || "dashboard.html";
  const nav = NAV.map(group => `
    <div class="app-group">
      <div class="app-title">${group.title}</div>
      <nav class="app-nav">
        ${group.items.map(([icon,label,href]) => `<a class="${current === href ? "active" : ""}" href="${href}">${icon} &nbsp; ${label}</a>`).join("")}
      </nav>
    </div>
  `).join("");

  if (isDeveloperPage) host.innerHTML = `
    <aside class="app-sidebar" id="appSide">
      <a class="app-brand" href="dashboard.html"><span class="app-logo">G</span><span>Game API<small>DEVELOPER CONSOLE</small></span></a>
      ${nav}
      <div class="app-bottom">
        <div class="app-user"><b id="email">Authenticated</b><span>Developer account</span></div>
        <a class="app-upgrade" id="appPlanAction" href="pricing.html">✦ Upgrade Plan</a>
        <button class="app-out" id="signout">Sign out</button>
      </div>
    </aside>
    <button class="app-menu" id="appMenu" aria-label="Open navigation">☰</button>
    <div class="app-shade" id="appShade"></div>
  `;

  const side = document.getElementById("appSide");
  if (side) {
    if (sidebarPrefs.position === "top") side.classList.add("app-top");
    if (sidebarPrefs.collapsed) side.classList.add("app-collapsed");
  }
  const shade = document.getElementById("appShade");
  const toggle = () => {
    if (!side || !shade) return;
    side.classList.toggle("open");
    shade.classList.toggle("show");
  };
  const menu = document.getElementById("appMenu");
  if (menu) menu.onclick = toggle;
  const signout = document.getElementById("signout");
  if (signout) signout.onclick = async () => {
    try { const sb = await getAuthClient(); await sb.auth.signOut(); }
    catch {}
    location.replace("login.html");
  };
  if (shade) shade.onclick = () => { side?.classList.remove("open"); shade.classList.remove("show"); };

  async function loadCurrentPlan() {
    try {
      const sb = await getAuthClient();
      const { data } = await sb.auth.getSession();
      if (!data.session) return;
      const response = await fetch("https://api.game-api.online/api/payments/subscription", {
        headers: { Authorization: "Bearer " + data.session.access_token },
        cache: "no-store"
      });
      if (!response.ok) return;
      const result = await response.json();
      const plan = String(result.plan || "free").toLowerCase();
      const label = plan.charAt(0).toUpperCase() + plan.slice(1);
      const action = document.getElementById("appPlanAction");
      const dashboardAction = document.getElementById("dashboardPlanAction");
      if (action) {
        action.textContent = plan === "free" ? "✦ Upgrade Plan" : "✓ Current Plan: " + label;
        action.setAttribute("aria-label", plan === "free" ? "Upgrade Plan" : "Current plan: " + label);
      }
      if (dashboardAction) {
        dashboardAction.textContent = plan === "free" ? "✦ Upgrade" : "✓ Current Plan: " + label;
      }
      const accountPlan = document.querySelector("[data-current-plan]");
      if (accountPlan) accountPlan.textContent = label;
      window.GameApiApp.currentPlan = plan;
    } catch {}
  }
  async function ensureRealAuthentication() {
    try {
      const sb = await getAuthClient();
      const { data, error } = await sb.auth.getSession();
      if (error) throw error;
      currentSession = data.session;
      if (!currentSession && !isPublicPage) {
        location.replace("login.html?redirect=" + encodeURIComponent(location.href));
        return false;
      }
      if (currentSession) {
        const email = currentSession.user?.email || "Authenticated";
        const emailEl = document.getElementById("email");
        if (emailEl) emailEl.textContent = email;
      }
      return true;
    } catch (error) {
      console.error("Authentication check failed:", error);
      if (!isPublicPage) location.replace("login.html");
      return false;
    }
  }

  async function showDashboardOnboarding() {
    if (!currentSession || isPublicPage || isGuidePage) return;
    if (pageName !== "dashboard.html") return;
    const seen = currentSession.user?.user_metadata?.getting_started_seen === true;
    if (seen) return;

    const style = document.createElement("style");
    style.textContent = `
      .ga-onboard{position:fixed;inset:0;background:#02050bd9;backdrop-filter:blur(10px);z-index:1000;display:grid;place-items:center;padding:18px}
      .ga-onboard-card{width:min(760px,100%);max-height:min(88vh,760px);overflow:auto;background:linear-gradient(145deg,#0d1728,#07101b);border:1px solid #ffffff16;border-radius:18px;box-shadow:0 35px 120px #000; color:#f5f7fb}
      .ga-onboard-head{padding:22px 24px;border-bottom:1px solid #ffffff10;display:flex;justify-content:space-between;gap:15px}
      .ga-onboard-kicker{color:#83a8ff;font-size:9px;font-weight:900;letter-spacing:1.4px}.ga-onboard-title{font-size:22px;font-weight:900;margin-top:6px}.ga-onboard-sub{color:#8d9ab0;font-size:10px;margin-top:5px;line-height:1.6}
      .ga-onboard-progress{height:5px;background:#172337;border-radius:5px;margin-top:14px;overflow:hidden}.ga-onboard-progress i{display:block;height:100%;background:linear-gradient(90deg,#5b8cff,#25d39a);width:20%;transition:.25s}
      .ga-onboard-body{padding:24px}.ga-step{display:none}.ga-step.active{display:block}.ga-step h3{font-size:18px;margin:0 0 8px}.ga-step p{color:#9aa8ba;font-size:11px;line-height:1.75;margin:0 0 15px}.ga-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.ga-box{border:1px solid #ffffff0d;border-radius:11px;padding:14px;background:#ffffff03}.ga-box b{font-size:11px}.ga-box span{display:block;color:#8d9ab0;font-size:10px;line-height:1.65;margin-top:5px}.ga-code{background:#03070d;border:1px solid #ffffff10;border-radius:10px;padding:13px;margin-top:12px;overflow:auto}.ga-code code{font:10px/1.7 ui-monospace,monospace;color:#cfe0ff;white-space:pre-wrap}.ga-note{margin-top:12px;padding:11px;border-left:3px solid #5b8cff;background:#5b8cff08;color:#9aa8ba;font-size:10px;line-height:1.65}.ga-foot{padding:15px 24px;border-top:1px solid #ffffff10;display:flex;justify-content:space-between;gap:10px}.ga-btn{border:1px solid #ffffff14;background:#ffffff05;color:#dce5f2;padding:10px 14px;border-radius:8px;font-size:10px;font-weight:900;cursor:pointer}.ga-btn.primary{border:0;background:linear-gradient(135deg,#5b8cff,#3569e8);color:white}.ga-btn:disabled{opacity:.35}.ga-link{color:#8eb0ff;font-weight:800;text-decoration:none}
      @media(max-width:650px){.ga-grid{grid-template-columns:1fr}.ga-onboard-body{padding:18px}.ga-onboard-head,.ga-foot{padding:16px}.ga-onboard-title{font-size:18px}}
    `;
    document.head.appendChild(style);
    const steps = [
      {title:"Welcome to your Game API dashboard",html:`<p>This guided tour will teach you the complete workflow. You will learn where your account tools are, how to create an API key, exactly how authentication works, how to make your first API request, and how to connect it to your application.</p><div class="ga-grid"><div class="ga-box"><b>Dashboard</b><span>Your account control center for plan, API activity and quick actions.</span></div><div class="ga-box"><b>API Keys</b><span>Create and manage credentials for your applications.</span></div><div class="ga-box"><b>Test API</b><span>Test your production endpoints before writing your integration.</span></div><div class="ga-box"><b>Documentation</b><span>Reference endpoints, authentication and integration details.</span></div></div><div class="ga-note">You can open this tutorial again from <a class="ga-link" href="guide.html">Getting Started</a>.</div>`},
      {title:"Step 2 — Check your plan",html:`<p>Your plan determines the request capacity and active API-key allowance available to your account.</p><div class="ga-grid"><div class="ga-box"><b>Current plan</b><span>Shown on your dashboard and Plans page.</span></div><div class="ga-box"><b>Usage</b><span>Use the Usage page to monitor requests and remaining capacity.</span></div></div><div class="ga-note">You can change plans later from <a class="ga-link" href="pricing.html">Plans</a>. Your current paid plan is not offered as a duplicate purchase.</div>`},
      {title:"Step 3 — Create your API key",html:`<p>Go to <a class="ga-link" href="api-keys.html">API Keys</a> and select <b>Create new key</b>. Give the key a useful name such as <b>Production Server</b> or <b>Development</b>.</p><div class="ga-grid"><div class="ga-box"><b>What the key does</b><span>It identifies and authenticates your application when it calls the Game API.</span></div><div class="ga-box"><b>Keep the secret private</b><span>Never publish it in GitHub, screenshots, public chat, or frontend JavaScript.</span></div></div><div class="ga-note">If a secret is exposed, revoke that key and create a replacement.</div>`},
      {title:"Step 4 — Put the API key in the request",html:`<p>The Game API uses a Bearer token in the HTTP <b>Authorization</b> header. The secret does not belong in the URL.</p><div class="ga-code"><code>POST https://api.game-api.online/api/v1/crash/rounds
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{"limit":10}</code></div><div class="ga-note">Replace <b>YOUR_API_KEY</b> with the secret you generated. For production, store it in a server-side environment variable such as <b>GAME_API_KEY</b>.</div>`},
      {title:"Step 5 — Test your first request",html:`<p>Open <a class="ga-link" href="test.html">Test API</a>. Enter your API secret, choose <b>Crash rounds</b>, set the limit to 10, and send the request.</p><div class="ga-grid"><div class="ga-box"><b>200 response</b><span>Your request was accepted and the API returned JSON.</span></div><div class="ga-box"><b>401 response</b><span>Check that the secret is correct and has not been revoked.</span></div><div class="ga-box"><b>429 response</b><span>Your plan's request limit has been reached for the current period.</span></div><div class="ga-box"><b>Server error</b><span>Check the Status page and your request format.</span></div></div>`},
      {title:"Step 6 — Connect your application",html:`<p>After testing, move the request into your backend. Do not expose the real secret to browser visitors.</p><div class="ga-code"><code>const response = await fetch(
  "https://api.game-api.online/api/v1/crash/rounds",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + process.env.GAME_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ limit: 10 })
  }
);</code></div><div class="ga-note">For realtime data, use the production WebSocket endpoint: <b>wss://api.game-api.online/realtime</b>.</div>`},
      {title:"Step 7 — Monitor and stay secure",html:`<p>You are ready to use the platform. Keep your API keys private, monitor usage, and use the dashboard when troubleshooting.</p><div class="ga-grid"><div class="ga-box"><b>Usage</b><span>Monitor API consumption.</span></div><div class="ga-box"><b>Status</b><span>Check service availability.</span></div><div class="ga-box"><b>Security</b><span>Manage authenticator protection.</span></div><div class="ga-box"><b>Live Stream</b><span>Explore realtime game events.</span></div></div><div class="ga-note"><b>Normal workflow:</b> Create key → authenticate request → test → connect backend → monitor usage.</div>`}
    ];
    const overlay=document.createElement("div");
    overlay.className="ga-onboard";
    overlay.innerHTML=`<div class="ga-onboard-card"><div class="ga-onboard-head"><div><div class="ga-onboard-kicker">GAME API GETTING STARTED</div><div class="ga-onboard-title" id="gaTitle"></div><div class="ga-onboard-sub">A guided introduction for your developer account</div><div class="ga-onboard-progress"><i id="gaProgress"></i></div></div></div><div class="ga-onboard-body" id="gaBody"></div><div class="ga-foot"><button class="ga-btn" id="gaBack">← Back</button><button class="ga-btn primary" id="gaNext">Next step →</button></div></div>`;
    document.body.appendChild(overlay);
    let n=0;
    const title=overlay.querySelector("#gaTitle"),body=overlay.querySelector("#gaBody"),bar=overlay.querySelector("#gaProgress"),back=overlay.querySelector("#gaBack"),next=overlay.querySelector("#gaNext");
    function render(){title.textContent=steps[n].title;body.innerHTML=steps[n].html;bar.style.width=((n+1)/steps.length*100)+"%";back.disabled=n===0;next.textContent=n===steps.length-1?"Finish guide ✓":"Next step →";}
    back.onclick=()=>{if(n){n--;render()}};
    next.onclick=async()=>{if(n<steps.length-1){n++;render();return} try{await authClient.auth.updateUser({data:{getting_started_seen:true}})}catch{} overlay.remove();};
    render();
  }

  const authenticated = await ensureRealAuthentication();
  if (authenticated) {
    loadCurrentPlan();
    showDashboardOnboarding();
  }

  window.GameApiApp = {
    toggleSidebar: toggle,
    closeSidebar: () => { side?.classList.remove("open"); shade?.classList.remove("show"); },
    currentPlan: "free"
  };
})();
