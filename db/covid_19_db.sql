select * from pg_roles where rolname like 'covid_19%';

set role covid_19_writer;
set role covid_19_reader;
set role 'dbEyeInTheSky';

insert into covid_19 (dt, dtStr, confirmed, deaths, recovered) values (NOW(), '2020-04-26', 100000, 10000, 50000);
insert into covid_19 (dt, dtStr, confirmed, deaths, recovered, created_at) values (NOW(), '2020-04-26', 100000, 10000, 50000, NOW());

update covid_19 
set
	dt = NOW(), 
	 dtStr = '2020/04/26', 
	 confirmed = 200000, 
	 deaths = 10000, 
	 recovered = 60000,
	 created_at = NOW()
where 
	id=4;

-- CREATE TABLE covid_19 (
-- 	id INT GENERATED BY DEFAULT AS IDENTITY,
-- 	dt DATE NOT NULL,
-- 	dtStr VARCHAR(10) NOT NULL,
-- 	confirmed INT NOT NULL,
-- 	deaths INT NOT NULL,
-- 	recovered INT NOT NULL,
-- 	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
-- 	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- );

-- CREATE OR REPLACE FUNCTION f_Create_Update() RETURNS trigger
--    LANGUAGE plpgsql AS
-- $$BEGIN
-- 	IF NEW.created_at IS DISTINCT FROM OLD.created_at
-- 	THEN
--       RAISE EXCEPTION 'Do not update "created_at"';
-- 	ELSE
-- 		NEW.updated_at = NOW();
-- 	END IF;
-- 	RETURN NEW;
-- END;$$;

-- CREATE TRIGGER f_Create_Update BEFORE UPDATE ON covid_19
-- FOR EACH ROW 
-- EXECUTE PROCEDURE f_Create_Update();

-- create role covid_19_writer;
-- create role covid_19_reader;

-- grant select, insert(dt, dtStr, confirmed, deaths, recovered) on table covid_19 to covid_19_writer;
-- grant select on table covid_19 to covid_19_reader;
