const supabase = require('../config/supabaseClient');
const jwt = require('jsonwebtoken');
const jwtKey = process.env.JWT_KEY;

// Vérifier le token
const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requis' });
  }

  try {
    const decoded = jwt.verify(token, jwtKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

// Vérifier le rôle (admin ou teacher)
const checkRole = async (req, res, next) => {
  const { user } = req;

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.sub)
    .single();

  if (error || !data) {
    return res.status(500).json({ error: 'Profil introuvable' });
  }

  if (data.role !== 'admin' && data.role !== 'teacher') {
    return res.status(403).json({ error: 'Accès interdit' });
  }

  next();
};

module.exports = { verifyToken, checkRole };
