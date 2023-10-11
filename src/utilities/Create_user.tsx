import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const newUrl = "https://lhtazigkmlwzrsknbidn.supabase.co/"
const newKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxodGF6aWdrbWx3enJza25iaWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY2MDg4NDgsImV4cCI6MjAxMjE4NDg0OH0.aU_OMGYjNx8oIf7XnfuV4CEyMsRxX3lwt40fRq6MTQM" // Make sure to keep your keys secure and not expose them publicly
const supabase: SupabaseClient = createClient(newUrl, newKey);

export const useCreateAcc = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('auth.users')
        .select('*');

      if (error) console.error('Error fetching users:', error);
      else {
        console.log(data)
        setUsers(data || []);
      }
    };

    fetchUsers();
  }, []);

    const createAccForStaff = async () => {
      const { data: staff, error } = await supabase
        .from('staff')
        .select('*');

      if (error) console.log('Error fetching staff:', error);

      staff && staff.forEach(async (member) => {
        if (users.find(user => user.email === member.email)) {
          console.log('Account already exists for:', member.email);
          return;
        }

        const password = member.email.split('@')[0];
        const { data, error } = await supabase.auth.signUp({
          email: member.email,
          password
        });

        if (error) console.error('Error creating account:', error);
        else console.log('Account created for:', data?.user?.email);
      });
    };

  return createAccForStaff;
};
