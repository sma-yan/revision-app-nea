const subjectContainer = document.querySelector('#subjects-container');
const addSubjectBtn = document.querySelector('#add-subject');
const calculateGradeBtn = document.querySelector('#calculate-grade');
const resetCalculatorBtn = document.querySelector('#reset-calculator-btn');
const finalGradeDisplay = document.querySelector('#final-grade');


addSubjectBtn.addEventListener('click', () => {
    const subjectEntry = document.createElement('div');
    subjectEntry.classList.add('subject-entry');
    subjectEntry.innerHTML = `
        <label>Subject Name: <input type="text" class="subject-name"></label>
        <label>Marks Obtained: <input type="number" id="marks-obtained"></label>
        <label>Total Marks: <input type="number" id="total-marks"></label>
    `
    subjectContainer.appendChild(subjectEntry);
})

resetCalculatorBtn.addEventListener('click', () => {
    subjectContainer.innerHTML = `
        <div class="subject-entry">
            <label>Subject Name: <input type="text" class="subject-name"></label>
            <label>Marks Obtained: <input type="number" id="marks-obtained"></label>
            <label>Total Marks: <input type="number" id="total-marks"></label>
        </div>
    `;
    finalGradeDisplay.textContent = '--';
    
});


calculateGradeBtn.addEventListener('click', () => {
    const subjectEntries = document.querySelectorAll('.subject-entry');
    let totalMarksObtained = 0;
    let totalMarksPossible = 0;

    console.log(subjectEntries);
    

    subjectEntries.forEach(entry => {
        console.log(entry);
        
        const marksObtained = parseFloat(entry.querySelector('#marks-obtained').value);
        const totalMarks = parseFloat(entry.querySelector('#total-marks').value);
        console.log(marksObtained + ' - ' + totalMarks);
        
        if (!isNaN(marksObtained) && !isNaN(totalMarks)) {
            totalMarksObtained += marksObtained;
            totalMarksPossible += totalMarks;
    
        }
    });

    if (totalMarksPossible > 0) {
        const finalGrade = (totalMarksObtained / totalMarksPossible) * 100;
        finalGradeDisplay.textContent = finalGrade.toFixed(2);
    } else {
        alert("Please enter valid marks for all subjects.");
    }
    
});

