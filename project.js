function calculateLoan() {
    var amount_input = parseInt(document.getElementById("principal").value);
    var rate_input = parseFloat(document.getElementById("rate").value);
    var time_input = parseInt(document.getElementById("time").value);
    
    var INTEREST = amount_input * rate_input * time_input / 100;
    var TOTAL = INTEREST + amount_input;

    document.querySelector(".m4").innerHTML = amount_input;
    document.querySelector(".m5").innerHTML = INTEREST;
    document.querySelector(".m6").innerHTML = TOTAL;

    // Send data to server
    fetch('http://localhost:3000/tasks', {  // Ensure the backend server is running on this URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            loanAmount: amount_input,
            interestRate: rate_input,
            loanTerm: time_input
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Loan calculation data sent:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
