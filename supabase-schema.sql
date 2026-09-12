-- LIFEFORGE Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";     -- provides gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";    -- provides uuid_generate_v4()

-- ============================================================
-- 1. PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Adventurer',
  -- Progression fields (protected)
  xp BIGINT NOT NULL DEFAULT 0 CHECK (xp >= 0),          -- CUMULATIVE lifetime XP
  gold BIGINT NOT NULL DEFAULT 0 CHECK (gold >= 0),
  level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1),
  strength INTEGER NOT NULL DEFAULT 0 CHECK (strength >= 0),
  intellect INTEGER NOT NULL DEFAULT 0 CHECK (intellect >= 0),
  discipline INTEGER NOT NULL DEFAULT 0 CHECK (discipline >= 0),
  wisdom INTEGER NOT NULL DEFAULT 0 CHECK (wisdom >= 0),
  streak INTEGER NOT NULL DEFAULT 0 CHECK (streak >= 0),
  last_active_date DATE,
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. RLS POLICIES - PROFILES (user isolation only)
-- ============================================================

CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- 3. COLUMN-LEVEL PRIVILEGES - PROFILES
-- ============================================================
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (display_name) ON public.profiles TO authenticated;

-- ============================================================
-- 4. QUEST CATEGORIES (trusted reference data)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quest_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  attribute TEXT NOT NULL CHECK (attribute IN ('strength','intellect','discipline','wisdom','charisma')),
  xp_multiplier NUMERIC NOT NULL DEFAULT 1.0 CHECK (xp_multiplier > 0),
  gold_multiplier NUMERIC NOT NULL DEFAULT 1.0 CHECK (gold_multiplier > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default categories
INSERT INTO public.quest_categories (name, attribute, xp_multiplier, gold_multiplier) VALUES
  ('Fitness', 'strength', 1.0, 1.0),
  ('Learning', 'intellect', 1.2, 1.0),
  ('Productivity', 'discipline', 1.0, 1.2),
  ('Mindfulness', 'wisdom', 1.0, 1.0),
  ('Social', 'charisma', 1.0, 1.1)
ON CONFLICT (name) DO NOTHING;

ALTER TABLE public.quest_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read quest categories"
  ON public.quest_categories
  FOR SELECT
  USING (true);

-- ============================================================
-- 5. QUESTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- User-controlled fields
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID NOT NULL REFERENCES public.quest_categories(id),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy','medium','hard','epic')),
  -- Trusted reward fields (populated by server/database, not client)
  xp_reward INTEGER NOT NULL DEFAULT 0 CHECK (xp_reward >= 0),
  gold_reward INTEGER NOT NULL DEFAULT 0 CHECK (gold_reward >= 0),
  -- Status (managed by trusted functions only)
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','completed','failed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;

-- RLS: users can read own quests
CREATE POLICY "Users can read own quests"
  ON public.quests
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS: users can insert own quests via create_quest() only (not direct INSERT)
-- The RLS policy allows INSERT where user_id = auth.uid(), but column privileges
-- below prevent direct INSERT by authenticated users (see section 6)
CREATE POLICY "Users can insert own quests"
  ON public.quests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS: users can update own quests (limited columns via column privileges)
CREATE POLICY "Users can update own quests"
  ON public.quests
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 6. COLUMN-LEVEL PRIVILEGES - QUESTS
-- ============================================================
-- Revoke ALL INSERT/UPDATE from authenticated
REVOKE INSERT ON public.quests FROM authenticated;
REVOKE UPDATE ON public.quests FROM authenticated;

-- Grant back INSERT only on user-controlled columns (NOT user_id, NOT rewards, NOT status)
-- user_id is set by create_quest() from auth.uid()
-- xp_reward, gold_reward computed by create_quest()
-- status set by create_quest() to 'pending', then only trusted functions modify it
GRANT INSERT (title, description, category_id, difficulty, started_at) ON public.quests TO authenticated;

-- Grant back UPDATE only on user-editable columns
-- NOT user_id, NOT xp_reward, NOT gold_reward, NOT status, NOT completed_at
-- NOT category_id (changing category would change attribute mapping)
-- NOT difficulty (changing difficulty would change reward)
GRANT UPDATE (title, description, started_at) ON public.quests TO authenticated;

-- ============================================================
-- 7. TRUSTED QUEST CREATION FUNCTION
-- ============================================================
-- Called by server-side API via RPC
-- Computes rewards from difficulty + category, inserts full quest record

CREATE OR REPLACE FUNCTION public.create_quest(
  p_title TEXT,
  p_description TEXT,
  p_category_id UUID,
  p_difficulty TEXT
)
RETURNS public.quests
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_category public.quest_categories%ROWTYPE;
  v_xp_base INTEGER;
  v_gold_base INTEGER;
  v_new_quest public.quests;
BEGIN
  -- Verify authenticated user
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Load category (trusted reference data)
  SELECT * INTO v_category
  FROM public.quest_categories
  WHERE id = p_category_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid category';
  END IF;

  -- Validate difficulty
  IF p_difficulty NOT IN ('easy','medium','hard','epic') THEN
    RAISE EXCEPTION 'Invalid difficulty';
  END IF;

  -- Define base rewards per difficulty (TRUSTED SERVER VALUES)
  CASE p_difficulty
    WHEN 'easy'   THEN v_xp_base := 50;  v_gold_base := 10;
    WHEN 'medium' THEN v_xp_base := 100; v_gold_base := 25;
    WHEN 'hard'   THEN v_xp_base := 200; v_gold_base := 50;
    WHEN 'epic'   THEN v_xp_base := 400; v_gold_base := 100;
    ELSE v_xp_base := 50; v_gold_base := 10;
  END CASE;

  -- Apply category multipliers (trusted)
  v_xp_base := FLOOR(v_xp_base * v_category.xp_multiplier);
  v_gold_base := FLOOR(v_gold_base * v_category.gold_multiplier);

  -- Insert quest with COMPUTED rewards and user_id from auth.uid()
  INSERT INTO public.quests (
    user_id, title, description, category_id, difficulty,
    xp_reward, gold_reward, status
  ) VALUES (
    auth.uid(), p_title, p_description, p_category_id, p_difficulty,
    v_xp_base, v_gold_base, 'pending'
  )
  RETURNING * INTO v_new_quest;

  RETURN v_new_quest;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_quest(TEXT, TEXT, UUID, TEXT) TO authenticated;

-- ============================================================
-- 8. TRUSTED QUEST START FUNCTION (optional - user marks quest as active)
-- ============================================================
CREATE OR REPLACE FUNCTION public.start_quest(p_quest_id UUID)
RETURNS public.quests
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_quest public.quests;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_quest
  FROM public.quests
  WHERE id = p_quest_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Quest not found';
  END IF;

  IF v_quest.user_id <> auth.uid() THEN
    RAISE EXCEPTION 'Quest does not belong to user';
  END IF;

  IF v_quest.status <> 'pending' THEN
    RAISE EXCEPTION 'Quest cannot be started (status: %)', v_quest.status;
  END IF;

  UPDATE public.quests
  SET status = 'active', started_at = NOW(), updated_at = NOW()
  WHERE id = p_quest_id
  RETURNING * INTO v_quest;

  RETURN v_quest;
END;
$$;

GRANT EXECUTE ON FUNCTION public.start_quest(UUID) TO authenticated;

-- ============================================================
-- 9. QUEST COMPLETION HISTORY (audit trail)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quest_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
  xp_awarded INTEGER NOT NULL,
  gold_awarded INTEGER NOT NULL,
  attribute_gained TEXT NOT NULL CHECK (attribute_gained IN ('strength','intellect','discipline','wisdom','charisma')),
  attribute_amount INTEGER NOT NULL DEFAULT 1,
  previous_level INTEGER NOT NULL,
  new_level INTEGER NOT NULL,
  previous_xp BIGINT NOT NULL,
  new_xp BIGINT NOT NULL,
  streak_at_completion INTEGER NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.quest_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own completions"
  ON public.quest_completions
  FOR SELECT
  USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE for users — only trusted completion function writes here

-- ============================================================
-- 10. PROFILE CREATION TRIGGER (SECURITY DEFINER, hardened)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'Adventurer'))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_admin;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 11. UPDATED_AT TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_quests_updated_at ON public.quests;
CREATE TRIGGER update_quests_updated_at
  BEFORE UPDATE ON public.quests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 12. TRUSTED QUEST COMPLETION FUNCTION
