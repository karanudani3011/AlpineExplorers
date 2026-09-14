-- ====================================================================
-- ALPINE EXPLORERS: ROLE-BASED ACCESS CONTROL (RBAC) & STAFF MANAGEMENT
-- SUPABASE POSTGRESQL MIGRATION SCRIPT
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. admin_profiles
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    role TEXT NOT NULL CHECK(role IN ('SUPER_ADMIN', 'STAFF')) DEFAULT 'STAFF',
    status TEXT NOT NULL CHECK(status IN ('ACTIVE', 'INACTIVE')) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_profiles_auth_user_id ON public.admin_profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_email ON public.admin_profiles(email);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_role ON public.admin_profiles(role);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_status ON public.admin_profiles(status);

-- 2. admin_permissions
CREATE TABLE IF NOT EXISTS public.admin_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.admin_profiles(id) ON DELETE CASCADE,
    permission_key TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_admin_permission_user_key UNIQUE(user_id, permission_key)
);

CREATE INDEX IF NOT EXISTS idx_admin_permissions_user_id ON public.admin_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_permissions_key ON public.admin_permissions(permission_key);

-- 3. admin_audit_logs
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_user_id UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
    module TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_user_id ON public.admin_audit_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON public.admin_audit_logs(created_at DESC);

-- 4. Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_admin_profile_updated()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_admin_profiles_updated ON public.admin_profiles;
CREATE TRIGGER trg_admin_profiles_updated
    BEFORE UPDATE ON public.admin_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_admin_profile_updated();

-- 5. Helper functions for RLS
CREATE OR REPLACE FUNCTION public.is_super_admin(user_auth_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    IF user_auth_id IS NULL THEN
        RETURN FALSE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE auth_user_id = user_auth_id
          AND role = 'SUPER_ADMIN'
          AND status = 'ACTIVE'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_active_staff(user_auth_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    IF user_auth_id IS NULL THEN
        RETURN FALSE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE auth_user_id = user_auth_id
          AND status = 'ACTIVE'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.has_permission(perm_key TEXT, user_auth_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
DECLARE
    v_profile_id UUID;
    v_role TEXT;
    v_status TEXT;
BEGIN
    IF user_auth_id IS NULL THEN
        RETURN FALSE;
    END IF;

    SELECT id, role, status INTO v_profile_id, v_role, v_status
    FROM public.admin_profiles
    WHERE auth_user_id = user_auth_id;

    IF v_profile_id IS NULL OR v_status != 'ACTIVE' THEN
        RETURN FALSE;
    END IF;

    IF v_role = 'SUPER_ADMIN' THEN
        RETURN TRUE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.admin_permissions
        WHERE user_id = v_profile_id
          AND permission_key = perm_key
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Row Level Security
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super Admins have full access to admin_profiles" ON public.admin_profiles;
CREATE POLICY "Super Admins have full access to admin_profiles"
    ON public.admin_profiles
    FOR ALL
    TO authenticated
    USING (public.is_super_admin(auth.uid()))
    WITH CHECK (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "Staff can read own admin profile" ON public.admin_profiles;
CREATE POLICY "Staff can read own admin profile"
    ON public.admin_profiles
    FOR SELECT
    TO authenticated
    USING (auth_user_id = auth.uid() AND status = 'ACTIVE');

DROP POLICY IF EXISTS "Super Admins have full access to admin_permissions" ON public.admin_permissions;
CREATE POLICY "Super Admins have full access to admin_permissions"
    ON public.admin_permissions
    FOR ALL
    TO authenticated
    USING (public.is_super_admin(auth.uid()))
    WITH CHECK (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "Staff can view own permissions" ON public.admin_permissions;
CREATE POLICY "Staff can view own permissions"
    ON public.admin_permissions
    FOR SELECT
    TO authenticated
    USING (
        user_id IN (
            SELECT id FROM public.admin_profiles
            WHERE auth_user_id = auth.uid() AND status = 'ACTIVE'
        )
    );

DROP POLICY IF EXISTS "Super Admins can view all audit logs" ON public.admin_audit_logs;
CREATE POLICY "Super Admins can view all audit logs"
    ON public.admin_audit_logs
    FOR SELECT
    TO authenticated
    USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can insert audit logs" ON public.admin_audit_logs;
CREATE POLICY "Authenticated users can insert audit logs"
    ON public.admin_audit_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_active_staff(auth.uid()));
