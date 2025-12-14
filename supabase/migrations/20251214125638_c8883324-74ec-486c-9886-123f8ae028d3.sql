-- Функция для получения всех пользователей (только для админов)
CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  created_at TIMESTAMPTZ,
  full_name TEXT,
  phone TEXT,
  role TEXT,
  avatar_url TEXT
) AS $$
DECLARE
  current_user_role TEXT;
BEGIN
  -- Получаем роль текущего пользователя
  SELECT profiles.role INTO current_user_role
  FROM profiles
  WHERE profiles.id = auth.uid();

  -- Проверяем что текущий пользователь - админ
  IF current_user_role != 'admin' THEN
    RAISE EXCEPTION 'Only admins can view all users';
  END IF;

  -- Возвращаем всех пользователей с их профилями
  RETURN QUERY
  SELECT 
    p.id,
    au.email::TEXT,
    au.created_at,
    p.full_name,
    p.phone,
    p.role,
    p.avatar_url
  FROM auth.users au
  LEFT JOIN profiles p ON p.id = au.id
  ORDER BY au.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Даем права на выполнение функции
GRANT EXECUTE ON FUNCTION get_all_users() TO authenticated;