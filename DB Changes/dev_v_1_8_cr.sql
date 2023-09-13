/******************* 09-09-2023 *******************/
ALTER TABLE IF EXISTS public.tbl_user
    ADD COLUMN IF NOT EXISTS view_dispatch text;