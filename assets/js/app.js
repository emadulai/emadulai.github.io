/**
 * ============================================================================
 * EmadulAi — Core Application Engine
 * Handles State, Live Search, Filtering, Theme, Favorites, and Visited History
 * ============================================================================
 */

(function () {
  "use strict";

  // Storage Keys
  const STORAGE_THEME = "emadulai_theme";
  const STORAGE_FAVORITES = "emadulai_favorites";
  const STORAGE_HISTORY = "emadulai_history";

  // DOM Elements
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const sidebarToggleBtn = document.getElementById("sidebarToggleBtn");
  const sidebarCloseBtn = document.getElementById("sidebarCloseBtn");
  const appSidebar = document.getElementById("appSidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  const searchInput = document.getElementById("globalSearchInput");
  const searchClearBtn = document.getElementById("searchClearBtn");
  const searchResultsCount = document.getElementById("searchResultsCount");

  const categoryBar = document.getElementById("categoryFilterBar");
  const toolsContainer = document.getElementById("toolsGridContainer");
  const favoritesContainer = document.getElementById("favoritesGridContainer");
  const recentContainer = document.getElementById("recentGridContainer");

  // State
  let currentCategory = "All Tools";
  let searchQuery = "";

  /* --------------------------------------------------------------------------
     Theme Management
     -------------------------------------------------------------------------- */
  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_THEME);
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

    setTheme(initialTheme, false);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", () => {
        const activeTheme = document.documentElement.getAttribute("data-theme") || "light";
        const newTheme = activeTheme === "dark" ? "light" : "dark";
        setTheme(newTheme, true);
      });
    }

    // System theme sync listener
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem(STORAGE_THEME)) {
        setTheme(e.matches ? "dark" : "light", false);
      }
    });
  }

  function setTheme(theme, persist) {
    document.documentElement.setAttribute("data-theme", theme);
    if (persist) {
      try {
        localStorage.setItem(STORAGE_THEME, theme);
      } catch (err) {
        console.warn("Storage quota exceeded or disabled:", err);
      }
    }
  }

  /* --------------------------------------------------------------------------
     Sidebar Drawer Management
     -------------------------------------------------------------------------- */
  function initSidebar() {
    if (sidebarToggleBtn && appSidebar && sidebarOverlay) {
      sidebarToggleBtn.addEventListener("click", openSidebar);
      sidebarCloseBtn.addEventListener("click", closeSidebar);
      sidebarOverlay.addEventListener("click", closeSidebar);

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && appSidebar.classList.contains("open")) {
          closeSidebar();
        }
      });
    }
  }

  function openSidebar() {
    appSidebar.classList.add("open");
    sidebarOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    appSidebar.classList.remove("open");
    sidebarOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  /* --------------------------------------------------------------------------
     Favorites System (localStorage)
     -------------------------------------------------------------------------- */
  function getFavorites() {
    try {
      const data = localStorage.getItem(STORAGE_FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function toggleFavorite(toolId) {
    let favorites = getFavorites();
    if (favorites.includes(toolId)) {
      favorites = favorites.filter((id) => id !== toolId);
    } else {
      favorites.push(toolId);
    }
    try {
      localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(favorites));
    } catch (e) {
      console.warn("Unable to save favorites:", e);
    }

    renderAllViews();
  }

  /* --------------------------------------------------------------------------
     Recently Visited History (localStorage)
     -------------------------------------------------------------------------- */
  function recordVisit(toolId) {
    try {
      let history = JSON.parse(localStorage.getItem(STORAGE_HISTORY) || "[]");
      history = history.filter((item) => item.id !== toolId);
      history.unshift({ id: toolId, timestamp: Date.now() });
      if (history.length > 8) history.pop();
      localStorage.setItem(STORAGE_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.warn("Unable to record history:", e);
    }
  }

  function getHistoryIds() {
    try {
      const history = JSON.parse(localStorage.getItem(STORAGE_HISTORY) || "[]");
      return history.map((item) => item.id);
    } catch (e) {
      return [];
    }
  }

  /* --------------------------------------------------------------------------
     Card Generator & Rendering
     -------------------------------------------------------------------------- */
  function renderToolCard(tool, isFavorited) {
    const iconSvg = window.EmadulAi.icons[tool.icon] || window.EmadulAi.icons.tool;
    const isAvailable = tool.status === "available";
    const statusClass = isAvailable ? "badge-available" : "badge-coming-soon";
    const statusLabel = isAvailable ? "Ready" : "Coming Soon";
    const favClass = isFavorited ? "favorited" : "";

    return `
      <article class="tool-card" data-id="${tool.id}">
        <div class="card-top">
          <div class="card-icon-wrap">${iconSvg}</div>
          <button class="card-favorite-btn ${favClass}" data-fav="${tool.id}" title="Save to Favorites" aria-label="Favorite ${tool.name}">
            <svg fill="${isFavorited ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        <span class="card-badge ${statusClass}">${statusLabel}</span>
        <h3>${tool.name}</h3>
        <p>${tool.description}</p>
        <div class="card-footer">
          <span class="card-category-label">${tool.category}</span>
          ${
            isAvailable
              ? `<a href="${tool.url}" class="card-action-link" data-track="${tool.id}">Open Tool <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></a>`
              : `<span class="card-action-link" style="color:var(--color-text-muted); cursor:not-allowed;">In Progress</span>`
          }
        </div>
      </article>
    `;
  }

  function renderCategoryFilters() {
    if (!categoryBar) return;
    const tools = window.EmadulAi.tools || [];
    const counts = {};

    tools.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });

    let html = `
      <button class="category-chip ${currentCategory === 'All Tools' ? 'active' : ''}" data-cat="All Tools">
        All Tools <span class="count">${tools.length}</span>
      </button>
    `;

    window.EmadulAi.categories.forEach((cat) => {
      const count = counts[cat] || 0;
      if (count > 0) {
        html += `
          <button class="category-chip ${currentCategory === cat ? 'active' : ''}" data-cat="${cat}">
            ${cat} <span class="count">${count}</span>
          </button>
        `;
      }
    });

    categoryBar.innerHTML = html;

    categoryBar.querySelectorAll(".category-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentCategory = btn.getAttribute("data-cat");
        renderCategoryFilters();
        renderMainToolsGrid();
      });
    });
  }

  function renderMainToolsGrid() {
    if (!toolsContainer) return;
    const tools = window.EmadulAi.tools || [];
    const favorites = getFavorites();

    const filtered = tools.filter((tool) => {
      const matchesCategory = currentCategory === "All Tools" || tool.category === currentCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });

    if (searchResultsCount) {
      searchResultsCount.textContent = `${filtered.length} tool${filtered.length === 1 ? '' : 's'} available`;
    }

    if (filtered.length === 0) {
      toolsContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h3>No matching tools found</h3>
          <p>Try searching for a different keyword or select another category above.</p>
        </div>
      `;
      return;
    }

    toolsContainer.innerHTML = filtered.map((t) => renderToolCard(t, favorites.includes(t.id))).join("");
    bindCardEvents(toolsContainer);
  }

  function renderFavoritesGrid() {
    if (!favoritesContainer) return;
    const favorites = getFavorites();
    const tools = (window.EmadulAi.tools || []).filter((t) => favorites.includes(t.id));

    if (tools.length === 0) {
      favoritesContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <p>No favorites added yet. Click the heart icon on any tool card to access it quickly here.</p>
        </div>
      `;
      return;
    }

    favoritesContainer.innerHTML = tools.map((t) => renderToolCard(t, true)).join("");
    bindCardEvents(favoritesContainer);
  }

  function renderRecentGrid() {
    if (!recentContainer) return;
    const historyIds = getHistoryIds();
    const allTools = window.EmadulAi.tools || [];
    const favorites = getFavorites();

    const tools = historyIds
      .map((id) => allTools.find((t) => t.id === id))
      .filter(Boolean);

    if (tools.length === 0) {
      recentContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <p>Your recently used tools will be cataloged here automatically as you navigate.</p>
        </div>
      `;
      return;
    }

    recentContainer.innerHTML = tools.map((t) => renderToolCard(t, favorites.includes(t.id))).join("");
    bindCardEvents(recentContainer);
  }

  function bindCardEvents(container) {
    // Favorite buttons
    container.querySelectorAll(".card-favorite-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const toolId = btn.getAttribute("data-fav");
        toggleFavorite(toolId);
      });
    });

    // Tool Visit Trackers
    container.querySelectorAll("a[data-track]").forEach((link) => {
      link.addEventListener("click", () => {
        const toolId = link.getAttribute("data-track");
        recordVisit(toolId);
      });
    });
  }

  function renderAllViews() {
    renderMainToolsGrid();
    renderFavoritesGrid();
    renderRecentGrid();
  }

  /* --------------------------------------------------------------------------
     Search Listener
     -------------------------------------------------------------------------- */
  function initSearch() {
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      if (searchClearBtn) {
        searchClearBtn.style.display = searchQuery ? "inline-flex" : "none";
      }
      renderMainToolsGrid();
    });

    if (searchClearBtn) {
      searchClearBtn.addEventListener("click", () => {
        searchInput.value = "";
        searchQuery = "";
        searchClearBtn.style.display = "none";
        searchInput.focus();
        renderMainToolsGrid();
      });
    }

    // Keyboard shortcuts: ESC clears search
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.activeElement === searchInput) {
        searchInput.value = "";
        searchQuery = "";
        if (searchClearBtn) searchClearBtn.style.display = "none";
        renderMainToolsGrid();
      }
    });
  }

  /* --------------------------------------------------------------------------
     FAQ Accordion Interactivity
     -------------------------------------------------------------------------- */
  function initFaq() {
    document.querySelectorAll(".faq-item").forEach((item) => {
      const q = item.querySelector(".faq-question");
      if (q) {
        q.addEventListener("click", () => {
          const isOpen = item.classList.contains("open");
          document.querySelectorAll(".faq-item").forEach((el) => el.classList.remove("open"));
          if (!isOpen) item.classList.add("open");
        });
      }
    });
  }

  /* --------------------------------------------------------------------------
     Lifecycle Bootstrapper
     -------------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initSidebar();
    initSearch();
    renderCategoryFilters();
    renderAllViews();
    initFaq();
  });
})();
