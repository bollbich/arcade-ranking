// api/ranking.js
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Configuración de cabeceras CORS para evitar bloqueos en el navegador
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Si es una petición de control (Preflight), respondemos OK de inmediato
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      // Validamos que las variables existan en el entorno de Vercel antes de inicializar
      if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return res.status(500).json({ error: 'Faltan las variables de entorno en Vercel.' });
      }

      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      // Consulta a la base de datos
      const { data, error } = await supabase
        .from('ranking')
        .select('nombre, puntuacion, fecha')
        .order('puntuacion', { ascending: false })
        .limit(10);

      if (error) {
        return res.status(500).json({ error: `Error de Supabase: ${error.message}` });
      }

      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: `Error interno: ${err.message}` });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}