/******************* 09-09-2023 *******************/
ALTER TABLE IF EXISTS public.tbl_user
    ADD COLUMN IF NOT EXISTS view_dispatch text;

    
/******************* 19-10-2023 *******************/
CREATE TABLE public.tbl_item_sub_category
(
    autonum integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 ),
    sub_category_id integer NOT NULL,
    sub_category_name text,
    item_group_id integer,
    maker_id bigint,
    created_date timestamp without time zone,
    short_name text,
    PRIMARY KEY (sub_category_id)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE IF EXISTS public.tbl_item_sub_category
    OWNER to postgres;



    -- 

    CREATE TABLE public.tbl_job_cutting
(
    autonum integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 ),
    job_cutting_id integer NOT NULL,
    job_cutting_date timestamp with time zone,
    employee_id integer,
    machine_id integer,
    completed_date timestamp with time zone,
    user_id integer,
    maker_id bigint,
    status_id integer,
    created_date timestamp with time zone,
    updated_date timestamp with time zone,
    salary_status_id integer,
    PRIMARY KEY (job_cutting_id),
    CONSTRAINT machine_id_fk FOREIGN KEY (machine_id)
        REFERENCES public.tbl_machine (machine_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT employee_id_fk FOREIGN KEY (employee_id)
        REFERENCES public.tbl_employee_details (employee_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT status_fk FOREIGN KEY (status_id)
        REFERENCES public.tbl_def_status (status_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)
WITH (
    OIDS = FALSE
);

ALTER TABLE IF EXISTS public.tbl_job_cutting
    OWNER to postgres;


 CREATE TABLE public.tbl_job_cutting_item_details
(
    autonum integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 ),
    job_cutting_id integer,
    job_cutting_seq_no integer,
    size_id integer,
    item_id integer,
    design_id character varying,
    color_id integer,
    item_sub_category_id integer,
    job_cutting_set integer,
    job_cutting_pieces integer,
    total_amount double precision,
    user_id integer,
    maker_id integer,
    created_date timestamp with time zone,
    updated_date timestamp with time zone,
    PRIMARY KEY (autonum),
    CONSTRAINT color_fk FOREIGN KEY (color_id)
        REFERENCES public.tbl_color (color_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT size_id_fk FOREIGN KEY (size_id)
        REFERENCES public.tbl_item_sizes (size_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT item_id_fk FOREIGN KEY (item_id)
        REFERENCES public.tbl_def_item (item_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT item_sub_category_id_fk FOREIGN KEY (item_sub_category_id)
        REFERENCES public.tbl_item_sub_category (sub_category_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT job_cutting_id_fk FOREIGN KEY (job_cutting_id)
        REFERENCES public.tbl_job_cutting (job_cutting_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)
WITH (
    OIDS = FALSE
);

ALTER TABLE IF EXISTS public.tbl_job_cutting_item_details
    OWNER to postgres;


    ALTER TABLE IF EXISTS public.tbl_job_cutting
    ADD COLUMN IF NOT EXISTS job_cutting_seq_no integer;

/******************* 20-10-2023 *******************/
    ALTER TABLE IF EXISTS public.tbl_item_sub_category
    ADD COLUMN IF NOT EXISTS price double precision;

/**    25-10-2023 **/

CREATE VIEW public.view_stock
 AS
 SELECT tbl_fg_items.size_id,
    tbl_fg_items.no_of_set AS inward_set,
    tbl_fg_items.no_of_pieces AS inward_pieces,
    0 AS outward_set,
    0 AS outward_pieces
   FROM tbl_fg_items
UNION ALL
 SELECT tbl_dispatch_details.size_id,
    0 AS inward_set,
    0 AS inward_pieces,
    tbl_dispatch_details.dispatch_set AS outward_set,
    tbl_dispatch_details.dispatch_pieces AS outward_pieces
   FROM tbl_dispatch_details
  WHERE tbl_dispatch_details.status_flag = 1
UNION ALL
 SELECT tbl_goods_return.size_id,
    tbl_goods_return.goods_return_set AS inward_set,
    tbl_goods_return.goods_return_pieces AS inward_pieces,
    0 AS outward_set,
    0 AS outward_pieces
   FROM tbl_goods_return
  WHERE tbl_goods_return.status_flag = 1;

ALTER TABLE public.view_stock
    OWNER TO postgres;


    /******************* 27-10-2023 *******************/
    
CREATE TABLE IF NOT EXISTS public.tbl_job_cutting_process_details
(
    autonum integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    process_id integer NOT NULL,
    from_date timestamp without time zone,
    to_date timestamp without time zone,
    created_date timestamp with time zone,
    user_id integer,
    maker_id integer,
    salary_amt double precision,
    no_of_employee integer,
    total_pieces integer,
    CONSTRAINT tbl_job_cutting_process_details_pkey PRIMARY KEY (process_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tbl_job_cutting_process_details
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.tbl_job_cutting_salary_process
(
    autonum integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    salaryprocess_id integer,
    employee_id integer,
    job_cutting_id integer,
    from_date timestamp without time zone,
    to_date timestamp without time zone,
    net_amount double precision,
    salary_status_id integer,
    created_date timestamp with time zone,
    process_id integer,
    size_id integer,
    job_cutting_set integer,
    job_cutting_pieces integer,
    total_amount double precision,
    CONSTRAINT process_foreign FOREIGN KEY (process_id)
        REFERENCES public.tbl_job_cutting_process_details (process_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT size_id_fk FOREIGN KEY (size_id)
        REFERENCES public.tbl_item_sizes (size_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tbl_job_cutting_salary_process
    OWNER to postgres;

/******************* 31-10-2023 *******************/

-- Table: public.tbl_job_cutting_payout_details

-- DROP TABLE IF EXISTS public.tbl_job_cutting_payout_details;

CREATE TABLE IF NOT EXISTS public.tbl_job_cutting_payout_details
(
    autonum integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    payout_id integer NOT NULL,
    from_date timestamp without time zone,
    to_date timestamp without time zone,
    created_date timestamp with time zone,
    user_id integer,
    maker_id integer,
    payout_amt double precision,
    no_of_employee integer,
    total_pieces integer,
    CONSTRAINT tbl_job_cutting_payout_details_pkey PRIMARY KEY (payout_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tbl_job_cutting_payout_details
    OWNER to postgres;


-- Table: public.tbl_job_cutting_salary_payout

-- DROP TABLE IF EXISTS public.tbl_job_cutting_salary_payout;

CREATE TABLE IF NOT EXISTS public.tbl_job_cutting_salary_payout
(
    autonum integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    payout_id integer,
    salarypayout_id integer NOT NULL,
    employee_id integer,
    from_date timestamp without time zone,
    to_date timestamp without time zone,
    payout_amount double precision,
    salary_status_id integer,
    created_date timestamp with time zone,
    process_id integer,
    cash_amount double precision,
    credit_amount double precision,
    carry_amount double precision,
    old_carryforward_amount double precision,
    CONSTRAINT tbl_job_cutting_salary_payout_pkey PRIMARY KEY (salarypayout_id),
    CONSTRAINT employee_foreign_key FOREIGN KEY (employee_id)
        REFERENCES public.tbl_employee_details (employee_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tbl_job_cutting_salary_payout
    OWNER to postgres;


-- Table: public.tbl_job_cutting_employee_carryforward_details

-- DROP TABLE IF EXISTS public.tbl_job_cutting_employee_carryforward_details;

CREATE TABLE IF NOT EXISTS public.tbl_job_cutting_employee_carryforward_details
(
    autonum integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    carryforward_id integer NOT NULL,
    from_date timestamp without time zone,
    to_date timestamp without time zone,
    created_date timestamp with time zone,
    carryforward_amount double precision,
    employee_id integer,
    payout_id integer,
    CONSTRAINT tbl_job_cutting_employee_carryforward_details_pkey PRIMARY KEY (carryforward_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tbl_job_cutting_employee_carryforward_details
    OWNER to postgres;


    /******************* 07-11-2023 *******************/
ALTER TABLE IF EXISTS public.tbl_order_taking_items
    ADD COLUMN IF NOT EXISTS pending_dispatch double precision;
    
/******************* 08-11-2023 *******************/

    ALTER TABLE IF EXISTS public.tbl_stock_transaction
    RENAME inward TO inward_set;

ALTER TABLE IF EXISTS public.tbl_stock_transaction
    RENAME outward TO outward_set;

ALTER TABLE IF EXISTS public.tbl_stock_transaction
    ADD COLUMN IF NOT EXISTS inward_pieces double precision;

ALTER TABLE IF EXISTS public.tbl_stock_transaction
    ADD COLUMN IF NOT EXISTS outward_pieces double precision;

ALTER TABLE IF EXISTS public.tbl_stock_transaction
    ADD COLUMN IF NOT EXISTS customer_code character varying;

ALTER TABLE IF EXISTS public.tbl_stock_transaction
    ADD COLUMN IF NOT EXISTS order_no character varying;

ALTER TABLE IF EXISTS public.tbl_stock_transaction
    ADD COLUMN IF NOT EXISTS type character varying;

ALTER TABLE IF EXISTS public.tbl_stock_transaction
    ADD COLUMN IF NOT EXISTS updated_at timestamp without time zone;

/******************* 08-11-2023 *******************/

    UPDATE tbl_order_taking_items SET pending_dispatch = pending_set FROM 
(SELECT size_id,order_no,order_date,
DEV.customer_code,(sum(order_qty) - sum(dispatch_set)) AS pending_set FROM 
(SELECT b.size_id,a.order_no,to_char(a.order_date,'DD-MM-YYYY') AS order_date,
         a.customer_code,sum(b.qty) AS order_qty,0 AS dispatch_set FROM tbl_order_taking 
 AS a INNER JOIN tbl_order_taking_items AS b ON a.order_no=b.order_no WHERE  1=1 
 GROUP BY b.size_id,a.order_no,order_date,a.customer_code 
        UNION ALL
        SELECT b.size_id,a.order_no,to_char(a.order_date,'DD-MM-YYYY') AS order_date,a.customer_code,
        0 AS order_qty, sum(b.dispatch_set) AS dispatch_set FROM tbl_order_taking 
 AS a INNER JOIN tbl_dispatch_details AS b ON a.order_no=b.order_no 
  WHERE b.status_flag = 1 AND
        1=1  GROUP BY b.size_id,a.order_no,order_date,a.customer_code
        ) AS DEV GROUP BY size_id,order_no,order_date,DEV.customer_code) AS b
WHERE  
tbl_order_taking_items.order_no = b.order_no AND 
tbl_order_taking_items.size_id = b.size_id


INSERT INTO tbl_stock_transaction(
              stock_date, size_id, trans_no, inward_set, 
  outward_set, user_id, created_date, inward_pieces, outward_pieces, type)  
SELECT date,size_id,fg_id,no_of_set,0 as outward_set,user_id,created_at,no_of_pieces,
0 as outward_pieces,'FinishedGood' FROM tbl_fg_items order by autonum asc

INSERT INTO tbl_stock_transaction(
stock_date, size_id, trans_no, inward_set, outward_set, user_id, created_date, 
inward_pieces, outward_pieces, customer_code, type)
SELECT goods_return_date,size_id,goods_return_no,goods_return_set, 0 as outward_set,
user_id,created_at,goods_return_pieces, 0 as outward_pieces
,customer_code,'GoodsReturn' as type FROM tbl_goods_return WHERE status_flag = 1

INSERT INTO tbl_stock_transaction(
              stock_date, size_id, trans_no, inward_set, outward_set, user_id,
  created_date, inward_pieces, outward_pieces, customer_code, order_no, type)
  SELECT dispatch_date,size_id,dispatch_no,0 as inward_set,dispatch_set,
 user_id,created_at,0 as inward_pieces,dispatch_pieces,customer_code,order_no,'Dispatch'
 FROM tbl_dispatch_details WHERE status_flag = 1 order by dispatch_date  ASC

 DELETE FROM tbl_stock_transaction WHERE type is null

 INSERT INTO tbl_stock_transaction(stock_date,size_id,trans_no,
inward_set,outward_set,user_id,created_date,inward_pieces,outward_pieces,
customer_code,type)
SELECT order_date,b.size_id,b.order_no,0 as inward_set,b.qty AS outward_set,a.user_id,
a.created_date,0 as inward_pieces,0 AS outward_pieces,a.customer_code,'Order'
FROM tbl_order_taking AS a 
INNER JOIN tbl_order_taking_items AS b ON a.order_no = b.order_no 
INNER JOIN tbl_item_sizes AS c ON c.size_id = b.size_id 
WHERE a.status_code in (1,3) ORDER BY order_date asc

/******************* 14-11-2023 *******************/
INSERT INTO tbl_def_menu_details (menu_id,menu_name) VALUES (1,'Dashboard')


/******************* 14-11-2023 *******************/
/******************* Close Pending Order *******************/
ALTER TABLE IF EXISTS public.tbl_order_taking
    ADD COLUMN IF NOT EXISTS close_status integer;