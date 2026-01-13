// custom.js - Custom Biology Exam Analysis

// Question database (topic mapping)
const questionDatabase = {
    // Topic 1: Characteristics of Living Organisms
    1: { topic: 1, type: 'mcq' }, 2: { topic: 1, type: 'mcq' }, 3: { topic: 1, type: 'mcq' },
    4: { topic: 1, type: 'mcq' }, 5: { topic: 1, type: 'mcq' }, 6: { topic: 1, type: 'mcq' },
    
    // Topic 2: Cell Structure
    7: { topic: 2, type: 'mcq' }, 8: { topic: 2, type: 'mcq' }, 9: { topic: 2, type: 'mcq' },
    10: { topic: 2, type: 'mcq' }, 11: { topic: 2, type: 'mcq' }, 12: { topic: 2, type: 'mcq' },
    13: { topic: 2, type: 'mcq' }, 14: { topic: 2, type: 'mcq' }, 15: { topic: 2, type: 'mcq' },
    16: { topic: 2, type: 'mcq' }, 17: { topic: 2, type: 'mcq' }, 18: { topic: 2, type: 'mcq' },
    19: { topic: 2, type: 'mcq' },
    
    // Topic 3: Movement of Substances
    20: { topic: 3, type: 'mcq' }, 21: { topic: 3, type: 'mcq' }, 22: { topic: 3, type: 'mcq' },
    23: { topic: 3, type: 'mcq' }, 24: { topic: 3, type: 'mcq' }, 25: { topic: 3, type: 'mcq' },
    26: { topic: 3, type: 'mcq' },
    
    // Topic 4: Biological Molecules & Food Tests
    27: { topic: 4, type: 'mcq' }, 28: { topic: 4, type: 'mcq' }, 29: { topic: 4, type: 'mcq' },
    30: { topic: 4, type: 'mcq' }, 31: { topic: 4, type: 'mcq' }, 32: { topic: 4, type: 'mcq' },
    33: { topic: 4, type: 'mcq' }, 34: { topic: 4, type: 'mcq' },
    
    // Topic 5: Enzymes
    35: { topic: 5, type: 'mcq' }, 36: { topic: 5, type: 'mcq' }, 37: { topic: 5, type: 'mcq' },
    38: { topic: 5, type: 'mcq' }, 39: { topic: 5, type: 'mcq' }, 40: { topic: 5, type: 'mcq' },
    
    // FRQ Questions
    // Topic mapping for FRQs
    'FRQ1': { topic: 6, type: 'frq' },
    'FRQ2': { topic: 1, type: 'frq' },
    'FRQ3': { topic: 2, type: 'frq' },
    'FRQ4': { topic: 6, type: 'frq' },
    'FRQ5': { topic: 2, type: 'frq' },
    'FRQ6': { topic: 6, type: 'frq' },
    'FRQ7': { topic: 3, type: 'frq' },
    'FRQ8': { topic: 2, type: 'frq' },
    'FRQ9': { topic: 4, type: 'frq' },
    'FRQ10': { topic: 5, type: 'frq' },
    'FRQ11': { topic: 5, type: 'frq' },
    'FRQ12': { topic: 5, type: 'frq' }
};

// Total questions per topic
const topicTotals = {
    1: 7,  // 6 MCQ + 1 FRQ
    2: 17, // 13 MCQ + 4 FRQ
    3: 9,  // 7 MCQ + 2 FRQ
    4: 9,  // 8 MCQ + 1 FRQ
    5: 9,  // 6 MCQ + 3 FRQ
    6: 3   // 3 FRQ
};

// Topic names
const topicNames = {
    1: 'Living Organisms',
    2: 'Cell Structure',
    3: 'Movement of Substances',
    4: 'Biological Molecules',
    5: 'Enzymes',
    6: 'Practical Skills'
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    setupEventListeners();
    
    // Check for saved data in URL
    loadFromURL();
});

