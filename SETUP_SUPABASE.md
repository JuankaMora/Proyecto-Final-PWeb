# Configuración de Supabase

## 1. Corregir la anon key en config.js

El archivo `src/Supabase/config.js` tiene un error: el campo `supabaseAnonKey`
contiene la URL del proyecto en vez de la clave JWT.

**Cómo corregirlo:**
1. Ve a tu proyecto en https://supabase.com
2. Abre Settings → API
3. Copia el valor de **"anon public"** (empieza con `eyJ...`)
4. Pégalo en `config.js` reemplazando `'PEGA_AQUI_TU_ANON_KEY'`

---

## 2. Crear la tabla `profiles`

Ejecuta este SQL en el SQL Editor de Supabase:

```sql
create table profiles (
  id   uuid references auth.users on delete cascade primary key,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

-- Crea el perfil automáticamente cuando alguien se registra
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role) values (new.id, 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- RLS
alter table profiles enable row level security;
create policy "Leer propio perfil"
  on profiles for select using (auth.uid() = id);
create policy "Admins leen todos los perfiles"
  on profiles for select using (
    (select role from profiles where id = auth.uid()) = 'admin'
  );
```

---

## 3. Crear la tabla `incidents`

```sql
create table incidents (
  id              uuid default gen_random_uuid() primary key,
  usuario_id      uuid references auth.users on delete cascade not null,
  tipo            text not null,
  descripcion     text not null,
  imagen_url      text not null,
  ubicacion_texto text not null,
  latitud         float,
  longitud        float,
  fecha_creacion  timestamptz default now() not null,
  estado          text not null default 'Reportado'
                    check (estado in ('Reportado', 'En proceso', 'Resuelto')),
  grupo_id        text
);

-- RLS
alter table incidents enable row level security;
create policy "Usuarios leen sus incidentes"
  on incidents for select using (auth.uid() = usuario_id);
create policy "Admins leen todos"
  on incidents for select using (
    (select role from profiles where id = auth.uid()) = 'admin'
  );
create policy "Usuarios insertan sus incidentes"
  on incidents for insert with check (auth.uid() = usuario_id);
create policy "Admins actualizan incidentes"
  on incidents for update using (
    (select role from profiles where id = auth.uid()) = 'admin'
  );
```

---

## 4. Crear el bucket de Storage

1. En Supabase, ve a **Storage**
2. Crea un nuevo bucket llamado exactamente: `incident-images`
3. Márcalo como **público** (Public bucket)
4. En Policies del bucket, agrega una política que permita a usuarios autenticados subir archivos:
   - Operation: INSERT
   - Target roles: authenticated

---

## 5. Asignar rol de administrador

Para hacer administrador a un usuario:
1. En Supabase, ve a **Table Editor → profiles**
2. Busca el usuario por su `id` (lo ves en Authentication → Users)
3. Cambia su campo `role` de `'user'` a `'admin'`

---

## 6. Desactivar confirmación de email (recomendado para pruebas)

Authentication → Settings → desactiva "Enable email confirmations"
para que los usuarios puedan ingresar inmediatamente sin confirmar el correo.
