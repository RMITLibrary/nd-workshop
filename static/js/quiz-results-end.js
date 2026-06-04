document.addEventListener('DOMContentLoaded', function () {
  const pages = Array.from(document.querySelectorAll('.quiz-page'));
  const nextButtons = document.querySelectorAll('.next-question');
  const resultsContainer = document.getElementById('results');
  const retakeButton = document.getElementById('retake-quiz');

  //enable bs tool tops
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


  // Map set IDs to result section IDs
  const resultMap = {
    set1: 'result-procrastination',
    set2: 'result-distraction',
    set3: 'result-scheduling',
    set4: 'result-overcommitting'
  };

  function showPage(index) {
    pages.forEach(function (page, i) {
      if (i === index) {
        page.hidden = false;
      } else {
        page.hidden = true;
      }
    });
  }

  // Attach click handlers to "Next / Get results" buttons
  nextButtons.forEach(function (btn, index) {
    btn.addEventListener('click', function (event) {
      event.preventDefault();

      const isLast = index === pages.length - 1;
      if (!isLast) {
        showPage(index + 1);
      } else {
        calculateAndShowResults();
      }
    });
  });

  function calculateAndShowResults() {
    // Hide quiz pages
    pages.forEach(function (page) {
      page.hidden = true;
    });

    // For each set, sum its sliders
    pages.forEach(function (page) {
      const setId = page.id;
      const inputs = page.querySelectorAll('.form-range');
      let total = 0;

      inputs.forEach(function (input) {
        const rawValue = input.value;
        const value = Number(rawValue);
        total = total + value;
      });

      const band = scoreBand(total);
      showResultForSet(setId, band);
    });

    resultsContainer.hidden = false;
  }

  function scoreBand(total) {
    if (total >= 13) {
      return 'high';         // 13–15
    }
    if (total >= 10) {
      return 'moderate';     // 10–12
    }
    if (total >= 7) {
      return 'low';          // 7–9
    }
    return 'minimal';        // 3–6
  }

  function showResultForSet(setId, band) {
	const resultSectionId = resultMap[setId];
	if (!resultSectionId) {
		return;
	}

	const section = document.getElementById(resultSectionId);
	if (!section) {
		return;
	}

	section.hidden = false;

	// ---- Add / update trim class on card-body ----
	const cardBody = section.querySelector('.card-body');
	if (cardBody) {
		// Remove any existing trim classes
		cardBody.classList.remove('trim-top-wrong', 'trim-top-neutral', 'trim-top-right');

		// Map band to trim class
		let trimClass = '';
		switch (band) {
		case 'minimal':   // 3–6
			trimClass = 'trim-top-right';
			break;
		case 'low':       // 7–9
			trimClass = 'trim-top-right';
			break;
		case 'moderate':  // 10–12
			trimClass = 'trim-top-neutral';
			break;
		case 'high':      // 13–15
			trimClass = 'trim-top-wrong';
			break;
		}

		if (trimClass) {
		cardBody.classList.add(trimClass);
		}
	}
	// ---------------------------------------------

	// Hide all ranges within this section
	const ranges = section.querySelectorAll('.result-range');
	ranges.forEach(function (rangeEl) {
		rangeEl.hidden = true;
	});

	// Show the range that matches the band
	const selector = '.result-range[data-range="' + band + '"]';
	const target = section.querySelector(selector);
	if (target) {
		target.hidden = false;
	}
	}

  // --- Retake quiz logic ---

  if (retakeButton) {
    retakeButton.addEventListener('click', function (event) {
      event.preventDefault();
      resetQuiz();
    });
  }

  function resetQuiz() {
    // Hide results container
    resultsContainer.hidden = true;

    // Hide all result sections and their ranges
    const sectionIds = Object.values(resultMap);
    sectionIds.forEach(function (sectionId) {
      const section = document.getElementById(sectionId);
      if (!section) return;

      const cardBody = section.querySelector('.card-body');
      if (cardBody) {
        cardBody.classList.remove('trim-top-wrong', 'trim-top-neutral', 'trim-top-right');
      }

      section.hidden = true;
      const ranges = section.querySelectorAll('.result-range');
      ranges.forEach(function (rangeEl) {
        rangeEl.hidden = true;
      });
    });

    // Reset all sliders to 3
    const allRanges = document.querySelectorAll('.form-range');
    allRanges.forEach(function (input) {
      input.value = 3;
    });

    // Show first quiz page again
    showPage(0);
  }

  // Initialise: set all sliders to 3 on load as well
  const allRangesOnLoad = document.querySelectorAll('.form-range');
  allRangesOnLoad.forEach(function (input) {
    input.value = 3;
  });

  // Show first page on load
  showPage(0);
});