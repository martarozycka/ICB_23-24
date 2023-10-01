document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('search-form');
    const resultsBody = document.getElementById('results-body');

    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const searchQuery = document.getElementById('search-input').value;
        const searchColumn = document.getElementById('search-column').value;

        // Send search query and column to search.php using AJAX
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'search.php', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        // Log the response to the console for debugging
                        console.log("Response from server:", xhr.responseText);

                        // Parse the JSON response
                        const response = JSON.parse(xhr.responseText);

                        // Clear previous results
                        resultsBody.innerHTML = '';

                        // Check if any results were found
                        if (response.length > 0) {
                            // Create a table header row
                            const tableHeaderRow = document.createElement('tr');
                            for (const key in response[0]) {
                                const th = document.createElement('th');
                                th.textContent = key;
                                tableHeaderRow.appendChild(th);
                            }
                            resultsBody.appendChild(tableHeaderRow);

                            // Create rows for each result
                            for (const result of response) {
                                const row = document.createElement('tr');
                                for (const key in result) {
                                    const cell = document.createElement('td');
                                    cell.textContent = result[key];
                                    row.appendChild(cell);
                                }
                                resultsBody.appendChild(row);
                            }
                        }
                    } catch (error) {
                        // Handle JSON parsing errors
                        console.error("JSON parsing error:", error);
                        // Optionally, display an error message to the user
                    }    
                } else {
                    // Display a message if no results were found
                    const noResultsRow = document.createElement('tr');
                    const noResultsCell = document.createElement('td');
                    noResultsCell.textContent = 'No results found.';
                    noResultsCell.colSpan = Object.keys(response[0]).length;
                    noResultsRow.appendChild(noResultsCell);
                    resultsBody.appendChild(noResultsRow);
                }
            }
        };
        xhr.send(`search_query=${searchQuery}&search_column=${searchColumn}`);
    });
});
