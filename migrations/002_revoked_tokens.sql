-- Creates a table for revoked JWT tokens so logout can invalidate tokens
CREATE TABLE IF NOT EXISTS revoked_tokens (
	id SERIAL PRIMARY KEY,
	token TEXT UNIQUE NOT NULL,
	revoked_at TIMESTAMPTZ DEFAULT NOW(),
	expires_at TIMESTAMPTZ
);
