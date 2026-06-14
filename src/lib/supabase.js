import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://cciufnztjqqumkqebssw.supabase.co/rest/v1/"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjaXVmbnp0anFxdW1rcWVic3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzODIzMTgsImV4cCI6MjA5Njk1ODMxOH0.Z6bSZ7W3uyZ7LVgwt_D25rf_RxA96-t3eDMGuHnez7k"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
