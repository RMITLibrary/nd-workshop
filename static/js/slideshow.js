// Initialize the current slide index
let slideIndex = 1;

// Get all elements with the class 'my-slide'
let slides = document.getElementsByClassName("my-slide");
let dots = document.getElementsByClassName("dot");

// Store the image element for later use (only relevant for hotspot modes)
var imageElement = document.querySelector('.hotspot-container img');

let clicked = false;

// Determine the mode of the slideshow based on its classes
// class="slideshow"                        - normal slideshow
// class="slideshow hotspot-text-below"     - hotspot with content below
// class="slideshow hotspot-text-cover"     - hotspot content in boxes covering image on large screens
const slideshowElement = document.querySelector('.slideshow');
let slideshowMode = 'regular';

// Check which mode the slideshow is in and set the variable
if (slideshowElement && slideshowElement.classList.contains('hotspot-text-cover')) {
    slideshowMode = 'textCover';
} else if (slideshowElement && slideshowElement.classList.contains('hotspot-text-below')) {
    slideshowMode = 'textBelow';
}

// Display first slide in certain modes
if (slideshowMode === 'regular' || slideshowMode === 'textBelow') {
    showSlides(slideIndex);
} else if (slideshowMode === 'textCover') {

    // For the 'textCover' mode, check if screen is mobile sized
    var isMobile = isWindowLessThan768();

    // Show first slide in mobile
    if (isMobile) {
        showSlides(slideIndex);
    } else {
        // First slide remains hidden on desktop
        slideIndex = 0;

        // Add event listeners to close current slide if image is clicked or dragged
        if (imageElement) {
            imageElement.addEventListener('click', function () {
                console.log('Image clicked!');
                if (slideIndex !== 0) closeSlide();
            });

            imageElement.addEventListener('dragstart', function () {
                console.log('Image is being dragged!');
                if (slideIndex !== 0) closeSlide();
            });
        }

        // Select all elements with the class 'btn-close'
        const closeButtons = document.querySelectorAll('.btn-close');

        // Attach a click event listener to each button
        closeButtons.forEach(button => {
            button.addEventListener('click', function () {
                closeSlide();
            });
        });
    }
}

// Update the progress numbers
displayNumbers();

/* ========= Navigation controls ========= */

// Controls for navigating slides, called when prev/next is clicked
function plusSlides(n) {
    clicked = true;
    showSlides(slideIndex += n);
}

// Hotspot controls, called when a hot spot (dot) is clicked
function currentSlide(n) {
    clicked = true;

    const isMobile = isWindowLessThan768();

    if (n !== slideIndex) {
        showSlides(slideIndex = n);
    } else if (slideshowMode === 'textCover' && !isMobile) {
        // If we are in textCover mode and not in mobile and the slide is already displayed
        // and user clicks on its hot spot, close it
        closeSlide();
    }
}

/* ========= Core: showSlides ========= */

function showSlides(n) {
    // Handle empty slideshow safely
    if (!slides.length) return;

    // Loop around the slides if the index is out of bounds
    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }

    // Hide all slides and reset ARIA
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        slides[i].setAttribute('aria-current', 'false');
    }

    console.log("show slides");

    // Show selected slide
    const activeIndex = slideIndex - 1;
    const activeSlide = slides[activeIndex];
    activeSlide.style.display = "block";
    activeSlide.setAttribute('aria-current', 'true');

    const isMobile = isWindowLessThan768();

    if (slideshowMode === 'textCover' && !isMobile && imageElement) {
        positionHotspotSlide(activeIndex);
    }

    // Update dots' appearance and ARIA if they exist
    updateDots();

    // Update the progress numbers
    displayNumbers();

    // Set the focus (differs depending on slideshow mode)
    setFocus();
}

/* ========= Dots / hotspots ========= */

function updateDots() {
    if (!dots.length || slideIndex === 0) return;

    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
        dots[i].setAttribute('aria-pressed', 'false');
    }

    const activeDot = dots[slideIndex - 1];
    if (activeDot) {
        activeDot.classList.add('active');
        activeDot.setAttribute('aria-pressed', 'true');
    }
}

/* ========= Progress indicator ========= */

