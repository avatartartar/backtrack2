const db = require('..models/model')

const controller = {};

controller.get10Records = async (req, res, next) => {
  const { data, error } = await supabase
    .from('playorder')
    .select('*')
    .limit(10);

  if (error) throw error;
  if (data.length === 0) return []; // Return an empty array if the table is empty
  return Object.keys(data[0]); // Return the column names
};