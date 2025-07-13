-- PostgreSQL schema for proofreader application
-- Simplified approach: store selected options as JSON array

CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_text TEXT NOT NULL,
    selected_options TEXT[] NOT NULL, -- Array of option names like ['grammar', 'spelling']
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for better performance on date queries
CREATE INDEX idx_submissions_created_at ON submissions(created_at);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_submissions_updated_at 
    BEFORE UPDATE ON submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Add some constraints for data validation
ALTER TABLE submissions 
ADD CONSTRAINT check_text_not_empty 
CHECK (length(trim(original_text)) > 0);

ALTER TABLE submissions 
ADD CONSTRAINT check_options_not_empty 
CHECK (array_length(selected_options, 1) > 0); 