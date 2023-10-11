import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const newUrl = "https://lhtazigkmlwzrsknbidn.supabase.co/"
const newKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodGF6aWdrbWx3enJza25iaWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY2MDg4NDgsImV4cCI6MjAxMjE4NDg0OH0.aU_OMGYjNx8oIf7XnfuV4CEyMsRxX3lwt40fRq6MTQM" // Make sure to keep your keys secure and not expose them publicly
const supabase: SupabaseClient = createClient(newUrl, newKey);

interface Staff {
    email: string;
    // other fields from your staff table
  }

export const useCreateAcc = () => {
  const [staff, setStaff] = useState<Staff[]>([]);

  useEffect(() => {
    const fetchStaff = async () => {
      const { data, error } = await supabase
        .from('staff')
        .select('email');

      if (error) console.error('Error fetching staff:', error);
      else {
        console.log(data)
        setStaff(data || []);
      }
    };

    fetchStaff();
  }, []);

    const createAccForStaff = async () => {
    if (staff.length === 0) return;
      await Promise.all(
        staff.map(async (member) => {
            const { email } = member;
            const password = email.split('@')[0];
            console.log(email)
            console.log(password)
            try {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) {
                    // Handle error - like user already exists or other signup issues
                    console.error('Error creating account for', email, 'and ', password, ':', error.message);
                } else {
                    console.log('Account created for:', email);
                }
            } catch (error) {
                console.error('Error during signup:', error);
            }
        })
    );
};

return createAccForStaff;
};
