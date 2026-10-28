-- Filmes de exemplo (opcional). Rode uma única vez, depois do schema.sql:
--   * cole no SQL Editor do Neon; ou
--   * rode `npm run banco:exemplos`.
-- O id e o codigo (nosso ID) são gerados pelo banco: numa tabela recém-criada,
-- estes filmes recebem os IDs 1 a 7. Os gêneros seguem a lista e a ordem de
-- compartilhado/regrasFilme.js.

INSERT INTO filmes (titulo, ano_lancamento, duracao_minutos, diretor, generos, elenco) VALUES
  ('O Poderoso Chefão', 1972, 175, 'Francis Ford Coppola',
    ARRAY['Drama', 'Policial'],
    ARRAY['Marlon Brando', 'Al Pacino', 'James Caan', 'Robert Duvall', 'Diane Keaton', 'John Cazale', 'Talia Shire']),

  ('Central do Brasil', 1998, 113, 'Walter Salles',
    ARRAY['Drama'],
    ARRAY['Fernanda Montenegro', 'Vinícius de Oliveira', 'Marília Pêra', 'Othon Bastos', 'Matheus Nachtergaele']),

  ('A Viagem de Chihiro', 2001, 125, 'Hayao Miyazaki',
    ARRAY['Animação', 'Aventura', 'Fantasia'],
    ARRAY['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki', 'Bunta Sugawara']),

  ('Cidade de Deus', 2002, 130, 'Fernando Meirelles',
    ARRAY['Drama', 'Policial'],
    ARRAY['Alexandre Rodrigues', 'Leandro Firmino', 'Phellipe Haagensen', 'Douglas Silva', 'Seu Jorge', 'Alice Braga', 'Matheus Nachtergaele']),

  ('Interestelar', 2014, 169, 'Christopher Nolan',
    ARRAY['Aventura', 'Drama', 'Ficção científica'],
    ARRAY['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine', 'Mackenzie Foy', 'Matt Damon']),

  ('Parasita', 2019, 132, 'Bong Joon-ho',
    ARRAY['Drama', 'Suspense'],
    ARRAY['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong', 'Choi Woo-shik', 'Park So-dam', 'Lee Jung-eun', 'Jang Hye-jin']),

  ('Ainda Estou Aqui', 2024, 137, 'Walter Salles',
    ARRAY['Drama'],
    ARRAY['Fernanda Torres', 'Selton Mello', 'Fernanda Montenegro', 'Valentina Herszage']);
