ALTER TABLE IF EXISTS public.tbl_item_sizes
    ADD COLUMN IF NOT EXISTS settype text;

    ALTER TABLE IF EXISTS public.tbl_order_taking
    ADD COLUMN IF NOT EXISTS whatsappurl text;