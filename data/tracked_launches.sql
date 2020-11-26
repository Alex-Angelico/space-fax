DROP TABLE IF EXISTS tracked_launches;

CREATE TABLE tracked_launches (
  id SERIAL PRIMARY KEY,
  date VARCHAR (255),
  launchProvider TEXT,
  missionName TEXT,
  statusName TEXT,
  missionDescription TEXT,
  orbit TEXT,
  rocketName TEXT,
  rocketStartWindow VARCHAR (255),
  rocketEndWindow VARCHAR (255)
);