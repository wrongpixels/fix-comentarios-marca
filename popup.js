document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggle-switch')
  const statusLabel = document.getElementById('status-label')

  const updateStatusLabel = (enabled) => {
    statusLabel.textContent = enabled ? 'Activo' : 'Inactivo'
    statusLabel.style.color = enabled ? '#cc0000' : '#999'
  }

  const updateRuleset = (enabled) => {
    const options = {
      enableRulesetIds: enabled ? ['ruleset_1'] : [],
      disableRulesetIds: enabled ? [] : ['ruleset_1'],
    }

    chrome.declarativeNetRequest.updateEnabledRulesets(options)
  }

  const reloadCurrentTabIfMarca = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]

      if (activeTab && activeTab.url) {
        try {
          const currentUrl = new URL(activeTab.url)
          if (currentUrl.hostname.includes('marca.com')) {
            chrome.tabs.reload(activeTab.id)
          }
        } catch (_e) {}
      }
    })
  }

  chrome.storage.local.get(['enabled'], (result) => {
    const isEnabled = result.enabled !== false
    toggleSwitch.checked = isEnabled
    updateStatusLabel(isEnabled)
  })

  toggleSwitch.addEventListener('change', () => {
    const isEnabled = toggleSwitch.checked
    chrome.storage.local.set({ enabled: isEnabled })
    updateStatusLabel(isEnabled)
    updateRuleset(isEnabled)
    reloadCurrentTabIfMarca()
  })
})
