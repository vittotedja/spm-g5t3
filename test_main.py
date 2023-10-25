import os
from dotenv import load_dotenv
from supabase import create_client, Client
from fastapi.testclient import TestClient
import pytest

load_dotenv()
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

test_url: str = os.getenv("TEST_SUPABASE_URL")
test_key: str = os.getenv("TEST_SUPABASE_KEY")
test_supabase: Client = create_client(test_url, test_key)

tables = {
    "access_control": [],
    "staff": [],
    "skill": [],
    "role": [],
    "staff_skill": [],
    "role_skill": [],
    "listing": [],
    "listing_manager": [],
    "application": [],
}


# Pytest fixture to populate the test tables
@pytest.fixture(scope="module", autouse=True)
def populate_test_tables():
    test_supabase.rpc("delete_all_rows", {}).execute()
    for table in tables:
        response = supabase.from_(table).select("*").execute()
        data = response.data
        test_supabase.table(table).upsert(data).execute()

    yield

    # Delete all rows from test tables
    # test_supabase.rpc('tes', {}).execute()


# Pytest fixture for your FastAPI app client
@pytest.fixture(scope="module")
def app_client():
    from main import (
        app,
    )  # Replace 'main' with the actual name of your FastAPI app's main file

    client = TestClient(app)
    return client


def test_staff(app_client):
    response = app_client.get("/api/staff")
    assert response.status_code == 200


# def test_staff_with_email(app_client):
#     response = app_client.get("/api/staff?email=yee.lim@allinone.com.sg")
#     assert response.status_code == 200
#     assert response.json() == [{'staff_id': 140944, 'staff_fname': 'Yee', 'staff_lname': 'Lim', 'email': 'yee.lim@allinone.com.sg', 'dept': 'Sales', 'country': 'Singapore', 'control_access': 3}]

# def test_staff_search(app_client):
#     response = app_client.get("/api/staff?name=John&staff_id=123&listing_id=456")
#     assert response.status_code == 200
#     assert response.json() == [{'staff_fname': 'John', 'staff_lname': 'Doe', 'dept': 'Sales', 'country': 'Singapore', 'control_access': 3, 'staff_id': 140944, 'similarity': 100}]
