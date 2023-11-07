def test_get_all_listing_manager(app_client):
    response = app_client.get("/api/listing_manager")
    assert response.status_code == 200
    assert len(response.json()) == 11

def test_get_listing_manager_by_id(app_client):
    response = app_client.get("/api/listing_manager?manager_id=140944")
    print(response.json())
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["listing_id"] == 4
    assert response.json()[0]["listing"]["listing_id"] == 4
    assert response.json()[0]["listing"]["role_id"] == 3
    assert response.json()[0]["listing"]["vacancy"] == 2
    assert response.json()[0]["listing"]["listing_location"] == "Vietnam"

def test_create_listing_manager(app_client):
    response = app_client.post(
        "/api/listing_manager",
        json={
            "manager_id": 140103,
            "listing_id": 14,
        },
    )

    assert response.status_code == 200
    assert response.json()["success"] == True
    assert response.json()["data"]["manager_id"] == 140103
    assert response.json()["data"]["listing_id"] == 14

def test_create_listing_manager_with_invalid_manager_id(app_client):
    manager_id = -1
    response = app_client.post(
        "/api/listing_manager",
        json={
            "manager_id": manager_id,
            "listing_id": 14,
        },
    )
    assert response.status_code == 400
    assert response.json()["detail"]["data"]["code"] == '23503'
    assert response.json()["detail"]["data"]["details"] == f'Key (manager_id)=({manager_id}) is not present in table "staff".'
    assert response.json()["detail"]["data"]["message"] == "insert or update on table \"listing_manager\" violates foreign key constraint \"listing_manager_manager_id_fkey\""

def test_create_listing_manager_with_invalid_listing_id(app_client):
    listing_id = -1
    response = app_client.post(
        "/api/listing_manager",
        json={
            "manager_id": 140944,
            "listing_id": listing_id,
        },
    )
    assert response.status_code == 400
    assert response.json()["detail"]["data"]["code"] == '23503'
    assert response.json()["detail"]["data"]["details"] == f'Key (listing_id)=({listing_id}) is not present in table "listing".'
    assert response.json()["detail"]["data"]["message"] == "insert or update on table \"listing_manager\" violates foreign key constraint \"listing_manager_listing_id_fkey\""