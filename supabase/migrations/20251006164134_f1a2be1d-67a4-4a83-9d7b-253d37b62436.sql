-- First, update any old status values to new ones
UPDATE customer_devices 
SET status = 'completed' 
WHERE status NOT IN ('pending', 'completed', 'returned', 'waiting_parts', 'warranty');

-- Drop the old constraint
ALTER TABLE customer_devices DROP CONSTRAINT IF EXISTS customer_devices_status_check;

-- Add the updated constraint with all new status values
ALTER TABLE customer_devices ADD CONSTRAINT customer_devices_status_check 
CHECK (status IN ('pending', 'completed', 'returned', 'waiting_parts', 'warranty'));