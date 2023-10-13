/******************* 11-10-2023 *******************/
CREATE TABLE public.tbl_goods_return
(
    autonum integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 ),
    goods_return_id integer NOT NULL,
    goods_return_no character varying,
    customer_code character varying,
    size_id integer,
    user_id integer,
    created_at timestamp without time zone,
    goods_return_date date,
    status_flag integer,
    goods_return_set double precision,
    goods_return_pieces double precision,
    PRIMARY KEY (goods_return_id, autonum),
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

ALTER TABLE IF EXISTS public.tbl_goods_return
    OWNER to postgres;
/******************* 11-10-2023 *******************/
    CREATE TABLE public.tbl_goods_return_dispatch
(
    autonum integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 ),
    goods_return_id integer NOT NULL,
    goods_return_no character varying,
    size_id integer,
    goods_return_set integer,
    goods_return_pieces integer,
    dispatch_set integer,
    dispatch_pieces integer,
    PRIMARY KEY (autonum)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE IF EXISTS public.tbl_goods_return_dispatch
    OWNER to postgres;

    ALTER TABLE IF EXISTS public.tbl_goods_return_dispatch
    ADD COLUMN IF NOT EXISTS created_at timestamp without time zone;

ALTER TABLE IF EXISTS public.tbl_goods_return_dispatch
    ADD COLUMN IF NOT EXISTS goods_return_date date;

    ALTER TABLE IF EXISTS public.tbl_goods_return_dispatch
    ADD COLUMN IF NOT EXISTS dispatch_no character varying;

    ALTER TABLE IF EXISTS public.tbl_goods_return_dispatch
    ADD COLUMN IF NOT EXISTS customer_code character varying;

    ALTER TABLE IF EXISTS public.tbl_goods_return_dispatch
    ADD COLUMN IF NOT EXISTS status_flag integer;



    ALTER TABLE IF EXISTS public.tbl_goods_return
    ADD COLUMN IF NOT EXISTS maker_id integer;

    ALTER TABLE IF EXISTS public.tbl_goods_return_dispatch
    ADD COLUMN IF NOT EXISTS maker_id integer;