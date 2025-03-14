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

// Modifier un cours
const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, video_url } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'L’ID du cours est requis' });
  }

  const updates = {};
  if (title) updates.title = title;
  if (description) updates.description = description;
  if (video_url) updates.video_url = video_url;

  const { data, error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', id)
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data.length) {
    return res.status(404).json({ error: 'Cours introuvable' });
  }

  res.status(200).json({ message: 'Cours mis à jour avec succès', course: data[0] });
};

// Supprimer un cours
const deleteCourse = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "L'ID du cours est requis" });
  }

  const { data: course, error: findError } = await supabase
    .from('courses')
    .select('id')
    .eq('id', id)
    .single();

  if (findError || !course) {
    return res.status(404).json({ error: "Cours introuvable" });
  }

  const { error: deleteError } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);

  if (deleteError) {
    return res.status(500).json({ error: deleteError.message });
  }

  res.status(200).json({ message: "Cours supprimé avec succès" });
};


// Récupérer tous les cours
const getCourses = async (req, res) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ courses: data });
};

// Récupérer un cours par ID
const getCourseById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "L'ID du cours est requis" });
  }

  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Cours introuvable" });
  }

  res.status(200).json({ course: data });
};

module.exports = { addCourse, updateCourse, deleteCourse, getCourses, getCourseById };