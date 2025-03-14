const supabase = require('../config/supabaseClient');

// Modifier le profil utilisateur
const updateProfile = async (req, res) => {
  const { first_name, last_name } = req.body;
  const userId = req.user.sub;

  if (!first_name || !last_name) {
    return res.status(400).json({ error: "Prénom et nom sont requis" });
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ first_name, last_name })
    .eq('id', userId)
    .select('*')
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: "Profil mis à jour avec succès", profile: data });
};

module.exports = { updateProfile };