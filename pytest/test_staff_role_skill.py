def test_get_match(app_client):
    response = app_client.get("/api/staff_role_skill?staff_id=140736&role_id=1")
    assert response.status_code == 200
    assert round(response.json()["match_percentage"], 3) == 38.462
    assert isinstance(response.json()["skill"], list)

def test_get_no_match(app_client):
    response = app_client.get("/api/staff_role_skill?staff_id=140944&role_id=8")
    assert response.status_code == 200
    assert response.json()["match_percentage"] == 0
    assert isinstance(response.json()["skill"], list)

def test_get_skills_of_role(app_client):
    response = app_client.get("/api/staff_role_skill?role_id=1")
    assert response.status_code == 200
    assert len(response.json()) == 13
    assert isinstance(response.json(), list)

def test_get_skills_of_invalid_role(app_client):
    response = app_client.get("/api/staff_role_skill?role_id=-1")
    assert response.status_code == 400
    assert response.json()["detail"] == "Role ID -1 is invalid"

def test_get_all_role_skill(app_client):
    response = app_client.get("/api/staff_role_skill")
    assert response.status_code == 200
    assert len(response.json()) == 246
    assert isinstance(response.json(), list)