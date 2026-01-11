const form = document.getElementById("issueForm");
const issueList = document.getElementById("issueList");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const resolvedCount = document.getElementById("resolvedCount");

let issues = JSON.parse(localStorage.getItem("issues")) || [];

function updateStats() {
  totalCount.textContent = issues.length;
  pendingCount.textContent = issues.filter(i => i.status === "Pending").length;
  resolvedCount.textContent = issues.filter(i => i.status === "Resolved").length;
}

function getAIInsight(issue) {
  if (issue.count >= 3) {
    return "AI Insight: This issue is marked high priority due to multiple reports from the same area, indicating wider community impact.";
  }
  return "AI Insight: This issue currently shows limited reports but may increase in priority if repeated.";
}

function displayIssues() {
  issueList.innerHTML = "";

  const sortedIssues = [...issues].sort(
    (a, b) => new Date(b.time) - new Date(a.time)
  );

  sortedIssues.forEach(issue => {
    const index = issues.indexOf(issue);
    const highlightClass = issue.count >= 3 ? "highlight" : "";
    const priorityBadge = issue.count >= 3 ? `<span class="priority">High Priority</span>` : "";
    const statusClass = issue.status === "Resolved" ? "resolved" : "pending";

    const div = document.createElement("div");
    div.className = `issue-card ${highlightClass}`;

    div.innerHTML = `
      <h3>${issue.type} ${priorityBadge}</h3>
      <p><strong>Location:</strong> ${issue.location}</p>
      <p><strong>Reported:</strong> ${new Date(issue.time).toLocaleString()}</p>
      <p>${issue.description}</p>
      <p><strong>Reports:</strong> ${issue.count}</p>

      <span class="status ${statusClass}">${issue.status}</span>

      <div class="ai-insight">${getAIInsight(issue)}</div>

      <div class="action-buttons">
        ${
          issue.status === "Pending"
            ? `<button class="resolve-btn" onclick="markResolved(${index})">Resolve</button>`
            : ""
        }
        <button class="delete-btn" onclick="deleteIssue(${index})">Delete</button>
      </div>
    `;

    issueList.appendChild(div);
  });

  updateStats();
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const issueType = document.getElementById("issueType").value;
  const issueLocation = document
    .getElementById("location")
    .value
    .trim()
    .toLowerCase();
  const issueDescription = document.getElementById("description").value;

  const newIssue = {
    type: issueType,
    location: issueLocation,
    description: issueDescription,
    status: "Pending",
    count: 1,
    time: new Date().toISOString()
  };


  const existingIndex = issues.findIndex(
    i => i.type === newIssue.type &&
         i.location === newIssue.location &&
         i.status === "Pending"
  );

  if (existingIndex !== -1) {
    issues[existingIndex].count++;
  } else {
    issues.push(newIssue);
  }

  localStorage.setItem("issues", JSON.stringify(issues));
  form.reset();
  displayIssues();
});

function markResolved(index) {
  issues[index].status = "Resolved";
  localStorage.setItem("issues", JSON.stringify(issues));
  displayIssues();
}

function deleteIssue(index) {
  if (confirm("Delete this issue?")) {
    issues.splice(index, 1);
    localStorage.setItem("issues", JSON.stringify(issues));
    displayIssues();
  }
}

displayIssues();
