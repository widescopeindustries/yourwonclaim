/**
 * Calculate next Sunday and display urgency countdown
 * Fixes: Hard-coded date that has already passed
 */
function initUrgencyTimer() {
  function getNextSunday() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilSunday = (7 - dayOfWeek) % 7 || 7; // 0 = today, 1-6 = days away, 7 if today is Sunday
    const nextSunday = new Date(today);
    nextSunday.setDate(nextSunday.getDate() + daysUntilSunday);
    return nextSunday;
  }

  function formatDate(date) {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  function updateCountdown() {
    const nextSunday = getNextSunday();
    const now = new Date();
    const timeRemaining = nextSunday - now;

    if (timeRemaining <= 0) {
      document.getElementById('countdown-timer').textContent = '00:00:00';
      return;
    }

    const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
    const seconds = Math.floor((timeRemaining / 1000) % 60);

    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const countdownElement = document.getElementById('countdown-timer');
    if (countdownElement) {
      countdownElement.textContent = formattedTime;
    }

    const dateElement = document.getElementById('countdown-date');
    if (dateElement) {
      dateElement.textContent = formatDate(nextSunday);
    }
  }

  // Initial update
  updateCountdown();

  // Update every second
  setInterval(updateCountdown, 1000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUrgencyTimer);
} else {
  initUrgencyTimer();
}
