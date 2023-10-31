from datetime import datetime
import pytz

def test_get_all_listing(app_client):
    response = app_client.get("/api/listing")
    assert response.status_code == 200
    assert len(response.json()) == 11

def test_get_listing_by_id(app_client):
    response = app_client.get("/api/listing?listing_id=1")
    print(response.json())
    assert response.status_code == 200
    assert len(response.json()) == 1

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