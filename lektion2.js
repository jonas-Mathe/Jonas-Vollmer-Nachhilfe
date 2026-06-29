
let maxPointsLektion2 = 3;
let currentPointsLektion2 = 0;
const answeredQuestionsLektion2 = new Set();

function updateProgressBarLektion2(questionId) {
    const progressBar = document.getElementById(`progress-${questionId.replace('l2-question', '')}`);
    
    if (progressBar) {
        const percentage = (currentPointsLektion2 / maxPointsLektion2) * 100;
        
        const fillElement = progressBar.querySelector('.progress-fill-small');
        fillElement.style.width = percentage + '%';
        fillElement.textContent = `${currentPointsLektion2} / ${maxPointsLektion2}`;
        
        progressBar.classList.remove('hidden');
        progressBar.classList.remove('show');
        
        void progressBar.offsetWidth;
        progressBar.classList.add('show');
        
        setTimeout(() => {
            progressBar.classList.add('hidden');
            progressBar.classList.remove('show');
        }, 3500);
    }
}

function addPointLektion2(questionId) {
    if (!answeredQuestionsLektion2.has(questionId)) {
        answeredQuestionsLektion2.add(questionId);
        currentPointsLektion2++;
        updateProgressBarLektion2(questionId);
    }
}

function setupFractionCheckLektion2(buttonId, fieldId, outputId, correctAnswer, questionId) {
    const knopf = document.getElementById(buttonId);
    const eingabeFeld = document.getElementById(fieldId);
    const antwortText = document.getElementById(outputId);
    
    if (!knopf || !eingabeFeld || !antwortText) {
        console.error(`Fehler: Element nicht gefunden - Button: ${buttonId}, Feld: ${fieldId}, Text: ${outputId}`);
        return;
    }
    
    knopf.addEventListener('click', function() {
        try {
            const rawValue = (typeof eingabeFeld.getValue === 'function') ? eingabeFeld.getValue() : eingabeFeld.value;
            const eingegebenerWert = String(rawValue || '').trim();
            console.log('Eingabe-Wert:', eingegebenerWert);

            antwortText.style.display = '';
            antwortText.style.width = 'fit-content';

            if (eingegebenerWert === "") {
                antwortText.textContent = "Bitte geben Sie etwas ein.";
                antwortText.classList.remove('success', 'error');
                antwortText.classList.add('warning');
                return;
            }

            const parsed = parseNumber(eingegebenerWert);
            if (parsed === null) {
                antwortText.textContent = "Ungültige Eingabe.";
                antwortText.classList.remove('success', 'error');
                antwortText.classList.add('warning');
                return;
            }

            if (Math.abs(parsed - correctAnswer) < 0.0001) {
                antwortText.textContent = "Sehr gut du hast es richtig.";
                antwortText.classList.remove('warning', 'error');
                antwortText.classList.add('success');
                antwortText.style.display = 'flex';
                addPointLektion2(questionId);
            } else {
                antwortText.textContent = "Das ist falsch.";
                antwortText.classList.remove('success', 'warning');
                antwortText.classList.add('error');
                antwortText.style.display = 'flex';
            }
        } catch (e) {
            console.error('Fehler bei der Antwortprüfung:', e);
            antwortText.textContent = "Ein Fehler ist aufgetreten.";
            antwortText.classList.remove('success', 'warning');
            antwortText.classList.add('error');
        }
    });
}

setupFractionCheckLektion2('pruefen-knopf-aufgabe1', 'math-field-aufgabe1', 'antwort-text-aufgabe1', 32, 'l2-question1');
setupFractionCheckLektion2('pruefen-knopf-aufgabe2', 'math-field-aufgabe2', 'antwort-text-aufgabe2', 25, 'l2-question2');
setupFractionCheckLektion2('pruefen-knopf-aufgabe3', 'math-field-aufgabe3', 'antwort-text-aufgabe3', 12.56, 'l2-question3');

function checkAllQuestionsAnsweredLektion2() {
    const weiterContainer = document.getElementById('weiter-container');
    
    if (currentPointsLektion2 === maxPointsLektion2) {
        weiterContainer.classList.remove('hidden');
    } else {
        weiterContainer.classList.add('hidden');
    }
}

function setupWeiterButtonLektion2() {
    const weiterButton = document.getElementById('weiter-button');
    
    weiterButton.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
}

setupWeiterButtonLektion2();

// Beim Laden: Button verstecken
checkAllQuestionsAnsweredLektion2();

// Override der addPointLektion2 Funktion, um den Button zu aktualisieren
const originalAddPointLektion2 = addPointLektion2;
addPointLektion2 = function(questionId) {
    originalAddPointLektion2(questionId);
    checkAllQuestionsAnsweredLektion2();
};
