const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function truncateTables() {
  await supabase.from('trainings').delete().neq('id', 0);
  await supabase.from('events').delete().neq('id', 0);
  await supabase.from('training_users').delete().neq('id', 0);
  await supabase.from('event_users').delete().neq('id', 0);
  console.log('Finish truncate tables');
}

truncateTables().catch((e) => {
  console.log('Error', e);
});
