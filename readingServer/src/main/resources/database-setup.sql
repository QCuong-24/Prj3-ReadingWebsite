INSERT INTO novel (novel_id, title, publication_date, cover_image_url, description, author, status, post_user_id)
VALUES
(1, 'The Whispering Forest', '2023-05-12', 'https://example.com/forest.jpg',
 'A mysterious forest where ancient spirits whisper secrets to those who dare to enter.',
 'Linh Tran', 'Ongoing', 1),

(2, 'Stars Beyond the Veil', '2022-11-01', 'https://example.com/stars.jpg',
 'A sci-fi journey following a pilot who discovers a hidden civilization beyond a cosmic barrier.',
 'Minh Nguyen', 'Finished', 1);

 INSERT INTO chapter (chapter_id, novel_id, title, chapter_number, content, updated_at)
VALUES
(1, 1, 'Into the Woods', 1,
 'The villagers warned her never to cross the old wooden bridge, but curiosity won.',
 '2023-05-12'),

(2, 1, 'Voices in the Dark', 2,
 'As night fell, the whispers grew louder, guiding her deeper into the unknown.',
 '2023-05-15'),

(3, 2, 'First Light', 1,
 'Captain Arin gazed at the shimmering veil of stardust, knowing this mission would change everything.',
 '2022-11-01'),

(4, 2, 'The Hidden City', 2,
 'Beyond the cosmic barrier lay a city untouched by time, glowing with alien brilliance.',
 '2022-11-05');

INSERT INTO users (username, email, password) VALUES
(1, 'admin', 'a@admin.com', 'a', 'ROLE_ADMIN');

select * from novel;