from supabase import create_client, Client
import os
from dotenv import load_dotenv
from postgrest import exceptions as postgrest_exceptions

load_dotenv()
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

try:
    supabase.rpc("setup_db", {}).execute()
except postgrest_exceptions.APIError as e:
    if e.details == "b''" and e.message == 'JSON could not be generated':
        # Specific error encountered: JSON could not be generated. This is expected.
        pass