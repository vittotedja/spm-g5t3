from supabase import create_client, Client
import os
from dotenv import load_dotenv


load_dotenv()
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

supabase.rpc("setup_db", {}).execute()