function displayNumbers() {
    const progressNumbers = document.getElementById("progress-numbers");
    if (!progressNumbers || slideIndex === 0 || !slides.length) return;

    progressNumbers.textContent = slideIndex + " of " + slides.length;
}

/* ========= Positioning for hotspot textCover ========= */

function positionHotspotSlide(n) {
    // Guard cases
    if (!dots.length || !slides.length || !imageElement) return;
    const mySpot = dots[n];
    const mySlide = slides[n];

    if (!mySpot || !mySlide) return;

    // Get computed styles for positioning
    const spotStyle = window.getComputedStyle(mySpot);
    const originalLeft = parseFloat(spotStyle.left);
    const originalTop = parseFloat(spotStyle.top);
    const spotWidth = parseFloat(spotStyle.width);
    const spotHeight = parseFloat(spotStyle.height);

    const slideStyle = window.getComputedStyle(mySlide);
    const slideWidth = parseFloat(slideStyle.width);
    const slideHeight = parseFloat(slideStyle.height);

    // Calculate new left position and ensure it fits within bounds
    let newLeft = originalLeft + (spotWidth / 2) + 8;

    if (newLeft + slideWidth > imageElement.width) {
        newLeft = originalLeft - slideWidth - (spotWidth / 2) - 8;
    }

    // Calculate new top position based on bounds
    const upperBound = imageElement.height * 0.15;
    const lowerBound = imageElement.height * 0.85;

    let newTop;

    if (originalTop < upperBound) {
        // Align to top of hotspot
        newTop = originalTop - (spotHeight / 2);
    } else if (originalTop > lowerBound) {
        // Align to bottom of hotspot
        newTop = originalTop + (spotHeight / 2) - slideHeight;
    } else {
        // Centre vertically on hotspot
        newTop = originalTop - (slideHeight / 2);
    }

    // Adjust position to keep slide within view
    if (newTop < 0) {
        newTop = 10;
    } else if (newTop + slideHeight > imageElement.height) {
        newTop = imageElement.height - slideHeight - 10;
    }

    // Round values for setting position
    newLeft = Math.round(newLeft);
    newTop = Math.round(newTop);

    mySlide.style.top = newTop + "px";
    mySlide.style.left = newLeft + "px";

    // Adjust position of close button if content is scrollable
    const slideContent = mySlide.querySelector('.slide-content');
    if (slideContent && slideContent.scrollHeight > slideContent.clientHeight) {
        const closeButton = mySlide.querySelector('.btn-close');
        if (closeButton) {
            closeButton.style.right = "20px";
        }
    }
}

/* ========= Focus management ========= */

function setFocus() {
    // Prevent focus from occurring without user clicking something
    if (!clicked) return;

    const isMobile = isWindowLessThan768();

    if (slideshowMode === 'regular') {
        // Focus the content heading
        focusContent();
    } else if (slideshowMode === 'textCover' && !isMobile) {
        // textCover mode on desktop – focus content
        focusContent();
    } else {
        // Mobile or textBelow hotspot: focus hidden button just above the image
        const skipContent = document.getElementById('skip-content');
        if (skipContent) {
            skipContent.focus();
        }
    }
}

function focusContent() {
    if (slideIndex === 0) return;
    const topAnchor = document.getElementById('top-slide' + slideIndex);
    if (topAnchor) {
        topAnchor.focus();
    }
}

/* ========= Closing slides (textCover) ========= */

function closeSlide() {
    // Hide all slides and clear ARIA state
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        slides[i].setAttribute('aria-current', 'false');
    }

    // Update previously selected dot appearance/ARIA
    if (slideIndex > 0 && dots.length) {
        const idx = slideIndex - 1;
        if (dots[idx]) {
            dots[idx].classList.remove('active');
            dots[idx].setAttribute('aria-pressed', 'false');
        }
    }

    // Reset slideIndex; no slide is active
    slideIndex = 0;

    // Optionally clear progress numbers
    const progressNumbers = document.getElementById("progress-numbers");
    if (progressNumbers) {
        progressNumbers.textContent = "";
    }
}

/* ========= Utility ========= */

function isWindowLessThan768() {
    return window.innerWidth < 768;
}