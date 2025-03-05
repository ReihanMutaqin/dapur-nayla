<?php
header("Content-Type: application/json");

$dataFile = "data.json";
$products = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_POST["action"])) {
        if ($_POST["action"] === "add") {
            if (!isset($_FILES["image"])) {
                echo json_encode(["success" => false, "message" => "Gambar tidak ditemukan"]);
                exit;
            }

            $uploadDir = "uploads/";
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $imagePath = $uploadDir . basename($_FILES["image"]["name"]);
            if (!move_uploaded_file($_FILES["image"]["tmp_name"], $imagePath)) {
                echo json_encode(["success" => false, "message" => "Gagal mengunggah gambar"]);
                exit;
            }

            $newProduct = [
                "id" => uniqid(),
                "name" => $_POST["name"],
                "price" => intval($_POST["price"]),
                "stock" => intval($_POST["stock"]),
                "image" => $imagePath
            ];
            $products[] = $newProduct;
            file_put_contents($dataFile, json_encode($products, JSON_PRETTY_PRINT));

            echo json_encode(["success" => true, "message" => "Produk ditambahkan"]);
            exit;
        }
    }

    $input = json_decode(file_get_contents("php://input"), true);
    if (isset($input["action"])) {
        if ($input["action"] === "delete") {
            $index = intval($input["index"]);
            if (isset($products[$index])) {
                array_splice($products, $index, 1);
                file_put_contents($dataFile, json_encode($products, JSON_PRETTY_PRINT));
                echo json_encode(["success" => true, "message" => "Produk dihapus"]);
            } else {
                echo json_encode(["success" => false, "message" => "Produk tidak ditemukan"]);
            }
            exit;
        }
    }
}

echo json_encode(["success" => false, "message" => "Permintaan tidak valid"]);
?>
