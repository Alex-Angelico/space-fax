DROP TABLE IF EXISTS fav_images;

CREATE TABLE fav_images (
  id SERIAL PRIMARY KEY,
  img_url VARCHAR (255),
  description (TEXT)
);