document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('search-form');
    const resultsBody = document.getElementById('results-body');
    const sortColumnSelect = document.getElementById('sort-column'); 
    const sortOrderSelect = document.getElementById('sort-order'); 
    const noResultsMessage = document.getElementById('no-results-message'); // added
    const columnCheckboxes = document.querySelectorAll('.column-checkbox'); // Get all checkboxes
    const resetAllButton = document.getElementById('reset-all-button');

    // Add an event listener to the "Reset All" button
    resetAllButton.addEventListener('click', function () {
        // Iterate through all the checkboxes and check them
        columnCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    });

    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const searchQuery = document.getElementById('search-input').value;
        const searchColumn = document.getElementById('search-column').value;
        const sortColumn = sortColumnSelect.value; 
        const sortOrder = sortOrderSelect.value; 

        // Get the selected columns
        const selectedColumns = Array.from(columnCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

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
                        noResultsMessage.style.display = 'none';

                        // Check if any results were found
                        if (response.length > 0) {
                            // Create a table header row
                            const tableHeaderRow = document.createElement('tr');
                            for (const key in response[0]) {
                                if (selectedColumns.includes(key)) {
                                    const th = document.createElement('th');
                                    th.textContent = key;
                                    tableHeaderRow.appendChild(th);
                                }
                            }
                            resultsBody.appendChild(tableHeaderRow);

                            // Create rows for each result
                            for (const result of response) {
                                const row = document.createElement('tr');
                                for (const key in result) {
                                    if (selectedColumns.includes(key)) {
                                        const cell = document.createElement('td');
                                        if (key === 'PubMed_ID') {
                                            // Create a link to PubMed using the PubMed ID
                                            const pubMedLink = document.createElement('a');
                                            pubMedLink.href = 'https://pubmed.ncbi.nlm.nih.gov/' + result[key]; // Construct the PubMed URL
                                            pubMedLink.textContent = result[key]; // Display the PubMed ID
                                            cell.appendChild(pubMedLink);
                                        } 
                                        else if (key === 'PDB_ID') {
                                            // Create a link to PDB using the PDB ID
                                            const PDBLink = document.createElement('a');
                                            PDBLink.href = 'https://www.rcsb.org/structure/' + result[key]; // Construct the PDB URL
                                            PDBLink.textContent = result[key]; // Display the PubMed ID
                                            cell.appendChild(PDBLink);
                                        } 
                                        else {
                                            cell.textContent = result[key];
                                        }
                                        row.appendChild(cell);
                                    }  
                                }
                                resultsBody.appendChild(row);
                            }
                        }
                        else {
                            //Display no result found message
                            noResultsMessage.style.display = 'block';    
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
        xhr.send(`search_query=${searchQuery}&search_column=${searchColumn}&sort_column=${sortColumn}&sort_order=${sortOrder}`);    });
});