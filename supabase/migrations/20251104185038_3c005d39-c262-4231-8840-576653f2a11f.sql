-- Servis kayıtları tablosu için realtime özelliğini aktifleştir
ALTER TABLE service_records REPLICA IDENTITY FULL;

-- Tablonun realtime publication'a eklenmesini sağla
-- (Supabase otomatik olarak supabase_realtime publication'ı kullanır)
ALTER PUBLICATION supabase_realtime ADD TABLE service_records;