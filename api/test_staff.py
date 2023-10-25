# import json
# from fastapi.testclient import TestClient
# from api.staff import app

# client = TestClient(app)

# def test_get_staff():
#     response = client.get("/api/staff")
#     assert response.status_code == 200
#     assert json.dumps(response.json())

# def test_get_staff_with_params():
#     response = client.get("/api/staff?email=john@example.com&staff_id=123&name=John&isManager=true&listing_id=456&filters={}")
#     assert response.status_code == 200
#     assert isinstance(response.json(), list)

# def test_get_staff_with_invalid_params():
#     response = client.get("/api/staff?invalid_param=123")
#     assert response.status_code == 422
#     assert response.json() == {"detail": [{"loc": ["query", "invalid_param"], "msg": "field required", "type": "value_error.missing"}]}

# def test_get_staff_with_invalid_filter():
#     response = client.get("/api/staff?filters=invalid_json")
#     assert response.status_code == 422
#     assert response.json() == {"detail": [{"loc": ["query", "filters"], "msg": "Invalid JSON", "type": "value_error"}]}
