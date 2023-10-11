// import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import {supabase} from '../pages/Login';
// const supabase: SupabaseClient = createClient(newUrl, newKey);

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
