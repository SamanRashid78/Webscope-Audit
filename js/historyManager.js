/**
 * Local Audit History Manager
 */
const STORAGE_KEY = 'auditmetrics_history_v1';

function saveAuditToHistory(auditData) {
  let history = getHistory();
  // Filter out duplicates of same domain
  history = history.filter(item => item.hostname !== auditData.hostname);
  history.unshift(auditData);
  if (history.length > 20) history.pop();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  updateHistoryBadge();
}

function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
  updateHistoryBadge();
  renderHistoryView();
  showToast('Audit history cleared.', 'info');
}

function updateHistoryBadge() {
  const countBadge = document.getElementById('historyCount');
  if (countBadge) {
    countBadge.textContent = getHistory().length;
  }
}

function renderHistoryView() {
  const container = document.getElementById('historyTableContainer');
  if (!container) return;

  const history = getHistory();
  if (history.length === 0) {
    container.innerHTML = `<p class="empty-state">No saved audits yet. Run a website audit scan to populate history.</p>`;
    return;
  }

  let rows = history.map(item => `
    <tr>
      <td><strong>${item.hostname}</strong></td>
      <td><span class="score-pill">${item.overallScore} / 100</span></td>
      <td>${item.stats.criticalCount} Critical, ${item.stats.warningCount} Warning</td>
      <td>${new Date(item.scannedAt).toLocaleDateString()}</td>
      <td>
        <button class="chip-btn load-history-btn" data-hostname="${item.hostname}">
          Reload Audit
        </button>
      </td>
    </tr>
  `).join('');

  container.innerHTML = `
    <table class="history-table">
      <thead>
        <tr>
          <th>Website Domain</th>
          <th>Overall Score</th>
          <th>Issues Summary</th>
          <th>Date Scanned</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  // Attach reload handlers
  container.querySelectorAll('.load-history-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const hostname = e.currentTarget.getAttribute('data-hostname');
      const item = getHistory().find(h => h.hostname === hostname);
      if (item) {
        // Switch to audit tab & display
        switchTab('audit');
        displayAuditResults(item);
      }
    });
  });
}
