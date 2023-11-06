def test_get_all_listing_manager(app_client):
    response = app_client.get("/api/listing_manager")
    assert response.status_code == 200
    assert len(response.json()) == 16

def test_get_listing_manager_by_id(app_client):
    response = app_client.get("/api/listing_manager?manager_id=140944")
    print(response.json())
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json() == [
        {
            'listing_id': 3, 
            'listing': {'listing_id': 3, 'role_id': 14, 'creation_date': '2023-10-17T15:56:54+00:00', 'updated_at': None, 'deleted_at': None, 'application_close_date': '2023-10-17T15:54:11+00:00', 'updated_from': None, 'listing_location': 'Indonesia', 'vacancy': None}
        }, 
        {
            'listing_id': 4, 
            'listing': {'listing_id': 4, 'role_id': 3, 'creation_date': '2023-10-17T16:27:10+00:00', 'updated_at': '2023-10-28T16:17:41+00:00', 'deleted_at': None, 'application_close_date': '2023-12-24T16:00:00+00:00', 'updated_from': None, 'listing_location': 'Vietnam', 'vacancy': 2}
        }
    ]

def test_create_listing_manager(app_client):
    response = app_client.post(
        "/api/listing_manager",
        json={
            "manager_id": 140944,
            "listing_id": 5,
        },
    )

    assert response.status_code == 200
    assert response.json()["success"] == True
    assert response.json()["data"]["manager_id"] == 140944
    assert response.json()["data"]["listing_id"] == 5

def test_create_listing_manager_with_invalid_manager_id(app_client):
    manager_id = -1
    response = app_client.post(
        "/api/listing_manager",
        json={
            "manager_id": manager_id,
            "listing_id": 5,
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