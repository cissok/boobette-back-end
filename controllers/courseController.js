const supabase = require('../config/supabaseClient');

// Ajouter un cours
const addCourse = async (req, res) => {
  const { title, description, video_url } = req.body;

  if (!title || !description || !video_url) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  const { data, error } = await supabase
    .from('courses')
    .insert([{ title, description, video_url }])
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: 'Cours ajouté avec succès', course: data });
};

module.exports = { addCourse };
