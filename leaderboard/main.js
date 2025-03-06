document.addEventListener("DOMContentLoaded", () => {
  const countElement = document.querySelector(".count-number");
  const coinElement = document.querySelector(".coin");
  const upValueElements = document.querySelectorAll(".up-value");

  // Count Animation
  setTimeout(() => {
    animateCount(countElement);

    // Animate UP values with staggered delay
    upValueElements.forEach((element, index) => {
      setTimeout(() => {
        animateCount(element);
      }, 1000 + index * 100);
    });
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
  if (!element) return;

  // Get current and max values from data attributes
  const isUpValue = element.classList.contains("up-value");
  const currentValue = parseFloat(element.dataset.current);
  const maxValue = parseFloat(element.dataset.max);
  const startValue = 0;

  // Find the parent element
  const parentElement = element.closest(".league-info, li");

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
    const displayValue = isUpValue
      ? (startValue + easedProgress * (currentValue - startValue)).toFixed(3)
      : Math.floor(startValue + easedProgress * (currentValue - startValue));

    element.textContent = isUpValue ? `${displayValue} UP` : displayValue;

    // Calculate and update progress
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
      element.textContent = isUpValue ? `${currentValue} UP` : currentValue;

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
