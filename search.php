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
    

    // Construct a MySQL query to search for records in your table
    // Modify "your_table" and "column_name" to match your table and column names
    $sql = "SELECT * FROM `dataset1_proteins` WHERE $search_column = '$search_query' order by $sort_column $sort_order";

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
}
?>