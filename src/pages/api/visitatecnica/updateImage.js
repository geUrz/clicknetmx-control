import connection from "@/libs/db";  // Asegúrate de que la ruta sea correcta

// Función para actualizar solo una columna de imagen de la visita técnica
async function updateImage(id, imageData) {
  if (!id) {
    throw new Error("ID es obligatorio");
  }

  const { img1, img2, img3, img4 } = imageData;

  try {
    const [current] = await connection.query(
      'SELECT img1, img2, img3, img4 FROM visitatecnica WHERE id = ?', [id]
    );

    const currentData = current[0];

    // Mantener las imágenes que ya están subidas, y actualizar solo la que fue seleccionada
    const newImg1 = img1 !== undefined ? img1 : currentData.img1;
    const newImg2 = img2 !== undefined ? img2 : currentData.img2;
    const newImg3 = img3 !== undefined ? img3 : currentData.img3;
    const newImg4 = img4 !== undefined ? img4 : currentData.img4;

    // Actualizar la columna correspondiente
    const [result] = await connection.query(
      'UPDATE visitatecnica SET img1 = ?, img2 = ?, img3 = ?, img4 = ? WHERE id = ?',
      [newImg1, newImg2, newImg3, newImg4, id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Visita técnica no encontrada para actualizar la imagen");
    }

    return { message: "Imagen actualizada correctamente" };
  } catch (error) {
    throw new Error(`Error al actualizar la imagen: ${error.message}`);
  }
}

// API Handler para manejar las solicitudes PUT
export default async function handler(req, res) {
  const id = req.query.id;
  const { img1, img2, img3, img4 } = req.body; // Recibimos la imagen que será eliminada o actualizada

  if (!id) {
    return res.status(400).json({ error: "ID es obligatorio" });
  }

  if (req.method === 'PUT') {
    try {
      // Si img1, img2, img3 o img4 se pasa como null, eso significará que debe eliminarse
      const result = await updateImage(id, { img1, img2, img3, img4 });
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error al actualizar la imagen:', error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