// Set up all event listeners
function setupEventListeners() {
    // Calculate button
    document.getElementById('calculate-btn').addEventListener('click', calculateMastery);
    
    // Clear button
    document.getElementById('clear-btn').addEventListener('click', clearAll);
    
    // Example button
    document.getElementById('example-btn').addEventListener('click', loadExample);
    
    // Copy button
    document.getElementById('copy-btn').addEventListener('click', copyShareCode);
    
    // Quick input parsing
    document.getElementById('quick-input').addEventListener('change', parseQuickInput);
    document.getElementById('frq-input').addEventListener('change', parseFRQInput);
}

// Parse quick input (comma separated)
function parseQuickInput() {
    const input = document.getElementById('quick-input').value;
    const numbers = input.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num) && num >= 1 && num <= 40);
    
    // Uncheck all MCQ checkboxes first
    document.querySelectorAll('input[data-type="mcq"]').forEach(cb => cb.checked = false);
    
    // Check the selected ones
    numbers.forEach(num => {
        const checkbox = document.querySelector(`input[data-type="mcq"][value="${num}"]`);
        if (checkbox) checkbox.checked = true;
    });
}

// Parse FRQ input
function parseFRQInput() {
    const input = document.getElementById('frq-input').value;
    const numbers = input.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num) && num >= 1 && num <= 12);
    
    // Uncheck all FRQ checkboxes first
    document.querySelectorAll('input[data-type="frq"]').forEach(cb => cb.checked = false);
    
    // Check the selected ones
    numbers.forEach(num => {
        const checkbox = document.querySelector(`input[data-type="frq"][value="${num}"]`);
        if (checkbox) checkbox.checked = true;
    });
}

// Main calculation function
function calculateMastery() {
    // Get all checked checkboxes (incorrect questions)
    const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    
    if (checkedBoxes.length === 0) {
        alert('Please select at least one incorrect question.');
        return;
    }
    
    // Collect incorrect questions
    const incorrectQuestions = [];
    checkedBoxes.forEach(cb => {
        const value = cb.value;
        const type = cb.dataset.type;
        const topic = parseInt(cb.dataset.topic);
        
        // For MCQ questions (1-40)
        if (type === 'mcq') {
            incorrectQuestions.push({
                number: parseInt(value),
                type: 'mcq',
                topic: topic
            });
        }
        // For FRQ questions (1-12)
        else if (type === 'frq') {
            incorrectQuestions.push({
                number: `FRQ${value}`,
                type: 'frq',
                topic: topic
            });
        }
    });
    
    // Calculate mastery per topic
    const topicStats = calculateTopicStatistics(incorrectQuestions);
    
    // Display results
    displayResults(topicStats, incorrectQuestions);
    
    // Show results section
    document.getElementById('results-section').style.display = 'block';
    
    // Scroll to results
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
}

// Calculate statistics for each topic
function calculateTopicStatistics(incorrectQuestions) {
    const stats = {};
    
    // Initialize all topics
    for (let topic = 1; topic <= 6; topic++) {
        stats[topic] = {
            total: topicTotals[topic],
            incorrect: 0,
            correct: topicTotals[topic],
            mastery: 100
        };
    }
    
    // Count incorrect questions per topic
    incorrectQuestions.forEach(q => {
        if (stats[q.topic]) {
            stats[q.topic].incorrect++;
            stats[q.topic].correct = stats[q.topic].total - stats[q.topic].incorrect;
            stats[q.topic].mastery = Math.round((stats[q.topic].correct / stats[q.topic].total) * 100);
        }
    });
    
    return stats;
}

// Display results on page
function displayResults(topicStats, incorrectQuestions) {
    // Update summary cards
    const totalQuestions = 52; // 40 MCQ + 12 FRQ
    const totalIncorrect = incorrectQuestions.length;
    const totalCorrect = totalQuestions - totalIncorrect;
    const overallScore = Math.round((totalCorrect / totalQuestions) * 100);
    
    document.getElementById('incorrect-count').textContent = totalIncorrect;
    document.getElementById('correct-count').textContent = totalCorrect;
    document.getElementById('overall-score').textContent = `${overallScore}%`;
    
    // Create charts
    createMasteryChart(topicStats);
    createWeakTopicsChart(topicStats);
    
    // Generate topic analysis HTML
    generateTopicAnalysis(topicStats);
    
    // Generate recommendations
    generateRecommendations(topicStats);
    
    // Generate share code
    generateShareCode(incorrectQuestions);
}

