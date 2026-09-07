// Copy-to-clipboard for command rows
function copyWithFallback(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
}

function copyText(text) {
  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    copyWithFallback(text);
    return Promise.resolve();
  }

  // Some browser contexts can leave the Clipboard API's permission
  // prompt unresolved indefinitely, so race it against a timeout and
  // fall back to the legacy copy path rather than leaving the UI stuck.
  const clipboardWrite = navigator.clipboard.writeText(text);
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("clipboard timeout")), 1000)
  );

  return Promise.race([clipboardWrite, timeout]).catch(() => copyWithFallback(text));
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".copy-btn");
  if (!btn) return;

  const row = btn.closest(".command-row");
  const codeEl = row.querySelector("code");
  const text = codeEl.textContent;
  const originalLabel = btn.dataset.label || "Copy";

  copyText(text).finally(() => {
    btn.classList.add("copied");
    btn.textContent = "Copied!";

    clearTimeout(btn._resetTimer);
    btn._resetTimer = setTimeout(() => {
      btn.classList.remove("copied");
      btn.textContent = originalLabel;
    }, 1500);
  });
});

// Placeholder fill-in: typing in a value box updates every matching
// <span class="placeholder"> across the page, and the copy button
// picks up the filled-in text automatically since it reads textContent.
const placeholderInputs = Array.from(document.querySelectorAll("[data-placeholder-key]:is(input)"));
if (placeholderInputs.length) {
  const STORAGE_KEY = "traxx-cheatsheet-placeholders";

  const applyValue = (key, value) => {
    const spans = document.querySelectorAll(`span.placeholder[data-placeholder-key="${key}"]`);
    spans.forEach((span) => {
      if (!span.dataset.original) {
        span.dataset.original = span.textContent;
      }
      const filled = value.trim().length > 0;
      span.textContent = filled ? value : span.dataset.original;
      span.classList.toggle("filled", filled);
    });
  };

  let savedValues = {};
  try {
    savedValues = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (err) {
    savedValues = {};
  }

  placeholderInputs.forEach((input) => {
    const key = input.dataset.placeholderKey;
    if (savedValues[key]) {
      input.value = savedValues[key];
      applyValue(key, savedValues[key]);
    }

    input.addEventListener("input", () => {
      applyValue(key, input.value);

      try {
        savedValues[key] = input.value;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedValues));
      } catch (err) {
        // Storage unavailable (private mode, quota, etc.) — fill-in still works, just not remembered.
      }
    });
  });
}

// Live filter for cheatsheet command cards
const searchInput = document.getElementById("command-search");
if (searchInput) {
  const cards = Array.from(document.querySelectorAll(".command-card"));
  const noResults = document.getElementById("no-results");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const haystack = card.dataset.search || card.textContent.toLowerCase();
      const matches = haystack.includes(query);
      card.style.display = matches ? "" : "none";
      if (matches) visibleCount += 1;
    });

    if (noResults) {
      noResults.style.display = visibleCount === 0 ? "block" : "none";
    }
  });
}
