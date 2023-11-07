def test_get_application(app_client):
    response = app_client.get("/api/application?application_id=1")
    assert response.status_code == 200
    assert response.json()[0]["staff_id"] == 140015
    assert response.json()[0]["listing_id"] == 2
    assert response.json()[0]["application_reason"] == "Test"
    assert response.json()[0]["application_status"] == "Applied"
    assert response.json()[0]["applied_at"] == "2023-10-17T12:56:58.489861+00:00"
    assert response.json()[0]["updated_at"] == None
    assert response.json()[0]["withdrawn_at"] == None
    assert response.json()[0]["listing"]["listing_id"] == 2
    assert response.json()[0]["listing"]["role"]["role_name"] == "Sales Manager"

def test_create_application(app_client):
    response = app_client.post(
        "/api/application",
        json={
            "staff_id": 140944,
            "listing_id": 1,
            "application_reason": "test_application.py"
        }
    )
    assert response.status_code == 200
    assert response.json()["data"]["staff_id"] == 140944
    assert response.json()["data"]["listing_id"] == 1
    assert response.json()["data"]["application_status"] == "Applied"
    assert response.json()["data"]["application_reason"] == "test_application.py"

def test_create_application_with_invalid_staff_id(app_client):
    staff_id = -1
    response = app_client.post(
        "/api/application",
        json={
            "staff_id": staff_id,
            "listing_id": 1,
            "application_reason": "test_application.py"
        }
    )
    assert response.status_code == 400
    assert response.json()["detail"]["data"]["code"] == '23503'
    assert response.json()["detail"]["data"]["details"] == f'Key (staff_id)=({staff_id}) is not present in table "staff".'
    assert response.json()["detail"]["data"]["message"] == "insert or update on table \"application\" violates foreign key constraint \"application_staff_id_fkey\""

def test_create_application_with_invalid_listing_id(app_client):
    listing_id = -1
    response = app_client.post(
        "/api/application",
        json={
            "staff_id": 140944,
            "listing_id": listing_id,
            "application_reason": "test_application.py"
        }
    )
    assert response.status_code == 400
    assert response.json()["detail"]["data"]["code"] == '23503'
    assert response.json()["detail"]["data"]["details"] == f'Key (listing_id)=({listing_id}) is not present in table "listing".'
    assert response.json()["detail"]["data"]["message"] == "insert or update on table \"application\" violates foreign key constraint \"application_listing_id_fkey\""

def test_update_application(app_client):
    response = app_client.put(
        "/api/application",
        json={
            "application_id": 1,
            "application_status": "Shortlisted"
        }
    )
    assert response.status_code == 200
    assert response.json()[0]["application_id"] == 1
    assert response.json()[0]["staff_id"] == 140015
    assert response.json()[0]["listing_id"] == 2
    assert response.json()[0]["application_reason"] == "Test"
    assert response.json()[0]["application_status"] == "Shortlisted"
    assert response.json()[0]["applied_at"] == "2023-10-17T12:56:58.489861+00:00"

def test_update_application_with_invalid_application_id(app_client):
    application_id = -1
    response = app_client.put(
        "/api/application",
        json={
            "application_id": application_id,
            "application_status": "Shortlisted"
        }
    )
    assert response.status_code == 400
