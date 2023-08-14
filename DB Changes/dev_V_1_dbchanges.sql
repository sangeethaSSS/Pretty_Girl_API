ALTER TABLE IF EXISTS public.tbl_item_sizes
    ADD COLUMN IF NOT EXISTS settype text;