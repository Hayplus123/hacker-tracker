const TARGET_SERVICES = [
  { name: "OpenAI", category: "AI Services", endpoint: "https://status.openai.com/api/v2/summary.json" },
  { name: "Cloudflare", category: "Infrastructure & Hosting", endpoint: "https://www.cloudflarestatus.com/api/v2/summary.json" },
  { name: "GitHub", category: "Developer Hosting", endpoint: "https://www.githubstatus.com/api/v2/summary.json" },
  { name: "Discord", category: "App & Communication", endpoint: "https://discordstatus.com/api/v2/summary.json" },
  { name: "Atlassian", category: "App Ecosystem", endpoint: "https://status.atlassian.com/api/v2/summary.json" },
  { name: "Datadog", category: "Cloud Monitoring", endpoint: "https://status.datadoghq.com/api/v2/summary.json" }
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
      const indicator = data.status.indicator; 
      const activeIncidents = data.incidents || [];

      if (indicator !== "none" || activeIncidents.length > 0) {
        activeIncidentsFound++;
        let severityClass = "minor";
        let severityLabel = "Minor Degraded Performance";

        if (indicator === "major") {
          severityClass = "major";
          severityLabel = "Major Outage";
        } else if (indicator === "critical") {
          severityClass = "critical";
          severityLabel = "Critical Failure";
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
      console.warn(`Network error for ${service.name}`);
    }
  }

  if (activeIncidentsFound === 0) {
    feedEl.innerHTML = `<div id="empty-state">✅ All monitored services in hacker-tester are operating normally.</div>`;
  }
}

checkServiceStatuses();
setInterval(checkServiceStatuses, 60000);