DROP TABLE IF EXISTS tracked_launches;

CREATE TABLE tracked_launches (
  id SERIAL PRIMARY KEY,
  data_id VARCHAR (255),
  launchDate VARCHAR (255),
  launchTime VARCHAR (255),
  launchProvider TEXT,
  missionName TEXT,
  statusName TEXT,
  missionDescription TEXT,
  orbit TEXT,
  rocketName TEXT
);