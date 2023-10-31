def test_get_skill(app_client):
    response = app_client.get("/api/skill")
    assert response.status_code == 200
    assert len(response.json()) == 81
    assert isinstance(response.json(), list)

def test_get_skill_with_id(app_client):
    response = app_client.get("/api/skill?skill_id=1")
    assert response.status_code == 200
    assert response.json()[0]['skill_id'] == 1
    assert response.json()[0]['skill_name'] == 'Account Management'
    assert response.json()[0]['skill_desc'] == "Manage, maintain and grow the sales and relationships with a specific customer or set of accounts. This includes in-depth customer engagement, relationship-building and provision of quality solutions and service to address customers' needs efficiently and generate revenue."

def test_get_skill_with_invalid_id(app_client):
    response = app_client.get("/api/skill?skill_id=9999")
    assert response.status_code == 404
    assert response.json() == {"detail": "Skill not found with the provided skill_id."}