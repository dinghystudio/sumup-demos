document.addEventListener("DOMContentLoaded", () => {
  const countElement = document.querySelector(".count-number");
  const coinElement = document.querySelector(".coin");

  // Count Animation
  setTimeout(() => {
    animateCount(countElement);
  }, 1000);

  // Remove classes when animations end
  coinElement.addEventListener("animationend", () => {
    coinElement.classList.remove("initial", "flip");
  });

  // Coin flip animation on click
  coinElement.addEventListener("click", () => {
    coinElement.classList.add("flip");
  });
});

function animateCount(element, duration = 2000) {
  // Get current and max values from data attributes
  const currentValue = parseInt(element.dataset.current, 10);
  const maxValue = parseInt(element.dataset.max, 10);
  // Start value is what's currently in the element
  const startValue = parseInt(element.textContent, 10);

  // Find the parent with class "league-info"
  const parentElement = element.closest(".league-info");

  // Track animation progress
  let startTime = null;

  // Easing functions for smoother deceleration
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  // Use easeOutCubic for a smoother animation
  const ease = easeOutCubic;

  const animate = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const linearProgress = Math.min(elapsed / duration, 1);

    // Apply easing function to the progress
    const easedProgress = ease(linearProgress);

    // Calculate current display value based on eased progress
    const displayValue = Math.floor(
      startValue + easedProgress * (currentValue - startValue)
    );
    element.textContent = displayValue;

    // Use the raw eased progress for a smoother progress bar animation
    const smoothProgress =
      startValue / maxValue +
      easedProgress * ((currentValue - startValue) / maxValue);

    // Update CSS custom property with the smooth progress percentage
    if (parentElement) {
      parentElement.style.setProperty(
        "--count-progress",
        `${smoothProgress * 100}%`
      );
    }

    if (linearProgress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Ensure we end with exactly the target value
      element.textContent = currentValue;
      // Final overall progress
      const finalProgress = (currentValue / maxValue) * 100;
      if (parentElement) {
        parentElement.style.setProperty(
          "--count-progress",
          `${finalProgress}%`
        );
      }
    }
  };

  requestAnimationFrame(animate);
}
