/**
 * Lead Generator UI Module
 */
function renderLeadGeneratorCard(auditData) {
  const leadScoreText = document.getElementById('leadScoreText');
  const dealbreakersList = document.getElementById('leadDealbreakersList');
  const emailPreview = document.getElementById('leadEmailPreview');

  if (leadScoreText) {
    leadScoreText.textContent = `${auditData.overallScore} / 100`;
  }

  if (dealbreakersList) {
    dealbreakersList.innerHTML = '';
    if (auditData.majorDealbreakers && auditData.majorDealbreakers.length > 0) {
      auditData.majorDealbreakers.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${item.title}:</strong> ${item.businessImpact}`;
        dealbreakersList.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = 'No critical dealbreakers found! The site meets core standards.';
      dealbreakersList.appendChild(li);
    }
  }

  if (emailPreview) {
    emailPreview.textContent = auditData.outreachEmailPitch;
  }
}

function setupLeadGeneratorEvents() {
  const copyBtn = document.getElementById('copyOutreachBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const emailPreview = document.getElementById('leadEmailPreview');
      if (emailPreview) {
        navigator.clipboard.writeText(emailPreview.textContent).then(() => {
          showToast('Outreach pitch email copied to clipboard!', 'success');
        }).catch(() => {
          showToast('Copied to clipboard!', 'info');
        });
      }
    });
  }
}
