// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all charts
    initCharts();
    
    // Add smooth scrolling
    initSmoothScrolling();
    
    // Add topic card interaction
    initTopicCards();
});

// Initialize charts
function initCharts() {
    // Topic Mastery Chart
    const masteryCtx = document.getElementById('masteryChart').getContext('2d');
    new Chart(masteryCtx, {
        type: 'bar',
        data: {
            labels: ['Living Organisms', 'Cell Structure', 'Movement', 'Molecules', 'Enzymes', 'Practical Skills'],
            datasets: [{
                label: 'Mastery (%)',
                data: [85, 78, 72, 80, 88, 70],
                backgroundColor: [
                    'rgba(76, 175, 80, 0.7)',
                    'rgba(33, 150, 243, 0.7)',
                    'rgba(255, 152, 0, 0.7)',
                    'rgba(156, 39, 176, 0.7)',
                    'rgba(244, 67, 54, 0.7)',
                    'rgba(0, 150, 136, 0.7)'
                ],
                borderColor: [
                    'rgba(76, 175, 80, 1)',
                    'rgba(33, 150, 243, 1)',
                    'rgba(255, 152, 0, 1)',
                    'rgba(156, 39, 176, 1)',
                    'rgba(244, 67, 54, 1)',
                    'rgba(0, 150, 136, 1)'
                ],
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
                },
                x: {
                    title: {
                        display: true,
                        text: 'Topics'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
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

    // Question Type Performance Chart
    const questionTypeCtx = document.getElementById('questionTypeChart').getContext('2d');
    new Chart(questionTypeCtx, {
        type: 'doughnut',
        data: {
            labels: ['Multiple Choice', 'Free Response'],
            datasets: [{
                data: [40, 7],
                backgroundColor: [
                    'rgba(46, 125, 50, 0.8)',
                    'rgba(33, 150, 243, 0.8)'
                ],
                borderColor: [
                    'rgba(46, 125, 50, 1)',
                    'rgba(33, 150, 243, 1)'
                ],
                borderWidth: 1
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
                            return `${context.label}: ${context.raw} questions`;
                        }
                    }
                }
            }
        }
    });
}

// Initialize smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize topic cards interaction
function initTopicCards() {
    const topicCards = document.querySelectorAll('.topic-card');
    
    topicCards.forEach(card => {
        card.addEventListener('click', function() {
            // Toggle expanded view
            this.classList.toggle('expanded');
            
            // Find the details section
            const details = this.querySelector('.topic-details');
            if (this.classList.contains('expanded')) {
                details.style.maxHeight = details.scrollHeight + 'px';
            } else {
                details.style.maxHeight = null;
            }
        });
    });
}

// Helper function to show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    notification.style.zIndex = '9999';
    notification.style.fontWeight = '500';
    notification.style.transition = 'all 0.3s ease';
    
    // Set color based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#F44336';
        notification.style.color = 'white';
    } else {
        notification.style.backgroundColor = '#2196F3';
        notification.style.color = 'white';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Function to update mastery percentages (for future use)
function updateMastery(topicId, newPercentage) {
    const topicCard = document.querySelector(`[data-topic="${topicId}"]`);
    if (topicCard) {
        const badge = topicCard.querySelector('.mastery-badge');
        const progressFill = topicCard.querySelector('.progress-fill');
        
        badge.textContent = `${newPercentage}% Mastery`;
        badge.style.backgroundColor = getMasteryColor(newPercentage);
        
        progressFill.style.width = `${newPercentage}%`;
        progressFill.style.backgroundColor = getMasteryColor(newPercentage);
        
        showNotification(`Updated ${topicId} mastery to ${newPercentage}%`, 'success');
    }
}

// Helper function to get color based on mastery percentage
function getMasteryColor(percentage) {
    if (percentage >= 85) return '#4CAF50'; // Green
    if (percentage >= 75) return '#2196F3'; // Blue
    if (percentage >= 60) return '#FF9800'; // Orange
    return '#F44336'; // Red
}
