
const credentialPlayer = document.querySelector("[data-credential-player]");
const credentialTracks = Array.from(credentialPlayer.querySelectorAll(".credential-track"));
const featureName = credentialPlayer.querySelector("[data-feature-name]");
const featureImage = credentialPlayer.querySelector("[data-feature-image]");
const featureArt = credentialPlayer.querySelector(".credential-art");
const featureIssuer = credentialPlayer.querySelector("[data-feature-issuer]");
const featureDate = credentialPlayer.querySelector("[data-feature-date]");
const position = credentialPlayer.querySelector("[data-position]");
const progress = credentialPlayer.querySelector("[data-progress]");
let activeTrack = 0;

function selectCredential(index) {
  activeTrack = (index + credentialTracks.length) % credentialTracks.length;
  const track = credentialTracks[activeTrack];
  const number = String(activeTrack + 1).padStart(2, "0");

  featureName.textContent = track.dataset.name;
  featureImage.src = track.dataset.image;
  featureImage.alt = `${track.dataset.name} badge`;
  featureArt.classList.toggle("is-round-badge", /(?:pmi-project-management-ready|it-specialist-python)\.png$/.test(track.dataset.image));
  featureIssuer.textContent = track.dataset.issuer;
  featureDate.textContent = track.dataset.date;
  featureDate.dateTime = track.dataset.year;
  position.textContent = `${number} / ${String(credentialTracks.length).padStart(2, "0")}`;
  progress.style.width = `${((activeTrack + 1) / credentialTracks.length) * 100}%`;
  credentialTracks.forEach((item, trackIndex) => {
    item.setAttribute("aria-pressed", String(trackIndex === activeTrack));
  });
}

credentialPlayer.querySelector("[data-previous]").addEventListener("click", () => selectCredential(activeTrack - 1));
credentialPlayer.querySelector("[data-next]").addEventListener("click", () => selectCredential(activeTrack + 1));
credentialTracks.forEach((track, index) => track.addEventListener("click", () => selectCredential(index)));
selectCredential(0);

function updateBadgeTitleOverflow() {
  credentialTracks.forEach((track) => {
    const title = track.querySelector(".track-copy strong");
    const availableWidth = track.querySelector(".track-copy").clientWidth;
    const overflow = Math.ceil(title.getBoundingClientRect().width - availableWidth);
    track.classList.toggle("has-long-title", overflow > 1);
    track.style.setProperty("--title-scroll-distance", `${-Math.max(0, overflow)}px`);
    track.style.setProperty("--title-scroll-duration", `${Math.max(5, overflow / 28 + 3)}s`);
  });
}

if ("ResizeObserver" in window) {
  const titleResizeObserver = new ResizeObserver(updateBadgeTitleOverflow);
  credentialTracks.forEach((track) => titleResizeObserver.observe(track.querySelector(".track-copy")));
} else {
  window.addEventListener("resize", updateBadgeTitleOverflow);
}
document.fonts?.ready.then(updateBadgeTitleOverflow);
updateBadgeTitleOverflow();

const revealTargets = document.querySelectorAll(
  ".hero > *, .internship-details > *, .interest-list, .section-heading, .about-grid > *, .project, .timeline-item, .credential-feature, .credential-tracklist, .footer-inner"
);

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  }, {
    rootMargin: "-8% 0px -8% 0px",
    threshold: 0
  });

  revealTargets.forEach((target) => {
    target.classList.add("scroll-reveal");
    revealObserver.observe(target);
  });
  document.documentElement.classList.add("js-scroll-effects");
}
