
document.addEventListener("DOMContentLoaded", () => {
	const triggers = document.querySelectorAll(".trigger");

	triggers.forEach(trigger => {
		trigger.addEventListener("mouseenter", () => {
			const tipId = trigger.getAttribute("tooltipID");
			const tip = document.querySelector(tipId);
			if (!tip) return;

			// Get dimensions
			const triggerRect = trigger.getBoundingClientRect();
			const screenW = window.innerWidth;
			const scrollY = window.scrollY;

			// Show it momentarily at opacity 0 to get its height/width.
			tip.style.display = "block"; 
			const tipRect = tip.getBoundingClientRect();

			// Vertical logic (flip if hits top).
			let ttTop = (triggerRect.top + scrollY) - tipRect.height - 15;
			if (ttTop < scrollY + 10) {
				ttTop = (triggerRect.bottom + scrollY) + 15;
			}

			// Horizontal logic (shift if hits right edge).
			let ttLeft = triggerRect.left;
			const tipRightEdge = ttLeft + tipRect.width;

			if (tipRightEdge > screenW) {
				const overflow = tipRightEdge - screenW;
				ttLeft = ttLeft - overflow - 20;	// 20px padding from edge.
			}

			// Apply and activate
			tip.style.top = `${ttTop}px`;
			tip.style.left = `${ttLeft}px`;
			tip.classList.add("is-active");
		});

		trigger.addEventListener("mouseleave", () => {
			const tipId = trigger.getAttribute("tooltipID");
			const tip = document.querySelector(tipId);
			if (tip) tip.classList.remove("is-active");
		});
	});
});