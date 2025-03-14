const supabase = require('../config/supabaseClient');

// Inscription
const signUp = async (req, res) => {
  const { email, password, firstName, lastName, role = 'user' } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  const { data: { user }, error: authError } = await supabase.auth.signUp({ email, password });

  if (authError) {
    return res.status(500).json({ error: authError.message });
  }

  const { error: profileError } = await supabase.from('profiles').upsert([
    { id: user.id, first_name: firstName, last_name: lastName, role }
  ]);

  if (profileError) {
    return res.status(500).json({ error: profileError.message });
  }

  res.status(201).json({ message: 'Compte créé avec succès', userId: user?.id });
};

// Connexion
const signIn = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({
    message: 'Connexion réussie',
    user: data?.user,
    access_token: data?.session?.access_token
  });
};

module.exports = { signUp, signIn };
