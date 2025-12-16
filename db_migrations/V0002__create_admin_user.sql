-- Создание администратора
INSERT INTO t_p43807817_real_estate_portal_3.users (name, email, phone, password, role) 
VALUES ('Администратор', 'admin@realty.com', '+7 (999) 000-00-00', 'admin123', 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin';