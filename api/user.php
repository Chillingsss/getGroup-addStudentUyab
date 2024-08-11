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


        $stud_name = $data['studentname'] ?? null;
        $uyabs = $data['uyabs'] ?? [];


        if ($stud_name === null || empty($uyabs)) {
            echo json_encode(["error" => "Invalid input data"]);
            exit;
        }

        try {

            $conn->beginTransaction();


            $stmt = $conn->prepare("SELECT id FROM tbl_student WHERE stud_name = :stud_name");
            $stmt->execute(['stud_name' => $stud_name]);
            $student = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($student) {

                $stud_id = $student['id'];
            } else {

                $stmt = $conn->prepare("INSERT INTO tbl_student (stud_name) VALUES (:stud_name)");
                if (!$stmt->execute(['stud_name' => $stud_name])) {
                    throw new Exception("Failed to insert student: " . implode(", ", $stmt->errorInfo()));
                }
                $stud_id = $conn->lastInsertId();
            }


            $stmt = $conn->prepare("INSERT INTO tbl_uyab (stud_id, uyab_name) VALUES (:stud_id, :uyab_name)");
            foreach ($uyabs as $uyab_name) {
                if (!$stmt->execute(['stud_id' => $stud_id, 'uyab_name' => $uyab_name])) {
                    throw new Exception("Failed to insert uyab: " . implode(", ", $stmt->errorInfo()));
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
