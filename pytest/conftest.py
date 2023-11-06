import os
from dotenv import load_dotenv
from supabase import create_client, Client
from fastapi.testclient import TestClient
from postgrest import exceptions as postgrest_exceptions
import pytest
import sys

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

# Pytest fixture to populate the test tables
@pytest.fixture(scope="module", autouse=True)
def populate_test_tables():
    # Add parent directory to sys.path to import .env
    sys.path.append("..")
    load_dotenv()

    # Initialize supabase client
    test_url: str = os.getenv("SUPABASE_URL")
    test_key: str = os.getenv("SUPABASE_KEY")
    test_supabase: Client = create_client(test_url, test_key)
    
    # Save original data
    for table in tables:
        data = test_supabase.from_(table).select('*').execute().data
        tables[table] = data

    yield

    # Clear test database
    try:
        test_supabase.rpc('delete_all_rows', {}).execute()
    except postgrest_exceptions.APIError as e:
        if e.details == "b''" and e.message == 'JSON could not be generated':
            # Specific error encountered: JSON could not be generated. This is expected.
            pass

    # Restore to original test database
    for table in tables:
        test_supabase.table(table).upsert(tables[table]).execute()

# Pytest fixture for your FastAPI app client
@pytest.fixture(scope="module")
def app_client():
    from main import app
    client = TestClient(app)
    return client