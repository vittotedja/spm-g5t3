def test_get_all_listing(app_client):
    response = app_client.get("/api/listing")
    assert response.status_code == 200
    assert len(response.json()) == 8

def test_get_listing_by_id(app_client):
    response = app_client.get("/api/listing?listing_id=1")
    print(response.json())
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["listing_id"] == 1
    assert response.json()[0]["role_id"] == 2
    assert response.json()[0]["listing_location"] == "Singapore"
    assert response.json()[0]["vacancy"] == 3
    assert response.json()[0]["role"]["role_name"] == "Admin Executive"
    assert response.json()[0]["role"]["role_department"] == "HR And Admin"
    assert len(response.json()[0]["application"]) == 10

def test_create_listing(app_client):
    response = app_client.post(
        "/api/listing",
        json={
            "role_id": 1,
            "listing_location": "Singapore",
            "vacancy": 1,
            "application_close_date": "2030-12-25T00:00:00",
        },
    )
    assert response.status_code == 200
    assert response.json()["data"]["role_id"] == 1
    assert response.json()["data"]["listing_location"] == "Singapore"
    assert response.json()["data"]["vacancy"] == 1
    assert response.json()["data"]["application_close_date"] == "2030-12-25T00:00:00+00:00"

def test_create_listing_with_invalid_role_id(app_client):
    response = app_client.post(
        "/api/listing",
        json={
            "role_id": 999,
            "listing_location": "Singapore",
            "vacancy": 1,
            "application_close_date": "2030-12-25T00:00:00",
        },
    )
    assert response.status_code == 400
    assert response.json()["detail"]["data"]["code"] == "23503"
    assert response.json()["detail"]["data"]["details"] == "Key (role_id)=(999) is not present in table \"role\"."
    assert response.json()["detail"]["data"]["message"] == "insert or update on table \"listing\" violates foreign key constraint \"listing_role_id_fkey\""