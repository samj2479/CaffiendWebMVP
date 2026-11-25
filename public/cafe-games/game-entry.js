(() => {
  const params = new URLSearchParams(location.search);
  const english = params.get("lang") === "en";
  const catalog = english ? "/en/games" : "/games";

  for (const link of document.querySelectorAll("[data-game-return]")) {
    link.href = catalog;
  }
  if (english) {
    for (const element of document.querySelectorAll("[data-en-label]")) {
      element.setAttribute("aria-label", element.dataset.enLabel);
    }
    for (const element of document.querySelectorAll("[data-en]")) {
      element.lang = "en";
      element.textContent = element.dataset.en;
    }
  }

  const form = document.getElementById("launchForm");
  const selected = params.get("game");
  if (selected !== "merge") {
    location.replace(catalog);
    return;
  }
  if (english) {
    document.title = "Digul Digul | Caffiend";
    document.getElementById("entryScreen").lang = "en";
  }

  function startWithNickname(start) {
    const profile = window.DigulExperience;
    const input = document.getElementById("nicknameInput");
    const error = document.getElementById("nicknameError");
    const saved = profile.validateNickname(profile.getNickname());
    if (saved.ok) {
      start(saved.value);
      return;
    }
    form.addEventListener("submit", event => {
      event.preventDefault();
      const result = profile.setNickname(input.value);
      if (!result.ok) {
        error.textContent = english ? document.getElementById("nicknameHint").textContent : result.reason;
        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }
      error.textContent = "";
      input.removeAttribute("aria-invalid");
      start(result.value);
    });
    form.querySelector('button[type="submit"]').disabled = false;
  }

  window.CaffiendGameEntry = { selected, startWithNickname };
})();
