function error_fade() {
        const errorBox = document.getElementById("errorBox");
    if (errorBox) {
        setTimeout(() => {
            errorBox.style.opacity = "0";
            setTimeout(() => {
                errorBox.style.display = "none";
            }, 1000); 
        }, 3000);
    }
}