ALTER TABLE IF EXISTS public.tbl_order_taking
ADD COLUMN IF NOT EXISTS remarks character varying;

ALTER TABLE IF EXISTS public.tbl_user
ADD COLUMN IF NOT EXISTS mobile_no character varying;

insert into tbl_def_userrole(userrole_id, userrole_name, status_id) values (3,'Order User',1)
update tbl_def_userrole set userrole_name='Tailoring' where userrole_id=2

CREATE TABLE public.tbl_def_menu_details
(
    autonum integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 ),
    menu_id integer NOT NULL,
    menu_name character varying,
    PRIMARY KEY (autonum, menu_id)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE IF EXISTS public.tbl_def_menu_details
    OWNER to postgres;


INSERT INTO tbl_def_menu_details(menu_id, menu_name) VALUES ( 1, 'Dashboard');
INSERT INTO tbl_def_menu_details(menu_id, menu_name) VALUES ( 2, 'Employee Management');
INSERT INTO tbl_def_menu_details(menu_id, menu_name) VALUES ( 3, 'Production');
INSERT INTO tbl_def_menu_details(menu_id, menu_name) VALUES ( 4, 'Payroll');
INSERT INTO tbl_def_menu_details(menu_id, menu_name) VALUES ( 5, 'Order Management');
INSERT INTO tbl_def_menu_details(menu_id, menu_name) VALUES ( 6, 'Reports');
INSERT INTO tbl_def_menu_details(menu_id, menu_name) VALUES ( 7, 'Control Panel');


CREATE TABLE public.tbl_user_menu_details
(
    menu_user_id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 ),
    menu_id integer,
    user_id integer,
    maker_id integer,
    created_at timestamp without time zone,
    PRIMARY KEY (menu_user_id)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE IF EXISTS public.tbl_user_menu_details
    OWNER to postgres;