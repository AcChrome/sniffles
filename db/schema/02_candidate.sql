DROP TABLE IF EXISTS candidate CASCADE;
CREATE TABLE candidate (
  id SERIAL PRIMARY KEY NOT NULL,
  approve BOOLEAN,
  profile_id INTEGER REFERENCES profile(id) ON DELETE CASCADE,
  candidate_id INTEGER REFERENCES profile(id) ON DELETE CASCADE,
  timestamp TIMESTAMP
);