export function initPanel(hljs) {
  const updateConfig = {
    starColor: (value) => {
      const numericValue = parseInt(value.replace("#", ""), 16);
      const r = (numericValue >> 16) & 0xFF;
      const g = (numericValue >> 8) & 0xFF;
      const b = numericValue & 0xFF;
      Starfield.config.starColor = `rgb(${r}, ${g}, ${b})`;
    },
    hueJitter: (value) => {
      if (value === "") return;
      Starfield.config.hueJitter = parseInt(value);
    },
    trailLength: (value) => {
      if (value === "") return;
      Starfield.config.trailLength = parseFloat(value);
    },
    baseSpeed: (value) => {
      if (value === "") return;
      Starfield.config.baseSpeed = parseFloat(value);
    },
    maxAcceleration: (value) => {
      if (value === "") return;
      Starfield.config.maxAcceleration = parseFloat(value);
    },
    accelerationRate: (value) => {
      if (value === "") return;
      Starfield.config.accelerationRate = parseFloat(value);
    },
    decelerationRate: (value) => {
      if (value === "") return;
      Starfield.config.decelerationRate = parseFloat(value);
    },
    minSpawnRadius: (value) => {
      if (value === "") return;
      Starfield.config.minSpawnRadius = parseInt(value, 10);
    },
    maxSpawnRadius: (value) => {
      if (value === "") return;
      Starfield.config.maxSpawnRadius = parseInt(value, 10);
    },
  };

  function generateEmbed() {
    const configElements = [
      "starColor",
      "hueJitter",
      "trailLength",
      "baseSpeed",
      "maxAcceleration",
      "accelerationRate",
      "decelerationRate",
      "minSpawnRadius",
      "maxSpawnRadius",
    ];

    const config = {};
    configElements.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        config[id] = element.value;
      }
    });

    const numericValue = parseInt(config.starColor.replace("#", ""), 16);
    const r = (numericValue >> 16) & 0xff;
    const g = (numericValue >> 8) & 0xff;
    const b = numericValue & 0xff;
    const rgbColor = `rgb(${r}, ${g}, ${b})`;

    const embedCode = `<script src="starfield.js"></script>
<script>
  Starfield.setup({
    starColor: "${rgbColor}",
    hueJitter: ${config.hueJitter},
    trailLength: ${config.trailLength},
    baseSpeed: ${config.baseSpeed},
    maxAcceleration: ${config.maxAcceleration},
    accelerationRate: ${config.accelerationRate},
    decelerationRate: ${config.decelerationRate},
    minSpawnRadius: ${config.minSpawnRadius},
    maxSpawnRadius: ${config.maxSpawnRadius}
  });
</script>`;

    var embedEl = document.getElementById("embed-code");
    embedEl.textContent = embedCode;
    delete embedEl.dataset.highlighted;
    hljs.highlightElement(embedEl);
  }

  function attachDynamicListeners() {
    const configIds = [
      "trailLength",
      "starColor",
      "hueJitter",
      "baseSpeed",
      "maxAcceleration",
      "accelerationRate",
      "decelerationRate",
      "minSpawnRadius",
      "maxSpawnRadius",
    ];

    configIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener("input", (e) => {
          const value = e.target.value;
          if (updateConfig[id]) {
            updateConfig[id](value);
            generateEmbed();
          }
        });
      }
    });
  }

  function adjustPanelHeight() {
    const configPanel = document.querySelector(".config-panel");
    if (!configPanel) return;

    if (configPanel.classList.contains("minimized")) {
      configPanel.style.maxHeight = "";
      configPanel.style.overflowY = "";
      return;
    }

    const topGap = 20;
    const bottomGap = 20;
    const contentHeight = configPanel.scrollHeight;
    const availableHeight = window.innerHeight - topGap - bottomGap;

    configPanel.style.maxHeight = `${Math.min(contentHeight, availableHeight)}px`;
    configPanel.style.overflowY = contentHeight > availableHeight ? "auto" : "hidden";
  }

  function toggleConfigPanel() {
    const toggleButton = document.getElementById("toggle-config-panel");
    const configPanel = document.querySelector(".config-panel");

    if (!toggleButton || !configPanel) return;

    toggleButton.addEventListener("click", () => {
      configPanel.classList.toggle("minimized");
      if (configPanel.classList.contains("minimized")) {
        toggleButton.textContent = "+";
        toggleButton.title = "Maximize Panel";
      } else {
        toggleButton.textContent = "−";
        toggleButton.title = "Minimize Panel";
      }
    });
  }

  function initEmbed() {
    const copyButton = document.getElementById("copy-embed-code");
    const embedCodeElement = document.getElementById("embed-code");

    if (!copyButton || !embedCodeElement) return;

    copyButton.addEventListener("click", () => {
      const codeContent = embedCodeElement.textContent;
      navigator.clipboard.writeText(codeContent).then(() => {
        copyButton.textContent = "Copied!";
        setTimeout(() => {
          copyButton.textContent = "Copy";
        }, 2000);
      });
    });
  }

  generateEmbed();
  attachDynamicListeners();
  toggleConfigPanel();
  initEmbed();
  adjustPanelHeight();

  window.addEventListener("resize", adjustPanelHeight);
}
