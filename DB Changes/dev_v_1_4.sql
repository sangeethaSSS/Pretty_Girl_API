/******************* 20-09-2023 *******************/
CREATE TABLE public.tbl_dispatch_delete_details
(
    autonum integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 ),
    dispatch_id integer,
    order_no character varying,
    customer_code character varying,
    order_set double precision,
    dispatch_set double precision,
    size_id integer,
    dispatch_type character varying,
    user_id integer,
    created_at timestamp without time zone,
    dispatch_no character varying,
    dispatch_date date,
    status_flag integer,
    dispatch_pieces double precision,
    delete_dispatch_id integer NOT NULL,
    PRIMARY KEY (autonum, delete_dispatch_id)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE IF EXISTS public.tbl_dispatch_delete_details
    OWNER to postgres;