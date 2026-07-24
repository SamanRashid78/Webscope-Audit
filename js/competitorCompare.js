/**
 * Competitor Comparison Module
 */
function setupCompetitorCompare() {
  const compareForm = document.getElementById('compareForm');
  const resultsContainer = document.getElementById('compareResults');

  if (compareForm) {
    compareForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const urlA = document.getElementById('urlA').value;
      const urlB = document.getElementById('urlB').value;

      if (!urlA || !urlB) return;

      showToast('Running side-by-side comparison...', 'info');

      try {
        const [dataA, dataB] = await Promise.all([
          runWebsiteAudit(urlA),
          runWebsiteAudit(urlB)
        ]);

        renderComparisonResults(dataA, dataB);
      } catch (err) {
        showToast('Error during comparison.', 'error');
      }
    });
  }
}

function renderComparisonResults(dataA, dataB) {
  const resultsContainer = document.getElementById('compareResults');
  if (!resultsContainer) return;

  resultsContainer.classList.remove('hidden');

  const isAWinner = dataA.overallScore >= dataB.overallScore;

  resultsContainer.innerHTML = `
    <div class="compare-col-card ${isAWinner ? 'winner' : ''}">
      <div class="site-header">
        <h3>${dataA.hostname}</h3>
        ${isAWinner ? '<span class="score-grade-badge">Winner 🏆</span>' : ''}
      </div>
      <div class="score-big">${dataA.overallScore} / 100</div>
      <ul class="compare-metrics-list">
        <li><strong>SEO:</strong> ${dataA.categories.seo.score}/100</li>
        <li><strong>Security:</strong> ${dataA.categories.security.score}/100</li>
        <li><strong>Performance:</strong> ${dataA.categories.performance.score}/100</li>
        <li><strong>Health:</strong> ${dataA.categories.health.score}/100</li>
        <li><strong>Total Issues:</strong> ${dataA.stats.totalIssues}</li>
        <li><strong>Critical Issues:</strong> ${dataA.stats.criticalCount}</li>
      </ul>
    </div>

    <div class="compare-col-card ${!isAWinner ? 'winner' : ''}">
      <div class="site-header">
        <h3>${dataB.hostname}</h3>
        ${!isAWinner ? '<span class="score-grade-badge">Winner 🏆</span>' : ''}
      </div>
      <div class="score-big">${dataB.overallScore} / 100</div>
      <ul class="compare-metrics-list">
        <li><strong>SEO:</strong> ${dataB.categories.seo.score}/100</li>
        <li><strong>Security:</strong> ${dataB.categories.security.score}/100</li>
        <li><strong>Performance:</strong> ${dataB.categories.performance.score}/100</li>
        <li><strong>Health:</strong> ${dataB.categories.health.score}/100</li>
        <li><strong>Total Issues:</strong> ${dataB.stats.totalIssues}</li>
        <li><strong>Critical Issues:</strong> ${dataB.stats.criticalCount}</li>
      </ul>
    </div>
  `;
}