// Create mastery chart
function createMasteryChart(topicStats) {
    const ctx = document.getElementById('customMasteryChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.masteryChart) {
        window.masteryChart.destroy();
    }
    
    const labels = Object.keys(topicStats).map(topic => topicNames[topic]);
    const data = Object.keys(topicStats).map(topic => topicStats[topic].mastery);
    
    window.masteryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Mastery (%)',
                data: data,
                backgroundColor: data.map(mastery => {
                    if (mastery >= 85) return 'rgba(76, 175, 80, 0.7)';
                    if (mastery >= 70) return 'rgba(255, 152, 0, 0.7)';
                    return 'rgba(244, 67, 54, 0.7)';
                }),
                borderColor: data.map(mastery => {
                    if (mastery >= 85) return 'rgba(76, 175, 80, 1)';
                    if (mastery >= 70) return 'rgba(255, 152, 0, 1)';
                    return 'rgba(244, 67, 54, 1)';
                }),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Mastery (%)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const topic = Object.keys(topicStats)[context.dataIndex];
                            const stats = topicStats[topic];
                            return [
                                `Mastery: ${stats.mastery}%`,
                                `Correct: ${stats.correct}/${stats.total}`,
                                `Incorrect: ${stats.incorrect}`
                            ];
                        }
                    }
                }
            }
        }
    });
}

// Create weak topics chart
function createWeakTopicsChart(topicStats) {
    const ctx = document.getElementById('weakTopicsChart').getContext('2d');
    
    // Filter topics with mastery < 80%
    const weakTopics = Object.entries(topicStats)
        .filter(([topic, stats]) => stats.mastery < 80)
        .sort((a, b) => a[1].mastery - b[1].mastery);
    
    if (weakTopics.length === 0) {
        document.getElementById('weakTopicsChart').parentElement.innerHTML = 
            '<p class="no-data">All topics have mastery above 80%! Great job!</p>';
        return;
    }
    
    // Destroy existing chart if it exists
    if (window.weakTopicsChart) {
        window.weakTopicsChart.destroy();
    }
    
    const labels = weakTopics.map(([topic, stats]) => topicNames[topic]);
    const data = weakTopics.map(([topic, stats]) => stats.mastery);
    
    window.weakTopicsChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(244, 67, 54, 0.8)',
                    'rgba(255, 152, 0, 0.8)',
                    'rgba(255, 193, 7, 0.8)',
                    'rgba(156, 39, 176, 0.8)',
                    'rgba(33, 150, 243, 0.8)',
                    'rgba(0, 150, 136, 0.8)'
                ].slice(0, weakTopics.length)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Mastery: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

