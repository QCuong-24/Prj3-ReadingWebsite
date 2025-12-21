INSERT INTO novel (novel_id, title, publication_date, cover_image_url, description, author, status, user_id)
VALUES
(1, 'The Whispering Forest', '2023-05-12', 'https://example.com/forest.jpg',
 'A mysterious forest where ancient spirits whisper secrets to those who dare to enter.',
 'Linh Tran', 'Ongoing', 1),

(2, 'Stars Beyond the Veil', '2022-11-01', 'https://example.com/stars.jpg',
 'A sci-fi journey following a pilot who discovers a hidden civilization beyond a cosmic barrier.',
 'Minh Nguyen', 'Finished', 1);

INSERT INTO chapter (novel_id, title, chapter_number, content, updated_at)
VALUES
(1, 'Into the Woods', 1,
 'The villagers warned her never to cross the old wooden bridge, but curiosity won.',
 '2023-05-12'),

(1, 'Voices in the Dark', 2,
 'As night fell, the whispers grew louder, guiding her deeper into the unknown.',
 '2023-05-15'),

(2, 'First Light', 1,
 'Captain Arin gazed at the shimmering veil of stardust, knowing this mission would change everything.',
 '2022-11-01'),

(2, 'The Hidden City', 2,
 'Beyond the cosmic barrier lay a city untouched by time, glowing with alien brilliance.',
 '2022-11-05');

INSERT INTO chapter (novel_id, title, chapter_number, content, updated_at)
VALUES
(1, 'The Spirit’s Warning', 3,
 'A faint silhouette appeared between the trees, raising a hand as if urging her to turn back.',
 '2023-05-20'),

(1, 'Roots of Memory', 4,
 'Touching the ancient oak triggered visions of forgotten stories buried deep within the forest floor.',
 '2023-05-25');

INSERT INTO novel (novel_id, title, publication_date, cover_image_url, description, author, status, post_user_id)
VALUES
(3, 'Moonlit Chronicles', '2024-02-14', 'https://example.com/moonlit.jpg',
 'A young historian discovers a journal that reveals a hidden world thriving under moonlight.',
 'Haru Ishida', 'Ongoing', 1);


INSERT INTO users (username, email, password) VALUES
('admin', 'a@admin.com', '$2a$10$uUt0tzypSL7ZaZa49ul30.MMJ09z0JQ6Nd.iPe8F119GoSTlskvMq');
INSERT INTO user_roles (user_id, role) VALUES
(1, 'ROLE_ADMIN');

SELECT setval(
    pg_get_serial_sequence('chapter', 'chapter_id'),
    (SELECT MAX(chapter_id) FROM chapter)
);

SELECT setval(
    pg_get_serial_sequence('novel', 'novel_id'),
    (SELECT MAX(novel_id) FROM novel)
);


select * from novel;