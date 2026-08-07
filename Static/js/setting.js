const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");


// Popups
function openPasswordPopup() {
    document.getElementById("passwordPopup").style.display = "flex";
}
function closePasswordPopup() {
    document.getElementById("passwordPopup").style.display = "none";
}

function openLogoutWarning() {
    document.getElementById("logoutWarning").style.display = "flex";
}
function closeLogoutWarning() {
    document.getElementById("logoutWarning").style.display = "none";
}

function openDeleteWarning() {
    document.getElementById("deleteWarning").style.display = "flex";
}
function closeDeleteWarning() {
    document.getElementById("deleteWarning").style.display = "none";
}

// 2FA placeholder
function activate2FA() {
    alert("2FA activation coming soon!");
}

// Optional: clock update
function updateClock() {
    const el = document.getElementById("headerClock");
    if (!el) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    el.textContent = `${h}:${m}`;
}
setInterval(updateClock, 1000);
updateClock();


// Apply theme on page load
function applyTheme(theme) {
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
}

// Read theme from a hidden element
document.addEventListener("DOMContentLoaded", () => {
    const theme = document.getElementById("themeValue")?.value || "light";
    applyTheme(theme);
});

// Live update when user clicks radio buttons
document.querySelectorAll("input[name='theme']").forEach(radio => {
    radio.addEventListener("change", () => {
        applyTheme(radio.value);
    });
});
