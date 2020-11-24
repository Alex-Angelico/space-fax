DROP TABLE IF EXISTS launch_schedule;

CREATE TABLE launch_schedule (
  id SERIAL PRIMARY KEY,
  launch_provider (TEXT),
  date VARCHAR (255),
  description (TEXT)
);