// Generate topic analysis HTML
function generateTopicAnalysis(topicStats) {
    const container = document.getElementById('custom-topics');
    let html = '';
    
    for (let topic = 1; topic <= 6; topic++) {
        const stats = topicStats[topic];
        const mastery = stats.mastery;
        
        // Determine color based on mastery
        let colorClass = 'high';
        if (mastery < 70) colorClass = 'low';
        else if (mastery < 85) colorClass = 'medium';
        
        html += `
        <div class="topic-card">
            <div class="topic-header">
                <h3>${topic}. ${topicNames[topic]}</h3>
                <span class="mastery-badge ${colorClass}">${mastery}% Mastery</span>
            </div>
            <div class="progress-container">
                <div class="progress-label">
                    <span>Score: ${stats.correct}/${stats.total}</span>
                    <span>${mastery}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill ${colorClass}" style="width: ${mastery}%;"></div>
                </div>
            </div>
            <div class="topic-details">
                <p><strong>Performance:</strong> ${getPerformanceText(mastery)}</p>
                <div class="strengths-weaknesses">
                    <div class="strength">
                        <i class="fas fa-check-circle"></i>
                        <span><strong>Correct:</strong> ${stats.correct} questions</span>
                    </div>
                    <div class="weakness">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span><strong>Incorrect:</strong> ${stats.incorrect} questions</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
    
    container.innerHTML = html;
}

// Generate performance text
function getPerformanceText(mastery) {
    if (mastery >= 90) return 'Excellent understanding';
    if (mastery >= 80) return 'Good understanding';
    if (mastery >= 70) return 'Average understanding';
    if (mastery >= 60) return 'Needs improvement';
    return 'Requires significant review';
}

// Generate recommendations
function generateRecommendations(topicStats) {
    const container = document.getElementById('custom-recommendations');
    
    // Sort topics by mastery (lowest first)
    const sortedTopics = Object.entries(topicStats)
        .map(([topic, stats]) => ({ topic: parseInt(topic), ...stats }))
        .sort((a, b) => a.mastery - b.mastery);
    
    // High priority (mastery < 70)
    const highPriority = sortedTopics.filter(t => t.mastery < 70);
    // Medium priority (70 ≤ mastery < 85)
    const mediumPriority = sortedTopics.filter(t => t.mastery >= 70 && t.mastery < 85);
    // Low priority (mastery ≥ 85)
    const lowPriority = sortedTopics.filter(t => t.mastery >= 85);
    
    let html = '<h3><i class="fas fa-lightbulb"></i> Personalized Study Recommendations</h3>';
    
    html += '<div class="recommendations-grid">';
    
    // High Priority
    if (highPriority.length > 0) {
        html += `
        <div class="plan-card priority-high">
            <div class="plan-header">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>High Priority Review</h3>
            </div>
            <ul>
                ${highPriority.map(t => 
                    `<li><strong>${topicNames[t.topic]}:</strong> Focus on ${getTopicFocus(t.topic)}</li>`
                ).join('')}
                <li>Spend 45 minutes daily on these topics</li>
                <li>Review fundamental concepts first</li>
                <li>Complete practice questions for each topic</li>
            </ul>
        </div>`;
    }
    
    // Medium Priority
    if (mediumPriority.length > 0) {
        html += `
        <div class="plan-card priority-medium">
            <div class="plan-header">
                <i class="fas fa-tasks"></i>
                <h3>Medium Priority Practice</h3>
            </div>
            <ul>
                ${mediumPriority.map(t => 
                    `<li><strong>${topicNames[t.topic]}:</strong> Practice ${getTopicPractice(t.topic)}</li>`
                ).join('')}
                <li>Spend 30 minutes every other day</li>
                <li>Focus on application questions</li>
                <li>Review past mistakes</li>
            </ul>
        </div>`;
    }
    
    // Low Priority
    if (lowPriority.length > 0) {
        html += `
        <div class="plan-card priority-low">
            <div class="plan-header">
                <i class="fas fa-check-circle"></i>
                <h3>Maintain Strength</h3>
            </div>
            <ul>
                ${lowPriority.map(t => 
                    `<li><strong>${topicNames[t.topic]}:</strong> Keep up with ${getTopicMaintain(t.topic)}</li>`
                ).join('')}
                <li>Weekly review for 20 minutes</li>
                <li>Challenge yourself with advanced questions</li>
                <li>Help peers understand these topics</li>
            </ul>
        </div>`;
    }
    
    html += '</div>';
    
    container.innerHTML = html;
}

// Helper functions for recommendations
function getTopicFocus(topic) {
    const focusAreas = {
        1: 'MRS GREN characteristics and examples',
        2: 'cell organelles and specialized cells',
        3: 'diffusion, osmosis, and active transport',
        4: 'food tests and biological molecules',
        5: 'enzyme properties and graphs',
        6: 'graph plotting and calculations'
    };
    return focusAreas[topic] || 'key concepts';
}

function getTopicPractice(topic) {
    const practiceAreas = {
        1: 'identifying characteristics in different organisms',
        2: 'cell structure diagrams and functions',
        3: 'osmosis and diffusion calculations',
        4: 'interpreting complex food test results',
        5: 'enzyme activity graphs',
        6: 'experimental design questions'
    };
    return practiceAreas[topic] || 'application questions';
}

function getTopicMaintain(topic) {
    const maintainAreas = {
        1: 'monthly review of characteristics',
        2: 'identifying cell structures quickly',
        3: 'regular calculation practice',
        4: 'food test procedures',
        5: 'enzyme theory',
        6: 'graph interpretation skills'
    };
    return maintainAreas[topic] || 'current understanding';
}

// Generate share code
function generateShareCode(incorrectQuestions) {
    // Create a simple code representing incorrect questions
    const mcqMistakes = incorrectQuestions
        .filter(q => q.type === 'mcq')
        .map(q => q.number)
        .join(',');
    
    const frqMistakes = incorrectQuestions
        .filter(q => q.type === 'frq')
        .map(q => q.number.replace('FRQ', ''))
        .join(',');
    
    // Create a compact code
    const shareCode = btoa(JSON.stringify({
        mcq: mcqMistakes,
        frq: frqMistakes,
        date: new Date().toISOString().split('T')[0]
    }));
    
    document.getElementById('share-code').value = shareCode;
}

// Copy share code to clipboard
function copyShareCode() {
    const shareCode = document.getElementById('share-code');
    shareCode.select();
    document.execCommand('copy');
    
    // Show notification
    showNotification('Share code copied to clipboard!', 'success');
}

// Load data from URL (if shared)
function loadFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const data = urlParams.get('data');
    
    if (data) {
        try {
            const decoded = JSON.parse(atob(data));
            
            // Check if it's our format
            if (decoded.mcq || decoded.frq) {
                // Parse MCQ mistakes
                if (decoded.mcq) {
                    decoded.mcq.split(',').forEach(num => {
                        const checkbox = document.querySelector(`input[data-type="mcq"][value="${num}"]`);
                        if (checkbox) checkbox.checked = true;
                    });
                }
                
                // Parse FRQ mistakes
                if (decoded.frq) {
                    decoded.frq.split(',').forEach(num => {
                        const checkbox = document.querySelector(`input[data-type="frq"][value="${num}"]`);
                        if (checkbox) checkbox.checked = true;
                    });
                }
                
                // Auto-calculate
                setTimeout(() => {
                    calculateMastery();
                    showNotification('Loaded saved results!', 'success');
                }, 500);
            }
        } catch (e) {
            console.error('Error loading from URL:', e);
        }
    }
}

// Load example data
function loadExample() {
    // Clear first
    clearAll();
    
    // Set some example mistakes
    const exampleMistakes = [5, 12, 18, 22, 25, 29, 33, 38, 40];
    exampleMistakes.forEach(num => {
        const checkbox = document.querySelector(`input[data-type="mcq"][value="${num}"]`);
        if (checkbox) checkbox.checked = true;
    });
    
    // Set some FRQ mistakes
    document.querySelector(`input[data-type="frq"][value="2"]`).checked = true;
    document.querySelector(`input[data-type="frq"][value="6"]`).checked = true;
    document.querySelector(`input[data-type="frq"][value="9"]`).checked = true;
    
    // Update quick input fields
    document.getElementById('quick-input').value = exampleMistakes.join(', ');
    document.getElementById('frq-input').value = '2, 6, 9';
    
    showNotification('Example data loaded! Click "Calculate My Mastery" to see results.', 'info');
}

// Clear all selections
function clearAll() {
    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    // Clear input fields
    document.getElementById('quick-input').value = '';
    document.getElementById('frq-input').value = '';
    
    // Hide results
    document.getElementById('results-section').style.display = 'none';
    
    showNotification('All selections cleared!', 'info');
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        font-weight: 500;
        transition: all 0.3s ease;
        background-color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
        color: white;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
