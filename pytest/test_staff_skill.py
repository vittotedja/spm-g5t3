def test_get_staff_skill(app_client):
    response = app_client.get("/api/staff_skill?staff_id=140944")
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert isinstance(response.json(), list)

def test_get_staff_skill_with_invalid_staff_id(app_client):
    staff_id = -1
    response = app_client.get(f"/api/staff_skill?staff_id={staff_id}")
    print(response.json())
    assert response.status_code == 400
    assert response.json() == {"detail": f"Staff ID {staff_id} is invalid"}