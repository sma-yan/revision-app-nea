const subjectContainer = document.querySelector('#subjects-container');
const addSubjectBtn = document.querySelector('#add-subject');
const calculateGradeBtn = document.querySelector('#calculate-grade');
const resetCalculatorBtn = document.querySelector('#reset-calculator-btn');
const finalPercentageDisplay = document.querySelector('#final-percentage');
const finalGradeDisplay = document.querySelector('#final-grade');
const highestScoreDisplay = document.querySelector('#highest-score');
const lowestScoreDisplay = document.querySelector('#lowest-score');

// Add more subject fields dynamically
addSubjectBtn.addEventListener('click', () => {
    const subjectEntry = document.createElement('div');
    subjectEntry.classList.add('subject-entry');
    subjectEntry.innerHTML = `
        <label>Subject: 
            <select class="subject-dropdown">
                <option value="">Select Subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="English">English</option>
                <option value="History">History</option>
                <option value="Geography">Geography</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Economics">Economics</option>
            </select>
        </label>
        <label>Marks Obtained: <input type="number" class="marks-obtained"></label>
        <label>Total Marks: <input type="number" class="total-marks"></label>
    `;
    subjectContainer.appendChild(subjectEntry);
});

// Reset calculator to default state
resetCalculatorBtn.addEventListener('click', () => {
    subjectContainer.innerHTML = `
        <div class="subject-entry">
            <label>Subject: 
                <select class="subject-dropdown">
                    <option value="">Select Subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                    <option value="History">History</option>
                    <option value="Geography">Geography</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Economics">Economics</option>
                </select>
            </label>
            <label>Marks Obtained: <input type="number" class="marks-obtained"></label>
            <label>Total Marks: <input type="number" class="total-marks"></label>
        </div>
    `;
    finalPercentageDisplay.textContent = '--';
    finalGradeDisplay.textContent = '--';
    highestScoreDisplay.textContent = '--';
    lowestScoreDisplay.textContent = '--';
});

// Calculate the overall grade
calculateGradeBtn.addEventListener('click', () => {
    const subjectEntries = document.querySelectorAll('.subject-entry');
    let totalMarksObtained = 0;
    let totalMarksPossible = 0;
    let highestScore = 0;
    let lowestScore = Infinity;

    subjectEntries.forEach(entry => {
        const marksObtained = parseFloat(entry.querySelector('.marks-obtained').value);
        const totalMarks = parseFloat(entry.querySelector('.total-marks').value);

        if (!isNaN(marksObtained) && !isNaN(totalMarks)) {
            totalMarksObtained += marksObtained;
            totalMarksPossible += totalMarks;

            if (marksObtained > highestScore) highestScore = marksObtained;
            if (marksObtained < lowestScore) lowestScore = marksObtained;
        }
    });

    if (totalMarksPossible > 0) {
        const finalPercentage = (totalMarksObtained / totalMarksPossible) * 100;
        finalPercentageDisplay.textContent = finalPercentage.toFixed(2);

        // Determine Grade
        let grade = "U";  // Default to Ungraded (Fail)
        if (finalPercentage >= 80) grade = "A*";
        else if (finalPercentage >= 70) grade = "A";
        else if (finalPercentage >= 60) grade = "B";
        else if (finalPercentage >= 50) grade = "C";
        else if (finalPercentage >= 40) grade = "D";
        else if (finalPercentage >= 30) grade = "E";

        finalGradeDisplay.textContent = grade;
        highestScoreDisplay.textContent = highestScore;
        lowestScoreDisplay.textContent = lowestScore === Infinity ? "--" : lowestScore;
    } else {
        alert("Please enter valid marks for all subjects.");
    }
});
