-- ============================================================
-- SUNRISE BOOKSTORE — Seed data
-- Run AFTER schema is created in Supabase SQL Editor
-- ============================================================

-- 8 Books
insert into books (title, author, description, category, price_hard, price_ebook, is_deal, is_featured, in_stock) values
(
  'Weep Not, Child',
  'Ngũgĩ wa Thiong''o',
  'The first major novel in English by an East African author. Set during the Mau Mau uprising in Kenya, it tells the story of Njoroge, a young boy who pins his hopes on education while his family is drawn into the conflict.',
  'Fiction',
  850, 450, false, true, true
),
(
  'The River Between',
  'Ngũgĩ wa Thiong''o',
  'Two Gikuyu villages divided by a river and by Christianity face each other across a valley. A young man tries to bridge the divide in a story of love, tradition and the wounds of colonialism.',
  'Fiction',
  800, 400, false, false, true
),
(
  'The River and the Source',
  'Margaret A. Ogola',
  'A sweeping family saga spanning four generations of Kenyan women. Beginning in pre-colonial Luoland, the novel follows the descendants of Akoko as Kenya transforms around them.',
  'Fiction',
  950, 500, false, true, true
),
(
  'The Lean Startup',
  'Eric Ries',
  'How constant innovation creates radically successful businesses. The Lean Startup method teaches you how to drive a startup — how to steer, when to turn, and when to persevere.',
  'Business',
  1200, 650, false, true, true
),
(
  'Atomic Habits',
  'James Clear',
  'An easy and proven way to build good habits and break bad ones. Tiny changes, remarkable results. The most comprehensive guide on how habits work and how to change them.',
  'Self-Help',
  1100, 600, true, false, true
),
(
  'Think and Grow Rich',
  'Napoleon Hill',
  'The landmark bestseller now revised and updated for the 21st century. Based on Napoleon Hill''s research into the habits and mindsets of the most successful people of his era.',
  'Self-Help',
  900, 480, false, false, true
),
(
  'Ikigai: The Japanese Secret to a Long and Happy Life',
  'Héctor García',
  'What''s your reason for being? The people of Japan''s Okinawa island believe ikigai is the reason we get up in the morning — find yours and live longer, happier.',
  'Self-Help',
  1050, 550, false, false, true
),
(
  'Zero to One',
  'Peter Thiel',
  'Notes on startups, or how to build the future. Every moment in business happens only once. The next Bill Gates will not build an operating system. What valuable company is nobody building?',
  'Business',
  1150, 620, false, false, true
);

-- 3 Blog posts
insert into blog_posts (title, slug, excerpt, body, published) values
(
  '5 Kenyan Books Every Reader Should Own',
  '5-kenyan-books-every-reader-should-own',
  'From Ngũgĩ to Ogola — a curated list of essential titles from Kenya''s greatest storytellers.',
  E'Kenya has produced some of Africa''s most powerful voices in literature. Whether you are a lifelong bookworm or just beginning your reading journey, these five titles belong on your shelf.\n\n1. Weep Not, Child — Ngũgĩ wa Thiong''o\nThe novel that put East African fiction on the world map. Essential reading.\n\n2. The River and the Source — Margaret Ogola\nA multigenerational saga that will make you laugh, cry and feel deeply proud of Kenyan womanhood.\n\n3. A Grain of Wheat — Ngũgĩ wa Thiong''o\nA complex portrait of the struggle for independence. Ngũgĩ at his most ambitious.\n\n4. Dust — Yvonne Adhiambo Owuor\nA stunning debut novel about grief, identity and the violence that shapes a nation.\n\n5. Petals of Blood — Ngũgĩ wa Thiong''o\nA searing indictment of post-independence Kenya. Bold, angry and brilliant.\n\nStop by the shop and pick up any of these in hardcopy. We stock them all.',
  true
),
(
  'Why Ebooks Are Perfect for the Nairobi Commute',
  'ebooks-perfect-for-nairobi-commute',
  'Matatu rides, traffic jams and lunch breaks are better with a book in your pocket — here''s why ebooks make sense for Nairobi readers.',
  E'Anyone who has spent an hour in Nairobi traffic knows the feeling: you''re stuck, you''re frustrated, and your phone is the only thing standing between you and boredom.\n\nHere''s our case for ebooks:\n\nInstant delivery. Order an ebook and we send it to your WhatsApp within minutes. No waiting, no delivery fee.\n\nZero weight. A phone weighs nothing. Five hardcopy books? Ask your back.\n\nPrivacy. Commuting with a self-help book in your bag? Nobody needs to know.\n\nNight reading. Backlit screen, dark mode, 11pm on your bed. Perfect.\n\nAt Sunrise Bookstore we price our ebooks 30–40% below the hardcopy price. Cheaper to buy, free to carry.',
  true
),
(
  'How to Build a Reading Habit That Actually Sticks',
  'build-reading-habit-that-sticks',
  'Practical advice for readers in Nairobi who want to read more but keep getting distracted.',
  E'Reading more is one of those goals that sounds easy until life happens. Here is what actually works.\n\nStart with 10 pages a day. Not a chapter. Not 30 minutes. Ten pages. Even on your worst day you can find 10 pages.\n\nKeep a book in your bag always. The bus, the queue at the supermarket, waiting for the doctor — these moments add up to hours every week.\n\nFinish what you start, mostly. Give a book 50 pages. If it still hasn''t grabbed you, put it down. Life is too short for books you don''t enjoy.\n\nRead what you actually like. Not what you think you should read. Not what looks impressive on Instagram. Whatever pulls you back to the page.\n\nTalk about books. Join a reading group, recommend to friends, argue about endings. Books are better shared.\n\nCome browse our shelves — in person via WhatsApp or online — and let us help you find your next page-turner.',
  true
);

-- 3 approved reviews (use subqueries to get book IDs)
insert into reviews (book_id, reviewer, body, rating, approved)
select id, 'Amina Wanjiku', 'This book changed how I see Kenya''s history. Ngũgĩ writes with such pain and tenderness. I cried on the matatu home.', 5, true
from books where title = 'Weep Not, Child';

insert into reviews (book_id, reviewer, body, rating, approved)
select id, 'David Otieno', 'Atomic Habits is the most practical book I have ever read. I have already recommended it to everyone at my office. The delivery was super fast too!', 5, true
from books where title = 'Atomic Habits';

insert into reviews (book_id, reviewer, body, rating, approved)
select id, 'Fatuma Hassan', 'The River and the Source is a masterpiece. Ogola captures Kenyan women''s strength across generations. Buy this for your mother, your sister, your daughter.', 5, true
from books where title = 'The River and the Source';
