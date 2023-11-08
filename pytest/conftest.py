import os
from dotenv import load_dotenv
from supabase import create_client, Client
from fastapi.testclient import TestClient
from postgrest import exceptions as postgrest_exceptions
import pytest
import sys

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
    
    test_supabase.rpc('delete_and_add_data', {}).execute()

# Pytest fixture for your FastAPI app client
@pytest.fixture(scope="module")
def app_client():
    from main import app
    client = TestClient(app)
    return client