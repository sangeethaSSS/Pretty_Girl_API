/******************* 05-07-2023 *******************/
CREATE TABLE public.tbl_fg_items
(
    autonum integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 ),
    fg_id integer NOT NULL,
    size_id integer NOT NULL,
    qty double precision,
    user_id integer,
    created_at timestamp without time zone,
    PRIMARY KEY (autonum, fg_id),
    CONSTRAINT fk_sizeid FOREIGN KEY (size_id)
        REFERENCES public.tbl_item_sizes (size_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)
WITH (
    OIDS = FALSE
);

ALTER TABLE IF EXISTS public.tbl_fg_items
    OWNER to postgres;


/******************* 06-07-2023 *******************/
CREATE TABLE public.tbl_dispatch_details
(
    autonum integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 ),
    dispatch_id integer NOT NULL,
    order_no character varying,
    customer_code character varying,
    order_qty double precision,
    dispatch_qty double precision,
    size_id integer,
    dispatch_type character varying,
    user_id integer,
    created_at timestamp without time zone,
    PRIMARY KEY (autonum, dispatch_id),
    CONSTRAINT fk_customer_code FOREIGN KEY (customer_code)
        REFERENCES public.tbl_customer (customer_code) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT fk_size_id FOREIGN KEY (size_id)
        REFERENCES public.tbl_item_sizes (size_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)
WITH (
    OIDS = FALSE
);
ALTER TABLE IF EXISTS public.tbl_dispatch_details
    OWNER to postgres;

/******************* 19-07-2023 *******************/ 
ALTER TABLE IF EXISTS public.tbl_dispatch_details
    ADD COLUMN IF NOT EXISTS dispatch_no character varying;

ALTER TABLE IF EXISTS public.tbl_dispatch_details
ADD COLUMN IF NOT EXISTS dispatch_date date;

/******************* 27-07-2023 *******************/ 
ALTER TABLE IF EXISTS public.tbl_fg_items
    ADD COLUMN IF NOT EXISTS no_of_set double precision;

ALTER TABLE IF EXISTS public.tbl_fg_items
RENAME qty TO no_of_pieces;

ALTER TABLE IF EXISTS public.tbl_dispatch_details
    RENAME order_qty TO order_set;

ALTER TABLE IF EXISTS public.tbl_dispatch_details
    RENAME dispatch_qty TO dispatch_set;

ALTER TABLE IF EXISTS public.tbl_def_item
ADD COLUMN IF NOT EXISTS maker_id bigint;

ALTER TABLE IF EXISTS public.tbl_def_item
    ADD COLUMN IF NOT EXISTS created_date timestamp without time zone;
/******************* 02-08-2023 *******************/ 
CREATE TABLE public.tbl_ironmachine_master
(
    autonum integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 ),
    machine_id integer,
    machine_no text,
    machine_name text,
    maker_id integer,
    user_id integer,
    status_id integer,
    created_date timestamp with time zone,
    updated_date timestamp with time zone,
    PRIMARY KEY (machine_id)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE IF EXISTS public.tbl_ironmachine_master
    OWNER to postgres;
/******************* 03-08-2023 *******************/ 
    ALTER TABLE IF EXISTS public.tbl_fg_items
    ADD COLUMN IF NOT EXISTS ironmachine_id integer;
    
    ALTER TABLE IF EXISTS public.tbl_fg_items
    ADD COLUMN IF NOT EXISTS date timestamp with time zone;

    -- 09-08-20223

    ALTER TABLE IF EXISTS public.tbl_dispatch_details
    ADD COLUMN IF NOT EXISTS status_flag integer;