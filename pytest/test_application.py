def test_get_application(app_client):
    response = app_client.get("/api/application?application_id=103")
    assert response.status_code == 200
    assert response.json()[0]["staff_id"] == 140736
    assert response.json()[0]["listing_id"] == 1
    assert response.json()[0]["application_reason"] == "Test"
    assert response.json()[0]["application_status"] == "Applied"
    assert response.json()[0]["listing"]["listing_id"] == 1
    assert response.json()[0]["listing"]["role_id"] == 2
    assert response.json()[0]["listing"]["role"]["role_name"] == "Admin Executive"
    assert response.json()[0]["listing"]["role"]["role_department"] == "HR And Admin"


def test_get_application_by_staff_id(app_client):
    response = app_client.get("/api/application?staff_id=140736")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_get_application_by_listing_id(app_client):
    response = app_client.get("/api/application?listing_id=14")
    assert response.status_code == 200
    assert len(response.json()) == 6


def test_get_application_by_staff_id_and_listing_id(app_client):
    response = app_client.get("/api/application?staff_id=150138&listing_id=14")
    assert response.status_code == 200
    assert response.json()[0]["application_id"] == 132
    assert response.json()[0]["staff_id"] == 150138
    assert response.json()[0]["listing_id"] == 14
    assert response.json()[0]["application_status"] == "Applied"
    assert (
        response.json()[0]["application_reason"]
        == "I am interested in this role 4 application"
    )
    assert response.json()[0]["listing"]["role_id"] == 13


def test_create_application(app_client):
    response = app_client.post(
        "/api/application",
        json={
            "staff_id": 140944,
            "listing_id": 1,
            "application_reason": "test_application.py",
        },
    )
    print(response.json()["data"][1][0])
    assert response.status_code == 200
    assert response.json()["data"][1][0]["staff_id"] == 140944
    assert response.json()["data"][1][0]["listing_id"] == 1
    assert response.json()["data"][1][0]["application_status"] == "Applied"
    assert response.json()["data"][1][0]["application_reason"] == "test_application.py"


def test_create_application_with_invalid_staff_id(app_client):
    staff_id = -1
    response = app_client.post(
        "/api/application",
        json={
            "staff_id": staff_id,
            "listing_id": 1,
            "application_reason": "test_application.py",
        },
    )
    print(response.json())
    assert response.status_code == 200
    assert response.json()["error"]["_raw_error"]["code"] == "23503"
    assert (
        response.json()["error"]["details"]
        == f'Key (staff_id)=({staff_id}) is not present in table "staff".'
    )
    assert (
        response.json()["error"]["message"]
        == 'insert or update on table "application" violates foreign key constraint "application_staff_id_fkey"'
    )


def test_create_application_with_invalid_listing_id(app_client):
    listing_id = -1
    response = app_client.post(
        "/api/application",
        json={
            "staff_id": 140944,
            "listing_id": listing_id,
            "application_reason": "test_application.py",
        },
    )
    assert response.status_code == 200
    assert response.json()["error"]["code"] == "23503"
    assert (
        response.json()["error"]["details"]
        == f'Key (listing_id)=({listing_id}) is not present in table "listing".'
    )
    assert (
        response.json()["error"]["message"]
        == 'insert or update on table "application" violates foreign key constraint "application_listing_id_fkey"'
    )


def test_update_application(app_client):
    response = app_client.put(
        "/api/application",
        json={"application_id": 103, "application_status": "Shortlisted"},
    )
    assert response.status_code == 200
    assert response.json()[0]["application_id"] == 103
    assert response.json()[0]["staff_id"] == 140736
    assert response.json()[0]["listing_id"] == 1
    assert response.json()[0]["application_reason"] == "Test"
    assert response.json()[0]["application_status"] == "Shortlisted"


def test_update_application_with_invalid_application_id(app_client):
    application_id = -1
    response = app_client.put(
        "/api/application",
        json={"application_id": application_id, "application_status": "Shortlisted"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == f"Application_id {application_id} is not found"
