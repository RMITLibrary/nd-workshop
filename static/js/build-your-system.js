document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const q1Form = document.getElementById('build-q1');
    const q2Form = document.getElementById('build-q2');
    const q3Form = document.getElementById('build-q3');
    const planDiv = document.getElementById('plan');

    const q2Highlight = document.getElementById('build-q2-question-highlight');
    const challengeTextSpan = document.getElementById('build-challenge');
    const tech1Span = document.getElementById('build-technique1');
    const tech2Span = document.getElementById('build-technique2');
    const techMainSpan = document.getElementById('build-technique-main');

    const restartBtn = planDiv.querySelector('.prev-question');

    // Optionally hide the plan at start
    planDiv.hidden = true;

    // Hard‑coded mapping from technique label -> tools/info ids
   const techniqueMapping = {
	'Pomodoro technique': {
		toolsId: 'tools-pomodoro',
		infoId: 'info-pomodoro'
	},
	'Body doubling': {
		toolsId: 'tools-body-doubling',
		infoId: 'info-body-doubling'
	},
	'Prioritisation': {
		toolsId: 'tools-prioritisation',
		infoId: 'info-prioritisation'
	},
	'Create urgency': {
		toolsId: 'tools-create-urgency',
		infoId: 'info-create-urgency'
	},
	'5-minute rule': {
		toolsId: 'tools-5-minute-rule',
		infoId: 'info-5-minute-rule'
	},
	'Make it pleasant': {
		toolsId: 'tools-make-it-pleasant',
		infoId: 'info-make-it-pleasant'
	},
	'Gamify it': {
		toolsId: 'tools-gamify-it',
		infoId: 'info-gamify-it'
	},
	'Break down assessments': {
		toolsId: 'tools-break-down-assessments',
		infoId: 'info-break-down-assessments'
	},
	'Schedule and time block': {
		toolsId: 'tools-schedule-timeblock',
		infoId: 'info-schedule-timeblock'
	},
	'Externalising': {
		toolsId: 'tools-externalising',
		infoId: 'info-externalising'
	}
	};

    // Hide all tools/info blocks initially
    function hideAllTechniqueBlocks() {
        Object.values(techniqueMapping).forEach(map => {
            if (map.toolsId) {
                const tools = document.getElementById(map.toolsId);
                if (tools) tools.hidden = true;
            }
            if (map.infoId) {
                const info = document.getElementById(map.infoId);
                if (info) info.hidden = true;
            }
        });
    }
    hideAllTechniqueBlocks();

    // Helper: get checked radio by name
    function getCheckedRadioValue(name) {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        if (!checked) return null;
        const label = checked.closest('.form-check').querySelector('label');
        return label ? label.textContent.trim() : null;
    }

    // Helper: get all checked checkboxes in a container
    function getCheckedCheckboxLabels(container) {
        const labels = [];
        container.querySelectorAll('input[type="checkbox"]:checked').forEach(input => {
            const label = input.closest('.form-check').querySelector('label');
            if (label) labels.push(label.textContent.trim());
        });
        return labels;
    }

    // STEP 1 → 2
    q1Form.addEventListener('submit', function (e) {
        e.preventDefault();

        const challenge = getCheckedRadioValue('radio-challenge');
        if (!challenge) {
            alert('Please select your biggest time management challenge.');
            return;
        }

        // Put challenge into Q2 question and plan text
        q2Highlight.textContent = challenge.toLowerCase();
        challengeTextSpan.textContent = challenge.toLowerCase();

        // Show Q2, hide others
        q1Form.hidden = true;
        q2Form.hidden = false;
        q3Form.hidden = true;
        planDiv.hidden = true;
    });

    // STEP 2 → 3
    q2Form.addEventListener('submit', function (e) {
        e.preventDefault();

        const techniques = getCheckedCheckboxLabels(q2Form);
        if (techniques.length < 2) {
            alert('Please select at least two techniques.');
            return;
        }

        // Store first two for the plan summary
        tech1Span.textContent = techniques[0].toLowerCase();
        tech2Span.textContent = techniques[1].toLowerCase();

        // Build Q3 options from the selected techniques
        const optionContainer = q3Form.querySelector('.option-container');
        optionContainer.innerHTML = ''; // clear existing options

        techniques.forEach((tech, index) => {
            const id = 'build-q3-' + index;
            const wrapper = document.createElement('div');
            wrapper.className = 'form-check';

            const input = document.createElement('input');
            input.className = 'form-check-input';
            input.type = 'radio';
            input.name = 'radio-technique';
            input.id = id;

            const label = document.createElement('label');
            label.className = 'form-check-label';
            label.htmlFor = id;
            label.textContent = tech;

            wrapper.appendChild(input);
            wrapper.appendChild(label);
            optionContainer.appendChild(wrapper);
        });

        // Show Q3, hide others
        q1Form.hidden = true;
        q2Form.hidden = true;
        q3Form.hidden = false;
        planDiv.hidden = true;
    });

    // STEP 3 → PLAN
    q3Form.addEventListener('submit', function (e) {
        e.preventDefault();

        const chosenTechnique = getCheckedRadioValue('radio-technique');
        if (!chosenTechnique) {
            alert('Please select a technique to try.');
            return;
        }

        // Update main technique in plan
        techMainSpan.textContent = chosenTechnique.toLowerCase();

        // Hide all technique-specific blocks and then show the relevant ones
        hideAllTechniqueBlocks();
        const mapping = techniqueMapping[chosenTechnique];
        if (mapping) {
            if (mapping.toolsId) {
                const tools = document.getElementById(mapping.toolsId);
                if (tools) tools.hidden = false;
            }
            if (mapping.infoId) {
                const info = document.getElementById(mapping.infoId);
                if (info) info.hidden = false;
            }
        }

        // Show plan
        q1Form.hidden = true;
        q2Form.hidden = true;
        q3Form.hidden = true;
        planDiv.hidden = false;
    });

    // RESTART
    restartBtn.addEventListener('click', function (e) {
        e.preventDefault();

        // Clear all selections
        q1Form.reset();
        q2Form.reset();
        q3Form.reset();

        // Hide plan, show Q1
        planDiv.hidden = true;
        q1Form.hidden = false;
        q2Form.hidden = true;
        q3Form.hidden = true;

        hideAllTechniqueBlocks();
    });
});