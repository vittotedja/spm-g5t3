import os
from dotenv import load_dotenv
from supabase import create_client, Client
from postgrest import exceptions as postgrest_exceptions

tables = {
    'access_control': [], 
    'staff': [], 
    'skill': [], 
    'role': [], 
    'staff_skill': [], 
    'role_skill': [], 
    'listing': [], 
    'listing_manager': [], 
    'application': []
}
load_dotenv()
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")

test_url: str = os.getenv("TEST_SUPABASE_URL")
test_key: str = os.getenv("TEST_SUPABASE_KEY")

# Clear test database
test_supabase: Client = create_client(test_url, test_key)
try:
    test_supabase.rpc('delete_all_rows', {}).execute()
except postgrest_exceptions.APIError as e:
    if e.details == "b''" and e.message == 'JSON could not be generated':
        # Specific error encountered: JSON could not be generated. This is expected.
        pass

# Get original data from main database
supabase: Client = create_client(url, key)
print('--------Getting data from main database--------')
for table in tables:
    print('Getting data from table', table)
    data = supabase.from_(table).select('*').execute().data
    tables[table] = data

# Repopulate test database
print('--------Inserting data to test database--------')
test_supabase: Client = create_client(test_url, test_key)
for table in tables:
    print('Inserting to table', table)
    test_supabase.table(table).upsert(tables[table]).execute()