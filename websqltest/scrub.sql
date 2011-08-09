-- remove unannounced shows
DELETE FROM dcm13_shows WHERE status_id != 6;
-- remove irrelevant data
UPDATE dcm13_shows SET
	contact_email = NULL,
	extra_info = NULL,
	last_year_slot = NULL,
	why_new = NULL,
	anything_else = NULL;
