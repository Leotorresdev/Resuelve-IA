-- ==============================================================================
-- RESUELVE IA - SUPABASE DATABASE SCHEMA (Misiones Reales, Perfiles y Billetera)
-- ==============================================================================

-- 1. Tabla de Perfiles (Extensión de auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Estudiante',
  phone_or_email TEXT,
  xp INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 1,
  batteries INTEGER NOT NULL DEFAULT 5,
  gems INTEGER NOT NULL DEFAULT 100,
  is_pro BOOLEAN NOT NULL DEFAULT false,
  selected_goal TEXT NOT NULL DEFAULT 'trabajo',
  user_persona TEXT NOT NULL DEFAULT 'liceo',
  experience_level TEXT NOT NULL DEFAULT 'novato',
  token_balance INTEGER NOT NULL DEFAULT 2, -- 2 Tokens de bienvenida ($2.00 USD)
  earnings_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS) en profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden leer su propio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Tabla de Misiones Reales (Bounties Marketplace)
CREATE TABLE IF NOT EXISTS public.bounties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('liceo', 'universidad', 'trabajo', 'negocio')),
  category_label TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
  expected_format TEXT NOT NULL,
  reward_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.30, -- 30% al solucionador
  price_usd NUMERIC(10, 2) NOT NULL DEFAULT 1.00,  -- $1.00 costo total
  platform_fee_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.70, -- 70% a Resuelve IA
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'solved')),
  solver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  solver_name TEXT,
  solver_prompt TEXT,
  generated_deliverable TEXT,
  score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  solved_at TIMESTAMPTZ
);

ALTER TABLE public.bounties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera puede ver misiones abiertas o resueltas"
  ON public.bounties FOR SELECT
  USING (true);

CREATE POLICY "Usuarios autenticados pueden publicar misiones"
  ON public.bounties FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Usuarios autenticados pueden resolver misiones"
  ON public.bounties FOR UPDATE
  USING (true);

-- 3. Tabla de Transacciones de Billetera (Wallet Transactions)
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('token_purchase', 'direct_payment', 'task_posted', 'task_solved_earning', 'platform_fee', 'payout_request')),
  amount_tokens INTEGER,
  amount_usd NUMERIC(10, 2),
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending')),
  date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver su propio historial de transacciones"
  ON public.wallet_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Función trigger para crear perfil automáticamente al registrarse en Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone_or_email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Estudiante'),
    COALESCE(NEW.email, NEW.phone)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
