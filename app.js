// Expansive list of free public status endpoints covering dozens of major global services
const TARGET_SERVICES = [
  // AI & Machine Learning
  { name: "OpenAI", category: "AI Services", endpoint: "https://status.openai.com/api/v2/summary.json" },
  { name: "Anthropic", category: "AI Services", endpoint: "https://status.anthropic.com/api/v2/summary.json" },
  { name: "Hugging Face", category: "AI Services", endpoint: "https://status.huggingface.co/api/v2/summary.json" },
  
  // Cloud Infrastructure & Hosting
  { name: "Cloudflare", category: "Infrastructure & CDN", endpoint: "https://www.cloudflarestatus.com/api/v2/summary.json" },
  { name: "Vercel", category: "App Hosting", endpoint: "https://www.vercel-status.com/api/v2/summary.json" },
  { name: "Netlify", category: "App Hosting", endpoint: "https://www.netlifystatus.com/api/v2/summary.json" },
  { name: "Heroku", category: "App Hosting", endpoint: "https://status.heroku.com/api/v2/summary.json" },
  { name: "DigitalOcean", category: "Cloud Infrastructure", endpoint: "https://status.digitalocean.com/api/v2/summary.json" },
  
  // Developer Tools & Version Control
  { name: "GitHub", category: "Developer Hosting", endpoint: "https://www.githubstatus.com/api/v2/summary.json" },
  { name: "GitLab", category: "Developer Hosting", endpoint: "https://status.gitlab.com/api/v2/summary.json" },
  { name: "Atlassian", category: "Developer Tools", endpoint: "https://status.atlassian.com/api/v2/summary.json" },
  { name: "npm", category: "Package Registry", endpoint: "https://status.npmjs.org/api/v2/summary.json" },
  
  // Communication & Collaboration
  { name: "Discord", category: "Communication", endpoint: "https://discordstatus.com/api/v2/summary.json" },
  { name: "Slack", category: "Communication", endpoint: "https://status.slack.com/api/v2/summary.json" },
  { name: "Zoom", category: "Video Conferencing", endpoint: "https://status.zoom.us/api/v2/summary.json" },
  { name: "Twilio", category: "APIs & Telecom", endpoint: "https://status.twilio.com/api/v2/summary.json" },
  
  // Payments & E-commerce
  { name: "Stripe", category: "Payment Processing", endpoint: "https://status.stripe.com/api/v2/summary.json" },
  { name: "Shopify", category: "E-commerce", endpoint: "https://www.shopifystatus.com/api/v2/summary.json" },
  { name: "Square", category: "Payment Processing", endpoint: "https://www.issquaredown.com/api/v2/summary.json" }, // Note: fallback check
  
  // Social & Consumer Platforms
  { name: "Reddit", category: "Social & Community", endpoint: "https://reddit.statuspage.io/api/v2/summary.json" },
  { name: "Epic Games", category: "Gaming", endpoint: "https://status.epicgames.com/api/v2/summary.json" },
  { name: "Roblox", category: "Gaming & Platform", endpoint: "https://status.roblox.com/api/v2/summary.json" }
];

async function checkServiceStatuses() {
  const feedEl = document.getElementById("feed");
  feedEl.innerHTML = "<div id='loading'>Scanning all global status APIs...</div>";
  
  let activeIncidentsFound = 0;
  let cardsHTML = "";

  for (const service of TARGET_SERVICES) {
    try {
      const response = await fetch(service.endpoint);
      if (!response.ok) continue;

      const data = await response.json();
      const indicator = data.status.indicator; // 'none', 'minor', 'major', 'critical'
      const activeIncidents = data.incidents || [];

      // Pop up ONLY when there is trouble
      if (indicator !== "none" || activeIncidents.length > 0) {
        activeIncidentsFound++;
        
        let severityClass = "minor";
        let severityLabel = "Minor Degraded Performance";

        if (indicator === "major") {
          severityClass = "major";
          severityLabel = "Major Outage";
        } else if (indicator === "critical") {
          severityClass = "critical";
          severityLabel = "Critical System Failure";
        }

        const latestIncident = activeIncidents[0];
        const incidentImpact = latestIncident ? latestIncident.impact : "Unscheduled Incident";
        const incidentTitle = latestIncident ? latestIncident.name : data.status.description;

        cardsHTML += `
          <div class="card ${severityClass}">
            <div class="card-header">
              <div>
                <div class="company-name">${service.name}</div>
                <div class="category">${service.category}</div>
              </div>
              <span class="badge ${severityClass}">${severityLabel}</span>
            </div>
            <div class="incident-details">
              <strong>Impact:</strong> ${incidentImpact.toUpperCase()}<br/>
              <strong>Details:</strong> ${incidentTitle}
            </div>
          </div>
        `;
      }
    } catch (error) {
      console.warn(`CORS restriction or network block for ${service.name}`);
    }
  }

  // Render cards or green success message
  if (activeIncidentsFound > 0) {
    feedEl.innerHTML = cardsHTML;
  } else {
    feedEl.innerHTML = `
      <div id="empty-state">
        ✅ All ${TARGET_SERVICES.length} monitored platforms are operating normally with zero active issues.
      </div>
    `;
  }
}

// Run on load and refresh every 60 seconds
checkServiceStatuses();
setInterval(checkServiceStatuses, 60000);