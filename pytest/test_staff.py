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

def test_staff(app_client):
    response = app_client.get("/api/staff")
    assert response.status_code == 200
    assert len(response.json()) == 349

def test_staff_with_email(app_client):
    response = app_client.get("/api/staff?email=yee.lim@allinone.com.sg")
    assert response.status_code == 200
    assert response.json() == [{'staff_id': 140944, 'staff_fname': 'Yee', 'staff_lname': 'Lim', 'email': 'yee.lim@allinone.com.sg', 'dept': 'Sales', 'country': 'Singapore', 'control_access': 3}]

def test_staff_search(app_client):
    response = app_client.get("/api/staff?name=Derek&staff_id=140944&listing_id=1")
    assert response.status_code == 200
    assert response.json() == [
        {'staff_fname': 'Derek', 'staff_lname': 'Tan', 'dept': 'Sales', 'country': 'Singapore', 'control_access': 3, 'staff_id': 140001, 'link': '/applicantdetail?staff_id=140001'}, 
        {'staff_fname': 'Derek', 'staff_lname': 'Toh', 'dept': 'Engineering', 'country': 'Singapore', 'control_access': 2, 'staff_id': 150423, 'link': '/applicantdetail?staff_id=150423'}, 
        {'staff_fname': 'Derek', 'staff_lname': 'Wong', 'dept': 'Engineering', 'country': 'Singapore', 'control_access': 2, 'staff_id': 150155, 'link': '/applicantdetail?staff_id=150155'}, 
        {'staff_fname': 'Derek', 'staff_lname': 'Chan', 'dept': 'HR', 'country': 'Singapore', 'control_access': 4, 'staff_id': 160118, 'link': '/applicantdetail?staff_id=160118'}, 
        {'staff_fname': 'Alexander', 'staff_lname': 'The', 'dept': 'Engineering', 'country': 'Singapore', 'control_access': 2, 'staff_id': 150095, 'link': '/applicantdetail?staff_id=150095'}
    ]

def test_staff_search_oneself(app_client):
    response = app_client.get("/api/staff?name=Yee Lim&staff_id=140944&listing_id=1")
    assert response.status_code == 200
    assert response.json() == [
        {'staff_fname': 'Yee', 'staff_lname': 'Liu', 'dept': 'Engineering', 'country': 'Singapore', 'control_access': 2, 'staff_id': 151518, 'link': '/applicantdetail?staff_id=151518'}, 
        {'staff_fname': 'Liam', 'staff_lname': 'Teo', 'dept': 'Engineering', 'country': 'Singapore', 'control_access': 2, 'staff_id': 150765, 'link': '/applicantdetail?staff_id=150765'}, 
        {'staff_fname': 'Liam', 'staff_lname': 'The', 'dept': 'Sales', 'country': 'Singapore', 'control_access': 2, 'staff_id': 140108, 'link': '/applicantdetail?staff_id=140108'}, 
        {'staff_fname': 'Oliver', 'staff_lname': 'Lim', 'dept': 'Engineering', 'country': 'Singapore', 'control_access': 2, 'staff_id': 151118, 'link': '/applicantdetail?staff_id=151118'}, 
        {'staff_fname': 'Soma', 'staff_lname': 'Lim', 'dept': 'Engineering', 'country': 'Singapore', 'control_access': 2, 'staff_id': 151465, 'link': '/applicantdetail?staff_id=151465'}
    ]

def test_staff_headhunt(app_client):
    response = app_client.get('/api/staff?is_manager=True&staff_id=140944&listing_id=1')
    assert response.status_code == 200
    assert len(response.json()['data']) == 336
    assert response.json()['unique_dept'] == ['Sales', 'Solutioning', 'Engineering', 'HR', 'Finance', 'Consultancy', 'IT']
    assert response.json()['unique_country'] == ['Singapore', 'Malaysia', 'Indonesia', 'Vietnam', 'Hong Kong']
