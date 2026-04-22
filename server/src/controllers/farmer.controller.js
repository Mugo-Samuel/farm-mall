const supabase = require('../db/supabase');

// GET STATS
const getStats = async (req, res) => {
  try {
    const { count, error } = await supabase
      .from('farmers')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return res.status(200).json({ total: count });
  } catch (err) {
    console.error('Get stats error:', err.message);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// GET ALL FARMERS
const getAllFarmers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('farmers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.status(200).json({ farmers: data });
  } catch (err) {
    console.error('Get farmers error:', err.message);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ADD FARMER
const addFarmer = async (req, res) => {
  const { name, email, location, crop, phone } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  try {
    const { data: existing } = await supabase
      .from('farmers')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(409).json({ message: 'A farmer with this email already exists.' });
    }

    const { data, error } = await supabase
      .from('farmers')
      .insert([{ name, email, location, crop, phone }])
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json({ message: 'Farmer added successfully.', farmer: data });
  } catch (err) {
    console.error('Add farmer error:', err.message);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// UPDATE FARMER
const updateFarmer = async (req, res) => {
  const { id } = req.params;
  const { name, email, location, crop, phone } = req.body;

  try {
    const { data, error } = await supabase
      .from('farmers')
      .update({ name, email, location, crop, phone })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.status(200).json({ message: 'Farmer updated successfully.', farmer: data });
  } catch (err) {
    console.error('Update farmer error:', err.message);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE FARMER
const deleteFarmer = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('farmers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return res.status(200).json({ message: 'Farmer deleted successfully.' });
  } catch (err) {
    console.error('Delete farmer error:', err.message);
    return res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getAllFarmers, getStats, addFarmer, updateFarmer, deleteFarmer };