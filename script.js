
let maxPoints = 5; 
let currentPoints = 0;
const answeredQuestions = new Set(); 

function updateProgressBar(questionId) {
    const progressBar = document.getElementById(`progress-${questionId.replace('question', '')}`);
    
    if (progressBar) {
        const percentage = (currentPoints / maxPoints) * 100;
        
        
        const fillElement = progressBar.querySelector('.progress-fill-small');
        fillElement.style.width = percentage + '%';
        fillElement.textContent = `${currentPoints} / ${maxPoints}`;
        
        
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

function addPoint(questionId) {
    if (!answeredQuestions.has(questionId)) {
        answeredQuestions.add(questionId);
        currentPoints++;
        updateProgressBar(questionId);
    }
}


function parseNumber(str) {
    console.log('Input zu parseNumber (raw):', str);
    console.log('Input zu parseNumber (JSON):', JSON.stringify(str));
    console.log('Länge:', str.length);
    

    let cleaned = str.replace(/\s/g, '');  

    console.log('Nach Whitespace-Entfernung:', cleaned);
    
    
    let fracMatch = cleaned.match(/\\frac\{([^}]*)\}\{([^}]*)\}/);
    if (fracMatch) {
        const numerator = Number(fracMatch[1]);
        const denominator = Number(fracMatch[2]);
        if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
            const result = numerator / denominator;
            console.log(`LaTeX \\frac{}{} erkannt: ${numerator}/${denominator} = ${result}`);
            return result;
        }
    }
    

    let fracNoMatch = cleaned.match(/\\frac(\d+)(\d+)/);
    if (fracNoMatch) {
        const numerator = Number(fracNoMatch[1]);
        const denominator = Number(fracNoMatch[2]);
        if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
            const result = numerator / denominator;
            console.log(`LaTeX \\frac (ohne Klammern) erkannt: ${numerator}/${denominator} = ${result}`);
            return result;
        }
    }
    
    
    if (cleaned.includes('/')) {
        const parts = cleaned.split('/');
        if (parts.length === 2) {
            const num = Number(parts[0]);
            const den = Number(parts[1]);
            if (!isNaN(num) && !isNaN(den) && den !== 0) {
                const result = num / den;
                console.log(`Bruch erkannt: ${num}/${den} = ${result}`);
                return result;
            }
        }
    }
    
    
    const n = Number(cleaned.replace(',', '.'));
    if (!isNaN(n) && cleaned !== '') {
        console.log(`Dezimalzahl erkannt: ${n}`);
        return n;
    }
    
    console.log('Format konnte nicht geparst werden!');
    return null;
}


function setupFractionCheck(buttonId, fieldId, outputId, correctAnswer, questionId) {
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
                addPoint(questionId); // Punkt hinzufügen
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


setupFractionCheck('pruefen-knopf', 'math-field-rechnung', 'antwort-text', 15/16, 'question1');
setupFractionCheck('pruefen-knopf2', 'math-field-rechnung2', 'antwort-text2', 3/6, 'question2');
setupFractionCheck('pruefen-knopf3', 'math-field-rechnung3', 'antwort-text3', 1/6, 'question3');
setupFractionCheck('pruefen-knopf4', 'math-field-rechnung4', 'antwort-text4', 2, 'question4');
setupFractionCheck('pruefen-knopf5', 'math-field-rechnung5', 'antwort-text5', 3, 'question5');

function checkAllQuestionsAnswered() {
    const weiterContainer = document.getElementById('weiter-container');
    
    if (currentPoints === maxPoints) {
        weiterContainer.classList.remove('hidden');
    } else {
        weiterContainer.classList.add('hidden');
    }
}

function setupWeiterButton() {
    const weiterButton = document.getElementById('weiter-button');
    
    weiterButton.addEventListener('click', function() {
        window.location.href = 'lektion2.html';
    });
}

setupWeiterButton();

// Override der addPoint Funktion, um den Button zu aktualisieren
const originalAddPoint = addPoint;
addPoint = function(questionId) {
    originalAddPoint(questionId);
    checkAllQuestionsAnswered();
};
