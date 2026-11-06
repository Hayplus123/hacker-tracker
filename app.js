// Comprehensive, unfiltered list of services utilizing public status endpoints
const TARGET_SERVICES = [
  { name: "OpenAI", category: "AI Services", endpoint: "https://status.openai.com/api/v2/summary.json" },
  { name: "Cloudflare", category: "Infrastructure & CDN", endpoint: "https://www.cloudflarestatus.com/api/v2/summary.json" },
  { name: "GitHub", category: "Developer Hosting", endpoint: "https://www.githubstatus.com/api/v2/summary.json" },
  { name: "Discord", category: "Communication", endpoint: "https://discordstatus.com/api/v2/summary.json" },
  { name: "Atlassian", category: "Software & Productivity", endpoint: "https://status.atlassian.com/api/v2/summary.json" },
  { name: "Datadog", category: "Cloud Monitoring", endpoint: "https://status.datadoghq.com/api/v2/summary.json" },
  { name: "Reddit", category: "Social & Community", endpoint: "https://reddit.statuspage.io/api/v2/summary.json" },
  { name: "Twilio", category: "Communications API", endpoint: "https://status.twilio.com/api/v2/summary.json" },
  { name: "Shopify", category: "E-commerce", endpoint: "https://www.shopifystatus.com/api/v2/summary.json" },
  { name: "Zoom", category: "Video Conferencing", endpoint: "https://status.zoom.us/api/v2/summary.json" },
  { name: "Stripe", category: "Payment Processing", endpoint: "https://status.stripe.com/api/v2/summary.json" },
  { name: "Vercel", category: "App Hosting", endpoint: "https://www.vercel-status.com/api/v2/summary.json" }
];

async function checkServiceStatuses() {
  const feedEl = document.getElementById("feed");
  feedEl.innerHTML = "";
  let activeIncidentsFound = 0;

  for (const service of TARGET_SERVICES) {
    try {
      const response = await fetch(service.endpoint);
      if (!response.ok) continue;

      const data = await response.json();
      const indicator = data.status.indicator; // 'none', 'minor', 'major', 'critical'
      const activeIncidents = data.incidents || [];

      // Pop up ONLY when there is trouble (unfiltered across all listed companies)
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

        const card = document.createElement("div");
        card.className = `card ${severityClass}`;
        card.innerHTML = `
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
        `;
        feedEl.appendChild(card);
      }
    } catch (error) {
      console.warn(`CORS or Network restriction for ${service.name}`);
    }
  }

  if (activeIncidentsFound === 0) {
    feedEl.innerHTML = `<div id="empty-state">✅ All monitored services in hacker-tester are operating normally with zero active issues.</div>`;
  }
}

checkServiceStatuses();
setInterval(checkServiceStatuses, 60000);