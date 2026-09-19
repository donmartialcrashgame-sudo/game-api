(() => {
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

  const css = `
.has-app-sidebar{padding-left:269px}.has-app-sidebar .app-sidebar{left:0}\n@media(max-width:900px){.has-app-sidebar{padding-left:0}}\n.app-sidebar{width:245px;position:fixed;inset:0 auto 0 0;background:#07101b;border-right:1px solid #ffffff10;padding:15px 12px;display:flex;flex-direction:column;z-index:100}
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
@media(max-width:900px){.app-sidebar{transform:translateX(-100%);transition:transform .2s}.app-sidebar.open{transform:none;box-shadow:20px 0 60px #000}.app-menu{display:block}.app-shade.show{display:block}}
  `;
  const style = document.createElement("style");
  style.id = "game-api-app-style";
  style.textContent = css;
  document.head.appendChild(style);

  let host = document.getElementById("appSidebar");
  if (!host) { host = document.createElement("div"); host.id = "appSidebar"; document.body.prepend(host); }
  if (!document.querySelector(".shell") && !document.querySelector(".layout")) document.body.classList.add("has-app-sidebar");

  const current = location.pathname.split("/").pop() || "dashboard.html";
  const nav = NAV.map(group => `
    <div class="app-group">
      <div class="app-title">${group.title}</div>
      <nav class="app-nav">
        ${group.items.map(([icon,label,href]) => `<a class="${current === href ? "active" : ""}" href="${href}">${icon} &nbsp; ${label}</a>`).join("")}
      </nav>
    </div>
  `).join("");

  host.innerHTML = `
    <aside class="app-sidebar" id="appSide">
      <a class="app-brand" href="dashboard.html"><span class="app-logo">G</span><span>Gaming API<small>DEVELOPER CONSOLE</small></span></a>
      ${nav}
      <div class="app-bottom">
        <div class="app-user"><b id="email">Authenticated</b><span>Developer account</span></div>
        <a class="app-upgrade" href="pricing.html">✦ Upgrade Plan</a>
        <button class="app-out" id="signout">Sign out</button>
      </div>
    </aside>
    <button class="app-menu" id="appMenu" aria-label="Open navigation">☰</button>
    <div class="app-shade" id="appShade"></div>
  `;

  const side = document.getElementById("appSide");
  const shade = document.getElementById("appShade");
  const toggle = () => { side.classList.toggle("open"); shade.classList.toggle("show"); };
  document.getElementById("appMenu").onclick = toggle;
  const signout = document.getElementById("signout");
  if (signout) signout.onclick = async () => { try { const sb = window.supabase; if (sb?.auth) await sb.auth.signOut(); } catch {} location.href = "login.html"; };
  shade.onclick = () => { side.classList.remove("open"); shade.classList.remove("show"); };

  window.GameApiApp = {
    toggleSidebar: toggle,
    closeSidebar: () => { side.classList.remove("open"); shade.classList.remove("show"); }
  };
})();