-- ============================================================
-- Accepts ONLY quest_id — all rewards derived from trusted DB data

CREATE OR REPLACE FUNCTION public.complete_quest(p_quest_id UUID)
RETURNS TABLE(
  success BOOLEAN,
  xp_awarded INTEGER,
  gold_awarded INTEGER,
  attribute_gained TEXT,
  attribute_amount INTEGER,
  previous_level INTEGER,
  new_level INTEGER,
  previous_xp BIGINT,
  new_xp BIGINT,
  new_gold BIGINT,
  streak_at_completion INTEGER,
  error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_quest public.quests%ROWTYPE;
  v_category public.quest_categories%ROWTYPE;
  v_profile public.profiles%ROWTYPE;
  v_xp_required BIGINT;
  v_new_level INTEGER;
  v_new_xp BIGINT;
  v_streak INTEGER;
  v_last_active DATE;
  v_today DATE := CURRENT_DATE;
BEGIN
  -- 1. Get authenticated user from session
  IF auth.uid() IS NULL THEN
    RETURN QUERY SELECT false, 0, 0, '', 0, 0, 0, 0, 0, 0, 0, 'Not authenticated';
  END IF;

  -- 2. Load quest with FOR UPDATE
  SELECT * INTO v_quest
  FROM public.quests
  WHERE id = p_quest_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, 0, '', 0, 0, 0, 0, 0, 0, 0, 'Quest not found';
  END IF;

  -- 3. Verify ownership
  IF v_quest.user_id <> auth.uid() THEN
    RETURN QUERY SELECT false, 0, 0, '', 0, 0, 0, 0, 0, 0, 0, 'Quest does not belong to user';
  END IF;

  -- 4. Verify quest is completable
  IF v_quest.status <> 'active' AND v_quest.status <> 'pending' THEN
    RETURN QUERY SELECT false, 0, 0, '', 0, 0, 0, 0, 0, 0, 0, format('Quest cannot be completed (status: %s)', v_quest.status);
  END IF;

  -- 5. Load category for attribute mapping
  SELECT * INTO v_category
  FROM public.quest_categories
  WHERE id = v_quest.category_id;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, 0, '', 0, 0, 0, 0, 0, 0, 0, 'Quest category not found';
  END IF;

  -- 6. Load user profile with FOR UPDATE
  SELECT * INTO v_profile
  FROM public.profiles
  WHERE id = auth.uid()
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, 0, '', 0, 0, 0, 0, 0, 0, 0, 'Profile not found';
  END IF;

  -- 7. Calculate streak
  v_streak := v_profile.streak;
  v_last_active := v_profile.last_active_date;

  IF v_last_active IS NULL THEN
    v_streak := 1;
  ELSIF v_last_active = v_today - INTERVAL '1 day' THEN
    v_streak := v_streak + 1;
  ELSIF v_last_active = v_today THEN
    v_streak := v_streak;
  ELSE
    v_streak := 1;
  END IF;

  -- 8. Read TRUSTED reward values from quest record (computed at creation)
  DECLARE
    v_final_xp INTEGER := v_quest.xp_reward;
    v_final_gold INTEGER := v_quest.gold_reward;
  BEGIN
    -- 9. Non-linear leveling: XP required for level L = floor(100 * L^1.5)
    v_new_xp := v_profile.xp + v_final_xp;
    v_new_level := v_profile.level;

    LOOP
      v_xp_required := FLOOR(100 * POWER(v_new_level::NUMERIC, 1.5));
      IF v_new_xp >= v_xp_required THEN
        v_new_level := v_new_level + 1;
      ELSE
        EXIT;
      END IF;
    END LOOP;

    -- 10. Atomic update: quest + profile + completion history
    UPDATE public.quests
    SET
      status = 'completed',
      completed_at = NOW(),
      updated_at = NOW()
    WHERE id = p_quest_id;

    UPDATE public.profiles
    SET
      xp = v_new_xp,
      gold = v_profile.gold + v_final_gold,
      level = v_new_level,
      strength = CASE WHEN v_category.attribute = 'strength' THEN v_profile.strength + 1 ELSE v_profile.strength END,
      intellect = CASE WHEN v_category.attribute = 'intellect' THEN v_profile.intellect + 1 ELSE v_profile.intellect END,
      discipline = CASE WHEN v_category.attribute = 'discipline' THEN v_profile.discipline + 1 ELSE v_profile.discipline END,
      wisdom = CASE WHEN v_category.attribute = 'wisdom' THEN v_profile.wisdom + 1 ELSE v_profile.wisdom END,
      streak = v_streak,
      last_active_date = v_today,
      updated_at = NOW()
    WHERE id = auth.uid();

    -- 11. Record completion history
    INSERT INTO public.quest_completions (
      user_id, quest_id, xp_awarded, gold_awarded,
      attribute_gained, attribute_amount,
      previous_level, new_level,
      previous_xp, new_xp,
      streak_at_completion
    ) VALUES (
      auth.uid(), p_quest_id, v_final_xp, v_final_gold,
      v_category.attribute, 1,
      v_profile.level, v_new_level,
      v_profile.xp, v_new_xp,
      v_streak
    );

    -- 12. Return success with progression details
    RETURN QUERY SELECT
      true,
      v_final_xp,
      v_final_gold,
      v_category.attribute,
      1,
      v_profile.level,
      v_new_level,
      v_profile.xp,
      v_new_xp,
      v_profile.gold + v_final_gold,
      v_streak,
      NULL::TEXT;
  END;
END;
$$;

GRANT EXECUTE ON FUNCTION public.complete_quest(UUID) TO authenticated;

-- ============================================================
-- 13. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON public.profiles(display_name);
CREATE INDEX IF NOT EXISTS idx_quests_user_id ON public.quests(user_id);
CREATE INDEX IF NOT EXISTS idx_quests_status ON public.quests(status);
CREATE INDEX IF NOT EXISTS idx_quest_completions_user_id ON public.quest_completions(user_id);

-- ============================================================
-- 14. COMMENTS
-- ============================================================
COMMENT ON TABLE public.profiles IS 'User profiles. Progression columns protected by column-level REVOKE; only trusted SECURITY DEFINER functions can modify them.';
COMMENT ON TABLE public.quests IS 'User quests. Reward columns (xp_reward, gold_reward) populated ONLY by create_quest() function; authenticated users cannot set them directly. Status managed by trusted functions.';
COMMENT ON TABLE public.quest_categories IS 'Trusted reference data mapping categories to attributes and multipliers.';
COMMENT ON TABLE public.quest_completions IS 'Immutable audit log of quest completions. Written only by complete_quest().';
COMMENT ON FUNCTION public.create_quest(TEXT, TEXT, UUID, TEXT) IS 'Trusted quest creation. Accepts user-controlled fields; computes rewards from difficulty + category. SECURITY DEFINER to bypass column INSERT restrictions on reward columns and user_id.';
COMMENT ON FUNCTION public.start_quest(UUID) IS 'Trusted quest start. Sets status=active and started_at=NOW(). SECURITY DEFINER to bypass column UPDATE restriction on status.';
COMMENT ON FUNCTION public.complete_quest(UUID) IS 'Trusted quest completion. Accepts only quest_id; reads rewards from quest record. SECURITY DEFINER to bypass column UPDATE restrictions on profile progression columns and quest status.';
COMMENT ON COLUMN public.profiles.xp IS 'CUMULATIVE lifetime XP. Level derived from this via formula floor(100 * L^1.5).';
COMMENT ON COLUMN public.quests.xp_reward IS 'Computed at creation by create_quest() from difficulty base * category multiplier. Not user-editable.';
COMMENT ON COLUMN public.quests.gold_reward IS 'Computed at creation by create_quest() from difficulty base * category multiplier. Not user-editable.';