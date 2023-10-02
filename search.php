<?php
// Step 1: Establish a connection to your MySQL database 
$db_host = "127.0.0.1";  // Replace with your database host
$db_user = "root";       // Replace with your database username
$db_password = "";       // Replace with your database password
$db_name = "protein database";  // Replace with your database name

// Create a connection using mysqli
$conn = new mysqli($db_host, $db_user, $db_password, $db_name);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: ".$conn->connect_error);
}

// Step 2: Retrieve the search term entered by the user from the frontend 
if (isset($_POST['search_query']) && isset($_POST['search_column'])) {
    $search_query = $_POST['search_query'];
    $search_column = $_POST['search_column'];
    $sort_column = $_POST['sort_column'];
    $sort_order = $_POST['sort_order'];
}

// Construct a MySQL query to search for records in your table
    // Modify "your_table" and "column_name" to match your table and column names
    $sql = "SELECT * FROM `dataset1_proteins` WHERE 1";

if (!empty($_POST['search_query']) && !empty($_POST['search_column'])) {
    $search_query = $_POST['search_query'];
    $search_column = $_POST['search_column'];
    $sql .= " AND $search_column = '$search_query'";
}    

if(!empty($_POST['temp_min']) && !empty($_POST['temp_max'])) {
    $temp_min = $_POST['temp_min'];
    $temp_max = $_POST['temp_max'];
    $sql .= " AND (temperature >= $temp_min AND temperature <= $temp_max)";
}

if(!empty($_POST['ph_min']) && !empty($_POST['ph_max'])) {
    $ph_min = $_POST['ph_min'];
    $ph_max = $_POST['ph_max'];
    $sql .= " AND (ph >= $ph_min AND ph<= $ph_max)";
}

if(!empty($_POST['deltag_min']) && !empty($_POST['deltag_max'])) {
    $deltag_min = $_POST['deltag_min'];
    $deltag_max = $_POST['deltag_max'];
    $sql .= " AND (ΔG >= $deltag_min AND ΔG<= $deltag_max)";
}

if(!empty($_POST['delta_deltag_min']) && !empty($_POST['delta_deltag_max'])) {
    $delta_deltag_min = $_POST['delta_deltag_min'];
    $delta_deltag_max = $_POST['delta_deltag_max'];
    $sql .= " AND (ΔΔG >= $delta_deltag_min AND ΔΔG<= $delta_deltag_max)";
}

if(!empty($_POST['pubMedid'])) {
    $pubMedid = $_POST['pubMedid'];
    $sql .= " AND ( PubMed_ID = $pubMedid)";
}

if(!empty($_POST['author'])) {
    $author = $_POST['author'];
    $sql .= " AND ( authors like '%$author%')";
}

if(!empty($_POST['journal'])) {
    $journal = $_POST['journal'];
    $sql .= " AND ( journal = '$journal')";
}

if(!empty($_POST['PDBID'])) {
    $PDBID = $_POST['PDBID'];
    $sql .= " AND ( PDB_ID = '$PDBID')";
}

if(isset($_POST['experimental_tech']) && !empty($_POST['experimental_tech'])) {
    $experimTech = $_POST['experimental_tech'];
    $sql .= " AND ( experiment = '$experimTech')";
}

if(isset($_POST['search_organism']) && !empty($_POST['search_organism'])) {
    $sourceOrganism = $_POST['search_organism'];
    $sql .= " AND (Protein_1 LIKE '%$sourceOrganism%' OR Protein_2 LIKE '%$sourceOrganism%')";
}

if(isset($_POST['protein_1']) && !empty($_POST['protein_1'])) {
    $protein1 = $_POST['protein_1'];
    $sql .= " AND ( Protein_1 = '$protein1')";
}

if(isset($_POST['protein_2']) && !empty($_POST['protein_2'])) {
    $protein2 = $_POST['protein_2'];
    $sql .= " AND ( Protein_2 = '$protein2')";
}

if(isset($_POST['ogAA']) && !empty($_POST['ogAA']) && isset($_POST['mutatedAA']) && !empty($_POST['mutatedAA'])) {
    $ogAA = $_POST['ogAA'];
    $mutatedAA = $_POST['mutatedAA'];
    $sql .= " AND (Mutation LIKE '$ogAA%$mutatedAA%')";
}

if (isset($_POST['wildChecked'])) {
    $isWildChecked = $_POST['wildChecked'];

    if ($isWildChecked) {
        $sql .= " AND Mutation LIKE 'Wild'";
    }
}

 
$sql .= " ORDER BY $sort_column $sort_order";


//Debug
//echo "Final SQL Query: $sql\n";

// Execute the query and fetch the results
$result = $conn->query($sql);

// Check for errors
if (!$result) {
    die("Query error: " . mysqli_error($conn));
}

// Create an array to store the results
$resultsArray = [];

// Fetch and add results to the array
while ($row = $result->fetch_assoc()) {
    $resultsArray[] = $row;
}

// Encode the array as JSON and echo it
echo json_encode($resultsArray);

// Close the database connection
$conn->close();



?>