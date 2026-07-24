/**
 * Main Application Controller & UI State Orchestrator
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  setupNavigationTabs();
  setupThemeToggle();
  setupAuditForm();
  setupPresetChips();
  setupIssueFilters();
  setupLeadGeneratorEvents();
  setupCompetitorCompare();
  setupPdfExport();

  updateHistoryBadge();
  renderHistoryView();

  // Load default preset audit on boot for instant preview
  const defaultAudit = PRESET_AUDITS.unoptimized;
  displayAuditResults(defaultAudit);
});

// State
window.currentAuditData = null;
let currentSeverityFilter = 'all';
let currentCategoryFilter = 'all';

// Tab Switching
function setupNavigationTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const viewName = e.currentTarget.getAttribute('data-view');
      switchTab(viewName);
    });
  });
}

function switchTab(viewName) {
  document.querySelectorAll('.nav-tab').forEach(t => {
    if (t.getAttribute('data-view') === viewName) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });

  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active');
  });

  const activeSec = document.getElementById(`${viewName}View`);
  if (activeSec) {
    activeSec.classList.add('active');
  }

  if (viewName === 'history') {
    renderHistoryView();
  }
}

// Theme Toggle
function setupThemeToggle() {
  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      document.body.classList.toggle('dark-theme');
      const isLight = document.body.classList.contains('light-theme');
      btn.innerHTML = `<i data-lucide="${isLight ? 'moon' : 'sun'}"></i>`;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  }
}

// Audit Form & Live Scan
function setupAuditForm() {
  const form = document.getElementById('auditForm');
  const urlInput = document.getElementById('urlInput');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const url = urlInput.value.trim();
      if (!url) return;

      runAuditWorkflow(url);
    });
  }

  const reScanBtn = document.getElementById('reScanBtn');
  if (reScanBtn) {
    reScanBtn.addEventListener('click', () => {
      if (window.currentAuditData) {
        runAuditWorkflow(window.currentAuditData.url);
      }
    });
  }
}

// Quick Sample Chips
function setupPresetChips() {
  const chips = document.querySelectorAll('.chip-btn[data-preset]');
  chips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      const presetKey = e.currentTarget.getAttribute('data-preset');
      const presetData = PRESET_AUDITS[presetKey];
      if (presetData) {
        displayAuditResults(presetData);
        showToast(`Loaded ${presetData.hostname} benchmark sample.`, 'success');
      }
    });
  });
}

// Run Audit Workflow with Scanner Milestone Progress
async function runAuditWorkflow(url) {
  const scanningCard = document.getElementById('scanningProgress');
  const resultsContainer = document.getElementById('auditResults');
  const statusUrl = document.getElementById('scanStatusUrl');

  if (statusUrl) statusUrl.textContent = url;
  if (resultsContainer) resultsContainer.classList.add('hidden');
  if (scanningCard) scanningCard.classList.remove('hidden');

  // Reset milestones
  resetMilestones();

  try {
    const data = await runWebsiteAudit(url, (milestoneId, status) => {
      updateMilestone(milestoneId, status);
    });

    setTimeout(() => {
      if (scanningCard) scanningCard.classList.add('hidden');
      displayAuditResults(data);
      saveAuditToHistory(data);
    }, 600);

  } catch (err) {
    if (scanningCard) scanningCard.classList.add('hidden');
    showToast('Failed to complete scan. Please try again.', 'error');
  }
}

function resetMilestones() {
  const ids = ['m-http', 'm-tech', 'm-seo', 'm-sec', 'm-lead'];
  ids.forEach(id => setMilestoneIcon(id, 'milestone-item', 'clock'));
}

function updateMilestone(milestoneId, status) {
  if (status === 'active') {
    setMilestoneIcon(milestoneId, 'milestone-item active', 'loader');
  } else if (status === 'done') {
    setMilestoneIcon(milestoneId, 'milestone-item done', 'check-circle-2');
  }
}

function setMilestoneIcon(elementId, className, iconName) {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.className = className;

  const existingIcon = el.querySelector('i, svg');
  const freshIcon = document.createElement('i');
  freshIcon.setAttribute('data-lucide', iconName);

  if (existingIcon) {
    existingIcon.replaceWith(freshIcon);
  } else {
    el.appendChild(freshIcon);
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Render Results Dashboard
function displayAuditResults(data) {
  window.currentAuditData = data;
  const resultsContainer = document.getElementById('auditResults');
  if (!resultsContainer) return;

  resultsContainer.classList.remove('hidden');

  // Domain & Info
  document.getElementById('resDomain').textContent = data.hostname;
  document.getElementById('resFullUrl').textContent = data.url;
  document.getElementById('resTimestamp').innerHTML = `<i data-lucide="clock"></i> Scanned ${new Date(data.scannedAt).toLocaleTimeString()}`;

  // Overall Score Gauge
  const scoreValEl = document.getElementById('scoreValue');
  const scoreGradeEl = document.getElementById('scoreGrade');
  const scoreRing = document.getElementById('scoreRingProgress');
  const scoreVerdict = document.getElementById('scoreVerdict');

  if (scoreValEl) scoreValEl.textContent = data.overallScore;

  // Animate SVG Ring (Circumference 427)
  const maxDash = 427;
  const offset = maxDash - (maxDash * (data.overallScore / 100));
  if (scoreRing) {
    scoreRing.style.strokeDashoffset = offset;
    scoreRing.style.stroke = data.overallScore < 60 ? '#ef4444' : data.overallScore < 80 ? '#f59e0b' : '#10b981';
  }

  if (scoreGradeEl) {
    if (data.overallScore < 60) {
      scoreGradeEl.textContent = 'Critical Needs Fix';
      scoreGradeEl.style.background = 'rgba(239, 68, 68, 0.2)';
      scoreGradeEl.style.color = '#ef4444';
      if (scoreVerdict) scoreVerdict.textContent = 'Major vulnerabilities & SEO errors impacting customer conversion rates.';
    } else if (data.overallScore < 80) {
      scoreGradeEl.textContent = 'Needs Improvement';
      scoreGradeEl.style.background = 'rgba(245, 158, 11, 0.2)';
      scoreGradeEl.style.color = '#f59e0b';
      if (scoreVerdict) scoreVerdict.textContent = 'Good foundation with key optimization opportunities.';
    } else {
      scoreGradeEl.textContent = 'Excellent Quality';
      scoreGradeEl.style.background = 'rgba(16, 185, 129, 0.2)';
      scoreGradeEl.style.color = '#10b981';
      if (scoreVerdict) scoreVerdict.textContent = 'High technical standards meeting SEO & performance best practices.';
    }
  }

  // Category Scores
  updateCategoryCard('Seo', data.categories.seo.score);
  updateCategoryCard('Security', data.categories.security.score);
  updateCategoryCard('Perf', data.categories.performance.score);
  updateCategoryCard('Health', data.categories.health.score);

  // Render Tech Stack Badges
  renderTechStack(data.techStack);

  // Render Lead Generator Card
  renderLeadGeneratorCard(data);

  // Render Filterable Issues
  renderIssuesList(data.issues);

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function updateCategoryCard(catKey, score) {
  const bar = document.getElementById(`catBar${catKey}`);
  const scoreNum = document.getElementById(`catScore${catKey}`);
  const statusText = document.getElementById(`catStatus${catKey}`);

  if (bar) bar.style.width = `${score}%`;
  if (scoreNum) scoreNum.textContent = `${score}/100`;

  if (statusText) {
    statusText.textContent = score < 60 ? 'Critical' : score < 80 ? 'Moderate' : 'Optimal';
    statusText.style.color = score < 60 ? '#ef4444' : score < 80 ? '#f59e0b' : '#10b981';
  }
}

// Tech Stack Renderer
function renderTechStack(techList) {
  const container = document.getElementById('techBadgesContainer');
  const countTag = document.getElementById('techCountTag');

  if (countTag) countTag.textContent = `${techList ? techList.length : 0} Detected`;
  if (!container) return;

  container.innerHTML = '';
  if (!techList || techList.length === 0) {
    container.innerHTML = '<span class="text-muted">No specific framework signatures detected.</span>';
    return;
  }

  techList.forEach(t => {
    const badge = document.createElement('div');
    badge.className = 'tech-badge';
    badge.innerHTML = `
      <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${t.badgeColor || '#6366f1'};"></span>
      <strong>${t.name}</strong>
      <span class="tech-cat-label">${t.category}</span>
    `;
    container.appendChild(badge);
  });
}

// Issue Filters & Accordion Renderer
function setupIssueFilters() {
  const pills = document.querySelectorAll('.filter-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      pills.forEach(p => p.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentSeverityFilter = e.currentTarget.getAttribute('data-filter');
      if (window.currentAuditData) {
        renderIssuesList(window.currentAuditData.issues);
      }
    });
  });

  const catSelect = document.getElementById('categoryFilterSelect');
  if (catSelect) {
    catSelect.addEventListener('change', (e) => {
      currentCategoryFilter = e.target.value;
      if (window.currentAuditData) {
        renderIssuesList(window.currentAuditData.issues);
      }
    });
  }
}

function renderIssuesList(issues) {
  const container = document.getElementById('issuesListContainer');
  const countBadge = document.getElementById('issuesCountBadge');

  const countCrit = document.getElementById('countCritical');
  const countWarn = document.getElementById('countWarning');
  const countPass = document.getElementById('countPassed');

  if (countCrit) countCrit.textContent = issues.filter(i => i.severity === 'critical').length;
  if (countWarn) countWarn.textContent = issues.filter(i => i.severity === 'warning').length;
  if (countPass) countPass.textContent = issues.filter(i => i.severity === 'passed').length;

  if (!container) return;
  container.innerHTML = '';

  // Filter issues
  let filtered = issues.filter(item => {
    const matchSev = currentSeverityFilter === 'all' || item.severity === currentSeverityFilter;
    const matchCat = currentCategoryFilter === 'all' || item.category === currentCategoryFilter;
    return matchSev && matchCat;
  });

  if (countBadge) countBadge.textContent = `${filtered.length} Issues Shown`;

  if (filtered.length === 0) {
    container.innerHTML = `<p style="padding: 1.5rem; text-align: center; color: var(--text-muted);">No issues match current filter criteria.</p>`;
    return;
  }

  filtered.forEach(issue => {
    const card = document.createElement('div');
    card.className = 'issue-item-card';

    card.innerHTML = `
      <div class="issue-item-header">
        <div class="issue-title-area">
          <span class="issue-severity-tag ${issue.severity}">${issue.severity}</span>
          <span class="issue-title-text">${issue.title}</span>
          <span class="issue-cat-badge">${issue.category}</span>
        </div>
        <i data-lucide="chevron-down" class="accordion-arrow"></i>
      </div>
      <div class="issue-item-body">
        <p class="recommendation-text"><strong>Issue Description:</strong> ${issue.description}</p>
        
        ${issue.businessImpact ? `
          <div class="impact-box ${issue.severity}">
            <span class="impact-title">💼 Business Impact:</span>
            ${issue.businessImpact}
          </div>
        ` : ''}

        <p class="recommendation-text"><strong>How to Fix:</strong> ${issue.recommendation}</p>
        
        ${issue.codeSnippet ? `
          <div class="code-snippet-box">
            <pre>${escapeHtml(issue.codeSnippet)}</pre>
          </div>
        ` : ''}
      </div>
    `;

    // Accordion toggle
    const header = card.querySelector('.issue-item-header');
    header.addEventListener('click', () => {
      card.classList.toggle('open');
    });

    container.appendChild(card);
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Toast System
function showToast(message, type = 'info') {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  const toastIcon = document.getElementById('toastIcon');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove('hidden');

  if (type === 'success') {
    toastIcon.setAttribute('data-lucide', 'check-circle-2');
    toast.style.borderColor = 'var(--status-passed)';
  } else if (type === 'error') {
    toastIcon.setAttribute('data-lucide', 'alert-circle');
    toast.style.borderColor = 'var(--status-critical)';
  } else {
    toastIcon.setAttribute('data-lucide', 'info');
    toast.style.borderColor = 'var(--accent-primary)';
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}
