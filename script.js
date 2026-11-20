const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
const learners = [
  ["Aarav Sharma", "Batch A", "93%", "4 / 4", "On track"],
  ["Diya Patel", "Batch A", "87%", "3 / 4", "On track"],
  ["Rohan Mehta", "Batch B", "80%", "3 / 4", "On track"],
  ["Ananya Shah", "Batch C", "61%", "2 / 4", "Needs follow-up"],
  ["Kabir Joshi", "Batch C", "68%", "2 / 4", "Needs follow-up"],
  ["Ishita Rao", "Batch D", "76%", "3 / 4", "On track"],
];
const assignments = [
  ["Aarav Sharma", "Introduction to AI", "Today, 9:15 AM", "Ready for review"],
  [
    "Diya Patel",
    "Types of Machine Learning",
    "Today, 8:40 AM",
    "Ready for review",
  ],
  ["Ananya Shah", "Introduction to AI", "Yesterday", "Needs trainer input"],
  ["Rohan Mehta", "AI in Daily Life", "Yesterday", "Ready for review"],
  ["Kabir Joshi", "Types of Machine Learning", "Nov 16", "Not generated"],
];
function toast(msg) {
  let t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
}
function go(page) {
  $$(".page").forEach((p) => p.classList.remove("shown"));
  $("#" + page).classList.add("shown");
  $$(".nav").forEach((b) =>
    b.classList.toggle("active", b.dataset.page === page),
  );
  $("#crumb").textContent =
    page === "assistant"
      ? "AI Assistant"
      : page[0].toUpperCase() + page.slice(1);
  $("#sidebar").classList.remove("open");
  scrollTo({ top: 0, behavior: "smooth" });
}
$$(".nav").forEach((b) => (b.onclick = () => go(b.dataset.page)));
$$("[data-go]").forEach((b) => (b.onclick = () => go(b.dataset.go)));
$("#date").textContent = new Date().toLocaleDateString("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});
$("#menuBtn").onclick = () => $("#sidebar").classList.toggle("open");
$("#notify").onclick = () => toast("You are all caught up on notifications.");
$("#helpBtn").onclick = () => toast("Help centre is a demo action.");
$("#create").onclick = () => go("assistant");
function renderLearners(list = learners) {
  $("#learnerRows").innerHTML = list
    .map(
      (l) =>
        `<tr><td><span class="tiny">${l[0]
          .split(" ")
          .map((x) => x[0])
          .join(
            "",
          )}</span><strong>${l[0]}</strong></td><td>${l[1]}</td><td>${l[2]}</td><td>${l[3]}</td><td><span class="status ${l[4] === "On track" ? "" : "risk"}">${l[4]}</span></td></tr>`,
    )
    .join("");
}
renderLearners();
$("#learnerSearch").oninput = (e) =>
  renderLearners(
    learners.filter((l) =>
      (l[0] + l[1]).toLowerCase().includes(e.target.value.toLowerCase()),
    ),
  );
$("#batchCards").innerHTML = [
  ["A", 86, 26, 4],
  ["B", 79, 24, 6],
  ["C", 72, 22, 8],
  ["D", 75, 23, 7],
]
  .map(
    (b) =>
      `<article class="batch-card"><span class="tag ${b[1] >= 85 ? "good" : b[1] >= 75 ? "mid" : "low"}">${b[1] >= 85 ? "On track" : b[1] >= 75 ? "Average" : "At risk"}</span><h3>Batch ${b[0]}</h3><p>AI Foundations · 30 learners</p><div class="big">${b[1]}%</div><div class="bar"><i style="width:${b[1]}%"></i></div><small>${b[2]} learners recently active · ${b[3]} need follow-up</small></article>`,
  )
  .join("");
function renderAssignments(rows = assignments) {
  $("#assignmentRows").innerHTML = rows
    .map(
      (a) =>
        `<tr><td><strong>${a[0]}</strong></td><td>${a[1]}</td><td>${a[2]}</td><td><span class="status ${a[3] === "Ready for review" ? "" : "risk"}">${a[3]}</span></td><td><button class="small-action" data-review="${a[0]}">Review</button></td></tr>`,
    )
    .join("");
  $$("[data-review]").forEach(
    (b) =>
      (b.onclick = () =>
        openModal(
          "Review submission",
          `Open ${b.dataset.review}'s submission, compare it with the rubric, and verify any AI-generated feedback before sharing.`,
        )),
  );
}
renderAssignments();
let onlyPending = false;
$("#filterPending").onclick = () => {
  onlyPending = !onlyPending;
  $("#filterPending").textContent = onlyPending
    ? "Show all submissions"
    : "Show pending only";
  renderAssignments(
    onlyPending
      ? assignments.filter((a) => a[3] !== "Ready for review")
      : assignments,
  );
};
function csv(name, rows) {
  let content = rows
    .map((r) =>
      r.map((v) => '"' + String(v).replaceAll('"', '""') + '"').join(","),
    )
    .join("\n");
  let url = URL.createObjectURL(new Blob([content], { type: "text/csv" }));
  let a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
$("#exportLearners").onclick = () => {
  csv("myaguru-learners-demo.csv", [
    ["Name", "Batch", "Attendance", "Assignments", "Status"],
    ...learners,
  ]);
  toast("Learner demo data exported.");
};
$("#downloadReport").onclick = () => {
  csv("myaguru-program-summary.csv", [
    ["Metric", "Current baseline", "Proposed pilot target"],
    ["Attendance", "78%", "85%"],
    ["On-time submissions", "62%", "75%"],
    ["Feedback turnaround", "4 days", "2 days or less"],
  ]);
  toast("Program summary exported.");
};
function openModal(title, msg) {
  $("#modalTitle").textContent = title;
  $("#modalText").textContent = msg;
  $("#modal").classList.add("open");
}
function closeModal() {
  $("#modal").classList.remove("open");
}
$("#reviewInsight").onclick = () =>
  openModal(
    "Review AI suggestion",
    "Batch C attendance is 72%, below the program average of 78%. Consider a 20-minute recap session and a reminder to learners. Verify schedules and learner context before taking action.",
  );
$("#closeModal").onclick = closeModal;
$("#dismiss").onclick = closeModal;
$("#markReviewed").onclick = () => {
  closeModal();
  toast("Suggestion marked as reviewed. No learner message was sent.");
};
$("#modal").onclick = (e) => {
  if (e.target === $("#modal")) closeModal();
};
const examples = [
  [
    /lesson|outline|plan/i,
    "<b>Draft lesson outline · 30 minutes</b><ol><li>Learning objectives and warm-up (3 min)</li><li>What is machine learning? (7 min)</li><li>Supervised vs. unsupervised learning (8 min)</li><li>Everyday examples and short activity (8 min)</li><li>Knowledge check and recap (4 min)</li></ol><b>Trainer check:</b> Confirm this matches the approved Week 2 syllabus before sharing.",
  ],
  [
    /quiz|question/i,
    "<b>Sample beginner quiz</b><ol><li>What is a model in machine learning?</li><li>Which learning type uses labelled examples?</li><li>Give one example of classification.</li><li>What is a feature?</li><li>Why test a model on unseen data?</li></ol><b>Trainer check:</b> Verify the answer key against approved lesson material.",
  ],
  [
    /overfit|explain|simple/i,
    "<b>Overfitting, in simple words</b><p>Imagine a learner memorises the exact answers to a practice test but cannot solve a new question. A machine-learning model can do something similar: it performs very well on training data but poorly on new data.</p><b>Trainer check:</b> Verify the example and adapt it to the learner level.",
  ],
];
function addMessage(html, kind) {
  let d = document.createElement("div");
  d.className = kind === "user" ? "user-msg" : "bot-msg";
  d.innerHTML = html;
  $("#chatBody").append(d);
  $("#chatBody").scrollTop = $("#chatBody").scrollHeight;
}
function respond(q) {
  let item = examples.find((x) => x[0].test(q));
  addMessage(
    item
      ? item[1]
      : "I can help create a lesson outline, draft a quiz, or explain a beginner AI concept. Please add the topic and learner level. I will flag uncertainty rather than invent a source.",
    "bot",
  );
}
$("#chatForm").onsubmit = (e) => {
  e.preventDefault();
  let q = $("#chatInput").value.trim();
  if (!q) return;
  addMessage(q, "user");
  $("#chatInput").value = "";
  setTimeout(() => respond(q), 300);
};
$$("[data-prompt]").forEach(
  (b) =>
    (b.onclick = () => {
      let q = b.dataset.prompt;
      addMessage(q, "user");
      setTimeout(() => respond(q), 300);
    }),
);

// Added lesson planning, quiz, reminder and responsible-AI demo workflows
function safeText(value) {
  return String(value).replace(
    /[&<>"']/g,
    (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        ch
      ],
  );
}
function generateLesson() {
  const topic = safeText($("#lessonTopic").value.trim() || "Untitled topic"),
    duration = $("#lessonDuration").value,
    level = $("#lessonLevel").value;
  $("#lessonOutput").innerHTML =
    `<b>Draft lesson: ${topic}</b><p>${duration} · ${level} learners</p><ol><li>Warm-up: connect the topic to a familiar real-world example (5 min)</li><li>Learning objectives: explain the key terms and expected outcomes</li><li>Concept walkthrough: introduce ${topic} using a simple example</li><li>Guided activity: learners apply the idea in a short exercise</li><li>Knowledge check: ask 3 recap questions and address misconceptions</li><li>Summary: revisit objectives and suggest practice</li></ol><p class="warning-text">AI-style sample draft · verify against the approved syllabus before use.</p>`;
  toast("Lesson draft generated for review.");
}
$("#generateLesson").onclick = generateLesson;
$("#editLesson").onclick = () => {
  $("#lessonOutput").contentEditable = "true";
  $("#lessonOutput").focus();
  toast("You can now edit the lesson draft.");
};
$("#approveLesson").onclick = () => {
  if ($("#lessonOutput").textContent.includes("will appear")) {
    toast("Generate a lesson draft first.");
    return;
  }
  $("#lessonOutput").contentEditable = "false";
  $("#lessonOutput").insertAdjacentHTML(
    "beforeend",
    '<p class="success-text">✓ Trainer approved in demo workspace.</p>',
  );
  toast("Lesson marked as trainer-approved (demo).");
};
function generateQuiz() {
  const topic = safeText($("#quizTopic").value.trim() || "AI fundamentals"),
    count = Number($("#quizCount").value),
    level = $("#quizDifficulty").value;
  const qs = [
    `Which statement best describes ${topic}?`,
    `Which is a practical example of ${topic}?`,
    `What should a learner check when applying ${topic}?`,
    `Which option is most likely to cause an incorrect result?`,
    `How would you explain ${topic} to a beginner?`,
  ];
  let list = Array.from(
    { length: count },
    (_, i) =>
      `<li>${qs[i % qs.length]} <small>(${level})</small><br><span>Answer key: trainer to add and verify</span></li>`,
  ).join("");
  $("#quizOutput").innerHTML =
    `<b>${count}-question draft · ${topic}</b><ol>${list}</ol><p class="warning-text">Questions are illustrative. Add answer options and verify the answer key using approved material.</p>`;
  toast("Quiz draft generated.");
}
$("#generateQuiz").onclick = generateQuiz;
$("#regenerateQuiz").onclick = generateQuiz;
$("#approveQuiz").onclick = () => {
  if ($("#quizOutput").textContent.includes("preview")) {
    toast("Generate a quiz first.");
    return;
  }
  $("#quizOutput").insertAdjacentHTML(
    "beforeend",
    '<p class="success-text">✓ Quiz draft approved in demo workspace after trainer review.</p>',
  );
  toast("Quiz marked approved (demo).");
};
$("#previewReminder").onclick = () => {
  const audience = $("#reminderAudience").value,
    type = $("#reminderType").value,
    date = $("#reminderDate").value || "Date not selected",
    message = safeText($("#reminderMessage").value.trim());
  $("#reminderOutput").innerHTML =
    `<b>Reminder preview</b><p><strong>To:</strong> ${safeText(audience)} · <strong>Type:</strong> ${safeText(type)} · <strong>Date:</strong> ${safeText(date)}</p><p>${message}</p><p class="warning-text">Preview only. Nothing has been sent.</p>`;
};
$("#approveReminder").onclick = () => {
  if (!$("#reminderMessage").value.trim()) {
    toast("Enter a reminder message first.");
    return;
  }
  const row = document.createElement("tr");
  row.innerHTML = `<td>${safeText($("#reminderAudience").value)}</td><td>${safeText($("#reminderType").value)}</td><td>${safeText($("#reminderDate").value || "Not selected")}</td><td><span class="status">Approved · demo only</span></td>`;
  $("#reminderRows").prepend(row);
  $("#reminderOutput").insertAdjacentHTML(
    "beforeend",
    '<p class="success-text">✓ Approved and added to the demo queue. No real notification was sent.</p>',
  );
  toast("Added to demo reminder queue.");
};
