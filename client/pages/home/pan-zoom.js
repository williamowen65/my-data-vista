document.addEventListener('DOMContentLoaded', function() {

    const svg = document.getElementById("svg-root");
    const page = document.getElementById("my-observation-hub-app");

        let viewBox = { x: -500, y: -500, width: 1000, height: 1000 };
        let isPanning = false, startX, startY, startViewBoxX, startViewBoxY;
        let zoomFactor = 1.1; // Zoom speed
        let touchDistance = null; // Distance between fingers for pinch zoom

        function updateViewBox() {
            svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
        }

        // Mouse down to start panning
        page.addEventListener("mousedown", (e) => {
            isPanning = true;
            startX = e.clientX;
            startY = e.clientY;
            startViewBoxX = viewBox.x;
            startViewBoxY = viewBox.y;
            svg.style.cursor = "grabbing";
        });

        // Mouse move to pan
        page.addEventListener("mousemove", (e) => {
            if (!isPanning) return;
            let dx = (e.clientX - startX) * (viewBox.width / window.innerWidth);
            let dy = (e.clientY - startY) * (viewBox.height / window.innerHeight);
            viewBox.x = startViewBoxX - dx;
            viewBox.y = startViewBoxY - dy;
            updateViewBox();
        });

        // Mouse up to stop panning
        page.addEventListener("mouseup", () => {
            isPanning = false;
            svg.style.cursor = "grab";
        });

        page.addEventListener("mouseleave", () => {
            isPanning = false;
            svg.style.cursor = "grab";
        });

        // Zoom with mouse wheel
        page.addEventListener("wheel", (e) => {
            e.preventDefault();
            let zoom = e.deltaY < 0 ? 1 / zoomFactor : zoomFactor;
            let mouseX = e.clientX / window.innerWidth;
            let mouseY = e.clientY / window.innerHeight;

            let newWidth = viewBox.width * zoom;
            let newHeight = viewBox.height * zoom;

            viewBox.x += (viewBox.width - newWidth) * mouseX;
            viewBox.y += (viewBox.height - newHeight) * mouseY;
            viewBox.width = newWidth;
            viewBox.height = newHeight;

            updateViewBox();
        });

        // Handle touch events
        page.addEventListener("touchstart", (e) => {
            if (e.touches.length === 1) {
                // Single finger touch (pan)
                isPanning = true;
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                startViewBoxX = viewBox.x;
                startViewBoxY = viewBox.y;
            } else if (e.touches.length === 2) {
                // Two fingers (pinch zoom)
                touchDistance = getDistance(e.touches[0], e.touches[1]);
            }
        });

        page.addEventListener("touchmove", (e) => {
            if (e.touches.length === 1 && isPanning) {
                // Pan
                let dx = (e.touches[0].clientX - startX) * (viewBox.width / window.innerWidth);
                let dy = (e.touches[0].clientY - startY) * (viewBox.height / window.innerHeight);
                viewBox.x = startViewBoxX - dx;
                viewBox.y = startViewBoxY - dy;
                updateViewBox();
            } else if (e.touches.length === 2 && touchDistance !== null) {
                // Pinch Zoom
                let newDistance = getDistance(e.touches[0], e.touches[1]);
                let zoom = touchDistance / newDistance; // Zoom ratio

                let centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2 / window.innerWidth;
                let centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2 / window.innerHeight;

                let newWidth = viewBox.width * zoom;
                let newHeight = viewBox.height * zoom;

                viewBox.x += (viewBox.width - newWidth) * centerX;
                viewBox.y += (viewBox.height - newHeight) * centerY;
                viewBox.width = newWidth;
                viewBox.height = newHeight;

                touchDistance = newDistance;
                updateViewBox();
            }
        });

        page.addEventListener("touchend", () => {
            isPanning = false;
            touchDistance = null;
        });

        // Helper function to calculate distance between two touch points
        function getDistance(touch1, touch2) {
            let dx = touch2.clientX - touch1.clientX;
            let dy = touch2.clientY - touch1.clientY;
            return Math.sqrt(dx * dx + dy * dy);
        }
})