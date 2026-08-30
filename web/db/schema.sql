-- Kun Tartibi — kutish ro'yxati jadvali (Neon / PostgreSQL)
-- Neon konsolidagi SQL Editor'ga shu matnni qo'yib «Run» bosiladi.

CREATE TABLE IF NOT EXISTS waitlist (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email       text        NOT NULL,
  name        text,
  source      text        NOT NULL DEFAULT 'sayt',
  created_at  timestamptz NOT NULL DEFAULT now(),
  notified_at timestamptz
);

-- Bir email faqat bir marta. Katta-kichik harf farqi hisobga olinmaydi:
-- API emailni kichik harfga o'tkazib yuboradi, indeks esa buni kafolatlaydi.
CREATE UNIQUE INDEX IF NOT EXISTS waitlist_email_key ON waitlist (lower(email));

-- Yangi yozilganlarni tez ko'rish uchun
CREATE INDEX IF NOT EXISTS waitlist_created_idx ON waitlist (created_at DESC);

COMMENT ON TABLE  waitlist            IS 'Ilova chiqqanda xabar berish uchun yozilganlar';
COMMENT ON COLUMN waitlist.source     IS 'Qaysi sahifadan yozildi';
COMMENT ON COLUMN waitlist.notified_at IS 'Xabar yuborilgan sana — yuborilmagan bo''lsa NULL';

-- Foydali so'rovlar:
--   Nechta odam yozilgan:        SELECT count(*) FROM waitlist;
--   Oxirgi yozilganlar:          SELECT email, name, created_at FROM waitlist ORDER BY created_at DESC LIMIT 50;
--   Xabar yuborilmaganlar:       SELECT email FROM waitlist WHERE notified_at IS NULL;
--   Xabar yuborilgach belgilash: UPDATE waitlist SET notified_at = now() WHERE notified_at IS NULL;
