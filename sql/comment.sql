DROP TABLE IF EXISTS comment;

CREATE TABLE comment(
    id SERIAL PRIMARY KEY,
    comment VARCHAR(255) NOT NULL CHECK (comment <> ''),
    username VARCHAR(255) NOT NULL,
    image_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE comment
    ADD FOREIGN KEY (image_id)
    REFERENCES images(id)
    ON DELETE CASCADE;
