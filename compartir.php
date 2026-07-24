<?php
// 1. Recibimos el ID y Categoria desde el link
$id = isset($_GET['id']) ? $_GET['id'] : '';
$cat = isset($_GET['cat']) ? $_GET['cat'] : 'notebooks';

// 2. Tu conexión a Supabase
$supabaseUrl = 'https://xbsjjqrizxdinmzystfu.supabase.co';
$supabaseKey = 'sb_publishable_CNCfFsHb-yGfE45YhHoFHQ_mS1Cpi7C';

// 3. Consultamos la base de datos desde el servidor
$url = $supabaseUrl . "/rest/v1/" . $cat . "?id=eq." . $id . "&select=*";
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'apikey: ' . $supabaseKey,
    'Authorization: Bearer ' . $supabaseKey
));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$datos = json_decode($response, true);

// 4. Valores por defecto (si algo falla)
$titulo = "Computadoras Lei | Soporte Técnico y Tienda Gamer";
$descripcion = "Descubrí nuestros equipos, componentes y trabajos realizados.";
$imagen = "https://computadoraslei.com.ar/assets/img/logo_icon2.png"; 

// 5. Armamos la información si el producto existe
if (!empty($datos) && isset($datos[0])) {
    $item = $datos[0];
    $titulo = isset($item['titulo']) ? $item['titulo'] : $titulo;
    
    // Extraemos solo la primera imagen
    if (isset($item['imagen']) && $item['imagen'] != '') {
        $imgs = explode(',', $item['imagen']);
        $imagen = trim($imgs[0]);
    }
    
    // Le agregamos el precio al título para que se vea en WhatsApp
    $precio = isset($item['precio']) ? " - $" . number_format($item['precio'], 0, ',', '.') . " ARS" : "";
    $titulo = $titulo . $precio;
    
    // Acortamos la descripción para que no sature la tarjeta
    $descripcion = isset($item['descripcion']) ? mb_substr($item['descripcion'], 0, 150) . "..." : $descripcion;
}

// 6. URL Real adonde irá el cliente humano
$urlReal = "https://computadoraslei.com.ar/producto.html?id=" . $id . "&cat=" . $cat;
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title><?php echo $titulo; ?></title>
    
    <!-- Etiquetas mágicas para WhatsApp / Facebook / Instagram -->
    <meta property="og:title" content="<?php echo $titulo; ?>">
    <meta property="og:description" content="<?php echo $descripcion; ?>">
    <meta property="og:image" content="<?php echo $imagen; ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo $urlReal; ?>">
    
    <!-- Redirección automática inmediata para el cliente humano -->
    <meta http-equiv="refresh" content="0;url=<?php echo $urlReal; ?>">
    <script>
        window.location.replace("<?php echo $urlReal; ?>");
    </script>
</head>
<body style="background: #070A0F; color: #00F0FF; font-family: sans-serif; text-align: center; padding-top: 50px;">
    <h2>Cargando producto...</h2>
</body>
</html>