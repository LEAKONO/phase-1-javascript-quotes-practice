document.addEventListener('DOMContentLoaded', () => {
    const quoteList = document.getElementById('quote-list');
    
    // Function to fetch and populate quotes
    function populateQuotes() {
        fetch('http://localhost:3000/quotes?_embed=likes')
            .then(response => response.json())
            .then(quotes => {
                quoteList.innerHTML = ''; // Clear existing quotes
                quotes.forEach(quote => {
                    const li = document.createElement('li');
                    li.classList.add('quote-card');
                    li.innerHTML = `
                        <blockquote class="blockquote">
                            <p class="mb-0">${quote.text}</p>
                            <footer class="blockquote-footer">${quote.author}</footer>
                            <br>
                            <button class='btn-success' data-id="${quote.id}">Likes: <span>${quote.likes.length}</span></button>
                            <button class='btn-danger' data-id="${quote.id}">Delete</button>
                        </blockquote>
                    `;
                    quoteList.appendChild(li);
                });
            });
    }
    
    // Populate quotes on page load
    populateQuotes();
    
    // Add event listener for submitting the form to create a new quote
    const newQuoteForm = document.getElementById('new-quote-form');
    newQuoteForm.addEventListener('submit', event => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const text = formData.get('quote');
        const author = formData.get('author');
        fetch('http://localhost:3000/quotes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text,
                author
            })
        })
        .then(response => response.json())
        .then(() => {
            populateQuotes(); // Refresh the list of quotes after adding a new one
            newQuoteForm.reset(); // Reset the form fields
        });
    });

    // Add event listener for deleting a quote
    quoteList.addEventListener('click', event => {
        if (event.target.classList.contains('btn-danger')) {
            const quoteId = event.target.getAttribute('data-id');
            fetch(`http://localhost:3000/quotes/${quoteId}`, {
                method: 'DELETE'
            })
            .then(() => {
                populateQuotes(); // Refresh the list of quotes after deleting one
            });
        }
    });

    // Add event listener for liking a quote
    quoteList.addEventListener('click', event => {
        if (event.target.classList.contains('btn-success')) {
            const quoteId = event.target.getAttribute('data-id');
            fetch('http://localhost:3000/likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quoteId: parseInt(quoteId) // Ensure quoteId is parsed as integer
                })
            })
            .then(() => {
                populateQuotes(); // Refresh the list of quotes after liking one
            });
        }
    });
});

 
