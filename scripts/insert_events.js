const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const { isBefore, addDays, addMonths } = require('date-fns');

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function insertEvents() {
  const { data: trainings } = await supabase.from('trainings').select('*');
  const events = [];
  trainings.forEach((training) => {
    let date = new Date(training.start_date);
    let endDate = new Date(training.end_date);
    if (training.end_date == null) {
      endDate = addMonths(date, 2);
    }
    while (isBefore(date, endDate)) {
      events.push({
        date,
        training_id: training.id,
        start_time: training.start_time,
        end_time: training.end_time,
      });
      date = addDays(date, 7);
    }

    return events;
  });
  const response = await supabase.from('events').insert(events);
  console.log('Finish insert events', response);
}

insertEvents().catch((e) => {
  console.log('Error', e);
});
