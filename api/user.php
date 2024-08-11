<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

class Data
{
    function getAllGroup()
    {
        include "connection.php";
        $sql = "SELECT * FROM tblgroups";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($groups);
    }

    function getContact()
    {
        include "connection.php";
        $sql = "SELECT * FROM tblcontacts a 
                INNER JOIN tblgroups b ON a.contact_group = b.grp_id
                WHERE b.grp_id = :groupId";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":groupId", $_POST["groupId"]);
        $stmt->execute();
        $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($contacts);
    }

    function addStudent($json)
    {
        include "connection.php";
        $data = json_decode($json, true);

        // Get the student name and uyabs from the input data
        $stud_name = $data['studentname'] ?? null;
        $uyabs = $data['uyabs'] ?? [];

        // Validate the input data
        if ($stud_name === null || empty($uyabs)) {
            echo json_encode(["error" => "Invalid input data"]);
            exit;
        }

        try {

            $conn->beginTransaction();

            // check kung naa nay student
            $stmt = $conn->prepare("SELECT id FROM tbl_student WHERE stud_name = :stud_name");
            $stmt->execute(['stud_name' => $stud_name]);
            $student = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($student) {
                // e check ang student id if naa na
                $stud_id = $student['id'];
            } else {
                // mo insert dayun sa table if dili exist
                $stmt = $conn->prepare("INSERT INTO tbl_student (stud_name) VALUES (:stud_name)");
                if (!$stmt->execute(['stud_name' => $stud_name])) {
                    throw new Exception("Failed to insert student: " . implode(", ", $stmt->errorInfo()));
                }
                $stud_id = $conn->lastInsertId();
            }

            // mo insert ang uyabs if dili exist
            $stmtCheck = $conn->prepare("SELECT COUNT(*) FROM tbl_uyab WHERE stud_id = :stud_id AND uyab_name = :uyab_name");
            $stmtInsert = $conn->prepare("INSERT INTO tbl_uyab (stud_id, uyab_name) VALUES (:stud_id, :uyab_name)");

            foreach ($uyabs as $uyab_name) {
                //e check if the uyab is not exist
                $stmtCheck->execute(['stud_id' => $stud_id, 'uyab_name' => $uyab_name]);
                $exists = $stmtCheck->fetchColumn();

                if ($exists > 0) {
                    // kung naa nay uyab_name dili pwede 
                    echo json_encode(["error" => "Uyab name '$uyab_name' already exists for this student."]);
                    $conn->rollBack();
                    exit;
                }

                // Insert uyab_name kung dili existing
                if (!$stmtInsert->execute(['stud_id' => $stud_id, 'uyab_name' => $uyab_name])) {
                    throw new Exception("Failed to insert uyab: " . implode(", ", $stmtInsert->errorInfo()));
                }
            }


            $conn->commit();
            echo json_encode(["success" => true]);
        } catch (Exception $e) {

            $conn->rollBack();
            echo json_encode(["error" => $e->getMessage()]);
        }
    }






}

$operation = isset($_POST["operation"]) ? $_POST["operation"] : "Invalid";

$data = new Data();
switch ($operation) {
    case "getAllGroup":
        $data->getAllGroup();
        break;
    case "getContact":
        $data->getContact();
        break;
    case "addStudent":
        $data->addStudent($_POST["json"]);
        break;
    default:
        echo json_encode(array("status" => -1, "message" => "Invalid operation."));
}
