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

function displayIssues() {
  issueList.innerHTML = "";

  // newest first
  const sortedIssues = [...issues].sort(
    (a, b) => new Date(b.time) - new Date(a.time)
  );

  sortedIssues.forEach(issue => {
    const index = issues.indexOf(issue);
    const div = document.createElement("div");

    const statusClass = issue.status === "Resolved" ? "resolved" : "pending";
    const highlightClass = issue.count >= 3 ? "highlight" : "";
    const priorityBadge = issue.count >= 3 ? `<span class="priority">High Priority</span>` : "";

    div.className = `issue-card ${highlightClass}`;

    div.innerHTML = `
      <h3>
        ${issue.type}
        ${priorityBadge}
      </h3>

      <p><strong>Location:</strong> ${issue.location}</p>
      <p><strong>Reported:</strong> ${new Date(issue.time).toLocaleString()}</p>
      <p>${issue.description}</p>
      <p><strong>Reports:</strong> ${issue.count}</p>

      <span class="status ${statusClass}">${issue.status}</span>

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
  const issueLocation = document.getElementById("location").value.trim().toLowerCase();
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
    issue =>
      issue.type === newIssue.type &&
      issue.location === newIssue.location &&
      issue.status === "Pending"
  );

  if (existingIndex !== -1) {
    issues[existingIndex].count += 1;
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
  if (confirm("Are you sure you want to delete this issue?")) {
    issues.splice(index, 1);
    localStorage.setItem("issues", JSON.stringify(issues));
    displayIssues();
  }
}

displayIssues();
