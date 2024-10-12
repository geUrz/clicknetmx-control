import connection from '@/libs/db'

export default async function savePlayerId(req, res) {
  const { playerId, userId } = req.body;

  if (!playerId || !userId) {
    return res.status(400).json({ error: 'Player ID y User ID son requeridos' });
  }

  try {
    // Verificar si el Player ID ya está registrado para este usuario
    const [existingPlayer] = await connection.query(
      'SELECT * FROM player_ids WHERE user_id = ? AND player_id = ?',
      [userId, playerId]
    );

    if (existingPlayer.length > 0) {
      return res.status(200).json({ message: 'El Player ID ya está registrado' });
    }

    // Si el Player ID no existe, agregarlo
    await connection.query(
      'INSERT INTO player_ids (user_id, player_id) VALUES (?, ?)',
      [userId, playerId]
    );

    return res.status(200).json({ message: 'Player ID registrado correctamente' });
  } catch (error) {
    console.error('Error al guardar Player ID:', error);
    return res.status(500).json({ error: 'Error al guardar Player ID' });
  }
}
