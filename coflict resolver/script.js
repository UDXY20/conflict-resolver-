document.getElementById('resolveButton').addEventListener('click', resolveConflicts);
document.getElementById('clearButton').addEventListener('click', clearText);

function resolveConflicts() {
    const conflictInput = document.getElementById('conflictInput').value;
    const resolutionOutput = document.getElementById('resolutionOutput');
    resolutionOutput.innerHTML = ''; // Clear previous resolution output

    const conflictSections = parseConflicts(conflictInput);

    conflictSections.forEach((section, index) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('conflict-section');

        const header = document.createElement('div');
        header.classList.add('conflict-header');
        header.innerText = `Conflict Section ${index + 1}`;
        sectionDiv.appendChild(header);

        const currentDiv = document.createElement('div');
        currentDiv.classList.add('conflict-content');
        currentDiv.innerText = `Current Changes:\n${section.current}`;
        sectionDiv.appendChild(currentDiv);

        const incomingDiv = document.createElement('div');
        incomingDiv.classList.add('conflict-content');
        incomingDiv.innerText = `Incoming Changes:\n${section.incoming}`;
        sectionDiv.appendChild(incomingDiv);

        const baseDiv = document.createElement('div');
        baseDiv.classList.add('conflict-content');
        baseDiv.innerText = `Base Changes:\n${section.base}`;
        sectionDiv.appendChild(baseDiv);

        const currentButton = document.createElement('button');
        currentButton.classList.add('choice');
        currentButton.innerText = 'Keep Current Changes';
        currentButton.addEventListener('click', () => applyResolution(sectionDiv, section.current));
        sectionDiv.appendChild(currentButton);

        const incomingButton = document.createElement('button');
        incomingButton.classList.add('choice');
        incomingButton.innerText = 'Accept Incoming Changes';
        incomingButton.addEventListener('click', () => applyResolution(sectionDiv, section.incoming));
        sectionDiv.appendChild(incomingButton);

        const manualButton = document.createElement('button');
        manualButton.classList.add('choice');
        manualButton.innerText = 'Enter Manual Resolution';
        manualButton.addEventListener('click', () => manualResolution(sectionDiv));
        sectionDiv.appendChild(manualButton);

        resolutionOutput.appendChild(sectionDiv);
    });
}

function parseConflicts(conflictText) {
    const conflictRegex = /<<<<<<< HEAD([\s\S]*?)=======([\s\S]*?)>>>>>>> [\w]+/g;
    const matches = conflictText.matchAll(conflictRegex);

    const conflictSections = [];
    for (const match of matches) {
        const baseStart = conflictText.lastIndexOf('|||||||', match.index) + 7;
        const baseEnd = match.index;
        const baseText = baseStart < baseEnd ? conflictText.substring(baseStart, baseEnd).trim() : '';

        conflictSections.push({
            current: match[1].trim(),
            incoming: match[2].trim(),
            base: baseText
        });
    }
    return conflictSections;
}

function applyResolution(sectionDiv, resolution) {
    const resolvedDiv = document.createElement('div');
    resolvedDiv.classList.add('conflict-content');
    resolvedDiv.innerText = resolution;

    sectionDiv.innerHTML = ''; // Clear previous conflict section content
    sectionDiv.appendChild(resolvedDiv);
}

function manualResolution(sectionDiv) {
    const manualTextarea = document.createElement('textarea');
    manualTextarea.style.width = '100%';
    manualTextarea.style.height = '100px';

    const submitButton = document.createElement('button');
    submitButton.classList.add('choice');
    submitButton.innerText = 'Apply Manual Resolution';
    submitButton.addEventListener('click', () => {
        if (manualTextarea.value.trim() === '') {
            alert('Manual resolution cannot be empty.');
        } else {
            applyResolution(sectionDiv, manualTextarea.value);
        }
    });

    sectionDiv.innerHTML = ''; // Clear previous conflict section content
    sectionDiv.appendChild(manualTextarea);
    sectionDiv.appendChild(submitButton);
}

function clearText() {
    document.getElementById('conflictInput').value = '';
}