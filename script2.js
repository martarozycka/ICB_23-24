document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('search-form');
    const resultsBody = document.getElementById('results-body');
    const sortColumnSelect = document.getElementById('sort-column'); 
    const sortOrderSelect = document.getElementById('sort-order'); 
    const noResultsMessage = document.getElementById('no-results-message'); // added
    const columnCheckboxes = document.querySelectorAll('.column-checkbox'); // Get all checkboxes
    const resetAllButton = document.getElementById('reset-all-button');
    const tempMinInput = document.getElementById('temp_min');
    const tempMaxInput = document.getElementById('temp_max');
    const phMinInput = document.getElementById('ph_min');
    const phMaxInput = document.getElementById('ph_max');
    const deltagMinInput = document.getElementById('deltag_min');
    const deltagMaxInput = document.getElementById('deltag_max');
    const deltadeltagMinInput = document.getElementById('delta_deltag_min');
    const deltadeltagMaxInput = document.getElementById('delta_deltag_max');
    const pubMedIDInput = document.getElementById('search_PubMedid');
    const authorInput = document.getElementById('search_author');
    const journalInput = document.getElementById('search_journal');
    const PDB_IDInput = document.getElementById('search_PDB');
    const experimTechInput = document.getElementById('experimental_tech');
    const sourceOrganismInput = document.getElementById('search_organism');
    const protein1Input = document.getElementById('protein_1');
    const protein2Input = document.getElementById('protein_2');
    const ogAAInput = document.getElementById('ogAA');
    const mutatedAAInput = document.getElementById('mutatedAA');
    const wildMutation = document.getElementById('wildChecked');
    //const singleMutation = document.getElementById('single_mutation');
    //const doubleMutation = document.getElementById('double_mutation');
    //const multipleMutation = document.getElementById('multiple_mutation');
  

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
        const tempMin = tempMinInput.value;
        const tempMax = tempMaxInput.value;
        const phMin = phMinInput.value;
        const phMax = phMaxInput.value;
        const deltagMin = deltagMinInput.value;
        const deltagMax = deltagMaxInput.value;
        const deltadeltagMin = deltadeltagMinInput.value;
        const deltadeltagMax = deltadeltagMaxInput.value;
        const pubMedID = pubMedIDInput.value;
        const author = authorInput.value;
        const journal = journalInput.value;
        const PDBID = PDB_IDInput.value;
        const experimTech = experimTechInput.value;
        const sourceOrganism = sourceOrganismInput.value;
        const protein1 = protein1Input.value;
        const protein2 = protein2Input.value;
        const ogAA = ogAAInput.value;
        const mutatedAA = mutatedAAInput.value;

        const isWildChecked = wildMutation.checked;


        // let wildChecked = false;
        // let single = false;
        // let double = false;
        // let multiple = false;

        // if (wildMutation.checked) {
        //     wildChecked = true;
        // } else if (singleMutation.checked) {
        //     single = true;
        // } else if (doubleMutation.checked) {
        //     double = true;
        // } else if (multipleMutation.checked) {
        //     multiple = true;
        // }



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
        xhr.send(`search_query=${searchQuery}&search_column=${searchColumn}&sort_column=${sortColumn}&sort_order=${sortOrder}&temp_min=${tempMin}&temp_max=${tempMax}&ph_min=${phMin}&ph_max=${phMax}&deltag_min=${deltagMin}&deltag_max=${deltagMax}&delta_deltag_min=${deltadeltagMin}&delta_deltag_max=${deltadeltagMax}&pubMedid=${pubMedID}&author=${author}&journal=${journal}&PDBID=${PDBID}&experimental_tech=${experimTech}&search_organism=${sourceOrganism}&protein_1=${protein1}&protein_2=${protein2}&ogAA=${ogAA}&mutatedAA=${mutatedAA}&wildChecked=${isWildChecked}`);    });
});